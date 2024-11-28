---
title: 카프카
cascade:
  type: docs
weight: 4
---
### 사용 이유

### 사용 사례
- 실시간 수집 정보 대쉬보드
- 순서가 중요한 주문 처리
  - 배달 주문 취소
- 카프카로 실시간 로그 전송 후 ElasticSearch에서 분석

### 브로커
- 카프카는 여러 개의 브로커(노드)가 클러스터를 구성
- 브로커수는 땟목 알고리즘에의 해 홀수개를 추천, 최수 3개 권장


### 토픽
- 브로커는 여러 개의 토픽으로 구성
- 토픽은 여러 개의 파티션으로 구성
- 하나의 토픽이 여러 파티션으로 나뉘어 저장, 이 파티션들은 클러스터 내의 서로 다른 브로커들에 분산되어 저장될 수 있음
- 각 브로커가 다른 파티션을 관리함으로써, 여러 컨슈머가 동시에 다른 브로커의 파티션에서 데이터를 읽거나 쓸 수 있음, 이는 전체 시스템의 쓰기/읽기 성능을 향상
- 카프카는 키를 기반으로 메시지를 파티션에 할당
- 

### 파티션
- 파티션 내에서는 순서가 보장됨
- 프로듀스 시 파티션 키 명시하지 않으면 round-robin 방식으로 파티션 분배
  - 순서가 지켜지지 않게 됨
- 오프셋으로 순서를 보장
- 브로커의 토픽의 파티션은 다른 브로커에도 복제가 됨
- 파티션에는 리더와 팔로워가 존재
- 브로커가 3개 있고 브로커 1의 토픽1의 파티션1이 리더
  - 브로커2와 브로커3에는 토픽1의 복제본이 각각 존재
  - 브로커2.토픽1.파티션1와 브로커3.토픽1.파티션1은 팔로워 파티션으로 브로커1.토픽1.파티션1을 복제
  - 브로커1.토픽1.파티션2는 팔로워가 되며 브로커2.토픽1.파티션2가 리더가 됨
  - 위와 같은 방식으로 리더와 팔로워가 브로커에 나누어져 있음
- 파티션이 나눠져 있어 프로듀서, 컨슈머가 병렬 처리가 가능
- 파티션 수를 결정할 때, 1~2년 후의 처리량을 고려해서 결정

### 파티션 수 증가 시 문제점
- 많은 파티션은 비가용성 초래
- 서비스 리커버리 시간이 증가
-  ent to ent latency 증가
- 파티션은 디렉터리와 매핑
  - 저장되는 데이터마다 2개의 파일 2개의 파일(index, actual data) 생성
  - 카프카에서는 모든 디렉토리의 파일들에 대해 파일 핸들을 열게 됨->많은 파티션은 많은 파일 핸들러의 오픈이 필요


### ISR(In-Sync Replicas)

### LAG

### 병렬 처리

### 뗏목 알고리즘(Raft Algorithm)

### 옵션
- 프로듀서 옵션
  - linger.ms
  - compression
  - batchsize
  - ack
- 컨슈머 옵션
  - fetch.min.bytes
- 브로커 옵션
  - min.insync.replicas
  - queued.max.requests

### Producer

### Consumer Group
- 사용이유
  - fail over: 특정 컨슈머에 문제가 생기는 경우 동일 그룹 내의 다른 컨슈머가 계속해서 파티션에서 데이터를 읽을 수 있음
    - 컨슈머 1에 장애가 발생하더라도, 동일 컨슈머 그룹 내의 2,3,4 컨슈머가 계속해서 읽을 수 있도록 리밸런싱이 된다. 카프카는 컨슈머 그룹 단위로 offset을 관리하기 때문
  - 컨슈머 그룹 단위로 offset 관리
    - A컨슈머 그룹과 B컨슈머 그룹이 같은 파티션 구독하더라도 offset 각각 관리
- 하나의 컨슈머 그룹 내에서 컨슈머의 수는 파티션 수를 초과할 수 없음
  - 컨슈머와 파티션은 1대1 매칭 되어 병렬 처리됨
- 커밋(Commit)을 통해 자신이 레코드를 어디까지 가져갔는지 카프카 브로커에 기록
- https://hudi.blog/kafka-consumer/

### 카프카 토픽 파티션 개수
- https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- https://devidea.tistory.com/90?category=762832
- https://devidea.tistory.com/95
- https://12bme.tistory.com/528
- https://velog.io/@dh97k/Kafka-Topic
- https://dhsim86.github.io/web/2017/04/11/kafka_how_many_topics-post.html
- https://curiousjinan.tistory.com/entry/understand-kafka-partitions
- https://jjongguet.tistory.com/97

### 파티션 개수 줄이지 못하는 이유
- 카프카를 이루는 설계요인이 복합적으로 적용
- 다수 브로커에 분배되어있는 세그먼트를 다시 재배열하는것에 상당한 리소스가 사용되기 때문