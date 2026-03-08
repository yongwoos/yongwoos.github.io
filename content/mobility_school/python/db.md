---
title: 데이터베이스 연동
weight: 10
---
### 데이터베이스 연동 방식
- 드라이버를 직접 이용해서 SQL이나 함수를 이용해서 프로그래밍 하는 방식: 파이썬은 튜플로 데이터가 전송
- 데이터베이스 프레임워크를 이용하는 방식
  - SQL Mapper를 이용하는 방식
    - SQL을 전송해서 클래스의 인스턴스를 매핑시켜 사용
    - 사용하기가 쉬움 - 대다수의 개발자는 SQL에 익숙
    - ORM에 비해 성능이 떨어지고 유지보수 어려움
    - SI에서 선호
  - ORM(Object Relation Mapping)을 이용하는 방식
    - 데이터베이스 테이블을 인스턴스와 매핑시켜서 사용하는 방식
    - SQL이나 자신만의 query를 사용할 수 있고 간단한 함수를 이용해서 CRUD 작업이 가능
    - 복잡한 SQL의 경우 DB구조를 알지 못하면 어려움
    - SQL Mapper 방식에 비해서 성능이 우수하지만 사용이 어려움
    - 솔루션 업체들은 이 방식을 선호
    - 근본적으로 ORM은 관계형 데이터베이스와만 연동이 가능하지만 최근에는 NoSQL도 이 구조로 사용이 가능

### MariaDB 연동
- 사용할 MariaDB 정보를 확인
  - url
  - port
  - 사용자 계정
  - 비밀번호
  - 데이터베이스
- 사용할 데이터베이스 드라이버를 설치: MySQL(MariDB) `pip install pymysql`
- 접속 확인
```python
import pymysql
con = pymysql.connect(host="데이터베이스 url", port=포트번호, user="계정", passwd="비밀번호", db="데이터베이스이름"), charset="인코딩방식")
```
- 포트번호는 기본 포트번호인 경우 생략이 가능
- 샘플테이블 생성
```sql
create table usertbl(
userid char(15) not null primary key,
name varchar(20) not null,
birthyear int not null,
addr char(100),
mobile char(11),
mdate date
);
```
- 샘플 데이터 삽입
```sql
insert into usertbl values('ailee', '에일리', 1989, '미국', '0100000000', '1989-05-30')

commit;

select * from usertbl;
```
- DML 문장 수행
  - 데이터베이스 연결
  - 연결 함수로부터 리턴받은 연결 객체를 가지고 `cursor()`를 호출해서 SQL 실행 객체를 리턴받음
  - `SQL실행객체.execute(SQL문장)`
  - 연결 객체가 `commit()`을 호출하면 작업 내역이 반영되고 `rollback()`을 호출하면 작업 취소

```python
import pymysql

try:
    # 데이터베이스 연결
    con = pymysql.connect(host="127.0.0.1", port=3306,
                    user="root", passwd="0000", db="mysql")
    # SQL 실행 객체 생성
    cursor = con.cursor()

    # SQL 실행
    # SQL 문장을 사용할 때 직접 값을 매핑하는 구조는 비추천
    # SQL INJECTION의 대상이 될 수 있음
    # cursor.execute("insert into usertbl values('liyh', 'syk', 1990, 'seoul', '010101010', '1923-09-23')")
    # cursor.execute("insert into usertbl values(%s, %s, %s, %s, %s, %s)", ('sohye', 'sss', 2024, 'seoul', '010101010', '1923-09-23'))
    cursor.execute("select * from usertbl where name= %s", ('ailee'))

    datas = cursor.fetchall()
    
    # DML 수행한 내용을 원본 데이터베이스에 반영
    print(datas)
    con.commit()

    print("삽입 성공")
except Exception as e:
    print(e)
finally:
    con.close()
```
- SQL을 직접 사용하는 경우 SQL에 값을 직접 대입하지 말고 %s로 설정한 후 나중에 튜플로 대입하는 것을 권장
- DQL 수행
  - execute 문장을 실행하고 cursor 객체를 가지고 fetchall을 호출하면 튜플의 튜플로 결과가 리턴되고 fetchone을 호출하면 하나의 튜플만 리턴
