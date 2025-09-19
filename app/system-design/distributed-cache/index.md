---
title: Distributed Cache
tags:
id: distributed-cache
unlisted: true
prev_article:
  path: /system-design/distributed-monitoring
  title: Distributed Monitoring
date: 2025-05-30
include:
  - components/block/note
  - components/image/able-to-zoom
---

# Distributed Cache

## Problem statement

1 hệ thống cơ bản bao gồm các components sau:

- 1 client gửi requests tới service
- 1 service host để đón requests
- 1 database để lưu dữ liệu

Ở điều kiện ít người sử dụng, hệ thống này có thể thực hiện tốt mọi nhiệm vụ. Nhưng nếu lượng tải từ ng sử dụng tăng cao, các vấn đề chịu tải sẽ xuất hiện.

Để giải quyết các vấn đề về chịu tải, **cache** là một trong các phương án ta có thể nghĩ đến đầu tiên. Ý tưởng là tạo 1 component chịu trách nhiệm lưu trữ dữ liệu tạm thời, và hệ thống sẽ thực hiện logic sau:

- Nếu request có thể tìm đc dữ liệu có trong cache, lấy từ cache
- Nếu ko có trong cache, thì mới đi tìm trong database

## Overview

1 **distributed cache** là hệ thống caching gồm nhiều server cache liên kết với nhau để lưu trữ các dữ liệu được truy cập thường xuyên.

Trong 1 môi trường mà chỉ 1 cache server là ko đủ để gánh lượng tải của requests, thì ta sẽ cần mở rộng lên hệ thống cache phân tán.

Nhìn chung, distributed caches cho ta các lợi ích như sau:

- Tổi thiểu độ trễ cho các requests tính toán phức tạp
- Khởi tạo trước các câu truy vấn tốn kém lên cơ sở dữ liệu
- Lưu trữ tạm thời session của user
- Có thể cung cấp dữ liệu tạm thời ngay cả khi data store bị sập
- Giảm network costs

### Caching at different layers of a system

| System Layer | Technology in Use                                                      | Usage                                                           |
| ------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| Web          | HTTP cache headers, web accelerators, key-value store, CDNs, and so on | Accelerate retrieval of static web content, and manage sessions |
| Application  | Local cache and key-value data store                                   | Accelerate application-level computations and data retrieval    |
| Database     | Database cache, buffers, and key-value data store                      | Reduce data retrieval latency and I/O load from database        |

## Background of distributed cache

### Writing policies

Thông thường, cache lưu trữ 1 bản copy của dữ liệu (hoặc 1 phần dữ liệu). Khi ta muốn lưu 1 số dữ liệu nào đó vào cache, ta thường đưa ra các câu hỏi sau:

- Where do we store the data first? Database or cache?
- What will be the implication of each strategy for consistency models?

Câu trả lời là: phụ thuộc vào requirements của ứng dụng.

Ta sẽ tập trung vào các writing policies như sau:

- **Write-through cache:** Write vào cả cache lẫn database, có thể làm đồng thời hoặc làm lần lượt. Cách này sẽ tăng độ trễ của write operation, nhưng đảm bảo tính đồng nhất của dữ liệu.
- **Write-back cache:** Data sẽ được ghi vào cache trước, rồi được ghi bất đồng bộ vào database. Cách này có độ trễ thấp, nhưng không thể tránh được việc dữ liệu không nhất quán. 
- **Write-around cache:** Chỉ ghi vào database. Sau đó khi dữ liệu được đọc, thì mới ghi dữ liệu vào cache nếu cache miss. Cách này sẽ không hiệu quả với các dữ liệu được cập nhật nhiều lần.

### Eviction policies

1 trong các lý do caches hoạt động nhanh là kích thước dữ liệu nhỏ. Điều này có nghĩa là capacity storage cho cache được giới hạn trong 1 lượng nhỏ.

Vì thế, ta cần có cơ chế xóa đi các dữ liệu mà ít được đọc thường xuyên đi, tránh chiếm dung lương dư thừa.

Các chiến lược phổ biến nhất bao gồm:

- Least recently used (LRU)
- Most recently used (MRU)
- Least frequently used (LFU)
- Most frequently used (MFU)

### Cache invalidation

Trong trường hợp dữ liệu lưu trong cache bị outdated, ta cần có cơ chế để trigger việc xóa các dữ liệu này đi, và thay thế dữ liệu mới nhất vào.

> How do we identify stale entries?

Ta có thể xác định dữ liệu outdated thông qua các metadata được gắn kèm với entry của dữ liệu đó. 

Thông thường ta sẽ check time-to-live (TTL) nhằm xác định thời điểm mà dữ liệu sẽ cần fetch mới lại:

- **Active expiration:** Check TTL của các cache entries bằng 1 daemon process hoặc thread riêng.
- **Passive expiration:** Check TTL của cache mỗi khi cache đó được truy cập.

### Storage mechanism

Khi ta sử dụng nhiều máy chủ cache, ta sẽ cần cân nhắc tới các câu hỏi sau:

- Data nào nên lưu vào máy chủ cache?
- Cấu trúc dữ liệu nào nên sử dụng?

#### Hash function

Ta có thể sẽ cần sử dụng hashing trong 2 viễn cảnh:

- Xác định cache server để lưu và đọc dữ liệu.
- Locate cache entries inside each cache server.

Trong trường hợp đầu tiên, ta nên ưu tiên sử dụng consistent hashing vì nó đã hoạt động
rất tốt trong hệ thống phân tán.

Trong trường hợp còn lại, ta có thể sử dụng hàm hash thông thường để định vị cache
entries.

#### Linked list

Ta sẽ sử dụng cấu trúc dữ liệu double linked list để lưu trữ dữ liệu cache.  

Lý do là vì đây là cấu trúc đơn giản và phổ biến. Hơn nữa, nó cho ta khả năng thêm và xóa 
entry ở thời gian O(1).

[.note]
	Ta có thể sử dụng kỹ thuật bloom filters để xác định sự tồn tại của cache entry trong
	cache server. Nhưng kỹ thuật này dựa trên xác suất để nhận biết, nên nó sẽ có hiệu
	quả hơn nhiều nếu được sử dụng trong hệ thống caching lớn hoặc hệ thống databases. 

### Sharding in cache clusters

Để tránh SPOF và tải cao, ta có sharding, chia cache data ra nhiều cache servers khác nhau.

#### Dedicated cache servers

Trong kỹ thuật này, ta tách cache servers ra khỏi application & web servers.

Điều này cho ta các lợi ích như sau:

- Linh hoạt trong phần cứng
- Scale độc lập
- Cho phép các components khác trong microservice được sử dụng nếu cần

[.note]
	##### Data temperature
	Để diễn tả độ truy cập thường xuyên của dữ liệu, ta phân chia theo 3 mức sau:
	- **Hot:** Highly accessed data
	- **Warm:** Less frequently accessed data
	- **Cold:** Rarely accessed data

#### Co-located cache

Cách này sẽ cho cache và service vào chung 1 host.

Thường ta sẽ cân nhắc cách này khi cần giảm capacity expenditures và operational
expenditures với phần cứng.

## High-level design

### Requirements

#### Functional

- Insert data
- Retrieve data

#### Non-functional

- High performance
- Scalability
- High availability
- Consistency
- Affordability

### API design

#### Insertion

```
insert(key, value)
```

#### Retrieval

```
retrieve(key)
```

### Considerations

#### Storage hardware

Nếu dữ liệu của ta lớn, ta có lẽ sẽ cần sharding, dẫn tới việc cần dùng shard servers cho
cache partitions.

Ta có thể xây dựng hệ thống cache lớn dựa trên commodity servers. Nhìn chung, số lượng 
shard servers sẽ phụ thuộc vào kích cỡ của cache và độ truy cập thường xuyên.

Hơn nữa, ta có thể cân nhắc lưu trữ dữ liệu trong storage phụ nhằm đảm bảo độ thống
nhất phòng trường hợp cần restart, và dựng lại cache tốn nhiều thời gian.

#### Data structures

Một phần thiết yếu trong thiết kế là tốc độ truy cập dữ liệu. Ta ưu tiên sử dụng cấu trúc dữ
liệu có thời gian lưu trữ và truy vấn mức constant time, như bảng băm.

Ngoài ra, ta cần một cấu trúc dữ liệu tối ưu việc loại bỏ dữ liệu trong cache, và double
linked list có thể đáp ứng yêu cầu này.

Bên cạnh đó, ta vẫn cần hiểu các loại cấu trúc dữ liệu khác mà cache có thể lưu trữ.

#### Cache client

Ta cần xác định xem nên đặt cache client ở đâu.

Nếu chỉ sử dụng nội bộ, ta có thể đặt luôn client trong hosting servers. Nhưng nếu cho bên
ngoài sử dụng, ta nên đặt cache client trong 1 service dành cho caching riêng.

#### Writing policy

Nhìn chung, mỗi lựa chọn cho chiến lược ghi đều có ưu nhược điểm riêng, nên ta cần sử dụng policy phù hợp với ứng dụng của ta.

#### Eviction policy

Thông thường, hệ thống cache hoạt động trên bộ nhớ RAM để tối ưu tốc độ đọc ghi, và
thường phải cân nhắc tới giới hạn lưu trữ khắt khe hơn việc lưu dữ liệu bình thường. Ta
cần phải quyết định cẩn thận cái gì có thể được lưu trong cache và làm sao để chuẩn
bị đủ chỗ trống cho các entries mới.

Với việc dữ liệu mới được thêm vào, data cũ sẽ cần được cân nhắc xem có cái nào có thể
xóa đi được không, nhằm đảm bảo tối ưu về mặt dung lượng lưu trữ.

Nhìn chung, ta cũng có thể định nghĩa nhiều quy tắc để xóa dữ liệu đi, mỗi quy tắc đều
tối ưu phụ thuộc vào ứng dụng. Chẳng hạn, LRU cache là một lựa chọn không tồi cho
các dịch vụ mạng xã hội, khi cần ưu tiên nội dung được truy cập nhiều nhất cho cache.

