---
title: 정규화
linkTitle: 정규화
weight: 2
layout: wide
cascade:
  type: docs
sidebar:
  open: true
---


08/28
### 프로세스, 스레드
* 프로세스: 독자적 실행 가능
* 스레드: 독자적 존재 불가

### 용어
* 튜플, row, record, 행 (행과 행이 구별이 되야)
* attribute - column, field,  속성, 열
* 카디널리티: 행의개수, 두개의테이블에서: 서로 대응되는 수

* 논리적모델: 물리적모델과 개념적모델중간, 개발자와 사용자 둘다 이해 가능
* 개념적모델: 사용자가 이해가능

### 정규화
* 함수적 종속: 어떤 컬럼으로 다른컬럼을 특정할 수 있는 것
* 부분함수적 종속: 기본키가 두개 이상의 컬럼으로 구성된 경우 어느 하나만으로 다른컬럼을 구분해 낼 때
* 이행적함수적 종속: A가 B 종속하고 B가 C 종속 시 A가 C 종속
* shared lock, exclusive lock

### 복원/복구
* 로그기록: 작업내역 기록 (부분적 복구 가능) 복원느림
* 스냅샷기록: 값을 기록, 여러값 기억 필요, 부분 복구 느림 ex)통장 

### 자료형
* CHAR: char(10)일 때 5글자 할당 시 나머지 5칸 그대로 유지 ex)자주 바뀌는 변수
* VARCHAR:  varchar(10)일때 5글자 할당 시 나머지 5글자 반납, 비효율적, 5글자로 줄었을 때 수정 시 다시 할당해야 -> row migration 가능성 <br>
ex) 자주 바꾸지 않는 변수, ID, 휴대폰번호
* char 불러올 때 trim 필요

* blob, text는 인덱스 설정 불가
* 배열 만들 시 비교 가능한 원소

### table구조변경: ALTER

* 컬럼추가
```sql 
ALTER TABLE 테이블이름 ADD 컬럼이름 자료형 제약조건;
```

* 컬럼삭제
```sql
ALTER TABLE 테이블이름 DROP 컬럼이름;
```

* 컬럼의 이름과 자료형 변경
ALTER TABLE 테이블이름 CHANGE 컬럼이름 새로운컬럼이름 자료형;

* 컬럼의 자료형 변경
ALTER TABLE 테이블이름 MODIFY 컬럼이름 자료형;

* 컬럼의 위치 변경
ALTER TABLE 테이블이름 MODIFY COLUMN 컬럼이름 자료형 FIRST(AFTER 다른컬럼이름);

* 테이블 이름 수정
ALTER TABLE 기존테이블이름 rename 새로운이름;

*  확인: 테이블의 구조를 확인하는 desc 명령

* contact 테이블에 age 칼럼을 정수로 추가
* alter table contact add age int;

* 테이블 삭제
```sql
DROP TABLE 테이블이름;
```

* 테이블의 데이터삭제
```sql 
TRUNCATE TABLE 테이블이름;
```
* 테이블의 구조는 남음

* 테이블을 삭제할 때는 문법에 맞게 작성하고 테이블이 존재해도 실패하는 경우.
* 외래키가 설정된 테이블을 삭제할 때 외래키 옵션이 없는 경우
* 이런 경우에는 부모테이블을 삭제하고 자식 테이블을 삭제
* 외래키를 설정할 때 되도록이면 삭제에 관련된 옵션은 설정을 하는 것이 좋음

### 테이블을 압축해서 생성
* CREATE TABLE을 수행할 때 마지막에 ROW_FORMAT=COMPRESSED 옵션을 추가

## 제약조건 설정
### 1. 종류: NOT NULL 필수입력 
* UNIQUE: 중복된 값X
* PRIMARY KEY: NOT NULL하고 UNIQUE인데 테이블에 1개만 설정 가능
* CHECK제약 조건: 값의 범위나 종류를 설정
* FOREIGN KEY: 외래키 설정

* 제약조건은 아니지만 컬럼을 설정할 때 사용할 수 있는 옵션
* DEFAULT : 기본값 설정
* AUTO_INCREMENT: 1번만 설정가능

* DB에서 NULL이 가능한 경우 1바이트를 추가 할당해서 NULL여부 표현
* name char(10) -> 11바이트
* name char(10) NOT NULL
* ASCII코드0이 NULL

### 컬럼제약조건과 테이블제약조건
* 컬럼제약조건은 컬럼을 만들 때 제약 조건을 설정하는 것이고
* 테이블 제약 조건은 컬럼을 만들어두고 제약 조건을 설정하는 것

```sql
컬럼이름 자료형 [constraint 이름] 제약조건

...
[constraint 이름] 제약조건(컬럼이름)
```
* NOT NULL은 컬럼 제약조건으로만 가능
