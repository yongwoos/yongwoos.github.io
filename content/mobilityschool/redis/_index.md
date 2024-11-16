---
title: REDIS
weight: 3
---

### 1. DB종류 분류
* RDBMS와 NoSQL
* DISK 기반의 DB와 In Memory DB

### 2. In Memory DB
* 디스크에 데이터 저장않고 메모리 저장했다가 요청있으면 메모리 데이터를 빠르게 돌려주는 방식
* 디스크보다는 메모리가 빨라 고속으로 컨텐츠 제공 장점

### 3. REDIS (REmote Dictionary Server)
* 오픈소스 인 메모리 key-value Data Store
* key는 중복불가->UPSERT 개념, key는 해싱을 이용
* 사용사례: 캐싱, 세션관리(네트워크에서 정보 저장하는 공간), pub/sub, 순위표
* BSD 라이선스 (오픈소스), C언어로 구현됨, 다양한 프로그래밍 언어 지원
* 퍼블릭 클라우드에서도 유사한 서비스 제공
* 클러스터 기능 제공 - 확장 가능
* 백업 기능 제공 - 디스크에 저장 가능
* 싱글스레드 기반->이벤트 큐를 이용해 싱글스레드 구현
* 백업 방법
  * RDB 방식: 스냅샷(데이터 전체의 복사본) 이용
    * 간단-복원할 때 스냅샷만 복사해서 붙여넣으면 됨
    * 단점-스냅샷 이후의 변경 데이터는 복원 불가
  * AOF(Append Only File)
    * 변경된 작업을 저장해서 복원
    * 장점-복원 시 데이터 유실량 거의 없음
    * 단점-용량이 커지고 시간 오래 걸림
* 실제 구현을 할 때는 Master와 Replica 서버를 만들어서 Master에 작업을 수행하고 Master에 변경이 생기면 Replica서버에 복제하는 방식으로 구현
* Master에 장애가 발생하면 Replica 서버가 Master가 되도록 해서 장애에 대비
* 센티넬이 마스터-클라이언트 중계

### docker로 REDIS 설치
```bash
docker pull redis
docker images
docker run -p 6379:6379 redis //컨테이너 실행
docke run --name myredis -d -p 6379:6379 redis //컨테이너 이름설정 및 백그라운드로 컨테이너 실행
docker exec -it redis /bin/bash //docker컨테이너 내부 접속
redis-cli //redis cli접속
```

* REDIS는 메모리 사용하기 때문, 무한정 메모리 보관X
* 데이터 생성 유효기간 설정가능
```bash
EXPIRE 키 유효시간(초단위)
```

### redis 명령어
* 문자열저장
```bash
set (key) (value)
get (key)
del (key)
lpush (key) (value)
rpush (key) (value)
lrange (key) (0-9) (-1-9)
```

* 여러 개 저장 및 읽어오기 - mset, mget
* 모든키 조회: keys *
* 패턴 적용 가능
* List: 하나의 key에 여러 개의 데이터를 인덱스 순서대로 저장
  * push, pop, range
  * 데이터개수: llen
  * 데이터삭제: trim
  * llen 제외하고 r, l을 추가해 서로다른 방향에서 작업이 가능
  * -1은 마지막 인덱스를 의미
* set: 저장순서는 알 수 없지만 중복된 데이터를 저장하지 않는 자료구조
  * 생성 및 추가: sadd (키) (데이터)
  * 전체 데이터 조회: smembers (키)
  * 존재여부: sismember (키) (값)
  * 삭제: srem (키)
* spop
* srandmember
* sorted set: 하나의 키에 여러개 데이터, score-value 형태
  * score를 이용해 데이터 정렬 및 저장
  * 데이터 삽입: zadd 사용
  ```bash
  zadd "key4" 0 "Happy" 2 "Koo" 1 "Good"
  ```
  * key의 범위를 설정해 데이터 가져오는 zrange를 제공
* hash(딕셔너리, 맵): 하나의 키에 여러개 데이터, field-value 형태
  * 저장은 hset 키이름 field와 value 나열
  * 여러 개의 field를 한꺼번에 삽입할 때는 hmset
  * 가져올 때는 hget, hmget
  * 모든 데이터 조회 hgetall
* 전체 필드 조회하는 hkeys (키), 전체 value 조회하는 hvals (키)

* 외부에서 접속 가능하도록 할 때는 컨테이너 안에 /data 디렉토리를 생성하고 redis.conf 파일을 작성
  * bind 옵션에 0.0.0.0 작성하면 외부에서 접속이 가능
* RDB 백업 시 redis.conf파일에 save 시간 데이터개수를 설정하면 시간 단위로 데이터 개수만큼 변경되었을 때 rdb파일에 데이터를 백업
* AOF로 백업 시 redis.conf파일에 save 옵션을 만들고 appendonly yes를 추가
  * rdb 파일이나 aof 파일은 redis만 읽을 수 있음
  * disk 데이터베이스에 백업을 할 때는 프로그램을 직접 만들어서 수행
  * docker에서 작업 시 redis.conf 파일을 외부에서 만든 후 도커 볼륨을 이용해서 파일을 복사해줘야
* 일반 웹 프로그래밍에서 redis를 사용하고자 하는 경우 대부분 세션 관리에 이용
  * 접속한 클라이언트의 정보를 서버에 저장 - 로그인확인이나 장바구니
  * 최근에는 웹 서버에서 세션 저장 시 웹 서버에 직접 저장 않고 데이터베이스를 이용하는 것을 권장, 세션이 많아지면 웹서버의 메모리 이용하기 때문에 느려짐
  * 세션은 빠르게 확인할 필요가 있는데 DB는 너무 느림->메모리 DB 사용 권장


## 참고
### TCP/IP
클라이언트 -----요청------> 서버
          <-----키발급----
          -----키/요청---->

### 멀티스레드
* 동시수행 생각
* mutual exclusion
* Synchronized
* Dead Lock