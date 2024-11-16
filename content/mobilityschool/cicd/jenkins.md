---
title: Jenkins
weight: 1
---
## 1. Jenkins
### Jenkins 동작 확인
- Jenkins Server에 접속

- Dashboard 화면에서 New Item(새로운 Item)을 클릭한 후 작성
  - 이름을 설정
  - 종류는 Pipeline Project
  - 옵션은 일단 전부 넘어가고 Script 로 이동해서 작성
```
pipeline{
    agent any
    stages{
        stage("Hello"){
            steps{
                echo "Hello World"
            }
        }
    }
}
```
  - 작성을 다 한 후 Save 클릭
  - 지금 빌드(Build Now)를 클릭

## 2.Jenkins Architecture
### 고려 사항
- 일반적으로 파이프라인은 복잡
- 소스 코드를 다운로드 하고 컴파일을 수행하고 테스트를 실행하는 작업은 시간이 오래 걸리는 작업입니다.   
마이크로서비스로 구현된 경우는 여러 개의 파이프라인이 동시에 실현되기도 함

### 마스터와 에이전트
- 젠킨스를 사용하다 보면 과부하 상황이 종종 발생
- 젠킨슨는 빌드하는데 시간이 오래 걸림
- 커밋을 자주 하는 경우에는 젠킨스 인스턴스가 종종 죽는 경우가 발생
- 소규모 프로젝트가 아니라면 빌드 작업을 Agent(Slave) 인스턴스에 위임
- 젠킨스를 실행하는 마스터를 만들고 실제 작업을 수행하는 에이전트를 따로 두는 구조를 사용할 수 있음
```
트리거 ->	젠킨스 마스터  -> 알림
		(작업1, 작업2..)
            /          \
젠킨스 에이전트			젠킨스 에이전트
	실행자1				실행자2
```
- 젠킨스 마스터의 역할
  - 빌드 시작 명령을 받음: 깃허브 같은 곳에서 커밋이 발생
  - 알림을 보내기: 빌드가 실패하면 이메일이나 슬랙 메시지를 전송
  - 클라이언트와 통신을 하며 HTTP 요청을 처리
  - 에이전트에서 실행 중인 작업의 우선 순위 조정 등의 빌드 환경을 관리
- 에이전트를 만들 때 범용성을 갖춘 기기로 만드는 것이 좋지만 아주 특별한 경우는 특수한 프로젝트 전용으로 만들기도 합니다.

### 확장성
- 수직적 확장(Scale Up)
  - 마스터의 부하 증가에 대비해 마스터 시스템에 자원을 추가하는 방식
  - 신규 프로젝트가 생길 때마다 메모리나 CPU를 추가하거나 교체하고 하드 드라이브로 확장하는 형태
  - 매우 제한적인 해결책인듯 하지만 의외로 많이 사용
  - 유지보수 측면에서 효율적
  - 모든 작업을 한 곳에서만 수행하면 되기 때문

- 수평적 확장(Scale Out)
  - 프로젝트나 조직이 늘어날 때 마스터 인스턴스의 수량을 늘려나가는 방식
  - 단점   
    프로젝트 간의 통합 자동화가 어려움
  - 장점   
    마스터 역할을 수행하는 하드웨어가 고사양일 필요가 없음   
    팀 마다 각기 다른 설정이 가능   
    팀 별로 마스터 전용 인스턴스를 할당해서 팀워크와 업무 효율이 향상될 수 있음   
    인프라를 표준 인프라와 필수 인프라로 구분해서 구성하는 것도 가능   
    마스터 인스턴스 하나에 문제가 생겨도 다른 팀에 영향을 주지 않음

### 테스트 인스턴스/프로덕션 인스턴스
- 젠킨스 시스템은 고가용성이 중요한 시스템
- 프로덕션 인스턴스에서 테스트를 수행하면 안됨
- 실제 운영을 할 때는 테스트용과 프로덕션용을 분리해서 운영

### 샘플
- 젠킨스는 다수의 에이전트와 다수의 마스터로 구성해야 하고 테스트 및 프로덕션 환경으로 이중화 구성을 해야 함
- 넷플릭스에서는 빌드 마스터와 테스트 마스터를 구분하고 AWS와 자체 서버를 혼용해서 구현

