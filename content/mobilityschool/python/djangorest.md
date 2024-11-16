---
title: Django REST Framework
linkTitle: Django REST
weight: 12
---

## REST API
### API(Application Programming Interface)
- 프로그램과 프로그램을 연결시켜주는 매개체
- 프로그램과 통신을 위해서 제공
- 프레임워크 형태로 제공하기도 하고 데이터 형태로 제공하기도 함
- 비슷한 말로 Software Developer Kit 이라고 하기도 함
- Open API 라고 부르면 API를 누구나 사용할 수 있도록 해준 것

### CSR(Client Side Rendering)
- API Server를 만들어서 데이터를 제공하도록 만들고 클라이언트에서 이 데이터를 제공받아서 출력하는 방식
- Server Side Rendering은 서버가 처리를 한 후 그 데이터를 가지고 템플릿 엔진을 이용해서 HTML을 만들어서 클라이언트에게 제공하는 방식
- CSR 방식은 클라이언트에서 데이터를 가공해서 화면에 출력을 하기 때문에 데이터를 어떤 형식으로 주고 받을지 결정을 해야 하는데 가장 많이 사용된 방식은 XML과 JSON
- XML(eXtensible Markup Language)
  - HTML은 브라우저가 해석하지만 xMl은 개발자나 프레임워크가 해석
  - XML은 구조적
  - JSON보다 인간이 읽기가 쉽지만 용량이 큼
  - 프레임워크의 설정 파일에 많이 이용되어 있는데 클라우드 환경에서는 이 방식보다 YAML을 선호
- JSON(Javascript Object Notation)
  - 자바스크립트의 객체 표현 방식을 이용
  - XML보다 경량이지만 인간이 읽기가 어려움
  - 인간이 읽기가 어렵기 때문에 설정 파일에 사용하기는 어렵고 데이터 전송에 많이 사용함
  - 스마트폰 운영체제의 데이터 전송 방식은 전부 JSON

### REST(REpresentational State Transfer)
- 분산 하이퍼미디어 시스템을 위한 소프트웨어 아키텍처의 형식
- 자원을 정의하고 자원에 대한 주소를 지정하는 방법 전반을 일컫는 말로 웹 상의 자료를 HTTP 위에서 SOAP(Simple Object Access Protocol)이나 쿠키를 통한 세션 트래킹같은 별도의 전송 계층없이 전송하기 위한 아주 간단한 인터페이스
- REST원리를 따르는 시스템을 RESTful 하다라고 함
- 6가지 제약조건
  - Client - Server 구조
  - Stateless(무상태): 클라이언트가 서버에 요청을 보낼 때 이전 요청의 영향을 받지 않아야 함
  - Cacheable Data: 서버에서 리소스를 리턴할 때 캐시가 가능한지 아닌지를 명시해야 하는 것인데 HTTP에서 cache-control 이라는 헤더에 리소스의 캐시 여부를 명시할 수 있음
  - Layered System: 여러 개의 레이어로 된 서버를 사용할 수 있음, 클라이언트는 이 사실을 알 필요가 없음. 하나의 시스템을 여러 개의 애플리케이션으로 분리해서 구현하기도 하고 인증 서버, 캐싱 서버, 로드 밸런서를 거쳐서 응답을 하기도 함
  - A Uniform Interface: 일관성있는 인터페이스를 가져야 함, HTML과 JSON두가지 형태의 데이터를 사용하는 것은 안됨, 동일한 컨텐츠를 사용하는 경우 동일한 URL을 사용하는 것을 권장
  - http://www.ex.com/todo: GET방식이면 가져오기, POST 방식이면 삽입 PUT이면 수정 DELETE이면 삭제 이렇게 HTTP 메서드로 작업을 구분
  - Code-On-Demand: 선택 사항으로 클라이언트는 서버에 코드를 요청할 수 있고 서버가 리턴한 코드를 실행할 수 있음

## Django REST Framework
- REST API를 만들 수 있는 프레임워크
- 설치 `pip install djangorestframework`

