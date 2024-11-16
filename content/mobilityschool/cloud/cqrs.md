---
title: CQRS
weight: 3
---
- Kafka는 도커를 이용해서 설치
```yml
version: '2'
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

- 디렉터리에 docker-compose.yml 파일을 생성하고 작성
- 터미널에서 `docker compose up -d`
- 기본 설정을 변경
- 터미널에서 도커 컨테이너 쉘에 접속: `docker exec -it kafka /bin/bash`
- 설정 파일을 열기: `vi opt/kafka/config/server.properties`
- 코드 추가
```
listeners=PLAINTEXT://9092
delete.topic.enable=true
auto.create.topics.enable=true
```
- 외부에서 접속 가능하도록 할 때 추가
```
advertised.listeners=PLAINTEXT://공인ip:9092
```
- 터미널에서 구독과 게시
  - 터미널에서 도커 컨테이너 쉘 접속: `docker exec -it kafka /bin/bash`
  - 디렉터리 이동: `cd /opt/kafka/bin`
  - 게시 생성: `kafka-console-producer.sh --topic exam-topic --broker-list localhost:9092`
  - 구독: 터미널을 하나 더 실행시키고 위 코드 똑같이 실행 후
    - `kafka-console-consumer.sh --topic exam-topic --bootstrap-server localhost:9092 --from-beginning`


### Spring Boot Kafka 사용
- JDK17이상 버전 설치
- 설치 확인
  - Java Runtime(실행 환경) 확인: java -version
  - Java Development Kit(개발 환경) 확인: javac -version
  - 설치: google에서 jdk 설치로 검색해서 첫벉째 사이트에서 다운로드 받아서 설치

### Spring Framework IDE 설치
- Intelli J Ultimate 버전 설치

### 하나의 자바 애플리케이션에서 게시와 구독
- Spring Boot Project 생성
  - 의존성(JDK가 기본적으로 제공하지 않는 라이브러리를 사용)
  - Lombok
  - Spring Boot DevTools
  - Spring Web
  - Spring Apache Kafka
- yaml(yml) 파일 작성 요령
  - 내부 속성을 설정할 때는 :를 하고 들여쓰기를 한 후 작성
  - 속성: 값의 형태로 작성
  - 배열의 경우는 -값의 형태로 줄 단위로 나열
- kafka 설정
  - resources 디렉토리의 application.properties 파일을 삭제하고 application.yml 파일을 생성하고 작성
```yml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: dhsoft
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringDeserializer
      value-serializer: org.apache.kafka.common.serialization.StringDeserializer
```
  - 설정 클래스를 추가하고 작성(KafkaConfiguration)
```java
package com.adamsoft.kafkasample;

//Java 에서 import는 짧게 쓰기 위해서 사용합니다.
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


//환경 설정 클래스라는 것을 알려주는 어노테이션
//인스턴스를 생성해서 직접 관리하지 않고 프레임워크가 생명 주기를 관리: 제어의 역전
@Configuration
public class KafkaConfiguration {
   //설정 파일에서 값을 가지고 와서 주입하는 코드
   @Value("${spring.kafka.bootstrap-servers}")
   private String bootstrapServers;


   //메시지를 게시하는 프로듀서의 설정
   @Bean
   public ProducerFactory<String, String> producerFactory() {


       Map<String,Object> configs = new HashMap<>();
       configs.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
       configs.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       configs.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
       return new DefaultKafkaProducerFactory(configs);
   }
   //카프카 사용을 위한 인스턴스를 생성해주는 메서드
   @Bean
   public KafkaTemplate<String, String> kafkaTemplate() {
       return new KafkaTemplate<>(producerFactory());
   }
}

```
- 제어의 역전(IoC): 클래스를 개발자가 만들고 인스턴스를 프레임워크나 컨테이너가 만들어서 수명 주기를 관리하는 것
  - 일반적인 프레임워크는 클래스가 제공하고 개발자가 인스턴스를 만들어서 수명주기를 관리
  - 이렇게 함으로써 개발자는 디자인 패턴이나 수명 주기에 대해서 고민할 필요가 없어져서 빠르게 개발을 할 수 있게 됨
- 의존성(Dependency Injection): 클래스 내부에서 사용할 인스턴스를 내부에서 직접 생성하지 않고 외부에서 만들어서 생성자나 setter를 이용해서 대입받아서 사용하는 것으로 인스턴스 사이의 결합도를 낮추어서 하나의 변경이 다른 하나에 영향을 미치는 것을 줄여주는 기법
- 메시지를 게시하는 클래스를 생성(KafkaProducer)
```java
package com.dhsoft.kafkasample;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


