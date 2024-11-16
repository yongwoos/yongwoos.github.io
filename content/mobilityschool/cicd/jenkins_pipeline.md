---
title: Jenkins Pipeline
weight: 2
---
## 1.Spring Boot Project Pipeline
- Spring Boot Project 를 생성하고 Git Hub 과 연동(JDK 17이상)
  - Dev Tools, Lombok, Springweb 선택
```
Web Project
- Entity: DB사용을 위한 Domain Class(model)
- Repository: DB 연동 => Test Library 이용 JUnit 등
- Service: Business Logic => Test Library 이용 JUnit 등
- Controller: 사용자의 요청과 Service 연결 => Selenium 등
```

### 1)체크 아웃: SCM으로부터 코드를 내려받는 동작
- git remote 사이트부터 내려받을 때는 git url: 'URL입력', branch: '브랜치이름'
- New Item을 선택해서 이름을 결정하고 Pipeline을 선택
  - script만 작성
```
pipeline{
    agent any
    stages{
        stage("checkout"){
            steps{
                 git url: "https://github.com/dragonhail/JenkinsPipeline.git", branch: "main"
            }
        }
    }
}
```

### 2)코드를 작성하고 로컬에서 단위 테스트
- 단위 테스트를 하기 위해서 build.gradle 파일의 dependencies 항목에 JUnit 라이브러리의 의존성을 추가하고 Rebuild를 수행해서 의존성 라이브러리를 다운로드 받아서 프로젝트에 반영
```{filename="build.gradle"}
    testImplementation 'junit:junit:4.13.2'
```
- 테스트 클래스 생성: src/test 디렉토리에 생성 - CalculatorTest
```java {filename="CalculatorTest.java"}
package com.gmail.dragonhailstone.jenkinspipeline;

import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;

public class CalculatorTest {
    private Calculator calculator = new Calculator();

    @Test
    public void testSum(){
        assertEquals(Integer.valueOf(5), calculator.sum(2, 3));
    }
}
```
- 테스트 수행: `./gradlew test`
  - 현재 상태는 에러
- Calculator 클래스를 구현
```java {filename="Calculator.java"}
package com.gmail.dragonhailstone.jenkinspipeline;

import org.springframework.stereotype.Service;

@Service
public class Calculator {
    public Integer sum(Integer a, Integer b) {
        return a + b;
    }
}
```
- 테스트 수행: `./gradlew test`
  - 테스트 성공
  <br>
- Controller 클래스를 생성: CalculatorController
```java {filename="CalculatorController.java"}
package com.gmail.dragonhailstone.jenkinspipeline;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CalculatorController {
    private final Calculator calculator;

    @RequestMapping("/")
    String sum(@RequestParam("a") Integer a, @RequestParam("b") Integer b) {
        return String.valueOf(calculator.sum(a, b));
    }
}
```
- 실행(./gradlew bootRun) 하고 브라우저에서 확인 http://localhost:8080/?a=10&b=7
- 코드를 푸시

### 3)Jenkins 에서 컴파일 과 테스트
- script에 3개의 stage를 추가하고 빌드를 수행
```
        stage("permission"){
            steps{
                 sh "chmod +x ./gradlew"
            }
        }
        stage("compile"){
            steps{
                 sh "./gradlew compileJava"
            }
        }
        stage("test"){
            steps{
                 sh "./gradlew test"
            }
        }
```