### 프로젝트 생성
- `django-admin startproject 프로젝트이름 경로`

### 애플리케이션 생성
- 프로젝트의 manage.py 파일이 있는 디렉터리에서 수행
- `python manage.py startapp 애플리케이션이름`

### settings.py 파일 수정
- INSTALLED_APPS 부분에 rest_framework와 자신의 애플리케이션 등록
- DATABASES 부분, TIME_ZONE 수정
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'rest',
        'USER': 'root',
        'PASSWORD': '0000',
        'HOST': '127.0.0.1',
        'PORT': ''
    }
}

TIME_ZONE = 'Asia/Seoul'
```
### urls.py 파일을 수정해서 example로 시작하는 url에 대한 처리는 apiapp의 urls.py에서 처리하도록 수정
- 프로젝트에 여러 개의 애플리케이션 존재하는 경우 프로젝트에서 모든 요청을 처리하도록 하면 프로젝트의 urls.py 가 너무 복잡해지므로 요청을 처리하는 로직이나 url 설정을 애플리케이션 단위로 분할하는 것이 좋음
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('example/',  include('apiapp.urls')),
]
```
### 요청을 만들고 JSON을 리턴하는 코드를 작성
- apiapp 디렉터리에 urls.py 파일을 추가하고 작성
```python
from django.urls import path
from .views import helloAPI

urlpatterns = [
    path("hello/", helloAPI),
]
```
- apiapp 디렉터리의 views.py 파일에 helloAPI 함수를 추가
```python
from django.shortcuts import render # 템플릿 엔진을 이용해서 HTML 출력에 사용
from rest_framework.decorators import api_view
from rest_framework.response import Response # json 데이터 생성에 사용

# GET 방식으로 온 요청만 처리
@api_view(['GET'])
def helloAPI(request):
    return Response("Hello REST API")
```
- 관리자용 테이블을 생성
```python
python manage.py makemigrations
python manage.py migrate
```
- 확인
  - 웹서버를 실행: `python manage.py runserver 127.0.0.1:80`
  - 브라우저에서 확인: http://127.0.0.1/example/hello/

### Response
- 응답 결과를 만들기 위한 클래스
- 인스턴스를 생성할 때 첫번째 매개변수가 클라이언트에게 전송될 데이터
- status는 상태 코드
- 주요 상태 코드
  - 200: OK
  - 201: created - 요청은 처리되어서 새로운 리소스를 생성
  - 202: Accepted - 요청은 접수되었지만 처리가 완료되지 않음
  - 3xx: 리다이렉션 중
  - 400: 잘못된 요청
  - 401: 권한이 없음
  - 403: 권한 처리 이외의 사유로 리소스에 대한 액세스가 금지
  - 404: 지정한 리소스를 찾을 수 없음, 서버에서 처리하는 로직을 찾을 수 없음
  - 500: 내부 서버 오류
- 응답 결과를 전송할 때 상태 코드를 같이 전송해서 정상 처리 여부를 알려주는 것이 좋음

### Django와 다른점
- 실행 부분에 HTTP의 헤더가 보임
- 템플릿의 형태가 아닌 JSON과 같은 형태의 응답을 제공
- Serializer(직렬화)
  - 인스턴스 단위로 파일이나 네트워크를 통해 전송하는 것
  - Djangorestframework에서는 Model을 JSON 데이터로 변환하는 작업

### Model 생성
- 애플리케이션의 models.py 파일에 Model 클래스로부터 상속받는 클래스 생성
```python
from django.db import models

# Create your models here.
class newclass(models.Model):
    bid = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    pages = models.IntegerField()
    price = models.IntegerField()
    published_date = models.DateField()
    description = models.TextField()
```
- 변경 내용 저장
```python
python manage.py makemigrations
python manage.py migrate
```

