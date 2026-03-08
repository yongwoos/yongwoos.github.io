---
title: EKS 배포1
weight: 7
---
## 복습
### EKS
- VPC  생성
- IAM에서 eks 사용 권한을 가진 user를 생성해서 로컬에 등록
- eksctl 명령으로 클러스터 생성   
  로컬 컴퓨터가 Master Node 역할을 수행: 다른 컴퓨터에서 수행하고자 하면 Context 정보와 IAM 정보를 복사   
  Worker Node는 EC2 인스턴스로 생성

### VPC
- 네트워크 대역 생성
- 인터넷 게이트웨이 추가

### Cloud Formation
- Ansible 역할을 담당
- json이나 yaml 파일을 가지고 aws 리소스 생성
- IoC(Infra of Code)

### EKS-DB
- 스택 생성 > EKS 클러스터가 있는 VPC 선택 > 라우팅 테이블 스택의 [출력][routingtable]값 입력 > IAM리소스 승인 > 생성

## 1.EKS 클러스터 생성

### 1)VPC 생성

### 2)eksctl 명령으로 클러스터 생성

## 2.EKS 클러스터가 존재하는 VPC 내에 RDS 생성
### 1)RDS를 Cloud Formation에서 생성할 수 있도록 해주는 템플릿 파일을 작성

## 2)템플릿 파일을 이용해서 스택 생성

## 3.Cloud Formation으로 VPC 안에 만든 데이터베이스를 활용
### 1)세션 관리자를 이용해서 배스천 호스트 접속
- 기존에 만들어진 Worker Node를 이용해서 RDS 사용
- Session Manager 서비스에서 [세션 시작]을 눌러서 동일한 VPC 내의 인스턴스를 선택
- 프로그램 설치
```bash
sudo yum install -y git
sudo amazon-linux-extras install -y postgresql11
```
- postgresql에 접속을 하기 위해서 필요한 정보를 확인
  - EndPoint: CloudFormation에서 RDS를 만든 스택을 클릭하고 출력 탭을 확인: eks-work-db.cesn3uejbkwe.ap-northeast-2.rds.amazonaws.com
  이 End Point는 VPC 내에서만 접속이 가능   
	RDS를 만들 때 퍼블릭 IP를 사용하지 않음
  - 관리자(eksdbadmin) 비밀번호: Secret Manager 에서 확인
  - 유저(mywork) 비밀번호: Secret Manager 에서 확인
- EC2 세션에서 사용자를 생성
  - 유저 생성: createuser -d -U 관리자이름 -P -h 접속URL 사용자이름
  - 접속: psql -U 사용자 -h 접속URL 데이터베이스이름
  - `createuser -d -U eksdbadmin -P -h eks-work-db.cesn3uejbkwe.ap-northeast-2.rds.amazonaws.com mywork`
- 비밀번호를 3번 입력하는데 첫 2개의 비밀번호는 사용자의 비밀번호이고 다음 1개는 관리자의 비밀번호
  - 데이터베이스 생성: `createdb -U mywork -h eks-work-db.cesn3uejbkwe.ap-northeast-2.rds.amazonaws.com -E UTF8 myworkdb`
  - `psql -U mywork -h eks-work-db.cesn3uejbkwe.ap-northeast-2.rds.amazonaws.com  myworkdb`
## 3.Database를 사용하는 Spring Boot Application을 EKS에 배포하고 외부로 노출
### 1)프로그램을 로컬에서 테스트하기 위해서 로컬 컴퓨터에 Docker에서 실행되는 postgresql을 설치
```bash
docker run -d -p 외부포트번호:5432 -e POSTGRES_PASSWORD=＂비밀번호" --name 컨테이너이름 postgres

docker run -d -p 5432:5432 -e POSTGRES_PASSWORD="wnddkd" --name postgres postgres
```
- 관리자는 postgres로 생성

### 2)Postgre SQL에 접속해서 샘플 유저 와 데이터베이스를 생성
- dbeaver 접속
```sql
create user mywork password 'wnddkd' superuser;

create database myworkdb owner mywork;
```

