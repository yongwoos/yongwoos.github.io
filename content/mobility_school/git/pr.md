---
title: PR
weight: 3
---
## pull request

- Merge를 하기 전에 사전 검토를 하는 과정: 코드 리뷰

- 이 명령은 git 의 표준 명령이 아니고 호스팅 서비스에서 제공하는 기능이므로 git 의 호스팅 서비스마다 서로 다른 명령어나 방식을 취할 수 있음

- git hub에서는 pull request라고 하는데 다른 곳에서는 merge request 라고도 합니다.

- 작업 과정
  - 관리자가 repository를 생성
  - 기본 코드 작성
  - 다른 개발자들이 pull
  - 개발자들은 자신의 branch를 만들어서 코드를 작성한 후 commit 과 push
  - pull request를 전송하고 다른 개발자 들과 관리자가 코드 리뷰
  - 문제가 없으면 관리자가 배포용 branch에 머지
  - 개발자들은 다시 pull을 한 후 작업을 수행

### Remote Repository 생성
- 원격 레포지토리를 생성할 때 협업자가 직접 push를 할 수 없도록 생성<br>
생성을 할 때 협업자가 직접 push를 할 수 없고 몇 명 개발자가 동의를 해야만 merge를 할 지 설정을 해주고 일반적으로 관리자만 merge를 수행

### 실습
- 관리자 계정으로 repository 생성
  - 협업자를 등록: Settings에서 Colaborators에서 Add People
  - branch 보호 설정: Settings에서 Branches 에서  Add Class Branch Protection Rule을 클릭하고 필요한 옵션을 설정
- 개발자 계정에서 코드를 clone하고 작업을 수행
  - 내용을 수정
  - 브랜치를 생성하고 커밋을 수행한 후 푸시
  - git hub에 접속해서 pull request를 생성
- 관리자 계정에서 pull request를 승인

### 협업 대상이 명확하지 않은 경우
- 오픈 소스 프로젝트의 저장소나 개인이 저장소의 코드를 공개해서 불특정 다수로부터 개선의 도움을 받고자 하는 경우에는 협업자를 지정할 수 없는데 이 경우에는 원본 저장소를 Fork를 해서 풀리퀘스트를 생성

### 실습
- 원본 프로젝트에서 협업자를 제거
- 이런 경우는 clone을 하지 않고 fork를 수행<br>
  fork는 clone 과 유사한데 다른 계정의 git hub 저장소를 나의 git hub 저장소로 복제하는 기능<br>
  fork가 완료되면 새로운 계정에 저장소가 복제<br>
- 파일을 추가하고 내용을 작성
- 새로운 브랜치를 만들어서 push
- 관리자가 아닌 경우는 pull request를 생성해서 변경을 요청
- 관리자가 pull request를 승인

## Gitflow
- 브랜치 운영 방식
- 여러 사람이 협업하는 큰 규모의 프로젝트나 지속해서 배포 계획을 세우고 진행하는 프로젝트에 유용하게 사용


### Gitflow의 브랜치들
- 2개의 주 브랜치와 3개의 보조 브랜치를 이용
- 주 브랜치
  - master<br>
  과거에 배포된 코드 또는 앞으로 배포될 최종 단계의 코드가 관리되는 곳<br>
  태그 와 함께 버전 정보가 기록<br>
  원격 저장소(origin/master)에서 관리
  - develop<br>
  master로부터 분기되어 나온 브랜치<br>
  master와 release 브랜치와 병합<br>
  다음에 배포할 프로그램의 코드를 관리<br>
  배포할 프로그램의 기능이 준비되면 release 브랜치로 병합되어 검사하거나 master로 병합되어 배포 버전으로 태그를 부여받음<br>
  원격 저장소(origin/develop)에서 관리<br>
  master 브랜치에서 `git checkout -b develop`로 생성
