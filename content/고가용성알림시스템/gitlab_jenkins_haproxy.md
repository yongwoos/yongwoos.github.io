---
title: HAProxy로 gitlab, jenkins 포워딩 하기
weight: 3
---
HAproxy가 nginx보다 훨씐 빠름.

haproxy나 nginx를 사용하면 80번 포트를 다른 포트로 포워딩 해주므로 공유기 포트포워딩에 80번도 필요.

즉 80번으로 오는 포트를 jenkins 9090, gitlab 9091로 포워딩해주고 있다면 80, 9090, 9091 전부 공유기에서 포트포워딩이 필요함.

harbor는 왜인지 9092로 haproxy로 포워딩 하게 되면 http 로그인이 안됨.

다음코드로 haproxy를 설정 `sudo nano /etc/haproxy/haproxy.cfg`
```{filename="/etc/haproxy/haproxy.cfg"}
# 프론트엔드 설정 (HTTP 요청을 받는 부분)
frontend http_front
    bind *:80  # 80 포트에서 요청을 받음

    # 도메인에 따른 라우팅
    acl is_jenkins hdr(host) -i jenkins.dragonhailstone.org
    acl is_gitlab hdr(host) -i gitlab.dragonhailstone.org

    # 도메인에 맞는 백엔드로 요청을 포워딩
    use_backend jenkins_backend if is_jenkins
    use_backend gitlab_backend if is_gitlab

# 백엔드 설정: Jenkins (9090 포트)
backend jenkins_backend
    server jenkins1 127.0.0.1:9090

# 백엔드 설정: GitLab (9091 포트)
backend gitlab_backend
    server gitlab1 127.0.0.1:9091
```

`sudo systemctl restart haproxy`