---
title: Istio
cascade:
  type: docs
weight: 3
sidebar:
  open: true
---
- Udemy의 istio 강의 및 istio 관련 지식 정리

- minikube 와 eksctl 이 둘 다 깔려있어 충돌이 일어날 경우
  - 작업관리자에서 vmms.exe. 찾기 > PID 번호 복사
```
taskkill /F /PID <PID_NUMBER>

minikube delete --purge
```