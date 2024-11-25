---
title: RDS S3
weight: 2
---
## 1.RDS
### 1)Data 저장소 종류
- RDBMS
  - 관계형 데이터베이스
  - 전통적으로 많이 사용하는 테이블 기반의 데이터베이스
  - 오버헤드가 큼(실제 데이터 저장이외의 다른 메타 데이터가 많이 필요)
  - 강한 트랜잭션을 사용하기 때문에 CUD 작업이나 오랜 시간 동안 안정적으로 저장하는 애플리케이션에 많이 이용
  - Amazon Aurora, RDS(Oracle, MySQL, Maria DB, Postgre SQL), Redshift 등을 지원

- Key-Value Database
  - Key를 이용해서 데이터를 구분하는 형태로 저장
  - 구조가 만들어진 테이블 대신에 구조가 없는 문서 구조의 컬렉션을 이용
  - 컬렉션 내부의 데이터로 자유로운 형태가 가능하지만 어느 정도는 정형화 됨
  - 조인의 개념이 존재하지 않고 링크 나 포함의 개념으로 표현
    - 링킹: 포인터를 기억
    - 임베딩: 객체 안에 저장
  - 유효성 검사를 하지 않기 때문에 읽기-쓰기 속도가 빠름
  - Amazon에서는 Dynamo DB
- In-Memory DB
  - 데이터를 메모리에 저장해서 사용하는 데이터베이스
  - 속도가 중요한 애플리케이션에 이용
  - Jenkins 나 Argo CD 등이 내부적으로 사용
  - Amazon에서는 Elastic Cache 그리고 Memory DB for Redis를 제공

- Document DB
  - 데이터를 하나의 문서로 취급하는 데이터베이스
  - Amazon의 Document DB(Mongo DB 호환)

- Wide Column
  - 관계형 데이터베이스 처럼 테이블, 컬럼, 로우 의 개념을 갖지만 컬럼 과 로우의 형태를 정해지지 않은 구조
  - Amazon에서는 Keyspace를 제공

- Graph
  - 데이터를 그래프 형태로 제공
  - 소셜 네트워킹, 추천 엔진, 부정 탐지 등에 활용
  - Amazon 에서는 Neptune을 제공

- TimeSeries
  - 시간(순서)이 중요한 데이터를 저장
  - 사물 인터넷, 산업용 텔레메트리, DevOps 등 에서 많이 활용
  - Amazon에서는 Timestream이라는 데이터베이스로 지원
- Ledger
  - 블럭 체인에서 사용하는 원장 저장
  - Amazon에서는 Ledger Database Service로 지원

### 2)Amazon의 RDS
- 개요
  - 관계형 데이터베이스 6종류를 클라우드에 최적화된 상태로 제공하는 서비스
  - Amazon Aurora, MySQL, Maria DB, Oracle, MS SQL Server, IBM DB3 를 지원
  - VPC 안에 인스턴스 형태로 구축(VPC안에서는 무료)
  - Managed Service이므로 업데이트 및 관리는 AWS에서 수행
  - AWS Database Migration Server를 사용하면 기존 데이터베이스를 이전하거나 복제하는 것도 가능
  - 사용에 따른 요금만 부과하는 경우도 있지만 Oracle 이나 MS SQL Server를 사용하는 경우에는 라이센스 비용도 지불해야 합니다.
- 장점
  - Managed Service
  - EC2와 연동이 쉽고 같은 네트워크에 구성하면 통신 비용이 무료
- 단점
  - 사용자가 자유롭게 사용할 수 없다는 단점
  - 

#### AZ vs Cluster
- 클러스터: 논리적으로 구분
- AZ: 물리적으로 구분, 재해 시 지장받지 않음
- 다중AZ DB 인스턴스 : 인스턴스 두 개 생성 후 동기화
  - 로드밸런서를 달아 읽기를 두 곳중 하나에서 실행
  - 쓰기는 한곳에서만 가능
  - 비용이 더 비쌈

#### S3 자격 증명 관리
- 자체 관리 선택 후 암호 입력

#### S3 VPC
- VPC는 가용영역에 생성하기 때문에 수정이 불가

#### spring 연습할 것
- transaction
- reactive
- batch
- JPA는 인터페이스, hibernate가 실제 구현체
- AOP
- Interception

## 2.S3
### 1)AWS를 이용한 백업
- 백업의 형태
  - 온프레미스 환경의 데이터를 AWS로 백업
  - AWS에 구축한 시스템을 백업
- 백업을 위한 인프라 설계 사항
  - 스토리지 게이트웨이를 이용한 자동 백업: 온프레미스 환경에 스토리지 게이트웨이를 만들어서 백업용 스토리지를 만들고 자동 백업
  - S3와 글레이셔로 수명주기를 관리: 로그 파일을 S3에 백업을 하고 온라인 보관 기간을 넘은 파일을 글레이셔에 아카이브
  - 용량의 대부분을 차지하는 이미지 파일이나 데이터베이스는 스토리지 게이트웨이보다는 S3를 이용해서 백업
