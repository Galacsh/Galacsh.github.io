---
date: 2021-09-01 00:36:00
title: "WHERE 절"
publish: true
tags: ["DB", "SQLD", "Database"]
---

WHERE 절에는 두 개 이상의 테이블에 대한 조인 조건을 기술하거나 결과를 제한하기 위한 조건을 기술한다.

WHERE 절에 조건이 없는 FTS(Full Table Scan) 문장은 SQL 튜닝의 1차적인 검토 대상이 된다. 다만 FTS가 무조건 나쁜 것은 아니며 병렬 처리 등을 이용해 유용하게 사용하는 경우도 많다.

> 📌 **참고**  
> 기본적인 SQL 문장은 **Oracle의 경우 필수적으로 SELECT 절과 FROM 절**로 이루어져 있다.  
> **SQL Server**, Sybase 문장은 SELECT 목록에 **상수, 변수 및 산술식(열 이름 없이)**만
> 포함되는 경우는 **FROM 절이 필요 없지만**, 테이블의 칼럼이 사용된 경우는 FROM 절이 필요하다.

- 칼럼(Column)명 (보통 조건식의 좌측에 위치)
- 비교 연산자
- 문자, 숫자, 표현식 (보통 조건식의 우측에 위치)
- 비교 칼럼명 (JOIN 사용시)

---

# 연산자의 종류

- 비교 연산자
  - `sql@ =, >, >=, <, <=`
- SQL 연산자
  - `sql@ BETWEEN a AND b`
  - `sql@ IN (List)`
  - `sql@ LIKE '비교 문자열'`
  - `sql@ IS NULL`
- 논리 연산자
  - `sql@ AND OR NOT`
- 부정 비교 연산자
  - `sql@ !=, ^=, <>, NOT 컬럼명 =, NOT 컬럼명 >`
- 부정 SQL 연산자
  - `sql@ NOT BETWEEN a AND b`
  - `sql@ NOT IN (List)`
  - `sql@ IS NOT NULL`

**연산자 우선순위**

| 우선순위      | 설명                         |
| ------------- | ---------------------------- |
| 1 (가장 우선) | 괄호 ()                      |
| 2             | NOT 연산자                   |
| 3             | 비교 연산자, SQL 비교 연산자 |
| 4             | AND                          |
| 5             | OR                           |

---

# 비교 연산자

문자열을 비교할 때는 CHAR, VARCHAR에 따라 결과가 달라질 수 있으며, 상수는 변수 타입으로 변환되어 비교된다.

## 문자 유형 비교 방법

- **비교 연산자의 양쪽이 모두 CHAR**
  1.  길이가 서로 다른 CHAR 형인 경우 짧은 쪽에 공백 추가하여 길이가 같게 함
  2.  서로 다른 문자가 나올 때까지 비교
  3.  다른 문자 발견 시 해당 문자의 값에 따라 크기 결정
  4.  공백 수만 다른 경우 서로 같은 값으로 판단
- **어느 한 쪽이 VARCHAR**
  1.  서로 다른 문자가 나올 때까지 비교
  2.  앞 부분이 동일한 경우 길이가 긴 것이 크다고 판단
  3.  전부 동일하면 같다고 판단
- **상수 값과 문자 유형 비교**
  1.  상수 쪽을 변수 타입과 동일하게 바꾸고 비교
  2.  변수 쪽이 CHAR or VARCHAR인 경우 위의 판단 방법을 따름

**참고**  
VARCHAR or CHAR의 길이는 문자 수를 의미하지 않는다.
바이트 수를 의미하므로, 문자 인코딩에 따라 저장할 수 있는 문자의 수가 달라진다.

---

# SQL 연산자

> SQL 문장에서 사용하도록 기본적으로 예약되어 있는 연산자

SQL 연산자는 모든 데이터 타입에 대해서 연산이 가능한 4가지 종류가 있다.

- `sql@ BETWEEN a AND b`
  - a와 b의 값 사이에 있으면 됨 (a와 b 포함)
  - SQL 문장을 짧게 해줌
    - ex. `sql@ col BETWEEN 1 AND 3` 은 대부분의 데이터베이스에서 `sql@ (col>=1 AND col<=3)`으로 변환하여 실행
    - 즉, col에 인덱스가 있다면 이용함
