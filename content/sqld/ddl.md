---
date: 2021-08-30 11:47:00
title: "DDL"
publish: true
tags: ["DB", "SQLD", "Database"]
---

# 데이터 유형

데이터 유형은 데이터베이스의 테이블에 특정 자료를 입력할 때, 그 자료를 받아들일 공간을 자료의 유형별로 나누는 기준이라고 생각하면 된다.

벤더별로 SQL 문장의 차이는 적어지고 있지만, **데이터 유형**과 내장형 함수 부분, 내부의 구조적인 차이는 많은 편이다. 벤더에서 ANSI/ISO 표준을 사용할 때는 기능을 중심으로 구현하고 벤더마다 특화된 기능이 있기 때문에 종종 표준과 다른 이름을 사용한다.

- **지원하는 데이터 유형이 다른 예시 : NUMERIC Type (숫자 타입)**
  - ANSI/ISO
    - NUMERIC, DECIMAL, DEC, SMALLINT, INTEGER, INT, BIGINT, FLOAT, REAL, DOUBLE_PRECISION
  - SQL Server
    - ANSI/ISO에 맞추어 여러 숫자 타입 제공 + MONEY, SMALLMONEY 등의 숫자 타입도 가짐
  - Oracle
    - NUMBER 만 지원
- **다른 이름 예시**
  - NUMERIC → NUMBER, WINDOW FUNCTION → ANALYTIC/RANK FUNCTION

## 자주 쓰이는 데이터 유형 소개

- **CHARACTER(s)**
  - 고정 길이 문자열 정보 (Oracle, SQL Server 모두 CHAR)
  - 길이(바이트) s는 1 이상 2000 이하 (SQL Server는 8000)
  - 고정 길이 이므로 빈 공간은 공백으로 채워짐
  - 즉, CHAR 유형 `sql@ 'AA' == 'AA '`
- **VARCHAR(s)**
  - 가변 길이 문자열 정보 (Oracle VARCHAR2, SQL Server VARCHAR)
    - ex. `sql@ VARCHAR(40)` 속성의 값 'hello'는 5바이트만 차지함
  - 길이(바이트) s는 1 이상 4000 이하 (SQL Server는 8000)
  - 고정 길이 문자열이 아닌 경우 대다수 VARCHAR가 적합함
  - VARCHAR 유형 `sql@ 'AA' != 'AA '`
- **NUMERIC**
  - 정수, 실수 등 숫자 정보 (Oracle은 NUMBER만, SQL Server는 10가지 이상)
  - Oracle은 정수와 소수의 자리수를 지정하여 표기
    - ex. 전체 8자리, 소수 2자리 >> `sql@ NUMBER(8, 2)`
- **DATETIME**
  - 날짜와 시각 정보 (Oracle은 DATE, SQL Server는 DATETIME)
  - Oracle은 1초 단위, SQL Server는 3.33ms 단위로 관리

---

# CREATE TABLE

> 사실 대다수 기본적인 내용이라 굳이 볼 필요 없음

```sql
CREATE　TABLE　테이블이름 (
  칼럼명1 DATATYPE [DEFAULT 형식],
  칼럼명2 DATATYPE [DEFAULT 형식],
  칼럼명2 DATATYPE [DEFAULT 형식]
) ;
```

- 테이블명은 객체를 의미할 수 있는 적절한 이름 사용
  - 가능한 단수형 권고
- 테이블 명은 다른 테이블의 이름과 중복되지 않아야 함
- 한 테이블 내에서는 컬럼명이 중복되게 지정될 수 없음
- 테이블 이름을 지정하고 각 컬럼들은 괄호 "( )" 로 묶어 지정
  - 각 칼럼들은 콤마 ","로 구분되고, 테이블 생성문의 끝은 항상 세미콜론 ";"
- **컬럼은 데이터베이스 내에서 일관성 있게 사용**하는 것이 좋음 (데이터 표준화 관점)
- 컬럼 뒤에 데이터 유형은 꼭 지정되어야 함
- 테이블명과 컬럼명은 반드시 문자로 시작해야 하고, 벤더별로 길이에 대한 한계가 있음
- 벤더에서 사전에 정의한 예약어(Reserved word)는 쓸 수 없음
- A-Z, a-z, 0-9, \_, $, # 문자만 허용
- 일반적으로 테이블 생성시 대/소문자 구분은 하지 않음
  - 기본적으로 대문자로 만들어지기 때문
  - 단, 구분하는 DB도 있음 (ex. PostgreSQL)
