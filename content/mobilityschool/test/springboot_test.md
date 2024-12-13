---
title: Spring Boot Application Test
weight: 2
---
## 참고지식
### Error
- 물리적오류: Compile Error와 Build Error 포함
  - 컴파일 과정에서 확인 가능한 것은 물리적 오류 중 문법 오류
  - 빌드 시 에러는 물리적 오류지만 구조적 오류(모듈을 합치고 main과 같은 엔트리포인트를 만들어 내는 것)가 될 가능성이 높음 또는 버전이 다를 경우
- 논리적 오류: 알고리즘 오류로 잘못된 결과가 도출된 경우
  - 디버깅을 실행
- Exception: 문법에는 이상이 없는데 실행 도중 발생하는 오류
  - 디버깅을 통해 해결: NullPointerException과 같은 exception
  - 예외 처리를 통한 해결: try..catch..finally 사용
- Assertion: 정상적인 상황인데 특정 조건을 만족하지 않으면 예외로 간주하는 것

### @AutoWired와 @RequiredArgsConstructor
```java
@AutoWired
MemoService memoService = new MemoServiceImpl();
memoService.setMemoRepository(memoRepository); // lazy init 이라고 함, 클라이언트 생성 시 추천, 테스트시 자주 사용

@RequiredArgsConstructor
MemoService memoService = new MemoServiceImpl(memoRepository); // 서버 만들때 추천, 처음부터 메모리 많이 필요
```

## 1.Test
### 1)Test Code 작성 이유
- 개발 과정에서 문제를 미리 발견할 수 있음
- 리팩토링의 리스크가 줄어듬: 테스트 과정에서 리팩토링을 수행하게 되고 실제 코드를 리팩토링 했을 때 미치는 영향을 최소화
- 애플리케이션을 가동해서 직접 테스트하는 것 보다 빠르게 테스트 가능
- 하나의 명세 문서로서의 기능을 수행: 테스트 과정을 문서화하는 것이 아니라 테스트 과정에 설명을 추가하면서 테스트를 수행하면 이 자체가 문서화
- 코드가 작성된 목적을 명확하게 표현할 수 있으며 불필요한 내용이 추가되는 것을 방지할 수 있음

### 2)종류
- 단위 테스트(Unit Test)
  - 가장 작은 단위의 테스트
  - 메서드나 함수 단위로 테스트
  - 메서드 호출을 통해 의도한 결과가 나오는지 테스트
  - 테스트 비용이 적게 들기 때문에 피드백을 빠르게 받을 수 있음
- 통합 테스트(Integration Test)
  - 모듈을 통합하는 과정에서 호환성 등을 포함해서 애플리케이션이 정상적으로 동작하는지 확인하기 위해서 수행하는 테스트
  - Layer 단위: Business Logic(도메인 지식, Repository Service Controller)과 Common Concern(로그)로 분리. 로그 패키지는 재사용 가능하기 떄문에 별도의 모듈로 작성
  - 기능 단위: Agile방식 서비스 별로 구분
  - 단위 테스트 보다는 비용이 많이 소모
- System Test
  - 시스템이 완전히 통합되어 구축된 상태에서 시스템의 기능을 총체적으로 테스트
  - 전체 시스템 내에서 발생하는 결합 모두를 발견하는 것이 목적
- 인수 테스트(Acceptance Test)
  - 사용자가 참여하는 테스트
  - 이 시스템이 사용자가 요구하는 대로 동작하는지 확인하기 위한 테스트

## 2.Spring-Boot-Starter-Test
- 빌드할 때 모듈을 의존성에 추가하면 자동으로 테스트 라이브러리가 추가됨
- 사용 가능한 라이브러리
  - Spring Boot Test
  - JsonPath
  - JUnit
  - AssertJ
  - Mokito
  - JSONAssert
  - Spring Test

### JUnit
- 개요
  - 자바의 대표적인 테스트 라이브러리
  - 어노테이션 기반의 테스트 방식을 지원
  - assert를 통해 테스트 케이스의 기댓값이 정상적으로 도출되었는지 검토
  - assertion(단언): 문법적으로 에러가 아니고 예외도 아니지만 강제로 예외를 발생시켜 프로그램을 중단시키는 것

