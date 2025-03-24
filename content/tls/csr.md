---
title: CSR
weight: 3
---
## **CSR (Certificate Signing Request, 인증서 서명 요청)**  

CSR은 **인증서를 발급받기 위한 요청 파일**입니다.  
서버(또는 클라이언트)가 **공개 키(Public Key)**와 함께 자신의 정보를 포함하여 CA(인증 기관)에 제출하는 문서입니다.  

---

## **1. CSR에 포함되는 정보**
CSR 파일에는 다음과 같은 정보가 포함됩니다.

| 항목 | 설명 |
|------|------|
| **공개 키 (Public Key)** | 인증서에 포함될 공개 키 |
| **CN (Common Name)** | 서버의 도메인 이름 (예: `example.com`) |
| **O (Organization)** | 조직명 (회사 이름) |
| **OU (Organizational Unit)** | 부서명 (예: IT, Security 등) |
| **L (Locality)** | 도시명 |
| **ST (State/Province)** | 주/도 이름 |
| **C (Country)** | 국가 코드 (예: `KR` for South Korea) |
| **이메일 (Email Address)** | 인증서 관리자 이메일 (선택 사항) |

---

## **2. CSR 생성 과정**
CSR은 일반적으로 **서버에서 자체 생성**한 후 CA에 제출합니다.

### **📌 CSR 생성 과정 (서버 측)**
1️⃣ **비대칭 키(공개 키 & 비밀 키) 생성**  
서버에서 **RSA 키 페어**를 생성합니다.

```bash
openssl genrsa -out private.key 2048
```
- `private.key` → 서버의 **비밀 키(Private Key)**  
- 공개 키는 이 비밀 키에서 파생됩니다.

2️⃣ **CSR 파일 생성**  
이제 **CSR 파일을 생성**합니다.

```bash
openssl req -new -key private.key -out request.csr
```

3️⃣ **정보 입력**  
위 명령어를 실행하면 다음과 같은 정보를 입력해야 합니다.

```
Country Name (2 letter code) [XX]: KR
State or Province Name (full name) []: Seoul
Locality Name (eg, city) [Default City]: Seoul
Organization Name (eg, company) [Default Company Ltd]: Example Inc.
Organizational Unit Name (eg, section) []: IT Department
Common Name (e.g. server FQDN or YOUR name) []: example.com
Email Address []: admin@example.com
```
- `Common Name(CN)`은 **서버 도메인**이어야 합니다.  
  예) `example.com` 또는 `www.example.com`  

---

## **3. CA에 CSR 제출 및 인증서 발급**
서버에서 생성한 `request.csr` 파일을 **CA에 제출**하면, CA는 검증 후 **디지털 인증서(Certificate)**를 발급해줍니다.

🔹 **무료 CA**: Let's Encrypt  
🔹 **유료 CA**: DigiCert, GlobalSign, Verisign 등  

### **📌 CA가 CSR을 처리하는 과정**
1️⃣ **CA가 CSR에 포함된 정보를 검토**  
2️⃣ **도메인 소유권 및 조직 인증 수행**  
3️⃣ **CSR의 공개 키를 기반으로 인증서 발급**  
4️⃣ **서버는 CA에서 발급된 인증서를 받아 설치**  

**발급된 인증서 파일 예시**:
```plaintext
server.crt  (인증서 파일)
private.key  (비밀 키, 서버에서 생성한 것)
```

---

## **4. CSR과 TLS 인증 과정**
CSR은 **서버의 공개 키를 CA에게 검증 요청하는 과정**입니다.  
🔹 **TLS(HTTPS) 연결 과정에서 CSR은 사용되지 않으며**, 인증서를 발급받을 때만 사용됩니다.

### **📌 TLS 과정에서 CSR은 어떻게 활용될까?**
1. 서버가 **CSR을 생성**하여 CA에게 제출  
2. CA는 **CSR을 검증 후 인증서(server.crt) 발급**  
3. 서버는 **인증서를 클라이언트(TLS 요청자)에게 제공**  
4. 클라이언트는 **CA의 서명을 검증**하여 서버를 신뢰할지 결정  

---

