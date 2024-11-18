---
title: Kafka 클러스터 구성하기
weight: 2
---
## Kafka Kraft 클러스터 구성 및 설치
### 설치
- ec2 보안 그룹 모든 트래픽 허용으로 설정
- 카프카 바이너리 파일 다운로드(또는 소스코드 다운 후 빌드)
```sh
# java 설치
sudo apt update
sudo apt install openjdk-17-jdk

# kafka 다운로드 및 압축풀기
wget https://downloads.apache.org/kafka/3.8.1/kafka_2.13-3.8.1.tgz
sudo tar -xvzf kafka_2.13-3.8.1.tgz -C /usr/local/

# 방화벽 해제
sudo ufw disable

# kafka 디렉터리로 이동
cd /usr/local/kafka_2.13-3.8.1

# log directory 생성
sudo mkdir -pv logs/kraft-combined-logs

# kraft config변경
sudo nano config/kraft/server.properties
```

- 노드1 server.properties(인스턴스 별로 설정)

```bash
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093,3@노드3내부IP주소:9093

listeners=PLAINTEXT://노드1내부IP주소:9092,CONTROLLER://노드1내부IP주소:9093
advertised.listeners=PLAINTEXT://노드1내부IP주소:9092

log.dirs=/usr/local/kafka_2.13-3.6.0/logs/kraft-combined-logs
num.partitions=3

offsets.topic.replication.factor=3
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=3

listener.security.protocol.map=PLAINTEXT:PLAINTEXT,CONTROLLER:PLAINTEXT
controller.listener.names=CONTROLLER
listener.name.plaintext=PLAINTEXT
```
- 노드2 server.properties
```bash
process.roles=broker,controller
node.id=2
controller.quorum.voters=1@노드1내부IP주소:9093,2@노드2내부IP주소:9093,3@노드3내부IP주소:9093

listeners=PLAINTEXT://노드2내부IP주소:9092,CONTROLLER://노드2내부IP주소:9093
advertised.listeners=PLAINTEXT://노드2내부IP주소:9092

log.dirs=/usr/local/kafka_2.13-3.6.0/logs/kraft-combined-logs
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
### 카프카 시작
```bash
# 임의의 한대 서버에서 cluster uuid 생성
./bin/kafka-storage.sh random-uuid
A_D5kj5zTbi2EDTeXHDH3g

# 위에서 생성된 cluster uuid로 instance별로 스토리지 포맷
sudo ./bin/kafka-storage.sh format -t uuid_값 -c ./config/kraft/server.properties

# 카프카 시작
bin/kafka-server-start.sh config/server.properties

# 메타데이터 퀴럼 상태 확인
./bin/kafka-metadata-quorum.sh --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 describe --status

# 브로커 상태 확인
./bin/kafka-broker-api-versions.sh --bootstrap-server ip주소:9092

# 토픽 생성
./bin/kafka-topics.sh --create --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 --replication-factor 2 --partitions 2 --topic real_topic

# 토픽 목록 확인
./bin/kafka-topics.sh --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 --list

# 토픽 자세히 확인
./bin/kafka-topics.sh --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 --describe --topic real_topic

# check log
tail -f logs/server.log

# produce
./bin/kafka-console-producer.sh --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 --topic real_topic

# consume
./bin/kafka-console-consumer.sh --bootstrap-server 172.31.11.12:9092,172.31.11.55:9092 --topic real_topic --from-beginning
```

## KafkaUI
- 도커 없이 설치
```
wget https://github.com/provectus/kafka-ui/releases/download/v0.7.2/kafka-ui-api-v0.7.2.jar
```
- yml 작성
```yml
logging:
  level:
    root: INFO
    com.provectus: DEBUG
    #org.springframework.http.codec.json.Jackson2JsonEncoder: DEBUG
    #org.springframework.http.codec.json.Jackson2JsonDecoder: DEBUG
    reactor.netty.http.server.AccessLog: INFO
    org.springframework.security: DEBUG

#server:
#  port: 8080 #- Port in which kafka-ui will run.

spring:
  jmx:
    enabled: true
  ldap:
    urls: ldap://localhost:10389
    base: "cn={0},ou=people,dc=planetexpress,dc=com"
    admin-user: "cn=admin,dc=planetexpress,dc=com"
    admin-password: "GoodNewsEveryone"
    user-filter-search-base: "dc=planetexpress,dc=com"
    user-filter-search-filter: "(&(uid={0})(objectClass=inetOrgPerson))"
    group-filter-search-base: "ou=people,dc=planetexpress,dc=com"

kafka:
  clusters:
    - name: local
      bootstrapServers: localhost:9092
      schemaRegistry: http://localhost:8085
      ksqldbServer: http://localhost:8088
      kafkaConnect:
        - name: first
          address: http://localhost:8083
      metrics:
        port: 9997
        type: JMX

dynamic.config.enabled: true

oauth2:
  ldap:
    activeDirectory: false
    aсtiveDirectory.domain: domain.com

auth:
  type: DISABLED
  #  type: OAUTH2
  #  type: LDAP
  oauth2:
    client:
      cognito:
        clientId: # CLIENT ID
        clientSecret: # CLIENT SECRET
        scope: openid
        client-name: cognito
        provider: cognito
        redirect-uri: http://localhost:8080/login/oauth2/code/cognito
        authorization-grant-type: authorization_code
        issuer-uri: https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_M7cIUn1nj
        jwk-set-uri: https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_M7cIUn1nj/.well-known/jwks.json
        user-name-attribute: cognito:username
        custom-params:
          type: cognito
          logoutUrl: https://kafka-ui.auth.eu-central-1.amazoncognito.com/logout
      google:
        provider: google
        clientId: # CLIENT ID
        clientSecret: # CLIENT SECRET
        user-name-attribute: email
        custom-params:
          type: google
          allowedDomain: provectus.com
      github:
        provider: github
        clientId: # CLIENT ID
        clientSecret: # CLIENT SECRET
        scope:
          - read:org
        user-name-attribute: login
        custom-params:
          type: github

rbac:
  roles:
    - name: "memelords"
      clusters:
        - local
      subjects:
        - provider: oauth_google
          type: domain
          value: "provectus.com"
        - provider: oauth_google
          type: user
          value: "name@provectus.com"

        - provider: oauth_github
          type: organization
          value: "provectus"
        - provider: oauth_github
          type: user
          value: "memelord"

        - provider: oauth_cognito
          type: user
          value: "username"
        - provider: oauth_cognito
          type: group
          value: "memelords"

        - provider: ldap
          type: group
          value: "admin_staff"

        # NOT IMPLEMENTED YET
      #        - provider: ldap_ad
      #          type: group
      #          value: "admin_staff"

      permissions:
        - resource: applicationconfig
          actions: all

        - resource: clusterconfig
          actions: all

        - resource: topic
          value: ".*"
          actions: all

        - resource: consumer
          value: ".*"
          actions: all

        - resource: schema
          value: ".*"
          actions: all

        - resource: connect
          value: "*"
          actions: all

        - resource: ksql
          actions: all

        - resource: acl
          actions: all

        - resource: audit
          actions: all
```

```
java -Dspring.config.additional-location=<path-to-application-local.yml> --add-opens java.rmi/javax.rmi.ssl=ALL-UNNAMED -jar <path-to-kafka-ui-jar>
```