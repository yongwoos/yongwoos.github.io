---
title: 웹 클라이언트 애플리케이션
linkTitle: 웹 클라이언트
weight: 13
---
- 웹 브라우져에 내용을 출력하기 위한 애플리케이션
- 웹 브라우저는 HTML, CSS, Javasccript만을 이용해서 내용을 출력
- HTML은 문서 구조를 위한 언어
- CSS는 문서에 디자인을 위한 언어
- Javascript는 HTML문서에 동적인 기능을 제공하기 위한 언어, 최근에는 TypeScript(javascript의 super set)도 거의 모든 브라우저에서 지원

## CORS
### SOP(Same Origin Policy) - 동일 출처 정책
- 어떤 출처(origin)에서 불러온 문서나 스크립트가 다른 출처에서 가져온 리소스와 상호 작용하는 것을 제한하는 브라우저의 보안 방식
- 출처를 구분하는 기준은 URI의 프로토콜 그리고 호스트 및 포트가 동일한지 여부
- SOP가 적용되지 않는 경우
  - img 태그로 이미지 파일을 가져오는 경우
  - link 태그로 css 파일을 가져오는 경우
  - script 태그로 javascript 파일을 가져오는 경우
  - video, audio, object, embed, applet 태그를 이용해서 리소스를 가져오는 경우
- SOP가 적용되는 경우: javascript를 이용해서 데이터를 가져오는 경우
  - XMLHttpRequest를 사용하는 경우
  - Fetch API를 사용하는 경우

### javascript를 이용해서 외부 출처의 데이터를 가져오는 방법
- 제공하는 측에서 CORS 설정을 해주는 경우
- 제공받는 측에서 Proxy Server를 이용해서 데이터를 가져오는 경우: react의 경우 설정 파일에 proxy 설정을 하면 외부에서 데이터를 가져오는 것이 가능

### CORS (Cross-Origin Resource Sharing - 교차 출처 정책)
- HTTP 헤더를 사용해서 한 출처에서 실행중인 웹 애플리케이션이 다른 출처의 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제
- 서버에 이 설정을 해주면 XMLHttpRequest 나 Fetch API를 이용해서 서버의 데이터를 가져다가 사용할 수 있음
- 프레임워크나 웹 서버 언어마다 설정하는 방법은 다름
  - 요즈음처럼 웹 서버 애플리케이션과 클라이언트 애플리케이션을 다르게 만드는 경우에는 필수적으로 알아야하는 설정
  - 안드로이드나 IOS같은 모바일 애플리케이션은 여기에 해당하지 않음

### django에서의 CORS 설정
- django-cors-headers 패키지를 설치
- INSTALLED_APPS에 corsheaders 애플리케이션을 사용하겠다고 설정
- MIDDLEWARE **최상단**에 `corsheaders.middleware.CorsMiddleware`를 추가
- 선별적으로 지원: `CORS_ORIGIN_WHITELIST = [클라이언트의 도메인 나열]` 또는 `CORS_ORIGIN_ALLOW_ALL=True`
- HTTP 메서드 단위로 지원 `CORS_ALLOW_METHODS = ( 허용가능한 메서드 나열 )`

### SPA(Single Page Application)
- 웹 서버는 웹 브라우저가 요청하는 다양한 유형의 자원을 제공하는 역할 수행, 클라이언트가 웹 URL을 이용해서 자원을 요청하면 서버는 거기에 해당하는 HTTP 응답 데이터를 제공하고 브라우저는 이를 해석해서 페이지 화면에 출력하는에 이 과정을 렌더링이라고 함
  - 브라우저가 이해하는 태그는 파싱을 해서 규칙에 맞게 출력하고 이해하지 못하는 문자열은 그대로 출력
- Server Side Rendering(SSR - Multi Page Application)
  - 웹 페이지가 처음 받은 자원을 렌더링 한 뒤 다시 다른 자원을 요청하면 과거에 렌더링한 내용을 모두 지우고 새로 수신한 자원을 렌더링하는데 이 때 웹 페이지는 약간의 깜빡임이 발생
  - 사용자의 요청이 있을 때마다 새로운 HTML을 전달 받아서 출력하는 방식
