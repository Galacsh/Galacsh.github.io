---
date: 2021-09-02 00:31:00
title: "함수 (Function)"
publish: true
tags: ["DB", "SQLD", "Database"]
---

여기서는 SQL을 더 강력하게 해주고 데이터 값을 간편하게 조작하는데 사용할 수 있는 내장 함수 중 단일행 함수에 대해서 설명한다.

---

# 함수

> 함수는 입력되는 값이 아무리 많아도 출력은 하나만 된다는 M:1 관계인 특징이 있음

- **내장 함수 (Built-in Function)**
  - 벤더가 제공
  - 벤더 별로 차이가 있으나 핵심적인 기능들은 공통적으로 제공함
    - 표현법은 다를 수 있음
  - 함수의 입력 값에 따라 분류 가능
    - **단일행 함수 (Single-Row Function)** : 입력 값이 단일행
    - **다중행 함수 (Multi-Row Function)** : 입력 값이 여러 행
      - **집계 함수 (Aggregate Function)**
      - **그룹 함수 (Group Function)**
      - **윈도우 함수 (Window Function)**
- **사용자 정의 함수 (User Defined Function)**
  - 사용자가 정의

특별한 제약 조건이 없다면 함수는 여러 개 중첩하여 사용이 가능하다.
함수 내부에 다른 함수를 사용하게 되면, 안쪽에 위치해 있는 함수부터 실행되어 그 결과 값이 바깥쪽의 함수에 인자(Argument)로 쓰인다.

```sql
함수명 (칼럼이나 표현식 [, Arg1, Arg2, ... ])
```

---

# 단일행 함수

> 내장 함수는 벤더 별로 사용법이 틀린 경우가 많으므로 Oracle과 SQL Server에서 공통으로 사용하는 중요 함수를 위주로 설명함

이후 내용에 앞서, SQL Server와 달리 Oracle은 SELECT 절과 FROM 절 모두 필수 절이다.
따라서 테이블이 필요 없는 경우에는 **DUAL** 테이블을 이용한다.

- **DUAL 테이블**
  - 사용자 SYS가 소유
  - 모든 사용자가 액세스 가능한 테이블
  - SELECT ~ FROM ~ 의 형식을 갖추기 위한 일종의 DUMMY 테이블
  - DUMMY라는 문자열 유형의 컬럼에 'X'라는 값이 들어 있는 행 1건이 포함되어 있음

## 단일행 함수 종류

다음 함수 소개에서 슬래시 앞/뒤는 Oracle/SQL Server을 뜻한다.

- **문자형 함수**
  - 문자를 입력하면 문자나 숫자 값 반환
```sql
LOWER, UPPER, LTRIM, RTRIM, TRIM, ASCII,
SUBSTR/SUBSTRING, LENGTH/LEN
```

- **숫자형 함수**
  - 숫자를 입력하면 숫자 반환
```sql
ABS, MOD, ROUND, TRUNC, SIGN, FLOOR, EXP, 
LOG, LN, POWER, SIN, COS, TAN, CEIL/CEILING, CHR/CHAR
```

- **날짜형 함수**
  - DATE 타입의 값 연산
```sql
SYSDATE/GETDATE, EXTRACT/DATEPART, 
TO_NUMBER(TO_CHAR(, 'YYYY'|'MM'|'DD'))/YEAR|MONTH|DAY
```

- **변환형 함수**
  - 문자, 숫자, 날짜형 값의 데이터 타입 변환
```sql
TO_NUMBER, TO_CHAR, TO_DATE/CAST, CONSERT
```

- **NULL 관련 함수**
  - NULL 처리 함수
```sql
TO_NUMBER, TO_CHAR, TO_DATE/CAST, CONSERT
```

## 단일행 함수 특징

- SELECT, WHERE, ORDER BY 절에 사용 가능
- 각각의 행에 대한 조작 결과 반환
- 각 행(Row)들에 대해 개별적으로 작용
- **인자 (Argument)**
  - 여러 인자를 입력해도 단 하나의 결과만 반환
  - 함수의 인자로 상수, 변수, 표현식이 사용 가능
  - 하나의 인수를 가지는 경우도 있지만 여러 개의 인수를 가질 수도 있음
- 특별한 경우가 아니면, 함수의 인자로 함수를 사용하는 **함수의 중첩이 가능**

## 문자형 함수

