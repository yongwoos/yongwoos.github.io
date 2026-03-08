---
title: Jenkins Pipeline & Test
weight: 3
---
### 테스트 순서
```
java->compile->class 파일: Unit Test
->build->binary 파일: 통합테스트
->docker image: 인수테스트
```

## 1.프로젝트 와 Jenkins 연결 - git hub
### 1)Spring Boot Project 생성

### 2)git hub 에 repository를 만들어서 연결

### 3)Jenkins Server에서 Code Checkout(코드를 다운로드 받아 오는 것)
- 하나는 직접 스크립트를 작성해서 받아올 수 있고 다른 하나는 git 과 연결해서 코드를 받아올 수 있습니다.

- Item을 Pipeline으로 생성하고 Script 부분에서 SCM으로 수정하고 repository를 설정
  - 이 상태에서 빌드를 하면 Jenkinsfile이 없다고 에러가 발생
  - 프로젝트에 Jenkinsfile을 추가하고 빌드

## 2.테스트
### 1)테스트 하기 전에 컴파일(운영체제나 VM이 인식할 수 있는 코드 생성 - 테스트하기 위해서 수행) 이나 빌드(실행 가능한 코드를 생성 - 배포하기 전에 수행)가 먼저

- 단위 테스트를 수행하기 위한 src의 java에 코드를 추가
```java {filename="JenkinsService.java"}
public class JenkinsService {
   public int  hap(int n){
       int result = 0;
       for(int i=1; i<=n; i++){
           result += i;
       }
       return result;
   }
}
```
- 스크립트 파일에 추가: 에러가 발생하면 문법 에러 나 접근 권한에 관련된 에러
  - 윈도우즈는 읽기 와 쓰기 권한만 부여하는데 Mac 이나 Linux는 실행 권한이 별도로 주어집니다.
  - 윈도우즈에서 작성할 실행 파일은 Mac 이나 Linux에서 가져가서 실행하고자 하면 실행권한 오류가 발생합니다.
```
pipeline{
   agent any
   stages{
       stage("Permission"){
           steps{
               sh "chmod +x ./gradlew"
           }
       }

       stage("Compile"){
           steps{
               sh "./gradlew compileJava"
           }
       }
   }
}
```
- 단위 테스트를 위한 코드를 작성: test 디렉토리의 패키지에 클래스를 생성
```java {filename="JenkinsTest"}
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class JenkinsTest {

   //테스트할 메서드를 가진 클래스를 가져오기
   private JenkinsService service = new JenkinsService();

   @Test
   public void testService(){
       assertEquals(55, service.hap(10));
   }
}
```
- 테스트 수행
`./gladlew test`

- 스크립트에 스테이지 추가
```
stage("Unit Test"){
   steps{
       sh "./gradlew test"
   }
}
```
### 2)Code Coverage
- 개요
  - 코드 전체를 대상으로 테스트를 진행하고 검증이 완료된 부분을 식별하는 작업
  - 일정 부분 테스트를 진행하지 않은 경우 빌드를 중단합니다.

- build.gradle 파일에 의존성을 설정하고 기본 설정을 추가: 20% 이상 코드를 테스트하지 않은 경우 빌드 실패패
```
plugins {
   id 'java'
   id 'org.springframework.boot' version '3.3.5'
   id 'io.spring.dependency-management' version '1.1.6'
  
   id 'jacoco'
}

jacocoTestCoverageVerification{
   violationRules{
       rule{
           limit{
               minimum = 0.2
           }
       }
   }
}
```
- 수행
`./gradlew test jacocoTestCoverageVerification`

- 보고서 생성(build/reports 디렉토리에 생성)
`./gradlew test jacocoTestReport`

- 스테이지에 추가
```
stage("Code Coverage"){
steps{
   sh "./gradlew jacocoTestCoverageVerification"
   sh "./gradlew jacocoTestReport"
   publishHTML(target: [
   reportDir: 'build/reports/jacoco/test/html',
   reportFiles: 'index.html',
   reportName: 'Jacoco Report'
   ])
}
}
```
- HTML Publisher 플러그인을 설치하고 수행
- 성공하면 프로젝트 이름을 누르면 HTML 링크가 보여집니다.