//서비스 클래스 라는 것을 명시하고 인스턴스를 자동으로 생성해달라고 하는 어노테이션
@Service
//자동 주입되는 인스턴스를 대입받는 생성자를 만들어 달라는 어노테이션
@RequiredArgsConstructor
public class KafkaProducer {
    //토픽 이름 설정
    private static final String TOPIC = "exam-topic";


    //의존성 주입을 받기 위한 어노테이션
    @Autowired
    private  KafkaTemplate<String, String> kafkaTemplate;
    //로그 출력하기 위한 인스턴스를 생성
    private final Logger log = LoggerFactory.getLogger(getClass());

    //메시지 전송하는 메서드
    public void sendMessage(String name, int age) {
        log.info("Produce message : {}{}", name, age);
        //System.out.println("전송된 메시지:" +  name + age);
        String message = "{\"name\":" + "\"" + name + "\"" + ", \"age\":" + age + "}";
        //실제 메시지 전송
        this.kafkaTemplate.send(TOPIC, message);
    }
}
```
- JSON 파싱을 위한 라이브러리의 의존성을 설정(build.gradle 파일의 dependency에 추가)
``implementation 'org.json:json:20190722'`` 을 추가하고 상단의 코끼리 모양의 아이콘을 눌러서 그레들 업데이트를 수행

- 메시지 구독 클래스를 생성
```java
package com.dhsoft.kafkasample;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class KafkaConsumer {
    private final Logger log = LoggerFactory.getLogger(getClass());

    //exam-topic에 들어오는 메시지를 읽어내는 메서드: 비동기적으로 백그라운드에서 수행
    //토픽이 들어오면 자동으로 호출
    @KafkaListener(topics = "exam-topic", groupId = "adamsoft")
    public void consume(String message) throws IOException {
        log.info("Consumed message : {}", message);
        JSONObject messageObj = new JSONObject(message);
        log.info(messageObj.getString("name"));
        log.info(messageObj.getInt("age") + "");
    }
}
```
- 사용자의 요청을 처리하는 클래스 생성(KafkaController)
```java
package com.dhsoft.kafkasample;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//데이터를 리턴하는 컨트롤러: REST API를 만들기 위한 어노테이션
@RestController
//요청 경로
@RequestMapping(value = "/kafka")
@Slf4j
@RequiredArgsConstructor
public class KafkaController {
    @Autowired
    private KafkaProducer producer;
    
    //POST 방식으로 요청이 오면 처리
    @PostMapping
    @ResponseBody
    public String sendMessage(@RequestParam("name") String name,
                              @RequestParam("age") int age) {
        this.producer.sendMessage(name, age);
        return "success";
    }
}
```
- 실행: 상단의 삼각형 아이콘 클릭 - 8080포트로 애플리케이션이 시작됨
- POSTMAN API를 이용해서 127.0.0.1:8080/kafka에 POST 방식으로 name과 age의 값을 설정해서 전송

## Django CQRS 구현(Matia DB와 MongoDB 이용)
### 준비
- MariDB 접속되는지 확인
- MongoDB 접속 확인
- 쓰기 작업은 RDBMS 인 Maria DB를 이용하고 읽기 작업은 Mongo DB를 사용
- 둘 사이의 동기화는 Kafka를 이용한 이벤트 처리로 수행
- djangocqrs 폴더 및 /write /read 폴더 생성

### 데이터 쓰기 프로젝트
- write 폴더로 이동
- 가상 환경 생성: `python3 -m venv myvenv`
- 가상 환경 활성화: `폴더/Scripts/activate`
- 필요한 패키지 설치
  - django djangorestframework mysqlclientls
- 프로젝트 생성
  - `django-admin startproject writebook .`
- 애플리케이션 생성
  - `python manage.py startapp writeapp`
- settings.py 파일 수정
```python
INSTALLED_APPS 부분에 추가
'rest_framework',
'writeapp' #자신의 앱 이름
DATABASES 정보 수정
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME': 'cqrs',
       'USER': 'root',
       'PASSWORD': '0000',
       'HOST':'127.0.0.1',
       'PORT':''
   }
}
```
- urls.py 파일을 수정해서 cqrs로 시작하는 요청은 app의 urls에서 처리하도록 설정
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
   path('admin/', admin.site.urls),
 path("cqrs/", include("writeapp.urls"))
]
```
- writeapp 에 urls.py 파일을 만들고 요청을 처리하는 부분을 작성
```python
from django.urls import path
from .views import helloAPI

urlpatterns = [
   path("hello/", helloAPI)
]

=>views.py 파일에 helloAPI 작성
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def helloAPI(request):
   return Response("hello world")
```
- 서버 구동 `python manage.py runserver 127.0.0.1:7000`
- 모델 생성: writeapp의 models.py 파일에 작성
```python
from django.db import models

class Book(models.Model):
   bid = models.AutoField(primary_key=True)
   title = models.CharField(max_length=50)
   author = models.CharField(max_length=50)
   category = models.CharField(max_length=50)
   pages = models.IntegerField()
   price = models.IntegerField()
   published_date = models.DateField()
   description = models.TextField()
```
- 데이터베이스에 반영
```bash
python manage.py makemigrations writeapp
python manage.py migrate
```
  - 데이터베이스에 접속해서 테이블을 확인: show tables