### 모델의 데이터를 json 문자열로 변환해서 출력해주는 Serializer를 생성
- apiapp 디렉터리에 시리얼라이저를 구현할 serializers.py 파일을 생성하고 작성
```python
from rest_framework import serializers
from .models import newclass

class newclassSerializer(serializers.ModelSerializer):
    class Meta:
        model = newclass
        fields = ['bid', 'title', 'author', 'category', 'pages', 'price', 'published_date', 'description']
```
### apiapp 디렉터리에 요청을 처리하는 함수를 작성 - 전체 가져오기, 데이터 삽입, 데이터 1개 가져오기
```python
from rest_framework import status
from rest_framework.generics import get_object_or_404
from .models import newclass
from .serializer import newclassSerializer

# 하나의 함수를 가지고 GET과 POST를 구분해서 처리
@api_view(['GET', 'POST'])
def newclassesAPI(request):
    if request.method == 'GET':
        # 테이블의 전체 데이터 가져오기
        newclasses = newclass.objects.all()
        # 가져온 데이터를 JSON 문자열로 변환
        serializer = newclassSerializer(newclasses, many=True)
        # JSON으로 출력
        return Response(serializer.data, status = status.HTTP_200_OK)
    elif request.method =='POST':
        # 클라이언트에게서 전송된 문자열을 모델로 변환
        serializer = newclassSerializer(data=request.data)
        # 데이터가 유효성 검사를 통과하면 삽입하고 그렇지 않으면 에러 코드를 전송
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# 기본키 값을 받아서 하나의 데이터를  찾아서 출력하는 함수
@api_view(['GET'])
def newclassAPI(request, bid):
    newc = get_object_or_404(newclass, bid=bid)
    serializer = newclassSerializer(newc)
    return Response(serializer.data, status=status.HTTP_200_OK)
```

### apiapp 디렉터리의 urls.py 파일에 url과 요청을 처리하는 함수를 연결
```python
from django.urls import path
from .views import helloAPI, newclassAPI, newclassesAPI

urlpatterns = [
    path("hello/", helloAPI),
    path("fbv/newclasses", newclassesAPI),
    path("fbv/newclass/", newclassAPI),
]
```
### 브라우저에서 확인
- 127.0.0.1/example/fbv/newclasses 와 fbv/newclass/<bid> 로 확인
  
## 웹 클라이언트 애플리케이션에서 웹 서버의 데이터 가져오기
- 템플릿 엔진을 이용하는 방식은 서버를 만들 때 사용한 언어를 가지고 클라이언트에게 출력물을 만들어서 제공하는 방식
- 서버의 데이터를 가져와서 출력하는 방식은 서버는 JSON이나 XML 데이터를 만드는 것까지만 하고 클라이언트가 데이터를 파싱해서 출력하는 방식

### 방법
- 가장 전통적인 방법: ajax(Asynchronous + XML)
- Javascript를 이용해서 XML데이터를 비동기적으로 받아서 처리하는 기술
- 최근에는 XML뿐 아니라 JSON데이터를 가져와도 ajax라고함
- 비동기적으로 동작을 하기 때문에 콜백을 이용해서 처리해야 하고 동작이 수행중이더라도 따른 작업을 수행하는 것이 가능
- 웹 페이지가 사용자가 하고 있는 것을 방해하지 않으면서 서버에서 데이터를 받아서 일부분을 수정하고자 할 때 사용

### Fetch API
- ajax와 동일한 기능을 수행하는데 콜백이 아닌 다른 방식으로 요청을 처리
- 전역 fetch 함수를 이용
- axios와 같은 외부 라이브러리 이용
- 서버에서 일방적으롣 데이터를 전송하고자 하는 경우는 Eventsource를 이용한 SSE(Server Side Event)를 이용 메시지 구독과 게시 방식으로 서버가 클라이언트에게 데이터를 전송
- 완전 양방향 통신(채팅을 원하는 경우 Web socket을 사용)

## ajax(XMLHttpRequest 인스턴스 이용) 구현
- 작업 순서
  - XMLHttpRequest 인스턴스를 생성
  - 이벤트별 리스너(콜백 함수)를 등록
  - 서버로 보낼 데이터를 생성
  - 연결 요청을 준비: open메서드 사용
  - 요청을 전송: send 메서드 이용
  - 응답을 처리: status를 확인
  - 결과를 가지고 다음 작업을 수행: 화면에 출력할 것인지 아니면 다른 페이지로 이동할 지 결정
