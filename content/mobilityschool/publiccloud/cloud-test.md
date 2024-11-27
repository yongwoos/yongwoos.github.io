---
title: Public Cloud 평가
weight: 5
---
### Load Balancer 설정
- 대상 그룹 설정에서 health check 경로를 위한 /health 생성
- health check 관련 옵션 맥스값으로 설정

### mysql 설정
- too many connections 관련 설정 변경
```mysql -u root -p```
- max_connections 설정
- wait_timeout 설정

### DB 서버 구축

### Web Application Server 구축
- NodeJS 사용

### frontend 구축
- react 사용

### S3 static web 구축
- react 빌드 폴더를 폴더채 S3에 업로드 후 `버킷경로/build` 접속

### ECS 배포