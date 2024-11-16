---
title: Microservice
weight: 2
---
## 비즈니스 민첩성
### 인터넷 기업들의 비즈니스 민첩성
- Amazon이나 Netflix, Uber같은 기업들은 익숙한 비즈니스에 새로운 비즈니스 기술을 융합해 자신만의 특화된 서비스를 제공
- 자신만의 특화된 서비스를 제공하려는 시도를 빨리 실행했고 사용자 피드백을 반영해 끊임없이 서비스를 개선
- 이런 기업들의 가장 큰 장점은 비즈니스 민첩성(Agility)이며 이것이 기업 성공의 가장 큰 요인
- Amazon의 배포 속도
  - 2011년에 11.6초마다 아마존 쇼핑몰의 소스 코드가 변겨오디어 배포된다고 발표
  - 2019년에는 이 주기가 초당 1.5번
  - 비즈니스는 계속 변경이 되고 이로 인해서 개선된 시스템도 계속 배포가 되어야 하는데 기업은 새로운 아이디어를 시스템에 반영해 적시에 오픈하고 그 반응을 살펴보고자 하고 기존 서비스를 보완하는 부가 서비스가 필요한 시점이나 새로운 서비스를 공개했지만 반응이 좋지 않아 이를 개선해야 할 때도 시스템을 빠르게 변경해서 배포해야 하므로 빠른 배포 주기는 비즈니스 민첩성을 간접적으로 보여주는 지표
- Public Cloud 인프라의 등장: 기존의 On-Premise 환경에서는 인프라를 준비하는 시간이 오래 걸리고 별도의 조직도 운영해야 했는데 Public Cloud의 등장으로 시간이나 비용이 단축

### Scale Up과 Scale Out
- 성능 및 가용성을 높이는 방법
- Scale Up(수직 확장): 하드웨어의 성능을 높이는 것
- Scale Out(수평 확장): 하드웨어 개수를 높이는 것
- 쇼핑몰을 운영하는 도중에 타임세일 기간에 밀려올 트래픽을 대비하고자 용량을 늘리고자 하는 경우
  - 스케일 업 작업은 전체 트래픽 최대치를 계산해서 대용량 처리가 가능한 시스템으로 업그레이드를 할 수 있음
  - 확장 탄력성을 보장하는 스케일 아웃 작업을 수행: 인스턴스를 늘리는 것
- 특정 서비스만 탄력성 있게 확장
  - 애플리케이션을 개발할 때 레고 블록처럼 여러 개의 조각으로 분리해서 개발했다면 특정 모듈만 스케일 아웃이 가능

## Cloud Friendly와 Cloud Native
- Cloud Friendly: 작은 단위의 서비스 연계로 시스템을 구성하지 않고 전체 시스템을 하나의 덩어리로 만들어 Cloud 플랫폼에 올려도 됨
  - 하나로 묶으면 Cloud 플랫폼에 배포할 때 편리
  - Monolith 형태의 서비스
- Cloud Native: 독립적으로 분리되어 배포할 수 있는 조각으로 구성된 애플리케이션을 Cloud인프라에 가장 어울리고 효과적이라는 의미로 Cloud Native Application이라 부르며 궁극적으로 Cloud Friendly에서 Cloud Native로 전이해야 한다고 함
  - Microservice 형태

## Monolithic과 Micro Service
### Monolithic
- 하나의 단위로 개발되는 일체식 애플리케이션
- 3 Tier로 개발: 사용자 인터페이스(클라이언트), 데이터베이스 그리고 서버쪽 애플리케이션
- 서버측 애플리케이션이 논리적인 단일체로서 아무리 작은 변화에도 새로운 버전으로 전체를 빌드해서 배포해야 하고 일체식 애플리케이션은 단일 프로세스에서 실행되기 때문에 확장이 필요한 경우 특정 기능만 확장할 수 없고 반드시 전체 애플리케이션을 동시에 확장해야 하는데 보통은 로드밸런서를 앞에 두고 여러 인스턴스 위에 큰 덩어리를 복제해서 수평으로 확장
- 변경이 발생하면 Monolithic 시스템의 단점이 극대화되는데 수평으로 확장된 형태이기 때문에 여러 개 시스템 모두 전부 다시 빌드하고 배포를 해야 함
- 데이터베이스가 통합되어 하나이므로 탄력적으로 대응할 수가 없음
```
삽입       삭제
 |          |
DB---------DB
```

