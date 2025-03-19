---
title: Shell Programming
weight: 3
---
## Shell Programming
- 리눅스의 셸 스크립트는 C언어와 유사한 방법으로 프로그래밍 할 수 있음
- 셸 스크립트 파일의 확장자는 sh
- 최상단에는 #!/bin/sh 를 추가 -> 셔뱅: bash 셸을사용하겠다는 의미
- #으로 시작하면 주석이지만 #!는 주석이 아님

### 스크립트 파일 실행 방법
- sh 스크립트 파일경로 - 읽기 권한만 있으면 실행
- 스크립트 파일의 경로 - 현재 디렉터리에 있는 경우 ./ 를 추가해서 경로를 작성, 실행 권한 필요
```bash
./test.sh
sh test.sh
```

### 변수
- 기본적으로 변수에 넣는 값은 전부 문자열로 취급
- 변수 이름은 대소문자 구분
- 데이터 대입시 = 좌우에 공백 없어야
- 값에 공백이 있는 경우는 ""로 묶어 줘야
- $가 들어간 내용 출력시 "로 묶어주거나 \ 붙여줘야

### 계산식 사용
- 백틱 안의 expr로 시작해서 작성
- 수식에 괄호를 사용하거나 곱하기인 *를 사용힐 때는 \ 를 붙여야
  ```bash
  n=`expr 100 + 200`
  n=`expr 100 \* 300`
  echo $n
  ```

### 파라미터 설정
- 실행할 때 같이 넘겨주는 데이터
- 파라미터를 사용할 때는 $파라미터위치
- $0은 파일명
```bash
  vi param.sh
  1 #! /bin/sh$
  2 echo "$0 $1 $2"$
  3 echo "$2"$

  chmod 775 param.sh
```

### 제어문
#### if
```bash
if [ 표현식 ]
then
    참일 때 수행할 내용
else
    거짓일 때 수행할 내용
fi
```
```bash
파일 경로 조건
  -d 파일경로: 디렉터리이면 참
  -e 파일경로: 존재하면 참
  -f 파일경로: 일반 파일이면 참
  -g 파일경로: setGID가 설정되면 참
  -r 파일경로: 읽기 가능이면참
  -s 파일경로: 크기가 0이 아니면 참
  -u 파일경로: setUID가 설정되면 참
  -w 파일경로: 쓰기 가능이면 참
  -x 파일경로: 실행 가능이면 참d
```

- /lib/systemd/system/cron.service 라는 파일의 존재 여부를 확인해서 존재하면 존재한다고 않다고 메시지 출력

```bash
  1 #! /bin/sh
  2 if [ -f /lib/systemd/system/cron.service ]
  3 then
  4   echo Hello World
  5 else
  6   "No FILE"
  7 fi
```

#### case - esac
- 값으로 분기
- 형식
  ```bash
  case 데이터 in
        값)
            값일 때 수행할 내용
        값)
            값일 때 수행할 내용
        *)  
            나머지 경우 수행할 내용
  esac
  ```
  - case 구문에 각 값 안에서 여러 개의 실행문을 작성할 수 있기 때문에 내용을 작성할 때 마지막에 ;; 를 추가해줘야함
  - 여러 개의 값에 동일한 내용을 수행하고자 하는 경우는 ```값 | 값``` 형태로 작성
```bash
#! /bin/sh

case "$1" in
s | S | start)
  echo "HI";;
e)
  echo "E";;
*)
  echo "NO OHTER";;
esac
```

#### and, or
- and - &&, -a
- or - ||, -o
- `if [조건] && [조건]` 의 형태로 입력
- lib/systemd/system/cron.service 가 있고 홈 디렉터리에 if.sh파일이 있다면 성공 그렇지 않다면 실패라고 출력
  ```bash
  #! /bin/sh
  if [ -f /lib/systemd/system/cron.service ] && [ -f ~/if.sh ]
  then
      echo "success"
  else
      echo "fail"
  fi
  ```
#### for ~ in
- 형식
  ```bash
  for 임시변수 in 데이터나열
  do
      데이터를 임시변수에 하나씩 대입하고 수행할 문장
  done
  ```
  ```bash
  for i in 1 2 3 4 5
  do
      hap=`expr $hap + $i`
  done
  echo $hap
  ```
- 현대 디렉터리의 모든 txt 파일을 읽어서 내용을 출력
  ```bash
  for fname in $(ls *.txt)
  do
      cat $fname
  done

#### while
- 표현식이 거짓이 될 때까지 반복
- 형식
  ```bash
  while [표현식]
  do
      표현식이 거짓이 아니면 수행할 내용
  done
  ```
- 1부터 5까지의 합
  ```bash
  hap=0
  i=1
  while [ $i -le 5 ]
  do
      hap=`expr $hap + $i`
      i=`expr $i + 1`
  done
  echo "Total: $hap"
  ```
#### 기타 제어문
- break, for 나 while을 강제로 중단하고자 할 때 사용
- until: 반복문
- continue: for나 while의 시작 부분으로 이동
- exit: 프로그램 완전히 종료, 상위 프로세스에게 넘겨줄 정수를 같이 사용 `exit 0`
- return: 함수를 호출한 곳으로 돌아가는 제어 명령

### Function
- 자주 사용하는 구문을 묶어서 하나의 이름으로 사용하는 것
- 메모리를 별도로 할당 받아서 사용

#### 생성
```bash
이름(매개변수 나열){
    함수 내용
    return
}
```

#### 호출
- `함수이름(매개변수)`
- 매개변수가 없는 경우 이름만으로 호출 가능
  
```bash
myfunc () {
  echo "My Function"
  return
}
myfunc
exit 0
```

#### eval
- 문자열을 명령으로 수행
- 파이썬이나 자바스크립트에서 이 함수가 문자열을 데이터로 치환
  ```bash
  ls -l
  eval "ls -l"
  ```