## **5. CSR 관련 명령어 정리**
🔹 **RSA 개인 키(비밀 키) 생성**
```bash
openssl genrsa -out private.key 2048
```
🔹 **CSR 파일 생성**
```bash
openssl req -new -key private.key -out request.csr
```
🔹 **CSR 내용 확인**
```bash
openssl req -text -noout -verify -in request.csr
```

---

## **6. 요약**
✅ **CSR (Certificate Signing Request)**은 **CA에게 인증서를 요청할 때 사용하는 파일**  
✅ CSR에는 **서버의 공개 키 & 조직 정보 & 도메인 이름**이 포함됨  
✅ CSR을 CA에 제출하면, **검증 후 인증서(server.crt)가 발급됨**  
✅ CSR은 **TLS 과정에서 직접 사용되지 않으며, 인증서를 발급받는 데만 사용됨**  

---

CSR 및 인증서 발급 과정에 대해 더 궁금한 점 있으면 질문 주세요! 😊

네, 정확합니다! CSR을 제출한 후 CA(인증 기관)가 서버의 인증서를 발급하는 과정은 다음과 같습니다.  

---

### **📌 1. 인증서 발급 과정 (CA 서명 과정)**  
1️⃣ **서버가 CSR(Certificate Signing Request) 생성**  
   - 서버는 **공개 키**와 함께 자신의 정보를 포함한 `request.csr`을 생성하여 CA에 제출합니다.  
   
2️⃣ **CA가 CSR을 검토하고 인증서 발급**  
   - CA는 CSR의 정보를 확인하고, 서버의 공개 키가 포함된 데이터를 **CA의 개인 키(Private Key)로 서명**하여 **디지털 인증서(서버 인증서, server.crt)를 발급**합니다.  

3️⃣ **서버는 CA에서 발급한 인증서를 클라이언트에 제공**  
   - 발급된 `server.crt`를 웹 서버에 설치하면, 클라이언트(TLS 요청자)에게 제공됩니다.  

---

### **📌 2. 클라이언트 인증서 검증 과정**  
1️⃣ **클라이언트는 서버의 인증서를 다운로드**  
   - 클라이언트가 `server.crt`(CA가 서명한 인증서)를 받습니다.  

2️⃣ **클라이언트는 CA의 공개 키(Public Key)로 인증서 서명 검증**  
   - 클라이언트는 **CA의 공개 키**(CA가 미리 신뢰할 수 있는 루트 인증서에 포함됨)를 사용하여 `server.crt`의 서명을 복호화합니다.  
   - 복호화한 내용이 인증서의 해시값과 일치하면, 인증서가 위변조되지 않았음을 확인할 수 있습니다.  

3️⃣ **서버의 도메인과 인증서 정보 확인**  
   - `server.crt`에 포함된 **CN(Common Name, 도메인)**이 요청한 서버 도메인과 일치하는지 확인합니다.  

4️⃣ **검증이 완료되면 TLS 핸드셰이크 진행**  
   - 클라이언트는 서버를 신뢰하고 **TLS 암호화 통신**을 시작합니다.  
   - 이후 대칭키(세션키)를 생성하여 데이터를 암호화하고 통신을 진행합니다.  

---

### **📌 3. 전체 과정 요약**
✔ **CSR 제출** → 서버는 공개 키와 정보를 포함한 CSR을 CA에 제출  
✔ **CA 서명** → CA는 CSR을 검토 후 **CA의 개인 키로 서명**하여 서버 인증서 발급  
✔ **클라이언트 검증** → 클라이언트는 **CA의 공개 키로 인증서 서명을 검증**  
✔ **TLS 세션 시작** → 검증이 완료되면 **대칭키(세션키)로 안전한 통신 시작**  

---

## **🎯 정리**
✅ CSR은 **CA에게 인증서를 요청하는 과정**일 뿐, 직접 통신에 사용되지 않음  
✅ CA는 **CSR의 공개 키를 포함한 정보를 CA의 개인 키로 서명하여 인증서(server.crt)를 발급**  
✅ 클라이언트는 **CA의 공개 키로 서버 인증서의 서명을 복호화하여 검증**  
✅ 검증이 완료되면 **TLS 핸드셰이크를 진행하여 보안 통신**  

이해가 잘 되었나요? 더 궁금한 점 있으면 질문 주세요! 😊