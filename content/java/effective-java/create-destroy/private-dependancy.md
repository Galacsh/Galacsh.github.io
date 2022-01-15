---
date: 2021-08-01 15:33:00
title: "Private 생성자와 의존성 주입"
publish: true
tags: ["Java", "Effective Java"]
---

# Private 생성자

> 유틸리티 클래스는 오해를 부르지 않도록 private 생성자를 만들자.

개발을 하다보면 때때로 단순히 정적 메소드나 정적 필드들을 묶어놓는 클래스를 구현할 때가 있다.
예를 들면, `java▶ java.util.Collections` 클래스 같은 것을 구현해야 할 때가 있다.

이러한 클래스들은 객체화 될 필요가 없기에 사용하는 입장에서 생성자를 만들 수 없도록 하는 게 바람직할 것이다.
Java는 따로 아무 생성자가 없는 경우 기본 생성자를 알아서 만들어주기 때문에,
이런 경우에는 사용자가 직접 생성자에 접근하는 일이 없도록 private 생성자를 별도로 구현해두는 것이 좋다.

```java
public class MyUtility {
    private MyUtility() {}

    // ...
}
```

또한 private 생성자를 둠으로써 다른 클래스에서 이 클래스를 확장하지 못하게 하는 역할도 한다.

# 의존 객체 주입

> 사용되는 자원에 따라 동작이 달라지는 클래스를 싱글톤이나 정적 유틸리티 클래스로 구현하는 것은 적절하지 않다.
> 자원 자체를 생성자에 매개변수로 넘겨주는 것이 좋다.

위에서 말한 그대로, 클래스 내에서 사용되는 자원에 따라 동작이 달라지는 경우에는 생성자에 자원 객체 자체를 넘기거나
해당 자원을 생성할 수 있는 팩토리 객체를 넘기면 좋다. 이렇게 함으로써 **유연성**, **재사용성**이 증가하며 좀 더 **용이한 테스트**가
가능하도록 한다.

```java
public class SmartPhone {
    private OperationSystem os;

    public SmartPhone(Supplier<? extends OperationSystem> osFactory) {
        this.os = osFactory.get();
    }

    // ...
}
```