### 3)새로 만든 유저로 재접속해서 샘플 데이터를 생성
```sql
create table region(
	region_id SERIAL primary key,
	region_name VARCHAR(100) not null,
	creation_timestamp TIMESTAMP not null
);

insert into region(region_name, creation_timestamp)
values('서울', current_timestamp);

insert into region(region_name, creation_timestamp)
values('제주', current_timestamp);

insert into region(region_name, creation_timestamp)
values('목포', current_timestamp);

insert into region(region_name, creation_timestamp)
values('광주', current_timestamp);

insert into region(region_name, creation_timestamp)
values('부산', current_timestamp);

insert into region(region_name, creation_timestamp)
values('대구', current_timestamp);

select *
from region;
```

### 4)Spring Boot Application 생성
- 프로젝트 이름: backend

- 의존성
```Spring Dev Tools
Lombok

DataJPA
Spring PostgreSQL

SpringWeb
```
### 5)데이터베이스 관련 작업 및 테스트
- application.properties에 데이터베이스 접속 정보 와 JPA 설정 정보를 추가
```
spring.datasource.url=jdbc:postgresql://localhost:5432/myworkdb
spring.datasource.username=mywork
spring.datasource.password=wnddkd
spring.datasource.driver-class-name=org.postgresql.Driver

spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
- 자바 애플리케이션에 자주 사용하는 클래스를 소유한 외부 라이브러리를 설치: build.gradle 파일의 dependencies 에 추가
```java
implementation 'org.apache.commons:commons-lang3:3.9'
```
- Entity 클래스들이 공통으로 가질 메서드를 소유한 추상 클래스를 생성: persistence.entity.AbstractEntity

```java
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
public abstract class AbstractEntity {
   @Override
   public String toString() {
       return ToStringBuilder.reflectionToString(this);
   }
  
   @Override
   public int hashCode() {
       return HashCodeBuilder.reflectionHashCode(this);
   }
  
   @Override
   public boolean equals(Object obj) {
       if(obj == null){
           return false;
       }
       if(obj == this){
           return true;
       }
       if(obj.getClass() != getClass()){
           return false;
       }
       return EqualsBuilder.reflectionEquals(this, obj);
   }
}
```


- JPA에서 테이블 과 매핑되는 Entity 클래스를 생성: persisence.entity.Location

```java
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "REGION")
public class RegionEntity extends AbstractEntity{
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "REGION_ID")
   private Integer regionId;

   @Column(name = "REGION_NAME")
   private String regionName;

   @Column(name="CREATION_TIMESTAMP")
   private LocalDateTime creationTimestamp;

   public Integer getRegionId() {
       return regionId;
   }

   public void setRegionId(Integer regionId) {
       this.regionId = regionId;
   }

   public String getRegionName() {
       return regionName;
   }

   public void setRegionName(String regionName) {
       this.regionName = regionName;
   }

   public LocalDateTime getCreationTimestamp() {
       return creationTimestamp;
   }

   public void setCreationTimestamp(LocalDateTime creationTimestamp) {
       this.creationTimestamp = creationTimestamp;
   }
}
```
- Region 테이블에 CRUD 작업을 수행할 수 있는 레포지토리 인터페이스 생성: RegionRepository
```java
import com.adamsoft.backend.persistence.entity.RegionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//RegionEntity 와 연결된 테이블에 CRUD 작업을 수행할 수 있는 기본 메서드를 구현한
//인스턴스를 자동으로 생성
@Repository
public interface RegionRepository extends JpaRepository<RegionEntity, Integer> {
   //기본적으로 추가되는 메서드
   //Entity를 매개변수로 받아서 삽입, 수정, 삭제하는 메서드
   //매개변수 없이 모든 데이터를 읽어오는 메서드
   //기본키를 매개변수로 받아서 하나의 데이터를 읽어오는 메서드
  
   //regionName을 가지고 데이터를 조회하는 메서드
   Optional<RegionEntity> findByRegionName(String regionName);
}
```
- test 패키지에 RegionRepository를 테스트 할 수 있는 클래스를 만들고 테스트를 수행
  - build.gradle 의 dependencies 에 의존성을 추가하고 리빌드
```java
testImplementation 'com.ninja-squad:DbSetup:2.1.0'

