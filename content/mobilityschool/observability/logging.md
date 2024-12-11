---
title: Logging
weight: 4
---
## 참고지식
### 스택과 힙
- 스택은 함수가 종료되면 삭제됨
- 힙은 반영구(instance)영역과 영구(static)영역으로 나눠짐
- insatnce에는 객체인스턴스가 저장됨, 가비지 콜렉션이 알아서 삭제
  - 파이썬은 레퍼런스 카운트로 삭제, 자바는 가리키는 것이 없으면 알아서 삭제
- static에는 클래스와 리터럴(immutable)이 저장됨, 삭제불가, 변경불가
  - "Hello" + "world" 사용 시 Hello와 World를 각각 힙에 저장되고 영구 삭제 불가 => "hello {}", "World" 사용하는 것이 좋음
  - 메모리 때문에 + 연산자는 사용안하는 것이 좋음
  - 자바의 StringBuilder는 instance영역에 문자열을 저장함

### Linux 프로그램 설치 방법
- 바이너리 다운로드 받아서 설치
  - JDK 기반 프로그램 사용 시 java를 두번 깔 필요 없음
  - 경로 설정이 복잡
- Docker나 Kubernetes에서 컨테이너로 설치
  - 동일한 기반 이미지 사용할 수 있어야함
- apt나 yum 같은 패키지 관리 도구 이용
  - GPG키 설치 필요
  - apt upgrade 시 문제 발생 가능 -> 버전 고정 필요

## Logging
### Log
- 개발자에게 필요한 정보를 전달하기 위해서 작성하는 문자열
- 필요한 정보를 직접 로깅할 수 도 있고 애플리케이션이 예상하지 않은 동작을 했을 때 error 정보를 전달해주기도 합니다.
- 프로그래밍 언어에서는 로그를 전달하는 작업을 직접 수행해야 하고 프레임워크에서는 기본적인 로그를 프레임워크가 전달합니다.
- Log를 출력할 때 콘솔에 출력하는 메서드나 함수 사용을 금기시함   
  로그 관리 기능이 없고 로그는 복잡하고 많은 양의 정보를 출력하는 경우가 많은데 콘솔에 출력하는 함수나 메서드는 이러한 기능이 없음

### Spring Boot에서의 로깅
- Spring Boot에서는 spring-boot-starter-web 의존성을 추가하면 자동으로 SLF4J를 통해서 logback 이나 log4j 와 같은 로깅 프레임워크를 사용할 수 있습니다.
- lombok의 의존성을 추가하면 Logger 객체를 직접 생성하지 않고 @Slf4j 라는 어노테이션 만으로 로깅을 할 수 있습니다.
- 로그를 출력할 때는 Logger 객체를 이용해서 레벨에 해당하는 메서드를 호출하고 매개변수로 문자열을 넘겨주는데 포맷을 이용해서 문자열을 출력할 때는 +를 이용하지 않고 { }를 이용해서 비워두고 뒤에 매개변수로 데이터를 넘겨서 출력합니다
- Controller 클래스를 추가해서 로깅
```java
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class FrontController {

   @GetMapping("/health")
   public String healthCheck() {
       return "OK";
   }

   @GetMapping("/")
   public String index(){
       log.info("lot test");
       return "My Web";
   }
}
```

### 로그에 포함되는 내용
- Timestamp
- Level(디버깅, 모니터링 용도)
- 요청경로(리터럴도 포함: 트래픽이나 UI 때문), 메서드

