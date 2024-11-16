---
title: Web Programming
weight: 11
---
- 웹 애플리케이션은 수행되는 위치에 따라 Front End(Client)와 Back End(Server)로 분류
- Front End
  - Back End와 사용자 사이에서 보여지는 부분
  - Web에서는 HTML, CSS, JavaScript 언어를 이용해서 구현을 하는데 최근에는 프레임워크 형태로 제공되는 jQuery(사용을 금기시), Angular(업데이트 더 이상 진행되지 않음), react, vue, bootstrap(react나 vue안에서 사용되는 경우가 많음) 등을 많이 이용
  - Java, Kotlin, Objective-C, Swift, JavaScript, Python 등도 Front End 프로그래밍이 가능한 언어
- Back End
  - 애플리케이션을 동적이고 대화형으로 만들기 위한 숨은 부분
  - 클라이언트의 요청을 받아서 처리하기 위한 부분
  - 서버를 제작하기 위한 프로그래밍 언어(Java, Python, PHP, C#, JavaScript, Go 등) 과 데이터 저장 기술(RDBMS, NoSQL, File 등)과 SW공학 등의 기술을 가지고 제작
  - 최근에는 프레임워크를 사용하는 경우가 많음: Spring, Django, Express.js, FastAPI 등
- 일반적인 Web Application의 동작
  - 클라이언트에서 최초 요청(request)을 서버에 전달하고 서버는 요청을 받아서 처리한 후 그 응답(response)을 HTML 형태로 클라이언트에게 전송하고 이후 추가적인 자원이 필요하면 다시 요청을 한 후 서버가 응답을 하는 구조
  - 최근에는 서버가 클라이언트에게 HTML을 전송하지 않고 문자열 형식으로 만들어진 데이터를 전달하고 클라이언트에서 해석을 해서 출력하는 방식을 많이 사용
  - 서버가 HTML을 전송하게 되면 클라이언트가 다양한 형태로 존재하는 경우 서버를 여러 개 준비를 해야 할 가능성이 생김
- web 3.0
  - 시맨틱 웹의 개념: 컴퓨터가 정보 자원의 뜻을 이해하고 논리적 추론까지 가능한 것
  - 속도와 플랫폼 변화
  - 인공지능
  - 애플리케이션의 진화: open API, SOA(Service Oriented Architecture) 등의 새로운 플랫폼 등장과 Mesh Up
- WOA(Web Oriented Architecture)
  - 웹 기반 서비스 구조
  - Restful: 동일한 요청에 대해서 동일한 URL을 사용할 수 있도록 하는 것
- 프레임워크를 이용한 개발을 권장
  - 지금의 프로그램은 너무 복잡
  - 복잡한 프로그램을 만들기 위해서 알아야 할 기술이 너무 많음

### URL(Uniform Resource Locator)
- 클라이언트가 서버에 존재하는 자원을 요청하는데 필요한 네트워크 서비스의 표현
- 기본 형식 `[프로토콜]://[호스트][:포트]/[경로]/[QueryString - Parameter]#Fragment`
- 프로토콜: 이 부분이 생략되고 //로 시작하면 상황에 따라 http나 https로 프로토콜을 추가
- 호스트: 컴퓨터를 구분하기 위한 이름으로 IP나 도메인
- 포트: 컴퓨터 내에서 애플리케이션을 구분하기 위한 번호인데 프로토콜의 기본 포트인 경우는 생략이 가능
- 경로: 서버에게 요청을 하는 구분하기 위한 문자열로 설정에 따라 생략이 가능
- Query String: 클라이언트가 서버에게 전송하는 데이터
- Fragment: 문서 내에서 이동할 이름

### URL을 바라모는 측면
- 웹 클라이언트에서 웹 서버에 존재하는 Application에 대한 API(Application Programming Interface)
- URL을 RPC(Remote Procedure Call)로 바라보는 시각이 있고 다른 하나는 REST(Representational State Transfer)로 바라보는 시각
- RPC - 원격 프로시져 호출
  - 클라이언트가 네트워크 상에 있는 서버가 제공하는 API 함수를 호출하는 것
  - URL의 경로를 API함수 이름으로 하고 쿼리 스트링을 함수의 매개변수로 간주해서 웹 클라이언트에서 URL 전송하는 것은 웹 서버의 API함수를 호출하는 것으로 인식하는 것
  - 이 경우는 함수의 이름이 대부분 동사
  - search라는 API함수에 test라는 데이터를 전송: `http://blog.ex.com/search?q=test&debug=true`
- REST
  - 웹 서버에 존재하는 요소들을 모두 리소스로 정의하고 URL을 통해 웹 서버의 특정 리소스를 표현한다고 하는 개념
  - 리소스는 시간이 지남에 따라 상태가 변할 수 있기 때문에 클라이언트와 서버 간의 데이터 교환을 리소스 상태의 교환으로 간주
  - 리소스에 대한 조작을 HTTP메서드로 구분: GET, POST, DELETE, PATCH
  - 웹 클라이언트에서 URL을 전송하는 것이 웹 서버에 있는 리소스 상태에 대한 데이터를 주고 받는 것으로 간주
  - `http://blog.ex.com/search/test`
- 단축 URL
  - URL을 간단하게 줄여서 사용하는 방식
  - `http://ex.com/index.php?page=foo -> http://ex.com/foo`
  - `http://ex.com/products?category=2&pid=25 -> http://ex.com/products/2/25`

### HTTP 메서드
- get
  - 데이터를 요청할 때 사용하는 것으로 default
  - 클라이언트에서 서버에게 데이터를 전달할 때 URL 뒤에 데이터를 같이 전송
- 단점: 보안이 취약, 데이터 길이에 제한
- 장점: 자동 재전송
- 폼이 있다면 폼에 file, textarea, password가 있는 경우 get 방식으로 전송하면 안됨
- post
  - 데이터를 삽입할 때 사용하는 것으로 클라이언트에서 서버에게 데이터를 전송할 때 요청의 body에 숨겨서 전송하는 방식
  - 장점: 보안이 우수, 데이터 길이에 제한이 없음
  - 단점: 자동 재전송 기능이 없음
- head: 리소스 헤더 취득
- options: 리소스가 지원하는 메서드 취득
- trace: loopback 시험에 이용
- connect: 프록시 동작의 터널 접속으로 변경
- 예전에는 get과 post만 사용했는데 최근에는 put과 delete를 같이 사용

### 상태 코드
- 웹 서버와 통신에서는 클라이언트에게 상태 코드를 전송함
- 1xx: 정보 제공중
- 2xx: 정상 응답
- 3xx: 리다이렉션 중 - 완전한 동작을 위해서 추가적인 동작을 수행
- 4xx: 클라이언트 오류
- 5xx: 서버 오류

### 파이썬 웹 프로그래밍
- Flask: 자유도가 가장 높음, 제공되는 기능이 적음(ORM은 제공되지 않기 때문에 별도의 ORM라이브러리를 이용)
- Django: 제공되는 기능이 많음, 자유도가 flask에 비해서 낮음, 가장 많이 사용, 템플릿을 이용해서 HTML을 출력하는 것이 가능
- FastAPI: API 서버 용으로 사용, 템플릿을 사용하지 않기 때문에 HTML 출력을 하지 않음

### Django
- python으로 개발됨
- 다른 프레임워크에 비해서 자유도가 낮음
- 패키지 이름: django

### 개발 방식 - MTV
- M(Model)V(View)C(Controller)
  - Model: 데이털르 정의하는 부분
  - View: 출력을 위한 부분
  - Controller: 제어 흐름 및 처리 로직을 호출
- M(Model)T(Template)V
  - Model: 데이터를 정의하는 부분, models.py 파일에 작성
  - Template: 출력을 위한 부분, templates 디렉터리에 html 파일로 생성
  - View: 제어 흐름 및 처리 로직을 호출, views.py 파일에 작성
- 뼈대를 Django가 대부분 만들어주기 때문에 개발자들은 어떤 파일을 만들지 고민할 필요가 없음

### ORM(Object Relation Mapping)
- 하나의 테이블을 하나의 클래스에 연결해서 사용하는 방식
- 클래스의 메서드를 호출하면 데이터베이스 작업을 수행해줌
- SQL없이 CRUD 작업이 가능
- ORM을 사용하게 되면 데이터베이스를 변경하더라도 코드의 수정이 필요 없음
- Django에는 ORM이 내장되어 있음

### 프로젝트 생성 및 실행
- django 패키지 설치: `pip install django`
- 프로젝트 생성: `django-admin startproject 프로젝트이름 경로`
  - 프로젝트 이름으로 디렉터리가 생성됨
  - `django-admin startproject mysite .`
- 애플리케이션 생성: `python manage.py startapp 애플리케이션이름`
  - 애플리케이션 이름으로 디렉터리가 생성되고 몇 개의 기본적인 파일이 생성됨
  - `python manage.py startapp myweb`
- 실행: `python manage.py runserver IP주소:포트번호`
  - 포트번호는 생략하면 8000
  - 로컬에서 확인하고자 할 때는 IP주소는 127.0.0.1
  - 외부에서 접속하게 만들 때는 IP주소를 0.0.0.0 으로 해야 함

### settings.py
- 프로젝트 설정
- secret key나 디버그 모드와 프로덕션 환경에서 수행되는 내용을 다르게 만들고자 할 때 등을 설정 가능
- `ALLOWED_HOSTS`
  - 실제 배포가 될 컴퓨터의 IP를 설정
  - 기본은 127.0.0.1
  - 클라우드 환경에 배포한다면 고정IP를 기재해줘야 함
  - 모든 컴퓨터에서 하고자 하는 경우는 '*'
- `INSTALLED_APPS` 사용할 패키지나 애플리케이션 등록
- `MIDDLEWARE` 요청이 오기 전이나 온 후에 수행할 내용을 작성

### 관리자 계정
- django는 데이터베이스 관리 기능을 편리하게 하기 위해서 관리자 사이트를 별도로 제공
- 기본 URL 뒤에 /admin을 추가하면 접속이 가능
- 처음에는 존재하지 않고 데이터베이스에 처음 연결하는 명령을 수행하면 관리자 계정을 만들 것인지 물어봄

### 기본 테이블 생성
- 장고 프로젝트를 처음 실행하기 전이나 데이터베이스에 변경 사항이 있는 경우 데이터베이스 설정을 다시 해달라고 요청을 할 수 있음
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py createsuperuser`

### VIEWS(Controller: 사용자의 요청을 받아서 필요한 로직을 호출하고 결과를 사용자에게 전달 + Service: 사용자의 요청을 처리) 설정
- 함수로 로직을 처리할 수 있고 클래스를 이용해서 로직을 처리할 수 있음
  - 클래스를 권장
- urls.py: URL과 view의 함수 또는 클래스를 매핑해주는 역할을 수행하는 코드를 작성하는 파일 - 다른 프레임워크의 Controller와 유사한 역할
- URL과 요청 함수를 연결
  - 프로젝트의 url.py 파일을 작성
```python
from myweb import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index) # 기본 요청이 온 경우 myweb 디렉터리에 있는 views파일의 index 함수 호출
]
```
  - myweb 애플리케이션의 views.py 파일에 함수를 작성

```python
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("Hello World")
```
  - 브라우저에서 127.0.0.1로 접속

### Template
- 간단한 내용을 HTML로 출력한다면 HttpResponse 객체에 내용을 직접 작성해서 전달해도 됨
- 복잡한 내용(서버가 처리하고 넘겨주는 데이터)을 출력하고자 하는 경우 직접 문자열 형태로 전달하는 것은 어려운 일이어서 대부분의 웹 서버 프레임워크는 서버가 처리한 데이터와 프로그래밍 언어를 이용해서 출력할 수 있는 템플릿 기능을 제공함
  - 규칙에 맞게 작성하면 HTML로 변환해서 클라이언트에게 전송을 해줌
- 애플리케이션에 templates 라는 디렉터리를 만들고 그 안에 생성
- views.py 파일에서 함수가 리턴할 때 render 함수를 리턴하면 되는데 이 때 매개변수는 3개로 첫번째 매개변수는 클라이언트에게 전송받은 request이고 두번째 출력하는 파일의 경로 그리고 세번째로 템플릿에 전달할 데이터로 dict 형태로 제공
- 데이터를 전달해서 출력, myweb 애플리케이션의 views.py
```python
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    # return HttpResponse("Hello World")
    return render(request, 'index.html',  {'message': '메시지'})
