---
title: DML
linkTitle: DML
weight: 3
layout: wide
cascade:
  type: docs
sidebar:
  open: true
---

08/29
### DML: 데이터 조작 언어
* 예전에는 SELECT를포함시켰는데 최근에는 DQL로 분리

## 데이터 삽입 - INSERT
### 기본 형식
* INSERT INTO 테이블이름(필드목록) VALUES(데이터나열)
* INTO는 생략가능
* 필드목록을 생략할 수 있는데 이 경우에는 테이블을 만들 때 작성한 순서대로 모든 필드의 값을 대입해야

### INSERT, DELETE, UPDATE만을 DML로 분류
* mariadb 는 ""사용해도 삽입가능, DATE입력 시 ' '로 사용해도 삽입 가능
* 여러개의 데이터를 한꺼번에 삽입: DBMS 종류에 따라 허용하지 않는 경우도 있음
```sql 
INSERT INTO 테이블이름(필드목록) VALUES
(데이터나열)
(데이터나열)
(데이터나열)
```
* 조회문장을 이용해서 데이터를 삽입
* INSERT INTO 테이블이름(필드목록) SELECT 구문;
* 데이터 복사도 가능하고 구조 복사도 가능
* SQL Injection공격 조심 X or 1=1
* 무조건 참이 되는 문장을 삽입

### IGNORE
* 스크립트를 이용해 데이터 삽입 시 중간에 에러가 발생해도 데이터 삽입하고자 하는 경우는 INSERT 다음에 IGNORE 추가해주면 됨
```sql
CREATE TABLE espa(
userid varchar(20) primary key,
name varchar(20)
);
```
* ignore 추가시 스크립트로 실행 시 중간에 에러나도 계속 수행
```sql
INSERT ignore INTO espa values('karina', '카리나');
INSERT ignore INTO espa values('winter', '윈터');
INSERT ignore INTO espa values('winter', '윈터');
INSERT ignore INTO espa values('aeri', '지젤');
```
* 여러 개의 구문을 실행할 때 별개의 스레드로 실행하는 것을 고려, 수행 중 실패해도 계속 수행하게 하기위해

## 데이터 삭제 - DELETE
### 기본 형식
```sql
DELETE FROM 테이블이름 [WHERE 조건];
```
* FROM을 생략해도 삭제가 되는 경우가 있음
* 문법에 맞게 작성을 하더라도 실패하는 경우가 있는데 이 경우는 외래키 설정을 확인
* WHERE 절이 없으면 테이블의 모든 데이터가 삭제
* 실무에서 사용할 때는 DELETE에 트리거를 걸어 DELETE가 발생할 때 다른 테이블에 데이터를 옮기거나 삭제가 되었다는 표시만 하기도 함

## 데이터수정 - UPDATE
### 기본형식
```sql
UPDATE 테이블이름 SET 수정할내용 [WHERE 조건];
```
* WHERE 절이 없으면 모든 데이터가 수정됨
* 결과를 확인할 때는 성공 여부보다는 영향받은 행의 개수를 확인하는 것이 좋음

## Transaction
* 한번에 수행되어야하는 논리적인 작업의 단위
* 관계형 데이터베이스에서는 하나의 SQL 문장이 물리적인 단위

### 1 특성
* Atomicity - 트랜잭션은 ALL or NOTHING의 형태로 수행되어야. 부분적으로 수행되면 안됨
* Consistency - 트랜잭션의 수행 결과는 일관성이 있어야 한다
* Isolation - 트랜잭션은 다른 트랜잭션과 분리되서 실행되어야 한다
* Durability - 한 번 완료된 트랜잭션은 계속되어야 한다.( 바꾸기 안됨)

### 2 임시 작업 영역
* 데이터베이스 작업은 원본에 직접 하는 것이 아니고 복사본을 만든 후 복사본에 작업을 수행하고 이 후에 원본에 적용 <br>
이러한 복사본이 임시 작업 영역 <br>
임시 작업 영역을 Undo Segment나 Rollback Segment라고 함 <br>

### 3 트랜잭션 관련 명령어
* COMMIT, ROLLBACK, SAVEPOINT

### 4 기타
* 트랜잭션은 DML문장이나 DCL 문장이 처음 성공할 때 생성
* 트랜잭션 소멸 시점은 COMMIT이나 ROLLBACK 될 때
* COMMIT은 임시 작업 영역에 수행한 내용을 원본에 반영하는 것, ROLLBACK은 임시작업영역의 데이터를 삭제하는 것 
* 특정 시점으로 돌아가려면 SAVEPOINT를 이용해서 시점을 만들어 줘야함
* SAVEPOINT가 없으면 임시 작업 영역의 데이터는 버려짐

### COMMIT 되는 경우
* DDL이나 DLC 명령문을 성공하는 경우
* 명시적으로 COMMIT명령을 수행하는 경우
* 데이터베이스 서버나 접속 프로그램을 정상적으로 종료한 경우
* 접속 프로그램이나 데이터베이스 설정을 auto commit으로 하는 경우 SQL 문장이 성공적으로 수행되면 자동으로 COMMIT
* Java는 기본적으로 auto commit