### 에이전트 설정
- 통신 프로토콜
  - SSH   
    마스터에서 에이전트에 연결할 때 표준 SSH 프로토콜 사용   
    젠킨스에는 SSH 클라이언트가 내장되어 있기 때문에 에이전트에서 SSH Daemon(sshd) 서버를 구성하면 됨   
    표준 UNIX 메커니즘을 사용하기 때문에 가장 편리하고 안정적
  - Java Web Start   
    각 에이전트 머신에 자바 애플리케이션이 실행되고 마스터 자바 애플리케이션과 젠킨스 에이전트 애플리케이션 간의 TCP 연결이 이루어지는 구조   
    이 방식은 에이전트가 방화벽 네트워크 안에 있어 마스터와의 연결이 불가능할 경우에 주로 사용
- 에이전트 설정
  - 에이전트를 연결하는 방식은 상위 수준에서는 다양
  - 정적 또는 동적   
    정적은 마스터에 영구적으로 추가하는 것인데 이 방식의 단점은 에이전트 노드를 추가하거나 삭제할 때 마다 수작업을 수행

    동적은 에이전트를 필요할 때 마다 프로비저닝 하는 방식
  - 특정 목적 또는 범용   
    특정 목적(Java 11 버전용 프로젝트만 배포) 으로 운영할 수 있고 범용 목적으로 운영하는 것도 가능
- 에이전트 종류
  - 영구 에이전트
  - 영구 도커 호스트 에이전트
  - 젠킨스 스웜 에이전트
  - 동적 프로비저닝 도커 에이전트
  - 동적 프로비저닝 쿠버네티스 에이전트

## 3. Pipeline
### 개요
- 품질 점검이나 소프트웨어 인도와 같은 부분을 자동으로 수행하도록 하는 일련의 과정
- 파이프라인은 스크립트를 연결해서 작성
- 파이프라인을 사용했을 때 장점
  - 작업 그룹화   
    작업들은 stage라는 단위로 그룹화   
    stage로 프로세스에 구조를 부여하며 규칙을 명확하게 정의   
    stage가 실패하면 이후 스테이지는 실행되지 않음

  - 가시성   
    프로세스의 모든 요소를 시각화 할 수 있음   
    실패 원인을 빼르게 분석할 수 있으며 팀원들 간의 협업이 원할해짐

  - 피드백: 문제가 발생하면 즉시 팀원들이 알 수 있고 빠르게 대응할 수 있음

### 구조
- Stage와 Step으로 구성   
  트리거 -> Stage(step1, step2 ..) -> Stage(step1, step2,...)... -> 알림
- Step: 젠킨스가 수행할 것을 알려주는 단일 작업(코드 체크 아웃, 스크립트 실행 등)
- Stage: 여러 개의 스텝을 개념적으로 분리해 그룹화한 논리적 구분
- 여러 개의 stage를 갖는 스크립트 작성
```
pipeline{
    agent any
    stages{
        stage("First Stage"){
            steps{
                echo "Step1. Hello World"
            }
        }
        
        stage("Second Stage"){
            steps{
                echo "Step2. Hello World"
                echo "Step3. Hello World"
            }
        }
    }
}
```

### 젠킨스의 작업
- 작업을 만들 때 반드시 포함되어야 하는 지시 사항
  - 작업을 수행하는 시점(트리거)
  - 작업을 구성하는 단계별 태스크(빌드 스텝)
  - 태스크가 완료된 후 수행할 명령(포스트 빌드 액션)
- 젠킨스의 빌드
  - 작업의 특정 실행 버전
  - 젠킨스 작업을 여러 번 실행한 경우 실행할 때 마다 고유한 빌드 번호가 부여됩니다.
  - 작업 실행 중에 생성된 아티팩트, 콘솔 로그 등 특정 실행 버전과 관련된 모든 실행 정보가 해당 빌드 번호로 저장됩니다.
- 프리스타일 작업
  - 일반적인 형태의 빌드 작업
  - 테스트 실행 과 애플리케이션 빌드 및 패키징 그리고 보고서 전송 같은 작업을 수행할 수 있음
- 젠킨스의 작업 생성
  - 대시보드로 이동
  - 새로운 Item(New Item)을 클릭하고 이름을 설정하고 Freestyle을 선택한 후 OK 버튼 클릭
  - 작업 구성   
    Description: 작업에 대한 설명이나 목적(자바 라이브러리 프로젝트 컴파일)

