---
title: Public Cloud 평가
weight: 5
---
### Load Balancer 추가
- 로드밸런서 생성
- 대상 그룹 설정에서 health check 경로를 위한 /health 생성
  - `/`로 설정 시 too many connections 에러 발생 가능
  - status 200번 return 해야 로드밸런서가 롤백 하지 않음
- health check 관련 옵션 맥스값으로 설정
  - 짧은 주기로 health check 시 실패로 간주할 수 있기 때문

### mysql 설정
- mysql option을 따로 설정하지 않으면 too many connections 에러가 발생하게 됨
- 루트권한으로 mysql 접속 후 또는 conf.d 파일에 다음과 같은 명령어 추가
  - mysql shell에서 설정
```
mysql -u root -p
>
- max_connections 설정
- wait_timeout 설정
```
- conf.d 파일에 추가

### DB 서버 구축

### Web Application Server 구축
- NodeJS 사용

### frontend 구축
- react 사용

### S3 static web 구축
- build 파일을 S3에 올리게 되면 빈 화면이 출력될 수 있음
- json.package 파일에 homepage 설정 추가
- 추가해도 빈 화면이 보일 경우 react의 /build 디렉터리를 폴더채 S3에 업로드 후 `버킷경로/build` 접속