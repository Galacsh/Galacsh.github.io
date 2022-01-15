---
date: 2021-09-02 23:36:00
title: "조인(JOIN)"
publish: true
tags: ["DB", "SQLD", "Database"]
---

> **JOIN**이란, 두 개 이상의 테이블 들을 연결 또는 결합하여 데이터를 출력하는 것

- 하나의 SQL 문장에서 **여러 테이블을 조인 가능**
- FROM 절에 여러 테이블이 나열되어도 **2개씩 차례차례** 조인이 일어남

---

# EQUI JOIN

> 두 개의 테이블 간에 컬럼 값들이 서로 **정확하게 일치**하는 경우에 사용

- 대부분 PK ↔ FK의 관계 기반으로 함
- 반드시 PK ↔ FK 아니어도 됨
- JOIN의 조건은 WHERE 절에 “=” 연산자를 사용해서 표현

```sql
SELECT 테이블1.칼럼명, 테이블2.칼럼명, ...
FROM 테이블1, 테이블2
WHERE 테이블1.칼럼명1 = 테이블2.칼럼명2;
→ WHERE 절에 JOIN 조건을 넣는다.

-- ANSI/ISO SQL 표준 방식
SELECT 테이블1.칼럼명, 테이블2.칼럼명, ...
FROM 테이블1
INNER JOIN 테이블2 ON 테이블1.칼럼명1 = 테이블2.칼럼명2;
→ ON 절에 JOIN 조건을 넣는다.
```

- **"테이블명.칼럼명" 명시 이유**
  - 같은 컬럼명이 존재하는 경우 옵티마이저는 어떤 컬럼을 사용해야 할지 모르기 때문에 파싱 에러
  - SQL에 대한 가독성이나 유지보수성을 높이는 효과
    - 현재에는 유일한 컬럼인 것이 미래에는 아닐 수 있음
- **JOIN 조건의 수**
  - JOIN 대상 테이블의 개수에서 하나를 뺀 **N-1개 이상**이 필요
  - 옵티마이저의 발전으로 옵티마이저가 때로 일부 JOIN 조건을 실행계획 수립 단계에서 추가할 수도 있음
- JOIN 조건을 WHERE 절에 명시한 후 부수적인 제한 조건을 논리 연산자를 통하여 추가로 입력 가능

참고로, 만약 테이블에 대한 ALIAS를 적용해서 SQL 문장을 작성했을 경우에는 SELECT 절에는 테이블명이 아닌 테이블에 대한 ALIAS를 사용해야 한다.

---

# Non EQUI JOIN

> JOIN 대상 2개의 테이블 간에 칼럼 값들이 서로 **일치하지 않는 경우**

“=” 연산자가 아닌 다른(**Between, >, >=, <, <= 등**) 연산자들을 사용하여 JOIN을 수행

```sql
SELECT 테이블1.칼럼명, 테이블2.칼럼명, ...
FROM 테이블1, 테이블2
WHERE 테이블1.칼럼명1 BETWEEN 테이블2.칼럼명1 AND 테이블2.칼럼명2;

-- 예시
SELECT E.ENAME, E.JOB, E.SAL, S.GRADE
FROM EMP E, SALGRADE S
WHERE E.SAL BETWEEN S.LOSAL AND S.HISAL;
```

---

# 3개 이상 TABLE JOIN

```sql
SELECT
   P.PLAYER_NAME 선수명, P.POSITION 포지션,
   T.REGION_NAME 연고지, T.TEAM_NAME 팀명, S.STADIUM_NAME 구장명
FROM PLAYER P, TEAM T, STADIUM S
WHERE P.TEAM_ID = T.TEAM_ID AND T.STADIUM_ID = S.STADIUM_ID
ORDER BY 선수명;

-- INNER JOIN 이용 시
SELECT
   P.PLAYER_NAME 선수명, P.POSITION 포지션,
   T.REGION_NAME 연고지, T.TEAM_NAME 팀명, S.STADIUM_NAME 구장명
FROM PLAYER P
INNER JOIN TEAM T ON P.TEAM_ID = T.TEAM_ID
INNER JOIN STADIUM S ON T.STADIUM_ID = S.STADIUM_ID
ORDER BY 선수명;
```

---

**참고 자료**

- [조인(JOIN) - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=3&mod=document&uid=345)
