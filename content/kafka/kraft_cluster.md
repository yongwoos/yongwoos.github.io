---
title: 카프카 클러스터 만들기
weight: 2
---
## Kafka Kraft 클러스터 구성 및 설치
### 설치
- ec2 보안 그룹 모든 트래픽 허용으로 설정
- 카프카 바이너리 파일 다운로드(또는 소스코드 다운 후 빌드)
```sh
# java 설치
sudo apt update -y
sudo apt install openjdk-17-jdk -y

# kafka 다운로드 및 압축풀기
wget https://downloads.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz
sudo tar -xvzf kafka_2.13-3.9.0.tgz -C /usr/local/
sudo mv /usr/local/kafka_2.13-3.9.0 /usr/local/kafka

# 방화벽 해제
sudo ufw disable
sudo systemctl stop ufw
sudo systemctl disable ufw

# kafka 디렉터리로 이동
cd /usr/local/kafka

# log directory 생성
sudo mkdir -p logs/kraft-combined-logs

# log 권한 추가
sudo chmod -R 755 /usr/local/kafka/logs/
sudo chown -R $(whoami):$(whoami) /usr/local/kafka/logs/

# kraft config변경
sudo nano config/kraft/server.properties
```

- 노드1 server.properties(인스턴스 별로 설정)

```bash {filename="노드1 server.properties"}
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093

listeners=PLAINTEXT://노드1내부IP주소:9092,CONTROLLER://노드1내부IP주소:9093
advertised.listeners=PLAINTEXT://노드1내부IP주소:9092

log.dirs=/usr/local/kafka/logs/kraft-combined-logs # 로그디렉터리 수정정
num.partitions=3

offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3

listener.security.protocol.map=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT
controller.listener.names=CONTROLLER
listener.name.plaintext=PLAINTEXT
```
- 노드2 server.properties
```bash {filename="노드2 server.properties"}
process.roles=broker,controller
node.id=2
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093

listeners=PLAINTEXT://노드2내부IP주소:9092,CONTROLLER://노드2내부IP주소:9093
advertised.listeners=PLAINTEXT://노드2내부IP주소:9092

log.dirs=/usr/local/kafka/logs/kraft-combined-logs # 로그 디렉터리 수정
num.partitions=3

offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3

listener.security.protocol.map=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT
controller.listener.names=CONTROLLER
listener.name.plaintext=PLAINTEXT
```
- 옵션
```
sudo nano /etc/hosts
# 다음 정보들을 입력 후 저장
ip주소 kafka_1
ip주소 kafka_2
```
### 클러스터 uuid 생성
- 임의의 한대 서버에서 cluster uuid 생성
```bash
./bin/kafka-storage.sh random-uuid

# 위에서 생성된 cluster uuid로 카프카 노드별로 스토리지 포맷
sudo ./bin/kafka-storage.sh format -t uuid값 -c ./config/kraft/server.properties
```

### 카프카 시작
- VM 다시 시작 시 명령 필요
```bash
bin/kafka-server-start.sh -daemon config/kraft/server.properties
```

### 메타데이터 퀴럼 상태 확인
```bash
./bin/kafka-metadata-quorum.sh --bootstrap-server 노드1주소:9092,노드2주소:9092 describe --status
```
### 브로커 상태 확인
```bash
./bin/kafka-broker-api-versions.sh --bootstrap-server ip주소:9092
```

### 토픽 생성
```bash
./bin/kafka-topics.sh --create --bootstrap-server 노드1주소:9092,노드2주소:9092 --replication-factor 2 --partitions 2 --topic real_topic
```

### 토픽 목록 확인
```bash
./bin/kafka-topics.sh --bootstrap-server 노드1주소:9092,노드2주소:9092 --list
```

### 토픽 자세히 확인
```bash
./bin/kafka-topics.sh --bootstrap-server 노드1주소:9092,노드2주소:9092 --describe --topic real_topic
```

### check log
```bash
tail -f logs/server.log
```

### produce
```bash
./bin/kafka-console-producer.sh --bootstrap-server 노드1주소:9092,노드2주소:9092 --topic real_topic
```

### consume
```bash
./bin/kafka-console-consumer.sh --bootstrap-server 노드1주소:9092,노드2주소:9092 --topic real_topic --from-beginning
```

### 프로듀서 성능테스트
```bash
./bin/kafka-producer-perf-test.sh --topic auth --record-size 100 --throughput 1000 --num-records 10000 --producer-props acks=1 bootstrap.servers=192.168.54.7:9092,192.168.55.8:9092
```

### 컨슈머 성능 테스트
```bash

```