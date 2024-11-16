---
title: MongoDB
weight: 2
---

08/30
### MongoDB
* UNIX(c/c++)-LINUX(c/c++)-android, GNOME<br>
           -MACos(UNIX + GUI)-windows
* primitive type: 직접값을 기억, 빠름 a=10 (C, Go가 지원)
* blob: binray로 저장(16진수로 보여줌)
* timestamp: 1970/1/1부터 지나온 시간
* NoSQL에서는 배열의 원소 순서가 다르면 다른 값
* 락 걸리면 읽고쓰기 불가
* 맵리듀스
* 삽입삭제갱신-RDBMS, 조회-NoSQL(유연, 스타트업이 많이 사용)

* 프로그램 접속 시 두가지 필요: 도메인/IP주소(컴퓨터구별) + 포트번호(프로세스 구별)
* mongodb에서 use ex하면 이름만 생성, 데이터 넣어야 db 공간 할당

### Mongodb 명령어
* db->현재db확인
* showdbs->db목록확인
* use 이름->db 생성 및 전환
* db.dropDatabase() 이름->현재 사용중 db 삭제
* 샘플 데이터 삽입: db.mycollection.insertOne({name:1})
* mongodb에서는 db에 데이터가 존재해야 실제로 db 생성

### Collection
* RDBMS에서 테이블 또는 릴레이션에 해당
* 테이블은 정규화된 데이터, 컬렉션은 비정규화된 데이터
* mongoDB에서는 JOIN을 지원하지 않음, 하나의 컬렉션에 최대한 많은 양의 데이터를 저장하는 것 권장
* 성능측면에서는 하나의 컬렉션에 너무 많은 데이터 저장하게 되면 디스크 읽기 오퍼레이션이 많이 필요, 캐시 효율이 떨어지므로 여러개의 컬렉션을 생성
* OS-Memory(주기억장치)-디스크(보조기억장치)
* Cache Ratio: 캐시에 데이터 있을 확률
* 컬렉션 직접 생성: db.createCollection("컬렉션이름")
* db 모든 컬렉션 조회: db.getCollectionNames() 또는 show collections
* 컬렉션 제거: db.컬렉션이름.drop()
* 이름 변경: db.컬렉션이름.renameCollection(이름)
* 로그 데이터나 일정 시간 동안만 보관하는 통계 데이터를 보관하고자 하는 경우에 유용
* view: 조회만 가능한 db개체

### Capped Collection
* Capped Collection: 크기 초과 시 자동으로 가장 오래된 데이터를 삭제하고 데이터를 삽입
```javascript
db.createCollection('cappedcollection', {capped:true, size:10000})
db.cappedcollection.insertOne({x:1})
db.cappedcollection.find()
for문 사용가능 for(i=0;i<1000;i++){db.cappedcollection.insertOne({x:i})}
```

### 도큐먼트 생성-insert
* 도큐먼트 레벨에서 원자적으로 실행
* 데이터는 JSON 형식으로 표현
* 데이터 삽입할 때 _id 라는 key 값을 설정하지 않으면, _id 라는 컬럼의 값으로 key를 생성해서 삽입을 해줌
* 삽입하는함수로는 insert, save, insertOne, insertMany가 있음
* 데이터를 삽입할 때 배열로 삽입하면 데이터를 분리해서 저장
* JSON: 배열이 맨 밖에 있는 것 불가 {} 안에 위치
* 배열 사용시 순서 있지만 의미부여 X, 세세하게 알려줘야
```javascript
db.num.insert([1,2,3])

db.num.find()
```

### ordered
* 데이터를 삽입할 때 2번째 매개변수로 ordered 설정 가능
* 이 값이 true이면 싱글스레드 이용, false이면 멀티 스레드 이용
* 여러 개의 데이터를 한꺼번에 삽입할 때 싱글 스레드를 사용하는 경우 에러가 발생하면 뒤의 데이터는 삽입되지 않음
* 멀티스레드를 사용하면 에러가 발생한 데이터만 삽입되지 않음

```javascript
db.sample.createIndex({name:1}, {unique:true})

db.sample.insert({name:"park"})

db.sample.insert([{name:"kim"}, {name:"park"}, {name: "lee"}]) #싱글스레드일 때 위 경우 lee는 못들어감

db.sample.find()

db.sample.insert([{name:"lee"}, {name:"park"}, {name: "choi"}], {ordered:false}) #멀티스레드일 경우 choi가 삽입
db.sample.find()
```

* 멀티스레드 프로그래밍 할때 별도의 작업 할당

### ObjectId
* 12Byte로 구성된 자료형
* _id필드에 ObjectID를 할당하는 방식으로 도큐먼트를 삽입할 때 일련번호를 부여
* new ObjectId()를 이용해서 직접 생성가능하고, _id필드에 직접 삽입하는 것이 가능