### 3)정적 코드 분석
- 개요
  - 컴파일이나 실행과는 관련없는 코드를 작성할 때 서로 간에 암묵적으로 정한 규칙을 확인하는 작업
  - Checkstyle 인 Sonarqube를 많이 이용

- Checkstyle 을 이용한 정적 코드 분석
  - build.gradle 파일에 의존성 라이브러리 와 기본 환경 코드를 추가
```
plugins {
   id 'java'
   id 'org.springframework.boot' version '3.3.5'
   id 'io.spring.dependency-management' version '1.1.6'

   id 'jacoco'
   id 'checkstyle'
}

checkstyle {
   maxWarnings = 0
   configFile = file("${rootDir}/config/checkstyle.xml")
   configProperties = ["suppressionFile":"${rootDir}/config/checkstyle-suppressions.xml"]
   toolVersion = "8.42"
}
```
- 루트디렉토리에 config 디렉토리를 생성하고 checkstyle.xml 파일을 만들어서 작성: https://checkstyle.sourceforge.io/config.html 에서 파일을 다운로드 받아서 참고해서 작성
```xml {filename="checkstyle.xml"}
<?xml version="1.0" ?>
<!DOCTYPE module PUBLIC
       "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
       "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
   <module name="TreeWalker">
       <module name="ConstantName" />
   </module>
</module>
```
- 실행: ./gradlew checkstyleMain


- 스테이지에 추가
```
stage("Static Code Analysis"){
  steps{
      sh "./gradlew checkstyleMain"
          publishHTML(target: [
                      reportDir: 'build/reports/checkstyle/',
                      reportFiles: 'main.html',
                      reportName: 'Checkstyle Report'
          ])
  }
}
```
- checksyle 보다 sonarqube가 더 많이 사용되므로 sonarqube로 사용을 해보는 것이 좋습니다.

## 3.트리거
### 1)주기적인 수행: 스케쥴 작성 방법은 Linux 의 Crontab 과 동일
- Build periodically: commit 여부에 상관없이 무조건 빌드를 다시 수행
- Poll SCM: 변경 사항이 있을 때만 빌드를 다시 수행

### 2)Webhook: 외부에서 Code Repository에 이벤트가 발생했을 때 수행
- git hub에서 token 을 발급: 레포지토리에 대한 권한 과 workflow에 대한 권한은 반드시 설정

- git hub의 레포지토리에서 web-hook을 등록
- payload-url 설정: http://젠킨스URL/github-webhook/

- jenkins server에서 credential 을 생성
- Dash board 메뉴에서 젠킨스 관리 > credentials을 선택하고 Stores scoped to Jenkins > global 부분을 클릭해서 생성
- kind 부분을 secret text로 수정을 하고 password 부분에 토큰 값을 대입

- Dash Board > 특정 파이프라인 선택 > 구성 클릭해서 액션을 수정
- GitHub hook trigger for GITScm polling 에 체크

## 4.이미지 빌드 및 업로드
### 1)코드를 수정
- Service 클래스를 수정
```java {filename="JenkinsService.java"}
import org.springframework.stereotype.Service;

@Service
public class JenkinsService {

   public int  hap(int n){
       int result = 0;
       for(int i=1; i<=n; i++){
           result += i;
       }
       return result;
   }
}
```
- Controller 클래스를 추가
```java {filename="JenkinsController.java"}
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class JenkinsController {
   private final JenkinsService jenkinsService;

  
   @RequestMapping("/")
   public String index(@RequestParam("data") int data) {
       return String.valueOf(jenkinsService.hap(data));
   }
}
```
### 2)실행하고 테스트
- http://localhost:8080?data=10

### 3)gradle 프로젝트 빌드
- 빌드는 실행 가능한 상태로 만들어주는 작업
- 빌드 도구에 따라 빌드하는 명령어는 다름
  - gradle의 경우: `./gradlew clean build`

- 빌드 결과는 build 라는 디렉토리에 저장: 실행할 애플리케이션이 build 디렉토리에 존재

