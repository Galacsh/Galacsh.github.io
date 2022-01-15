---
date: 2021-08-02 19:37:00
title: "메모리 관련 개선"
publish: true
tags: ["Java", "Effective Java"]
---

# 불필요한 객체 생성 피하기

> 불필요하게 객체를 생성하지 말고, 자주 사용될 것 같으면 **캐싱** 처리하자.
> 또한, **오토박싱**에 과정에서도 성능 하락이 생기므로 주의해야 한다.

불필요한 객체 생성이란, 다음과 같은 것을 말한다.

```java
String hello = new String("Hello");
```

**"Hello"** 문자열 자체는 이미 인스턴스이다.
즉, 위 코드는 이 객체를 이용해 새로운 문자열을 생성하므로 불필요하게 객체를 생성한다.

특히 어떤 클래스들은 객체 생성의 비용이 크다. 이런 객체들은 캐시를 해두고 사용하는 것이 나은데,
예를 들면 `java▶ String.matches(...)` 함수는 내부적으로 **Pattern** 객체를 생성하여 처리하므로
자주 사용 될 **Pattern** 객체를 생성하여 정규식을 컴파일 해두고 사용하는 것이 좋다.

```java
public class Precompile {
  private static final Pattern PRECOMPILED = Pattern.compile("^[0-9]{0,3}$");

  static boolean matchesPattern(String s) {
    return PRECOMPILED.matcher(s).matches();
  }
}
```

또한, **오토박싱** 기능도 성능 하락의 원인이 된다. 기본(Primitive) 타입과 참조(Reference) 타입 간
상호 변환을 도와주는 기능인 오토박싱은 사용하는 개발자 입장에서는 편하게 해주는 기능이지만,
다음과 같은 상황에서 오토박싱이 이루어지는 시간 및 객체 생성으로 인한 성능 하락이 있을 수 있다.

```java
private static long sum() {
  Long sum = 0L; // !
  for (long i = 0; i <= Integer.MAX_VALUE; i++)
    sum += i;
  return sum;
}
```

위 상황은 정말 단순이 더하는 기능이지만 **Long ↔ long** 오토박싱으로 인한
2^31개의 **Long** 객체 생성이 이루어지며 성능 하락을 이끈다.

---

# 쓸모 없어진 객체 참조 제거

> GC는 만능이 아니다. GC가 있더라도 메모리 관리에 신경 써야한다.
> 적절히 **null** 처리를 하여 참조 관계를 풀어주자.

직접 메모리를 관리하던 C & C++ 개발을 하다가 Java를 접하게 되면,
메모리를 알아서 관리해주는 Garbage Collector 덕에 메모리를 직접 관리할 필요가 없다고 생각할 지 모른다.

하지만, 신경은 써야 한다.
다음곽 같은 개발자가 직접 구현한 스택이 있다고 해보자.

```java
public class Stack {
  private Object[] elements;
  // ...

  public void push(Object e) {
    ensureCapacity();
    elements[size++] = e;
  }

  // ==================================
  public Object pop() {
    if (size == 0)
      throw new EmptyStackException();
    return elements[--size];
  }
  // ==================================

  private void ensureCapacity() {
    if (elements.length == size)
      elements = Arrays.copyOf(elements, 2 * size + 1);
  }
}
```

사실 코드만 언뜻 봐서는 문제가 없는 코드로 보인다.
하지만 `java▶ stack.pop()` 메소드를 실행한다고 하였을 때를 생각해보자.

단순히 사이즈를 줄여 **pop** 처리를 하고 있는데, 이는 사실 `java▶ Object[] elements`에
**pop** 된 객체에 대한 참조가 남아있게 된다. 더 이상 참조되지 않으므로 GC 되어야 할 객체들이
지워지지 않고 남아있게 된다는 것이다.

따라서 이런 쓸모 없어진 객체들이 관련 작업들에 쓰인 후 후 처리 될 수 있도록
**참조**에 **null** 처리를 해주어야 한다.