### Micro Service
- 서버 측을 여러 개의 조각으로 구성
- 각 서비스가 별개의 인스턴스로 로딩되며 각기 저장소가 다르기 때문에 모듈의 경계를 명확하게 구분
- 각 서비스가 독립적이어서 서로 다른 언어로 개발하는 것도 가능하며 각 서비스의 소유권을 분리해서 서로 다른 팀이 개발 및 운영할 수 있음

### SOA과 Micro Service
- 소프트웨어 공학에서 말하는 모듈화 개념의 발전 흐름을 보면 단순히 기능을 햐향식 분해해서 설계해 나가는 구조적 방법론부터 시작해서 객체 지향 방법론으로 넘어간 후 기능별로 재사용 가능한 컴포넌트 단위의 개발 방법론(CBD - Component Based Development)으로 진화한 후 컴포넌트들을 모아서 비즈니스적으로 의미있고 완결적인 서비스 단위로 모듈화하는 것이 Service Oriented Architecture
- CBD나 SOA도 넓게 보면 Micro Service
- SOA는 일반적으로 이론적인 개념이고 Micro Service는 구체화된 사례
- Micro Serviec의 조건
  - 여러 개의 작은 서비스의 집합으로 개발
  - 각 서비스는 개별 프로세스에서 실행되고 HTTP 자원 API같은 가벼운 수단을 사용해서 통신
  - 서비스는 비즈니스 기능 단위로 구성되고 자동화된 배포 방식을 사용
  - 중앙 집중적인 관리는 최소화하고 각 서비스는 다른 언어와 데이터 저장 기술을 사용할 수 있음
- 하나의 서비스를 구현하는데 사용되는 언어나 저장소를 자율적으로 선택할 수 있는 방법을 Polyglot 하다라고 표현함

### Micro Service를 위한 조건
- 업무 기능 중심 팀으로 조직을 변화
  - 예전에는 기술 별(UI, Server, Data 등)로 팀을 나누고 그 팀이 의사소통을 해가면 개발
  - 마이크로 서비스를 구현하는 팀은 업무 기능 중심의 팀이어야 하는데 이 팀은 역할 또는 기술별로 팀이 분리되는 것이 아니고 업무 기능을 중심으로 기술이 다양한 사람들이 하나의 팀이 되어 서비스를 만드는 것
  - 팀원들이 같은 공간, 같은 시간을 공유하기 때문에 의사소통도 원할하고 의사 결정도 빠르게 진행
  - 팀의 크기를 보통 피자 두판을 나누어 먹을 수 있는 정도로 구성: two pizza team
- 관리 체계의 변화
  - 자율적인 분권 서비스: 팀이 개발과 운영 모두 책임지며 중앙의 강력한 거버넌스를 추구하지 않음
  - 폴리글랏
- 개발 수명 주기의 변화: 프로젝트가 아니라 제품 중심
  - 비즈니스를 제공하는 제품으로 소프트웨어를 바라보고 개발한 뒤에 반응을 보고 개선하는 방식으로 진행
