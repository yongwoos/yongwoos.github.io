---
title: GCP Cloud Deploy
---
Cloud Deploy는 Service.yaml 파일, DeliveryPipeline.yaml, target.yaml, scaffold.yaml 파일 등을 사용해 GCP의 Cloud Run이나 GKE에 배포를 도와주는 툴.

배포 과정은 다음과 같다:

타깃을 설정한다. 보통 staging과 production으로 나눈다. 타깃은 배포할 GKE 클러스터나 Cloud Run 서비스를 가리킨다.

Delivery Pipelinee을 scaffold.yaml과 service.yaml을 이용해 생성한다. Delivery Pipeline은 타깃의 순서를 정의한다. 예를 들어 staging -> production 순서로 배포할 수 있다.
.
배포할 애플리케이션의 소스 코드를 준비한다. Cloud Source Repositories, GitHub, Bitbucket 등에서 소스 코드를 가져올 수 있다.

Cloud Deploy를 사용해 배포를 시작한다.

release를 생성하고 rollout을 생성하면 배포가 진행된다. 카나리 배포의 경우 advance api를 호출해 각 phase로 배포를 진행할 수 있다.

## REST API
release 생성 api: scaffold config 설정을 같이 넘겨줘야 하고 scaffold.ymal 파일이 gcs에 위치해야 함.

rollout 생성 api: release_id를 주소에 넘겨주고 생성할 release_id를 주소에 parameter로 설정.

advance api: release_id와 rollout_id를 주소에 넘겨주고 카나리 배포를 진행할 phase_id를 body값에 설정.