|                          | Oracle Database                                  | SQL Server                                     | Oracle 예제                   | 결과          |
| ------------------------ | ------------------------------------------------ | ---------------------------------------------- | ---------------------------- | ------------ |
| 문자열을 소문자로           | LOWER(문자열)                                     | LOWER(문자열)                                   | LOWER('SQL Expert')          | 'sql expert' |
| 문자열을 대문자로           | UPPER(문자열)                                     | UPPER(문자열)                                   | UPPER('SQL Expert')          | 'SQL EXPERT' |
| 문자/숫자를 ASCII 코드로    | ASCII('문자')                                     | ASCII('문자')                                  | ASCII('A')                    | 65          |
| ASCII 코드를 문자/숫자로    | CHR(코드)                                         | CHAR(코드)                                     | CHR(65)                       | 'A'         |
| 문자열 합치기              | CONCAT(문자열1, 문자열2)<br/>문자열1 \|\| 문자열2     | CONCAT(문자열1, 문자열2)<br/>문자열1 + 문자열2    | CONCAT('RDBMS', 'SQL')        | 'RDBMS SQL' |
| m번째부터 n개만큼 출력      | SUBSTR(문자열, m[, n])                             | SUBSTRING(문자열, m[, n])                      | SUBSTR('SQL Expert', 5, 3)    | 'Exp'       |
| 문자열 개수 출력           | LENGTH(문자열)                                     | LEN(문자열)                                    | LENGTH('SQL Expert')          | 10          |
| 첫문자부터 지정문자 제거    | LTRIM(문자열[, 지정문자])                            | LTRIM(문자열) 공백제거                          | LTRIM('xxYYZZx', 'x')         | 'YYZZx'     |
| 마지막문자부터 지정문자 제거 | RTRIM(문자열[, 지정문자])                            | RTRIM(문자열)                                 | 공백제거 RTRIM('XXzzYYzz', 'z') | 'XXzzYY'    |
| 머리/꼬리/양쪽 지정문자 제거 | TRIM([leading\|trailing\|both] 지정문자 FROM 문자열) | TRIM(문자열) 공백제거                          | TRIM('x' FROM 'xxYZxYx')       | 'YZxY'      |


## 숫자형 함수

|                              | Oracle Database  | SQL Server        | Oracle 예제                 | 결과       |
| ---------------------------- | ---------------- | ----------------- | --------------------------- | --------- |
| 절대값 출력                    | ABS(숫자)        | ABS(숫자)         | ABS(-15)                    | 15        |
| 양수, 음수, 0 구분             | SIGN(숫자)        | SIGN(숫자)        | SIGN(-3), SIGN(0), SIGN(3)  | -1, 0, 1  |
| 숫자1/숫자2 나머지 값 ('%' 가능) | MOD(숫자1, 숫자2) | MOD(숫자1, 숫자2)  | MOD(7,3)                    | 1         |
| 크거나 같은 최소 정수           | CEIL(숫자)        | CEILING(숫자)     | CEIL(38.12), CEIL(-38.12)   | 39, -38   |
| 작거나 같은 최대 정수           | FLOOR(숫자)       | FLOOR(숫자)       | FLOOR(38.12), FLOOR(-38.12) | 38, -39   |
| 소숫점 m자리까지 반올림         | ROUND(숫자[, m])  | ROUND(숫자[, m])  | ROUND(38.5235, 3)           | 38.524    |
| 소숫점 m자리 밑으로 버림        | TRUNC(숫자[, m])  | 없음              | TRUNC(38.5235, 0)           | 38        |

소숫점 관련하여서는 m이 생략된 경우 디폴트는 0이다.

위 함수들 외에도 다음과 같은 함수들이 있다.

- 삼각 함수 값
  - `sql▶ SIN(), COS(), TAN()`
- 지수, 거듭제곱, 제곱근, 로그, 자연 로그
  - `sql▶ EXP(), POWER(), SQRT(), LOG(), LN()`

## 날짜형 함수

> 데이터베이스는 날짜를 저장할 때 내부적으로 세기(Century), 년(Year), 월(Month), 일(Day), 시(Hours), 분(Minutes), 초(Seconds)와 같은 숫자 형식으로 변환하여 저장

|                                    | Oracle Database                               | SQL Server                       | Oracle 예제                                                     | 결과 | 
| ---------------------------------- | --------------------------------------------- | -------------------------------- | -------------------------------------------------------------- | --- | 
| 현재 날짜 시각                       | SYSDATE                                       | GETDATE()                        | SELECT SYSDATE FROM DUAL;                                      | 2021/03/04<br/>18:52:34 |
| 날짜 데이터에서 연/월/일시간/분/초 출력 | EXTRACT(YEAR \| MONTH \| DAY FROM d)          | DATEPART(YEAR \| MONTH \| DAY, d) | SELECT EXTRACT(YEAR FROM SYSDATE)<br/>FROM DUAL;               | 2021     |
| 날짜 데이터에서 연/월/일 출력          | TO_NUMBER(TO_CHAR(d, 'YYYY' \| 'MM \| 'DD'')) | YEAR(d) MONTH(d) DAY(d)           | SELECT TO_NUMBER(TO_CHAR(<br/>SYSDATE, 'YYYYMMDD')) FROM DUAL; | 20210304 |

날짜는 여러 가지 형식으로 출력이 되고 날짜 계산에도 사용되기 때문에 그 편리성을 위해서 숫자형으로 저장한다.
숫자형으로 저장하므로 덧셈, 뺄셈 같은 산술 연산자로도 계산이 가능하다.

