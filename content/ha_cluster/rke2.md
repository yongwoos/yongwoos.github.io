---
title: RKE2 설치
weight: 2
---
## RKE2 설치하기
- https://docs.rke2.io/install/quickstart 참조

```bash
sudo su -

curl -sfL https://get.rke2.io | sh -

systemctl enable rke2-server.service

systemctl start rke2-server.service
```
- 환경변수 추가
```bash
export PATH=$PATH:/var/lib/rancher/rke2/bin

echo 'export PATH=$PATH:/var/lib/rancher/rke2/bin' >> ~/.bashrc
source ~/.bashrc
```
