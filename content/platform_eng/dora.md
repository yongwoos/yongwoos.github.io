---
title: DORA
weight: 2
---
## DORA
구글 클라우드의 DevOps Research and Assessment 팀의 약자

## DORA Metric
DORA팀이 뽑은 개발팀의 생산성을 측정하는 주요 지표로 꼽은 4가지 메트릭. 생산성 지표와 안정성 지표로 나눠짐.
### 생산성 지표(Throughput Metrics)
- 배포 빈도
  - 배포 빈도는 운영 환경에 새 코드를 배포하는 빈도를 계산한 값
  - 개발한 기능을 고객에게 빠르게 전달하고 있는지를 직관적으로 확인할 수 있는 지표
  - 배포 빈도를 높이기 위해선 코드를 검증하고 배포하기 위한 절차를 자동화하거나 변경 사항을 작은 단위로 분할하는 방법을 사용할 수 있음
  - 변경에 걸리는 시간 (Lead time for changes)
- 변경에 걸리는 시간 (Lead time for changes)
  - 변경 리드 타임은 커밋이 프로덕션 환경에 배포될 때까지의 간격. 개발자가 개발을 마친 후 코드 검토나 배포를 기다리는 동안 지연이 얼마나 발생하는지를 나타냄
  - PR이 리뷰되는 데 걸리는 시간, PR 머지 후 배포까지의 시간 등 개발과 배포 사이의 단계를 상세하게 나누어 추적하면 더욱 유익한 분석을 얻을 수 있음

### 안정성 지표 (Stability Metrics)
- 변경 실패율 (Change failure rate)
  - 운영 배포 이후에 버그가 발생한 비율을 나타냅니다.
  - 변경 실패율이 높다면 더 꼼꼼한 코드 리뷰나, 배포 과정에서 자동화된 테스트가 필요할 수 있음
  - 서비스 복원 시간 (Mean time to recovery)
- 버그가 발생한 뒤 서비스가 완전히 복원될 때까지 걸린 평균 시간
  - 서비스 복원 시간을 줄이기 위해선 하나의 오류가 다른 기능에 주는 영향을 줄여야 하고, 코드를 작성한 사람이 아닌 다른 개발자도 버그를 복원할 수 있도록 상세한 문서화가 필요할 수 있음
  - 상세한 모니터링 정보를 남겨 버그가 어느 코드에서 일어났는지 빠르게 파악할 수 있어야 함

#### 참고
[개발-운영 생산성 모니터링하기 (with Devlake, Grafana)](https://tech.inflab.com/20240221-dora-metric-with-devlake/)