- pipeline의 구문
```
pipeline {
    agent any // 에이전트 지정
    triggers { cron('* * * * *') } // 1분마다 수행
    options { timeout(time: 5) } // 5분 이상 실행되면 중단
    
    // 시작하기 전에 boolean형 파라미터를 요청
    parameters {
        booleanParam(name: 'DEBUG_BUILD', defaultValue: true,
        description: 'Is it the debug build')
    }
    
    stages{
        stage('Sample') {
            environment {NAME = 'RAFA'} // NAME이라는 환경 변수를 설정
            // DEBUG_BUILD가 true인 경우우
            when { expression { return params.DEBUG_BUILD } }
            steps {
                echo "Hello from $NAME"
                script {
                    def browsers = ['chrome', 'firefox']
                    for(int i=0; i<browsers.size(); ++i) {
                        echo "Testing the ${browsers[i]} browser"
                    }
                }
            }
        }
    }
    post {always {echo "I will always say Hello again"} } // 실행 중 오류 발생 여부와 상관 없이 출력
}
```

### pipeline의 지시어
- 섹션
  - Stage: 한 개 이상의 연속된 stage 지시어로 구성
  - Step: 한 개 이상의 연속된 step 명령으로 구성
  - Post: 파이프라인 빌드 끝에서 실행되는 한 개 이상의 추가 step 명령으로 구성   
    post는 always, success, failure 등의 조건과 함께 쓰이며 일반적으로 파이프라인 빌드가 끝날 때 알림을 보내는 용도로 사용
  - Agent: 파이프라인이나 스테이지가 어디서 실행되는지 결정할 때 사용
- 지시어
  - Triggers   
    파이프라인을 자동으로 시작하는 방법을 정의   
    cron으로 시간별 일정에 따라 실행하거나 pollSCM으로 레포지토리 변경에 따라 시작하도록 할 수 있음
  - Options   
    파이프라인에서만 사용하는 옵션을 정의
  - Environment: 빌드에서 사용하는 환경 변수를 Key-Value 형태로 정의
  - Parameters: 파이프라인을 시작할 때 제공되는 사용자 파라미터 정의
  - Stage: step을 논리적으로 그룹화
  - When: Stage가 어떤 조건에 실행되어야 하는지를 정의
  - Tools: 설치할 도구를 정의하고 PATH에 추가
  - Input: 매개변수 입력
  - Parallel: 병렬로 실행할 stage를 지정
  - Matrix: 특정 stage에서 병렬로 실행할 매개변수의 조합을 지정
- 스텝
  - sh: 쉘 명령
  - custom: 젠킨스에서 제공하는 명령으로 sh의 래퍼
  - script: 시나리오를 이용

### Commit Pipeline
- 가장 기본적인 지속적 통합 프로세스가 Commit Pipeline
- Repository로 Commit이나 Push를 한 후 빌드 결과를 보고하는 파이프라인
- 코드가 변경될 때마다 파이프라인이 실행되기 때문에 빌드 시간은 5분을 넘지 않도록 해야 하고 리소스 사용도 합리적이어야 함
- 커밋이 CD의 시작점이며 개발 프로세스에서 가장 중요한 피드백 사이트 정보를 제공
- 과정
  - 체크 아웃: 레포지토리에서 소스 코드를 다운로드 받는 단계
  - 컴파일: 소스 코드를 컴파일하는 단계
  - 단위 테스트: 단위 테스트를 수행하는 단계
- 체크아웃
  - 레포지토리에서 소스 코드를 가져오는 것
  - 파이프라인을 만들고 스크립트를 작성
    ```
    pipeline{
        agent any
        stages{
            stage("Checkout"){
                steps{
                    git url:'https://github.com/dragonhail/jenkinssample.git', branch: 'main'
                }
            }
        }
    }
    ```