- Life Cycle
  - @Test: 테스트 코드를 포함한 메서드를 정의할 때 사용
  - @BeforeAll: 테스트를 시작하기 전에 호출되는 메서드를 정의할 때 사용: 테스트 메서드가 여러 개 여도 한 번만 동작
  - @BeforeEach: 테스트를 시작하기 전에 호출되는 메서드를 정의할 때 사용: 테스트 메서드 숫자만큼 동작
  - @AfterAll
  - @AfterEach

### 가짜 객체 생성
- 클래스를 테스트 할 때 주입받아야 하는 객체가 존재하는 경우 실제 테스트할 객체가 아니므로 직접 생성해서 주입하는 것은 자원의 낭비므로 Mock 사용   
  @MockBean 클래스이름 변수이름

## 3.Spring Boot JPA Application Test
### 1)프로젝트 생성
- 의존성
```
  Spring Boot DevTools
  Lombok
  Spring Data JPA
  데이터베이스 Driver
  Spring Web
```
### 2)사용할 데이터베이스를 확인
```bash
# 오라클 설치
docker pull oracleinanutshell/oracle-xe-11g

# 도커 실행
docker run --name oracle11g -d -p 1521:1521 oracleinanutshell/oracle-xe-11g
```
- dbeaver로 데이터베이스 접속: 1521 번 포트이고 sid가 xe 계정은 system 비번은 oracle

### 3)실행하면 에러 발생
- Spring Boot Project에서 JPA 의존성을 설정한 경우 데이터베이스 접속 경로를 설정하지 않으면 에러가 발생
- 설정 파일(application.properties 또는 application.yml 파일)에 데이터베이스 접속 경로 추가
```yml
spring:
  application:
    name: spring-test

  datasource:
    driver-class-name: oracle.jdbc.driver.OracleDriver
    url: jdbc:oracle:thin:@localhost:1521:xe
    username: system
    password: oracle
```
- 다시 실행해서 에러가 발생하지 않아야 함

### 4)Test Life Cycle 확인
- test/java 디렉터리에 테스트를 위한 클래스를 생성하고 확인
```java
import org.junit.jupiter.api.*;

public class TestLifeCycle {

   @Test
   public void test1(){
       System.out.println("test1");
   }

   @Test
   @DisplayName("Test Case 2")
   public void test2(){
       System.out.println("test2");
   }

   //이 Test는 Test를 할 때 제외
   @Test
   @DisplayName("Test Case 3")
   @Disabled
   public void test3(){
       System.out.println("test3");
   }

   @BeforeAll
   static void beforeAll() {
       System.out.println("beforeAll");
   }

   @AfterAll
   static void afterAll() {
       System.out.println("afterAll");
   }

   @BeforeEach
   void beforeEach() {
       System.out.println("beforeEach");
   }

   @AfterEach
   void afterEach() {
       System.out.println("afterEach");
   }
}
```
### 5)Entity(테이블 과 매핑되는 클래스) 확인
- main/기본패키지 안에 클래스를 작성
```java
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="tbl_memo")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Memo {
  
   @Id
   @GeneratedValue(strategy= GenerationType.AUTO)
   private Long mno;
  
   @Column(length=200, nullable=false)
   private String memoText;
          
}
```
- application.yml 파일에 설정 추가
```yml
spring:
 application:
   name: SpringBootJPATest

 datasource:
   driver-class-name: oracle.jdbc.driver.OracleDriver
   url: jdbc:oracle:thin:@localhost:1521:xe
   username: system
   password: oracle

 jpa:
   hibernate:
     ddl-auto: update
   properties:
     hibernate:
       format_sql: true
       show_sql: true
      
logging.level.org.hibernate.type.descriptor.sql: trace
```
- 애플리케이션을 실행하고 테이블이 존재하지 않는 경우는 테이블 생성 여부와 로그창에 나타나는 SQL을 확인