- DATETIME 데이터 유형에는 별도로 크기를 지정하지 않음
- 문자 데이터 유형은 반드시 가질 수 있는 최대 길이를 표시해야 함
- 컬럼과 컬럼의 구분은 콤마로 하되, 마지막 칼럼은 콤마를 찍지 않음
- 컬럼에 대한 제약조건이 있으면 CONSTRAINT를 이용하여 추가할 수 있음

## 제약 조건 (CONSTRAINT)

> 데이터의 무결성을 유지하기 위한 데이터베이스의 보편적인 방법으로 테이블의 특정 칼럼에 설정하는 제약

- 테이블 생성 시 반드시 기술할 필요 없음
  - `sql@ ALTER TABLE`로 추가/수정할 수 있음
  - 단, 이미 데이터가 입려되어 있으면 처리가 어려우니 초기에 설정 권장

## 제약조건의 종류

- **CHECK**
  - 입력 값 범위 제한
  - TRUE or FALSE 평가가 가능한 논리식으로 지정
- **UNIQUE KEY (고유키)**
  - 테이블 각 행을 고유하게 식별할 고유키 정의
  - NULL 값 가능
- **NOT NULL**
  - 해당 컬럼은 NULL 값이 올 수 없음
  - CHECK의 일부분으로 생각할 수 있음
- **PRIMARY KEY (기본키)**
  - PRIMARY KEY = UNIQUE KEY + NOT NULL
  - 테이블 각 행을 고유하게 식별할 기본키 정의
  - 하나의 테이블에는 기본키 하나
  - 기본키 구성 컬럼에는 NULL 입력 불가
- **FOREIGN KEY (외래키)**
  - 테이블 간의 관계 정의 용도
  - 타 테이블의 기본키를 외래키로 생성
  - 지정 시 참조 무결성 제약 옵션 선택 가능
    - A REFERENCES B **ON UPDATE** [옵션] **ON DELETE** [옵션]
      - CASCADE : B 변경 시 A 테이블에서도 수정, 삭제
      - SET NULL : B 변경 시 A 참조하는 값들을 NULL화
      - NO ACTION : B 변경 시 A 변화 없음
      - SET DEFAULT : B 변경 시 A 기본값으로 변경함
      - RESTRICT : A 테이블에 데이터가 남아 있으면 B 테이블의 데이터를 수정(삭제)할 수 없음

## NULL, DEFAULT 의미

> **NULL** : 아직 정의되지 않은 미지의 값, 현재 데이터를 입력하지 못하는 경우를 의미함  
> **DEFAULT** : 기본 값을 사전에 설정하는 역할

- **NULL**
  - ASCII 코드 상 00번
  - 공백이나 숫자 0과 다른 값임
  - 공집합과도 다른 값임
  - Oracle에서는 빈 문자열(`''`)도 NULL로 처리됨
  - SQL Server에서는 오직 NULL만이 NULL임
- **DEFAULT**
  - 지정하지 않은 경우 NULL이 기본 값임

## 생성된 테이블 구조 확인

```sql
-- Oracle
DESC 테이블명;

-- SQL Server
sp_help 'dbo.테이블명'
```

## SELECT 문장을 통한 테이블 생성 사례

```sql
-- Oracle
CREATE TABLE ~ AS SELECT ~

-- SQL Server
SELECT ~ INTO ~
```

- 컬럼 별 데이터 유형을 재정의 하지 않아도 됨
- NOT NULL 외의 제약 조건(기본키, 고유키, ...)은 적용되지 않음
  - SQL Server의 경우, Identity 속성도 같이 적용됨

---

# ALTER TABLE

테이블을 사용하는 도중에 테이블 구조를 변경해야 할 때 사용한다. 주로 컬럼 추가/삭제 또는 제약 조건 추가/삭제 작업을 진행한다.

## ADD COLUMN

> 기존 테이블에 필요한 컬럼 추가

단, 추가되는 컬럼은 테이블의 마지막 컬럼이 되며 위치 지정은 불가하다.

```sql
-- Oracle
ALTER TABLE 테이블명 ADD (추가할_칼럼명 데이터_유형);

-- SQL Server
ALTER TABLE 테이블명 ADD 추가할_칼럼명 데이터_유형;
```

## DROP COLUMN

> 테이블에서 필요 없는 컬럼 삭제

삭제 후에도 테이블에 하나 이상의 컬럼이 존재할 때 삭제할 수 있다.