### 4)Code Coverage
- 코드 전체를 대상으로 테스트를 진행하고 검증이 완료된 부분을 식별하는 것
- 코드를 업데이트 할 때 필수 항목
- 로컬에서 코드 커버리지 수행
  - 코드 커버리지 도구를 build.gradle의 plugins 항목에 'id jacoco'와 아래 항목 추가하고 빌드를 다시 수행   
  ```
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
  - 보고서 발행   
    `./gradlew test jacocoTestReport`
  - 코드 푸시
  - 파이프라인에 스테이지로 추가
  ```
          stage("test coverage"){
              steps{
                  sh "./gradlew test jacocoTestCoverageVerification"
                  sh "./gradlew test jacocoTestReport"
              }
          }
  ```
### 5)정적 코드 분석
- 코드의 품질을 검사하는 과정
- 코드를 읽기 쉽고 유지보수하기 좋도록 만드는 것을 보증
- checkstyle 이나 findbug, PMD 등을 주로 이용
- checkstyle 활용
  - Document: https://checkstyle.sourceforge.io/config.html
  - build.gradle 파일의 plugins에 checkstyle 추가   
    `id 'checkstyle'` 
  - naver의 체크 스타일 환경 설정 샘플   
    https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-checkstyle-rules.xml
  - 환경 설정: config/checkstyle/checkstyle.xml 파일로 설정
```
<?xml version="1.0" ?>

<!DOCTYPE module PUBLIC
       "-//Puppy Crawl//DTD Check Configuration 1.3//EN"
       "http://www.puppycrawl.com/dtds/configuration_1_3.dtd">

<module name="Checker">
   <module name="TreeMaker">
       <module name="ConstantName" />
   </module>