- Single Page Application
  - 하나의 HTML로 동작하는데 컴포넌트 단위로 화면을 분할하고 필요한 데이터를 요청하고 가져온 데이터를 컴포넌트에 출력하는 방식을 취해서 하나의 페이지로 모든 서비스를 제공하는 애플리케이션
  - 모바일 기기의 사용으로 등장
  - Web SPA를 구현해주는 가장 많이 사용되는 프레임워크가 angular(google - 더 이상 업데이트 안됨), react(facebook, react와 동일한 문법 제공하는 react-native이용하면 모바일 애플리케이션 제작이 가능), vue(학습하기 쉬움)
- 템플릿 엔진
  - Back End 템플릿 엔진: 서버에서 처리한 데이터를 자바스크립트 객체들과 조합을 해서 HTML과 만들어서 제공
  - Front End 템플릿 엔진: 서버에서 처리한 데이터를 클라이언트가 받아서 자바스크립트 객체들과 조합해서 DOM 객체를 만들어서 제공
- Responsive Web(반응형 웹): 화면 크기에 따라 UI를 변경해서 동일한 컨텐츠를 사용할 수 있도록 하는 것
- Progressive Web: 웹 화면의 UI를 모바일 애플리케이션의 UI 형태로 제작
### react
- 2013년 페이스북에서 발표한 오픈 소스 자바스크립트 프레임워크
- 유저 인터페이스를 만드는 라이브러리
- Virtual DOM 이라는 기술을 이용해서 UI를 만드는데 게임 엔진에 사용하는 방식인 다음에 나타날 화면의 일부를 미리 그려놓고 변경된 화면의 일부만 수정하는 기술로 일반적인 DOM 출력보다 빠름
- 유저 인터페이스를 만드는 라이브러리이므로 서버에서 데이터를 받아오는 것은 react가 할 수가 없음
- ajax나 fetch api, web socket, sse 등은 직접 구현학허나 별도의 라이브러리를 이용해야 함

### react 프로젝트 생성 및 실행
- react 프로젝트를 만들기 위해서는 node.js(javascript runtime - 실행을 위한 도구)를 설치
- yarn 설치: npm을 개선한 프로그램 `npm install --location=global yarn`
- react 프로젝트 생성
  - `npx create-react-app 앱이름(노드를 직접 설치한 경우)`
  - `yarn create react-app 앱이름`
- nodejs 프로젝트를 git 같은 소스코드 버전 관리 시스템에 업로드할 때 node_modules는 제외(패키지가 들어있는 디렉터리)
  - 프로젝트를 다른 곳에서 다운로드 받아서 사용할 때 `npm install` 명령만 수행하면 다시 다운로드 받음
  - nodejs 프로젝트는 실제 패키지를 저장하고 있는 node_modules와 package.json 이라는 패키지 목록 파일로 패키지를 관리
  - package.json이라는 파일에 사용하고 있는 모든 패키지 정보가 저장됨
  - 패키지를 다시 다운로드 받는 명령이 `npm install`
  - 파이썬은 테스트 파일로 내보낸 후 `pip install 파일명`으로 다시 다운로드 받음
- react 프로젝트 실행 `yarn start`
- 배포 파일 만들기 `npm run build` 또는 `yarn build`

## ToDo 웹 애플리케이션 제작
- 서버 애플리케이션과 클라이언트 애플리케이션을 분리해서 개발을 하고 통신이 가능하도록 작업
- 서버 애플리케이션은 MariaDB와 Django로 개발하고 클라이언트 애플리케이션은 react로 개발

### Server Application
- 사용할 데이터베이스 준비 - mariadb로 `create database adam`
- 서버용 애플리케이션을 저장할 디렉터리 생성 생성 `mkdir app/server`
- 서버용 애플리케이션 생성
  - 가상 환경 생성(별도의 파이썬 환경 `python -m venv 가상환경이름` - 배포를 할 때는 가상 환경을 만들고 애플리케이션을 제작)
  - 가상환경 활성화 `가상환경이름\Scripts\activate`
  - 이제부터 패키지는 가상환경에 전부 설치
  - 패키지 설치 `pip install django mysqlclient djangorestframework`
  - 프로젝트생성 `django-admin startproject todoproject .`
  - 애플리케이션생성 `python manage.py startapp todoapplication`
  - 설정 파일 설정
    - todoproject/settings.py의 `INSTALLED_APPS`에 REST API를 위한 애플리케이션과 자신이 만든 애플리케이션 이름 등록
    - `DATABASES` 수정
  - 실행
    - `python manage.py makemigrations`
    - `python manage.py migrate`
    - `python manage.py runserver 0.0.0.0:80`
  - DB 연동을 위한 model 작성
