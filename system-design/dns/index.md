---
title: Domain Name System (DNS)
unlisted: true
date: 2023-11-20
prev_article:
  path: /system-design/back-of-the-envelop-calculations
  title: Back-of-the-envelop Calculations
next_article:
  path: /system-design/load-balancers
  title: Load Balancers
---

# Domain Name System (DNS)

## Introduction

### The origin of DNS

Chúng ta cùng lục lại 1 ví dụ kinh điển về những quyển danh bạ điện thoại phát. Mỗi lần cần gọi điện, ta lại phải mở danh bạ ra, tra số điện thoại trước, rồi nhập quay số điện thoại dựa theo số đã lưu trong danh bạ.

Ở đây, số điện thoại đóng vai trò như những địa chỉ để ta có thể kết nối đc với đầu dây bên kia. Và vì có rất nhiều kết nối mà ta muốn gọi điện tới, ta sẽ phải lưu các số điện thoại vào 1 bộ nhớ riêng aka danh bạ.

Concept của DNS chính là được lấy từ concept trên. Các máy tính sẽ được định danh riêng bằng địa chỉ IP, và ta sử dụng các địa chỉ IP đó để đi tới những trang web (app) mà được hosted trên 1 máy tính.

Vì các địa chỉ IP này rất khó nhớ đối với hooman chúng ta, các kỹ sư đã tạo nên những tên miền cho gần với ngôn ngữ con người giúp cho người dùng dễ ghi nhớ và truy cập hơn.

Những tên miền đó sẽ được map với các địa chỉ IP để có thể kết nối với máy chủ, và để có thể duy trì việc map các địa chỉ IP vào tên miền, ta cần một hệ thống riêng, vì thế cái tên Domain Name System (DNS) ra đời.

### What is DNS?

**Domain Name System (DNS)** là dịch vụ đặt tên miền cho Internet nhằm map các tên miền thân thiện với con ng với các địa chỉ IP thân thiện với máy. Khi ng dùng nhập 1 tên miền vào trình duyệt, trình duyệt sẽ dịch tên miền đó thành địa chỉ IP bằng cách gửi request tới cơ sở hạ tầng DNS. Khi nhận đc địa chỉ IP mong muốn, request của user mới có thể đc gửi tới đầu bên kia được.

Flow hoạt động của DNS với trình duyệt sẽ được mô tả như sau:

1. Người dùng request truy cập tới website bằng cách enter đường dẫn URL lên trình duyệt
2. Trình duyệt sẽ request tới ISP để forward truy vấn tới DNS và thực thi request trả về địa chỉ IP
3. ISP forward truy vấn DNS tới cơ sở hạ tầng DNS
4. Cơ sở hạ tầng DNS phản hồi với 1 list các địa chỉ IP tương thích với tên miền
5. Địa chỉ IP đc trả về trình duyệt
6. Trình duyệt gửi HTTP request tới địa chỉ IP đc nhận
7. ISP forward HTTP request tới web server cần đến

Toàn bộ quá trình trên đc thực hiện chỉ trong khoảnh khắc để tối thiểu delay cho ng dùng.

## Important details

Về chi tiết của DNS, ta sẽ thảo luận tới 1 số khía cạnh quan trọng như sau:

- **Name server:** Có 1 chi tiết quan trọng ta cần hiểu đó là DNS ko chỉ là 1 server đơn. Nó là cả 1 cơ sở hạ tầng với cô số máy chủ, và các DNS servers mà phản hồi lại các truy vấn từ ng dùng ta còn gọi là **name servers**
- **Resource records:** Database của DNS lưu trữ các tên miền map với địa chỉ IP dưới dạng các resource record (RR) - _bản ghi tài nguyên_. Các RR là đơn vị nhỏ nhất chứa đựng thông tin mà ng dùng request từ các name servers. Có nhiều kiểu RRs, trong bản dưới đây ta sẽ tìm hiều 1 số loại RRs thường thấy.

| Type  | Description                                                            | Name        | Value          | Example (Type, Name, Value)                             |
| ----- | ---------------------------------------------------------------------- | ----------- | -------------- | ------------------------------------------------------- |
| A     | Provides the hostname to IP address mapping                            | Hostname    | IP address     | (A, main.tuslipid.com, 1.1.1.1)                         |
| NS    | Provides the hostname that is the authoritative DNS for a domain name  | Domain name | Hostname       | (NS, tuslipid.com, dns.tuslidpid.com)                   |
| CNAME | Provides the mapping from alias to canonical hostname                  | Hostname    | Canonical name | (CNAME, tuslipid.com, sth.tuslipid.com)                 |
| MX    | Provides the mapping of a mail server from alias to canonical hostname | Hostname    | Canonical name | (MX, mail.tuslipid.com, mailserver.backup.tuslipid.com) |

- **Caching:** DNS sử dụng caching ở các lớp khác nhau để giảm độ trễ request cho ng dùng. Caching đóng vai trò rất quan trọng để giảm thiểu gánh nặng lên cơ sở hạ tầng DNS.
- **Hierarchy:** DNS name servers có cấu trúc phân bậc. Cấu trúc này cho phép DNS có tính scalability cao vì lượng truy vấn của nó vô cùng cao.

## How the Domain Name System Works

### DNS hierarchy

Như đã nói lúc trước, DNS ko chỉ là server đơn nhận requests và phản hồi lại cho ng dùng. Nó là 1 cơ sở hạ tầng hoàn chỉnh với các name servers với thứ bậc khác nhau.