- 개발 환경의 변화: 인프라 자동화
- 저장소의 변화: 통합 저장소가 아닌 분권 데이터 관리
  - Monolithic 시스템은 통합 데이터베이스를 사용: 데이터의 안정성과 효율성을 추구한 결과로 잘 정리하는 정규화가 반드시 추구해야 할 가치였지만 지금은 스토리지 가격이 저렴하고 네트워크 대역폭이 매우 커져서 데이터를 억지로 뭉쳐서 작은 공간에 넣을 필요가 없음
  - 폴리글랏 저장소 접근법을 선택하고 서비스 별로 데이터베이스를 갖도록 설계하는데 각 저장소가 서비스 별로 분산되어야 하며 다른 서비스의 저장소를 직접 호출할 수 없고 API를 통해서만 접근
  - 이러한 구조에서는 비즈니스 처리를 위해 일부 데이터의 복제와 중복 허용이 필요한데 여기서 반드시 등장하는 문제가 있는데 바로 Micro Service 저장소에 담긴 데이터의 비즈니스 정합성(무결성)을 맞춰야 하는 데이터 일관성 문제
  - 데이터 일관성 처리를 위해서는 보통 2단계 커밋 같은 분산 트랜잭션 기법을 사용하는데 각각 다른 서비스를 하나의 트랜잭션으로 묶다 보면 각 서비스의 독립성도 침해되고 NoSQL같은 경우는 2단계 커밋을 지원하지 않기 때문에 MicroService에서 데이터 일관성 문제를 해결하기 위해서는 단일 트랜잭션으로 묶는 방법이 아니라 비동기 이벤트 처리를 통합 협업을 강조하는데 이를 가리켜 결과적 일관성이라는 개념으로 표현하는데 이 개념은 일시적으로 불일치하는 시점이 있지만 결과적으로는 일치해짐
- 위기 대응 방식의 변화: 실패를 고려한 설계
  - Netflix에서는 chaos monkey라는 일부러 장애를 발생시키는 도구를 만들어서 위기에 어떻게 대처하고 있는지 점검

## MSA에 대한 이해
### Reactive 선언
- 2014년에 현대 애플리케이션이 가져야 하는 바람직한 속성들에 대한 선언으로 Responsive(응답성), Resilient(탄력성), Elastic(유연성), Message Driven(메시지 기반)을 강조
- 응답성: 사용자에게 신뢰성있는 응답을 빠르고 적절하게 제공하는 것
- 탄력성: 장애가 발생하거나 부분적으로 고장이 나더라도 시스템 전체가 고장나지 않고 빠르게 복구하는 능력 - 단일 장애점을 만들면 안됨
- 유연성: 시스템의 사용량에 변화가 있더라도 균일한 응답성을 제공하고 시스템 사용량에 따라 자원을 늘리거나 줄이는 능력
- 메시지 기반: 비동기 메시지 전달을 통해 위치 투명성, 느슨한 결합, 논블로킹 통신을 지양

### 강결합에서 느슨한 결합의 아키텍쳐 변화
- 특정 벤더에 종속되지 않도록 개발
  - 특정 벤더에 종속되면 특정 기술에 Lock-In이 되어 쉽게 변경하거나 확장하지 못한다는 단점이 있음
  - 최근의 클라우드 관련된 기술들은 오픈소스 기반이 많은데 이 제품들이 유명 벤더의 제품군만큼 품질이 높아졌고 다양한 기능을 지원하고 서로 다른 오픈 소스 제품 간에도 충분한 호환성을 제공하므로 특정 벤더의 제품보다는 오픈 소스를 사용하는 것을 권장

### 구성 요소
- 인프라 구성 요소
  - Public Cloud
  - Private Cloud
  - VM(운영체제 가상화 - 쉬움) & Container(데이터와 코드의 가상화: 이식성, 신속성, 재사용성에서 이점)
  - 컨테이너 오케스트레이션
  - CaaS(Container as a Service): 컨테이너 기반 가상화를 사용해서 컨테이너를 업로드하고 구성할 수 있는 서비스
  - AWS의 ECS, EKS, MS의 AKS, Google의 GKE