- 프로젝트의 urls.py 파일에 ajax 요청을 추가
```python
from django.contrib import admin
from django.urls import path, include
from apiapp import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('example/',  include('apiapp.urls')),
    path('ajax/', views.ajax),
]
```
- apiapp 디렉터리의 views.py 파일에 ajax 함수 추가
```python
def ajax(request):
    return render(request, "ajax.html")
```
- apiapp 디렉터리에 templates 디렉터리 생성
- templates 디렉터리에 ajax.html 작성
- 서버를 다시 실행하고 브라우저에서 127.0.0.1/ajax를 요청해서 브라우저의 대화상자에 문자열이 출력되는지 확인
- JSON Parsing
  - JSON은 문자열임
  - 프로그래밍 언어에서 사용하기 위해서는 이 문자열을 원하는 인스턴스로 변환을 해야 하는데 이 작업을 Parsing이라고 함
  - `JSON.parse(JSON 문자열)`: 문자열을 자바스크립트 객체로 변환
  - `JSON.stringfy(JavaScript 객체)`: 자바스크립트 객체를 JSON 문자열로 변환
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ajax</title>
</head>
<body>
    
</body>
<script>
    // ajax 객체를 생성
    let request = new XMLHttpRequest();
    // 전체 데이터를 가져오는 요청을 생성
    request.open('GET', '../example/fbv/newclasses/');
    // 요청 전송
    request.send('');
    // 응답이 오면 호출될 함수를 등록
    request.addEventListener('load', () => {
        // alert(request.responseText)
        // 데이터 파싱
        let data = JSON.parse(request.responseText)
        // 데이터 사용
        for (let idx in data){
            alert(data[idx].bid)
        }
    })
</script>
</html>
```
- POST 방식에 데이터를 포함시켜 전송: ajax.html 수정
```html
<script>
    // ajax 객체를 생성
    let request = new XMLHttpRequest();
    // 전체 데이터를 가져오는 요청을 생성
    request.open('POST', '../example/fbv/newclasses/');

    // 전송할 데이터를 생성
    let formdata = new FormData();
    formdata.append('bid', 3);
    formdata.append('title', '파이썬');
    formdata.append('author', 'adsf');
    formdata.append('category', 'programm');
    formdata.append('pages', 23);
    formdata.append('price', 34245);
    formdata.append('published_date', '2024-08-30');
    formdata.append('description', '설명');

    // 데이터를 헤더에 포함시켜서 전송하기
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    let param = ""
    for (let pair of formdata.entries()) {
        param += pair[0] + '=' + pair[1] + '&'
    }

    // 요청 전송
    request.send(param);
    // 응답이 오면 호출될 함수를 등록
    request.addEventListener('load', () => {
        // alert(request.responseText)
        // 데이터 파싱
        let data = JSON.parse(request.responseText)
        // 데이터 사용
        for (let idx in data){
            alert(data[idx].bid)
        }
    })
</script>
</html>
```
- Fetch API
  - 콜백을 이용하는 것이 아니고 then을 이용해서 비동기 요청을 수행
  - 대다수의 응답이 JSON으로 오기 때문에 파싱을 별도의 메서드로 처리하지 않고 응답 결과 json 메서드 호출로 수행
```javascript
<script>
    fetch('../example/fbv/newclasses/')
    .then(response)
    .then((data => {
        for(idx in data) {
            alert(data[idx])
        }
    }))
</script>
```
```javascript
<script>
    const data = {
        bid:6,
        title: '자바',
        author: '고슬링',
        category: '프로그래밍',
        pages: 245,
        price: 38000,
        published_date: '2024-08-08',
        description: 'OOP'
    }
    fetch('../example/fbv/newclasses/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
    .then(response)
    .then((data => {
        for(idx in data) {
            alert(data[idx])
        }
    }))
</script>
```
- axios 라이브러리 이용
  - 코드를 단순화시켜서 비동기 통신을 수행