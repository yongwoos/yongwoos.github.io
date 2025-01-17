---
title: 카프카 도커 설치
weight: 8
---
## 도커 컴포즈로 카프카 설치
```yaml {filename="docker-compose.yaml"}
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
- 도커 컴포즈 실행 `docker compose up -d`
- 셀 접속 `docker exec -it 카프카컨테이너이름 /bin/bash`
- 디렉터리 변경 `cd /opt/kafka/bin`
```
# 토픽 생성
./kafka-topics.sh --bootstrap-server localhost:9092 --create --topic auth

# 토픽 컨슘
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --from-beginning --topic auth
```