### 6)Repository 계층
- JPARepository 인터페이스 생성
```java
public interface MemoRepository extends JpaRepository<Memo, Long> {
}
```
- Test 클래스를 생성하고 테스트
```java
import com.example.springbootjpatest.entity.Memo;
import com.example.springbootjpatest.persistence.MemoRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

@SpringBootTest
public class RepositoryTest {
   @Autowired
   MemoRepository memoRepository;

   //주입 확인
   //bean이 제대로 생성되고 주입이 되었는지 확인
   @Test
   @Disabled
   public void testDependency(){
       System.out.println(memoRepository.getClass().getName());
   }

   //테이블 과 연결되었는지 확인
   @Test
   public void testInsert(){
       IntStream.range(1, 100).forEach(i -> {
          Memo memo = Memo.builder().memoText("Sample..." + i).build();
          memoRepository.save(memo);
       });
   }
}
```
- 구현을 하는 코드는 거의 없고 기본적으로 제공되는 메서드나 메서드만 만들어서 사용하는 경우가 많기 때문에 대부분 생성 여부 와 테이블 연결 여부만 테스트합니다. 단 메서드를 만든 경우 나 SQL을 작성한 경우는 효율은 확인을 해봐야 합니다. 

### 9)Service 계층: 데이터 추가
- Controller로 부터 데이터를 받아서 처리하기 위해서 MemoDTO 클래스를 생성
```java
=>Controller로 부터 데이터를 받아서 처리하기 위해서 MemoDTO 클래스를 생성
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemoDTO {
   private Long mno;
   private String memoText;
}
```
- Service를 위한 인터페이스 생성
```java
import com.example.springbootjpatest.dto.MemoDTO;

public interface MemoService {
   //Service 계층에서 삽입 작업시 다시 리턴하는 이유는 대부분 Sequence 나 AutoIncrement 때문
   //자동으로 생성되는 기본키는 입력을 받지 않기 때문에 어떤 값인지 알지 못하기 때문에
   //Repository가 삽입한 데이터를 조회하면 알 수 있습니다.
   public MemoDTO saveMemo(MemoDTO memoDTO);
}

=>Service 클래스 생성(MemoServiceImpl)
import com.example.springbootjpatest.dto.MemoDTO;
import com.example.springbootjpatest.entity.Memo;
import com.example.springbootjpatest.persistence.MemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {
   private final MemoRepository memoRepository;
 
   public MemoDTO saveMemo(MemoDTO memoDTO) {
       //데이터 유효성 검사
      
       //삽입이나 수정 삭제의 경우는 매개변수로 Repository의 매개변수를 생성
       Memo memo = Memo.builder().memoText(memoDTO.getMemoText()).build();
       //삽입
       memoRepository.save(memo);
       //memoDTO에 삽입된 데이터의 mno가 저장
       memoDTO.setMno(memo.getMno());
      
       return memoDTO;
   }
}
```
- 테스트를 위한 클래스를 만들고 테스트
```java
import com.example.springbootjpatest.dto.MemoDTO;
import com.example.springbootjpatest.service.MemoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ServiceTest {
   @Autowired
   MemoService memoService;

   @Test
   public void testDependency(){
       System.out.println(memoService.getClass().getName());
   }

   @Test
   public void testInsert(){
       MemoDTO memoDTO = MemoDTO.builder().memoText("서비스테스트").build();
       System.out.println(memoService.saveMemo(memoDTO));
   }
}
```
### 10)Controller 계층
- 테스트를 내부에서 수행하고자 하면 다른 계층에 비해서 복잡
  - Controller는 외부에서 파라미터를 받아야 합니다.
  - Service Layer 나 Repository Layer는 Application 내부에서만 동작하기 때문에 파라미터가 프로그래밍 언어의 자료형입니다.
  - Controller는 외부와 연결된 실제 서비스 계층이기 때문에 프로그래밍 언어의 자료형이 아니고 실제로는 외부의 데이터입니다. 
- Controller 계층을 테스트하기 위한 라이브러리의 의존성을 build.gradle 파일의 dependencies에 추가
```
implementation 'com.google.code.gson:gson:2.10.1'
```
- Controller 클래스 생성
```java
import com.example.springbootjpatest.dto.MemoDTO;
import com.example.springbootjpatest.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MemoController {
   private final MemoService memoService;

   @PostMapping("/save")
   //웹에서 매개변수를 받아서 MemoDTO에 대입
   public ResponseEntity<MemoDTO> saveMemo(@RequestBody MemoDTO memoDTO){
       //필요한 서비스 계층의 메서드를 호출
       MemoDTO result = memoService.saveMemo(memoDTO);
   }
}
```
- Controller 계층 테스트가 다른 계층과 다른점
  - Controller 계층은 프로그래밍 언어가 직접 호출하지 않고 브라우저의 요청이나 다른 애플리케이션의 요청에 의해서 호출됨
  - 매개변수가 프로그래밍 언어 내부에서 만들어내는 것이 아니고 웹 브라우저의 요청이나 다른 애플리케이션의 요청에 의해서 생성되기 떄문에 이전 계층의 테스트 방법으로 테스트가 불가능함
  - 내부적으로 테스트 할 때는 테스트 프레임워크에서 제공하는 기능을 사용해야 하고 외부에서 테스트하고자 할 때는 Postman API와 같은 테스트 도구의 도움을 받아야 함
  - gson 라이브러리는 Controller의 매개변수를 만들어주기 위한 라이브러리임
