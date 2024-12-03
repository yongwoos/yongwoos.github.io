---
title: 미쳐 알지 못했던 Kernel까지 Observability 향상시키기 리뷰
weight: 2
---
### CPU 사용률
- 전체 시간에서 busy state가 사용했던 시간을 백분율로 나타낸 것
  - memory I/O도 고려해야

### Memory IO
Malloc으로 추적 -> 페이지 폴트로 매핑

페이지 폴트를 flamegraph로 표현

### NUMA
- multi socket cpu
- 채널을 쪼개서 CPU별로 로컬메모리를 부착해 채널의 한계를 극복한 것
- local access와 remote access
- remote access
  - 비효율적으로 작동할 수 있음
  - local dram과 remote dram의 합의 40%가 remote access가 차지
- cpuset_cpu
- cpuset_memory
- 값을 조절해서 하드웨어 조정 가능

### socket pinnigng
- numa 0과 numa1에 정해지는 memory load를 고정

### cloudflare의 ebpf exporter
- numa metric값 분석으로 NUMA 감시

## REDIS latency 이상현상 파악
- redis latency에 가끔 튀는 메트릭이 발생
- perf trace로 로그 분석 시도
- bpftrace와 bcc tool 사용 시도
  - bcc: funclatency.py netif_rx
- pixie (오픈소스 ebpf 모니터링 툴)
  - syscall_probe_entry_readv
  - syscall_probe_ret_readv

### ipvs
- nflatency.py
  - IPTable의 훅 종류, TCP/UDP 분석
  - RIQ의 timer_softirq가 느림