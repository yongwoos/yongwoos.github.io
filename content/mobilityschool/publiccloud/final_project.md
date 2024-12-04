---
title: 최종 프로젝트
weight: 11
---
### CICD 파이프라인
- 현대는 Gitlab 사용
- 정적테스트 기능테스트 필수
- ArgoCD 사용
- 쿠버네티스는 EKS나 직접 사용해도 됨
  - 대기업은 직접 구축하는 것이 유리

### 로그분석 시스템개발
- ELK나 프로메테우스 그라파나 또는 타블로
- 로그수집을 위한 시스템: EC2(서버), S3(프론트엔드), lambda
- 개발자툴: logstash, elasticsearch, kibana, fluentd

### 데이터 파이프라인
```
Data Source -> 메시지브로커(카프카, rabbitmq - 다중화필요) -> 데이터가공 -> Data 저장(linux+hadoop+hive(mongodb)+spark)
Data Source ->
```

### 하이브리드 클라우드 이용한 메시지 발송 이중화
- SMS -> Message Broker(A system message topic) -> Worker(A system worker) -> SMS 전송 시스템(A System)
- Private Cloud에 서버를 두고 API gateway 통해 public cloud의 클라이언트로 메시지 발송

```
보고서 매주 작성
문제 해결 작성
git slack jira 사용
```