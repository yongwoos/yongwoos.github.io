---
title: File Handling
linkTitle: File Handling
weight: 9
---

- File은 Disk에 존재하고 운영체제가 관리하는 자원
  - File 입출력을 할 때는 스레드 프로그래밍을 이용하는 것이 좋고 버퍼링을 고려해봐야 함
  - python이 생성한 자원이 아니므로 자원의 존재 여부는 python이 알 수 없으므로 예외처리를 해주는 것이 좋음
  - buffer->OS->native method 호출->파일쓰기
- 기록을 할 때 flush
- 주기억장치: buffering 보조기억장치: spooling

### 파일 처리 과정
1. 파일 열기
2. 파일에 읽기/쓰기
3. 파일 닫기

### open 함수
- 파일을 열어주는 함수
- `open(파일 경로, 모드 - 열기와 쓰기, 인코딩방식)`
- 기록을 할 때는 `write`나 `writelines(\n)` 등을 이용해서 기록
- 읽을 때는 `read`나 `readline` 또는 `readlines` 함수를 이용해서 읽기
- 모드 r(read), w(write-없으면 만들고 있으면 처음부터 기록), x(배타적 생성 모드-파일이 존재하면 IOError 예외 발생), a(맨 뒤에 추가), b(바이너리-파일의 내용을 바이트 단위로 읽어내는 것: 텍스트 파일이 아닌 경우), t(텍스트모드), +(읽기 쓰기용)

### close 함수
- 연 파일을 닫는 함수

### 파일에 문자열 기록
```python
try:
    # 파일 기록 모드로 열기
    file = open("./test.txt", "w")
    file.write("Hello")
    file.write("\n")
    file.writelines("Hi\nWelcome\n")
except Exception as e:
    print("파일 쓰기 중 예외 발생:", e)
finally:
    file.close()
```
```python
try:
    # 기본적인 읽기는 이터레이터 형식 - 한 번 읽으면 다시 못 읽음
    # 다시 읽고자 하는 경우는 open 부터 다시 해야함
    file = open("./test.txt", "r")
    content = file.read()
    print(content)
    # 줄단위 읽기
    # for line in file:
    # print(line)
except Exception as e:
    print("파일 쓰기 중 예외 발생:", e)
finally:
    file.close()
```
### with 구문
- 파일은 열면 반드시 닫아 주어야 함
  - 닫아 주지 않으면 운영체제는 사용 중인 것으로 판단해서 다른 프로그램에서 이 파일을 읽기 모드로만 사용하도록 함
- `with open() as 임시변수`: 이 문법을 이용해서 파일을 열면 블럭이 끝날 때 예외 발생 여부에 상관없이 파일을 닫아 줌
```python
# with 블럭을 사용하면 with 안에서 개방한 파일은 닫지 않아도 블럭이 끝나면 자동으로 닫아줌
with open("./test.txt", "r") as file:
    for line in file:
        print(line)
```
### 데이터를 표현하기 위한 텍스트 파일
- fwf: 일정한 간격을 가지고 문자열을 나열해서 데이터를 표현
```
이름    나이    주소
아담    34      서울시 양천구
카리나  27      창원
```
- txv: 탭으로 구분한 문자열을 이용해서 데이터를 표현
- csv(Comma Separated Values): 콤마를 이용해서 구분한 문자열을 이용해서 데이터를 표현
  - Open API에서 변하지 않는 고정된 데이터를 제공할 때 주로 이용
  - 변하는 데이터의 경우 예전에는 XML, 최근에는 JSON을 주로 이용

### csv 읽기
- 텍스트 파일 읽기를 이용한 후 split 같은 메서드를 이용해서 분할해서 사용
- split은 하나의 문자열을 매개변수 단위로 쪼개서 list로 리턴해주는 메서드
- 파이썬의 내장 모듈인 csv 모듈 활용
- 외부 라이브러리(pandas)로 제공되는 csv 읽는 메서드 활용: 여러 옵션을 활용할 수 있음 - 복잡한 파일에 적합
```python
# with 블럭을 사용하면 with 안에서 개방한 파일은 닫지 않아도 블럭이 끝나면 자동으로 닫아줌
with open("./test.csv", "r", encoding="utf8") as file:
    datas = file.readline()
    print(datas)
    print(data.split(","))
    sample = file.readlines()
    print(sample)
```
### 바이너리 파일
- 바이트 단위로 읽고 쓰는 파일
- 문자열을 직접 기록하지 않고 byte 배열로 변환해서 기록
  - 문자열을 바이트 배열로 변환할 때는 encode 메서드 이용하고 반대로 바이트 배별을 문자열로 변환할 때는 decode 메서드 이용
  - 이기종 시스템 간에 문자열을 주고 받을 때는 문자열을 직접 주고 받지 않고 바이트 배열을 이용하는 경우도 있음
  - 받는 쪽에서 디코딩을 해서 사용
  - 요즘은 채팅이 아니라면 이런 방식보다는 xml이나 json을 주고 받으라 함