### CRUD
* 데이터삽입
* writeConcern
* thashing: 커밋 너무 많이 해 다른 작업 불가->일정한 시간, 개수단위로 커밋, 임시데이터베이스 생성 후 원본에 커밋
* insertOne, insertMany

### CQRS패턴: 읽기와 쓰기 분리
* 애플리케이션 분리, 저장소도 분리
* Read App생성(NoSQL), 메시지브로커/카프카(read & Write 사이 버퍼로 데이터 일치하게 사용), Write App생성(RDBMS), 저장소 생성, 백업본 필요
* MongoDB는 Read가 강함
* UPSERT: 있으면 수정, 없으면 삽입
* mongodb는 js 프로그래밍 가능

```javascript
let num = 1
for(let i=0; i<3; i++)(db.sample.insertOne({name:"user"+i, score:num}))
```

* 확인: db.sample.find()

### 데이터 조회
* 관계형 db는 조회를 하면 row의 집합리턴, mongodb는 cursor를 리턴
```javascript
db.컬렉션이름.find(query-행에대한조건, projection-속성이름)
```
* json 파일로 만들어진 데이터를 가져오기

```shell
mongoimport -d 데이터베이스이름 -c 컬렉션이름 < 파일경로
```

* inventory 컬렉션에서 item 속성의 값이 hello인 데이터를 조회
```javascript
db.inventory.find({item:{$eq:"hello"}})
```

* inventory 컬렉션에서 tags 속성의 값이 blank 이거나 blue인 데이터를 조회
```javascript
db.inventory.find({tags:{$in:["blank", "blue"]}})
```

### Regex
* users컬렉션에서 name에 a가 포함된 데이터
```javascript
db.users.find({name: /a/})
db.users.find({name: /[0-9]/})
```

* [ab] a or b
* [a-z A-Z] 알파벳
* ^S: S로 시작하는
* S$: S로 끝나는
* [^S]: S제외

* pa로 시작하는 데이터 조회
```javascript
db.users.find({name: /^pa/})
```

* 1개:
  * 데이터 존재: 데이터 리턴
  * 데이터 없음->NULL리턴

* 0개 이상: 
  * 데이터가 존재하면 데이터리턴
  * 데이터 없음: [] 빈 배열 리턴

* inventory 컬렉션에는 item, qty, tags 속성이 존재
* tags 속성에는 배열로 데이터가 존재

* tags 속성에서 red를 포함하는 데이터 조회
```javascript
db.inventory.find({tags:"red"})
db.inventory.find({tags:"red"}, {"_id":0, "item":1}) #_id 생략
```

* red와 blank순으로 있는 데이터만 조회
```javascript
db.inventory.find({tags:["red", "blank"]}, {"_id":0, "item":1, "tags":1})
```

* 데이터 개수 제한은 limit 함수
```javascript
* db.inventory.find().limit(2) // 2개만 표시
```
* 데이터 1개만 조회할 때는 db.inventory.findOne() 또는 db.inventory.find().limit(1)

* 건너뛸 때는 skip
```javascript
db.inventory.find().skip(2)
```

* 데이터 정렬: sort 함수를 이용, 매개변수로 객체를 대입 <br>
sort({속성:1이나 -1}) #1이면 오름차순, -1이면 내림차순정렬 <br>
여러 개의 속성 나열 가능
```javascript
db.inventory.find({}, {_id:0, tags:0}).sort({"qty":1})
```

### cursor(iterator)
* 데이터를 가리키는 포인터
* mongoDB에서는 find를 이용해서 조회하면 결과로 cursor를 리턴
* cursor는 2개의 기본적인 메서드를 제공, hasNext()는 다음 데이터 존재 여부를 리턴하고 next()는 다음 데이터를 리턴

* 변수=find구문 // 변수에 find의 결과를 접근할 수 있는 cursor가 저장
```javascript
let cur = db.inventory.find()

cur.hasNext()

cur.next()


cur.hasNext() ? cur.next():null
```

* 파일: 커서로 파일 읽어옴 BOF ~ EOF:NULL

```javascript
while(cursor;hasNext())
{
cursor.next()
}
```
* python에서 __iter__ 있으면 순회 가능

### 쿼리 성능 조회
* find함수 다음에 explain("executionStats")를 호출하면 쿼리 계획을 확인할 수 있음
* 거의 모든 데이터베이스에서 이 기능은 제공
* 접속 도구가 제공되는 경우도 있음
* 복잡한 subquery를 만들거나 join을 할 때 실행 계획을 확인하고 쿼리를 만드는 것이 좋음
* 이 부분은 데이터베이스 질의 튜닝을 할 때 이용