- 플랫폼 구성 요소: DevOps 인프라 구성
  - 서비스 단일 진입을 위한 API 게이트웨이 패턴
  - BFF(Backend for Frontend): API 게이트웨이와 같이 진입점을 하나로 두지 않고 FrontEnd의 유형에 따라 별도로 두는 패턴
  - 외부 구성 저장소 패턴: 데이터베이스 접속 정보 같은 애플리케이션을 구동하는데 필요한 정보 중에서 시작할 때만 필요하고 나중에는 필요하지 않은 정보들은 별도의 저장소에 관리
  - 인증(Authentication - 로그인) / 인가(Authorization - 권한) 패턴
    - 중앙 집중식 세션 관리: Monolithic에서 사용했던 방식은 서버 세션에 사용자의 로그인 정보 및 권한 정보를 저장하고 이를 통해서 애플리케이션의 인증 인가를 판단하는 방식으로 Microservice에서 사용하기는 어려움
    - 모든 서비스가 동일한 사용자 데이터를 사용하기 위해서 데이터베이스(속도 때문에 메모리 데이터베이스 이용)를 이용
    - 클라이언트 토큰: 세션은 중앙 서버에 저장되고 토큰은 사용자의 브라우저에 저장되는 방식으로 사용자의 신원 정보를 클라이언트에 저장한 후 서버로 요청을 보낼 때 전송하는 방식 이 때 사용하는 토큰 방식이 JWT(JSON Web Token)
    - API Gateway를 이용한 토큰 인증 방식
  - 서킷 브레이커 패턴: 하나의 서비스에 장애가 발생했을 때 다른 정상적인 서비스로 요청을 변경하게 해주어서 장애가 다른 서비스에 영향을 주지 않도록 하는 패턴
  - 모니터링과 추적 패턴: 장애를 실시간으로 감지하고 모니터링하고 추적하는 패턴이 필요 - Spring Cloud에서는 히스트릭스라는 라이브러리 제공, 최근에는 ELK 스택을 많이 사용
  - 중앙화된 로그 집계 패턴: ELK Stack과 Kafka(다양한 데이터 소스로부터 데이터를 수집하는 용도) 사용을 권장 E(Elastic Search - 분석 엔진) L(logstash - 로그 집합기) K(Kibana - 시각화)
  - 여러가지 패턴들이 있는데 이를 한꺼번에 해결하기 위한 솔루션들이 등장했는데 Kubernetes나 OpenShift 등
  - 최근에는 Kubernetes + Istio 기술이 많이 사용
- 애플리케이션 패턴
  - Monolithic FrontEnd: 여러 API를 호출하고 조합한 후 화면으로 구성해서 보여주는 방식
  - UI Composite Pattern(Micro Front End): 메인 화면을 여러 조각으로 나누고 각 조각은 여러 개의 Micro FrontEnd의 조합으로 서비스
  - 통신 방식은 동기(송신자와 수신자가 직접 통신)와 비동기 방식(생산자와 소비자로 구분해서 통신 - 구독과 게시) 모두 사용
    - 비동기로 하는 경우 직접 구현할 것인지 Public Cloud의 완전 관리형 메신저 서비스를 사용할 것인지 결정
    - 저장소 분리 패턴
    - 분산 트랜잭션 처리 패턴
    - 읽기와 쓰기 분리: CQRS(Command Query REsponsibility Segregation) 패턴

## CQRS
- Command and Query Responsibility Segregation의 약자로 데이터 저장소로부터 읽기와 업데이트 작업을 분리하는 패턴
- CQRS를 사용하면 애플리케이션의 확장성, 퍼포먼스, 보안성을 극대화할 수 있고 여러 요청으로부터 들어온 복수의 업데이트 작업들도 충돌을 방지할 수 있음, 업데이트 작업들도 충돌을 방지할 수 있음