- `sql@ IN (list)`
  - list에 있는 값 하나라도 일치하면 됨
  - SQL 문장을 짧게 해줌
    - ex. `sql@ col in (1, 2, 3)` 은 대부분의 데이터베이스에서 `sql@ (col=1 or col=2 or col=3)`으로 변환하여 실행
    - 즉, col에 인덱스가 있다면 이용함
- `sql@ LIKE '비교 문자열'`
  - 비교 문자열과 형태가 일치하면 됨
  - 와일드 카드를 함께 이용하여 형태를 표현함
    - `sql@ % (퍼센트)` 0개 이상의 어떤 문자열
    - `sql@ _ (언더바)` 1개의 단일 문자
- `sql@ IS NULL`
  - NULL 값이면 됨

**NULL의 특징**

- ASCII 00
- 존재하지 않는 것으로, 확정되지 않은 값 표현
  - 어떤 값보다 크거나 작지 않음
  - `sql@ '' (공백)` ASCII 32, `sql@ 0 (Zero)` ASCII 48와 달리 비교 자체가 불가
- 따라서, NULL과의 수치 연산은 NULL 반환
- 비교 연산은 FALSE 반환
- 제대로 NULL의 비교를 위해서는 `sql@ IS [NOT] NULL`을 사용해야 함

---

# 논리 연산자

> 논리 연산자는 딱히 설명할 게 없으나 주의해야 할 경우를 예제로 설명함

**예제**

- 소속팀이 삼성블루윙즈 OR 소속팀이 전남드래곤즈
- AND 포지션이 미드필더
- AND 키는 170 센티미터 이상
- AND 키는 180 센티미터 이하

**잘못된 SQL문**

```sql
SELECT PLAYER_NAME 선수이름, POSITION 포지션, BACK_NO 백넘버, HEIGHT 키
FROM PLAYER
WHERE TEAM_ID = 'K02' OR TEAM_ID = 'K07'
  AND POSITION = 'MF'
  AND HEIGHT >= 170 AND HEIGHT <= 180;
```

**잘못된 SQL문 - 실행 결과**

| 선수이름   | 포지션 | 백넘버 | 키  |
| ---------- | ------ | ------ | --- |
| **가나다** | DF ❌  | 5      | 183 |
| 가비       | MF     | 10     | 177 |
| 강대희     | MF     | 26     | 174 |
| 고종수     | MF     | 22     | 176 |
| 고창현     | MF     | 8      | 170 |
| 정기범     | MF     | 28     | 173 |
| 정동현     | MF     | 25     | 175 |
| 정두현     | MF     | 4      | 175 |
| 정준       | MF     | 44     | 170 |
| 정진우     | DF ❌  | 7      | 179 |
| 데니스     | FW ❌  | 11     | 176 |

실행 결과의 내용을 보면 포지션이 미드필더(MF: MidFielder)가 아닌 선수들의 명단이 출력되었다.

'가나다' 선수를 기준으로 하면, 위 SQL 문은 다음과 같이 처리되었을 것이다.

```sql
-- 1. 원본 조건
TEAM_ID = 'K02' OR TEAM_ID = 'K07'
  AND POSITION = 'MF'
  AND HEIGHT >= 170 AND HEIGHT <= 180;

-- 2. 비교 연산자 처리
TRUE OR FALSE AND FALSE AND TRUE AND FALSE;

-- 3. AND를 OR 보다 먼저 연산
TRUE OR FALSE;

-- 4. OR 연산
TRUE
```

‎

**올바른 SQL문**

따라서, 올바르게 고치려면 소속팀 OR 비교를 괄호로 묶어 먼저 처리되게 하면 된다.

```sql
WHERE (TEAM_ID = 'K02' OR TEAM_ID = 'K07')
  AND POSITION = 'MF'
  AND HEIGHT >= 170 AND HEIGHT <= 180;
```

---

# 부정 연산자

- 부정 논리 연산자
  - **같지 않음**
    - `sql@ <>` ✨ **ANSI/ISO 표준, 모든 운영체제에서 사용 가능**
    - `sql@ !=`
    - `sql@ ^=`
    - `sql@ NOT 컬럼명 =`
  - `sql@ NOT 컬럼명 >` = `sql@ 컬럼명 <=`
  - `sql@ NOT 컬럼명 <` = `sql@ 컬럼명 >=`
