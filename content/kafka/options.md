---
title: 카프카 옵션
weight: 4
---
```
buffer.memory : 프로듀서가 버퍼에 사용할 총 메모리의 양

max.block.ms

batch.size : 레코드를 묶는 byte 단위의 사이즈

# Sender
linger.ms : 브로커로 발송하기 전 Accmulator에 축적된 데이터를 꾸물거리며 가져오는 것, 기본값은 0

retries

delivery.timeout.ms

max.request.size
- 프로듀서가 브로커에 한 번 요청할 때 보낼 수 있는 최대 크기
- 메시지 크기가 이 설정 값보다 크면 프로듀스 불가

request.timeout.ms
- 프로듀서가 요청 후 브로커의 응답을 대기하는 최대 시간
- 만약 ack=all 인 상태에서 메시지 크기가 클 경우, 브로커 내부에서 복제할 때 시간이 걸릴 수 있음
- 기본 값: 30000ms

max.in.flight.request.per.connection

replica.lag.time.max.ms

# Brokers
message.max.bytes
- 레코드 배치(단일 요청)의 최대 크기
- 토픽 별로 설정 가능(max.message.bytes)
- 이 값보다 클 경우 메시지를 받을 수 없음
- 기본 값 1MB

fetch.max.bytes
- 각 fetch 요청에 따라 반환할 최대 바이트 수
- 이 설정보다 메시지 바이트가 클 경우 처리되지 않음
- 기본 값: 55MB

# 기타
log.segments.bytes
- 각 세그멘트 파일의 크기
- 기본 값 1GB

# replica.fetch.response.max.bytes
- 전체 fetch 응답의 최대 바이트 수

#  producer
linger.ms
```