---
title: Back-of-the-envelop Calculations
unlisted: true
date: 2023-10-06
prev_article:
  path: /system-design/non-functional-system-characteristics
  title: Non-functional System Characteristics
next_article:
  path: /system-design/dns
  title: Domain Name System (DNS)
---

# Back-of-the-envelop Calculations

## Why?

1 hệ thống phân tán có các nodes tính toán đc kết nối với nhau qua 1 kênh network. Ta có 1 lượng đa dạng các nodes tính toán đang sẵn sàng và chúng có thê đc kết nối bằng rất nhiều cách. Back-of-the-envelop calculations giúp ta tránh đc chi tiết gây rối của hệ thống (ít nhất ở mức design) và tập trung vào những khía cạnh quan trọng hơn

1 vài ví dụ của tính toán kiểu back-of-the-envelop:

- Số lượng kết nối TCP mà 1 server có thể hỗ trợ
- Số lượng request mỗi giây (RPS) của 1 web, database hoặc cache server
- Yêu cầu lưu trữ dữ liệu của 1 dịch vụ

Lựa chọn bừa thông số cho những phép tính này có thể dẫn đến thất bại trong thiết kế. Vì ta cần ước lượng tốt trong rất nhiều vấn đề thiết kế, ta sẽ thảo luận tất cả concepts liên quan trong post này, bao gồm:

- Kiểu data center server
- Access latencies thực tế của các componenets khác nhau
- Ước lượng về RPS mà 1 server có thể xử lý
- Ví dụ về băng thông, servers, và ước tính storage

## Types of data center servers

**Data centers** ko chỉ là 1 kiểu server. Các giải pháp cấp enterprise sử dụng hardware "sỉ" để giảm chi phí và phát triển các giải pháp scalable. Bên dưới ta sẽ thảo luận về các loại servers phổ biến đc sử dụng trong 1 data center để xử lý các đầu việc khác nhau:

- Web server:
  - RAM: low
  - Processor: high
  - Hard drive: low
- Application server:
  - RAM: high
  - Processor: medium
  - Hard drive: medium
- Storage server:
  - RAM: low
  - Processor: medium
  - Hard drive: high

### Web servers

Cho tính scalability, các web servers được tách riêng ra khỏi application servers. **Web servers** là điểm tương tác đầu tiên sau load balancers. Data centers. Các trung tâm dữ liệu có chứa đầy các web servers để hứng API calls từ clients.

Dựa theo yêu cầu của service, dung lượng bộ nhớ và lưu trữ trong web servers có thể từ nhỏ tới vừa, nhưng sẽ cần tài nguyên tính toán lớn. Ví dụ, Facebook đã sử dụng 1 web server với 32 GB RAM và 500 GB lưu trữ, và hợp tác với Intel để tự build riêng 1 custom processor 16 nhân

### Application servers

**Application servers** chạy các logic cốt lõi cho ứng dụng chính. Sự khác biệt giữa web servers và application servers có thể hơi nhập nhằng chút.

Application servers ưu tiên cung cấp các dynamic content, trong khi web servers thì hầu như cung cấp các static content tới client.

Các application servers này yêu cầu lượng tài nguyên để tính toán và lưu trữ lớn. Facebook đã sử dụng các application servers với RAM lên tới 256 GB và 2 kiểu storage - các ổ đĩa truyền thống và flash - với dung lượng lên tới 6.5 TB

### Storage servers

Với sự bùng nổ của Internet, dung lượng data được lưu trữ tăng theo cấp số nhân. Thêm vào đó, các kiểu dữ liệu khác nhau sẽ được lưu trong các đơn vị lưu trữ khác nhau. Ví dụ, YouTube sử dụng những loại datastores sau đây:

1. **Blob storage** cho các videos
2. **Temporary processing queue storage** để cho hàng trăm giờ videos mà video content được upload hàng ngày chờ xử lý
3. 1 storage chuyên dụng gọi là **Bigtable** để lưu trữ lượng lớn thumbnails của videos
4. **Relational database management system (RDBMS)** cho users và metadata của videos (lượt comments, likes, kênh, etc...)
5. Ngoài ra nhiều loại data stores đc sử dụng cho việc phân tích dữ liệu - như HDFS của Hadoop, các storage servers chủ yếu chứa các structured (SQL) và non-structured (NoSQL) data management system