RegionRepositoryTest 클래스를 만들고 작성
import com.adamsoft.backend.persistence.repository.RegionRepository;
import com.ninja_squad.dbsetup.DbSetup;
import com.ninja_squad.dbsetup.destination.DataSourceDestination;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;

import java.time.LocalDateTime;

import static com.ninja_squad.dbsetup.Operations.*;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

//테스트 클래스라는 어노테이션
//이 클래스는 빌드를 할 때 테스트 용으로 사용이 되고 빌드 결과물을 만들 때 자동 소멸
@SpringBootTest
public class RegionRepositoryTest {
   @Autowired
   private RegionRepository regionRepository;

   @Autowired
   @Qualifier("dataSource")
   private DataSource dataSource;

   @Test
   @Tag("DBRequired")
   public void testFindAll(){
       prepareDatabase();

       //전체 데이터 가져오기 테스트: 개수가 맞는지 확인
       var result = regionRepository.findAll();
       assertThat(result).hasSize(4);
   }

   //테스트 메서드 호출할 때 마다
   @BeforeEach
   public void prepareDatabase(){
       var operations = sequenceOf(
               deleteAllFrom("region"),
               insertInto("region")
                       .columns("region_id", "region_name", "creation_timestamp")
                       .values(1, "지역1", LocalDateTime.now())
                       .values(2, "지역1", LocalDateTime.now())
                       .values(3, "지역1", LocalDateTime.now())
                       .values(4, "지역1", LocalDateTime.now())
                       .build()
       );
       var dbSetup = new DbSetup(new DataSourceDestination(dataSource),operations);
       dbSetup.launch();
   }
}
```
### 6)Service 클래스를 만들고 테스트
- Service 계층에서 사용할 model 클래스를 생성: domain.model.Region
```java
import com.adamsoft.backend.persistence.entity.RegionEntity;

import java.time.LocalDateTime;

public class Region {
   private Integer regionId;
   private String regionName;
   private LocalDateTime creationTimestamp;

   //각각의 항목을 받아서 인스턴스를 생성하는 메서드
   public Region(Integer regionId, String regionName, LocalDateTime creationTimestamp) {
       if(regionName == null){
           throw new IllegalArgumentException("regionName cannot b null");
       }
       this.regionId = regionId;
       this.regionName = regionName;
       this.creationTimestamp = creationTimestamp;
   }

   //Entity를 받아서 인스턴스를 생성하는 메서드
   public Region(RegionEntity regionEntity) {
       this(regionEntity.getRegionId(),
               regionEntity.getRegionName(),
               regionEntity.getCreationTimestamp());
   }

   public Integer getRegionId() {
       return regionId;
   }

   public void setRegionId(Integer regionId) {
       this.regionId = regionId;
   }

   public String getRegionName() {
       return regionName;
   }

   public void setRegionName(String regionName) {
       this.regionName = regionName;
   }

   public LocalDateTime getCreationTimestamp() {
       return creationTimestamp;
   }

   public void setCreationTimestamp(LocalDateTime creationTimestamp) {
       this.creationTimestamp = creationTimestamp;
   }
}
```
- Service 클래스 생성: domain.service.RegionService
  - 원칙적으로 이 계층은 템플릿 메서드 패턴을 적용
  - 서비스 인터페이스 생성
```java
import com.adamsoft.backend.domain.model.Region;

import java.util.List;

public interface RegionService {
   //매개변수 없이 전체 데이터를 가져오는 메서드
   public List<Region> getAllRegions();
}
```
- 클래스를 생성: domain.service.RegionServiceImpl
```java
import com.adamsoft.backend.domain.model.Region;
import com.adamsoft.backend.domain.service.RegionService;
import com.adamsoft.backend.persistence.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionServiceImpl implements RegionService {
   private final RegionRepository regionRepository;
  
   @Override
   public List<Region> getAllRegions() {
       var regionEntities = regionRepository.findAll();
       var regionList = new ArrayList<Region>();
       regionEntities.forEach(entity -> regionList.add(new Region(entity)));
       return regionList;
   }
}
```

- Service 계층 테스트: test 패키지에 클래스를 만들고 테스트
```java
import com.adamsoft.backend.domain.model.Region;
import com.adamsoft.backend.domain.service.RegionService;
import com.ninja_squad.dbsetup.DbSetup;
import com.ninja_squad.dbsetup.destination.DataSourceDestination;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.List;