- 보조 브랜치
  - feature<br>
  develop 브랜치에서 분기<br>
  develop 브랜치와 병합<br>
  브랜치이름은 feature/이름<br>
  토픽 브랜치라고도 부르는데 다음 배포에 추가될 기능을 개발하는 브랜치<br>
  기능이 완성되면 develop로 병합됨<br>
  기능이 필요하지 않거나 만족스럽지 않은 경우 삭제 가능<br>
  개발자의 로컬 저장소에 위치하고 원격 저장소에는 푸시하지 않음<br>
  develop 브랜치에서 `git checkout -b feature/func1` 형태로 생성<br>
  작업 후 브랜치 병합을 할 때 --no–ff 옵션으로 생성
  - rebase
  develop 브랜치에서 분기<br>
  병합은 develop 와 master 와 수행<br>
  이름 규칙은 release/버전정보<br>
  기능이 완성된 develop 브랜치의 코드를 병합해서 배포를 준비하는 브랜치<br>
  release 브랜치로 인해서 develop 브랜치는 다음 배포에 필요한 기능에 집중<br>
  배포에 필요한 준비, 품질 검사, 버그 수정을 진행<br>
  release 브랜치가 배포할 상태가 되면 master로 병합<br>
  master에 만들어진 커밋에 태그를 추가<br>
  배포 후 release 브랜치가 필요없으면 삭제<br>
  develop 브랜치 상태에서 `git checkout -b release/v0.1` 형태로 생성<br>

  ```
  git merge --no-ff release/v0.1

  git tag -a v0.1
  ```
  - hotfix
  master에서 분기되어 나온 브랜치<br>
  develop나 master와 병합<br>
  브랜치 이름은 hotfix/버전정보<br>
  기존 배포한 버전에 문제를 해결하기 위한 브랜치<br>
  브랜치는 문제가 발생한 master의 버전으로 생성<br>
  문제를 해결한 후에는 master와 develop에 각각 병합을 진행<br>
  release 브랜치가 삭제되지 않았다면 release 브랜치에도 병합 진행<br>
  병합 후 브랜치는 삭제<br>
  master 브랜치에서 `git checkout -b hotfix/v0.1.1`

### git-flow cheatsheet
- Gitflow 브랜치 관리를 편하게 할 수 있는 확장 프로그램
- https://danielkummer.github.io/git-flow-cheatsheet/index.ko_KR.html
- 작업
  - 초기화(미리 git init 을 할 필요가 없음): `git flow init`<br>
    2개의 브랜치(master, develop)가 생성<br>
- feature 나 release 브랜치 시작   
  `git flow [브랜치 종류] start [브랜치 이름]`   
  `git flow feature start func1`    

## .gitignore
- 개발을 진행하다보면 프로그램 버전 관리와 관련이 적은 파일이 포함되는 경우가 있음
- 백업용 파일이나 로그 파일, 소스 코드 빌드 나 컴파일 이후에 생성되는 파일들은 버전 관리와 연관성이 적기 때문에 추적 대상에서 제외해도 무방
- 보안상 민감한 정보를 저장하고 있어서 공개적인 원격 저장소에 공유하기 곤란한 파일들도 제외할 필요가 있음
- 원격 저장소의 추적 대상에서 제외하고자 하는 파일이나 디렉토리를 등록하는 파일이 .gitignore

### 실습
- 하나의 디렉토리를 만들고 git init 수행

- 파일을 생성   
file1.txt, file2.txt, folder/file3.txt
```
$ touch file1.txt
$ touch file2.txt
$ mkdir folder
$ touch folder/file3.txt
```
- .gitignore 파일을 추가하고 작성   
file1.txt

- 확인: file1.txt는 추적하지 않음   
`git status`

- 디렉토리를 설정하면 디렉토리 안의 모든 내용을 추적하지 않음

- .gitignore 파일에 추가   
folder/

- 확인: folder 안의 내용은 추적하지 않음   
`git status`

- 확장자 패턴 가능

- .gitignore 파일 수정   
*.txt

- 확인: 확장자가 txt 인 파일은 추적하지 않음   
`git status`

