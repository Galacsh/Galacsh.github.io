---
date: 2021-07-21 20:00:00
title: "정적 팩토리 메소드"
publish: true
tags: ["Java", "Effective Java"]
---

# 생성자보다는 정적 팩토리 메소드

> - 정적 팩토리 메소드(Static Factory Method) - 해당 클래스의 객체를 반환하는 정적 메소드
> - 디자인 패턴에서 이야기하는 팩토리 패턴을 이야기하는 것은 아님

생성자 **대신** 정적 팩토리 메소드를 통해 객체를 생성하는 것은 장점과 단점이 있다.

‎

## 장점

1. **이름이 있다.**

첫번째 장점으로는, 생성자와 달리 **이름**이 있다는 것이다.
생성자는 매개변수만으로 어떤 객체가 만들어지는지 표현해야 하지만, 정적 메소드는 메소드 이름으로 어떤 객체가 반환되는지 표현할 수 있다.
또 같은 매개변수를 이용하더라도 다른 객체를 만들 수 있고 확실히 다르게 표현할 수 있다.

‎

2. **매번 새 객체를 만들지 않아도 될 때 유용하다.**

같은 객체를 여러 번 만들지 않고 만들어둔 것을 캐시해두고 사용할 수 있다.
대표적으로 `java@Boolean.valueOf(boolean)`가 이런 방식을 사용하며 새 객체를 만들지 않는다.
즉, 동일한 객체가 여러번 요청되고 생성하기에는 무거운 객체에 유용하다.

‎

3. **생성자와 달리 서브 타입을 반환할 수 있다.**

생성자와 달리 서브 타입을 반환할 수 있어, 컴팩트한 API를 만들 수 있다.
또한 명확한 메소드 명으로 개발자들은 추가적인 문서 없이도 클래스를 이용할 수 있다.
`java@java.util.Collections` 클래스는 이러한 방식으로
여러 컬렉션들을 제공하는 45가지 유틸리티 정적 메소드를 구현하였다.

```java
// java.util.Collections 일부
public static <T> void fill(List<? super T> list, T obj) {
    int size = list.size();

    if (size < FILL_THRESHOLD || list instanceof RandomAccess) {
        for (int i=0; i<size; i++)
            list.set(i, obj);
    } else {
        ListIterator<? super T> itr = list.listIterator();
        for (int i=0; i<size; i++) {
            itr.next();
            itr.set(obj);
        }
    }
}
```

‎

4. **반환되는 객체가 호출될 때 마다 달라질 수 있다.**

정적 메소드의 파라미터에 따라 적합한 객체를 반환해 줄 수 있는 장점이 있다.
열거형(Enum)의 집합, `java@EnumSet` 클래스는 매개변수로 주어진 `java@Enum`의 요소 개수에 따라
서브 클래스인 `java@ RegularEnumSet` 또는 `java@ JumboEnumSet`을 반환한다.
클래스의 사용자 입장에서는 내부적으로 Regular 인지 Jumbo인지 몰라도 되며 각 객체를 알맞게 생성해준다.

```java
public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
    Enum<?>[] universe = getUniverse(elementType);
    if (universe == null)
        throw new ClassCastException(elementType + " not an enum");

    if (universe.length <= 64)
        return new RegularEnumSet<>(elementType, universe);
    else
        return new JumboEnumSet<>(elementType, universe);
}
```

‎

5. **정적 메소드를 작성하는 시점에는 반환되는 클래스가 구현되지 않아도 된다.**

정적 메소드에서 **인터페이스를 반환**하는 방법으로,
해당 인터페이스가 구현되어 있지 않더라도 메소드를 구현할 수 있다.
대표적으로 JDBC API는 각 제공자가 데이터베이스에 맞게 서비스를 구현하여 제공하여,
사용자는 해당 구현체를 등록하여 사용하기만 된다.

```java
public interface PreparedStatement {
  int executeUpdate();
  // ...
}

public interface Connection {
  void close();
  PreparedStatement prepareStatement(String sql);
  // ...
}

public interface Driver {
  Connection connect(String url);

  // ...
}

/**
 * 드라이버 객체를 등록하고, 연결할 수 있는 드라이버 관리자
 */
public class DriverManager {
  private Driver driver;

  private DriverManager() {}

  public static void registerDriver(Driver driver) {
    this.driver = driver;
  }

  public static Connection getConnection(String url, int port) {
    return this.driver.connect(url, port);
  }

  // ...
}
```

‎

## 단점

1. **서브 클래스로 이용될 수 없다.**

`java@ public` 또는 `java@ protected` 생성자가 없는 클래스는 서브 클래스로 사용될 수 없다.
예를 들어, Collections 클래스는 다른 클래스에서 상속 받을 수 없다.

‎

2. **개발자 입장에서 어떻게 초기화 할지 알기 어렵다.**

말그대로, 생성자와 달리 API 문서에서도 어떤 것이 객체를 초기화하는 함수인지
알기 어려울 것이다. 대신, 관습적으로 쓰이는 함수 명명 규칙이 있으므로 익혀보자.

> - **from**
> - **of**
> - **valueOf**
> - **getInstance** or **instance**
> - **create** or **newInstance**
> - **getType** (ex, getConnection)
> - **newType** (ex, newConnection)
> - **type** (ex, connection)