- AWS의 백업 방법
  - 스토리지 게이트웨이   
    적은 노력으로 자동 백업 환경을 구축할 수 있음   
    비용이 다른 방식보다 비쌈
  - S3   
    백업 대상이 파일인 경우 간편   
    범용적인 파일 저장 서비스이고 온라인 파일 서버처럼 사용 가능   
    서로 다른 가용 영역에 3중화 되어 있으므로 99.99999999% 정도의 가용성
  - Glacier   
    파일을 압축해서 저장   
    가장 저렴   
    읽는 속도가 느림

### 2)S3 개요
- S3(Simple Storage Service)는 인터넷 스토리지 서비스
- 용량에 관계없이 파일을 저장할 수 있고 웹에서 파일에 접근할 수 있으면 안정성이 뛰어나고 가용성이 높으며 무제한 확장이 가능
- 대용량 백업을 EC2(인스턴스) 와 EBS(저장 장치)를 통해 구현한다면 많은 비용이 들고 노력이 요구되지만 S3를 이용하면 쉽게 구축이 가능
- 정적 웹 사이트를 배포하고자 하는 경우 S3에서는 별다른 설치없이 바로 배포가 가능
- S3 자체가 수천 대 이상의 매우 성능이 좋은 웹 서버로 구성이 되어 있어서 Auto Scaling 이나 Load Balancing 을 신경쓰지 않아도 됨
- 파일 업로드 와 다운로드를 HTTP 프로토콜로 처리하기 때문에 별도의 클라이언트 나 Active X 없이 사용 가능
- 넷플릭스의 콘텐츠 그리고 Airbnb의 사용자 사진이나 백업 데이터 그리고 정적 파일을 Amazon S3에 저장해서 사용하고 있음
- S3를 사용하지 않으면 로드밸런서와 파일 서버를 직접 만들어야 함

### 3)기본 개념
- 객체
  - 파일과 메타 데이터로 이루어진 데이터 저장의 기본 단위
  - 키가 객체의 식별자가 되고 값이 객체의 데이터
  - 객체의 크기는 1KB 부터 5TB 까지
  - 메타 데이터는 MIME 형식으로 확장자를 통해서 자동 설정되고 사용자가 임의 지정도 가능
  - 근본적으로 파일이름은 확장자도 포함 -> 실행하기 위해 사용자가 파일 종류 판단해야 함
    - MIME 타입: email에서 마지막 . 뒤에 이름을 추가 생성해서 어떻게 실행될지 결정
- Bucket
  - S3에서 생성하는 최상위 디렉터리
  - 리전 별로 생성되고 계정 별로 100개 까지 생성 가능
  - 객체를 바로 저장할 수 있고 디렉터리를 만들어서 저장하는 것도 가능
  - 접속 제어 및 권한 관리가 가능: 읽기만 가능이나 쓰기 가능 설정 가능
  - URL로 접근 가능
- 요금은 저장 용량과 데이터 전송량 그리고 HTTP Request 개수로 책정

### 4)외부에서 사용(Application)하고자 하는 경우
- IAM에서 S3 Full Access 권한을 가진 사용자를 생성하고 그 사용자에 대한 Access Key와 Secret Access Key를 발급 받아서 사용
- 키 발급
  - IAM 서비스에 접속
  - 새 사용자 생성을 눌러서 사용자를 생성하는데 권한은 S3 Full Access 와 Cloud Front Action   
    기존 사용자가 있는 경우 생성하지 않아도 됨
  - 사용자를 선택하고 [보안 자격 증명] 탭에서 [액세스 키 생성]을 선택해서 키를 발급받고 csv 파일을 다운로드

### 5)버킷 생성
- S3 서비스에서 시작
- 버킷 생성
  - 버킷만들기 -> 외부에서 접근하려면 [ACL 활성화됨] 클릭 -> [모든 퍼블릭 액세스 차단 해제]
  - 버킷을 생성하면 업로드는 할 수 있지만 외부에서 다운로드는 할 수 없도록 생성됨
  - 다운로드가 가능하도록 하려면 버킷의 정책을 수정해야 함
- 버킷의 정책 수정: 빨간색 부분은 실제 버킷으로 수정 - 버킷에 저장된 객체의 목록 가져오기 와 목록에 삽입, 삭제, 다운로드 권한입니다.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicListGet",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:List*",
                "s3:Get*",
                "s3:Put*",
                "s3:Delete*"
            ],

            "Resource": [
                "arn:aws:s3:::itstudybucket",
                "arn:aws:s3:::itstudybucket/*"
            ]
        }
    ]
}
```
- 버킷의 권한 중에서 CORS 정책 추가
```json
[
	{
    	"AllowedHeaders": [
        	"*"
    	],
    	"AllowedMethods": [
        	"GET",
        	"PUT",
        	"POST",
        	"DELETE"
    	],
    	"AllowedOrigins": [
        	"*"
    	],
    	"ExposeHeaders": ["Access-Control-Allow-Origin"]
	}
]
```
### 6)Spring Boot Application에서 S3 사용
- Spring Web, Lombok, Spring Dev Tools 의 의존성을 가진 프로젝트 생성
- Spring Boot Application에서 AWS를 사용하기 위한 의존성을 build.gradle의 dependencies에 추가
```
implementation 'io.awspring.cloud:spring-cloud-starter-aws:2.3.1'
```
- application.properties 파일에 S3 사용을 위한 속성을 설정
  - 이 부분을 외부에 노출시키게 되면 AWS 계정이 중지가 될 수 있으므로 소스 코드에 추가하는 것은 조심해야 합니다.
```{filename="application.properties"}
spring.application.name=FileUpload
cloud.aws.credentials.access-key=
cloud.aws.credentials.secret-key=