- 부정 SQL 연산자
  - `sql@ NOT BETWEEN a AND b`
    - a와 b 값 사이에 있지 않고, a와 b를 포함하지 않음
  - `sql@ NOT IN (list)`
  - `sql@ IS NOT NULL`

---

# ROWNUM, ROW_NUMBER(), TOP

## ROWNUM

> Oracle에서 사용할 수 있는 Pseudo Column(가상 컬럼)으로, SQL 처리 결과 집합 각 행에 임시로 부여되는 일련번호

보통 테이블이나 집합에서 원하는 만큼의 행만 가져오고 싶을 때 **WHERE 절**에서 사용한다.

**ex. 1건의 행 획득**

```sql
SELECT PLAYER_NAME FROM PLAYER WHERE ROWNUM = 1;
SELECT PLAYER_NAME FROM PLAYER WHERE ROWNUM <= 1;
SELECT PLAYER_NAME FROM PLAYER WHERE ROWNUM < 2;
```

‎

참고로, 추가적인 ROWNUM의 용도로는 테이블 내의 고유한 키나 인덱스 값을 만드는 것이 있다.

```sql
-- 고유값 지정
UPDATE MY_TABLE SET COLUMN1 = ROWNUM;
```

## ROW_NUMBER()

> 정렬 기준을 지정하여 순번을 매기는 함수

WHERE 절과는 크게 관련이 없지만, SQL Server에는 없는 `sql@ ROWNUM`은 ORDER BY 이전에 순번이 매겨지기 때문에 정렬 후에 `sql@ ROWNUM`을 이용하려면 서브 쿼리로 먼저 정렬을 해두어야 한다.

`sql@ ROW_NUMBER()`의 경우 다음과 같이 정렬 기준을 지정하여 순번을 매길 수 있다.

```sql
-- 단순히 성적으로 정렬하여 순번 매김
SELECT
  ROW_NUMBER() OVER (ORDER BY SCORE DESC) AS '등수',
  STUDENT_NAME AS '이름'
FROM STUDENT

-- 반 별로 그룹화 한 후 정렬하여 순번 매김
SELECT
  ROW_NUMBER() OVER (PARTITION BY CLASS_NO ORDER BY SCORE DESC) AS '등수',
  STUDENT_NAME AS '이름', CLASS_NO AS '반 번호'
FROM STUDENT

-- 반 별로 그룹화 한 후 정렬하여 순번 매김
-- 반 번호는 역순으로 출력
SELECT
  ROW_NUMBER() OVER (PARTITION BY CLASS_NO ORDER BY SCORE DESC) AS '등수',
  STUDENT_NAME AS '이름', CLASS_NO AS '반 번호'
FROM STUDENT
ORDER BY CLASS_NO DESC, '등수'
```

## TOP

> SQL Server는 ROWNUM이 없는 대신에 원하는 만큼의 행을 가져오기 위해 TOP을 사용할 수 있음

마찬가지로 WHERE 절과는 크게 관련이 없지만, SQL Server에서 원하는 만큼의 행을 가져오는 기능을 소개한다.

```sql
TOP (Expression) [PERCENT] [WITH TIES]
```

- `sql@ Expression`
  - 반환할 행의 수를 지정하는 숫자
- `sql@ PERCENT`
  - 쿼리 결과 집합에서 처음 Expression%의 행만 반환
- `sql@ WITH TIES`
  - ORDER BY 절이 지정된 경우에만 사용할 수 있음
  - 마지막 행과 같은 값이 있는 경우 개수를 초과하여 추가 행이 출력

**예시**

```sql
-- 3건 조회
SELECT TOP (3) STUDENT_NAME FROM STUDENT;

-- 11% 조회
SELECT TOP (11) PERCENT STUDENT_NAME FROM STUDENT;

-- 3번째 행의 성적과 동일한 점수인 학생들을 포함하여 조회
SELECT TOP (3) WITH TIES
  STUDENT_NAME
FROM STUDENT ORDER BY SCORE DESC;

-- 성적 상위 11% + 마지막 행의 성적과 동일한 학생들을 포함하여 조회
SELECT TOP (11) PERCENT WITH TIES
  STUDENT_NAME
FROM STUDENT ORDER BY SCORE DESC;
```

---

**참고 자료**

- [WHERE 절 - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=341)
