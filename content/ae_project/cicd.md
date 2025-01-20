---
title: Gitlab Jenkins Harbor 연동
weight: 5
---
1. Gitlab 에서 Access Token 생성
2. Jenkins Credentials 에서 global 선택 -> Gitlab API Token 선택 후 생성한 토큰 추가
3. Jenkins Pipeline에서 사용할 credentials 생성 -> global 선택 후 Create with username and password 선택 후 gitlab ID와 비밀번호에 토큰값 입력
4. Webhook 연결 -> Pipeline에서 Jenkins webhook 주소 복사, secret token generate 후 깃랩 웹훅에 붙여넣기
5. Jenkins Credentials에 harbor robot계정 또는 로그인 한 id와 비밀번호 입력

#### 참조
https://swaneel.tistory.com/16
https://velog.io/@kimsei1124/Jenkins%EC%97%90%EC%84%9C-Gitlab-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
https://swaneel.tistory.com/16