- 인스턴스 단위로 JSON 데이터를 만들어서 전송할 수 있도록 Serializer 클래스를 생성(serializers.py)
```python
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
   class Meta:
       model = Book
       fields = ['bid', 'title', 'author',
                 'category', 'pages', 'price',
                 'published_date', 'description']
```
- POST방식으로 요청을 하면 데이터를 삽입하는 요청 처리 함수를 작성(views.py 파일에 작성)
- 애플리케이션의 urls.py 파일에서 url 과 요청 처리 함수 연결
```python
from django.urls import path
from .views import helloAPI, bookAPI

urlpatterns = [
   path("hello/", helloAPI),
   path("book/", bookAPI)
]
```
- 애플리케이션 실행 `python manage.py runserver 127.0.0.1:7000`

## Client Application
- 클라이언트 프로젝트가 저장될 디렉터리 생성 djangocqrs/client
- 디렉터리에서 client application 생성
  - `yarn create react-app cqrsclient`
- react 애플리케이션 생성
  - `yarn start`
- 아이콘 사용을 위한 패키지 설치
```bash
npm install --save --legacy-peer-deps @material-ui/core
npm install --save --legacy-peer-deps @material-ui/icons
```

- 비동기 데이터 요청을 쉽게 작성하기 위한 패키지를 설치 `yarn add axios`

- 데이터를 삽입하기 위한 컴포넌트 생성(AddBook.jsx)
```javascript
import React , { useState }from "react"
import { TextField, Paper, Button, Grid } from "@material-ui/core";

function AddBook(props) {
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [category, setCategory] = useState("");
   const [pages, setPages] = useState("");
   const [price, setPrice] = useState("");
   const [published_date, setPublished_date] = useState("");
   const [description, setDescription] = useState("");

   const onTitleChange = (event) => {
       setTitle(event.target.value);
   };
   const onAuthorChange = (event) => {
       setAuthor(event.target.value);
   };
   const onCategoryChange = (event) => {
       setCategory(event.target.value);
   };
   const onPagesChange = (event) => {
       setPages(event.target.value);
   };
   const onPriceChange = (event) => {
       setPrice(event.target.value);
   };
   const onPublished_dateChange = (event) => {
       setPublished_date(event.target.value);
   };
   const onDescriptionChange = (event) => {
       setDescription(event.target.value);
   };
   const onSubmit = (event) => {
       event.preventDefault();
       const book = {}
       book.title=title
       book.author = author
       book.category = category
       book.pages = pages
       book.price = price
       book.published_date = published_date
       book.description = description
       props.add(book)
       setTitle("")
       setAuthor("")
       setCategory("")
       setPages("")
       setPrice("")
       setPublished_date("")
       setDescription("")
   };

   return(
       <Paper style={{ margin: 16, padding: 16 }}>
       <Grid container>
         <Grid xs={6} md={6} item style={{ paddingRight: 16 }}>
           <TextField
             onChange={onTitleChange}
             value = {title}
             placeholder="Add Book Title"
             fullWidth
           />
         </Grid>
         <Grid xs={6} md={6} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onAuthorChange}
           value = {author}
             placeholder="Add Book Author"
             fullWidth
           />
         </Grid>
         <Grid xs={3} md={3} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onCategoryChange}
           value = {category}
             placeholder="Add Book Category"
             fullWidth
           />
         </Grid>
         <Grid xs={3} md={3} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onPagesChange}
           value = {pages}
             placeholder="Add Book Pages"
             fullWidth
           />
         </Grid>
         <Grid xs={3} md={3} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onPriceChange}
           value = {price}
             placeholder="Add Book Price"
             fullWidth
           />
         </Grid>
         <Grid xs={3} md={3} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onPublished_dateChange}
           value = {published_date}
             placeholder="Add Book Published_Date"
             fullWidth
           />
         </Grid>
         <Grid xs={11} md={11} item style={{ paddingRight: 16 }}>
           <TextField
           onChange={onDescriptionChange}
           value = {description}
             placeholder="Add Book Description"
             fullWidth
           />
         </Grid>
         <Grid xs={1} md={1} item>
           <Button
             fullWidth
             color="secondary"
             variant="outlined"
             onClick={onSubmit}
           >
             +
           </Button>
         </Grid>
       </Grid>
     </Paper>
   );
}

export default AddBook;
```
- App.js를 수정해서 AddBook 컴포넌트를 화면에 출력
```javascript
import './App.css';
import {Paper} from "@material-ui/core"
import AddBook from "./AddBook";
import Axios from "axios";

function App() {
 //데이터 추가를 위한 함수
 const add = (book) => {
     console.log("book : ", book);
     Axios.post("http://127.0.0.1:7000/cqrs/book/", book).then((response) => {
       console.log(response.data)
       if (response.data.bid) {
         alert("저장에 성공했습니다.")
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
   </div>
 );
}

export default App;
```

