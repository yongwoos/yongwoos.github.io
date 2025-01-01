---
title: Nginx-Gitlab-Jenkins 설치
weight: 15
---
Gitlab 디스플레이 없이 설정 시 `sudo systemctl get-default` 옵션을 multi-level로 설정해야 함. `sudo systemctl set-default multi-user.target` 으로 변경
Gitlab-CE 버전 설치 시 기본포트가 80, Jenkins는 기본포트 8080. Jenkins 기본포트와 puma 기본포트 충돌이 일어나므로 Jenkins 포트 변경 필요.

## Gitlab 설치
Gitlab-CE 버전을 Gitlab 사이트에 따라 설치. external_url은 git clone 시 설정되는 주소. 기본포트는 80번. Gitlab과 같이 설치되는 puma가 8080포트 사용하므로 주의.

## Jenkins 설치
사이트의 instruction을 따라 젠킨스와 OpenJDK 설치 후 JAVA_HOME 환경변수를 설정해야 함.
Jenkins는 포트변경시 세개의 설정파일에서 변경해야 변경이 됨.

## Jenkins와 Gitlab을 nginx 뒤에 설정
아래는 Nginx를 리버스 프록시로 설정하여 `gitlab.domain.org`와 `jenkins.domain.org`를 각각 GitLab과 Jenkins로 프록시하는 구성입니다. GitLab은 9091 포트에서, Jenkins는 9090 포트에서 실행됩니다.

---
## Nginx를 리버스 프록시로 이용
### 1. **DNS 설정**
AWS Route53에서 각각의 도메인 이름을 Nginx 서버 IP 주소와 매핑한다.

DNS에서 아래 두 개의 A 레코드 또는 CNAME 레코드를 설정해야 합니다:
- `gitlab.domain.org` → Nginx 서버 IP 주소
- `jenkins.domain.org` → Nginx 서버 IP 주소

---

### 2. **GitLab과 Jenkins 설정**

#### GitLab
GitLab이 9091 포트에서 동작하도록 설정:
1. `gitlab.rb` 파일을 수정:
   ```bash
   sudo vi /etc/gitlab/gitlab.rb
   ```
   ```ruby
   external_url "http://gitlab.domain.org"
   ```
2. GitLab의 내부 포트를 변경:
   ```ruby
   nginx['listen_port'] = 9091
   nginx['listen_https'] = false
   ```
3. 설정 적용:
   ```bash
   sudo gitlab-ctl reconfigure
   ```

#### Jenkins
Jenkins가 9090 포트에서 실행 중인지 확인:
```bash
java -jar jenkins.war --httpPort=9090
```

---

### 3. **Nginx 설치 및 리버스 프록시 설정**
1. **Nginx 설치**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Nginx 설정 파일 작성**
   새로운 Nginx 설정 파일을 생성:
   ```bash
   sudo vi /etc/nginx/sites-available/gitlab-jenkins
   ```
   아래와 같이 작성:
   ```nginx
   server {
       listen 80;
       server_name gitlab.domain.org;

       location / {
           proxy_pass http://127.0.0.1:9091; # GitLab 내부 주소
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }

   server {
       listen 80;
       server_name jenkins.domain.org;

       location / {
           proxy_pass http://127.0.0.1:9090; # Jenkins 내부 주소
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **설정 활성화**
   ```bash
   sudo ln -s /etc/nginx/sites-available/gitlab-jenkins /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### 4. **HTTPS 설정 (권장)**
Let's Encrypt를 사용하여 HTTPS를 설정:
1. **Certbot 설치**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **SSL 인증서 발급**
   ```bash
   sudo certbot --nginx -d gitlab.domain.org -d jenkins.domain.org
   ```

3. **자동 갱신 확인**
   ```bash
   sudo certbot renew --dry-run
   ```

---

### 5. **테스트**
1. 브라우저에서 `http://gitlab.domain.org` 또는 `https://gitlab.domain.org`를 입력하여 GitLab UI에 접근.
2. 브라우저에서 `http://jenkins.domain.org` 또는 `https://jenkins.domain.org`를 입력하여 Jenkins UI에 접근.
3. Git 작업 테스트:
   - `git clone https://gitlab.domain.org/namespace/repo.git`
   - `git push`
   - `git pull`

---

### 추가 설정 및 고려사항

#### 1. **방화벽**
- Nginx 서버에서 HTTP/HTTPS 트래픽을 허용:
   ```bash
   sudo ufw allow 'Nginx Full'
   ```

#### 2. **Nginx 시간 초과 설정**
- 대형 리포지토리를 Push 또는 Clone할 때 시간 초과 문제가 발생할 경우, 시간을 연장:
   ```nginx
   proxy_read_timeout 300;
   proxy_connect_timeout 300;
   proxy_send_timeout 300;
   ```

#### 3. **포트 관리**
- GitLab과 Jenkins는 내부적으로만 9091, 9090 포트를 사용하며, 외부 사용자는 Nginx를 통해 80/443 포트로 접근합니다.

이 설정을 통해 `gitlab.domain.org`와 `jenkins.domain.org`가 각각 9091, 9090 포트로 프록시 되어 동작합니다.