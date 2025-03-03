---
title: MariaDB
linkTitle: MariaDB
weight: 1
---

08/26, 08/27

* proxy server: outbound
* firewall : inbound
* oracle 사용시 비예약어는 case-sensitive
* mariadb x case-sensitive

* docker ps -a docker ps
* db server: 물리적으로 컴퓨터 1대 이상
* db서버에서는 db작업x , 접속프로그램 사용
* 접속프로그램: api서버 이용해 사용자가 일반적으로 사용
* 오픈api: 개발자가 api 사용하게 해줌
* utf8-mb4: 이모지

### DDL, DML, DCL
* ddl: select
* dml:
* dcl: grant, revoke (operator, cloud engineer)
* dcL: commit, rollback, savepoint (개발자)

## 관리기능 (operator)

* mysql: root가 db 생성
* oracle: user가 db 생성

### db생성
```sql
create database 이름;
```

### db 사용
```sql
use 이름;
```

* null: 가르키는게 없다
* undefined: 정의되지 않음

### 쿼리 실행순서
* 5 select : 열단위추출
1 from <br>
2 where : 테이블에 조건 적용해 행단위 추출 <br>
3 group by : where 절 결과 그룹화 <br>
4 having : 그룹화 이후 행단위 추출 <br>
6 order by : 정렬 <br>
7 limit : 추출하고자 하는 데이터의 행 설정 <br>

## distinct, group by, LIKE, IN

* and 사용 시 더 적은 행이 앞에
* or 은 더 많은행이 앞에

### LIKE 
* %: 글자수상관X
* _: 1글자

### BETWEEN
* a between b (a<=x<=b)

### IN

* 집계함수는 그룹화 한 이후에 사용이 가능
* 집계함수는 NULL 데이터는 제외하고 연산
* count(AGE): 2
* count(*): 모든 컬럼이 NULL인 경우 제외
* 표준 SQL에서는 GROUP BY를 사용하는 경우 SELECT 절에는 GROUP BY에 사용한 컬럼과 집계함수를 이용한 데이터만 기재가능
* mysql/mariadb는 GROUP BY 이외의 컬럼을 SELECT에 사용가능, 첫번째 데이터가 출력

* having 은 group by 다음

### SUBQUERY
* 다른 쿼리 안의 쿼리
* 한번만 실행
* ( ) 로 감싸야
* WHERE, FROM(Inline View), INSERT, DELETE, UPDATE절에 사용가능
* 단일행 서브쿼리(반드시 1개행 리턴)와 다중행 서브쿼리(2개 이상 행 리턴)로 분류
* 다중행 서브쿼리는 단일행 연산자(=, <>, >, <, >=, <=) 사용불가
* 다중 행 서브 쿼리는 IN, ANY, ALL, EXIST 같은 다중 행 연산자 사용

* SELECT 절에서 출력해야 하는 컬럼이나 연산식이 2개 이상의 테이블의 컬럼을 이용하는 경우 서브쿼리 사용 불가

* 테이블을 합쳐서 조회
* 수직적으로 합치기 : SET
* 테이블의 구조는 다르지만 동일한 의미 갖는 컬럼 존재해 이 컬럼 기준으로 수평 합치기 : JOIN

### JOIN 종류
* cartesian product : 조인 조건 없이 from 절에 테이블 이름 두개 이상 기재한 경우
* equi join : =연산자 사용
* non equi join : =이외 연산자 사용 컬럼 비교 시
* inner join : equi join과 동일, 양쪽 테이블 모두에 존재하는 데이터만 결합
* outer join : 한쪽 테이블에만 존재하는 데이터도 결합(left, right, full)
* self join : 동일한 테이블 조인, 테이블 이름 수정 필요, 하나의 테이블에 동일한 컬럼이 2개 이상 존재하는 경우 사용
* natural join : 조인 조건에 해당하는 컬럼의 이름이 같은 경우 생략
* ansi join: cross join, cartesian product, from 테이블이름 cross join 테이블이름 <br>

* 조인 조건에서 컬럼이름이 동일한 경우는 on 대신 using이라고 쓰고 조인이름만 기술하는 것도 가능
* 이 경우 조인 조건을 생략하고 inner 대신에 natural을 붙여도 됩니다.. 이경우에는 조인에 참여하는 컬럼이 한번만 출력됩니다.
```sql
select ename, dname, loc from emp inner join dept on emp.deptno=dept.deptno;
select ename, dname, loc from emp inner join dept using (deptno);
select ename, dname, loc from emp natural join dept;
```