### 작성 규칙
```
=>#: 주석
=>[파일 이름]: 해당 파일 이름으된 저장소의 모든 파일 무시
=>/[파일이름]: 현재 경로에 있는 파일만 무시
=>*.[확장자]: 확장자를 가진 파일 무시
=>[디렉토리이름]/: 디렉토리의 모든 파일
=>[디렉토리이름]/[파일이름]: 해당 경로의 파일 무시
=>[디렉토리이름]/*.확장자: 해당 경로의 확장자를 가진 파일 무시
=>![파일 이름]: 해당 파일 이름으로 된 것은 예외
```
### 자동 생성
- https://toptal.com/developers/gitignore

## 기본 브랜치 변경
- 확인:  `git config --get init.defaultBranch`
- 변경: `git config --global init.defaultBranch main`

## git hub action
- 새로운 기능을 개발하고자 하면 개발하고 코드를 테스트하고 빌드하고 원격 저장소에 반영하고 배포하는 일련의 과정을 거쳐야 하는데 이러한 일련의 작업 과정을 자동화하는 다양한 도구가 있는데 git hub는 git hub action이라는 도구를 제공해서 해당 과정의 자동화를 돕습니다.
- 깃허브 액션은 소프트웨어 개발에 필요한 작업 주기를 자동화하는 도구
-액션은 이벤트 기반으로 특정 이벤트가 발생했을 때 특정 명령 혹은 명령 집합을 자동으로 실행할 수 있음
- 이벤트는 Pull Request, Push 와 같은 변경을 의미
- 이벤트(push, pull request)가 발생하면 Jobs(단일 환경에서 실행될 명령의 집합)가 호출되고 그안의 Steps(Jobs 안에서 실행될 명령의 정의)가 호출되고 Actions(명령 자체)가 수행됩니다. 
- 동작 설정은 yaml 파일에 만들게 되는데 로컬에서 직접 생성할 때는 프로젝트의 .github/workflows 디렉토리에 만들면 되고 git hub 레포지토리에서 만들 때는 Actions 탭에서 선택해서 작성성

### 작성 예시
```yml
#구분하기 위한 이름
name: 이름

#이벤트
on:
  push:
    branches: [브랜치 이름 나열]
  pull_request:
    branches: [브랜치 이름 나열]


#수행할 내용
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: action/checkout@v2
    - name: 작업 이름
      uses: actions/수행할내용 - 프로그래밍 언어 셋업
      with:
	        환경변수
    - run: 실행할 명령
# 실행할 명령의 순서: 빌드 -> 테스트 -> 이미지 생성 -> 배포
```

### node.js로 만든 애플리케이션을 테스트하는 과정을 github action으로 구현
- github 사이트에서 repository 생성   
  https://github.com/dragonhail/gitaction
- 필요한 패키지 설치
  - `npm install express`
  - `npm install --save-dev nodemon`
  - MEA(R)N: MongoDB Express React Nodejs
- node 플랫폼의 모든 프로젝트는 package.json에 설정을 하는데 이 파일을 수정
```js
"main": "app.js",
  "scripts": {
    "test": "test mocha",
    "start": "nodemon app"
  },
```

- app.js 파일을 추가하고 작성
```js
const express = require('express')

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', (req, res) => {
    res.send('Hello Express');
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})
```

- 실행
```
npm start
```
  - 브라우저에서 localhost:3000 번으로 접속

- git hub에 push
  - node 관련 프로젝트는 node_modules 디렉토리가 외부 라이브러리를 저장하고 있는 디렉토리인데 이 디렉토리를 분산 버전 관리 시스템에 올리게 되면 공간의 낭비이고 대부분 파일이 너무 많아서 업로드가 안됨    
  - 의존성 모듈은 package.json 파일에 모두 기록되어 있고 npm install 이라는 명령을 수행하면 전부 다시 설치
  - .gitignore 파일을 생성하고 작성
  ```
  node_modules/
  ```
  - push
  ```
  git init
  git add .
  git commit -m "nodejs"
  git checkout -b main
  git remote add origin https://github.com/dragonhail/gitaction.git
  git push origin main
  ```