### 전통적인 방식의 문제점
- 전통적인 아키텍쳐에서는 데이터베이스에서 조회하고 업데이트하는데 같은 데이터 모델을 사용
- 간단한 CRUD 작업에서는 문제없이 동작하지만 복잡한 애플리케이션에서는 유지 보수를 어렵게 만들 수 있는데 데이터 조회를 할 때는 여러 다른 형태의 DTO를 반환하는 매우 다양한 쿼리들을 수행할 수 있음
- 각각 다른 형태의 DTO들에 객체 매핑 작업은 복잡해질 가능성이 있으며 데이터를 쓰거나 업데이트 할 때는 복잡한 유효성 검사와 비즈니스 로직이 수행되어야 하는데 이 모든 걸 하나의 데이터 모델이 수행하면 너무 많은 것을 수행하는 복잡한 모델이 됨
- 읽기와 쓰기의 트래픽은 일반적으로 같지 안히 때문에 각각에 대해서 다른 성능이 요구되는 경우가 많음
- 읽기와 쓰기 작업에서 사용되는 데이터 표현들이 서로 일치하지 않는 경우가 많은데 그로 인해서 일부 작업에서는 필요하지 않은 추가적인 컬럼이나 속성의 업데이트가 이루어져야 함
- 동일한 세트에 대해 병렬로 작업이 수행될 때 데이터 경합이 발생할 수 있음
- 정보 조회를 위해 요구되는 복잡한 쿼리로 인해 성능에 부정적인 영향을 줄 수 있음
- 하나의 데이터 모델이 읽기와 쓰기를 모두 수행하기 때문에 보안 관리가 복잡해질 수 있음

### 해결책
- 읽기와 쓰기를 분리해서 각각 다른 모델로 분리해서 명령을 통해 데이터를 쓰고 쿼리를 통해 데이터를 읽음
- 명령(Command)은 데이터 중심적이 아니라 수행할 작업 중심이 되어야 하는데 호텔룸의 상태를 예약됨으로 변경한다가 아니라 호텔 룸 예약과 같이 생성
- 조회(Query)는 데이터베이스를 결코 수정하지 않는데 쿼리는 어떠한 도메인 로직도 캡슐화하지 않은 DTO만을 반환
- 읽기/쓰기 모델들은 서로 격리될 수 있는데 이렇게 읽기/쓰기 모델을 분리하는 것은 애플리케이션 디자인과 구현을 더욱 간단하게 만들어주지만 CQRS 코드는 ORM 툴을 이용해서 스키마로부터 자동으로 생성되도록 할 수 없다는 단점이 있음
- 확실한 격리를 위해서 물리적으로 읽기와 쓰기를 분리할 수 있는데 읽기 DB의 경우 복잡한 조인문이나 ORM 매핑을 방지하기 위해서 Material View를 가지는 조회에 최적화된 별도의 DB 스키마를 가질 수 있도록 만들 수 있음, 단지 다른 DB 스키마가 아니라 아예 다른 타입의 저장소를 사용할 수 있는데 이 때 보통 쓰기의 경우는 RDBMS를 읽기의 경우는 NoSQL을 사용하기도 함
- 별도의 읽기/쓰기 데이터 저장소가 사용된다면 반드시 동기화가 이루어져야 하는데 쓰기 모델이 DB에 수정 사항이 발생할 때 마다 이벤트를 발행함으로써 이루어지며 이 때 DB 업데이트와 이벤트 발행은 하나의 트랜잭션 안에서 이루어져야 함
- 읽기 저장소는 단순히 쓰기 저장소의 레플리카(복제본)일 수도 있고 완전히 다른 구조를 가질수도 있음
- 읽기와 쓰기를 분리하게 되면 각각의 부하에 맞게 스케일링 하는 것을 가능하게 해줌
- 읽기 저장소가 쓰기보다 더 많은 부하를 가짐

### CQRS의 장점
- 독립적인 스케일링
- 최적화된 데이터 스키마
- 보안
- 관심사 분리(AoP): 복잡한 비즈니스 로직은 쓰기 모델에만 필요
- 간단한 쿼리: 읽기 저장소의 material view를 통해서 복잡한 조인문을 사용할 필요가 없음

