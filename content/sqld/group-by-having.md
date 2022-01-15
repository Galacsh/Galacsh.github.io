---
date: 2021-09-02 18:28:00
title: "GROUP BY, HAVING 절"
publish: true
tags: ["DB", "SQLD", "Database"]
---

# 배경지식 - 집계 함수(Aggregate Function)

> 여러 행들의 그룹이 모여서 그룹당 단 하나의 결과를 돌려주는 다중행 함수

- 여러 행들의 그룹이 모여서 그룹당 단 하나의 결과 반환
- GROUP BY 절은 행들을 소그룹화
  - 없으면 전체를 하나의 그룹으로 처리
- SELECT 절, HAVING 절, ORDER BY 절에 사용할 수 있음

```sql
-- ALL : Default 옵션이므로 생략 가능함
-- DISTINCT : 같은 값을 하나의 데이터로 간주할 때 사용하는 옵션임
집계_함수명 ( [DISTINCT | ALL] 칼럼이나_표현식 )
```

- 종류
  - `sql@ COUNT(*)`
    - NULL 값을 포함한 행의 수
    - 전체 컬럼이 NULL인 행은 존재할 수 없기 떄문
  - `sql@ COUNT([DISTINCT | ALL] 칼럼이나_표현식)` NULL 제외 행의 수
  - `sql@ SUM([DISTINCT | ALL] 칼럼이나_표현식)` NULL 제외 행의 합
  - `sql@ AVG([DISTINCT | ALL] 칼럼이나_표현식)` NULL 제외 행의 평균
  - `sql@ MAX([DISTINCT | ALL] 칼럼이나_표현식)` NULL 제외 행의 최대값
  - `sql@ MIN([DISTINCT | ALL] 칼럼이나_표현식)` NULL 제외 행의 최소값
  - `sql@ STDDEV([DISTINCT | ALL] 칼럼이나_표현식)` 표준편차
  - `sql@ VARIAN([DISTINCT | ALL] 칼럼이나_표현식)` 분산
  - 기타 벤더 별 통계 함수

---

# GROUP BY, HAVING 절

```sql
SELECT [DISTINCT] 칼럼명 [ALIAS명]
FROM 테이블명
[WHERE 조건식]
[GROUP BY 칼럼(Column)이나_표현식]
[HAVING 그룹조건식];
```

## GROUP BY

> 작은 그룹으로 분류하여 소그룹에 대한 항목별로 통계 정보를 얻을 때 사용

- **정렬을 보장하지 않음**
  - 일부 데이터베이스는 GROUP BY 컬럼 순으로 정렬하긴 함
  - 원칙적으로는 ORDER BY 통해 정렬해야 함
- **GROUP BY에서는 SELECT 절의 ALIAS 사용 불가**
  - GROUP BY 처리가 SELECT 절 이전에 이루어지기 때문
  - 동일한 이유로 ORDER BY에서는 SELECT 절의 ALIAS가 사용 가능

## HAVING 절

> HAVING 절을 통해 집계 함수를 이용한 조건**도** 걸 수 있음  
> 실행 순서 : **WHERE → GROUP BY → HAVING**

1. WHERE 절은 FROM 절에 정의된 집합의 개별 행에 적용된다.
   - 즉, **WHERE 절에서는 집계 함수를 사용할 수 없음**
2. GROUP BY는 WHERE 조건을 만족한 행에 실행된다.
3. GROUP BY 결과 행에 HAVING 절이 적용된다.
   - HAVING 절과 GROUP BY 절의 작성 순서를 바꾸더라도 실행 순서는 **GROUP BY가 우선**임

참고로, 소그룹 중 일부 추출 시에는 HAVING 보다 **WHERE 절에서 GROUP BY 대상을 먼저 줄이는 것이 효율적**이다.

---

# CASE 표현을 활용한 월별 데이터 집계 예제

> 부서별로 월별 입사자의 평균 급여를 알고 싶음

**STEP1. 개별 데이터 확인**

| ENAME  | DEPTNO | 입사월 | SAL  |
| ------ | ------ | ------ | ---- |
| SMITH  | 20     | 12     | 800  |
| ALLEN  | 30     | 2      | 1600 |
| WARD   | 30     | 2      | 1250 |
| JONES  | 20     | 4      | 2975 |
| MARTIN | 30     | 9      | 1250 |
| BLAKE  | 30     | 5      | 2850 |
| CLARK  | 10     | 6      | 2450 |
| SCOTT  | 20     | 7      | 3000 |
| KING   | 10     | 11     | 5000 |
| TURNER | 30     | 9      | 1500 |
| ADAMS  | 20     | 7      | 1100 |
| JAMES  | 30     | 12     | 950  |
| FORD   | 20     | 12     | 3000 |
| MILLER | 10     | 1      | 1300 |

‎

**STEP2. 월별 데이터 구분**

