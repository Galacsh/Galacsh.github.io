---
date: 2021-07-30 19:46:00
title: "빌더 (Builder)"
publish: true
tags: ["Java", "Effective Java"]
---

# 개요

> 생성자의 매개변수가 너무 많은 경우, Builder를 고려하라.

정적 팩토리 메소드나, 생성자나 **모두 매개변수가 많은 경우에 불편하다**.
특히 필수 필드와 많은 선택적인 필드가 있다고 가정하면 각 경우에 대한 생성자 또는 정적 팩토리 메소드를
작성하는 것도 일이지만, 사용하는 입장에서도 그 많은 매개변수를 위치에 맞춰 호출하는 것도 일이다.

대신에 기본 생성자와 필드별 Setter 함수를 만들어 이용(JavaBeans 패턴이라고 하는 모양)하는 방법도 있지만,
이는 여러번 나누어 호출하며 필드 값을 설정하다 보니 생성 중인 객체가 일관되지 않을 수 있다.
또한 불변 클래스로 만드는 것을 막아 개발자 입장에서 Thread safe 한 개발을 하기 어렵다.

**이런 경우에 좋은 것이 Builder 패턴이다.**

# Builder 패턴

Builder는 정적 멤버 클래스로 생각하면 된다.
클래스 자체의 생성자는 직접 호출할 수 없게 하고, 정적 멤버 클래스인 Builder를 통해
필드 값을 설정하고 `java▶ build()` 하여 객체를 생성하게끔 한다.

```java
public class Post {
  private final String title;
  private final String author;  // optional
  private final String content;

  private Post(Builder builder) {
    this.title = builder.title;
    this.author = builder.author;
    this.content = builder.content;
  }

  public static class Builder {
    private final String title;
    private final String content;

    private String author = null;

    public Builder(String title, String content) {
      this.title = title;
      this.content = content;
    }

    public Builder author(String author) {
      this.author = author;
      return this;
    }

    public Post build() {
      return new Post(this);
    }
  }
}
```

## 사용

이 Builder 패턴은 위에서 볼 수 있듯이 쉽게 작성할 수 있으며, 사용하는 입장에서도 다음과 같이 읽기도 쉽다.

```java
Post post = Post.Builder("제목", "글 내용")
                .author("Galacsh")
                .build();
```

# 클래스 계층에서의 활용

클래스 계층에 활용한다니 말이 좀 어렵지만, 상위 클래스에서 Builder를 구현해두고
하위 클래스에서 Builder도 상속 받아 확장할 수 있음을 의미한다.

다만 `java▶ public` 또는 `java▶ protected` 생성자가 없는 위 코드는 상속 받을 수 없으므로
상위 클래스는 abstract class이 어야 할 것이다.

```java
package post;

public abstract class Post {
    private final String title;
    private final String author;
    private final String content;

    protected Post(Builder builder) {
        this.title = builder.title;
        this.author = builder.author;
        this.content = builder.content;
    }

    public static abstract class Builder<T extends Builder<T>> {
        private String title;
        private String content;
        private String author = null;

        public T title(String title) {
            this.title = title;
            return self();
        }

        public T content(String content) {
            this.content = content;
            return self();
        }

        public T author(String author) {
            this.author = author;
            return self();
        }

        abstract Post build();
        protected abstract T self();
    }
}
```

위 포스트 클래스를 상속받는 이미지형 포스트를 구현한다고 해보자.

```java
package post;

public class PostWithImage extends Post {
    private final String image;
    private final String[] tags;

    private PostWithImage(Builder builder) {
        super(builder);
        this.image = builder.image;
        this.tags = builder.tags;
    }

    public static class Builder extends Post.Builder<Builder> {
        private final String image;
        private String[] tags;

        public Builder(String image) {
            this.image = image;
        }

        public Builder tags(String[] tags) {
            this.tags = tags;
            return this;
        }

        @Override
        public PostWithImage build() {
            return new PostWithImage(this);
        }

        @Override
        protected Builder self() {
            return this;
        }
    }
}
```

## 사용

구현된 이미지형 포스트는 다음과 같이 사용할 수 있을 것이다.

```java
PostWithImage post = new PostWithImage.Builder("hello.png")
                                      .tags(new String[] {"world", "java"})
                                      .title("이미지 게시물")
                                      .content("내용")
                                      .author("Galacsh")
                                      .build();
```

# 핵심 요약

> - 매개변수가 많은 경우 좋다.
> - 본 클래스는 **private** 생성자로, Builder를 매개변수로 받게 한다.
> - 멤버 클래스 **Builder**는 **static** 클래스로 만든다.
> - **Builder**의 `java▶ build()` 메소드는 만들어둔 본 클래스의 **private** 생성자를 이용하여 객체를 생성한다.
