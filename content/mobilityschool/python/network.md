---
title: 네트워크 프로그래밍
linkTitle: 네트워크 프로그래밍
weight: 8
---
### 구현 방식
- 저수준 네트워크 프로그래밍: OSI 7계층을 기준으로 3계층 이하의 프로토콜을 이용
  - TCP나 UDP 프로토콜을 이용해서 직접 통신하는 프로그래밍 방식
  - 구현이 어렵지만 효율이 좋음
- 고수준 네트워크 프로그래밍: OSI 7계층을 기준으로 7계층 프로토콜을 이용
  - http나 https 등의 응용 계층의 프로토콜을 이용하는 방식
  - 구현은 쉽지만 효율은 떨어짐

### Socket
- 네트워크에서 이야기 할 때는 Network Interface Card를 추상화한 개념
- 운영체제에서 이 용어를 사용하는 경우는 평상시에는 동작 중이 아니다가 요청이 오면 동작을 한 후 다시 동작 중이 아닌 상태로 돌아가는 서비스를 Socket 이라고 하기도 함
- socket 모듈이 기능을 제공

### socket 모듈
- `getservbyname("프로토콜 종류", "tcp나 udp")`를 호출하면 포트 번호를 
```python
import socket
print(socket.getservbyname("http", "tcp")) # 80
print(socket.getservbyname("https", "tcp")) # 443
print(socket.getservbyname("ssh", "tcp")) # 22
```
- 도메인의 종류에 따른 소켓
  - IPv4: AF_INET
  - IPv6: AF_INET6
- 유형에 따른 소켓
  - TCP(연결형): SOCK_STREAM
  - UDP(비연결형): SOCK_DGRAM (datagram)
