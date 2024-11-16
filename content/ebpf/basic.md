---
weight: 1
title: kprobe
---
## unlink 시스템 콜을 krpobe를 사용해 관측하기
### kprobe
- 관측 과정
  - 사용자가 kprobe 함수를 정의 -> 커널이나 모듈의 실행흐름에서 krpobe 함수 발견 -> 사용자가 정의한 콜백함수 호출 -> 원래 실행흐름으로 복귀
- 사용자는 거의 모든 모듈이나 커널에 kprobe함수를 삽입 가능(kprobe함수에는 불가능)
- 세가지 감지 기술로 구성: kprobe, jprobe, kretprobe

### krpobe, jprobe, kretprobe
- kprobe
  - 가장 기본이 되는 감지 기법
  - 나머지 두 개의 basis가 됨
  - 3개 콜백 모드 제공: `pre_handler`, `post_handler`, `falut_handler`
  - `pre_handler`: 관측된 instruction 실행 전 호출
  - `post_handler`: 관측된 instruction 실행 후 호출
  - `fault_handler`: 메모리 access 에러 발생 시 호출
- jprobe
  - kprobe가 basis
  - 관측된 함수의 입력 값을 획득 시 사용
- kretprobe
  - kprobe가 basis
  - 관측된 함수의 리턴 값을 획득 시 사용
  - 관측된 함수 종료시 실행

### 구현 기술
- 하드웨어적 기술도 중요
- CPU exception handling
  - 사용자가 등록한 콜백 함수에 프로그램 실행흐름이 진입하게 해줌
- single-step debugging techniques
  - 관측된 명령을 single-step 실행하게 해줌
- krpobe가 지우너하는 아키텍쳐: x86_64, arm, mips 등

### 특징과 한계


### 실습
- unlink 시스템 콜은 파일 삭제 시 호출
```c {filename="kprobe-link.bpf.c"}
#include "vmlinux.h"
#include <bpf/bpf_helpers.h>
#include <bpf/bpf_tracing.h>
#include <bpf/bpf_core_read.h>

char LICENSE[] SEC("license") = "Dual BSD/GPL";

SEC("kprobe/do_unlinkat")
int BPF_KPROBE(do_unlinkat, int dfd, struct filename *name)
{
    pid_t pid;
    const char *filename;

    pid = bpf_get_current_pid_tgid() >> 32;
    filename = BPF_CORE_READ(name, name);
    bpf_printk("KPROBE ENTRY pid = %d, filename = %s\n", pid, filename);
    return 0;
}

SEC("kretprobe/do_unlinkat")
int BPF_KRETPROBE(do_unlinkat_exit, long ret)
{
    pid_t pid;

    pid = bpf_get_current_pid_tgid() >> 32;
    bpf_printk("KPROBE EXIT: pid = %d, ret = %ld\n", pid, ret);
    return 0;
}
```
- 실행
```bash
$ ecc kprobe-link.bpf.c
Compiling bpf object...
Packing ebpf object and config into package.json...

$ sudo ecli run package.json
```
- 새 창 오픈 후
```bash
$ touch test1
$ rm test1
$ touch test2
$ rm test2
```