- 프로시져 실행
```sql
DELIMITER //
create procedure myproc(_userid CHAR(15), _name VARCHAR(20), _birthyear int, _addr CHAR(10), _mobile CHAR(11), _mdate date)

begin
	insert into usertbl values(_userid, _name, _birthyear, _addr, _mobile, _mdate);
end //
DELIMITER ;

```
- 파이썬에서 실행
```python
# 데이터 삽입 프로시저 실행
cursor.callproc("myproc", args = ("momo", "mo", 1996, "tokyo", "010101010", "1996-03-22"))
```
- 데이터베이스에 파일을 저장 방법
- 파일의 내용을 데이터베이스에 저장
  - 파일을 데이터베이스에 저장하는 것이 비용 부담이 더 큼
  - 수정이나 삭제 등 편집 작업에 편리

- 파일은 다른 저장소에 저장해두고 파일의 경로를 데이터베이스에 저장
  - 수정이나 삭제를 할 때 데이터베이스 뿐만 아니라 파일 저장소도 수정이나 삭제
  - 현재 국내에 나온 교재들은 전부 이 방법을 사용

- BLOB(Large of Binary) 타입을 이용해서 파일을 데이터베이스에 저장하고 읽기
  - blob타입의 데이터를 생성할 수 있음
```python
import pymysql

try:
    # 데이터베이스 연결
    con = pymysql.connect(host="127.0.0.1", port=3306,
                    user="root", passwd="0000", db="mysql")
    # SQL 실행 객체 생성
    cursor = con.cursor()

    # 삽입할 파일의 내용 읽어오기
    filename = "./images.jpg"
    f = open(filename, 'rb')
    photo = f.read()
    f.close()

    cursor.execute('insert into blobtable values(%s, %s, %s)', args=('spongebob', filename, photo))
    con.commit()

    print("삽입 성공")
except Exception as e:
    print(e)
finally:
    con.close()
```
```python
import pymysql

try:
    # 데이터베이스 연결
    con = pymysql.connect(host="127.0.0.1", port=3306,
                    user="root", passwd="0000", db="mysql")
    # SQL 실행 객체 생성
    cursor = con.cursor()


    # 테이블의 전체 데이터를 읽어오기
    cursor.execute('select * from blobtable')
    datas = cursor.fetchall()
    for data in datas:
        f = open(data[1], 'wb')
        f.write(data[2])
        f.close()
    con.commit()

    print("삽입 성공")
except Exception as e:
    print(e)
finally:
    con.close()
```

### MongoDB 연동
- 드라이버를 설치: pymongo
- 서버 연결 객체 생성
  - 이름 = `pymongo.MongoClient("서버 IP", 포트번호)`
- 데이터베이스 연결
  - `이름 = 연결객체.데이터베이스이름`
  - 없으면 생성
- 컬렉션 연결
  - `이름 = 데이터베이스.컬렉션이름`
  - 없으면 생성
```python
from pymongo import MongoClient

try:
    # 데이터베이스 연결
    con = MongoClient('127.0.0.1', 27017)
    # 데이터베이스 생성 및 연결과 컬렉션 생성 및 연결
    db = con.mymongo
    collect = db.users

    doc1 = {'empno':'10001', 'name':'kim', 'phone':'010-1111-1111', 'addr':'서울'}
    doc2 = {'empno':'10002', 'name':'kim', 'phone':'010-1111-1111', 'addr':'서울'}
    doc3 = {'empno':'10003', 'name':'kim', 'phone':'010-1111-1111', 'addr':'서울'}

    collect.insert_one(doc1)
    collect.insert_many([doc2, doc3])

except Exception as e:
    print(e)
```

- 데이터 삽입
  - `insert_one`이나 `insert_many`를 이용해서 삽입
  - 파이썬에서도 동일
  - `dict`로 객체를 만들어서 `insert_one`으로 삽입하거나 `dict` 리스트를 만들어서 `insert_many`를 이용해서 삽입하면 됨

- 데이터 읽기
  - find와 find_one 함수를 이용
  - 결과를 튜플로 리턴
```python
from pymongo import MongoClient

try:
    # 데이터베이스 연결
    con = MongoClient('127.0.0.1', 27017)
    # 데이터베이스 생성 및 연결과 컬렉션 생성 및 연결
    db = con.mymongo
    collect = db.users

    # 데이터 조회
    # Python과 node 에서는 mongodb 연동을 할 때 동일한 함수를 사용
    # 사용법도 동일
    # python과 node에서는 mongodb 연동법을 학습할 필요가 거의 없음
    result = collect.find()

    for data in result:
        print(data)

except Exception as e:
    print(e)
```
- DEMO 프로그램을 만들 때 별도로 데이터베이스 학습을 하지 않았다면 MongoDB와 Python이나 Node를 이용하면 러닝커브를 줄일 수 있음