---
title: SAN(Storage Area Network)
weight: 9
---
NAS (Network Attached Storage) and SAN (Storage Area Network) are both data storage solutions, but they differ in their architecture, performance, and cost. NAS is a standalone device that connects to a network and provides file-level access, while SAN is a high-speed network that provides block-level access to multiple servers. 

Here's a breakdown of their key differences:

**1. Data Access Level:**

* **NAS: File-level access.** NAS devices provide storage as a shared network drive, similar to a local folder, using file-sharing protocols like NFS (Network File System) for Unix/Linux or SMB/CIFS (Server Message Block/Common Internet File System) for Windows. The NAS itself manages the file system.
* **SAN: Block-level access.** SANs present storage to servers as raw, unformatted disk blocks. The server then treats this storage as if it were directly attached, allowing the server's operating system to manage its own file system (e.g., NTFS for Windows, ext4 for Linux, VMFS for VMware).

**2. Network Architecture:**

* **NAS: Uses existing LAN (Local Area Network).** NAS devices connect directly to your regular Ethernet network. This makes them relatively easy and inexpensive to set up, as they leverage existing network infrastructure.
* **SAN: Dedicated, high-speed network (Fibre Channel or iSCSI).** SANs typically use a dedicated network, often Fibre Channel (FC) for high performance, or iSCSI (Internet Small Computer System Interface) which runs over Ethernet. This dedicated network isolates storage traffic from regular network traffic, providing better performance and security.

**3. Protocols:**

* **NAS:** NFS, SMB/CIFS, HTTP, FTP.
* **SAN:** Fibre Channel (FC), iSCSI.

**4. Performance:**

* **NAS:** Generally has higher latency and lower throughput compared to SAN, as it's reliant on the existing LAN's bandwidth and introduces an additional layer of file system management.
* **SAN:** Offers high-speed, low-latency data access because of its dedicated network and block-level access, making it ideal for performance-intensive applications.

**5. Cost:**

* **NAS:** Generally less expensive to purchase and set up, as it utilizes existing network infrastructure and is simpler to manage.
* **SAN:** More expensive due to the need for specialized hardware (Fibre Channel switches, Host Bus Adapters - HBAs) and more complex configuration and management.

**6. Scalability:**

* **NAS:** Scalability can be more challenging, though some advanced NAS systems offer good scalability. Scaling often involves adding more NAS units.
* **SAN:** Highly scalable. You can easily add more storage devices to the SAN, and servers can access this pooled storage.

**7. Management:**

* **NAS:** Easier to set up and manage, often with user-friendly web interfaces.
* **SAN:** More complex to configure and manage, requiring specialized knowledge and often hands-on administration.

**8. Use Cases:**

* **NAS:**
    * File sharing and collaboration (e.g., shared drives for departments, personal document storage).
    * Centralized backup for multiple computers.
    * Media streaming (home and small office environments).
    * General purpose data storage.
    * Small to medium-sized businesses and home users.
* **SAN:**
    * High-performance applications (e.g., large databases, virtualized environments like VMware, high-transaction applications).
    * Data warehousing and analytics.
    * Video editing and other demanding media production.
    * Enterprise-level storage solutions where performance, scalability, and high availability are critical.

**In summary:**

| Feature            | NAS (Network Attached Storage)                         | SAN (Storage Area Network)                                 |
| :----------------- | :----------------------------------------------------- | :---------------------------------------------------------- |
| **Data Access** | File-level (shared folders)                            | Block-level (raw disk blocks)                               |
| **Network** | Standard LAN (Ethernet)                                | Dedicated network (Fibre Channel, iSCSI)                    |
| **Protocols** | NFS, SMB/CIFS, HTTP, FTP                               | Fibre Channel, iSCSI                                        |
| **Performance** | Lower latency, higher throughput                      | Higher latency, lower throughput                          |
| **Cost** | Lower                                                  | Higher                                                      |
| **Scalability** | More challenging, often by adding units                | Highly scalable by adding storage to the network            |
| **Management** | Easier to set up and manage                            | More complex, requires specialized skills                   |
| **Typical Use Cases** | File sharing, backups, general data storage           | Databases, virtualization, high-performance applications    |

Many organizations use both NAS and SAN solutions to address different storage needs within their infrastructure. The choice between NAS and SAN depends on specific requirements, including performance demands, budget, scalability needs, and ease of management.


### SAN(Storage Area Network)에서는 **여러 서버가 동시에 하나의 스토리지에 연결하는 것이 가능**


```
      +----------+       +----------+
      |  서버 A  |       |  서버 B  |
      +----------+       +----------+
           |                   |
           | Fibre Channel / iSCSI
           |                   |
     +-------------------------------+
     |           SAN Switch          |
     +-------------------------------+
                      |
             +-----------------+
             |   SAN Storage   |
             +-----------------+
```

* **서버 A, B, C...** 모두 같은 SAN 스토리지에 연결 가능
* 각 서버는 SAN의 특정 LUN(논리 볼륨)을 블록 디바이스로 마운트
* 스토리지는 다수의 서버와 **동시에 통신**할 수 있음


##  그런데, 단순히 연결된다고 해서 동시에 같은 파일 시스템에 접근할 수는 없음

### 문제점: 파일시스템 충돌

* 만약 두 서버가 같은 디스크 블록을 동시에 쓰면 데이터 손상이 발생할 수 있음
* 일반적인 ext4, XFS 같은 파일시스템은 **한 번에 하나의 서버만** 마운트할 수 있음

---

##  해결 방법

| 방법                     | 설명                                                                         |
| ---------------------- | -------------------------------------------------------------------------- |
| **클러스터 파일 시스템 사용**     | 예: GFS2, OCFS2, IBM GPFS, Lustre 등<br>→ 여러 서버가 같은 SAN 볼륨을 **동시에 읽고 쓰기 가능** |
| **LUN 분리 및 전용 할당**     | 서버마다 SAN 스토리지에서 **서로 다른 LUN**을 할당해서 독립적으로 사용                               |
| **SCSI 예약 또는 fencing** | 특정 서버만 해당 볼륨에 접근할 수 있도록 제어                                                 |
| **클러스터 매니저 연동**        | Pacemaker + Corosync 같은 툴과 함께 스토리지 제어                                      |