```sql
ALTER TABLE 테이블명 DROP COLUMN 삭제할_칼럼명;
```

- 데이터 유무에 상관 없이 삭제 가능
- 한 번에 하나의 컬럼 삭제 가능
- 삭제 후 복구 불가

## MODIFY COLUMN

> 컬럼의 데이터 유형, 디폴트 값, NOT NULL 제약 조건에 대한 변경

```sql
-- Oracle
ALTER TABLE 테이블명 MODIFY (
  변경할_칼럼명 데이터_유형 [DEFAULT 식] [NOT NULL],
  변경할_칼럼명 데이터_유형 [DEFAULT 식] [NOT NULL], ...
);

-- SQL Server
ALTER TABLE 테이블명 ALTER (
  변경할_칼럼명 데이터_유형 [DEFAULT 식] [NOT NULL],
  변경할_칼럼명 데이터_유형 [DEFAULT 식] [NOT NULL], ...
);
```

- 고려 사항
  - 데이터가 있을 때는 컬럼 크기 증가 가능, 축소는 불가
    - 기존의 데이터가 훼손될 수 있기 때문
  - 데이터가 없는 경우(NULL 뿐이거나 행 자체가 없는 경우) 축소 가능
  - 해당 칼럼이 NULL 값만을 가지고 있으면 데이터 유형을 변경 가능
  - DEFAULT 값의 변경은 변경 후 삽입되는 행에 적용
    - 기존 값을 바꾸지는 못함
  - 해당 칼럼에 NULL 값이 없을 경우에만 NOT NULL 제약조건을 추가 가능

## RENAME COLUMN

> 컬럼명 변경 시 사용하는 명령어

해당 컬럼과 관계된 제약 조건에 대해서도 자동으로 변경되긴 하지만, 표준(ANSI/ISO) 기능은 아니고 일부 DBMS에서만 지원하는 기능이다.

```sql
-- Oracle
ALTER TABLE 테이블명 RENAME COLUMN OLD_칼럼명 TO NEW_칼럼명;

-- SQL Server
sp_rename 'OLD_칼럼명', 'NEW_칼럼명', 'COLUMN';
-- ex) sp_rename 'dbo.TEAM_TEMP.TEAM_ID', 'TEAM_TEMP_ID', 'COLUMN';
```

## DROP CONSTRAINT

> 테이블 생성 시 부여했던 제약조건 삭제

```sql
ALTER TABLE 테이블명 DROP CONSTRAINT 제약조건명;
```

## ADD CONSTRAINT

> 테이블 생성 이후에 제약 조건을 추가하는 명령어

```sql
ALTER TABLE 테이블명 ADD CONSTRAINT 제약조건명 제약조건 (칼럼명);
-- ex) ALTER TABLE PLAYER ADD CONSTRAINT PLAYER_FK FOREIGN KEY (TEAM_ID) REFERENCES TEAM(TEAM_ID);
```

---

# RENAME TABLE

> 테이블의 이름 변경 명령어

```sql
-- Oracle
RENAME 변경전 테이블명 TO 변경후 테이블명;

-- SQL Server
sp_rename '변경전_테이블명', '변경후_테이블명';
```

---

# DROP TABLE

> 테이블 삭제 명령어

```sql
-- Oracle
DROP TABLE 테이블명 [CASCADE CONSTRAINT];

-- SQL Server
DROP TABLE 테이블명;
```

Oracle의 CASCADE CONSTRAINT는 관련있는 '제약 조건'을 테이블과 함께 삭제한다.
따라서, 삭제될 테이블을 참조하던 테이블은 멀쩡히 존재한다.

SQL Server는 해당 기능이 없으므로 참조하는 테이블을
먼저 삭제하던지 제약 조건을 먼저 제거해야 한다.

---

# TRUNCATE TABLE

> 테이블에 들어있던 모든 행들을 제거하고 저장 공간을 재사용 가능하도록 해제하는 명령어

테이블 구조 변경 없이 데이터를 일괄 삭제하므로 DML로 분류할 수도 있지만, 내부 처리 방식이나 Auto Commit 특성 등으로 인해 DDL로 분류한다.

```sql
TRUNCATE TABLE PLAYER;
```

- 테이블 자체를 삭제하는 게 아니므로 테이블 구조는 남아있음
  - `sql@ DESC` `sql@ sp_help` 적용 가능

---

**참고 자료**

- [DDL - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=338)