Quay về với ví dụ của Facebook, ta biết rằng họ sử dụng các servers với dung lượng lưu trữ lên tới 120 TB. Với số lượng servers khổng lồ đc đưa vào sử dụng hiện nay, Facebook có thể trữ được hằng exabytes dữ liệu. Tuy vậy, RAM cho những servers này thì chỉ có 32 GB

> Các servers kể trên ko chỉ là các loại servers của 1 data center. Các tổ chức cũng yêu cầu các servers cho các services như configuration, monitoring, load balancing, phân tích dữ liệu, kiểm toán, caching, v.v...

Trong bảng dưới, ta có thể tham khảo thông số của 1 server được sử dụng trong data centers hiện nay:

| Component         | Count                          |
| ----------------- | ------------------------------ |
| Number of sockets | 2                              |
| Processor         | Intel Xeon X2686               |
| Number of cores   | 36 cores (72 hardware threads) |
| RAM               | 236 GB                         |
| Cache (L3)        | 45 MB                          |
| Storage capacity  | 15 TB                          |

Số liệu trên được lấy theo Amazon bare-metal server, ngoài ra thì sẽ có các cỗ máy yếu hơn hoặc mạnh hơn có thể hỗ trợ lên nhiều RAM hơn (lên tới 8 TB), ổ lưu trữ (lên tới 24 ổ và 20 TB mỗi ổ), và bộ nhớ cache (lên tới 120 MB), tính đến năm 2021.

## Standard numbers to remember

Rất nhiều công sức đã được bỏ ra cho việc lên kế hoạch và thực thi 1 service. Nhưng nếu ko có hiểu biết cơ bản về loại workload mà 1 máy tính có thể xử lý, việc lên kế hoạch là bất khả thi. Độ trễ (latencies) đóng vai trò quan trọng trong việc quyết định lượng workload mà 1 máy tính có thể xử lý.

Bảng dưới đây sẽ cho ta biết những thông số quan trọng mà các kỹ sư nên biết khi thiết kế hệ thống để ước lượng được tài nguyên

| Component                                             | Time (nanoseconds)        |
| ----------------------------------------------------- | ------------------------- |
| L1 cache reference                                    | 0.9                       |
| L2 cache reference                                    | 2.8                       |
| L3 cache reference                                    | 12.9                      |
| Main memory reference                                 | 100                       |
| Compress 1 KB with Snzip                              | 3000 (3 microseconds)     |
| Read 1 MB sequentially from memory                    | 9000 (9 microseconds)     |
| Read 1 MB sequentially from SSD                       | 200000 (200 microseconds) |
| Round trip within same datacenter                     | 500000 (500 microseconds) |
| Read 1 MB sequentially from SSD with speed ~1GB/s SSD | 1000000 (1ms)             |
| Read 1 MB sequentially from disk                      | 2000000 (2ms)             |
| Disk seek                                             | 4000000 (4 ms)            |
| Send packet SF->NYC                                   | 71000000 (71 ms)          |

Bên cạnh độ trễ, số lượng queries mỗi giây (QPS) cũng là 1 thông số đáng quan tâm với 1 server datastore

| QPS handled        | Query per second |
| ------------------ | ---------------- |
| by MySQL           | 1000             |
| by key-value store | 10000            |
| by cache server    | 100000 - 1000000 |

Thông số trên đc ước lượng dựa vào 1 số điều kiện như:

- Kiểu query:
  - **point**: Query cho 1 item
  ```sql
    SELECT * FROM students WHERE NAME = "Tus";
  ```
  - **range**: Query 1 lượng items trong 1 khoảng
  ```sql
    SELECT * FROM students WHERE age BETWEEN 15 AND 16;
  ```
- Thông số cụ thể quả máy tính
- Thiết kế database
- Indexing
- etc...

## Request estimation

Ở section này ta sẽ thảo luận về số lượng requests mà 1 server có thể chịu được trong 1 giây. Trong 1 server, giới hạn về tài nguyên cùng với các kiểu requests từ client có thể tạo nên nút thắt cổ chai cho luồng hoạt động của hệ thống.

Trước hết, hãy note về 2 loại requests:

- **CPU-bound requests**: Đây là loại request bị giới hạn bởi tài nguyên CPU
- **Memory-bound requests**: Đây là loại request bị giới hạn bởi tài nguyên RAM của máy tính

Để biết được hiệu năng về xử lý request của 1 server, ta cần có cách để ước lượng RPS với mỗi loại request trên. Ta sẽ tìm hiểu nó thông qua ví dụ sau:

- Server của ta có thông số như bảng ví dụ ở phần @Storage servers
- Hệ điều hành và các tiến trình chạy ngầm đã tiêu tốn 1 lượng 16 GB RAM
- Mỗi woker tiêu thụ hết 300 MB RAM để hoàn thành 1 request
- Để cho đơn giản, ta giả sử CPU thu được dữ liệu từ RAM. Thế nên 1 hệ thống caching giúp đảm bảo ràng tất cả content đc yêu cầu luôn sẵn sàng để gửi đi, mà ko phải truy cập tới lớp storage nữa
- Mỗi CPU-bound request hết 200ms, trong khi đó memory-bound request hết 50ms

Giờ ta bắt đầu bước tính toán:

### CPU bound

Công thức để tính RPS cho CPU-bound requests sẽ là:

```
RPScpu = CPUsNumber * (1 / TimePerTask)
```

- _RPScpu_: CPU-bound RPS
- _CPUsNumber_: Số lượng luồng của CPU (hardware threads)
- _TimePerTask_: Thời gian mỗi task đc hoàn thành (ms)

> Như vậy, ở ví dụ trên, RPScpu = 72 \* (1 / 200) = 360 RPS

### Memory bound

Công thức để tính RPS cho Memory-bound requests sẽ là:

```
RPSmemory = (RAMSize / WorkerMemory) / TimePerTask
```

- _RPSmemory_: Memory-bound RPS
- _RAMSize_: Tổng dung lượng của RAM
- _WorkerMemory_: Dung lượng bộ nhớ mà 1 worker tiêu tốn cho mỗi requests

> Như vậy, ở ví dụ trên, RPSmemory = (240*GB* / 300*MB*) / 50 = 16000 RPS

Nếu 1 services nhận cả CPU-bound lẫn memory-bound requests với một nửa số requests chia đều mỗi bên, server sẽ có thể chịu được tổng
`(360 / 2) + (16000 / 2) = 8180` ~ Xấp xỉ 8000 RPS

Cách tính ở trên chỉ là ước lượng để hiểu đc những nhân tố cơ bản tham gia vào việc ước lượng RPS. Trong thực tế, còn rất nhiều nhân tố khác ảnh hưởng.

Chẳng hạn, latency được yêu cầu cho việc disk seek trong trường hợp dữ liệu chưa sẵn sàng trong RAM hay như nếu 1 request đc gửi tới database server, độ trễ của database và network cũng ảnh hưởng lên. Ngoài ra, lỗi, bugs, node bị sập, mất điện, mất mạng, etc... cũng là những yếu tố ko thể tránh khỏi

Trong 1 ngày lý tưởng, 1 con server mạnh mà chỉ gửi static content từ RAM có thể xử lý được tới 500k RPS, nhưng đối với các tác vụ nặng nề như là xử lý ảnh, nó có thể sẽ chỉ chấp nhận đc tối đa 50 RPS

> Trên thực tế, ước tính dung lượng là 1 vấn đề khó, và các tổ chức nghiên cứu cải thiện nó năm này qua năm khác. 1 hệ thống monitor luôn theo dõi từng phần trong cấu trúc hệ thống của ta để cho ta những cảnh báo sớm về những servers bị quá tải.

## Resource estimation

Ở đây, ta sẽ cùng xem thử 1 số ví dụ liên quan đến ước lượng tài nguyên cho servers, storage và băng thông. Ở phần trước ta đã được làm quen các cách để ước lượng số lượng requests cho 1 server rồi. Tới đây ta sẽ thấy những đại lượng trên đc sử dụng để ước lượng những tài nguyên cụ thể hơn cho các services của ta

### Number of servers required

Giả sử ta đc cho 1 service giống Twitter có những thông số như sau:

- 500tr người dùng hoạt động hằng ngày
- Mỗi ng dùng trung bình gọi 20 requests
- 1 server có thể xử lý 8000 RPS
  Ước lượng số servers cần có sẽ được tính theo công thức