```
- myweb 애플리케이션 디렉터리에 templates 디렉터리를 생성
- templates 디렉터리에 index.html 파일을 만들고 작성
- 파일이 추가된 경우 제대로 인식을 못하는 경우가 발생하면 프로젝트를 다시 실행
- client -> request -> middleware -> urls.py (Controller) -> views.py (Service) (1개 요청 1개의 함수) -> models.py (reposistory+entity)

### 클라이언트가 전송한 데이터 처리
- URL에 포함된 데이터 처리
- 예전에는 URL에 직접 데이터를 포함시키기 보다는 query string의 형태로 했는데 최근에는 URL에 데이터를 포함시키는 경우가 많음
- urls.py 파일에서 views와 연결할 때 `요청경로/<자료형:데이터이름>` 형태로 함수를 작성한 후 views.py 파일의 요청 처리 함수에 데이터 이름을 매개변수로 설정하면 됨
- urls.py 파일에 요청 처리 연결 구문 추가
```python
from django.contrib import admin
from django.urls import path
from myweb import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index), # 기본 요청이 온 경우 myweb 디렉터리에 있는 views파일의 index 함수 호출
    path('get/<str:itemid>', views.getItem) # get/문자열 형태를 views.getItem 함수가 처리
]
```
- views.py 파일에 요청 처리함수 추가
- 브라우저에 get/문자열
- GET방식에서 query string 처리
- GET 방식은 URL에 파라미터를 포함시켜 전송하는 방식
- 데이터를 가져올 때 사용하며 보안성이 떨어지기 때문에 password가 있는 경우 사용할 수 없으며 데이터 길이에도 제한이 있기 때문에 파일 전송이나 textarea를 사용하는 폼의 경우 사용할 수 없음
- ? 뒤에 `이름=값&이름=값` 의 형태로 전송
- views.py 파일의 함수에서 이를 읽는 것은 request.GET["데이터이름"]
- 브라우저에 querystring?=name=데이터로 요청, urls.py, views.py 수정
```python
def queryStirng(request):
    return HttpResponse("<h2>" + request.GET["name"] +"</h2>")
