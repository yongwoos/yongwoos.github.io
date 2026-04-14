---
title: SNMP
---
## SNMP(Simple Network Management Protocol)의 주요 구성 요소
SNMP는 네트워크 관리자(Manager)와 관리 대상(Agent) 사이의 통신을 위해 다음 세 가지 핵심 요소로 구성됩니다.

SNMP 매니저 (Manager): 관리 시스템 역할을 하며, 에이전트에게 정보를 요청하거나 설정을 변경하는 명령을 내립니다.

SNMP 에이전트 (Agent): 라우터, 스위치, 서버 등 관리 대상 장비 내에 상주하는 소프트웨어 모듈입니다. 장치의 상태 정보를 수집하고 매니저의 요청에 응답합니다. 

MIB (Management Information Base): 매니저와 에이전트가 주고받는 관리 정보의 집합체(데이터베이스)입니다. 계층적인 트리 구조로 되어 있습니다.