```sql
SELECT
  ENAME, DEPTNO,
  CASE MONTH WHEN 1 THEN SAL END M01,
  CASE MONTH WHEN 2 THEN SAL END M02,
  CASE MONTH WHEN 3 THEN SAL END M03,
  CASE MONTH WHEN 4 THEN SAL END M04,
  CASE MONTH WHEN 5 THEN SAL END M05,
  CASE MONTH WHEN 6 THEN SAL END M06,
  CASE MONTH WHEN 7 THEN SAL END M07,
  CASE MONTH WHEN 8 THEN SAL END M08,
  CASE MONTH WHEN 9 THEN SAL END M09,
  CASE MONTH WHEN 10 THEN SAL END M10,
  CASE MONTH WHEN 11 THEN SAL END M11,
  CASE MONTH WHEN 12 THEN SAL END M12
FROM (
  SELECT ENAME, DEPTNO, EXTRACT(MONTH FROM HIREDATE) MONTH, SAL
  FROM EMP
);
```

| ENAME | DEPTNO | M01 | M02  | M03 | M04 | M05 | M06 | M07 | M08 | M09 | M10 | M11 | M12 |
| ----- | ------ | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------- |
| SMITH | 20     |     | 　   | 　  | 　  | 　  | 　  | 　  | 　  | 　  | 　  | 　  | 800 |
| ALLEN | 30     | 　  | 1600 |     |     |     |     |     |     |     |     |     |     | 　　　　　　　　　　 |
| ...   |        |     |      |     |     |     |     |     |     |     |     |     |

‎

**STEP3. 부서별 데이터 집계**

```sql
SELECT
  DEPTNO,
  AVG(CASE MONTH WHEN 1 THEN SAL END) M01,
  AVG(CASE MONTH WHEN 2 THEN SAL END) M02,
  AVG(CASE MONTH WHEN 3 THEN SAL END) M03,
  AVG(CASE MONTH WHEN 4 THEN SAL END) M04,
  AVG(CASE MONTH WHEN 5 THEN SAL END) M05,
  AVG(CASE MONTH WHEN 6 THEN SAL END) M06,
  AVG(CASE MONTH WHEN 7 THEN SAL END) M07,
  AVG(CASE MONTH WHEN 8 THEN SAL END) M08,
  AVG(CASE MONTH WHEN 9 THEN SAL END) M09,
  AVG(CASE MONTH WHEN 10 THEN SAL END) M10,
  AVG(CASE MONTH WHEN 11 THEN SAL END) M11,
  AVG(CASE MONTH WHEN 12 THEN SAL END) M12
FROM (
  SELECT ENAME, DEPTNO, EXTRACT(MONTH FROM HIREDATE) MONTH, SAL FROM EMP
) GROUP BY DEPTNO ;
```

| DEPTNO | M01  | M02  | M03 | M04  | M05  | M06  | M07  | M08 | M09  | M10 | M11  | M12  |
| ------ | ---- | ---- | --- | ---- | ---- | ---- | ---- | --- | ---- | --- | ---- | ---- |
| 30     | 　   | 1425 | 　  | 　   | 2850 | 　   | 　   | 　  | 1375 | 　  | 　   | 950  |
| 20     | 　   | 　   | 　  | 2975 | 　   | 　   | 2050 |     |      |     |      | 1900 |
| 10     | 1300 | 　   | 　  | 　   | 　   | 2450 | 　   | 　  | 　   | 　  | 5000 | 　   |

‎

**Oracle 버전**

```sql
SELECT
  DEPTNO,
  AVG(DECODE(MONTH, 1,SAL)) M01,
  AVG(DECODE(MONTH, 2,SAL)) M02,
  AVG(DECODE(MONTH, 3,SAL)) M03,
  AVG(DECODE(MONTH, 4,SAL)) M04,
  AVG(DECODE(MONTH, 5,SAL)) M05,
  AVG(DECODE(MONTH, 6,SAL)) M06,
  AVG(DECODE(MONTH, 7,SAL)) M07,
  AVG(DECODE(MONTH, 8,SAL)) M08,
  AVG(DECODE(MONTH, 9,SAL)) M09,
  AVG(DECODE(MONTH,10,SAL)) M10,
  AVG(DECODE(MONTH,11,SAL)) M11,
  AVG(DECODE(MONTH,12,SAL)) M12
FROM (
  SELECT ENAME, DEPTNO, EXTRACT(MONTH FROM HIREDATE) MONTH, SAL FROM EMP
) GROUP BY DEPTNO ;
```

---

# 집계 함수와 NULL

> 집계 함수 사용 시 인자에서 NVL 함수를 이용해 NULL 처리하는 것은 불필요함

집계 함수는 NULL을 애초에 제외하고 연산하며, 굳이 0 등의 다른 값으로 바꾸면 연산량만 많아진다.

---

**참고 자료**

- [GROUP BY, HAVING 절 - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=343)