```

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index), # 기본 요청이 온 경우 myweb 디렉터리에 있는 views파일의 index 함수 호출
    path('get/<str:itemid>', views.getItem), # get/문자열 형태를 views.getItem 함수가 처리
    path('querystring', views.queryString)
]
```
- 데이터가 Optional 인 경우 처리
  - querystring이 Optional인 경우에는 request.GET.get("이름", 기본값)으로 처리해도 되고 기본값을 제외하고 준 상태에서 not 함수를 이용해서 판별
  - 파이썬은 dict를 사용할 때 ["key"]로 데이터를 읽어 올 수 있는데 key가 존재하지 않으면 예외가 발생
- POST 방식에서의 처리
  - 데이터를 body에 숨겨서 전송하는 방식
  - 데이터를 삽입할 때 이용
  - 로그인은 원래 데이터 조회 작업이지만 비밀번호가 포함된 경우가 많아서 POST 방식으로 처리
- POST 데이터를 읽는 법
  - `json.loads(request.body)`로 읽는 경우가 있고 form 데이터의 경우는 `request.POST.get("이름" ,기본값)` 의 형태로 읽음
  - form을 이용하지 않고 데이터를 전송하는 경우는 Request의 Body에 삽입이 되므로 json 모듈을 이용해야함
- POST 방식은 브라우저에서 직접 테스트가 어려움
  - 웹 요청 테스트에 많이 사용하는 프로그램은 postman