cloud.aws.s3.bucket=dragonhailstone
cloud.aws.region.static=ap-northeast-2
cloud.aws.stack.auto=false

# 스프링에서 파일 업로드 할 때 제약 사항
# 파일한개 크기 20MB까지
spring.servlet.multipart.max-file-size=20MB
# 파일 전체 크기 20MB까지
spring.servlet.multipart.max-request-size=20MB
```
- 파일 업로드 처리를 할 때 발생할 예외 처리할 클래스를 생성: FileUploadFailedException
```java {filename="FileUploadFailedException.java"}
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Component
@RestControllerAdvice
public class FileUploadFailedException {
   @ExceptionHandler(MaxUploadSizeExceededException.class)
   protected ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
       ErrorResponse response = ErrorResponse.builder(ex, HttpStatus.BAD_REQUEST, "용량 초과").build();
       return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
   }
}
```
- 업로드할 파일 경로를 만드는 메서드를 소유한 클래스를 생성 - CommonUtils 
  - 이 클래스의 메서드 내용은 서비스 클래스에 구현해도 되지만 되도록이면 서비스 클래스에서는 업무 로직 과 관련된 부분만 수행하는 것이 좋습니다.

```java {filename="CommonUtils.java"}
public class CommonUtils {
    private static final String FILE_EXTENSION_SEPARATOR = ".";
    private static final String CATEGORY_PREFIX = "/";
    private static final String TIME_SEPARATOR = "_";

    public static String buildFileName(String category, String originalFileName) {
        //원본 파일 경로에서 .의 마지막 위치를 찾아냅니다.
        int FileExtensionIndex = originalFileName.lastIndexOf(FILE_EXTENSION_SEPARATOR);
        //파일의 확장자 추출
        String fileExtension = originalFileName.substring(FileExtensionIndex);
        //파일 이름 추출
        String fileName = originalFileName.substring(0, FileExtensionIndex);
        //현재 시간 추출
        String now = String.valueOf(System.currentTimeMillis());
        
        // 동일한 파일이름을 만들지 않기 위해서 중간에 현재 시간을 추가
        // 파일 이름이 키가 되서 저장되기 때문에 중복된 파일 이름이 있으면 뒤의 파일이 업데이트
        return category + CATEGORY_PREFIX + fileName + TIME_SEPARATOR + now + fileExtension;
    }
}
```
- 파일 업로드 DB 사용 이유: 파일 업로드를 빠르게 확인하기 위해
  - DB: 파일 이름 저장 -> 조회시 DB에서 조회
- 빌더 패턴: 속성 설정이 많이 필요할 때 필요한 속성만 설정 가능

- 비지니스 로직을 처리하기 위한 서비스 클래스를 생성: AwsS3Service - 실제 구현을 할 때는 이 부분은 인터페이스를 먼저 만들고 클래스를 만들어야 합니다.

- 서비스 메서드를 가진 인터페이스 생성
```java {filename="AwsS3Service.java"}
import org.springframework.web.multipart.MultipartFile;

public interface AwsS3Service {
   public String uploadFile(String category, MultipartFile multipartFile);
}
```
- 서비스 클래스를 생성
```java {filename="AwsS3ServiceImpl.java"}
package com.gmail.dragonhailstone.fileupload;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@RequiredArgsConstructor
@Service
public class AwsS3ServiceImpl implements AwsS3Service {
    private AmazonS3 amazonS3Client;

    //properties에서 값을 가지고 와서 설정
    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    //생성자가 호출된 후에 수행할 메서드
    @PostConstruct
    public void setS3Client(){
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        amazonS3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }

    //업로드 할 파일 존재 여부를 리턴해주는 메서드
    private boolean validateFileExists(MultipartFile multipartFile) {
        boolean result = true;
        if(multipartFile.isEmpty()){
            result = false;
        }
        return result;
    }

    @Override
    public String uploadFile(String category, MultipartFile multipartFile) {
        boolean result = validateFileExists(multipartFile);
        if(result == false){
            return null;
        }
        //파일 경로 생성
        String fileName = CommonUtils.buildFileName(category, multipartFile.getOriginalFilename());
        //파일 업로드 준비
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(multipartFile.getContentType());
        try(InputStream inputStream = multipartFile.getInputStream()){
            amazonS3Client.putObject(new PutObjectRequest(bucketName, fileName, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        }catch(IOException e){
            return null;
        }
        return amazonS3Client.getUrl(bucketName, fileName).toString();
    }
}
```