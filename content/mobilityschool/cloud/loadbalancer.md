---
title: 로드밸런서
weight: 5
---
## nginx를 이용한 Load Balancer 구현
### Load Balancer 테스트를 위해서 5개의 웹 애플리케이션을 생성
- flask 패키지를 설치: `pip install flask`
- 디렉터리를 1개 생성하고 app.js 추가
```python {filename="app.py"}
from flask import Flask

app = Flask(__name__)
@app.route("/")
def main():
    return "Web App_1"

app.run(host='0.0.0.0', port=5001, threaded=True, debug=True)
```
- `python app.py` -> 브라우저에서 localhost:5001 입력
- 이전 프로젝트를 복사해서 포트번호와 출력 구문 수정

## nginx 설치
- HTTP 기반의 서버를 생성해주는 소프트웨어
- 웹 서버를 생성할 수 있고 정적 웹페이지 호스팅 가능
- Event-Driven 구조로 동작: 고정된 프로세스 사용
- 적은 자원으로 효율적인 운용 가능
- 로드밸런싱 가능

### 설치
- windows는 다운로드 받아서 설치

### 실행
- nginx.exe를 실행

## nginx 설정 파일을 수정해서 LoadBalancing 수행
### 설정 파일 위치
- windows는 conf 디렉터리의 nginx.conf

```conf {filename="nginx.conf"}
upstream backend {
		server 127.0.0.1:5001;
		server 127.0.0.1:5002;
		server 127.0.0.1:5003;
		server 127.0.0.1:5004;
		server 127.0.0.1:5005;
}

//server에 추가
  location / {
 proxy_pass http://backend;
  }
```

## 로드 밸런싱 알고리즘
### Round Robin
- nginx의 기본 알고리즘으로 순서대로 번갈아 가면서 접속

### Hash
- 각 요청에 대해 사용자가 지정한 텍스트 및 NGINX 변수 조합을 기반으로 해시를 계산하고 이 해시를 서버 중 하나와 연결
- 해당 해시가 포함된 모든 요청을 해당 서버로 전송을 하기 때문에 기본적인 종류의 세션 지속성을 설정
- upstream을 만들때 상단에 hash를 설정해야 함
- 인증을 해야 이용할 수 있는 사이트의 경우 Round Robin으로 만들면 새로 접속할 때 마다 로그인을 해야 할 수 있음
- 고정되고 특정 서버에 접속하도록 만들 때는 hash를 이용해
```conf {filename="nginx.conf"}
//upstream에 추가
upstream backend {
		hash $scheme$request_uri;
		server 127.0.0.1:5001;
		server 127.0.0.1:5002;
		server 127.0.0.1:5003;
		server 127.0.0.1:5004;
		server 127.0.0.1:5005;
}

```

### IP_HASH
- HTTP에서만 사용 가능한 것으로 Hash의 미리 정의된 변형으로 클라이언트의 IP 주소를 기반으로 함
- ip_hash 지시문으로 설정
- 동일한 컴퓨터에서 접속하고 IP가 변경되지 않는다면 세션을 유지할 수 있음
```conf {filename="nginx.conf"}
// 추가
upstream backend {
		ip_hash;
		server 127.0.0.1:5001;
		server 127.0.0.1:5002;
		server 127.0.0.1:5003;
		server 127.0.0.1:5004;
		server 127.0.0.1:5005;
}
```

### Least Connections
- 각 서버에 대한 현재 활성화된 연결 수를 비교해서 연결이 가장 적은 서버로 요청을 전송함
- least_conn 으로 설정
```conf {filename="nginx.conf"}
// 추가
upstream backend {
		least_conn;
		server 127.0.0.1:5001;
		server 127.0.0.1:5002;
		server 127.0.0.1:5003;
		server 127.0.0.1:5004;
		server 127.0.0.1:5005;
}
```
- Round Robin이나 이 방식을 새로 고침을 하거나 브라우저 종료한 후 다시 접속하면 이전 서버에 접속한다는 보장을 못하기 때문에 세션을 유지해야 하는 서비스의 경우는 서비스를 유지할 수 있는 방법을 고려 - 메모리 데이터베이스를 이용해서 로그인을 유지하거나 맨 앞에 API Gateway를 달아서 해결


### Least Time
- 각 서버에 대해서 현재 활성화된 연결 수와 과거 요청에 대한 가중 평균 응답 시간이라는 두 가지 지표를 산술적으로 계산해서 가장 낮은 값을 가진 서버로 요청을 전송
- `least_time (header | last_byte);` 로 설정 

### 알고리즘 선택 기준
- CPU 및 메모리 로드: 모든 서버가 동일하게 로드되지 않는다면 효율적으로 분산되지 않는 것
- 서버 응답 시간: 일부 서버의 시간이 다른 서버에 비해서 지속적으로 긴 경우 문제가 있음
- 클라이언트에 응답하는데 걸리는 총 시간
- 오류 및 요청 상태

## 알고리즘의 장단점
### Hash 및 IP Hash
- 세션 지속성이 장점: 고정된 연결, A/B 테스트에 많이 사용
- 부하를 균등하게 동일한 수로 분배한다는 보장이 없음

### Round Robin
- 가장 쉽게 구성이 가능
- 서버 및 요청의 특성으로 인해서 일부 서버가 다른 서버에 비해 과부하가 걸릴 가능성이 낮을 때 사용
- 모든 서버의 용량이 거의 동일해야 함
- 특정 파일에 대한 요청을 동일한 서버에게 보낼 수가 없기 때문에 모든 서버가 광범위한 파일을 서비스하고 캐싱하게 됨

### Least Connection 및 Least Time
- 성능이 안정적이고 예층 가능
- 서버의 평균 응답 시간이 매우 다른 경우에 유리 - 오래 걸리는 작업과 짧은 시간이 걸리는 작업이 존재하는 경우
- 하드웨어 성능을 예측하기가 어려운 클라우드 환경에서 많이 사용