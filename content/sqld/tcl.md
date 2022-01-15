---
date: 2021-08-31 19:52:00
title: "TCL"
publish: true
tags: ["DB", "SQLD", "Database"]
---

데이터베이스 응용 프로그램은 트랜잭션의 집합이라 할 수 있다.

- **트랜잭션**
  - 데이터베이스의 논리적 연산 단위
    - 분할할 수 없는 최소의 단위
    - 전부 적용하거나 전부 취소 (All or Nothing)
  - 밀접히 관련되어 분리될 수 없는 한 개 이상의 데이터베이스 조작
    - UPDATE, INSERT, DELETE (데이터 수정하는 DML)
    - SELECT FOR UPDATE 등 배타적 Lock을 요구하는 SELECT문
  - 하나의 트랜잭션에는 하나 이상의 SQL 문장
- **TCL (Transaction Control Language)**
  - ROLLBACK, COMMIT, SAVEPOINT

# 트랜잭션 특성

> **ACID** : 원자성, 일관성, 고립성, 지속성

- **원자성 (Atomicity)**
  - 모두 성공하던지 전혀 실행되지 않은 상태
  - All or Nothing
- **일관성 (Consistency)**
  - 트랜잭션 실행 전 DB 내용이 잘못되어 있지 않으면 실행 후에도 잘못되어 있지 않음
- **고립성 (Isolation)**
  - 다른 트랜잭션의 영향으로 잘못된 결과가 나오지 않음
- **지속성 (Durability)**
  - 갱신된 내용은 영구적 저장

트랜잭션이 수행되는 동안 특정 데이터에 대해서 다른 트랜잭션이 동시에 접근하지 못하도록 제한하는
잠금(Locking)은 이러한 트랜잭션 특성들을 충족하기 위해 존재한다.

잠금이 걸린 데이터는 잠금을 건 트랜잭션만이 해제할 수 있다.

---

# COMMIT과 ROLLBACK

COMMIT과 ROLLBACK을 통해서 다음과 같은 효과를 볼 수 있다.

- 데이터 무결성 보장
- 영구적인 변경을 하기 전에 데이터의 변경 사항 확인
- 논리적으로 연관된 작업을 그룹핑하여 처리

## COMMIT

> 트랜잭션이 수행된 것을 실제로 반영함

- **COMMIT 이전 데이터 상태**
  - 단지 메모리 버퍼에만 영향을 받았으므로 이전 상태로 복구 가능
  - 현재 사용자는 SELECT 문장으로 결과를 확인 가능
  - 다른 사용자는 현재 사용자가 수행한 명령의 결과를 볼 수 없음
  - 변경된 행은 잠금(LOCKING)이 설정되어서 다른 사용자가 변경할 수 없다.
- **COMMIT 이후 데이터 상태**
  - 데이터에 대한 변경 사항이 데이터베이스에 반영
  - 이전 데이터는 영원히 잃어버림
  - 모든 사용자는 결과를 볼 수 있음
  - 관련된 행에 대한 잠금(LOCKING)이 풀려 다른 사용자들이 행을 조작할 수 있음

**DDL 문장의 COMMIT**  
CREATE, ALTER, DROP, RENAME, TRUNCATE TABLE 등 DDL 문장을 실행하면 그 전후 시점에 자동으로 커밋된다. 즉, DML 문장 이후에 커밋 없이 DDL 문장이 실행되면 DDL 수행 전에 자동으로 커밋된다.

또한 데이터베이스를 정상적으로 접속을 종료하면 자동으로 트랜잭션이 커밋된다.

### \* SQL Server의 COMMIT

> 기본이 AUTO COMMIT 모드

- Oracle은 명시적으로 COMMIT/ROLLBACK 해주어야 트랜잭션 종료
  - 사용자가 직접 트랜잭션을 시작해주지 않더라도 DBMS가 시작을 처리함
- SQL Server는 기본적으로 AUTO COMMIT 모드

SQL Server에서의 트랜잭션은 기본적으로 3가지 방식이 있다.

- **AUTO COMMIT**
  - DML 성공 시 자동 COMMIT
  - DML 오류 발생 시 자동 ROLLBACK
- **암시적 트랜잭션 (Implicit Transaction)**
  - Oracle과 동일
  - 트랜잭션의 시작은 DBMS가 처리
  - 트랜잭션의 종료는 사용자가 명시적으로 COMMIT/ROLLBACK 해야 함
  - 인스턴스 or 세션 단위 설정 가능
- **명시적 트랜잭션 (Explicit Transaction)**
  - 트랜잭션의 시작과 끝을 모두 사용자가 명시적으로 지정
  - `sql@ BEGIN TRANSACTION` `sql@ COMMIT` `sql@ ROLLBACK`
  - `sql@ ROLLBACK` 구문을 만나면 최초의 `sql@ BEGIN TRANSACTION`까지 수행됨

## ROLLBACK

> 트랜잭션 중 COMMIT 이전 변경 사항을 취소함

ROLLBACK 수행 시 관련된 행에 대한 잠금(LOCKING)이 풀리고 다른 사용자들이 데이터 변경을 할 수 있게 된다.

- **ROLLBACK 후의 데이터 상태**
  - 데이터에 대한 변경 사항은 취소됨
  - 이전 데이터는 다시 재저장
  - 관련된 행에 대한 잠금(LOCKING)이 풀리고, 다른 사용자들이 행을 조작할 수 있음

참고로, 애플리케이션의 이상 종료로 데이터베이스와의 접속이 단절되었을 때는 트랜잭션이 자동으로 롤백된다.

### \* SQL Server의 ROLLBACK

> SQL Server는 AUTO COMMIT이 기본 방식이므로 명시적으로 ROLLBACK을 수행하려면 명시적으로 트랜잭션을 선언해야 함

다만, 애플리케이션의 이상 종료로 데이터베이스(인스턴스)와의 접속이 단절되었을 때는 트랜잭션이 자동으로 롤백되는 것은 Oracle과 동일하다.

---

# SAVEPOINT

> 전체 작업이 아닌 현 시점에서 SAVEPOINT까지 트랜잭션의 일부만 롤백

복잡한 대규모 트랜잭션에서 에러가 발생했을 때 SAVEPOINT까지의 트랜잭션만 롤백하고 실패한 부분에 대해서만 다시 실행할 수 있다.

- 복수의 저장점 정의 가능
- 동일 이름으로 저장점을 정의했을 때는 나중에 정의한 저장점이 유효
- 저장점이 있음에도 지정하지 않고 `sql@ ROLLBACK` 만 하는 경우, 트랜잭션 시작 위치로 돌아감

```sql
-- Oracle
SAVEPOINT SVPT1;

-- SQL Server
SAVE TRANSACTION SVPT1;
```

저장점까지 롤백할 때는 ROLLBACK 뒤에 저장점 명을 지정한다.

```sql
-- Oracle
ROLLBACK TO SVPT1;

-- SQL Server
ROLLBACK TRANSACTION SVPT1;
```

---

**참고 자료**

- [TCL - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=340)
