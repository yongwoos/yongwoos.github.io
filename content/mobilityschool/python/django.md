---
title: Django에서의 데이터베이스 연동
linkTitle: Django
weight: 12
---

### Model
- 데이터 서비스를 제공하는 레이어
- 애플리케이션안에 자동으로 생성되는 models.py 파일에 정의
- 클래스 단위로 정의를 하는데 하나의 클래스는 하나의 테이블과 매팽됨
- 모델 클래스를 만들때는 Model 이라는 클래스로부터 상속을 받아야 함
- Primary Key를 설정하지 않으면 테이블을 생성할 때 자동으로 id가 생성됨
- 속성을 생성하면 테이블의 컬럼이 만들어지는데 models에 있는 여러 종류의 클래스를 이용하고 각 클래스마다 생성을 할 때 여러 옵션을 설정하는 것이 가능
- 대다수의 ORM은 테이블이 존재하지 않으면 테이블을 자동으로 생성해주고 제약 조건은 속성의 자료형에 해당하는 클래스에서 생성자나 메서드를 통해서 지정이 가능

### mariadb나 mysql 사용을 위한 설정
- mysqlclient라는 패키지가 필요
- settings.py 파일의 DATABASE 설정 부분을 수정
```python
DATABASES = {
  'default':{
    'ENGINE':'django.db.backends.mysql',
    'NAME':'데이터베이스이름',
    'USER':'계정',
    'PASSWORD':'비밀번호',
    'HOST':'데이터베이스URL',
    'PORT':'포트번호인데 기본 포트를 사용하는 경우 빈 칸으로 설정 가능'
  }
}
```
- 데이터베이스 정보를 수정한 경우는 2개의 명령어를 재실행
- `python manage.py makemigrations`
- `python manage.py migrate`
- models.py 파일에 테이블과 매핑될 클래스를 생성
```python
class Item(models.Model):
  itemid = models.IntegerField(primary_key=True)
  itemname = models.CharField(max_length=20)
  price = models.IntegerField()
  description = models.CharField(max_length=50)
  pictureurl = models.CharField(max_length=20)
```

### CRUD 작업
- 데이터 삽입: 인스턴스를 만들고 save 메서드 호출
- 데이터 조회
  - Model클래스에는 objects라는 Manager 클래스의 인스턴스가 존재
  - objects라는 인스턴스를 통해서 필터링 및 정렬 등의 작업을 수행
  - item테이블의 모든 데이터를 조회: `Item.objects.all()`을 호출하면 반복 가능한 컬렉션으로 데이터를 리턴
  - get, filter, exclude, count, order_by, distinct, first, last와 같은 여러 메서드가 존재
- 데이터 수정
  - 데이터를 조회한 후 필요한 속성의 값을 수정하고 save를 호출하면 됨
- 데이터 삭제
  - 데이터를 조회한 후 delete를 호출하면 됨
- Item 테이블의 전체 데이터를 조회
- views.py 파일의 index 함수를 수정
```python
from myweb.models import Item

# Create your views here.
def index(request):
    # Item테이블의 모든 데이터를 가져오기
    data = Item.objects.all()
    
    return render(request, 'index.html',  {'data': data})
```
- 템플릿 엔진을 사용해서 정적 파일(HTML, CSS, JavaScript, HTML을 출력하기 위해서  필요한 파일들)을 사용할 때는 별도의 설정을 추가: settings.py 파일에 정적 파일의 디렉터리 설정 코드를 추가
```python
# 정적 파일을 저장할 디렉터리 설정
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)
```
- myweb 디렉터리 안에 static 디렉터리를 생성하고 그 안에 css 디렉터리를 생성하고 style.css 파일을 생성하고 작성
```css
div.body {
    margin-top: 50psx;
    margin-bottom: 50px;
}

tr.header {
    background: #C9BFED;

}

tr.record {
    background: #EDEDED
}
```
- index.html 파일 수정

```html {filename="index.html"}
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>목록</title>
    /{%load static%}/
    <link rel="stylesheet" href="{%static 'css/style.css'%}">
</head>
<body>
    <h3>{{ message }}</h3>
</body>
</html>
```

- itemid를 url에서 넘겨받아 하나의 데이터가져오기
  - urls.py 파일에 요청을 추가 
  - `path('detail/<int:itemid>', views.detail),`
- views.py 파일에 detail 함수 추가

```python
def detail(request, itemid):
    # itemid의 값이 itemid인 데이터 1개 가져오기
    item = Item.objects.get(itemid=itemid)
    return HttpResponse(item)
```

- API 테스트 도구를 가지고 detail/존재하는id
- 데이터 삽입 구현
  - urls.py 파일에 삽입을 위한 요청을 생성
  - `path('item', views.insert),`

```python
from django.db.models import Max
from django.shortcuts import redirect

def insert(request):
    item = Item()
    # 가장 큰 itemid를 찾아서 +1을 해서 새로운 itemid 생성
    obj = Item.objects.aggregate(itemid=Max("itemid"))
    if obj['itemid'] == None:
        obj['itemid'] = 0
    item.itemid = int(obj['itemid']) + 1
    item.description = "description"
    item.price = 3000
    item.pictureurl = "image"
    item.itemname = "무화과"
    item.save()

    # 시작 페이지로 리다이렉트
    return redirect("/")
```

- SPA(Single Page Application - 하나의 페이지에서 모든 작업을 수행하는 애플리케이션: angular, vue, react가 SPA를 구현하는  프레임워크)가 아닌 경우 페이지 이동 방법
  - forwarding: 조회에 주로 이용
    - 이전 흐름을 유지하면서 이동
    - request객체가 다시 생성되지 않고 이전 객체를 계속 유지
    - 새로고침을 하게 되면 요청 처리 메서드가 다시 호출됨
  - redirect: 조회 이외의 작업에 주로 이용
    - 이전 흐름을 유지하지 않고 이동
    - request 객체는 다시 생성되고 session 객체는 유지
    - 새로고침을 하게 되면 요청 처리 메서드는 호출되지 않고 결과만 다시 보여짐