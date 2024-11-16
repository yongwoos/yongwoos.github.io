---
title: git hub 협업
weight: 2
---
## git hub 협업
### clone
- 원격 저장소의 내용을 가져오는 명령
  - `git clone 원격저장소URL [디렉터리이름]`
  - 디렉터리 이름을 생략하면 프로젝트 이름으로 생성
- 여러 개발자가 하나의 github 레포지토리를 공유하고자 하는 경우
  - git hub의 repository에서 Setting 를 클릭
  - collaborators 클릭
```
Working Dir --------------------------->Staging Area ----> Local Repositories
git init: 디렉터리 안에 .git 디렉터리 생성
git add .
                                          git commit        push, pull
```
### 1. 준비
- 하나의 디렉토리를 생성하고 git hub repository 와 연결
  - 디렉토리를 생성하고 파일을 하나 만든 후 저장
  - 작업 디렉토리 와 git 연결: `git init`
  - Staging Area에 모든 파일을 추가: `git add .`
  - Local Repository에 변경 내역 반영: `git commit -m "git team init"`
  - 원격 레포지토리 생성: https://github.com/dragonhail/1104.git
  - 원격 레포지토리 등록: `git remote add 저장소이름 githubURL`
  - 처음 연결할 때는 관례적으로 저장소 이름을 origin 으로 사용
  - 저장소 확인은 `git remote -v`
  - 연결 해제는 `git remote remote 저장소이름`
  - 변경된 내역을 원격 레포지토리에 반영: `git push 저장소이름 브랜치이름`
  - 현재 브랜치 확인: `git branch`
  - git push origin main error 발생<br>
    origin 이라는 없어서 에러가 발생: 저장소 이름 다시 생성
  ```
  error: src refspec main does not match any
  error: failed to push some refs to 'https://github.com/itggangpae/git1104.git'
  ```
  - 저장소의 URL을 다시 설정: `git remote set-url origin https://계정이름@github.com/계정이름/저장소이름.git`
  - 원격 저장소의 브랜치 와 로컬 저장소의 브랜치가 다를 때 원격 저장소에 강제로 브랜치를 생성해서 push(--set-upstream 대신에 -u 옵션을 사용해도 가능) `git push --set-upstream origin master`

### 2. 저장소 복제(계정에 상관없이 수행)
- `git clone 원격저장소URL`

### 3. 다른 계정에서 push
- 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->아래와 같은 에러 발생: 다른 계정의 저장소에는 기본적으로 접근이 안됩니다.
```
remote: Permission to itggangpae/git1104.git denied to itstudy001.
fatal: 'https://github.com/itggangpae/git1104.git/'에 접근할 수 없습니다: The requested URL returned error: 
```
- 다른 계정에서 원격 저장소를 공유하고자 하는 경우에는 Collaborator로 추가를 해주어야 합니다.
### 2. 원격 저장소 공유
- 저장소를 만든 계정에서 [Settings]로 가서 [Collaborators]를 선택하고 [Add People]을 누르고 공유할 계정을 검색해서 추가를 누르면 계정의 유저에게 이메일이 전송됨
- 협업을 할 계정에서 승인을 해주면 저장소 공유가 가능
- Collaborator로 등록이 되면 저장소를 공유해서 push 나 pull 이 가능

### 3. 충돌 해결
- git pull은 원격 저장소의 내용을 가져오는 기능(fetch)과 이를 병합하는 과정(merge)를 한꺼번에 진행
- 병합을 하는 과정에서 에러가 발생하면 개발자가 직접 이를 처리해야 합니다.
- 어느 한쪽에서 내용을 수정하고 push 한 후 다른 쪽에서 내용을 수정하고 push를 하면 에러가 발생<br>
다른 한쪽이 참조하고 있어서 에러 발생
- git pull을 하고 수정을 하고자 함<br>
git pull을 하면 자동 merge에 성공하는 경우도 있지만 동일한 파일의 내용을 수정한 경우는 fetch는 가능하지만 자동 merge 실패<br>
이 경우 해결책은 `git reset --hard`를 이용해서 pull 하기 전의 상태로 돌아가서 해결을 할 수 있고 다른 방법은 충돌이 발생한 지점을 찾아서 수정하고 커밋을 다시 해서 해결할 수 있음
- 병합 중지: `git merge --abort`
- 커밋 이력을 확인할 때 그래프도 같이 출력
  - `git log --oneline --graph`