- compile
  - 인간이 알아보는 코드를 운영체제나 vm이 알아볼 수 있는 코드로 변경하는 것
  - 자바에서는 `javac 파일명`으로 컴파일을 하지만 gradle에서는 `./gradlew compileJava`
  - IntelliJ에서 웹 프로젝트를 생성   
    컴파일: `./gradlew compileJava`

    소스 코드를 git에 푸시

    스크립트를 수정
    ```
    pipeline{
        agent any
        stages{
            stage("Checkout"){
                steps{
                    git url:'https://github.com/dragonhail/calculator.git', branch: 'main'
                }
            }
            stage("chmod"){
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
  - 수행했을 때 Permission Denied 가 출력되면 step에 추가 `sh "chmod +x ./gradlew"`
- 컴파일을 하고 난 후 단위 테스트를 수행
  - JUnit 을 이용해서 수행: `.gradlew test`
  - 실행: `.gradlew bootRun`
  - 프로젝트에 Service 클래스를 추가하고 작성(Calculator)
```java {filename="Calculator.java"}
@Service
public class Calculator {
   public int sum(int a, int b){
       return a + b;
   }
}
```
  - Controller 클래스를 만들어서 사용자의 요청을 처리하는 메서드를 작성(CalculatorController)
```java {filename="CalculatorController.java"}
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CalculatorController {
   private final Calculator calculator;

   @RequestMapping("/sum")
   String sum(@RequestParam("a") Integer a,
              @RequestParam("b") Integer b){
       return String.valueOf(calculator.sum(a, b));
   }
}
```
  - 실행 한 후 브라우저에서 입력: http://localhost:8080/sum?a=10&b=20

  - test 디렉토리에 테스트를 위한 클래스를 추가하고 작성(CalculatorTest)
```java {filename="CalculatorTest.java"}
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class CalculatorTet {
   private Calculator calculator = new Calculator();
   @Test
   public void testSum(){
       assertEquals(5, calculator.sum(2, 3));
   }
}
```

  - build.gradle의 dependencies 부분에 라이브러리 의존성 추가하고 리빌드 버튼을 클릭
```{filename="build.gradle"}
testImplementation 'junit:junit:4.13.2'
```
  - `./gradlew test` 명령으로 테스트를 수행
  - jenkins script 파일에 스크립트를 추가
```
stage("Test"){
            steps{
                sh "./gradlew test"
            }
        }
```

### Jenkinsfile을 프로젝트에 포함
- 루트 디렉터리에 Jenkinsfile을 만들어서 스크립트를 작성해서 사용
  - 이 경우에는 Repository에서 다운로드 받는 코드를 사용하지 않음   
    루트 디렉토리에 Jenkinsfile을 추가하고 작성
    ```{filename="Jenkinsfile"}
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
  - Definition을 Pipeline script에서 Pipeline script from SCM으로 수정
  - SCM에서 git을 선택
  - Repository URL에 git hub URL을 설정
  - Branch 설정

### 코드-품질 스테이지(중요)
- **코드 커버리지**
  - 여러 개발자가 개발을 하는데 특정 개발자 또는 모든 개발자가 단위 테스트를 수행하지 않는 경우 빌드가 될 수는 있지만 코드가 안전하게 동작할 지는 알 수 없음
  - 이런 경우에는 코드 전체를 대상으로 테스트를 진행하고 검증이 완료된 부분을 식별하는 코드 커버리지 도구를 추가해서 해결   
  이를 이용하게 되면 테스트가 수행되지 않은 부분에 대한 보고서도 받을 수 있고 테스트 미수행 영역이 많으면 아예 빌드를 실패한 것으로 간주
  - Java의 경우는 이러한 도구로 JaCoCo나 오픈 클로버, 코버추라다 등이 있음
- JaCoCo를 이용한 코드 커버리지 과정
  - JaCoCo를 그래들 구성에 추가: build.gradle 파일의 plugins 부분에 `id 'jacoco'`
  - 빌드 중단 조건을 설정하고자 하는 경우에는 build.gradle에 설정을 추가
    ```{filename="build.gradle"}
    jacocoTestCoverageVerification{
        violationRules {
            rule{
                limit{
                    minimum = 0.2
                }
            }
        }
    }
    ```
  - 실행   
    `./gradlew test jacocoTestCoverageVerification`
  - 보고서 만들기   
    `./gradlew test jacocoTestReport`   
    보고서는 build/reports/jacoco/test/html/index.html
  - code coverage 스테이지를 파이프라인에 추가
    ```{filename="Jenkinsfile"}
            stage("Code Coverage"){
                steps{
                    sh "./gradlew jacocoTestCoverageVerification"
                    sh "./gradlew jacocoTestReport"
                }
            }
    ```
  - JaCoCo 보고서를 발행(선택적)
    ```{filename="Jenkinsfile"}
            stage("Code Coverage"){
                steps{
                    sh "./gradlew jacocoTestCoverageVerification"
                    sh "./gradlew jacocoTestReport"
                }
            }
    ```

### 정적 분석
- 코드를 실행하지 않고 자동으로 코드를 점검하는 정적 코드 분석
- 직접 규칙을 설정해서 소스 코드를 점검하는 것
- 이러한 도구로 많이 사용되는 것이 Checkstyle이나 FindBugs 또는 PMD