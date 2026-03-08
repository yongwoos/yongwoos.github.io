---
title: 오토에버 멘토링
weight: 1
---
```
오토에버 블록 distroless containes 적용
내부포탈
DevOps 도구 지원 및 운영
쿠버네티스 기술 지원

openstack 기반
```
### 발표자 백그라운드
파이썬, 리액트, 쿠버네티스, 깃랩, argoCD, Jenkins, Sonarqube, Openstack, Rancher

## 쿠버네티스 클러스터 환경 기반 웹 애플리케이션 자동화
### 자동화
- 자동화
  - 자동화 어디까지 할 것인가?
  - 앱 반영은 어떻게
- 관리?
  - 구축?
  - 설정?
    - 쿠버네티스 설정, 앱 설정, 민감정보
  - 배포?
### 관리자동화
#### Helm
  - artifacthub에서 차트 찾을 수 있음
#### DB on 쿠버네티스
  - 자주 사용하는 DB 포탈에서 간편 설치
  - DB(외부망) -> Nexus repository(DMZ) -> K8s <- cloud portal
#### GitOps
  - ArgoCD
- developer -> (Commit/push) -> source git -> (run) -> gitlab CI/CD pipeline -> (Commit/push)-> GitOps Git -(Webhook)> ArgpCD -> (Sync) -> K8s Cluster
- gitlab -> jenkins(단위테스트, 빌드, 하버로 푸쉬)
- latest는 운영환경에 사용X 커밋해시로 이미지 태그 사용
- 배포 주기 3~4주
  - latest 사용시 hpa는 latest로 pull
- 브랜치
  - feature(로컬개발) -> dev(개발계, feature 병합하면 개발계에 자동배포)
  - rc(검증계, 자동반영)
  - master(운영계 수동반영, argocd로 배포)

### 민감정보
- Secret은 깃에 넣어놓을 수 없음
  - Hashicorp Vault 사용(OpenBao 포크버전)
  - Sealed Secret

### 참고
- 로드밸런서는 쓰지 않고 ingress나 nodeport 사용
- 오브젝트 스토리지로는 히타치 장비(HPC)를 사용하고 내부용으로는 백업용으로 minio 사용
---
## 클라우드 플랫폼에서의 로그 분석 시스템 개발
- 클라우드 플랫폼?
  - 서버/VM 환경?
  - 쿠버네티스?
  - 관리형서비스?
- 무슨로그?
- 어디까지?
  - 수집과 모니터링
- 분석?
  - 어떤 목적?
  - 보안?성능?오류?시스템?사용자?
    - 임계점? 기준?
---
- EFK 스택 사용(OpenSearch 사용)
  - fluentd>fluentbit
- Pod별로 fluentd가 OpenSearch로 로그 전송
- 검색엔진을 만들어진 것으로 조회용으로는 불편 -> OpenTelemetry?
---
## 하이브리드 클라우드를 이용한 메시지 발송 이중화
- 하이브리드 클라우드? 내부에서는 AWS와 내부클라우드 사용
- 메시지?
  - SMS? 모바일 푸쉬? 시스템 내부 메세지?
- 이중화?
  - DNS, 서버, 네트워크, DB, 외부서비스 연동
    - 어느 구간?
- 전환을 어디서?
  - L4: TCP/IP L7: HTTP
- 앱 내부 전환
  - 서킷 브레이터 - Resilience4j 등
- HAProxy
- kafka
- DNS
  - GSLB
- HA Failover 기준?

## 참고
- pinpoint 서비스 중
- prometheus+grafana rancher로 사용 중
- ElasticSearch 사용중
- gitlab
---
## 데이터 파이프라인 자동화
- 데이터 서비스 기술팀

실시간 신호 데이터 -> 카프카 -> spark nifi -> MetaStore ES, Object Storage -> Data Miner Spark -> HDFS

- dbt나 onebigtable, star schema는 너무 최신 스택이라 사용하지 않고 있지만 공부하면 좋음
- near real-time 데이터 처리라 스파크 사용중, 스파크나 hdfs는 직접 구축해서 사용
- 최근에는 flink도 많이 사용을 해서 배워두면 좋음

### 배민 구조
- 라우터 모듈 통해 트래픽 라우팅 비율 결정: weighted routing policy