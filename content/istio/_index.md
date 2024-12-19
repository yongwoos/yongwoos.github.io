---
title: Istio
cascade:
  type: docs
weight: 4
---
- minikube 와 eksctl 이 둘 다 깔려있어 충돌이 일어날 경우
  - 작업관리자에서 vmms.exe. 찾기 > PID 번호 복사
```
taskkill /F /PID <PID_NUMBER>

minikube delete --purge

eksctl config get-current
```