```java
public Object pop() {
  if (size == 0)
    throw new EmptyStackException();
  Object result = elements[--size];
  elements[size] = null; // 쓸모 없어진 객체 참조에 대해 null 처리를 해준다.
}
```

이런 문제는 캐시 처리를 할 때도 자주 발생한다. 따라서 **캐시 처리를 할 때도 주의하자.**
캐시에 넣어둔 것을 잊고 오래 방치하는 경우가 이에 해당한다.

따라서 `java▶ LinkedHashMap.removeEldestEntry()`, `java▶ java.lang.ref`를 이용하거나
`java▶ ScheduledThreadPoolExecutor`를 이용하여 캐시 해제를 하는 방법을 고려하자.

마지막으로, **리스너**와 **콜백** 처리를 함에도 주의해야 한다.
사용자가 콜백을 등록한 후 등록 해제를 해주어야 하지만, 하지 않는 경우에 이는 누적될 것이기 때문이다.

---

# Finalizer, Cleaner 사용 지양

> 객체가 GC에 의해 힙에서 제거될 때, 객체의 **finalize()** 함수가 호출된다.
> Java 9에서는 **finalize()** 메소드가 deprecated 되었고, GC에 의해 제거되기 적합한
> 객체가 생기면 통보받는 **Cleaner** 클래스가 생겼다.

## Finalizer

> 소멸자는 예측 불가하며, 때로 위험하며, 보통 불필요하다.

```java
public class TextReader {
  private BufferedReader reader;

  public TextReader() {
    try {
      FileReader fileReader = new FileReader("hello.txt");
      reader = new BufferedReader(fileReader);
    } catch(IOException e) {
      e.printStackTrace();
    }
  }

  public String readLine() {
    return this.reader.readLine();
  }

  // 소멸자
  @Override
  protected void finalize() {
    try {
      reader.close();
    } catch (IOException e) {
      // ...
    }
  }
}
```

## Cleaner

> 소멸자보다는 덜 위험하지만, 여전히 예측 불가하며 느리고, 보통 불필요하다.

```java
public class TextReader implements AutoCloseable {
  private static final Cleaner Cleaner = ...;
  private final Cleaer.Cleanable cleanable;

  private BufferedReader reader;

  public TextReader() {
    try {
      FileReader fileReader = new FileReader("hello.txt");
      this.reader = new BufferedReader(fileReader);

      this.cleanable = Cleaner.register(this, new State(this.reader));
    } catch(IOException e) {
      e.printStackTrace();
    }
  }

  public String readLine() {
    return this.reader.readLine();
  }

  @Override
  public void close() {
    cleanable.clean();
  }

  // cleaning state and action
  private static class State implements Runnable {
    private BufferedReader readerToClose;

    State(BufferedReader readerToClose) {
      this.readerToClose = readerToClose;
    }

    @Override
    public void run() {
      this.readerToClose.close();
    }
  }
}
```

## 종합 문제점들

> 1. 즉각적으로 실행되리란 보장이 없다.
> 2. 반드시 실행되는 것도 아니다.
> 3. Finalizer는 Cleaner에 비해 느리다.
> 4. Finalizer는 심각한 보안 문제가 있다.

**1. 즉각적으로 실행되리란 보장이 없다.**

Finalizer와 Cleaner의 호출 시점은 GC의 알고리즘에 따라 달라진다.
따라서 개발하던 JVM 버전에서는 원하는대로 동작하더라도, 운영되는 JVM 버전이 다르다면 다르게 동작할 수 있다.
때때로 finalize가 뒤늦게 이루어져 OutOfMemoryException이 발생할 수 있다.

**2. 반드시 실행되는 것도 아니다.**

소멸 도중 예외가 발생하는 경우에 해당 소멸 과정은 종료되며 해당 예외가 표시되지 않는다는 문제점도 있다.
소멸자가 아닌 곳에서는 예외에 관해서 출력이라도 되지만 소멸자에서 발생한 예외는 출력도 되지 않는다고 한다.

