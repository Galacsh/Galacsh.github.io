---
date: 2021-09-02 19:41:00
title: "ORDER BY 절"
publish: true
tags: ["DB", "SQLD", "Database"]
---

# ORDER BY

```sql
SELECT 칼럼명 [ALIAS명]
FROM 테이블명
[WHERE 조건식]
[GROUP BY 칼럼(Column)이나 표현식]
[HAVING 그룹조건식]
[ORDER BY 칼럼(Column)이나 표현식 [ASC 또는 DESC]];

-- ASC(Ascending) : 오름차순으로 정렬 (기본 값이므로 생략 가능)
-- DESC(Descending) : 내림차순으로 정렬
```

**Oracle은 NULL을 가장 큰 값**으로 취급하고 **SQL Server는 가장 작은 값**으로 취급한다.
따라서 Oracle은 NULL이 오름차순 상 맨 마지막, SQL Server는 오름차순 상 맨 처음에 출력한다.

## 특징

- 기본적인 정렬 순서는 오름차순(ASC)
- 숫자형 데이터 타입은 오름차순으로 정렬했을 경우에 가장 작은 값부터 출력
- 날짜형 데이터 타입은 오름차순으로 정렬했을 경우 날짜 값이 가장 빠른 값이 먼저 출력
  - ex. ‘01-JAN-2012’는 ‘01-SEP-2012’보다 먼저 출력된다.
  - Oracle에서는 NULL 값을 가장 큰 값으로 간주
  - 반면, SQL Server에서는 NULL 값을 가장 작은 값으로 간주
- 컬럼 순서를 ORDER BY 절에서 컬럼명이나 ALIAS 대신 사용 가능
  - 유지보수성 & 가독성이 떨어지므로 가능한 칼럼명이나 ALIAS 권고
- 컬럼명, ALIAS명, 칼럼 순서 혼용 가능

# SELECT 문장 실행 순서

```sql
5. SELECT 칼럼명 [ALIAS명]
1. FROM 테이블명
2. WHERE 조건식
3. GROUP BY 칼럼(Column)이나 표현식
4. HAVING 그룹조건식
6. ORDER BY 칼럼(Column)이나 표현식;

FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

1. 발췌 대상 테이블을 참조한다. (FROM)
   - 이제 테이블 내 컬럼을 사용할 수 있다.
2. 발췌 대상 데이터가 아닌 것은 제거한다. (WHERE)
3. 행들을 소그룹화 한다. (GROUP BY)
   - 이제 그룹화 기준과, 집계 함수에 사용될 수 있는 컬럼들로 집합을 새로 만든다.
   - 즉, 기존 FROM 절로 가져온 개별 데이터는 저장하지 않는다.
4. 그룹핑된 값의 조건에 맞는 것만을 출력한다. (HAVING)
5. 데이터 값을 출력/계산한다. (SELECT)
   - GROUP BY가 진행되었다면, 그룹핑 기준과 집계 함수만을 사용할 수 있다.
6. 데이터를 정렬한다. (ORDER BY)

위 순서는 옵티마이저가 SQL 문장의 SYNTAX, SEMANTIC 에러를 점검하는 순서이기도 하다.
예를 들면 FROM 절에 정의되지 않은 테이블의 컬럼을 WHERE 절, GROUP BY 절, HAVING 절, SELECT 절, ORDER BY 절에서 사용하면 에러가 발생한다.

---

# ORDER BY 절에서 ROWNUM, TOP

SQL Server에는 없지만 Oracle에는 있는 **ROWNUM**은 실행 순서 상 WHERE 절에서 이미 사용할 수 있다.
따라서 **ORDER BY는 ROWNUM이 부여된 상태에서 정렬**하게 된다.

결과적으로 다음과 같은 실수를 하기 좋다.

```sql
SELECT STUDENT_NAME FROM STUDENT
WHERE ROWNUM <= 3
ORDER BY SCORE DESC;
```

위 SQL 문은 그냥 무작위로 학생 3명 뽑아서 성적 순으로 정렬한 것이다.

반대로 SQL Server의 **TOP은 ORDER BY 이후에 처리**되므로 다음과 같이 실행하면 원하는 결과를 얻을 수 있다.

```sql
SELECT TOP (3) STUDENT_NAME FROM STUDENT
ORDER BY SCORE DESC;
```

---

**참고 자료**

- [ORDER BY 절 - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/sql/?pageid=4&mod=document&uid=344)
