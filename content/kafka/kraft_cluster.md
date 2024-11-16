---
title: Kafka 클러스터 구성하기
weight: 2
---
## Kafka Kraft 클러스터 구성 및 설치
### 설치
- 카프카 바이너리 파일 다운로드(또는 소스코드 다운 후 빌드)
```bash
wget https://downloads.apache.org/kafka/3.8.1/kafka_2.13-3.8.1.tgz
sudo tar -xvzf kafka_2.13-3.8.1.tgz -C /usr/local/

cd /usr/local/kafka_2.13-3.8.1
```

### log 디렉터리 생성 및 config 설정
```bash
# log directory 생성
sudo mkdir -pv logs/kraft-combined-logs
```
- 노드1server.properties(인스턴스 별로 설정)

```bash
# kraft config변경
sudo nano config/kraft/server.properties

############################# Server Basics #############################
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093,3@노드3내부IP주소:9093
############################# Socket Server Settings #############################
listeners=PLAINTEXT://노드1내부IP주소:9092,CONTROLLER://노드1내부IP주소:9093
advertised.listeners=PLAINTEXT://노드1내부IP주소:9092
############################# Log Basics #############################
log.dirs=/usr/local/kafka_2.13-3.6.0/logs/kraft-combined-logs
num.partitions=3
############################# Internal Topic Settings  #############################
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3
```
- 노드2 server.properties
```bash
sudo nano config/kraft/server.properties

############################# Server Basics #############################
process.roles=broker,controller
node.id=2
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093,3@노드3내부IP주소:9093
############################# Socket Server Settings #############################
listeners=PLAINTEXT://노드2내부IP주소:9092,CONTROLLER://노드2내부IP주소:9093
advertised.listeners=PLAINTEXT://노드2내부IP주소:9092
############################# Log Basics #############################
log.dirs=/usr/local/kafka_2.13-3.6.0/logs/kraft-combined-logs
num.partitions=3
############################# Internal Topic Settings  #############################
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3
```
- 노드3 server.properties
```bash
sudo nano config/kraft/server.properties

############################# Server Basics #############################
process.roles=broker,controller
node.id=3
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093,3@노드3내부IP주소:9093
############################# Socket Server Settings #############################
listeners=PLAINTEXT://노드3내부IP주소:9092,CONTROLLER://노드3내부IP주소:9093
advertised.listeners=PLAINTEXT://노드3내부IP주소:9092
############################# Log Basics #############################
log.dirs=/usr/local/kafka_2.13-3.6.0/logs/kraft-combined-logs
num.partitions=3
############################# Internal Topic Settings  #############################
offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3
```
- 인스턴스 별 호스트 이름 매핑
```bash
sudo nano /etc/hosts

// 다음 정보들을 입력 후 저장
172.31.6.51 kafka_1
172.31.4.201 kafka_2
```