### CRUD 작업
- url 설정: porject의 urls.py
```python
from django.contrib import admin
from django.urls import path

from todoapplication import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('todo', views.TodoView.as_views()), # todo 요청은 todoapplication의 views.py 파일의 TodoView 클래스가 처리
]
``` 
- views.py 파일에 url을 처리하는 로직을 작성

### 수정
- PUT: 리소스 전체를 수정
  - 데이터가 존재하지 않는 경우 생성
- PATCH: 리소스 일부분을 수정
  - 아무일도 발생하지 않음
- 멱등성: 동일한 요청을 여러 번 했을 때 결과가 같아야 함
  - PUT은 멱등성을 갖지만 PATCH는 멱등성을 가지지 않음
  - URI를 가지고 접근했을 때는 별 문제가 되지 않고 PUT과 PATCH를 직접 요청한 경우에만 문제가 발생
  - 최근에는 PATCH를 권장하지 않음
- ORM에서는 데이터를 수정하거나 삭제를 할 때 별도로 인스턴스를 만들지 않고 데이터를 찾아온 후 필요한 내용만 수정한 후 save를 호출함
```python
  def delete(self, response):
        # 필요한 파라미터 읽기: userid, id, done
        request = json.loads(request.body)

        userid = request["userid"]
        id = request["id"]

        todo = Todo.objects.get(id=id)
        
        if todo.userid == userid:
            todo.delete()
            return JsonResponse({'result': True,
                                 'data': todoToDictionary(todo)},
                                 status = status.HTTP_200_OK)
        else:
            return JsonResponse({'result': False,
                                 'data': todoToDictionary(todo)},
                                 status = status.HTTP_200_OK)
```
- 파일명은 마음대로 정할 수 있는데 관습적으로 requirements.txt를 사용
### Client Application
- 프로젝트 생성 `yarn create react-app todoclient`
- 아이콘 사용을 위한 패키지를 설치 
  - `npm install --save --legacy-peer-deps@material-ui/core`
  - `npm install --save --legacy-peer-deps@material-ui/icons`
- 상단에 배치될 컴포넌트를 생성 - src/ToDo.jsx(확장자는 일반적으로 js, jsx - react 컴포넌트를 구분하기 위한 확장자, ts, tsx등을 사용)
```javascript
import React from "react"

class ToDo extends React.Component{
    render() {
        return (
            <div className="ToDo">
                <input type="checkbox" id="todo0" name="todo0" value="todo0" />
                <label for="todo0">컴포넌트 만들기</label>
            </div>
        )
    }
}
export default ToDo;
```

### App.js 파일을 수정해서 앞에서 생성한 컴포넌트 출력
```javascript
import './App.css';

import React from 'react';
import ToDo from './ToDo';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {item:{id:0, title:"안녕 react", done:true}}
  }
  render() {
  return (
    <div className="App">
      <ToDo item={this.state.item} />
    </div>
  );
}
}

export default App;
```
- ToDo.jsx 파일을 수정해서 Props(상위 컴포넌트로부터 데이터를 받을 때 사용) 와 State(현재 컴포넌트의 상태를 저장할 때 사용) 사용
- react는 Props나 State가 변경되면 컴포넌트를 자동으로 재출력

