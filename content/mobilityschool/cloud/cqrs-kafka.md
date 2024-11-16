---
title: Django, SpringBoot-카프카 연결
weight: 4
---
```
1.프로젝트 내려받기
1)git을 설치하지 않은 경우에는 git 설치
=>google에서 git 설치로 검색해서 설치
=>git을 설치할 때 git이 자동으로 path에 추가되지 않으므로 git이 설치된 디렉토리의 bin 이라는 디렉토리(C:\Program Files\Git\bin)를 path에 추가

2)프로젝트 내려받기
git clone https://github.com/itstudy001/cqrsclient.git

git clone https://github.com/itstudy001/cqrsdjangowrite.git
git clone https://github.com/itstudy001/cqrsdjangoread.git


3)python 프로젝트를 내려받은 경우 수행
=>pip install -r requirements.txt

4)node 프로젝트를 내려받은 경우 수행: package.json 파일에 기록한 의존성 설치
=>npm install
```

## Kafka 연결
### 쓰기 프로젝트
- 패키지 설치 `pip install kafka-python` `pip install six==1.6.0`
- 받을 때: 비동기, 스레드
- 보낼 때: 동기, 비동기
- 카프카의 메시지를 보내는 것은 백그라운드에서 계속 수행 중일 필요가 없지만 메시지를 받는 것은 백그라운드에서 계속 대기 중이어야 합니다.
메시지를 보내는 부분은 동기적으로 동작하던 비동기적으로 하던 아무런 문제가 없지만 메시지를 받는 부분은 비동기적으로 백그라운드에서 계속 수행 중이어야 합니다.

- read의 apps.py에 추가
```python
from kafka import KafkaConsumer

import json
import sys
import six
if sys.version_info >= (3, 12, 0):
    sys.modules["kafka.vendor.six.moves"] = six.moves
import threading

# 카프카 메시지를 읽는 클래스
class MessageConsumer:
    def __init__(self, broker, topic):
        self.broker = broker
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers = self.broker,
            value_deserializer = lambda x: x.decode("utf-8"),
            group_id = "my-group",
            auto_offset_reset = "earliest",
            enable_auto_commit = True
        )
    def receive_message(self):
        try:
            for message in self.consumer:
                result = json.loads(message.value)
                imsi = result["data"]
                doc = {"bid":imsi["bid"], "title":imsi["title"],
                       "author":imsi["author"],
                       "category":imsi["category"],
                       "pages":imsi["pages"],
                       "price":imsi["price"],
                       "published_date":imsi["published_date"],
                       "description":imsi["description"]}
                # MongoDB에 삽입
                conn = MongoClient('127.0.0.1')
                db=conn.cqrs
                collect = db.books
                collect.insert_one(doc)
                conn.close()
        except Exception as exc:
            raise exc
```
```python
        con.close()

        # 메시지 수신자 생성
        broker = ["localhost:9092"]
        topic = "cqrstopic"
        consumer = MessageConsumer(broker)
        # 스레드로 메서드 호출
        t = threading.Thread(target=consumer.receive_message)
        t.start()
```
### 클라이언트 프로젝트를 수정해서 데이터를 삽입하면 자동으로 출력을 새로해서 추가된 데이터를 화면에 출력하기
- 상태를 하나 생성해서 데이터가 추가될 때 상태에 변화를 주고 이 변화가 발생하면 데이터를 다시 가져오도록 코드를 수정
- apps.js 파일을 수정
```javascript
import './App.css';
import {Paper} from "@material-ui/core"
import AddBook from "./AddBook";
import Axios from "axios";

import React, {useEffect, useState} from 'react'

function App() {
 //상태를 생성 - 변수를 생성하고 접근자 함수를 생성
 const [items, setItems] = useState([])
 const [data, setData] = useState([0])

 //화면이 출력되자마자 수행될 함수
 //data가 변경된 경우 동작
 useEffect(() => {
   Axios.get("http://127.0.0.1:8000/cqrs/books/")
   .then((response) => {
     console.log(response.data)
     if(response.data){
       setItems(response.data)
     }else{
       alert("읽기 실패")
     }
   })
 }, [data])

 //데이터 추가를 위한 함수
 const add = (book) => {
     console.log("book : ", book);
     Axios.post("http://127.0.0.1:7000/cqrs/book/", book).then((response) => {
       console.log(response.data)
       if (response.data.bid) {
         alert("저장에 성공했습니다.")
         //데이터가 추가될 때 상태를 변경해서
         //데이터를 다시 출력하도록 합니다.
         setData(1)
       } else {
         alert("코멘트를 저장하지 못했습니다.");
       }
     });
 };

 return (
   <div className="App">
     <Paper style={{ margin: 16 }}>
       <AddBook add = {add}/>
     </Paper>
     {items.map((item, index) => (
      <p key={index}>
        {item.title}
      </p>
    ))}

   </div>
 );
}

export default App;
```

