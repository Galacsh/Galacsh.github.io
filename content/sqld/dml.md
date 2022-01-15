---
date: 2021-08-31 18:27:00
title: "DML"
publish: true
tags: ["DB", "SQLD", "Database"]
---

# DML

DML(Data Manipulation Language)는 테이블에 관리하기를 원하는 자료들을 입력, 수정, 삭제, 조회하는 명령어들이라고 생각하면 된다.

## INSERT

> 테이블에 데이터를 **입력**하는 명령어

```sql
-- 컬럼을 지정하여 값을 넣는 유형
---- 컬럼 순서는 상관 없음
---- 정의하지 않은 컬럼은 자동으로 NULL이 삽입됨
INSERT INTO 테이블명 (COLUMN_LIST)
VALUES (COLUMN_LIST에 넣을 VALUE_LIST);

-- 전체 컬럼에 대한 값을 넣는 유형
---- 컬럼 순서를 맞춰야 함
INSERT INTO 테이블명
VALUES (전체 COLUMN에 넣을 VALUE_LIST);
```

명시한 컬럼과 Value를 1:1로 매핑하여 작성한다.

- 문자 유형은 `sql@ '문자 유형'` 따옴표로 입력
- Primary Key나 NOT NULL 컬럼은 반드시 값이 필요함

**(참고)** Oracle에서는 NULL을 `sql@ ''`과 같이 명시할 수 있다.

## UPDATE

> 테이블에 입력된 정보를 **수정**하는 명령어

```sql
UPDATE 테이블명
SET 수정할_칼럼명 = NEW_값
WHERE [수정할 행 선별 조건];
```

WHERE 절이 없으면 테이블 내 전체 행에 대하여 실행된다.

## DELETE

> 테이블에 입력된 정보를 **삭제**하는 명령어

FROM 문구는 생략이 가능한 키워드이며, 뒤에서 배울 WHERE 절을 사용하지 않는다면 테이블의 전체 데이터가 삭제된다.

```sql
DELETE [FROM] 삭제할_정보가_있는_테이블명
WHERE [삭제할 행 선별 조건];
```

FROM은 생략이 가능한 키워드이며, 마찬가지로 WHERE 절이 없으면 전체 행에 대하여 실행된다.

## SELECT

> 테이블에 입력된 자료들을 조회하는 명령어

```sql
SELECT [ALL or DISTINCT] 조회할_컬럼_리스트
FROM 테이블
WHERE [조회_조건];
```

- **ALL**
  - ALL, DISTINCT 모두 명시하지 않았을 때의 기본 옵션
  - 중복된 데이터가 있어도 모두 출력
- **DISTINCT**
  - 중복된 데이터가 있는 경우 1건으로 처리하여 출력

조회할 컬럼 리스트를 모두 적지 않고, 모든 컬럼 정보를 보고 싶을 경우에는 **와일드카드(Wildcard)**로 Asterisk(`*`)를 사용하여 조회할 수 있다.

```sql
SELECT * FROM 테이블명;
```

‎

조회된 결과는 기본적으로 컬럼명이 출력된다.
이때 별명을 지정하여 출력되는 컬럼명을 변경할 수 있으며, AS 키워드를 이용한다.

```sql
-- 공백이나 특수 문자가 없는 경우
SELECT
  PLAYER_NAME AS 선수명
  , HEIGHT as 키
  , WEIGHT 몸무게
FROM 테이블명;

-- Oracle
-- 공백이나 특수 문자가 있는 경우
SELECT
  PLAYER_NAME AS "선수 이름"
  , HEIGHT as "선수 키"
  , WEIGHT "선수 몸무게"
FROM 테이블명;

-- SQL Server
-- 공백이나 특수 문자가 있는 경우
SELECT
  PLAYER_NAME AS "선수 이름"
  , HEIGHT as '선수 키'
  , WEIGHT [선수 몸무게]
FROM 테이블명;
```

### 산술 연산자와 합성 연산자

- **산술 연산자**
  - 종류 : (), \*, /, +, -
  - 우선순위는 적힌 순서와 같음

산술 연산자나 특정 함수를 사용하여 조회한 경우에는 ALIAS를 지정하는 것이 좋다.

- **합성(CONCATENATION) 연산자**
  - 문자와 문자를 연결
  - Oracle은 두개의 수직바(||) 이용
  - SQL Server는 더하기(+) 이용
  - 두 벤더 모두 `sql@ CONCAT('문자열1', '문자열2')` 함수를 지원함

다음과 같이 컬럼과 컬럼을 연결하는 것도 가능하다.

```sql
-- Oracle
SELECT
  PLAYER_NAME || '선수,' ||
  HEIGHT || 'cm,' ||
  WEIGHT || 'kg'
체격정보 FROM PLAYER;

-- SQL Server
SELECT
  PLAYER_NAME +'선수,' +
  HEIGHT + 'cm,' +
  WEIGHT + 'kg'
체격정보 FROM PLAYER;
```

| 체격정보                |
| ----------------------- |
| 정경량선수,173cm,65kg   |
| 정은익선수,176cm,63kg   |
| 레오마르선수,183cm,77kg |
| 명재용선수,173cm,63kg   |
| 변재섭선수,170cm,63kg   |
| 보띠선수,174cm,68kg     |
| ...                     |

---

# DDL vs DML

- **DDL**
  - CREATE, ALTER, RENAME, DROP
  - 직접 테이블에 영향을 미치므로 즉시(AUTO COMMIT) 완료
- **DML**
  - INSERT, UPDATE, DELETE, SELECT
  - 테이블을 메모리 버퍼에 올려놓고 작업하여 실시간으로 테이블에 영향을 미치지 않음
  - 실제 테이블에 반영되기 위해서는 COMMIT 명령어를 입력하여 TRANSACTION을 종료해야 함

단, SQL Server의 경우는 DML의 경우도 AUTO COMMIT으로 처리되기 때문에 실제 테이블에 반영하기 위해 COMMIT 명령어를 입력할 필요가 없다.

---

# DELETE vs TRUNCATE

> 빠르고 저장 공간을 해제하는 TRUNCATE, ROLLBACK이 가능한 DELETE

- 테이블 내 데이터 삭제는 시스템 부하가 적은 TRUNCATE 권고
- **DELETE**
  - ROLLBACK ⭕️
  - 저장 공간 해제 ❌
  - 시스템 부하가 있음
  - 삭제된 데이터를 로그로 저장함
- **TRUNCATE**
  - ROLLBACK ❌
    - SQL Server는 트랜잭션 내라면 가능
  - 저장 공간 해제 ⭕️
  - 시스템 부하가 적음

---

**참고 자료**

- [DML - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=339)