### fetch와 merge
- pull은 fetch(가져오는 작업)와 merge(병합하는 작업)를 한꺼번에 수행하는데 이를 나누어서 작업하는 것도 가능
- 한쪽에서 수정을 하고 push를 한 후 다른쪽에서 fetch를 하게되면 git log --all --oneline 로 출력해보면 원격 저장소에 로컬의 commit이 다름
- 변경 내역을 확인하고자 하면 diff 를 사용
```git
git diff master origin/master
```
- 변경된 내역을 현재 프로젝트에 반영
```git
$ git merge origin/master
```
- pull: fetch + merge<br>
fetch를 한 후 diff 명령으로 수정된 내용이 있는지 확인하고 내용을 반영하는 merge를 사용하는 것을 권장

### blame
- 코드의 수정 내역을 확인하는 명령
- diff를 이용하면 변경된 내역을 확인할 수 있는데 blame은 특정 파일의 수정 내역을 라인 단위로 설명
- sample.txt의 변경 내역을 확인(변경ID와 같이 표시)
```bash
$ git blame test.txt
e29287b7 (dragonhail 2024-11-04 11:03:48 +0900 1) git team 연습
ee683657 (dragonhail 2024-11-04 11:38:23 +0900 2) test
ee683657 (dragonhail 2024-11-04 11:38:23 +0900 3) asdfsafdfadfa
```
- 특정 commit의 변경 내역을 확인
```bash
git blame 커밋해시 파일경로
```
- 특정 범위의 변경 내역만 확인
```bash
git blame -L 시작라인, 끝라인 파일경로
git blame -L 시작라인, 파일경로
git blame -L , 끝라인 파일경로
```
- 커밋 해시만 표현
```bash
$ git blame -s test.txt
e29287b7 1) git team 연습
ee683657 2) test
ee683657 3) asdfsafdfadfa
```
### stash
- 작업 중인 내역을 임시 저장하고자 할 때 사용하는 명령
- Git에는 임시 영역을 만들 수 있는 기능이 제공됨
```
Working Directory <-> Staging Area <-> Local Repo <-> Remote
```
- Staging Area와 작업이 가능한 영역이 Stash
- Stash 실습
  - 한 쪽에서 내용을 수정하고 push
  - 작업 중인데 다른 쪽에서 작업한 내역을 확인해달라고 요청하는 경우
  - 임시 저장을 하고자 하는 경우: `git stash`<br>
    `git status` 를 호출하면 변경 내역이 없다고 나오며 변경 내역은 사라짐
  - save 다음에 저장하는 이름을 설정할 수 있음
  - `-m` 다음에 메시지를 추가할 수 있음
  - untracked 파일은 임시 저장 대상이 아님
  - untracked 파일도 임시 저장을 하고자 하는 경우에는 `-u` 옵션을 이용
  ```bash
  git stash save test -um "Add test.txt"
  ```
  - stash 목록 확인: `git stash list`
  - stash에 임시 저장한 내역 가져오기
  ```bash
  git stash apply stash@{인덱스}
  ```
  - `git stash drop`을 이용해서 하나씩 삭제

## branch
- Repository 안에 존재하는 독립적인 개발 라인
- 새 기능이나 버그 수정 작업을 할 때 브랜치를 이용해서 다른 팀 구성원과의 작업을 분리할 수 있음
- 저장소에서 포인터 역할을 수행

### 브랜치를 생성하고 삭제하기
- 현재 커밋에 태그 달기
```bash
git tag -a v.2.0.0.0 -m "Release Version 1.0.0"
```
- 브랜치 생성
```
git branch 브랜치이름
git branch test1
git branch test2
```
- 브랜치 확인
```
git branch
이 때 현재 사용 중인 브랜치에는 *이 표시
```
- 브랜치 삭제
```
git branch -d 브랜치이름
```
- 브랜치 추가
```
git branch dev1
```
  - 로그 확인: `git log --oneline`
  - 새로 추가되는 브랜치는 현재 작성한 커밋 중 가장 최근의 것을 참조

### 브랜치 전환
- `git checkout 브랜치이름`
```
git checkout dev1
log를 확인해보면 HEAD가 변경된 것을 알 수 있음
checkout 은 HEAD를 변경하는 명령
```

### merge
- 브랜치 병합
- 실습
  - 작업 브랜치를 master로 수정
    ```
    git checkout main
    ```
  - 로그 확인
  ```
  git log --oneline
  dev1 브랜치에서 commit 한 내역은 출력되지 않음
  ```
  - 브랜치 병합
  ```
  git merge 브랜치이름
  git merge dev1
  ```
