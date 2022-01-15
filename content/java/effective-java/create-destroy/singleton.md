---
date: 2021-07-31 18:20:00
title: "싱글톤 (Singleton)"
publish: true
tags: ["Java", "Effective Java"]
---

> 단 하나의 객체만 생성되는 클래스, **싱글톤 (Singleton)**

하나의 객체만 생성되는 특성이 있는 싱글톤 패턴, 왜 사용할까?

1. 별로 달라질 것도 없는 객체를 여러번 생성할 일이 많을 때
2. 같은 객체를 여러 클래스에서 공유해야 할 때

즉, 전역 인스턴스 역할을 하여 **데이터 공유**를 할 때 사용할 수도 있으며,
하나의 객체로 일들을 처리하므로 **메모리가 관리**가 되는 장점이 있다.
첫 객체 생성 시점에는 어쩔 수 없지만, 두번째부터는 객체 생성을 하지 않으므로 **객체 생성 시간 단축**의 장점도 있을 것이다.

물론 잘못 구현하는 경우 멀티 스레드 환경에서 여러 객체가 생기는 동시성(Concurrency) 문제나,
클래스 간의 결합도가 높아지는 문제가 있을 수 있다.

# 싱글톤 구현 방법

이러한 싱글톤 구현 방법에는 여러가지가 있다.
여러 싱글톤 구현 방법을 알아보고 가장 접합한 것을 찾아보자.

## 1. Eager Initialization

> 가장 쉬운 싱글톤 구현 방법

```java
public class Singleton {
  private static Singleton instance = new Singleton();

  private Singleton() {}

  public static Singleton getInstance() {
    return instance;
  }
}
```

- **장점**

  - 구현이 쉽다.
  - 클래스 로더에 의해 클래스가 로딩될 때 객체가 생성되어, Thread-Safe

- **단점**
  - 사용하지 않아도 생성되어 불필요한 객체 생성 시간 소요
  - 사용하지 않아도 생성되어 메모리 낭비
  - 예외 처리(Exception Handling) 불가

## 2. Lazy Initialization

> 객체를 필요할 때 생성

```java
public class Singleton {
  private static Singleton instance;

  private Singleton() {}

  public static Singleton getInstance() {
    if(instance == null) {
      instance = new Singleton();
    }
    return instance;
  }
}
```

- **장점**

  - 사용할 때 생성되므로 불필요한 객체 생성 시간 및 메모리 낭비가 없음
  - 예외 처리를 할 수 있음

- **단점**
  - 멀티 스레드 상황에서 동시에 `if` 블럭에 접근하는 경우 여러 객체가 생성될 수 있음

### 2.1. Synchronized

> **Lazy Initiaiization**은 여러 객체가 생성될 수 있다는 단점이 있었다.
> 이를 **synchronized** 지정어를 통해 해결하였다.

```java
public class Singleton {
  private static Singleton instance;

  private Singleton() {}

  // synchronized method
  public static synchronized Singleton getInstance() {
    if(instance == null) {
      instance = new Singleton();
    }
    return instance;
  }
}
```

- **장점**

  - 사용할 때 생성되므로 불필요한 객체 생성 시간 및 메모리 낭비가 없음
  - 예외 처리를 할 수 있음
  - Thread-Safe

- **단점**
  - 멀티 스레드 환경에서 여러 스레드들이 동시에 접근할 수 없으므로 기다리게 되면서 성능 하락

### 2.2. Double checked Locking

> **synchronized** 블럭을 덜 지나도록 하여, 성능 하락을 줄임

```java
public class Singleton {
  // volatile
  private volatile static Singleton instance;

  private Singleton() {}

  public static Singleton getInstance() {
    // 1st check
    if(instance == null) {
      synchronized (Singleton.class) {
        // 2nd check
        if(instance == null) {
          instance = new Singleton();
        }
      }
    }
    return instance;
  }
}
```

위 **2.1. Synchronized**에서의 문제는 `java▶ getInstance()` 호출 시
**synchronized** 블럭을 매번 지나는 바람에 성능 하락 이슈가 있었다.

그에 반해 이 방법은, 객체가 생성되기 전 여러 스레드가 동시에 접근하는 바람에
**instance**가 **null**인 경우에만 **synchronized** 하게 다시 한 번 검사하도록 한다.

- **장점**

  - 사용할 때 생성되므로 불필요한 객체 생성 시간 및 메모리 낭비가 없음
  - 예외 처리를 할 수 있음
  - Thread-Safe
  - 성능 하락을 줄임

- **단점**
  - 결국 첫 객체 생성 시에는 여러 스레드가 접근 시 성능 하락이 있을 수 있음

위 코드 내에는 **volatile** 키워드가 있는데, 이는 변수를 Main Memory에 저장하겠다는 것을 의미한다.
**volatile**이 없다면 성능 향상을 위해 CPU Cache에 저장하여 스레드 별로 값을 저장하게 되어, 위와 같은 상황에서
문제가 발생할 수 있다. 따라서 **volatile + synchronized**를 조합하여 동시성 문제를 해결한 것이다.

### 2.3. Holder ✨

> 가장 좋은 방식으로 보이는 싱글톤 구현 방법

```java
public class Singleton {
    private Singleton() {}

    private static class LazyLoaded {
        // 클래스 로딩 시 생성됨
        private static final Singleton instance = new Singleton();
    }

    public static Singleton getInstance() {
        return LazyLoaded.instance;
    }
}
```

코드만 보면, **1. Eager Initialization**과 유사하다. 다만 내부 클래스에서 인스턴스를 생성한다.
클래스 로더가 초기화를 진행할 때는 내부 클래스를 초기화하지 않기에 Lazy Loading 효과를 가지며,
클래스 로딩 시 생성되어 Thread-Safe한 특성을 가진다고 한다.

## With Enum

> **Enum**(열거형)을 이용한 싱글톤 구현으로, **Effective Java**에서는
> 이 방식이 대부분의 상황에서 가장 적합한 방법으로 소개하고 있다.

```java
public enum Singleton {
  INSTANCE;
}
```

- **장점**

  - 이미 **Serializable**
  - 리플렉션을 통한 객체 추가 생성 방지

- **단점**
  - Enum 외의 클래스 상속 불가