**3. Finalizer는 Cleaner에 비해 느리다.**

Finalizer는 Cleaner에 비해 50배 정도 느리다고 한다.
그렇다고 해서, Cleaner가 빠르다는 것은 아니다.
모든 객체를 정리하는데 Cleaner를 사용하게 된다면, Finalizer와 속도면에서 큰 차이가 없다.

**4. Finalizer는 심각한 보안 문제가 있다.**

다음과 같이 공격하려는 클래스에서 **finalize()** 메소드를 통해 GC를 방지하고,
객체가 남아있게 한 후 예외가 발생한 Security 객체를 계속 이용하는 것을 볼 수 있다.

```java
public class Security {
  boolean isOkay = false;

  Security(String token) {
    if ( ! isTokenValid(token)) {
      throw new IllegalArgumentException("Token is not valid");
    }
    this.isOkay = true;
  }

  private boolean isTokenValid(String token) {
    if(token == null) return false;
    else return true;
  }
}

public class Attacker extends Security {
  static Security security;

  public Attacker(String token) {
    super(token);
  }

  // GC를 방지한다.
  public void finalize() {
    this.security = this;
  }

  public static void main(String[] args) {
    try {
      security = new Attacker(null);
    } catch (Exception e) {
      System.out.println(e);
    }

    System.gc();
    System.runFinalization();

    if (security != null) {
      System.out.println("But not removed >> " + security);
      security.isOkay = true;
      System.out.println("Can proceed next ? >> " + security.isOkay);
    }
  }
}
```

위와 같이 서브 클래스에서 **finalize()** 메소드를 호출할 수 없도록 **final finalize()** 메소드를 구현해두는 것이다.

## 그럼에도

사용하는 입장에서 close() 호출을 하지 않을 수 있으므로 이를 대비하여 **Finalizer 또는 Cleaner를 안전망 목적으로** 사용하면 좋을 것이다.
자원을 회수하지 않는 것 보다는 회수하는 것이 낫기 때문이다. 하지만 위에서 언급한 문제점들이 있으므로 그럴만한 가치가 있는지 충분히 고민 후 사용하자.

다만, **네이티브 피어(Native peer)** 객체들에 대해서는 처리해주자. 네이티브 피어란 JFrame과 같은 특정 플랫폼에 종속적인 객체들을 말한다.
이런 객체들은 GC가 인지하지 못하므로 잘 처리해주어야 한다. JFrame의 경우 GC가 처리하지 못하므로 dispose()를 꼭 해주는 것을 생각하면 된다.

---

# try-finally 보다는 try-with-resources

> 자바 7 부터는 대부분의 자바 라이브러리들이 **AutoCloseable**을 구현(implements, extends) 하므로
> **try-with-resources** 방식을 택하자

많은 자바 라이브러리들은 사용자가 수동으로 close() 해주어야 한다. (InputStream, OutputStream, java.sql.Connection 등)
대부분 안정 장치로 소멸자를 구현해두지만 앞서 언급했듯이 소멸자가 항상 실행되리란 보장은 없다.

따라서 기존에는 try-finally 과정에서 close()를 해주었는데,
이 try-finally가 중첩되다 보면 코드는 이해하기 어려워지고 디버깅도 어려워진다. (여러 예외가 발생했을 때 예외가 덮이는 경우)

자바 7 부터는 try-with-resources 구문이 추가되어 이를 간략하게 표현하고 디버깅도 용이하게 해주었다.
다만, 해당 구문에 쓰일 라이브러리와 사용하는 클래스 모두 **AutoCloseable 클래스를 구현해야 한다.**

이펙티브 자바에서는 다음과 같은 코드를 소개했다.

```java
static void copy(String src, String dst) throws IOException {
  try (InputStream in = new FileInputStream(src);
    OutputStream out = new FileOutputStream(dst)) {
      byte[] buf = new byte[BUFFER_SIZE];
      int n;
      while ((n = in.read(buf)) >= 0)
        out.write(buf, 0, n);
  }
}
```