- merge의 종류
  - fast-forward merge<br>
  2개의 브랜치가 공동으로 가지고 커밋을 base 라고 하는데 이 base 가 동일 선상에 있으면 이 두 브랜치는 fast-forward 상태에 있다고 함<br>
  fast-forward 상태에 있는 브랜치 관계에서 git merge를 하게되면 새로운 커밋이 만들어지지 않음<br>
  이전 커밋을 가지고 브랜치가 새로운 커밋을 갖는 브랜치의 이력을 따라감<br>
  브랜치가 점프하듯 상태 브랜치의 커밋으로 이동하는 모습을 본떠서 fast-forward라고 함
  - 3-way merge<br>
  2개의 브런치가 다른 base를 참조하는 경우<br>
  각각의 브랜치에서 이미 다른 커밋을 수행한 경우<br>
  이 경우는 merge를 수행하게 되면 새로운 커밋이 만들어지며 이 커밋을 merge commit 이라고 함<br>
  이를 3-way merge commit이라고 하는 이유는 base, 각각의 커밋 이렇게 3개를 합치기 때문
- fast-forward merge 실습
  - master 브랜치 로그 확인
    ```
    git log --oneline --graph

    * d3308f1 (HEAD -> main, dev1) 5
    * 9fa22cc 4
    * f923c79 1
    * c74d701 (tag: v.2.0.0.0, origin/main) Modify test.txt
    ```
  - dev1의 로그를 확인
    ```
    git checkout dev1

    git log --oneline --graph
    * d3308f1 (HEAD -> dev1, main) 5
    * 9fa22cc 4
    * f923c79 1
    * c74d701 (tag: v.2.0.0.0, origin/main) Modify test.txt
    ```
  - dev1 브랜치 상태에서 작업을 수행하고 commit을 수행
  - 현재 commit 로그 출력
    ```
    git log --oneline

    e4baa67 (HEAD -> dev1) 6
    f796027 5
    d3308f1 (main) 5
    9fa22cc 4
    ```
  - master 브랜치에서 dev1 브랜치를 병합하면 새로운 커밋이 만들어지지 않고 master 브랜치의 commit 이 dev1 브랜치의 커밋을 쫒아가서 포인터만 변경됩니다.
  - fast-forward merge 수행
    ```
    git checkout master

    git merge dev1

    git log --oneline
    ```
  - 마지막 커밋이 이전과 동일
  - merge를 할 때 --ff 옵션을 사용해도 동일한 효과
- non fast-forward merge
  - 브랜치가 fast-forward 관계여도 머지 커밋을 두고 병합
  - `--no-ff` 옵션 이용
  - dev1 브랜치로 이동해서 데이터를 수정하고 commit 수행
  ```
  git checkout dev1

  git commit -m "non-fastforward merge"
  ```
  - main로 이동해서 dev1의 내용을 가지고 새로운 commit 생성
  ```
  git checkout dev1

  git merge --no-ff dev1
  ```
- squash
  - 변경된 내용을 반영은 하지만 새로운 커밋을 만들지는 않음
  - 브랜치의 내용을 가져오기만 하는 경우 사용
- rebase
  - 브랜치를 재배치
  - `git rebase` 명령을 이용하면 base를 조절하는 것이 가능
  - 브랜치의 개수가 많을 때 사용
  - `git merge --squash`를 이용해서 정리하는 것도 가능한데 이 경우 커밋 이력이 남지 않음
  - 브랜치를 만들면서 이동: `git checkout -b 브랜치이름`
  - issue1 이라는 브랜치를 만들고 전환
    ```
    git checkout -b issue1
    ```
  - 내용을 수정하고 커밋
    ```
    git commit -am "issue1 branch"
    ```
  - 내용을 추가 수정하고 커밋
    ```
    git commit -am "update add"
    ```
  - main와 동일한 위치를 참조하는 issue2 라는 브랜치를 만들고 전환
    ```
    git checkout main
    
    git checkout -b issue2
    ```
  - 내용을 수정하고 commit
    ```
    git commit -am "issue2"
    ```
  - 현재 결과
    ```
    main -> issue1 -> issue1
    main -> issue2 -> issue2
    하나의 프로젝트에 브랜치를 2개를 만들어서 각각 작업을 수행한 경우
    ```
  - 한쪽의 base를 다른 한쪽으로 옮겨서 순차적으로 작업이 이루어진 것처럼 병합이 가능
  ```
  git rebase 브랜치이름
  주의할 점은 base 브랜치를 옮기는 브랜치에서 작업
  issue2 브랜치의 base를 issue1으로 옮기고자 하는 경우 issue2 브랜치에서 작업을 수행해야 함
  ```
  - issue2의 base를 issue1으로 옮겨서 병합
  ```
  git checkout issue2
  git rebase issue1
  ```
  - master에 issue2 브랜치를 병합하면 issue1의 변경 내역도 모두 추가
  ```
  git checkout master
  git merge --no-ff -mm "Merge Branch issue2"
  ```
  - rebase 옵션
  ```
  --continue: 충돌을 수정한 후 재배치 진행
  --abort: rebase 취소
  ```