- Java Application 내에서 테스트하기 위해서 테스트 클래스를 생성
- Postman API에서 테스트
  - 파라미터를 줄 때 POST 방식의 경우는 Body에 담아서 보내야 합니다.
  - 파일을 전송할 때는 form-data를 사용하고 파일이 없는 일반적인 파라미터를 만들 때는 raw 형식으로 파라미터를 만들어서 전송을 하면 됩니다.

### 11)명령어로 테스트: 단위 테스트 종료
```
./gradlew compileJava

./gradlew test
```
### 12)Code Coverage
- 개요
  - 테스트를 수행한 코드를 확인하는 작업
  - 전체 코드 중에서 테스트에 사용한 코드의 비율을 측정
  - java에서는 jacoco 라이브러리를 많이 사용하는데 최근에는 jacoco를 이용해서 기능을 확장한 sonarqube를 이용하는 경우도 많습니다.
  - sonarqube는 jacoco 기반이고 jenkins 처럼 별도의 서버를 만들어서 사용하며 사용법은 jenkins 와 비슷
- 실습
  - 코드를 정적 분석하거나 code coverage 관련된 도구들은 dependencies에 추가하는 것이 아니고 plugins에 추가해서 사용
  - build.gradle의 plugins 항목에 추가    
    `id 'jacoco'`
  - build.gradle에 jacoco 설정을 추가
```
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
  - 명령어   
    `./gradlew test jacocoTestCoverageVerification`
  - 보고서 생성   
    `./gradlew test jacocoTestReport`
  - CodeCoverage의 대상은 직접 구현한 메서드에 한해서 입니다.   
    어노테이션으로 자동으로 추가되도록 한 부분은 포함되지 않습니다.   
    Entity(table과 연동, 컨트롤러에서 사용하면 안됨), Domain(서비스에서 사용), DTO(컨트롤러, 서비스에서 사용), VO(속하기 애매한 것) 등의 목적으로 만드는 클래스는 메서드를 직접 구현하지 말고 Lombok의 어노테이션을 이용해서 구현하는 것이 CodeCoverage의 비율을 높이는 것입니다.

- Code Coverage와 Code 정적 분석 도구는 Code 전체를 확인할 수 있음. 그래서 build.gradle이나 별도의 설정 파일을 가짐

### 13)정적 코드 분석
- 개요
  - 코드의 품질을 검사하는 과정
  - 코드의 작성 스타일을 확인하는 과정
  - 코드를 읽기 쉽고 유지보수 하기 쉬운 스타일로 코딩했는지 확인
  - 정적 코드 분석이 어려운 이유는 프로그래밍 언어마다 추천하는 코딩 스타일이 다르고 운영자나 개발자마다 스타일이 다르기 때문   
    자바나 C++에서는 클래스의 이름은 대문자로 시작하고 변수와 메서드의 이름은 소문자로 시작하고 2개 단어 이상의 조합이면 두번째 단어부터 시작은 대문자로 하고 상수는 모두 대문자로 표현하는 것을 권장하는데 파이썬의 경우는 클래스나 변수 또는 메서드 모두 소문자로 작성하고 단어의 구분은 _ 로 하는 형태로 만들어졌다가 3버전부터 조금씩 수정이 되가고 있음
  - 개발 과정에서는 수행하는 것이 좋다고 알려져 있음
  - java에서는 checkstyle이나 findbug 등이 이 작업을 수행할 수 있음
  - sonarqube는 정적 코드 분석도 수행해 줌
- checkstyle 적용
  - build.gradle의 plugin에 의존성 추가
  - build.gradle에 설정 추가(내용이 많아서 별도의 설정 파일 이용 - config 디렉터리를 만들고 그 안에 checkstyle.xml 파일로 추가)
  - 수행 명령어   
    `./gradlew checkstyleMain`