- 테스트 수행
  - 테스트를 위한 라이브러리를 설치: `npm install mocha`
  - 스트를 위한 파일을 생성하고 작성: test.spec.js
```js {filename="test.spec.js"}
describe('Default Test Set', () => {
    it('test1 should be passed', () =>{
        console.log('test1 passed');
    })

    it('test2 should be passed', () =>{
        console.log('test2 passed')
    })
})
```
  - 테스트 수행
  ```
  ./node_modules/.bin/mocha test.spec.js
  ```
  - test 명령을 package.json에 등록: npm test 라는 명령어로 테스트를 수행
```
"scripts": {
    "start": "nodemon app",
    "test": "./node_modules/.bin/mocha test.spce.js"
  },
```
- Git Hub Action 작성: main 브랜치가 push 될 때 테스트를 수행
  - 프로젝트에 .github/workflows 디렉토리를 생성
  - .github/workflows 디렉토리에 yaml 파일을 생성하고 작성: ci.yaml
```yml {filename="ci.yaml"}
name: Node Git Action

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version}}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version}}
    - run: npm install
    - run: npm test
```
- 작성한 코드를 push 하고 git hub 페이지에서 action을 확인

## Git Hub을 정적 웹사이트 배포에 이용하기
- Git Hub Repository는 그 자체로 하나의 웹 서버 기능을 수행할 수 있는데 Git Hub repository를 만들고 README.md 파일을 작성하면 .git을 제외한 부분으로 URL을 입력하면 README.md 파일이 출력됩니다.
- 하나의 계정에 하나의 정적 웹 사이트를 배포할 수 있도록 URL도 제공

### 정적 웹 사이트 만들기
- 웹 사이트 생성: `npx create-react-app board`
- 실행이 되는지 확인

- 배포 준비
  - react 나 vue 또는 angular 프로젝트는 바로 배포가 안됨 
  - 자바스크립트로 만든 코드를 HTML로 변환해서 출력해주는 프레임워크 이기 때문
  - 이러한 프레임워크로 만든 웹 사이트는 정적으로 변환을 해서 배포를 해야 합니다.

  - 소스 코드를 실행이 가능한 코드로 만들어주는 작업은 build 라고 합니다.
  - node 기반의 Front End 프레임워크는 배포를 할려면 build를 해야 합니다.
  - npm run build 명령을 수행하면 build 라는 디렉토리가 생성되면 정적 웹 파일들이 만들어 집니다.   
  build 디렉토리의 내용을 배포하면 정적 웹 사이트 배포가 됩니다.

- git hub에 정적 웹 사이트 만들기
  - repository를 생성: repository 이름은 반드시 계정.github.io 이어야 합니다.
- 웹 사이트 URL은 아이디.github.io

## Docker Private Registry 생성
### 1 hub.docker.com 이 아닌 registry 생성
- aws ec2에 접속해서 public IP 와 docker 설치 여부 확인   

### 2 registry 라는 이미지를 이용해서 docker image registry를 생성
- 이미지 다운로드: `sudo docker pull registry`

- 컨테이너 실행
```
docker run -d -v /home/ubuntu/registry_data:/var/lib/registry -p 5000:5000 --restart=always --name=registry registry
```
### 3 생성한 이미지 저장소를 사용하기 위한 설정
- /etc/docker/daemon.json 파일에 저장소를 추가
```json {filename="daemon.json"}
{
        "insecure-registries": ["13.209.82.178:5000"]
}

- /etc/init.d/docker 파일에 추가
```
DOCKER_OPTS=--insecure-registry 13.209.82.178:5000
```
- 도커 재시작
```bash
sudo service docker restart
```
- 새로 등록한 레지스트리의 이미지 확인
```
curl -XGET 13.209.82.178:5000/v2/_catalog
```
- nginx 이미지를 받아와서 tag를 변경하고 업로드
```
docker pull nginx

docker image tag nginx 13.209.82.178:5000/nginx

docker push 13.209.82.178:5000/nginx
```
- 카탈로그 다시 확인
```
curl -XGET 13.209.82.178:5000/v2/_catalog
```