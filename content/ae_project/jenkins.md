---
title: Jenkins 설정 파일
weight: 4
---
### jenkins 설정파일 위치:
```
/lib/systemd/system/jenkins.service
/etc/default/jenkins
/etc/init.d/jenkins
/usr/lib/systemd/system/jenkins.service
```

### Jenkins docker push
- jenkins가 docker에 접속할 수 있어야 함
```
sudo usermod -a -G docker jenkins
newgrp docker
sudo service jenkins restart
```