```
Maximum instantaneous requests  / RPS of server
```

Vì ta có số lượng active user hàng ngày lên tới 500tr, nên ko thể loại trừ trường hợp nếu xấp xỉ 1 lượng người dùng như thế gửi requests trong 1 khoảnh khắc, nên ta có **Maximum instantaneous requests** bằng 500tr

Như vậy ta sẽ có được số servers cần tìm theo sau:

|                           | Quantity     |
| ------------------------- | ------------ |
| Daily active user         | 500 millions |
| Requests on average / day | 20           |
| Total requests / day      | 10 billions  |
| Total requests / second   | 115 K        |
| Total servers required    | 62500        |

Trên thực tế thì tỷ lệ để xảy ra ngần đấy lượt truy cập trong 1 khoảnh khắc là rất nhỏ. Nên ta vẫn có thể chia đều lượt active users theo đại lượng nhỏ hơn, i.e "/s", và buffer thêm số lượng server để scale phù hợp với budget hiện tại ta có.

### Storage estimation

Giả sử ta cần ước lượng dung lượng lưu trữ của Twitter cho các tweets mới trong vòng 1 năm, và ta có những thông số sau đây:

- 250tr người dùng hoạt động hàng ngày
- Mỗi user đăng 3 tweets mỗi ngày
- 10% của số tweets có chứa hình ảnh, 5% chứa video. Mỗi tweet chứa video sẽ ko chứa hình ảnh và ngược lại
- Giả sử mỗi hình ảnh nặng 200 KB và mỗi video nặng 3 MB
- Text của metadata của tweet nặng 250 Bytes

Ta có thể tính toán được dung lượng gia tăng trong 1 ngày theo bảng sau:

|                               | Quantity     |
| ----------------------------- | ------------ |
| Daily active users (DAU)      | 250 millions |
| Daily tweets                  | 3            |
| Total requests / day          | 750 millions |
| Storage required per tweet    | 250 B        |
| Storage required per image    | 200 KB       |
| Storage required per video    | 3 MB         |
| Storage for tweets            | 187.5 GB     |
| Storage for images            | 15 TB        |
| Storage for videos            | 112.5 TB     |
| Total storage                 | 128 TB       |
| Total storage in 1 year (365) | 46.72 PB     |

### Bandwidth estimation

Để ước lượng được băng thông cho các services, ta trước hết cần làm được 1 số bước sau:

1. Ước lượng lưu lượng dữ liệu đến hàng ngày
2. Ước lượng lưu lượng dữ liệu đi hàng ngày
3. Ước lượng băng thông với đơn vị Gbps (gigabits trên giây) bằng cách chia dữ liệu đến và dữ liệu đi với số giây 1 ngày (86400)

Tiếp tục với ví dụ về Twitter:

- **Lưu lượng đến**: ta có lưu lượng đến của Twitter lên tới 128 TBs dung lượng mỗi ngày, nên ta sẽ cần băng thông với tốc độ

```
(128 * 10^12) / 86400 * 8 = 12 (Gbps)
```

> Ta sẽ phải nhân với 8 vì ta cần chuyển từ Bytes sang bits cho đơn vị gigabits

- **Lưu lượng đi**: giả sử 1 ng dùng xem 50 tweets mỗi ngày. Ta có tỷ lệ 5%, 10% tweets tương ứng với cái chứa video và hình ảnh. Tương ứng với 250tr ng dùng, ta sẽ có thể ước lượng đc như sau:

|                               | Quantity     |
| ----------------------------- | ------------ |
| Daily active users (DAU)      | 250 millions |
| Daily tweets viewed           | 50 per user  |
| Tweets viewd / second         | 145000       |
| Bandwidth required for tweets | 0.3 Gbps     |
| Bandwidth required for images | 23.2 Gbps    |
| Bandwidth required for videos | 174 Gbps     |
| Total bandwidth               | 197.5 Gbps   |

Như vậy, Twitter sẽ cần tổng cộng 12 Gbps lưu lượng đến và 197.5 Gbps lưu lượng đi, cộng tổng lại sẽ được băng thông yêu cầu là 12 + 197.5 = 209.5 Gbps.
