---
title: Shield
---
## 1. **AWS Shield Standard**
* **목적**: 기본적인 DDoS 공격 방어.
* **특징**
    * 모든 AWS 고객에게 무료 제공.
    * 네트워크 및 전송 계층 공격(L3/L4) 자동 완화.
    * CloudFront, Route 53, ELB 등 AWS 서비스와 통합.
* **예시**: SYN Flood, UDP Reflection 공격 방어.

## 2. **AWS Shield Advanced**
* **목적**: 고급 DDoS 공격 방어 및 추가 보호 기능 제공
* **특징**
    * 유료 서비스 (월별 요금 및 데이터 전송 요금).
    * L3/L4 공격뿐만 아니라 일부 L7 공격도 완화.
    * DDoS 비용 보호 (DDoS로 인한 AWS 사용량 급증 시 비용 보호).
    * 24/7 DDoS 대응 팀 (DRT) 지원.
    * 상세한 공격 보고서 및 분석 제공.
* **예시**: 대규모 DDoS 공격, 복잡한 애플리케이션 계층 공격 방어.