import static com.ninja_squad.dbsetup.Operations.*;

@SpringBootTest
public class RegionServiceTest {
   @Autowired
   private RegionService regionService;

   @Autowired
   @Qualifier("dataSource")
   private DataSource dataSource;

   //테스트 메서드 호출할 때 마다
   @BeforeEach
   public void prepareDatabase(){
       var operations = sequenceOf(
               deleteAllFrom("region"),
               insertInto("region")
                       .columns("region_id", "region_name", "creation_timestamp")
                       .values(1, "지역1", LocalDateTime.now())
                       .values(2, "지역1", LocalDateTime.now())
                       .values(3, "지역1", LocalDateTime.now())
                       .values(4, "지역1", LocalDateTime.now())
                       .build()
       );
       var dbSetup = new DbSetup(new DataSourceDestination(dataSource),operations);
       dbSetup.launch();
   }

   @Test
   @Tag("DBRequired")
   public void testServiceRegion(){
       List<Region> regionList = regionService.getAllRegions();
       Assertions.assertEquals(regionList.size(), 4);
   }
}
```
7)요청에 따라 필요한 서비스를 호출하고 응답하는 계층을 생성하고 테스트
- Dto 클래스
  - 실제 데이터를 리턴하지 않고 Health Check를 위한 DTO 클래스:  presentation.dto.HealthDto
```java
public class HealthDto {
   private String status;

   public String getStatus() {
       return status;
   }

   public void setStatus(String status) {
       this.status = status;
   }
}
```
Region 결과를 위한 Dto: presentation.dto.RegionDto
```java
public class RegionDto {
   private Integer regionId;
   private String regionName;
public RegionDto(){}
 
public RegionDto(Region region) {
   this.regionId = region.getRegionId();
   this.regionName = region.getRegionName();
}


   public Integer getRegionId() {
       return regionId;
   }

   public void setRegionId(Integer regionId) {
       this.regionId = regionId;
   }

   public String getRegionName() {
       return regionName;
   }

   public void setRegionName(String regionName) {
       this.regionName = regionName;
   }
}
```
- Controller가 리턴할 때 Region의 목록을 넘겨주므로 Region의 List를 가진 클래스를 생성: presentation.dto.RegionsDto
```
import java.util.ArrayList;
import java.util.List;

public class RegionsDto {

   private List<RegionDto> regionDtoList = new ArrayList<RegionDto>();

   public RegionsDto(){

   }

   public RegionsDto(List<RegionDto> regionDtoList) {
       this.regionDtoList = regionDtoList;
   }

   public List<RegionDto> getRegionDtoList() {
       return regionDtoList;
   }

   public void setRegionDtoList(List<RegionDto> regionDtoList) {
       this.regionDtoList = regionDtoList;
   }
}
```

- Controller 클래스
```java
HealthCheck를 위한 Controller 클래스: presentation.api.HealthApi
import com.adamsoft.backend.presentation.dto.HealthDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("health")
public class HealthApi {
   private static final Logger LOGGER =
           LoggerFactory.getLogger(HealthApi.class);
  
   @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
   public HealthDto getHealth(){
       LOGGER.info("Health GET API Called");
      
       var health = new HealthDto();
       health.setStatus("OK");
       return health;
   }
}
```
- Region 요청에 응답할 Controller 클래스:  presentation.api.RegionApi
```java
import com.adamsoft.backend.domain.service.RegionService;
import com.adamsoft.backend.presentation.dto.RegionDto;
import com.adamsoft.backend.presentation.dto.RegionsDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class RegionApi {
   private final RegionService regionService;
   private static final Logger LOGGER =
           LoggerFactory.getLogger(HealthApi.class);
  
   @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
   public RegionsDto getAllRegions(){
       LOGGER.info("getAllRegions");
      
       var allRegions = regionService.getAllRegions();
       var dtoList = new ArrayList<RegionDto>();
       allRegions.forEach(region -> {
           var dto = new RegionDto(region);
           dtoList.add(dto);
       });
       var regionsDto = new RegionsDto(dtoList);
       return regionsDto;
   }
}
```
- Controller 클래스 테스트
```java
HealthAPI를 테스트하기 위한 클래스를 만들고 테스트
import com.adamsoft.backend.presentation.api.HealthApi;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
public class HealthApiTest {