- urls.py 파일에 요청을 2개 생성
  ```python
    path('requestbody', views.requestBody),
    path('formdata', views.formData),

  ```
- views.py에 url 처리 함수 추가
```python
  # body에 포함된 데이터를 읽기 위한 모듈
import json
def requestBody(request):
    # dict 형태로 리턴
    user = json.loads(request.body)
    return HttpResponse("이름:" + user["name"] + "별명:" + user["nick"])

def formData(request):
    name = request.POST.get("name")
    nick = request.POST.get("nick")
    return HttpResponse("이름:" + name + "별명:" + nick)
```
- CSRF(Cross Site Request Forgery)
  - 인증된 사용자가 웹 애플리케이션에 특정 요청을 보내도록 유도하는 공격 행위
  - 사용자가 인증한 세션에서 웹 애플리케이션이 정상적인 요청과 비정상적인 요청을 구분하지 못하는 점을 악용하는 공격
  - 테스트를 위해서 CSRF 설정을 해제: settings.py 파일에서 middleware 부분 수정
- 파일 업로드
- FileSystemStorage 라는 클래스를 이용
- 실제 운영환경에서는 파일은 로컬에 저장하지 않고 클라우드나 별도의 파일 서버를 만들어서 저장함
- settings.py 파일에 파일 업로드를 위한 코드 추가
```python
MEDIA = '/media/'
MDEIA_ROOT = os.path.join(BASE_DIR, 'media')
```
- urls.py 파일에 요청을 추가
`    path('fileupload'. views.fileUpload),`
- views.py에 업로드 위한 함수 추가
```python
from django.core.files.storage import FileSystemStorage
import uuid

def fileUpload(request):
    myfile = request.FILES["myfile"] # myfile이라는 이름으로 전송된 파일을 읽기
    # 파일 저장소 설정
    fs = FileSystemStorage(location="media/newfolder",
                           base_url="media/newfolder")
    # 원본 파일 이름
    originalname = myfile.name
    # 파일 이름이 겹칠 수 있으므로 원본이름에 uuid를 추가해서 저장
    filename = fs.save(originalname + str(uuid.uuid1()), myfile)
    uploaded_fileurl = fs.url(filename)
    return HttpResponse("변경된 파일 이름:" + filename + "파일의 URL:" + uploaded_fileurl)
```
- POSTMAN을 이용해서 테스트 결과를 확인해보고 프로젝트와 동일한 위치에 media/newfolder 라는 디렉터리에 파일이 업로드 되는지 확인