* 인덱스 생성
```javascript
db컬렉션이름.createIndex({"컬럼이름":1})
```
* 인덱스는 조회성능을 높여줌

* 컬렉션 삭제
```javascript
db.inventory.drop()
```

* 데이터추가
```javascript
db.inventory.insert({_id:1, item:"f1", type:"food", quantity:500})
```

* 조회 실행 계획 확인
```javascript
db.inventory.find({quantity:10}).explain("executionStats")
```

### 인덱스
* 인덱스만드는경우: 특정 컬럼을 조회에 많이 사용할 때, 결과가 2~4%정도 될때
* 이 외의 경우 풀테이블 스캔 시 안만드는게 나음
```html
EX)
1001 1002 1003 1004 1005 5개의 데이터 있음
커서가 하나씩 읽음
루트 인덱스 생성:         1003
                        /    \
               1001, 1002 <-->  1004, 1005
트리 형태로 인덱스 생성
트리로 만드는 이유: 속도가 더 빠름
특정 데이터 찾을때는 트리 방식이 빠름. 하지만 모든 데이터 조회시 순차적 검색이 더빠름<
[3] -> 0, 0-1, 0-1-2 방식으로 찾음
커서는 0,1,2,3 방식으로 찾음
인덱스는 더블링크드리스트로 만들어짐, 풀테이블 스캔 시 포인터 계속 따라다녀야 함
링크드리스트vs배열: 배열 속도가 더 빠름
링크드리스트 데이터는 비연속적, 포인터가 다음 데이터 가리킴
```

```javascript
db.inventory.drop()

db.inventory.insert({_id:1, item:"f1", type:"food", quantity:500})
```

* 인덱스를 생성하지 않고 조회한 경우 실행 계획 확인
```javascript
db.inventory.find({quantity:10}).explain("executionStats")
```
* 인덱스 생성
```javascript
db.inventory.createIndex({quantity:1})
db.inventory.find({quantity:10}).explain("executionStats")
```

* between 사용 시 인덱스 사용 효율적
* age 10<30일때 age>=10 and age<=30 보단 age between 10 and 30이 더 효율적(두개 비교vs 한개 비교)

* verbose: 로그 출력 여부

* try..catch..finally or try..catch
* try..catch..finally: finally에 작성 시 무조건 실행, db와 끊는 것
* try..catch: 성공적으로 수행 못할 시 수행못할 가능성

### Map-Reduce
* 그룹화해서 연산을 수행해 결과를 사용하고자 하는 경우 사용할 수 있는 기능
* 그룹화를 한 후 동시에 연산을 수행한 후 결과를 만들어 리턴

* rating컬렉션에서 rating속성별로 그룹화해서 데이터의 개수를 조회
1. 그룹화에 사용할 함수를 생성
```javascript
let 이름=function() {
 emit(그룹화할 속성, 집계에 사용할 데이터 속성)

let mapper = function() {
 emit(this.rating, this.user_id)
}
```
* 집계에 사용할 함수에 key로 rating이 넘어가고 value로 user_id 가 넘어감

2. 집계에 사용할 함수를 생성
```javascript
let 이름=function(key, values) {
 return 그룹별로 사용할 결과
}
```
* key는 map에서 리턴해주는 그룹화한 속성의 값
* values는 앞에서 넘겨준 데이터의 배열

* ex) key:1, values:[2] <br>
key: 2, values:[3]<br>
key: 3, values: [4, 1]<br>
```javascript
let reducer = function(key, values) {
 return values.length
}
```
3. 사용
```javascript
db.컬렉션.mapReduce(Map 함수, Reduce 함수, {out:{inline:1}})
=>
db.rating.mapReduce(mapper, reducer, {out:{inline:1}})

db.rating.aggregate([{$group:{_id:{"category":"$rating"}, sum_prices:{$sum:"$user_id"}}}])
```

* MongoDB에서 수정을 하게 되면 행 전체를 갱신
* One이 붙는 함수는 조건에 맞는 데이터 1개만 갱신
```javascript
db.user.insertOne({username:"karoid", age:30})
db.user.insertOne({username:"karoid", age:20})


db.user.replaceOne({username: "karoid"},
 {
 username: "Karpoid" , status: "Sleep" , points: 100, password: 2222
 });
```

* db.user.find()로 확인 -> 문서 자체가 변경됨

* 업데이트 할 때 기존 속성의 값을 그대로 사용하고자 할 때는 $set:{수정할 내용} 형태로 설정해야
```javascript
db.user.update({username:"Kaproid"}, {$set:{score:100}}) #매칭된 값 하나만 수정

db.user.updateMany({username:"Karpoid"}, {$set:{score:1020}}) #매칭된 모든 값 수정
db.user.find()
```