---
title: Distributed Monitoring
tags:
id: distributed-monitoring
unlisted: true
prev_article:
  path: /system-design/sequencer
  title: Sequencer
date: 2025-02-19
include:
  - components/block/note
---

# Distributed Monitoring

## Prerequisites of a Monitoring System

### Monitoring: metrics and alerting

1 hệ thống monitoring tốt ko thể thiếu việc định nghĩa rõ ràng cái gì được đo đạc, thông số gì được thống kê.

Bên cạnh đó, hệ thống cần phải có các giá trị threshold cài đặt cho từng metric một và khả năng thông báo tới stakeholders khi 1 metric vượt ngưỡng cho phép

[.note]

  Các cách tiếp cận thông thường để xử lý sự cố trong IT infra là gì?

  1. Reactive approach: xử lý sau khi 1 sự cố xảy ra. Kể cả khi dev có hành động nhanh bao nhiêu đi chăng nữa, thì cách này vẫn phải chấp nhận việc hệ thống có 1 khoảng thời gian downtimes
  2. Proactive approach: xử lý trước khi 1 sự cố xảy ra, ngăn chặn downtime. Cách tiếp cận này thực hiện dựa trên việc dự đoán lỗi hệ thống có thể xảy ra, và thực hiện các hành động tránh các lỗi đó

  Trong các services hiện đại, việc hoàn toàn tránh lỗi xảy ra là điều bất khả thi. Nên mục tiêu là tìm các vấn đề sẽ có thể xảy ra và thiết kế hệ thống sao cho sự cố ko ảnh hưởng tới end users.

### Metrics

Là những đại lượng được ta tổng hợp lại để diễn tả trạng thái của hệ thống trong một thời gian nhất định, giúp ta hiểu được hệ thống đang mượt mà hay quá tải.

### Populate the metrics

Các metrics nên được tập trung lại trong 1 hệ thống monitoring và alerting cục bộ. Nên việc fetch dữ liệu về metrics là 1 khía cạnh ko thể thiếu.

Ta có thể thực hiện việc fetch bằng cách pull hoặc push tới hệ thống monitoring. Ta sẽ tận dụng các chiến lược này ntn? Server nên gửi trước metrics về hệ thống monitoring, hay chỉ cung cấp 1 endpoint cho hệ thống lấy dữ liệu đình kỳ?

Ở đây, ta sẽ coi pull hoặc push theo "góc nhìn" của hệ thống monitor. Nghĩa là hệ thống monitor sẽ "pull" các metrics từ các servers, hoặc metrics của các servers sẽ được "push" tới endpoint của hệt thống monitor.

### Persist the data

Ta cũng cần có các giải pháp lưu trữ dự liệu các metrics. Thông thường lưu trong 1 in-memory database là đủ. Nhưng với 1 trung tâm dữ liệu lớn, nơi phải monitor hàng triệu thứ, ta sẽ cần time-series databases để lưu khối lượng dữ liệu khổng lồ mà các metrics tạo ra

### Application metrics

Để thu thập dữ liệu về hiệu suất của app, ta nhúng code hoặc thêm APIs để lấy metrics. Hệ thống giám sát sử dụng các metrics này để tạo ra cái nhìn toàn diện, tự động phản ứng với các thay đổi, và cảnh báo người dùng khi cần thiết.

### Alerting

Alerting là 1 phần trong cả hệ thống monitoring đảm nhiệm vai trò phản ứng lại các thay đổi bất thường trong metrics.

Alerting bao gồm 2 components chính: điều kiện dựa trên metrics (threshold) và action khi giá trị của metrics vượt khỏi phạm vi mà điều kiện cho phép.

## Monitor Server-side Errors

### Requirements