### SLF4J
- SLF4J(Simple Logging Facade for Java)는 파사드 패턴이 적용되어 log4j, logback 같은 로깅에 대한 추상 레이어를 제공하는 로깅 라이브러리
- 추상화되어 있기  때문에 개발자가 로깅 프레임워크를 지정해주어야 합니다.
- log4j 라는 로깅 라이브러리를 많이 사용했는데 log4j가 치명적인 보안 이슈가 발생하면서 이를 제거해야 했는데 이 때 제거를 하게되면 다른 코드에 어떤 문제가 발생할 지 알 수 없고 이로 인해 코드의 수정이 너무 많이 발생하기 때문에 추상화 계층을 두고 편리하게 수정을 하기 위해서 사용합니다.
- 파사드패턴
```java
interface Slf4j {
    public void info(String str)
}

class Log4j implements Slf4j {
    public void info(String str){
        print("Log4j");
    }
}

class LogBack implements Slf4j {
    public void info(String str) {
        print("Log Back");
    }
}

Slf4j log = new Log4j();
log.info();
```
- Log4j에 문제가 생기면 new Log4j()만 new LogBack()으로 고치면 됨
### Log Level
- FATAL: 심각한 에러
- ERROR: 시스템이 정상적인 기능을 못할 때 찍히는 로그
- WARN: 에러는 아니지만 주의할 필요가 있는 경우
- INFO: 운영에 참고할 만한 사항 또는 중요 정보를 나타낼 때 사용
- DEBUG: 개발 단계에서 사용하는 정보
- TRACE: 모든 레벨에 대한 로깅
- ALL

### 로그 출력 설정
- application.yaml(properties)를 이용하는 방법이 있고 별도의 설정 파일(logback-spring.xml) 파일을 이용할 수 있습니다.

- xml 설정
  - appender 와 logger로 구성
  - appender 에 로그를 어디에 출력할 지 설정하고 logger는 실제 출력을 위한 것
  - 콘솔, 파일, 데이터베이스, LogStash 등에 출력하는 것이 가능
- logback-spring.xml 작성
```xml {filename="logback-spring.xml"}
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
   <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
       <layout class="ch.qos.logback.classic.PatternLayout">
           <Pattern>[%d{yyyy-MM-dd HH:mm:ss}:%-3relative] %-5level ${PID:-} --- [%15.15thread] %-40.40logger{36} : %msg%n</Pattern>
       </layout>
   </appender>

   <root level="debug">
       <appender-ref ref="STDOUT" />
   </root>
</configuration>
```
다시 실행시켜서 확인하면 표준 로그와 거의 유사하게 출력됨

## 로그를 파일로 출력
### 고려할 점
- 로그는 분석 대상이 될 수 있습니다.
- 로그는 콘솔에 출력하는 것도 중요하지만 파일이나 데이터베이스에 저장이 되서 나중에 분석을 할 수 있어야 합니다.
- 애플리케이션에 직접 로그를 로컬에 저장하는 것은 서버가 1대 인 경우는 별 문제가 없지만 여러 대인 경우는 문제가 발생합니다.
- 애플리케이션 별로 로그를 별도의 파일에 저장하면 나중에 이 파일들을 하나로 만들어야 하는 번거로움이 있습니다.
- 하나의 애플리케이션을 여러 개의 노드에 배포하는 환경에서는 각 노드에 배포된 애플리케이션의 로그를 모아서 한 번에 저장해 주는 시스템이 필요
- 카프카 와 같은 시스템을 사용해서 로그를 기록하는 것을 고려
- 각 애플리케이션은 로그가 발생하면 카프카에게 전달을 하고 카프카는 이를 로그를 기록하는 애플리케이션에게 전달하는 방식을 취할 수 있습니다.

## 애플리케이션의 로그를 카프카에 전송하고 이를 구독하는 애플리케이션에서 로그를 받아서 파일에 저장한 후 S3에 전송
### 1)카프카 설정
- 카프카 설치
  - EC2 인스턴스를 생성
  - Kafka는 9092 와 2181 번 포트를 사용하므로 인바운드 규칙에서 포트 개발
  - Kafka 나 ELK Stack 등은 Java로 만들어진 애플리케이션이라서 Docker 나 Kubernetes를 이용하지 않고 설치할 때는 JVM(JRE)이 설치가 되어 있어야 합니다   
  `sudo apt install -y openjdk-17-jdk`
  - 바이너리 파일 다운로드   
    `wget https://archive.apache.org/dist/kafka/3.6.0/kafka_2.13-3.6.0.tgz`
  - 압축 해제   
    `tar xvf kafka_2.13-3.6.0.tgz`
  - 애플리케이션 사용을 편리하게 하기 위한 작업   
    `sudo mv kafka_2.13-3.6.0 /opt/kafka`

    환경 변수 추가 - `nano ~/.bashrc`
    ```
    export KAFKA_HOME-/opt/kafka
    export PATH=$PATH:$KAFKA_HOME/bin
    ```
    적용   
    `source ~/.bashrc`