</module>
```
  - 로컬에서 수행   
  `./gradlew checkstyleMain`

## 2.트리거 와 알림
### 트리거
- 빌드를 자동으로 시작하는 동작을 파이프라인 트리거라고 합니다.
- 트리거의 유형
  - 외부 트리거
  - 폴링 SCM 트리거
  - 스케쥴 빌드 트리거

- 외부 트리거
  - 노티파이어가 호출되면 젠킨스가 빌드를 시작하는 방식
  - 노티파이어의 역할을 할 수 있는 것은 다른 파이프라인 빌드나 SCM 시스템의 원격 스크립트

깃허브 - 트리거 > 젠킨스

- 깃허브를 이용해서 젠킨스에 트리거
  - 젠킨스에 깃허브 플러그인을 설치
  - 젠킨스용 비밀키를 생성
  - 깃허브 webhook을 설정하고 젠킨스의 주소 와 키를 지정
- 폴링 SCM 트리거
  - 젠킨스가 주기적으로 SCM을 호출하고 레포지토리에 푸시가 발생했는지를 체크가 빌드를 다시 하는 방식
  - 유용한 경우   
    젠킨스가 SCM에서 접속할 수 없는 방화벽 네트워크 안에 있는 경우

    빌드 시간이 길고 커밋이 자주 발생해서 서버에 과부하가 초래되는 경우
- 프로젝트에 jenkinsfile을 생성
```{filename="Jenkinsfile"}
pipeline{
   agent any
   stages{
       stage("permission"){
           steps{
                sh "chmod +x ./gradlew"
           }
       }
       stage("compile"){
           steps{
                sh "./gradlew compileJava"
           }
       }
       stage("test"){
           steps{
                sh "./gradlew test"
           }
       }
       stage("test coverage"){
           steps{
                sh "./gradlew test jacocoTestCoverageVerification"
                sh "./gradlew test jacocoTestReport"
           }
       }
   }
}
```
  - Jenkins에 접속해서 SCM에서 GIT을 선택하고 URL을 설정

  - 빌드를 해서 빌드가 제대로 수행되는지 확인
- Polling SCM 설정
  - 구성에서 PollSCM을 체크
  - 스케줄을 입력   
    분 시간 일 월 요일   
  - `33 * * * *` 을 설정하면 매시 33분에 수행하는데 commit이 동일하면 수행하지 않고 동일하지 않으면 수행
- Build periodically 옵션
  - 설정 방법은 Polling SCM과 동일
  - 변경된 내용이 없어도 무조건 Build를 다시 수행
  - 커밋 파이프라인에서는 거의 사용하지 않고 밤에 실행되는 복잡한 통합 테스트에 사용
### Push가 발생했을 때 build
- git hub에서 token 발급
  - 이 토큰을 Jenkins에 등록을 해서 연동

- Jenkins 와 Git Hub 연결
  - Dashboard 화면에서 Jenkins 관리를 클릭
  - System을 클릭하고 화면을 하단으로 스크롤하면 Git Hub 항목이 보이는데 Add GitHub Server를 눌러서 GitHub Server를 선택하고 이름을 설정한 후 
  - Dashboard의 빌드 클릭 후 Configure > Build Triggers > GitHub hook trigger for GITScm polling 을 선택
  - Configure > Pipeline에서 Pipeline script from SCM설정, SCM은 Git, Repositories에 값 입력하고 Credential 에서  Add > Jenkins를 선택
  - Add > Jenkins 선택 후 Domain은 그대로 두고 Kind를 Secret text로 변경한 후 ID에는 토큰 이름을 지정하고 Secret에는 토큰 값을 설정하고 Add를 클릭한 후 Test Connection을 수행
  - 또는 Kind를 Username with password로 설정 후 github username과 토큰을 입력

### 트리거 생성 옵션
- Build periodically: 주기적으로 무조건 Build

- GitHub hook trigger for GITScm polling: GitHub의 브랜치에 push가 발생했을 때 수행되는데 Credential을 설정해야 합니다.

- Poll SCM: Jenkins가 Poll방식으로 주기적으로 빌드를 하는데 변경 내역이 있어야만 빌드를 다시 수행합니다.

## 3.알림
### 개요
- 젠킨스에서는 다양한 방식으로 빌드 상태를 알려줄 수 있음
- 기본은 email 이지만 플러그인을 설치하면 다른 방식으로 알림을 보낼 수 있습니다.

### email 을 전송
- SMTP 서버를 확보하고 설정에 추가
- script에서 mail to 명령으로 전송을 합니다.

## 4.팀 단위 개발 전략
### 개발 워크플로우
- 트렁크 기반 워크플로우
  - 트렁크 또는 마스터라고 불리는 하나의 중앙 레포지토리에 프로젝트의 모든 변경 사항이 저장되는 구조 
  - 모든 팀원들은 중앙 레포지토리를 복제해서 자신의 컴퓨터에 로컬 복사본을 만들어서 사용
  - 변경된 내용은 중앙 레포지토리로 직접 커밋
- 브랜치 워크플로우
  - 코드를 각기 다른 브랜치에 저장
  - 개발자가 신규 기능을 개발하는 경우 트렁크에서 분기된 전용 브랜치를 생성하고 그 브랜치에 기능 구현과 관련된 모든 변경 사항을 저장
  - 메인 코드를 건드리지 않고 기능 개발이 가능
- 포크 워크플로우
  - 오픈 소스 커뮤니티에서 사용
  - 각 개발자는 각자의 서버 레포지토리를 갖는 구조

## 5.자동 인수 테스트
### 1.인수 테스트
- 요구 사항 대로 기능이 구현되었는지 확인하는 과정
- 여기에서 테스트는 전체 시스템을 사용자 관점에서 시험하는 블랙박스 테스트를 포함
- 인수 테스트 자동화가 어려운 이유
  - 사용자가 참여: 테스트를 만들 때 사용자와 함께 작성   
  - 의존성 통합: 시스템이 전체적으로 잘 동작하는지를 확인해야 하기 때문에 테스트할 애플리케이션은 모든 의존성을 포함해서 실행해야 함   
  - 스테이징 환경: 기능 및 비기능 테스트를 확실히 수행하고자 하면 스테이징 환경이 프로덕션 환경과 일치해야 함   
  - 애플리케이션의 동일성: 애플리케이션은 한 번만 빌드해야 하고 프로덕션에서도 동일한 바이너리를 사용해야 함   
  도커 이미지를 만들어서 배포   
  실행 환경이 달라서 발생할 수 있는 문제를 제거해야 하기 때문   
  - 릴리즈 준비: 애플리케이션이 인수 테스트를 통과하면 사용자에게 바로 제공할 수 있도록 준비가 되어야 함

### 2.도커 레지스트리
- 도커 레지스트리는 도커 이미지 저장소로 도커 이미지를 push 하거나 pull 할 수 있는 서버 애플리케이션
- 도커 허브는 클라우드 기반의 공식 도커 레지스트리
- 애플리케이션을 개발하는 곳에서는 별도의 서버를 만들어서 소프트웨어 패키지를 저장하고 불러오거나 검색할 수 있도록 하는데 이를 소프트웨어 레포지토리 또는 아티팩트 레포지토리라고 함
- 애플리케이션을 배포하는 곳에서 별도의 레포지토리를 만드는 이유
  - 파일 크기
  - 버전 관리
  - 리비전 매핑: 산출물 과 바이너리가 정확히 매핑
  - 패키징: 산출물은 압축된 형식으로 저장
  - 접근 제어: 소스 코드에 직접 접근할 수 있는 사용자와 바이너리에 접근할 수 있는 사용자를 구분하는 것이 가능
- 도커 레지스트리 사용
  - 클라우드 방식의 도커 레지스트리
  ```
  Docker Hub
    
  Docker Hub 대체 서비스   
    AWS의 ECR   
    GCP의 Artifact Registry   
    Azure의 Container Registry

    Gitlab의 Container Registry
  ```
  - 자체 호스팅 방식의 도커 레지스트리   
    사내 네트워크가 아닌 외부에 소프트웨어를 보관하는 것을 금지하는 경우에 사용
```
Docker, Helm: Registry안에 Repository