## Spring Boot를 이용한 CQRS 구현
### Micro Service & CQRS
- Micro Service: 느슨한 결합, 어느 하나의 변화가 다른 하나에 영향을 주지 않도록 서비스를 작게 만드는 것
- 서버 애플리케이션과 클라이언트 애플리케이션을 구분하며 도메인 별로 서버 애플리케이션을 분리
- CQRS: 도메인 내에서도 작업에 따라 애플리케이션을 구분
  - 보통의 경우는 읽기와 쓰기(삽입, 삭제, 수정)를 분리
  - 데이터베이스도 분리해야 함
  - 읽기 작업은 NoSQL이나 InMemory DB 쓰기 작업은 RDBMS를 선호

### 확인
- 관계형데이터베이스 구동 중인지 확인
- NoSQL 구동 중인지 확인
- 카프카 구동 중인지 확인

## 데이터를 기록하는 프로젝트를 생성
### 프로젝트를 생성
- 의존성: LOMBOK, Spring Boot DevTools, Spring Web, Spring Data JPA, MySQL Driver, Kafka

### 설정 변경
- main 디렉터리에 있는 application.properties를 삭제하고 application.yml 파일을 생성하고 작성
```yml
server:
  port: 7000

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mariadb://127.0.0.1:3306/springcqrs
    username: root
    password: 0000

jpa:
  hibernate:
    ddl-auto: update
  properties:
    hibernate:
      format_sql: true
      show_sql: true
```
- 서버와 클라이언트 애플리케이션을 분리해서 만드는 경우 클라이언트가 웹 이라면 CORS 설정을 해줘야 함
  - 웹 브라우저 안에서 동작하는 javascript의 경우 동일한 도메인이 아니면 데이터를 요청할 수 없음(same origin policy)
  - 서버에서 클라이언트를 화이트리스트에 포함시키거나 클라이언트 측에서 Proxy형태로 동작하는 코드를 만들거나 설정을 추가해야 함
  - 설정 클래스를 추가하고 작성(WebConfig)
```java {filename="java/com/example/demo/WebConfig.java"}
package com.example.demo;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configurable
public class WebConfig  implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http:/localhost:3000");
    }
}
```
## 관계형 데이터베이스의 테이블과 매핑이 되는 Entity 클래스를 생성 - ddl-auto 가 update로 설정되어 있으면 이 클래스를 수정하면 관계형 데이터베이스에 자동 반영됩니다.

## 데이터 읽어오는 프로젝트
### 프로젝트 생성
- 의존성 설정: Spring Boot Devtools, Lombok, Spring Web

### 웹 애플리케이션이 시작하자 마자(ApplicationListener 인터페이스의 onApplicationEvent 메서드를 오버라이딩 하면 됨) MySQL의 데이터를 Mongo DB로 복사: MySQL의 데이터가 없었다면 MySQL 설정이나 Book, BookRepository 그리고 이 작업은 수행할 필요가 없음

### 쓰기 프로젝트에 카프카를 연결해서 데이터를 삽입할 때 토픽을 전송
- 카프카의 의존성을 build.gradle의 dependencies에 추가 - 프로젝트를 만들 때 추가한 경우는 할 필요가 없음
- 카프카 환경 설정 클래스를 추가
```java {filename="KafkaConfiguration.java"}
package com.gmail.dragonhailstone.dataread;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class KafkaConfiguration {
    @Value("${spring.kafka.bootstrap.servers}")
    private String bootstrapServers;


    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(configs);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```