### cherry-pick: 다른 브랜치의 커밋 적용
- 개발 도중 다른 브랜치에 작업한 내용 중 일부분만 가져와서 사용 또는 테스트 하고자 하는 경우
- 커밋은 하나의 함수 단위로 수행하는 것이 좋음<br>
  커밋을 가져오게 되면 함수 단위로 가져오기 때문에 테스트하거나 사용하는 것이 가능
- 개발을 하다보면 한명의 개발자가 여러 개의 함수 또는 클래스를 만들게 되는데 이 때 전체 완성본을 기다렸다가 사용하거나 테스트 하는 것은 자원의 낭비
```
Master -> backend1 -> backend2 -> backend3
       -> frontend1(backend1이 필요)
이 경우에는 backend의 커밋을 원하는 지점까지 하드 리셋해서 frontend에 병합해도 되고 git cherry-pick을 이용해서 일부 작업 내용만 가져와서 확인해도 됨
```
- 실습
  - 현재 브랜치 확인: `git branch`
  - 브랜치를 생성해서 브랜치로 이동한 후 내용을 수정하고 commit을 3번 수행
  ```bash
  git checkout -b dev1

  git commit -am "commit dev1_1"
  git commit -am "commit dev1_2"
  git commit -am "commit dev1_3"

  git log --oneline --graph
  ```
  - master 브랜치를 기반으로 새로운 브랜치를 생성해서 작업을 수행하고 commit 을 수행
  ```bash
  git checkout master

  git checkout -b dev2

  git commit -am "commit dev2_1"
  ```
  - 현재 상태
    ```
    master -> dev1(commit1) -> dev1(commit2) -> dev1(commit3)
    master -> dev2(commit1)
    ```
  - 중간 결과 가져오기
  ```
  git cherry-pick 커밋해시

  git checkout dev1
  git log --oneline

  c5b381b

  git checkout dev2

  git log --oneline
  로그를 확인하면 새로운 커밋이 추가된 것을 확인할 수 있는데 이 커밋은 dev1의 commit임
  ```
  - cherry-pick 도중 충돌이 발생하면 rebase와 마찬가지로 `--abort`로 취소를 하고 충돌을 직접 해결하고 `git add .`을 한 이후 `git cherry-pick --continue`를 수행
  - 수정 내용을 master에 병합
  ```
  git merge --no-ff -m "Merge Branch dev2" dev2
  ```

### 새로운 브랜치를 git hub에 추가해서 배포
- 새로운 브랜치를 생성
```
git checkout -b light
```
- commit
```
git commit -am "light version"
```
- push
```
git push origin light
```
  - 에러가 발생하는 경우에는 `git push --set-upstream origin light`

### pull request
- Merge를 하기 전에 사전 검토를 하는 과정: 코드 리뷰
- git hub 에서는 pull request라고 하는데 다른 곳에서는 merge request라고도 함
- 이 명령은 git의 표준 명령이 아니고 호스팅 서비스에서 제공하는 기능이므로 git의 호스팅 서비스마다 서로 다른 명령어나 방식을 취할 수 있음

- 관리자용 계정에서 git hub repository 생성
  - README.md를 갖는 test-pr 이라는 레포지토리를 생성
  - 브랜치 보호 설정
  - 레포지토리를 선택하고 [Settings] - [Branches]를 선택한 후 [Add classic branch protection rule]을 선택
```
Branch name pattern 에 main을 설정

Require a pull request before merging 을 체크하게 되면 이제 main 브랜치로는 직접 push를 할 수 없고 pull request를 통한 병합을 사용하도록 설정

Require approvals은 풀 리퀘스트 후에 협업자들의 승인을 얻어야 병합을 할 수 있도록 설정

Require review from Code Owners는 풀 리퀘스트 후 저장소 관리자의 리뷰 승인이 필요하도록 설정

협업자 추가

관리자 컴퓨터에서 레포지토리 클론
git clone https://github.com/itggangpae/test-pr.git

현재 로그(git log --oneline) 와 브랜치(git branch)를 확인
```
- 개발자 A: feat1 브랜치에서 파일을 추가하고 작성하고 커밋하고 푸시
```
git checkout -b feat1

git add .

git commit -m "developer_A"

git push origin feat1
```
- git hub 페이지로 이동해서 브랜치가 생성되는 걸 확인하고 Compare & Pull Request 버튼을 눌러서 pull request 요청을 전송<br>
타이틀 과 내용을 작성하고 pull request를 생성