- 카프카 환경 설정
  - opt/kafka/config/server.properties 파일을 수정: 아래 내용을 추가하는데 IP 주소는 자신의 EC2 퍼블릭 IP
```
listerners=PLAINTEXT://:9092
advertised.listeners=PLAINTEXT://IP주소:9092

delete.topic.enable=true
auto.create.topics.enable=true
log.retention.minutes=10
```
- 카프카 실행
```bash
/opt/kafka/bin/zookeeper-server-start.sh -daemon /opt/kafka/config/zookeeper.properties

jps -vm


/opt/kafka/bin/kafka-server-start.sh -daemon /opt/kafka/config/server.properties

jps -m
```
- 토픽 생성 및 확인
```bash
kafka-topics.sh --create --bootstrap-server localhost:9092 --topic test

kafka-topics.sh --bootstrap-server localhost:9092 --list
```
- 토픽 프로듀스 및 컨슘
```bash
$ kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test
>Hello
>World
>Bye
>World
>exit
$ kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
Hello
World
Bye
World
exit
```

### 2)로그를 기록하는 애플리케이션
- spring web, devtools, lombok, kafka 의존성을 설정한 프로젝트 생성
- application.yml 파일을 생성하고 카프카 설정을 추가
```yaml {filename="application.yml"}
spring:
  kafka:
    bootstrap-servers: 43.202.64.36:9092
    consumer:
      group-id: itstudy
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.serialization.StringDeserializer
    producer:
      key-deserializer: org.apache.kafka.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.serialization.StringDeserializer
```
- 프로젝트에 카프카 환경 설정 클래스를 추가(KafkaConfiguration)
```java
import org.apache.kafka.common.serialization.StringSerializer;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfiguration {
   //application.properties 나 application.yaml 파일에 있는
   //키의 값을 가져와서 설정
   @Value("${spring.kafka.bootstrap-servers}")
   private String bootstrapServers;
  
   @Bean
   public ProducerFactory<String, String> producerFactory(){
       Map<String, Object> configs = new HashMap<>();
       configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
       configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       return new DefaultKafkaProducerFactory(configs);
   }

@Bean
public KafkaTemplate<String, String> kafkaTemplate(){
   return new KafkaTemplate<>(producerFactory());
   } 
}
```
- 로그 전송 클래스
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
public class KafkaProducer {
   //토픽이름
   private static final String TOPIC = "log-topic";


   @Autowired
   private KafkaTemplate<String, String> kafkaTemplate;


   //토픽을 전송하는 메서드
   public void sendTopic(String timestamp){
       StringBuilder sb = new StringBuilder("time:");
       sb.append(timestamp);
       kafkaTemplate.send(TOPIC, sb.toString());
   }
}
```
- Controller 클래스
```java
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.GregorianCalendar;
import java.util.Calendar;
@RestController
@RequiredArgsConstructor
public class FrontController {
   private final KafkaProducer kafkaProducer;


   @GetMapping("/health")
   public String health() {
       return "OK";
   }


   @GetMapping("/")
   public String index() {
       Calendar cal = new GregorianCalendar();
       kafkaProducer.sendTopic(cal.toString());
       return "MyWeb";
   }
}
```
- 실행 한 후 localhost:8080을 브라우저에서 호출

### 3)kafka로 부터 로그 메시지를 받아서 파일로 저장한 후 S3에 업로드하는 애플리케이션
- 로그를 전송하는 애플리케이션 과 동일한 의존성을 가진 Spring 프로젝트 생성
- 이전 프로젝트에서 작성했던 application.yaml 파일을 복사해서 가져옵니다.

```yml
server:
 port: 8090
spring:
 kafka:
   bootstrap-servers: 43.202.4.59:9092
   consumer:
     group-id: itstudy
     auto-offset-reset: earliest
     key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
     value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
   producer:
     key-serializer: org.apache.kafka.common.serialization.StringSerializer
     value-serializer: org.apache.kafka.common.serialization.StringSerializer