Một điều khác đáng lưu tâm là TTL cũng phải tối ưu.

### Components

[image is=able-to-zoom]
  src: https://ik.imagekit.io/tuslipid/system-designs/distributed-cache/1.webp
  caption: High-level design of distributed cache
  alt: High-level design of distributed cache

- **Cache client:** Thư viện nằm trong các service application servers. Nắm giữ tất cả thông tin về cache server.
- **Cache servers:** Các máy chủ duy trì cache về dữ liệu.

## Detailed design

### Limitations

- Cache client không thể nhận biết được việc có cache server nào được thêm hoặc bị chết không.
- Nếu nhét về 1 cache server, ta sẽ dính SPOF.

### Maintain cache servers list

[define]
 #### Solution 1
 Tạo configuration file ở mỗi host.
  
 #### Solution 2
 Lưu configuration file ở một service tập trung.
  
 #### Solution 3
 Tự động hóa service phân phối configuration file.

### Improve availability

Một vấn đề nữa là cache servers cần đảm bảo độ sẵn sàng kể cả khi có một hoặc một vài
máy chủ gặp sự cố. Giải pháp đơn giản là thêm node tạo nên các cụm cache servers.

Ưu điểm:

- Gia cố độ sẵn sàng
- Có thêm nodes hỗ trợ việc đọc

### Internal of cache server

Mỗi cache client nên sử dụng 3 cơ chế sau để lưu và xóa các entries khỏi cache server:

- **Hashmap:** Để lưu vị trí các entries bên trong RAM của cache servers
- **Doubly linked list:** Để tối ưu việc xóa entries
- **Eviction policy:** Ta quy định policies để xóa entries

[image is=able-to-zoom]
 src: https://ik.imagekit.io/tuslipid/system-designs/distributed-cache/2.webp
 alt: Cache server internal illustration
 caption: Cache server internal illustration

## Evaluation

### High performance

Ta đã có các lựa chọn sau giúp đảm bảo hiệu năng cao:

- Sử dụng consistent hashing, với O(logN) thời gian tìm key, trong đó N là số lượng cache shards.
- Key được đặt trong bảng băm.
- Sử dụng TCP và UDP protocol để giao tiếp giữa cache clients và servers.
- Việc thêm nhiều replicas giúp giảm tải một máy.
- Việc thao tác với dữ liệu được thực hiện trên RAM

[.note]
 Thuật toán để thu hồi dữ liệu cache vô cùng quan trọng vì số lượng cache hits và misses
 phụ thuộc vào nó. Tỷ lệ cache hit càng cao, hiệu năng càng cao. 

#### Ví dụ

Hệ thống cache của ta có hiệu năng như sau:

- Cache hit service time (99.9th): 5ms
- Cache miss service time (99.9th): 30ms (đã bao gồm thời gian lấy dữ liệu từ database và cho vào cahe)
- Tỷ lệ cache miss là 10% nếu sử dụng most frequently used (MFU) algorithm
- Tỷ lệ cache miss là 5% nếu sử dụng least recently used (LRU) algorithm

Ta có công thức như sau:

```
EAT = Ratio[hit] * Rate[hit] + Ratio[miss] * Time[miss]
```

[define]
 ##### EAT
 Effective access time

 ##### Ratio[hit]
 The percentage of times a cache hit will occur

 ##### Ratio[miss]
 The percentage of times a cache miss will occur

 ##### Time[hit]
 Time required to serve a cache hit

 ##### Time[miss]
 Time required to serve a cache miss

Với MFU, ta sẽ có 

```
EAT = 0.9 * 5 + 0.1 * 30 = 7.5 (ms)
```

Với LRU, ta sẽ có

```
EAT = 0.95 * 5 + 0.05 * 30 = 6.25 (ms)
```

### Scalability

Ta có thể tạo các shards dựa theo yêu cầu nhất định và thay đổi tải lên máy chủ.

Khi thêm các máy chủ mới vào cụm máy chủ, consistent hashing chỉ yêu cầu ta tính toán lại
hash với một khối lượng tính toán giới hạn.

### High availability

Bằng việc gia tăng số lượng cache servers, ta có thể tăng cường độ tin cậy của hệ thống 
cache lên.

Để quản lý các shard trong một cụm máy chủ, ta có thể thử thuật toán leader-follower. 
Tuy nhiên, phương thức này có điểm yếu là không đảm bảo được tính thống nhất do
phải sử dụng cơ chế ghi bất đồng bộ.

Để khắc phục vấn đề đồng bộ, ta nên đặt replication trong data center để có được sự đồng 
nhất với hiệu năng cao.

### Consistency

Trong trường hợp của caching, cơ chế ghi bất đồng bộ cho ta hiệu năng cao hơn nhiều cơ
chế đồng bộ, nhưng đi kèm với đó là việc dữ liệu sẽ không đồng nhất được.

Ngoài ra, sự không đồng nhất có thể xảy ra bởi config cho các services bị sai đâu đó.
