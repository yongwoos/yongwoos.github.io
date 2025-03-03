---
title: 카프카
weight: 1
---
### 사용 이유
AirBnb와 같은 순차 처리가 중요한 애플리케이션에서 자주 사용한다. LinkedIn처럼 복잡한 서비스를 사용할 때 카프카를 이용해 느슨한 결합을 구현

### 사용 사례
- 실시간 수집 정보 대쉬보드
- 순서가 중요한 주문 처리
  - 배달 주문 취소
- 카프카로 실시간 로그 전송 후 ElasticSearch에서 분석


### 테스트용 카프카 도커로 설치하기
- docker compose 파일 작성 후 `docker compose up -d`
```yaml
name: myProject

services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka:2.12-2.5.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```
- 카프카 bash 접속
  - Docker Desktop 사용
  - CMD에서 `docker exec -it kafka/bin/bash` 로 접속
- 토픽 생성
  - `kafka-topics.sh --create --topic price-match --bootstrap-server localhost:9092`
- 토픽 확인
  - `kafka-topics.sh --bootstrap-server localhost:9092 --list`
- Produc된 메시지 확인
  - `kafka-console-consumer.sh --topic price-match --bootstrap-server localhost:9092 --from-beginning`