```javascript
import React from "react"

class ToDo extends React.Component{
    constructor(props) {
        super(props)
        // 상위 컴포넌트로부터 넘겨받은 item 속성의 값을 item이라는 이름으로 저장
        this.state = {item:props.item}

    }

    render() {
        return (
            <div className="ToDo">
                <input type="checkbox" id={this.state.item.id} name={this.state.item.id} checked={this.state.item.id} />
                <label id={this.state.item.id}>{this.state.item.title}</label>
            </div>
        )
    }
}
export default ToDo;
```
```javascript
import './App.css';

import React from 'react';
import ToDo from './ToDo';

class App extends React.Component {
  constructor(props){
    super(props)
    // 데이터 배열 생성
    this.state = {items:[{id:0, title:"안녕 react", done:true},
      {id:1, title:"커피", done:false}]
    }
  }
  render() {
    let todoItems = this.state.items.map((item, idx) => (
      <ToDo item={item} key={item.id} />
    ));
    return (
    <div className="App">
      {todoItems}
    </div>
    );
  }
}

export default App;
```
- 배열을 출력할 때는 상위 컴포넌트에서 반복문을 돌려서 하위 컴포넌트를 여러 개 만들면 됨
- react를 이용해서 클라이언트 프로그램을 만들 때 가장 먼저 학습하는것
  - state와 props 사용법
  - 여러 개의 데이터를 출력하는 방법
  - ajax, fetch API, axios 중 하나

- 브라우저에서 확인: 배열을 출력할 때는 상위 컴포넌트에서 반복문을 돌려서 하위 컴포넌트 여러개 만들면 됨
- key를 설정하지 않으면 화면에서는 아무런 문제가 되지 않는데 자바스크립트 검사 창에서는 에러가 발생

### 디자인 변경
- 순수 react의 컴포넌트와 HTML 태그 만으로 디자인을 하는 것은 쉬운 일이 아니어서 외부 라이브러리의 도움을 받아서 디자인 하는 것이 일반적
- 직접 css를 이용해서 디자인 작업을 하는 것은 전문적인 지식이 없으면 쉽지 않음
- ToDo.jsx 파일을 수정
```javascript
import React from "react"

import {
    ListItem,
    ListItemText,
    InputBase,
    Checkbox
} from '@material-ui/core'

class ToDo extends React.Component{
    constructor(props) {
        super(props)
        // 상위 컴포넌트로부터 넘겨받은 item 속성의 값을 item이라는 이름으로 저장
        this.state = {item:props.item}

    }

    render() {
        const item = this.state.item
        return (
            <ListItem>
                <CheckBox checked={item.done} />
                <ListItemText>
                    <InputBase 
                        inputProps={{"aria-label":"naked"}}
                        type="text"
                        id={item.id}
                        name={item.id}
                        value={item.title}
                        multiline={true}
                        fullWidth={true}
                    />
                </ListItemText>
            </ListItem>>
        )
    }
}
export default ToDo;
```
- App.js 수정
```javascript
import React from "react";
import {TextField, Paper, Button, Grid} from "@material-ui/core"

class AddToDo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {item:{title:""}}
    }
    render() {
        return (
            <Paper style={{margin:16, padding:16}}>
                <Grid container>
                    <Grid xs={11} md={11} item style={{paddingRight:16}}>
                        <TextField placeholder="타이틀입력" fullWidth />
                    </Grid>
                    <Grid xs={1} md={1} item>
                        <Button fullWidth color="secondary" variant="outlined">
                            +
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

}

export default AddToDo;
```
```javascript
import './App.css';

import React from 'react';
import ToDo from './ToDo';

import {
  Paper,
  List,
  Container
} from "@material-ui/core"

class App extends React.Component {
  constructor(props){
    super(props)
    // 데이터 배열 생성
    this.state = {items:[{id:0, title:"안녕 react", done:true},
      {id:1, title:"커피", done:false}]
    }
  }
  render() {
    let todoItems = this.state.items.length > 0 && (
      <Paper style = {{margin:16}}>
        <List>
          {this.state.items.map((item, idx) => (
            <ToDo item={item} />
          ))}
        </List>
      </Paper>
    );
    return (
    <div className="App">
      <Container maxWidth="md">
        <AddToDo />
        <div>{todoItems}</div>
      </Container>
    </div>
    );
  }
}

export default App;
```
### 데이터 추가 이벤트 핸들러 구현
- react와 같은 SPA에서는 이벤트 처리를 다르게 구현
  - App.js 파일에 이벤트 핸들러가 사용할 함수나 메서드를 만들고 하위 컴포넌트에 넘겨서 연결하도록 함
  - SPA에서는 전체 화면 출력을 위한 컴포넌트가 존재하고 그 안에 하위 컴포넌트들을 배치해서 사용
  - 각 하위 컴포넌트끼리는 완전 독립적으로 구현
  - 데이터를 최상위 컴포넌트가 가지고 있으면 사용이 쉽지만 다른 컴포넌트가 가지고 있으면 넘기는 동작을 구현하는 것이 어려움
  - 데이터를 조작하는 이벤트 핸들러도 최상위 컴포넌트가 가지고 있는게 작업이 편리