### ROLLBACK되는경우
* 명시적으로 ROLLBACK명령을 수행하는 경우
* 비정상적인 종료
* SAVEPOINT를 만들고자 하는 경우 SAVEPOINT 이름
* 특정 SAVEPOINT로 롤백하고자 하는 경우는 ROLLBACK TO 이름

## VIEW
### 1 INLINE VIEW
* FROM 절에 사용한 서브쿼리를 이용해 만들어진 테이블
* INLINE VIEW는 이름이 없기 때문에 반드시 이름을 설정해 주어야 함

### 2 VIEW
* 물리적인 테이블에 근거하는 가상 테이블
* 사용하는 자체는 테이블과 동일하지만 실제로 존재하지 않음
* 기본 테이블이나 다른 뷰로부터 SELECT 구문을 이용해서 생성
* SQL 문장을 메모리에 저장해두었다가 VIEW를 사용할 때 수행해서 테이블처럼 사용

### 목적
* 실행속도 향상
* 보안이 우수

### 주의
* VIEW에 DML 작업가능(제한적으로)
* VIEW에 DML 작업을 수행하면 원본 테이블에 작업을 수행

### 생성 방법
* CREATE VIEW AS SELECT 구문 옵션
* 옵션: WITH CHECK OPTION과 READ ONLY
* VIEW는 수정불가, ALTER VIEW 명령은 없음
* 대부분의 상용 데이터베이스에서 CREATE 다음에 OR REPLACE를 추가해서 존재하는 경우 다시 만들도록 해주는 기능을 제공

### 3 임시 테이블
* 테이블을 만들 때 CREATE 다음에 TEMPORARY를 추가하면 임시 테이블로 생성
* 사용법은 일반 테이블과 동일
* 세션 내에서만 동작
* 세션이 닫히면 자동으로 삭제, 임시 테이블은 생성한 클라이언트에서만 접근 가능
* 기존 테이블과 동일한 이름으로 만들 수있는데 이렇게 하면 기존 테이블은 그대로 두고 임시테이블이 만들어짐. 임시 테이블 제거 전까지는 원본 테이블 사용 불가
* create temporary table T2(name varchar(20));

### 저장 프로시져와 트리거
* 저장 프로시저: 자주 사용하는 SQL구문을 하나의 이름으로 묶어두고 이름을 호출해서 SQL구문을 실행하도록 하는 것
* 프로그래밍 언어에서는 함수와 유사

* 트리거 삽입, 삭제, 갱신을 수행하기 전이나 수행 한 후에 다른 작업을 하도록 하기 위한 객체
* 특정 조건에 맞지 않으면 삽입이나 갱신을 하지 못하도록 하거나 삽입이나 삭제 작업을 할 때 다른 테이블에 작업을 수행하도록 하거나 로깅에 사용
* 시간을 설정해서 특정 시간에만 동작하도록 하는 것도 가능

* 프로그래밍 영역이어서 RDBMS마다 작성하는 방법이 다름
* Oracle에서 이 작업을 하기 위한 문법은 PL/SQL이라고 부름
* MS SQL Server에서는 T-SQL이라 부름

### 인덱스 생성
```sql 
create [or replace] [unique] index [if not exists] 인덱스이름 [인덱스종류]
ON 테이블이름(컬럼이름나열) 
[WAIT n|NOWAIT][인덱스옵션][알고리즘 및 락 옵션]
락옵션: 쉐어드락, exclusive lock(하나만 사용가능)
```

### 인덱스를 생성하는 경우
* 테이블의 행의 개수가 많을 때
* where 절에 자주 사용되는 경우
* 검색 결과가 2-4% 정도 되는 경우
* JOIN에 자주 사용되거나 NULL이 많은 경우

### 인덱스를 생성하지 않는 경우
* 테이블 행 개수가 적을 때
* 중복되는 데이터가 많을때
* where절에 잘 사용이 되지 않는 경우
* 검색결과가 10% 이상인 경우
* DML 작업이 많은 경우

### FULL TABLE SCAN-테이블들의 데이터를 전부 읽는 것
* SQL 문장에서 WHERE 절이 생략된 경우
* WHERE 절에 사용되는 컬럼에 INDEX가 만들어지지 않는 경우
* 병렬로 처리하는 경우
* 데이터베이스르 만들 때 전체 테이블 스캔을 하려고 힌트를 설정한 경

### bin폴더
* 실행 명령 파일 존재
* 백업이나 검색 결과를 내보내는 기능을 테스트할 때는 디렉토리가 만들어져 있어야 하고 쓰기 권한이 있어야 함
```sql
select * into outfile 'c:\\emp.dat' from `emp`;
```

### 백업
```bash
mysqldump -u root -p wnddkd --all-databases > ex.sql
```

### 복원
```bash
mysql -u root -p dbex < dbex.sql
```