### 4)이미지 빌드
- Dockerfile 을 프로젝트 디렉토리에 생성하고 작성
```Dockerfile
FROM bellsoft/liberica-openjdk-alpine:17

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

- 이미지 빌드   
```
docker build -t 이미지이름 .
docker build -t jenkinspipeline2 .
```

### 5)빌드 내용을 stage에 추가
- Gradle Build: Jenkinsfile에 추가하고 push
```
stage("Gradle Build"){
  steps{
      sh "./gradlew clean build"
  }
}
```

- Docker Image Build
  - Jenkins Docker plugin 설치
  - Jenkins 노드에서 권한 부여
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```
```
stage("Docker Image Build"){
  steps{
      sh "docker build -t jenkinspipeline2 ."
  }
}
```
- Docker Image Build 단계에서 실패하면 Jenkins 에서 Docker를 사용할 때는 Docker Plugin을 설치해야 합니다.

### 6)컨테이너로 생성해서 테스트
- 컨테이너 생성   
```
docker run -d --name 컨테이너이름 -p 외부포트번호:내부포트번호 이미지이름
docker run -d --name jenkinspipeline2 -p 8080:8080 jenkinspipeline2
```

- 확인   
`curl http://localhost:외부포트번호?data=정수`

### 7)도커 허브에 push
- 도커 허브에 레포지토리를 생성
  - 레포지토리: dragonhailstone -> jenkinspipeline2
  - 도커 허브 토큰 발급

- 도커 허브의 레포지토리에 업로드 할 수 있게 도커 이미지 태그를 변경   
`docker tag 이미지이름 dragonhailstone/jenkinspipeline2:latest`
- 도커 허브에 로그인   
`docker login`
- 도커 푸시   
```
docker push 이미지이름
docker push dragonhailstone/jenkinspipeline2:latest
```
- 이미지 빌드가 안되는 경우
  - Jenkins에 Docker 관련 Plugin 을 설치

- Jenkins에서 host docker 접근 권한 부여
```
groupadd -f docker
usermod -aG docker jenkins
chown root:docker /var/run/docker.sock
```

### HTTP로 Private Registry에 자동 Push
- /etc/docker/daemon.json에 아래 코드 추가
```{filename="/etc/docker/daemon.json"}
{
  "insecure-registries": ["3.36.131.51:5000"]
}
```
```
pipeline{
   agent any
    environment {
           DOCKER_CREDENTIALS_ID = 'jenkinspipeline2'  // Docker 레지스트리의 인증 정보 ID
           IMAGE_NAME = 'jenkinspipeline2'  // Docker 이미지 이름
           TAG = 'latest'  // 태그 설정
           REGISTRY_URL = '3.36.131.51:5000' // 레지스트리실행주소:포트
       }
   stages{
       stage("Permission"){
           steps{
               sh "chmod +x ./gradlew"
           }
       }
       stage("Compile"){
           steps{
               sh "./gradlew compileJava"
           }
       }
       stage("Unit Test"){
           steps{
               sh "./gradlew test"
            }
       }
       stage("Code Coverage"){
            steps{
                sh "./gradlew jacocoTestCoverageVerification"
                sh "./gradlew jacocoTestReport"
                publishHTML(target: [
                reportDir: 'build/reports/jacoco/test/html',
                reportFiles: 'index.html',
                reportName: 'Jacoco Report'
                ])
            }
       }
        stage("Gradle Build"){
              steps{
                  sh "./gradlew clean build"
              }
        }
        stage("Docker Image Build"){
              steps{
                  sh "docker build -t $REGISTRY_URL/$IMAGE_NAME:$TAG ."
              }
        }
stage('Push Docker Image') {
            steps {
                    // Docker 이미지를 EC2 Registry로 푸시
                    sh 'docker push $REGISTRY_URL/$IMAGE_NAME:$TAG'
            }
        }
    }
}
```
- 확인   
`curl http://localhost:5000/v2/jenkinspipeline2/tags/list`
```{filename="전체흐름"}
springboot 프로젝트 작성
단위테스트 테스트
코드커버리지 테스트
정적 테스트
도커파일 작성
젠킨스파일 작성 및 젠킨스 연결
git webhook 작성
도커허브 연결
```