-  App.js 파일에 데이터 추가 함수 구현
-  AddToDo.jsx 파일에 넘겨 받은 데이터 추가 함수를 버튼의 이벤트 핸들러(콜백 함수, 리스너 객체)로 설정

```javascript
import './App.css';

import React from 'react';
import ToDo from './ToDo';
import AddToDo from './AddToDo';

import {
  Paper,
  List,
  Container
} from "@material-ui/core"

class App extends React.Component {
  constructor(props){
    super(props)
    // 데이터 배열 생성
    this.state = {items:[{id:0, title:"안녕 react", done:true},
      {id:1, title:"커피", done:false}]
    }
  }
// 데이터 추가를 위한 함수: Item 1개를 넘겨받아서 items에 추가하는 함수
add = (item) => {
  // react의 state와 props는 불변의 객체
  // 수정 작업을 할 때는 다른 곳에 복사를 한 후 수정을 하고 다시 state나 props에 설정
  // 기존의 state에 있는 items를 thisItems에 복사
  const thisItems = this.state.items;

  // 새로운 item에 데이터를 추가 설정
  item.id = "ID-" + thisItems.length;
  item.done = false;

  // thisItems에 데이터를 추가
  thisItems.push(item)

  // state의 값을 thisItems로 변경
  this.setState({items:thisItems});
}

  render() {
    let todoItems = this.state.items.length > 0 && (
      <Paper style = {{margin:16}}>
        <List>
          {this.state.items.map((item, idx) => (
            <ToDo item={item} />
          ))}
        </List>
      </Paper>
    );
    return (
    <div className="App">
      <Container maxWidth="md">
        <AddToDo add={this.add} />
        <div>{todoItems}</div>
      </Container>
    </div>
    );
  }
}

export default App;
```
- 데이터를 추가하면 목록 부분에 바로 반영이 됨
  - react는 명시적으로 화면을 재출력하지 않더라도 state나 props가 변경되면 화면을 재출력함
## 연결
### 클라이언트의 app.js 수정
```jsx
  constructor(props){
    super(props)
    // 데이터 배열 생성
    this.state = {items:[]}
  }

// 컴포넌트가 메모리에 로드가 되면 호출되는 메서드
componentDidMount() {
  const requestoptions = {
    method:"GET",
    headers: {"Content-Type":"application/json"}
  };
  fetch("http://localhost/todo", requestoptions)
  .then((response) => response.json())
  .then((response) => {
    this.setState({items:response.list})
  },
  (error) => {
    console.log(error)
  }
)
}
```
- 브라우저에서 콘솔의 메시지 확인
`Access to fetch at 'http://localhost/todo' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.`
- 웹 서버에서 CORS 설정을 하지 않아서 웹 클라이언트의 ajax나 fetch api로는 데이터를 가져오지 못해서 에러가 발생

### django 프로젝트에서 CORS 설정을 추가해서 클라이언트에서 데이터를 가져갈 수 있도록 수정
- 가상 환경에 패키지를 설치
  - django-cors-headers
- settings.py 파일을 수정
  - INSTALLED_APP 부분에 추가 `'corsheaders'`
  - MIDDLEWARE의 최상단에 추가 `'corsheaders.middleware.CorsMiddleware',`
  - 허용한 URL을 설정
  ```
  CORS_ORIGIN_WHITELIST = ['http://127.0.0.1:3000', 'http://localhost:3000']
  CORS_ALLOW_CREDENTIALS = True
  ```