### Cookie와 Session
- HTTP나 HTTPS는 상태가 없음
  - 클라이언트에서 request를 이용해서 요청을 전송하고 서버가 response로 응답을 하면 연결이 해제됨
  - 다음 요청을 보낼 때 이전 상태에 대한 정보가 없음
- 웹 서버가 클라이언트가 요청을 할 때 하나의 키를 발급해서 클라이언트에 저장하게 하고 동시에 서버에도 저장해서 클라이언트가 요청을 할 때마다 키를 같이 전송하도록 하고 서버는 그 키 값을 확인해서 누구로부터 온 요청인지 알 수 있도록 할 수 있음
- 이렇게 클라이언트에 데이터 저장 기술이 Cookie, 서버에 클라이언트의 정보를 저장할 수 있도록 한 기술이 Session
- Cookie는 클라이언트의 브라우저나 파일 시스템에 저장되는데 보안이 취약하기 때문에 중요한 정보 저장에 사용하면 안됨
- Session은 서버의 메모리를 차지하게 되는데 클라이언트가 많다면 Session의 개수가 증가해서 서버 애플리케이션의 처리 속도가 느려지게 되서 최근에는 Session을 서버의 메모리에 저장하지 않고 데이터베이스에 저장하기도 함. 이 때 예전에는 관계형 DB를 많이 이용했는데 최근에는 In-memory DB를 많이 이용함
- Cookie는 예전 웹 프로그래밍에서 보안 때문에 사용하지 않는 것을 권장했지만 최근에는 UI 개선에 대부분 쿠키를 이용함
- Cookie 생성: `HttpResponse` 인스턴스를 만들고 `set_cookie(키, 값)`를 이용하고 읽을 때는 `request.COOKIES`라는 인스턴스에 딕셔너리 형태로 전송됨
- Session은 request 객체의 session이라는 이름으로 dict 타입으로 생성
- urls.py 파일에 요청 생성
```python
    path('cookiecreate', views.cookieCreate),
    path('cookieread', views.cookieRead),
```
- views.py 파일에 요청 처리 함수 생성
```python
def cookieCreate(request):
    response = HttpResponse()
    # 쿠기 생성
    response.set_cookie("name", "python")
    # 세션에 데이터 저장
    request.session["nick"] = "adam"

    return response

def cookieRead(request):
    # 쿠키 읽기
    name = request.COOKIES.get("name", "기본값")
    nick = request.session.get("nick", "기본값")
    return HttpResponse(name + ":" + nick)
```