즉, 날짜에 숫자 상수를 더하거나 뺄 수 있다.

## 변환형 함수

- 데이터 유형 변환 종류
  - **명시적 데이터 유형 변환**
    - 데이터 변환형 함수로 명시하는 경우
  - **암시적 데이터 유형 변환**
    - 데이터베이스가 알아서 데이터 유형을 변환하여 처리
    - 성능 저하 가능성
    - 데이터베이스가 자동 변한하지 못한 경우 에러 발생 가능성

- Oracle Database 
  - **TO_NUMBER(문자열)**
    - 문자열을 숫자로
    - `sql▶ SELECT TO_NUMBER('30') FROM DUAL;`
      - 30
  - **TO_CHAR(숫자|날짜[, FORMAT])**
    - 숫자/날짜를 FORMAT 형태 문자열로
    - `sql▶ SELECT TO_CHAR(SYSDATE, 'YYYYMMDD') FROM DUAL;`
      - '20210304'
  - **TO_DATE(문자열[, FORMAT])**
    - 문자열을 FORMAT 형태 날짜로
    - `sql▶ SELECT TO_DATE('20200324', 'YYYYMMDDHH24MISS') FROM DUAL;`
      - 20/03/24

SQL Server는 위 함수들 대신에 **CAST-CONVERT**로 처리한다.

```sql
CAST (
  expression AS data_type [(length)]
) CONVERT (
  data_type [(length)], expression[, style]
)
```

## NULL 관련 함수

- NULL 특성 복습
  - 아직 정의되지 않은 값으로 0 또는 공백과 다름
    - 0은 숫자이고, 공백은 하나의 문자이므로
  - NOT NULL 또는 PRIMARY KEY에 속하지 않는 컬럼은 NULL 값을 포함할 수 있음
  - NULL 값을 포함하는 연산의 경우 결과 값도 NULL

결과값을 NULL이 아닌 다른 값을 얻고자 할 때 NVL/ISNULL 함수를 사용한다. 
NULL 값의 대상이 숫자 유형 데이터인 경우는 주로 0(Zero)으로, 
문자 유형 데이터인 경우는 블랭크보다는 ‘x’ 같이 해당 시스템에서 의미 없는 문자로 바꾸는 경우가 많다.

- **NULL이면 대체하여 출력**

```sql
-- Oracle
NVL(NULL_판단_대상,‘NULL일 때 대체값’)

-- SQL Server
ISNULL(NULL_판단_대상,‘NULL일 때 대체값’)
```

이러한 함수는 **값**을 바꾸는 것이므로 공집합과는 관련 없다고 생각하면 된다.
다만, 공집합에 대해 집계 함수를 사용하면 NULL이 반환되기 때문에, 그 값을 NVL / ISNULL의 인자로 넣는 것은 유효하다.

- **표현식 1과 2가 같으면 NULL, 다르면 표현식 1 출력**

```sql
NULLIF(표현식1, 표현식2)
```

- **최초의 NULL이 아닌 표현식 출력**

```sql
-- 모든 표현식이 NULL인 경우에는 NULL을 반환함
COALESCE(표현식1, 표현식2, 표현식3, ...)
```

참고로, 다중행 함수는 NULL을 제외하고 연산된다.
예를 들어 100명 중 10명의 성적이 NULL일 때 AVG는 90명에 대한 평균을 낸다.
물론 전체 입력 건이 NULL인 경우에는 NULL을 반환한다.

---

# CASE 표현

CASE Expression은 IF-THEN-ELSE 논리와 유사한 표현식이며 Oracle의 **Decode** 함수와 같은 기능을 한다.

또한 함수의 성질을 가지고 있으므로, 다른 함수처럼 중첩해서 사용할 수 있다.

```sql
SELECT 
  ENAME, 
  SAL, 
  CASE 
    WHEN SAL >= 2000 THEN 1000 
    ELSE (
      CASE WHEN SAL >= 1000 THEN 500 ELSE 0 END
    ) 
  END as BONUS 
FROM EMP;
```

## Simple Case Expression

> Equal(=) 값에 대하여 사용할 수 있는 표현식

```sql
CASE MY_WATCH
  WHEN 'GALAXY WATCH' THEN 'SAMSUNG'
  WHEN 'APPLE WATCH' THEN 'APPLE'
  ELSE 'GOOGLE'
END
```

WHEN절 전에 표현식이 등장한다.

## Searched Case Expression

> WHEN 절에서 다양한 조건을 걸어 사용

```sql
CASE
  WHEN MY_WATCH = 'GALAXY WATCH' THEN 'SAMSUNG'
  WHEN MY_WATCH = 'APPLE WATCH' THEN 'APPLE'
  ELSE 'GOOGLE'
END
```

WHEN절 전에 표현식이 등장하지 않는다.

---

**참고 자료**

- [함수(Function) - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=342)
- [Oracle vs SQL Server 명령어 전체 비교 (1) - Yurimac의 순간](https://yurimac.tistory.com/35?category=936171SQL) 