```
- 카프카 환경 설정 클래스도 그대로 사용
```java
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;




import java.util.HashMap;
import java.util.Map;


@Configuration
public class KafkaConfiguration {
   //application.properties 나 application.yaml 파일에 있는
   //키의 값을 가져와서 설정
   @Value("${spring.kafka.bootstrap-servers}")
   private String bootstrapServers;


   @Bean
   public ProducerFactory<String, String> producerFactory(){
       Map<String, Object> configs = new HashMap<>();
       configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
       configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       return new DefaultKafkaProducerFactory(configs);
   }


   @Bean
   public KafkaTemplate<String, String> kafkaTemplate(){
       return new KafkaTemplate<>(producerFactory());
   }
}
```
- 토픽으로부터 메시지를 읽어오는 클래스
```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;


@Service
public class KafkaConsumer {
   @KafkaListener(topics="log-topic",groupId="itstudy")
   public void listen(String message) throws Exception {
       System.out.println(message);
       String filename = "log.txt";
       File file = new File(filename);
       FileWriter writer = new FileWriter(file, true);
      
       writer.write(message);
       writer.close();


   }
}
```
- 외부에서 S3 버킷을 사용하고자 하면 버킷 사용 권한을 가진 사용자의 키가 필요합니다.
  - AWS의 IAM에 접속
  - 사용자를 생성하는데 S3FullAccess 권한을 연결합니다.
  - 사용자를 생성한 후 [보안 자격 증명]에서 Access Key를 발급받아서 로컬 컴퓨터에 저장합니다.
- 버킷 생성
  - 버킷을 생성할 때 public access 가 가능하도록 생성
  - ACL 활성화 됨을 선택하고 아래의 퍼블릭 엑세스 차단을 해제
  - 버킷의 권한을 수정
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicListGet",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:List*",
                "s3:Get*",
                "s3:Put*",
                "s3:Delete*"
            ],
            "Resource": [
                "arn:aws:s3:::itstudylogbucket",
                "arn:aws:s3:::itstudylogbucket/*"
            ]
        }
    ]
}
```
- 파일을 업로드할 프로젝트의 build.gradle의 dependencies에 AWS 의존성 라이브러리 설정
```
implementation 'io.awspring.cloud:spring-cloud-starter-aws:2.3.1'
```
- 파일을 업로드할 프로젝트의 application.yml 파일에 S3 버킷에 대한 설정 추가
```yml
cloud:
 aws:
   credentials:
     access-key: 
     secret-key: 
   s3:
     bucket: itstudylogbucket
   region:
     static: ap-northeast-2
   stack:
     auto: false
```
- 업로드할 때 마다 파일 이름을 구분해서 업로드가 되도록 해주는 파일 이름을 생성해주는 메서드를 소유한 클래스
```java
public class CommonUtils {
   private static final String EXETENSION_SEPERATOR = ".";
   private static final String TIME_SEPERATOR = "_";


   //원본 파일을 가지고 실제 업로드되는 파일 이름을 만들어주는 메서드
   public static String fileNameCreate(String fileName){
       int extensionIndex = fileName.lastIndexOf(EXETENSION_SEPERATOR);
       String fileExtension = fileName.substring(extensionIndex);
       String uploadName = fileName.substring(0, extensionIndex);
       String now = String.valueOf(System.currentTimeMillis());


       StringBuilder sb = new StringBuilder(uploadName)
               .append(TIME_SEPERATOR)
               .append(now)
               .append(fileExtension);
       return sb.toString();


   }
}
```
- 토픽으로부터 메시지를 읽어오는 클래스
```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;


@Service
public class KafkaConsumer {
   @KafkaListener(topics="log-topic",groupId="itstudy")
   public void listen(String message) throws Exception {
       System.out.println(message);
       String filename = "log.txt";
       File file = new File(filename);
       FileWriter writer = new FileWriter(file, true);
      
       writer.write(message);
       writer.close();


   }
}
```
- 로그 소스가 많을 경우 날짜 별로 디렉터리 만들어서 정리
- 버킷에 똑같은 이름 방지: 이름 + 날짜시간, 이름 + UUID