- Monitor critical local processes on a server for crashes.
- Monitor any anomalies in the use of CPU/memory/disk/network bandwidth by a process on a server.
- Monitor overall server health, such as CPU, memory, disk, network bandwidth, average load, and so on.
- Monitor hardware component faults on a server, such as memory failures, failing or slowing disk, and so on.
- Monitor the server's ability to reach out-of-server critical services, such as network file systems and so on.
- Monitor all network switches, load balancers, and any other specialized hardware inside a data center.
- Monitor power consumption at the server, rack, and data center levels.
- Monitor any power events on the servers, racks, and data center.
- Monitor routing information and DNS for external clients.
- Monitor network links and paths' latency inside and across the data centers.
- Monitor network status at the peering points.
- Monitor overall service health that might span multiple data centers - for example, a CDN and its performance.

[.note]

  Các cloud services đều cung cấp 1 trang riêng để cho thấy health status hiện tại của các services

  - AWS: [https://health.aws.amazon.com/health/status](https://health.aws.amazon.com/health/status)
  - Azure: [https://status.azure.com/en-us/status](https://status.azure.com/en-us/status)
  - GCP: [https:/\/status.cloud.google.com/](https://status.cloud.google.com/)

### Building blocks

**Blob storage:** Ta sẽ sử dụng chúng để lưu thông tin về các metrics

### High-level design

- **Storage:** 1 time-series database để lưu metrics data, như số CPU được sử dụng hoặc số exceptions đc throw trong 1 app
- **Data collector service:** fetch các dữ liệu liên quan tới mỗi service và lưu chúng lại trong storage
- **Querying service:** 1 API để truyền lệnh query tới time-series database và trả về các dữ liệu cần thiết

[image]

### Detailed design

#### Storage

Ta sẽ sử dụng time-series databases để lưu dữ liệu trên server nơi monitoring service đang chạy. Rồi ta tích hợp chúng vào 1 blob storage riêng biệt.

### Data collector

Hệ thống giám sát của ta cần thu thập được các trạng thái mới nhất từ các servers.

Ta có thể chọn pull strategy, lấy log từ app và extract các metrics cần thiết từ chúng.

Sau đó, ta truyền các metrics được trích xuất tới data collector. Thông thường ta có thể sử dụng distributed messaging queue làm kênh trung gian. Ta trích xuất và đẩy thông tin lên queue, rồi data collector sẽ pull thông tin từ queue.

[.note]

  #### Hạn chế của push-based approach?

  - Nếu mỗi microservice gửi metric trực tiếp tới hệ thống monitoring, thì chúng có thể gây workload rất cao
  - Ở mỗi service, ta cũng phải cài đặt daemon riêng để gửi metrics tới hệ thống monitoring, tốn thêm nhiều công sức.

### Querying service

Để xem được các metrics và errors ở monitor dashboard, ta cần 1 service để truy cập vào time series database và query các dữ liệu cần thiết.

#### Alert manager

Chịu trách nhiệm tự động thông báo qua các kênh liên lạc khi có metric vi phạm một rule nào đó.

Các alerts có thể gửi qua email, Slack message, Discord message, etc... Tùy vào kênh liên lạc chính của tổ chức.

#### Dashboard

Ta sử dụng dashboard để visualize metrics cần thiết.

### Pros

- Thiết kế này đảm bảo các operations diễn ra mượt mà và có thể phát hiện bất kỳ dấu hiệu nào của problems.
- Tránh việc network traffic bị quá tải.
- Độ sẵn sàng cao.

### Cons

- Khi scale up hệ thống này, ta phải thêm nhiều servers cho các monitoring services hơn. Để quản lý nhiều servers và giữ failover servers được đồng bộ với server chính là một thử thách lớn.
- Hệ thống giám sát thu thập 1 lượng data khổng lồ 24/7, nên ta không thể giữ chúng mãi mãi được. Ta cần cơ chế quản lý dữ liệu hợp lý để tiết kiệm tài nguyên.

[image]

### Improve

Như hệ thống được thiết kế ở trên, trạng thái của tất cả servers được giám sát được truyền thẳng về 1 điểm tập trung.

Khi mà số lượng servers tăng cao, ta có thể scale hệ thống monitor bằng cách chia để trị.

Thay vì tất cả servers truyền dữ liệu về 1 cụm data collector service, ta có thể chia service này ra thành nhiều cụm. Mỗi cụm đảm nhiệm giám sát 1 số lượng servers nhất định.

Tiếp theo, ta nhóm bộ storage, database, querying service thành 1 cụm tập trung, gọi là primary monitoring system. Khi các cụm data collector pull dữ liệu từ các servers, chúng sẽ lại push data lên primary monitoring system.

[image]

## Monitor Client-side Errors

### Client-side errors

Trong 1 hệ thống phân tán, clients thường truy cập tới service qua 1 HTTP request. Ta có thể monitor web và app của ta qua log của servers nếu 1 request bị fail. Nếu nhiều requests failed, ta có thể quan sát thấy 1 lượng errors dựng đứng trên dashboard.

Nhưng đấy chỉ là trường hợp lỗi xảy ra ở servers. Còn lỗi xảy ra trên máy của client thì nó lại là vấn đề khó hơn.

Có nhiều yếu tố khiến cho clients ko thể gọi tới servers:

- Lỗi ở DNS name resolution.
- Lỗi khi routing từ client tới service provider
- Lỗi ở cơ sở hạ tầng bên thứ 3

### Initial design

Để đảm bảo request từ client tới được server, ta sẽ "đóng giả" như 1 client và thực hiện healthcheck request định kỳ.

Ta sẽ cần request được bắt nguồn từ nhiều nơi trên toàn cầu, và cần 1 service định kỳ gửi request về server để check độ sẵn sàng.

#### Issues

- Incomplete coverage
- Lack of user imitation

### Improve the design

Thay vì setup 1 số điểm gửi request nhất định, ta có thể nhúng scripts trong app. Khi client tải về và chạy app, client sẽ gửi các metrics định kỳ tới server.

Ta sẽ có 2 components:

- **Agent:** Các đoạn scripts đc nhúng trong client app, chịu trách nhiệm report metrics và failures.
- **Collector:** Service chịu trách nhiệm thu thập các metrics và failures đc gửi từ các Agents.

Giờ, ta lại cần cân nhắc một số điểm sau:

- Can a user activate and deactivate client-side reports?
- How do client-side agents reach collectors under faulty conditions?
- How will we protect user privacy?

#### Activate and deactivate reports

Ta sẽ sử dụng HTTP header để gửi thông tin thích hợp tới collector.

#### Reach collectors under faulty conditions

Collector nên nằm ở endpoint khác với các service endpoint được monitor. Nhờ vậy mà nếu client request tới service bị failed, chúng có thể submit error report lên collector.

[table caption="Reaching collectors under faulty conditions"]

  Faulty conditions         | How to reach
  ------------------------- | ----------------------------------------------
  1.2.3.4 unreachable       | Different server IP
  Can't resolve example.com | Different domain
  AS 1234 hijacked          | Different ASN
  CDN available             | Different/no CDN
  Last-mile problems        | No readily available fall-back for the service

#### Protect user privacy

Người dùng phần mềm ở phía client-side nên được toàn quyền quản lý sản phẩm để biết cách dữ liệu được thu thập và gửi đi trong mỗi request.

Đối với browser-based client, ta có thể tránh đụng vào các thông tin sau:

- Ta có thể tránh đụng vào traceroute hops. Người dùng có thể nhạy cảm với các thông tin về vị trí của họ.
- Ta có thể tránh đụng vào thông tin của DNS resolver được sử dụng.
- Ta có thể tránh đụng vào round-trip-time (RTT) và packet loss.

Nhìn chung, ta chỉ cần thu thập các thông tin được log vào weblog khi bất cứ request nào thành công.