Trong thứ bậc của DNS, ta có chủ yếu 4 loại servers:

- **DNS resolver**: Các resolvers khởi tạo chuỗi truy vấn và forward requests tới các DNS name servers khác. Thông thường, các DNS resolvers sẽ nằm trong network của ng dùng, nhưng chúng cũng có thể đáp ứng các request từ ng dùng thông qua các kỹ thuật caching. Những servers này còn đc gọi local servers hoặc servers mặc định
- **Root-level name servers**: Những servers này nhận các requests từ local servers. Root name servers duy trì các name servers dựa trên các top-level domain names, như là `.com`, `.edu`, `.vn`, etc... Ví dụ, khi 1 ng dùng requests tới địa chỉ IP của [xuankhoatu.com](https://xuankhoatu.com/), root-level name servers sẽ trả về 1 list các top-level domain (TLD) servers đang giữ địa chỉ IP của miền `.com`
- **Top-level domain (TLD) name servers:** Những servers này nắm giữ các địa chỉ IP của các name servers có thẩm quyền.
- **Authoritative name servers**: Đây là những DNS name servers cung cấp địa chỉ IP của web servers hoặc application servers

### Iterative versus recursive query resolution

Ta có 2 cách để thực hiện truy vấn DNS:

1. **Iterative:** Local servers sẽ requests lần lượt root, TLD, và các servers có thẩm quyền cho địa chỉ IP
2. **Recursive**: Ng dùng gửi requests tới local servers, rồi local servers requests tới root DNS name servers. Root name servers sẽ forward các requests này tới các name servers khác

Thường thì iterative query sẽ đc ưa chuộng hơn do yêu cầu giảm tải tới cơ sở hạ tầng DNS

### Caching

**Caching** liên hệ tới storage tạm thời lưu trữ các **resource records** mà được requested thường xuyên. 1 **_record_** là 1 đơn vị trong DNS database thể hiện liên kết name-to-value của DNS. Caching sẽ giúp giảm thời gian phản hồi tới ng dùng và giảm network traffic.

### DNS as a distributed system

Bản thân DNS là 1 hệ thống phân tán. Sự phân tán này giúp cho chúng có đc những lợi thế sau:

- Tránh việc 1 node chết là sập (single point failure)
- Đạt được độ trễ thấp
- Tăng độ linh hoạt khi bảp trì hoặc nâng cấp

Hiện nay có tất cả 13 kiểu logical root name servers (được đặt tên từ **A** tới **M**) với rất nhiều instances trải rộng khắp thế giới.

Dưới đây là notes về độ scalability, reliability và consistent của DNS:

#### Highly scalable

Nhờ hệ thống phân cấp, DNS có tính scalability rất cao. Có khoảng 1000 replicated instances của 13 root-level servers được đặt trên toàn cầu để hứng truy vấn từ ng dùng.

Workload sẽ được phân chia trên TLD và root servers để xử lý query, và rồi các servers có thẩm quyền sẽ tổ chức lại để toàn bộ hệ thống hoạt động.

#### Reliable

DNS cũng là 1 hệ thống đáng tin cậy. Sự tin cậy này chủ yếu đến từ 3 lý do sau:

1. **Caching:** Caching được thực hiện ở browser, hệ điều hành và local name server, và các ISP DNS resolvers cũng lưu cache của các dịch vụ đc truy cập thường xuyên.
2. **Server replication:** DNS có các bản sao lưu của mỗi server nằm trong mạng lưới được trải rộng khắp thế giới 1 cách có hệ thống để phục vụ nhu cầu ng dùng với độ trễ thấp.
3. **Protocol:** Rất nhiều clients dựa vào User Datagram Protocol (UDP) để gửi và nhận phản hồi DNS vì chúng có ưu điểm tách biệt với TCP, giúp bù đắp độ ko đáng tin cậy của bản thân chúng. UDP có tốc độ nhanh hơn rất nhiều, giúp tăng cường hiệu năng của DNS.

  1 cái DNS resolver có thể gửi lại UDP request ngay nếu nó ko nhận đc phản hồi từ request trc đó. Quá trình này chỉ cần đúng 1 bước kết nối, khiến cho UDP có độ trễ thấp hơn TCP với tận "3 bước bắt tay" trước khi data đc gửi đi.

#### Consistent

DNS sử dụng vài protocols để cập nhật và chuyển dữ liệu qua các servers sao lưu trong 1 phân cấp. DNS cần tính consistent mạnh để đạt được hiệu năng cao, nhằm đáp ứng mật độ đọc từ DNS databases vượt trội so với mật độ viết.

Tuy nhiên, DNS lại cung cấp eventual consistency và cập nhật các bản ghi vào các servers sao lưu 1 cách lười biếng. Thường thường để update 1 bản record tới toàn bộ Internet có thể mất từ vài giây cho tới tận xấp xỉ 3 ngày, phụ thuộc vào cơ sở hạ tầng, dung lượng update, và phần nào trong cây DNS đang đc updated.

Độ consistent của DNS cũng có 1 chút vấn đề với caching. Vì có các trường hợp mà các bản ghi tài nguyên đang cập nhật vào các servers có ủy quyền thì chúng sập, khiến cho các bản ghi đã được cached có xác suất bị out-dated. Vì thế, mỗi bản ghi đc cached sẽ đi kèm với hạn cache được gọi là **time-to-live (TTL)**.

## Test DNS

Có 1 vài commands giúp ta tra cứu các dns của 1 miền như sau:

- `nslookup`
- `dig`

```bash
nslookup www.google.com

dig www.google.com
```