개발: Central Repository안에 Package

# 고객한테 줄 때
Artifact Repository
- Package: Docker Image
- 부산물
```
### 3.도커 레지스트리 구축
- 도커 레지스트리 애플리케이션을 설치
  - 레지스트리 시작:   
    `docker run -d -p 5000:5000 --restart=always --name registry registry`

- 도메인 인증서 추가
  - CA(인증 기관)에서 서명한 인증서를 사용하는 것을 권장
  - 위의 경우가 어렵다면 자체 서명 인증서 발행   
    https://docs.docker.com/registry/insecure/#using-self-signed-certificates
  - 인증서를 발급받은 경우 registry 실행: 인증서 파일(domain.crt와 domain.key 파일)을 컨테이너의 certs 디렉터리로 이동한 후 수행   
  `docker run -d -p 5000:5000 --restart=always --name registry -v 'pwd'/certs:/certs -e REGISTRY_HTTP_ADDR=0.0.0.0:443 -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key registry
  `

### 4.Spring Boot 프로젝트 도커이미지 생성
- 프로젝트를 빌드: 실행 가능한 파일을 생성   
  `./gradlew clean build`
  - 빌드에 성공을 하면 build/libs에 실행 파일이 프로젝트이름-0.0.1-SNAPSHOT.jar 라는 이름으로 만들어짐
- Dockerfile을 루트 디렉토리에 생성하고 작성
```Dockerfile
FROM bellsoft/liberica-openjdk-alpine:17

CMD {"./gradlew", "clean", "build"}

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```
- Docker Build를 수행   
`docker build -t jenkinspipeline .`

- 이미지 확인   
`docker images`

- Jenkinsfile에 stage 추가
```
        stage("Gradle Build"){
            steps{
              sh "./gradlew clean build"
            }
        }

        stage("Docker Build"){
            steps{
                sh "docker build -t jenkinspipeline ."
            }
        }
```
### 5.이미지를 레지스트리로 푸시
- 이미지를 레지스트리로 푸시를 하고자 하는 경우 레지스트리이름/이미지이름:태그 형태로 만들어 져야 함
- 로그인을 요구하는 레지스트리라면 Credential을 추가해야 함
- 직접 구축한 레지스트리를 사용하고자 하는 경우에는 daemon.json 파일에 레지스트리를 추가
```json {filename="daemon.json"}
{
    "insecure-registries": ["52.78.78.187:5000"],
    "debug": true,
    "experimental": false
}
```
- 이미지이름 규칙
```
# Docker Hub에 Push할 경우 이미지 이름: DockerHub계정명/이름
docker build -t dragonhailstone/jenkinsfile .

# Docker Registry에 Push 할 경우 이미지 이름: 프라이빗레지스트리publicIP:포트/이름
docker build -t 52.78.78.187:5000/jenkinsfile .
```