   @Test
   public void testHealthOk(){
       var api = new HealthApi();
       var health = api.getHealth();
       assertThat(health.getStatus()).isEqualTo("OK");
   }
}```

- RegionApi 메서드를 테스트하기 위한 클래스를 생성하고 테스트
```java
import com.adamsoft.backend.persistence.repository.RegionRepository;
import com.adamsoft.backend.presentation.api.RegionApi;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@SpringBootTest
public class RegionApiTest {
   @Autowired
   private RegionApi regionApi;

   @Mock
   private RegionRepository regionRepository;

   @Test
   public void testGetAllRegions() {
       var result = regionApi.getAllRegions();
       assertThat(result.getRegionDtoList()).hasSize(4);
   }
}
```

### 8)URL 테스트
- 서버 애플리케이션을 실행

- 브라우저나 Postman API 나 Selenium 같은 도구를 이용해서 확인

### 9)운용 환경으로 이전을 위한 작업
- 외부에서 접속할 수 있는 데이터베이스를 생성
  - RDS에서 데이터베이스 생성

- 생성한 데이터베이스에 테이블과 샘플 데이터를 추가
```sql
create table region(
	region_id SERIAL primary key,
	region_name VARCHAR(100) not null,
	creation_timestamp TIMESTAMP not null
);
insert into region(region_name, creation_timestamp)
values('서울', current_timestamp);
insert into region(region_name, creation_timestamp)
values('제주', current_timestamp);
insert into region(region_name, creation_timestamp)
values('목포', current_timestamp);
insert into region(region_name, creation_timestamp)
values('광주', current_timestamp);
```
- 서버 프로젝트의 application.properties를 수정해서 실행

### 10)현재 프로젝트를 도커 이미지로 만들어서 ECR에 업로드
- ECR에 레포지토리를 생성: k8s/backend-app
- 자신의 계정: 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app

- 이미지 빌드를 위한 도커 파일 생성
```Dockerfile
FROM amazoncorretto:17

CMD ["./mvnw", "clean", "package"]

ARG JAR_FILE=target/*.jar

COPY ./build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```
- 프로젝트 빌드
- 빌드 시 수행하는 사항
의존성 라이브러리를 다운로드

프로그램을 컴파일

테스트 프로그램 컴파일

테스트 실행

프로그램 실행을 위한 아카이브 파일(JAR, WAR 등, 테스트 부분은 제거) 생성

빌드 수행: ./gradlew clean build

- 이미지 생성
```
docker build -t 이미지이름 .
```
  - 이미지 이름이 계정.dkr.ecr.리전이름.amazonaws.com/레포지토리이름:태그 으로 만들어져야 합니다.
```
docker build -t 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:1.0.0 .
```
- ECR에 로그인
```
aws ecr get-login-password --region 실제리전 | docker login --username AWS --password-stdin 계정.dkr.ecr.실제리전.amazonaws.com
```
- ECR에 푸시
```
docker push 이미지

docker push 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:1.0.0
```
### 11)업로드 된 이미지 EKS에 배포
- 네임스페이스 생성
- 네임스페이스 용 yaml 생성: create_namespace_k8s.yaml
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: eks-work
```
- 실행: `kubectl apply -f create_namespace_k8s.yaml`
- 현재 컨텍스트 확인: `kubectl config get-contexts`

- 네임스페이스 반영
```
kubectl config set-context 컨텍스트이름 --cluster 클러스터이름 --user AUTHINFO값 --namespace 네임스페이스이름

kubectl config use-context 컨텍스트이름
```
- 현재 컨텍스트 확인: `kubectl config get-contexts`

- Application 배포
  - 배포를 위한 야믈 파일 생성

- Application 외부 공개