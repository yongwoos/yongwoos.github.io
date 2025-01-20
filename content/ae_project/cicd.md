---
title: Gitlab Jenkins Harbor 연동
weight: 5
---
## 1.  깃랩 Access Token 생성

- 깃랩 > 토큰 생성할 레포선택 > 설정 > 액세스 토큰 > 신규토큰 추가 > 토큰 값 복사

## 2.  젠킨스 Credentials에 깃랩 Access Token 등록

- 젠킨스 우측상단 계정이름 클릭 > Credentials클릭 > Credentials의 global클릭 > Add Credentials클릭 > Kind를 Gitlab API Token으로 선택 > API Token에 복사한 토큰 값 입력 > 구분할 ID 입력 후 저장

## 3. 젠킨스 Credentials에 젠킨스 파이프라인에서 사용할 Credential 생성

- Credentials에서 Add Credentials클릭 > Kind를 Username with Password로 설정 > Username에 깃랩 로그인 아이디 입력 > Password에 복사해 둔 깃랩 Access Token 등록

## 4. 깃랩-젠킨스 연결 테스트

- 젠킨스 홈페이지에서 새로운 Item 클릭 > Pipeline 선택 후 이름 지정 > Pipeline 탭에서 Pipeline Script로 선택 후 테스트 용 PIpeline Script 작성

```json
pipeline {
    agent any
    
    stages {
        stage('Clone') {
            steps {
                git branch: '브랜치이름', credentialsId: '생성한 파이프라인 Credential 아이디', url: '깃랩레포주소.git'
            }
        }
    }
}
```

저장 후 지금 Build 클릭 > 성공하면 연결 성공

## 5. 웹훅 설정

- 웹훅을 설정할 젠킨스 파이프라인 선택 후 구성 클릭 >
    
    Trigger 에서 
    
    Build when a change is pushed to GitLab. GitLab webhook URL: http://jenkins.dragonhailstone.org/project/파이프라인이름 
    
    선택 > 
    
    고급 > Secret Token > Generate 클릭 > 생성된 Secret Token 복사
    

- 깃랩 레포지토리 > 설정 > Webhooks > 새 웹훅 추가 >
    
    URL에 http://jenkins.dragonhailstone.org/project/파이프라인이름 입력 > 
    
    기밀토큰 > 복사한 토큰 값 입력 >
    
    트리거 > 푸쉬 이벤트 선택 >
    
    SSL 검증 활성화 해제 > 저장 후 웹훅 연결 테스트
    

## 6. 하버 연동

- Credentials에 Kind를 Username with Password로 설정 > Username에 하버 로그인 아이디 입력 > Password에 하버 패스워드 입력 ( 또는 하버에서 로봇 계정 생성 발급 후 로봇 계정 입력)

## 7. 파이프라인 스크립트 작성

[(7) Jenkins Pipeline 코드](https://www.notion.so/Jenkins-Pipeline-gradle-build-e8fd5e4e00fb4183827cb64c2dd15fb1?pvs=21)

## 참고 블로그

https://swaneel.tistory.com/16

[https://velog.io/@kimsei1124/Jenkins에서-Gitlab-사용하기](https://velog.io/@kimsei1124/Jenkins%EC%97%90%EC%84%9C-Gitlab-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

https://swaneel.tistory.com/16