- 서버 구동: `python manage.py runserver 127.0.0.1:7000`

- 클라이언트 구동: `yarn start`

- 클라이언트 화면에서 데이터를 삽입할려고 하면 에러 발생: CORS 에러
- Client 수행 도중 CORS 에러 해결 -> write 프로젝트에 패키지 설치 `pip install django-cors-headers`
- settings.py 파일의 INSTALLED_APP에 corsheaders를 추가
- writebook/settings.py 파일의 MIDDLEWARE의 최상단에 'corsheaders.middleware.CorsMiddleware', 추가
- settings.py 파일에 요청을 허락할 WHITELIST 작성 
```python
CORS_ORIGIN_WHITELIST = ['http://127.0.0.1:3000','http://localhost:3000']
CORS_ALLOW_CREDENTIALS = True
```

### 데이터 읽기 프로젝트
- 시작할 때 관계형 데이터베이스의 모든 데이터를 읽어서 MongoDB로 저장하고 클라이언트의 요청이 오면 MongoDB의 데이터를 넘겨주는 프로젝트
- 가상 환경 생성: `python -m venv myvenv` 
- 가상 환경 이동: `가상환경폴더/Scripts/activate`
- 패키지 생성 `pip install django, djangorestframework, mysqlclient, django-cors-headers, pymongo`
- 프로젝트 생성: `django-admin startproject readbook .`
- 애플리케이션 생성: `python manage.py startapp readapp`


- settings.py 파일의 INSTALL_APPS에 추가
```python
   'rest_framework',
   'readapp',
   'corsheaders'
```

- settings.py 파일의 MIDDLEWARE 최상단에 추가
```
'corsheaders.middleware.CorsMiddleware',
```

- settings.py 파일에 요청을 허락할 WHITELIST 작성
```python
CORS_ORIGIN_WHITELIST = ['http://127.0.0.1:3000',
                        'http://localhost:3000']
CORS_ALLOW_CREDENTIALS = True
```
- apps.py 파일에 앱이 시작되면 한 번만 수행하는 코드를 작성
```python
from django.apps import AppConfig

class ReadappConfig(AppConfig):
   default_auto_field = 'django.db.models.BigAutoField'
   name = 'readapp'

   def ready(self):
       print("시작하자 마자 한 번만 수행")
```
- settings.py 파일의 INSTALL_APPS의 readapp 부분을 수정
```python
'readapp.apps.ReadappConfig',
```
- 실행시켜서 시작하자 마자 ready의 내용이 출력되는지 확인
- ready 메서드를 수행해서 MySQL의 데이터를 MongoDB로 복제
```python
from django.apps import AppConfig

import pymysql
from pymongo import MongoClient
from datetime import datetime

class ReadappConfig(AppConfig):
   default_auto_field = 'django.db.models.BigAutoField'
   name = 'readapp'

   def ready(self):
       print("시작하자 마자 한 번만 수행")

       #mysql에 접속
       con = pymysql.connect(host='127.0.0.1',
                             port=3306,
                             user='root',
                             passwd='wnddkd',
                             db='cqrs',
                             charset='utf8')
       #Mongo DB에 접속해서 기존 컬렉션 삭제
       conn = MongoClient('127.0.0.1')
       db=conn.cqrs
       collect = db.books
       collect.delete_many({})

       #MySQL의 테이블 읽기
       cursor = con.cursor()
       cursor.execute("select * from writeapp_book")
       data = cursor.fetchall()
       #데이터 순회하면서 데이터를 읽어서 Mongodb에 삽입
       for imsi in data:
           #문자열을 날짜 형식으로 변환
           date = imsi[6].strftime("%Y-%m-%d")
           #Mongodb 데이터 형태 생성
           doc = {'bid':imsi[0], 'title':imsi[1],
                  'author':imsi[2], 'category':imsi[3],
                  'pages':imsi[4], 'price':imsi[5],
                  'published_date': date, 'description':imsi[7]}
           collect.insert_one(doc)
       con.close()
```
- application을 다시한번 실행
- Mongodb에 접속해서 확인
```bash
use cqrs

db.books.find({})
```
- readbook의 urls.py 수정해서 cqrs로 시작하는 요청은 readapp의 urls가 처리하도록 수정
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
   path('admin/', admin.site.urls),
   path('cqrs/', include("readapp.urls"))
]
```

- readapp에 urls.py 파일을 만들고 요청 과 처리 메서드를 연결
```python
from django.urls import path
from .views import bookAPI