- encoding: 데이터를 메모리에 저장되는 형태로 변경하는 작업
- decoding: 메모리에 저장된 형태를 사람이 볼 수 있는 형태로 변경하는 것
```python
with open("./test.bin", "wb") as f:
    # 문자열을 byte 배열(bytes)로 변환해서 기록
    f.write("안녕".encode())

with open("./test.bin", "rb") as f:
    byteArray = f.read()
    print(byteArray) # 웹에서 ajax로 데이터 불러왔을 때 바로 출력하면 이 형태로 보임
    print(byteArray.decode())
```

### 한글 인코딩
- euc-kr: 초창기 웹 한글
- cp949, ms949: 윈도우한글, 메모장에서 사용
- utf8: 현재 사용
- utf8mb4: 이모티콘

### Serializable
- 인스턴스 단위로 파일에 저장하는 것
- 응용 프로그램을 만들 때 사용하는 방법으로 파일이 존재한다고 하더라도 원본 클래스가 없으면 해석이 불가능
- 파이썬에서는 피클링 모듈이나 DBM 관련 모듈을 이용해서 작업
- 파일에 내용을 기록: `pickle.dump(객체, 파일객체)`
- 파일에서 내용을 읽어오기: `pickle.load(파일객체)`나 `pickle.loads(파일객체)`
```python
import pickle
class VO:
    def __init__(self, num=0, name=""):
        self.__num = 0
        self.__name = name

    def setNum(self, num):
        self.__num = num
    def setName(self, name):
        self.__name = name
    
    def getNum(self):
        return self.__num
    def getName(self):
        return self.__name
    # 인스턴스를 출력하기 위해서 인스턴스를 참조하는 데이터를 출력하는 함수에 대입했을 때 호출되는 메서드
    def __str__(self):
        return f"번호:{self.__num} 이름:{self.__name}"

data1 = VO(1, "아담")
data2 = VO(2, "이브")
# 객체를 파일에 직접 저장 - Serializable
li = [data1, data2]
with open('./test.txt', 'wb') as f:
    pickle.dump(data1, f)
    pickle.dump(li, f) # 여러 파일 저장

with open('./test.txt', 'rb') as f:
    data1 = pickle.load(f)
    print(data1)
    datas = pickle.load(f)
    for data in datas:
        print(data)
```

### 압축
- 압축을 하는 이유는 여러 개의 파일을 하나로 만들어서 사용하거나 크기를 줄이기 위해서 사용
- 클라우드에서 데이터를 백업하는 방식은 데이터베이스, 파일, 압축 파일 3종류가 있음
  - 데이터베이스가 사용하기는 가장 편리하지만 오버헤드가 가장 큼
  - 파일은 데이터베이스 보다는 오버헤드가 적지만 사용 방법은 조금 더 어려움
  - 파일을 압축해서 저장하면 가장 사이즈가 작아지지만 사용을 할 때 압축을 해제해서 사용해야 함
- 오래되고 당장 사용을 하지 않을 것 같은 파일은 압축해서 보관하는 것이 좋음
- 파이썬은 기본적으로 zip과 tar 압축 모듈을 제공
- zip은 `zipfile`이라는 모듈의 `ZipFile`이라는 함수를 이용해서 객체를 생성하고 `write`함수로 압축
  - 압축해서는 `extractall` 함수를 이용
  - 리눅스 압축 표준은 tar라는 `tafile`이라는 모듈의 `open`함수를 이용해서 객체를 만들고 `add`를 이용해 압축 수행, `extractall` 함수를 이용해 압축 해제
```python
import zipfile

with zipfile.ZipFile("test.zip", "w") as myzip:
    # 압축할 파일 경로
    filelist = ["data.csv", "test.bin", "test.txt"]
    for imsi in filelist:
        myzip.write(imsi)

zipfile.ZipFile("./test.zip").extractall()
```
### 로그 파일 읽기
- Tomcat의 로그 파일 형식
- 208.100.26.232 - - [15/Nov/2015:10:45:11 +0000] "GET / HTTP/1.0" 404 2051
- 첫번째 항목은 접속한 컴퓨터IP
- 마지막 항목은 트래픽
- 저 파일의 내용을 읽어서 트래픽의 합계 구하기
- IP 별 트래픽의 합계 구하기
```python
with open("log.txt", "r") as f:
    ipDict = {}

    logs = f.readlines()
    for log in logs:
        # 공백을 기준으로 분할
        data = log.split()
        # 마지막 데이터를 정수로 변환해서 tot에 추가 - 예외가 발생하면 0을 추가
        try:
            # data[0]를 키로 해서 데이터가 존재하면 데이터에 없으면 0에 트래픽을 추가
            # 예외가 발생하면 0을 더해줌
            ipDict[data[0]] = ipDict.get(data[0], 0) + int(data[-1])
        except:
            ipDict[data[0]] = ipDict.get(data[0], 0) + 0
    print(ipDict)
```