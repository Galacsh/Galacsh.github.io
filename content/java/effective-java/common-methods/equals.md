---
date: 2021-08-09 17:42:00
title: "equals() 오버라이딩"
publish: true
tags: ["Java", "Effective Java"]
---

**Object** 클래스는 객체를 생성할 수 있는 구체적인 클래스이지만, 기본적으로 확장을 위해 설계되었다.

즉, Object의 모든 **nonfinal** 메소드(**equals, hashCode, toString, clone, finalize**)는 오버라이딩을 위해
설계 되었으므로 각 규칙에 맞게 작성해야 한다.

# 오버라이딩 해야하는 경우

> 동일한 객체인 것이 중요한 게 아니라, 동일한 값을 가져 **논리적으로 동일함을 판별해야 하는 클래스**들은 equals 오버라이딩이 필요하다.
> 참고로, equals를 구현하는 것은 **map에서 key 역할**이나 **set의 원소 역할**을 할 때도 중요하다.

**equals** 메소드를 오버라이딩 하는 것은 언뜻 쉬워보일 수 있으나, 잘못 구현하여 끔찍한 결과를 만들 때도 많다.
이런 오류를 피하는 가장 손쉬운 방법은 **오버라이딩 하지 않는 것이다.** 오버라이딩 하지 않으면
객체 자신에 대해서만 동일하다고 판별하기 때문이다.

물론 이것은 다음과 같은 경우 중 하나라도 해당될 때의 얘기이다.

- 각 객체는 유일해야 한다.
- 논리적으로 동일함을 테스트할 필요 없다.
- 상위 클래스가 이미 equals를 오버라이딩 했고, 그것이 이 객체에도 적합하다.
- 클래스가 **private** 이거나 **package-private**이고, equals 메소드가 절대 쓰일 일 없다.

즉 반대로 말하면, 클래스가 논리적으로 동일함을 판별해야 하고, 부모 클래스가 이미 equals를 오버라이딩 하지 않은 경우에는
오버라이딩 하는 것이 적합하다. 일반적으로 **값의 역할**을 하는 클래스들을 생각하면 된다.

# 만족해야 할 성질들

> **Reflexive(반사성)** : null이 아닌 참조 값에 대해서 x.equals(x)는 참을 반환해야 함  
> **Symmetric(대칭성)** : null이 아닌 참조 값들에 대해, x.equals(y) == y.equals(x)  
> **Transitive(추이성)** : null이 아닌 참조 값들에 대해, x.equals(y) && y.equals(z) && x.equals(z) == true  
> **Consistency(일관성)** : null이 아닌 참조 값들에 대해 x.equals(y)는 꾸준히 같은 값을 반환해야 함  
> **x.equals(null)은 항상 False**

## Reflexive (반사성)

> **x.equals(y) == true**

반사성이 없는 경우에 equals 메소드는 대표적으로 다음과 같은 문제가 있다.
List 등의 클래스에서 `java▶ list.contains(x)` 같은 함수는 내부적으로 equals 메소드를 호출하여 동일한 객체가 있는지 판단한다.
따라서 반사성이 없는 경우에는 동일한 객체가 List에 있음에도 없다고 판단되는 경우가 생긴다.

## Symmetric (대칭성)

> **x.equals(y) == y.equals(x)**

예를 들어, null이 아닌 참조 값 x, y에 대해서 x.equals(y) == false 이고 y.equals(x) == true 인 경우를 생각해보자.
List에는 y만 있음에도 list.contains(x) 는 x가 List에 있다고 판단할 것이다.

## Transitive (추이성)

> **x.equals(y) == y.equals(z) == true, x.equals(z) == true**

추이성의 경우 사실 당연하게 생각되는 성질이다. 하지만 상속 받은 클래스에서 값이 추가된다면 문제가 발생한다.
적절한 예는 아니지만, SetScore 클래스와 해당 클래스를 상속받아 구현한 Score가 있다고 하자.

```java
public class SetScore {
  int value = 0;

  public SetScore(int value) {
      this.value = value;
  }

  @Override
  public boolean equals(Object o) {
    if(o instanceof SetScore && ((SetScore) o).value == this.value)
      return true;
    else return false;
  }
}

public class Score extends SetScore {
  int set = 0;

  public Score(int set, int value) {
    super(value);
    this.set = set;
  }
}
```

위와 같이 부모 클래스의 equals를 이용하면 아래의 set1, set2, set3는 모두 같다.

```java
Score set1 = new Score(1, 7);
Score set2 = new Score(2, 7);
Score set3 = new Score(3, 7);
```

하지만, 경기 1 세트의 점수와 2 세트의 점수가 같다고 해서 그것이 같은 것은 아닐 것이다.
그렇다고 해서 상속 받은 클래스에서 equals() 메소드를 오버라이딩 하면 Symmetric(대칭성) 문제가 생긴다.

```java
public class Score extends SetScore {
  int set = 0;

  public Score(int set, int value) {
    super(value);
    this.set = set;
  }

  @Override
  public boolean equals(Object o) {
    if( ! (o instanceof Score)) return false;

    return super.equals(o) && ((Score) o).set == set;
  }
}
```

위와 같이 구현했을 때는 set1, set2, set3 모두 구분될 것이다.
하지만 대칭성에 문제가 생긴다는 것은 위 상황에서 다음과 같은 상황이 생긴다는 것이다.

```java
Score set1 = new Score(1, 7);
SetScore setScore1 = new SetScore(7);

setScore1.equals(set1) != set1.equals(setScore1);
```

물론 부모 클래스와의 비교 시에는 예외를 두는 방법이 있을 것이다.
하지만 이는 결과적으로 Transitive 성질을 만족하지 못한다.

```java
Score set1 = new Score(1, 7);
SetScore setScore1 = new SetScore(7);
Score set2 = new Score(2, 7);

System.out.println(setScore1.equals(set1)); // true
System.out.println(set1.equals(setScore1)); // true, Symmetric
System.out.println(set1.equals(set2)); // false, Not Transitive
```

이런 상황을 만족스럽게 해결하는 방법은 딱히 없지만, 그나마 괜찮은 방법은 상속하는 형태가 아닌
Composition 형태를 취하는 것이다.

위 상황이라면, Score가 SetNumber 객체와 SetScore 객체를 모두 구성하고 equals를 구현하는 것이다.

## Consistency (일관성)

> 항상 같은 값을 반환

null이 아닌 참조 값 x, y에 대해 x.equals(y)는 항상 같은 값을 반환해야 하는 이 성질은,
신뢰할 수 없는 자원을 이용하여 equals를 구현하지 말라는 말로도 이어진다.
신뢰할 수 없는 자원은 항상 같은 값을 반환하리라는 보장이 없기 때문이다.

라이브러리 중에서도 `java▶ java.net.URL`은 이 일관성이 깨져있는데, 이 클래스는 equals 메소드 안에서 네트워크에 접근한다.
다만 호환성 문제로 고치지 못하고 있다고 한다.

## x.equals(null) == false

모든 equals 메소드는 null에 대해 false를 반환해야 한다.
하지만 굳이 null 체크를 하기 보다는 instanceof 연산자를 통해 처리하자.

`java▶ instanceof` 연산자는 첫번째 피연산자가 null인 경우 false를 반환하는 성질을 가지고 있기도 하며
**ClassCastException**도 방지할 수 있다는 장점이 있다.