urlpatterns = [
   path("books/", bookAPI)
]
```

- readapp의 views.py 파일에 bookAPI 함수 작성
```python
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from pymongo import MongoClient
from bson import json_util
import json

@api_view(['GET'])
def bookAPI(request):
   conn = MongoClient("127.0.0.1")
   db = conn.cqrs
   collect = db.books

   #데이터 전체 조회
   result = collect.find()
   data = []
   for r in result:
       data.append(r)

   return Response(json.loads(json_util.dumps(data)),
                   status=status.HTTP_201_CREATED)
```

- 실행: `python manage.py runserver`
- 브라우저에서 확인: http://127.0.0.1:8000/cqrs/books/

### client 프로젝트를 수정해서 데이터를 읽어서 출력하도록 작업 - Apps.js 파일 수정
```javascript
import './App.css';
import {Paper} from "@material-ui/core"
import AddBook from "./AddBook";
import Axios from "axios";

import React, {useEffect, useState} from 'react'

function App() {
    // 상태를 생성 - 변수를 생성하고 접근자 함수를 생성
    const [items, setItems] = useState([])
  
    // 화면이 출력되자 마자 수행될 함수
    useEffect(() => {
      Axios.get("http://127.0.0.1:8000/cqrs/books/")
      .then((response) => {
        if(response.data) {
          setItems(response.data)
        }else{
          alert("읽기 실패")
        }
      })
    }, [])

 // 데이터 추가를 위한 함수
 const add = (book) => {
     console.log("book : ", book);
     Axios.post("http://127.0.0.1:7000/cqrs/book/", book).then((response) => {
       console.log(response.data)
       if (response.data.bid) {
         alert("저장에 성공했습니다.")
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
- 읽기 프로젝트를 실행하고 클라이언트 프로젝트도 실행해서 확인
- 쓰기를 하고 새로고침을 해도 추가된 데이터가 출력되지 않음
- 데이터가 추가될 때 읽기 전용 데이터베이스에도 데이터가 추가되어야 함
- 서버를 데이터 사용 용도에 따라 분리시켜서 구현하고 저장소도 분리시킴: Polyglot 하다고 할 수 있으며 CQRS로 구현한 것은 맞는데 데이터 동기화가 이루어지지 않음

### 데이터 쓰기 프로젝트에서 데이털르 쓸 때 카프카 토픽에 전달하도록 수정
- 패키지 설치: `kafka-python`
- writeapp의 views.py

```python
from kafka import KafkaProducer
import json

# 메시지를 전송하는 카프카 프로듀서 클래스
class MessageProducer:
    def __init__(self, broker, topic):
        self.broker = broker
        self.topic = topic

        self.producer = KafkaProducer(
            bootstrap_servers = self.broker,
            value_serializer = lambda x:json.dumps(x).encode("utf-8"),
            acks = 0,
            api_version = (2, 5, 0)
            key_serializer=str.encode,
            retries=3,
        )
    def send_message(self, msg, auto_close=True):
        try:
            future = self.producer.send(self.topic, value=msg, key="key")

            self.producer.flush()
            future.get(timeout=2)
            return {"status_code": 200, "error": None}
        except Exception as exc:

@api_view(['POST'])
def bookAPI(request):
    # 전송된 데이터 읽기
    data = request.data
    
    # 숫자로 변환
    data['pages'] = int(data['pages'])
    data['price'] = int(data['price'])

    # Model 형태로 변환
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        serializer.save() # 테이블에 저장

        # 성공한 경우
        broker = ["localhost:9092"]
        topic = "cqrstopic"

        # 프로듀서 생성
        pd = MessageProducer(broker, topic)
        
        # 메시지 전송
        msg = {"task":"insert", "data":serializer.data}
        res = pd.send_message(msg)
        print(res)

        # 성공한 경우
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # 실패한 경우
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```