### 구현 이슈
- 복잡성
- 메세징: 명령을 수행하고 업데이트 이벤트를 발행해서 데이터를 수정해야 하기 때문에 메시지 전송 실패나 중복 메시지에 대한 처리가 필요
- 데이터 일관성: 명령을 수행하고 이벤트를 발행해서 읽기 모델에 업데이트를 하더라도 어쩔 수 없는 딜레이가 발생

### CQRS를 사용해야 하는 경우
- 많은 사용자가 동일한 데이터에 병렬로 액세스 하는 경우: 읽기가 많은 시스템
- 복잡한 프로세스나 도메인 모델을 통해 가이드 되는 작업 기반 사용자 인터페이스
- 데이터의 읽기 성능과 쓰기 성능이 별도로 조정되어야 할 때
- 시스템이 시간이 지남에 따라 계속해서 진화하고 여러 버전을 가져야 할 때
- 다른 시스템과의 통합

### 권장하지 않은 경우
- 도메인과 비즈니스 로직이 간단할 때
- 단순한 CRUD 작업인 경우

## Apache Kafka
### 등장 배경
- LinkedIn에서 2011년 파편화된 데이터 수집 및 분배 아키텍쳐를 운영하는데 어려움을 겪었는데 데이터를 생성하고 적재하기 위해서는 데이터를 생성하는 소스 애플리케이션과 데이터가 최종 적재되는 타깃 애플리케이션이 연결되어야 하는데 초기 운영을할 때는 단방향 통신을 이용해서 소스 코드를 작성.
- 이 당시에는 아키텍쳐가 복잡하지 않았기 때문에 운영이 힘들지 않았지만 아키텍쳐가 점점 복잡해지고 소스 애플리케이션과 타깃 애플리케이션 개수가 늘어나면서 문제가 발생
- 소스 애플리케이션과 타깃 애플리케이션을 연결하는 파이프라인의 개수가 늘어나면서 소스 코드 및 버전 관리에서 이슈가 발생하기 시작했고 타겟 애플리케이션에 장애가 발생할 경우 그 영향이 소스 애플리케이션에 그대로 전달 - 강한 결합의 문제점
- 초창기에는 다양한 메시지 플랫폼과 ETL(Extract Transform Load) 툴을 적용해서 아키텍쳐를 변경하려고 노력을 했는데 파편화된 데이터 파이프라인의 복잡도를 낮추는 아키텍쳐를 만드는데 실패
- LinkedIn의 데이터 팀은 새로운 시스템을 만들려고 했는데 그 결과물이 Apache Kafka

### 해결책
- 각각의 애플리케이션끼리 연결해서 데이터를 처리하는 것이 아니고 한 곳에 모아 중앙 집중화 방식으로 처리
- 카프카를 이용해서 웹사이트, 애플리케이션, 센서 등에서 취합한 데이터 스트림을 한 곳에 모아서 관리
- 카프카는 대용량 데이터를 수집하고 이를 사용자들이 실시간 스트림으로 소비할 수 있게 만들어주는 애플리케이션
- 카프카를 중앙에 배치해서 소스 애플리케이션과 타겟 애플리케이션과의 의존도를 최소화함
- 소스 애플리케이션은 어느 타겟 애플리케이션으로 데이터를 보낼 것인지 고민하지 않고 카프카로 넣으면 되고 카프카 내부에 데이터가 저장되는 파티션은 FIFO(First In First Out)의 형태로 동작
- 큐에 데이터를 보내는 동작은 프로듀서가 하고 큐에서 데이터를 가져가는 것은 컨슈머가 수행

### 데이터 포맷
- 제한 없음
- 자바에서 사용 가능한 모든 객체는 사용할 수 있는데 직렬화(객체 단위로 데이터를 전송할 수 있도록 해주는 것 - Serializable 인터페이스나 Parceable 인터페이스를 구현한 객체)와 역직렬화를 이용

