---
date: 2021-08-17 14:48:00
title: "식별자"
publish: true
tags: ["DB", "SQLD", "Database"]
---

> **엔터티를 대표**할 수 있는 속성으로 **인스턴스 각각을 구분**할 수 있는 속성

보통 식별자와 키(Key)를 동일하게 생각하는 경우가 있는데 식별자라는 용어는 논리 데이터 모델링 단계에서 사용하고 
키는 데이터베이스 테이블에 접근을 위한 매개체로서 물리 데이터 모델링 단계에서 사용한다.

---

# 식별자의 특징

- **유일성**
  - 엔터티 내 모든 인스턴스 들이 유일하게 구분됨
- **최소성**
  - 주식별자를 구성하는 속성의 수는 유일성을 만족하는 최소의 수
- **불변성**
  - 주식별자의 값은 자주 변하지 않아야 함
- **존재성**
  - 주식별자가 지정이 되면 반드시 값이 들어와야 함

‎

(참고)

| 키 종류     | 설명                               |
| ---------- | --------------------------------- |
| 기본키 (PK)	| 엔터티 대표 키                      |
| 후보키 (CK)	| 유일성과 최소성 만족하지만 대표성 부족  |
| 슈퍼키 (SK)	| 유일성은 만족하지만 최소성 부족        |
| 대체키 (AK)	| 후보키 중 기본키를 선정하고 남은 키    |
| 외래키 (FK)	| 다른 테이블 기본 키 필드를 참조 한 키  |

---

# 식별자 분류

| 분류          | 식별자         | 설명                                                  |
| ------------ | -------------- | ---------------------------------------------------- |
| 대표성 여부    | 주 식별자       | 엔터티를 **대표**함                                     |
| 대표성 여부    | 보조 식별자     | 엔터티를 대표하지 않음                                   |
| 스스로 생성여부 | 내부 식별자     | 엔터티 내 **스스로 생성**됨                              |
| 스스로 생성여부 | 외부 식별자     | 다른 엔터티와의 관계에 의해 생성되는 속성                   |
| 속성의 수      | 단일 식별자     | **단일 속성**으로 식별됨                                 |
| 속성의 수      | 복합 식별자     | 복합 속성으로 식별됨                                     |
| 대체여부       | 본질 식별자     | 원래 업무적으로 의미가 있던 식별자                         |
| 대체여부       | 인조 식별자     | 본질 식별자를 **대체하여 일련번호**와 같이 새롭게 만든 식별자 |

---

# 주식별자 도출기준

- **해당 업무에서 자주 이용되는 속성을 주식별자로 지정**
  - ex. 직원이라는 엔터티는 주민등록번호와 사원번호 중 사원번호가 더 주식별자로 적합함
- **명칭, 내역 등과 같이 이름으로 기술되는 것은 피함**
  - ex. 부서이름은 많은 경우 20자 이상이 될 수 있으므로 조건절에 정확한 부서이름을 기술하기 어려울 것
  - 위와 같은 경우 새로운 식별자를 생성 (일련번호 또는 코드)
- **속성의 수가 많아지지 않도록 함**
  - 많아지는 경우 새로운 인조식별자를 생성하는 것이 데이터 모델을 한층 더 단순하게 하고 애플리케이션을 개발할 때 조건절을 단순하게 할 수 있는 방법이 될 수 있음
  - 단, 증손자엔터티까지 계속해서 상속이 되는 속성이고 복잡한 데이터 모델이 구현되어 물리데이터베이스에서 조인으로 인한 성능저하가 예상되는 모습을 가지고 있다면 속성의 반정규화 측면에서 하나의 테이블에 많은 속성이 있는 것이 인정될 수도 있음


# 식별자관계와 비식별자관계에 따른 식별자

- **외부 식별자**
  - 데이터베이스 생성 시 Foreign Key 역할
  - 부모로부터 받은 식별자
- **식별자 관계**
  - 부모로부터 받은 식별자를 자식엔터티의 주식별자로 이용하는 경우
  - 반드시 부모엔터티가 생성되어야 자기 자신의 엔터티가 생성되는 경우임
  - 1:1 관계
    - 부모로부터 받은 속성을 자식엔터티가 모두 사용하고 그것만으로 주식별자로 사용하는 경우
  - 1:M 관계
    - 만약 부모로부터 받은 속성을 포함하여 다른 부모엔터티에서 받은 속성을 포함하거나 스스로 가지고 있는 속성과 함께 주식별자로 구성하는 경우
- **비식별자 관계**
  - 부모 엔터티로부터 속성을 받았지만 주식별자로 사용하지 않고 일반적인 속성으로만 사용하는 경우
  - 비식별자 관계를 생성하는 3가지 경우
    1. 부모 없는 자식이 생성될 수 있는 경우
    2. 부모 인스턴스가 자식만 남겨두고 먼저 소멸될 수 있는 경우
       - 데이터베이스 생성 시 Foreign Key를 연결하지 않는 방법이 있음
       - 데이터 모델상에서 관계를 비식별자관계로 조정하는 것이 가장 좋은 방법임
    3. 여러 엔터티가 하나의 엔터티로 통합되었는데 각각의 엔터티가 별도의 관계를 가지는 경우
       - 기존 관계를 유지하기 위해서는 식별자 관계가 불가능함
       - ex. 방문접수-내방고객, 인터넷접수-인터넷회원, 전화접수-전화회원 => 접수-내방고객, 접수-인터넷회원, 접수-전화회원
         - 식별자 관계인 경우 한 접수 건은 내방고객, 인터넷회원, 전화회원이 무조건 있어야 생성이 가능함
    4. 자식엔터티에서 별도의 주식별자를 생성하는 것이 더 유리하다고 판단되는 경우
- **식별자관계와 비식별자관계 모델링**
  - 기본적으로 식별자 관계로 모든 관계를 연결하되 다음 조건에 해당하는 경우 비식별자 관계로 조정할 것
    1. 관계 분석
    2. 관계의 강/약 분석 → **약한 관계**는 비식별자 관계로 조정
    3. 자식 테이블의 독립 PK 필요 여부 판단 → **독립 PK 필요 시** 비식별자 관계로 조정 
    4. SQL 복잡도 및 개발 생산성 판단 → **PK 속성 단순화 필요 시** 비식별자 관계로 조정 

‎

참고) 식별자/비식별자 관계 비교

| 항목 | 식별자 관계 | 비식별자 관계 |
| --- | ----------- | ---------- |
| 목적 | 강한 연결관계 표현 | 약한 연결관계 표현 |
| 자식 주식별자 영향 | 자식 주식별자의 구성에 포함됨 | 자식 일반 속성에 포함됨 |
| 표기법 | 실선 표현 | 점선 표현 |
| 연결 고려사항 | 반드시 부모 엔터티 종속<br/> 자식 주식별자 구성에 부모 주식별자 포함 필요<br/> 상속받은 주식별자 속성을 타 엔터티에 이전 필요<br/> | 약한 종속 관계<br/> 자식 주식별자 구성을 독립적으로 구성<br/> 자식 주식별자 구성에 부모 식별자 부분 필요<br/> 상속받은 주식별자 속성을 타 엔터티에 차단 필요<br/> 부모 쪽의 관계 참여가 선택관계 |

---

**참고 자료**

- [식별자 - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=5&mod=document&uid=329)