### 구성
- 카프카는 상용환경에서 최소 3대 이상의 서버(Broker)로 운영
- 3대 이상으로 구현을 하게 되면 클러스터 중 일부에 장애가 발생하더라도 데이터를 지속적으로 복제하기 때문에 안전하게 운영할 수 있음

### 현재
- 카프카 소스 코드는 깃허브 저장소(https://githuhb.com/apache/kafka)에서 공개
- KIP(Kafka Improvement Proposal)을 통해서 변경 사항을 제안하는 것이 가능

## Kafka의 역할
### Big Data
- 다양한 종류의 많은 또는 빠르게 생성되는 데이터

### Data Pipeline
- Data Lake: 생성되는 데이터를 모두 모은 것
- Data Warehouse: 필터링이나 패키지화가 된 데이터
- Data Pipeline은 Data Warehouse 와 다르게 필터링 되거나 패키지화 되지 않은 데이터가 저장되고 운영되는 서비스로부터 수집 가능한 모든 데이터를 모으는 것이고 데이터 과학자는 모든 데이터를 가지고 서비스에 활용할 수 있는 비지니스 인사이트를 도출
- 서비스에서 발생하는 데이터를 데이터 레이크로 모으려면 웹, 앱, 백엔드 서버, 데이터베이스에서 발생하는 데이터를 직접 End-To-End 방식으로 넣을 수 있는데 서비스하는 애플리케이션의 개수가 적고 트래픽이 많지 않을 때는문제가 되지 않지만 서비스가 복잡해지고 복잡해지게 되면 Extracting(추출), Transform(변경), Loading(적재)하는 과정을 하나로 만드는 Data Pipeline을 구축해야 함
- Data Pipeline의 동작은 자동화 되어야 함
- Data Pipeline을 구축할 때 Kafka와 같은 Message Broker와 Airflow(스케줄러)같은 Tool을 많이 이용함, Message Broker가 받은 데이터를 전처리 작업을 수행한 후 데이터 저장소에 저장

### Kafka 사용 이유
- 높은 처리량: 데이터를 묶어서 전송할 수 있고 병렬 처리가 가능
- 확장성이 좋음: 브로커의 개수를 조절
- 영속성
  - 카프카는 데이터를 파일에 저장(카프카가 종료되었다 켜지더라도 데이터는 그대로 보존)
  - 속도는 Page Cache를 이용해서 보완
- 고가용성
  - 여러 개의 서버로 운영이 되기 때문에 일부 서버에 장애가 발생해도 무중단으로 안전하고 지속적으로 데이터를 처리

## Docker에 설치
### docker-compose.yml 파일을 생성
```yaml
name: myProject

services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka:2.12-2.5.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 127.0.0.1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```
- 카프카는 설치를 할 때 2개의 이미지를 이용
- 카프카와 주키퍼(카프카 코디네이터)를 같이 설치

### 터미널에서 명령을 수행 - 클러스터 1개를 가진 카프카 서버를 실행
- `docker compose up -d`

### 외부에서 사용할 수 있도록 설정 변경
- 터미널에서 도커 컨테이너 안으로 접속
`docker exec -it kafka/bin/bash`

### 설정 파일을 수정 - 내용을 추가
```
listeners=PLAINTEXT://:9092                                                   
delete.topic.enable=true                                                        
auto.create.topics.enable=true
```
### 토픽 생성 과 조회 및 삭제
- 명령어를 사용하기 위해서 프롬프트 이동: `bash#cd /opt/kafka/bin`
- 첫번째 카프카 서버의 첫번째 영역에 토픽(exam-topic) 생성: `bash# kafka-topics.sh --bootstrap-server localhost:9092 --list`
- 토픽 삭제 `kafka-topics.sh --delete --zookeeper zookeeper:2181 --topic exam-topic`

### 메시지 전송 및 받기
- 메시지 전송
- 터미널에서 `docker exec -it kafka /bin/bash`
```
bash# cd /opt/kafka/bin
bash# kafka-console-producer.sh --topic exam-topic --broker-list localhost:9092
>메세지를 작성
```
- 메시지 받기
- 새로운 터미널에서 `docker exec -it kafka /bin/bash`
```
bash# cd /opt/kafka/bin
토픽 받기 bash# cd /opt/kafka/bin
```
### Python에서 카프카 메세지 전송 및 받기
- 가상 환경을 생성(Mac 이나 Linux는 pythone 대신에 python3) `python -m venv kafka_env`
- 가상환경 활성화 `가상환경 폴더> .\Scripts\Activate.ps1`
- 패키지 설치 `pip install kafka-python`

- 패키지 설치
```python
pip install kafka-python
pip install six==1.6.0
```

- 메시지 전송하는 코드를 작성하고 실행 한 후 터미널을 확인
```python
import sys
import six
if sys.version_info >= (3, 12, 0):
   sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaProducer
import json


class MessageProducer:
   def __init__(self, broker, topic):
       self.broker = broker
       self.topic = topic
       #key_serializer=str.encode 를 추가하면 key 와 함께 전송
       #그렇지 않으면 value 만 전송
       self.producer = KafkaProducer(
           bootstrap_servers=self.broker,
           value_serializer=lambda x: json.dumps(x).encode("utf-8"),
           acks=0,
           api_version=(2, 5, 0),
           key_serializer=str.encode,
           retries=3,
       )
   def send_message(self, msg, auto_close=True):
       try:
           print(self.producer)
           future = self.producer.send(self.topic, value=msg, key="key")
           self.producer.flush()  # 비우는 작업
           if auto_close:
               self.producer.close()
           future.get(timeout=2)
           return {"status_code": 200, "error": None}
       except Exception as exc:
           raise exc

브로커와 토픽명을 지정
broker = ["localhost:9092"]
topic = "exam-topic"
pd = MessageProducer(broker, topic)
#전송할 메시지 생성
msg = {"name": "John", "age": 30}
res = pd.send_message(msg)
print(res)
```
### 카프카 컨슈머 작성
- 실행 한 후 터미널의 카프카 컨슈머가 데이터를 받는지 확인

- 파이썬 카프카 컨슈머를 작성
```python
import sys
import six
if sys.version_info >= (3, 12, 0):
   sys.modules['kafka.vendor.six.moves'] = six.moves

from kafka import KafkaConsumer
import json
class MessageConsumer:
   def __init__(self, broker, topic):
       self.broker = broker
       self.consumer = KafkaConsumer(
           topic,  # Topic to consume
           bootstrap_servers=self.broker,
           value_deserializer=lambda x: x.decode(
               "utf-8"
           ),  # Decode message value as utf-8
           group_id="my-group",  # Consumer group ID
           auto_offset_reset="earliest",  # Start consuming from earliest available message
           enable_auto_commit=True,  # Commit offsets automatically
       )
   def receive_message(self):
       try:
           for message in self.consumer:
               #print(message.value)
               result = json.loads(message.value)
               for k, v in result.items():
                   print(k, ":", result[k])
               print(result["name"])
               print(result["age"])
       except Exception as exc:
           raise exc
      
# 브로커와 토픽명을 지정한다.
broker = ["localhost:9092"]
topic = "exam-topic"
cs = MessageConsumer(broker, topic)
cs.receive_message()
```
- 작성한 파일을 실행하면 에러가 발생: 이전에 JSON 형식이 아닌 데이터를 전송했는데 그 데이터를 파싱할려고 해서 에러가 발생
- 토픽을 삭제하고 다시 전송한 후 실행
```
docker exec -it kafka /bin/bash
bash-5.1# cd /opt/kafka/bin
bash-5.1# kafka-topics.sh --delete --zookeeper zookeeper:2181 --topic exam-topic 
```