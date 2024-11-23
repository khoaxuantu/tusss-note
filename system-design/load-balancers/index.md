---
title: Load Balancers
tags:
id:
unlisted: true
date: 2023-12-13
next_article:
  path: /system-design/databases
  title: Databases
prev_article:
  path: /system-design/dns
  title: Domain Name System (DNS)
---

# Load Balancers

[image]
  src: /img/system-design/load-balancers.webp
  alt: Load balancer diagram

## Introduction

### What is load balancing?

1 trong những vấn đề cấp bách nhất mà hệ thống nào cũng phải đối mặt khi được đưa lên production chính là khả năng chịu tải từ hàng triệu requests.

Để có thể hứng được lưu lượng requests khổng lồ trong thời gian ngắn, đòi hỏi phải có hàng trăm hàng ngàn, chục ngàn, trăm ngàn servers hoạt động liên kết cùng nhau để chẻ nhỏ số lượng request đó ra.

Từ đó, **load balancers** xuất hiện. Công việc của chúng chính là phân chia tất cả requests từ client 1 cách hợp lý tới các servers đang sẵn sàng, nhằm tránh việc quá tải gây crash lên 1 đơn vị server, giúp tăng tính scalability, availability, performance của cả hệ thống lên.

Load balancing nằm ở lớp tương tác đầu tiên sau tường lửa trong 1 hệ thống trung tâm dữ liệu.

### Placing load balancers

Thông thường, ta đều biết LBs đc đặt giữa clients và servers. Các requests sẽ đi qua lớp load balancing để tới servers và lấy phản hồi về lại clients. Nhưng đây ko phải là nơi duy nhất sử dụng LBs trong hệ thống.

Trước hết, để ý tới 3 nhóm servers phổ biến: web, application và database servers. Để có thể phân chia tải qua các servers đang sẵn sàng, load balancers có thể đc đặt ở giữa 3 services theo các cách như sau:

- Đặt LBs ở giữa end users application và web servers/application gateway
- Đặt LBs ở giữa các web servers và application servers
- Đặt LBs ở giữa các application servers và database servers

[image]
  src: /img/system-design/load-balancers-1.webp
  alt: Load balancer diagram

Trong thực tế, cũng có khả năng load balancers đc sử dụng giữa 2 services bất kỳ với nhiều instances.

### Services offered by load balancers

LBs ko chỉ tăng cường scalability, availability và performance cho các services, chúng còn cung cấp 1 số dịch vụ cốt lõi như sau:

- **Health checking:** LBs sử dụng heartbeat protocol để monitor tình trạng của các servers.
- **TLS termination:** LBs giảm gánh nặng lên servers bằng cách xử lý hộ các TLS termination với client.
- **Predictive analytics:** LBs có thể dự đoán các mẫu traffic để phân tích tình trạng của traffic đi qua nó.
- **Reduced human intervention:** Bởi vì LB cần hoạt động tự động, nên trong logic xử lý lỗi dịch vụ hỗ trợ giảm thiểu việc quản trị hệ thống cũng là cần thiết.
- **Service discovery:** Thông qua service registry, các (micro)services và instances đang sẵn sàng tương ứng với mỗi service được quản lý, nhờ đó requests từ clients sẽ đc forward đến hosting servers thích hợp.
- **Security:** LBs cũng cung cấp các tính năng tăng cường bảo mật nhằm chống lại các cuộc tấn công như deial-of-service (DoS) ở các layer khác nhau trong OSI model (bao gồm layer 3, 4, và 7).

#### What if load balancers fail? Are they not a single point of failure (SPOF)?

- Nếu 1 load balancer oẳng mà ko có con nào khác thay thế, cả hệ thống có thể nói là oẳng (tập trung ở các layer mà con LB đó đang đảm nhiệm). Vì chết mất con trung gian kết nối giữa các layer rồi.
- Nhìn chung, để duy trì tính availability, các tập đoàn sẽ sử dụng 1 clusters gồm nhiều load balancers sử dụng heartbeat communication để kiểm tra sức khỏe cho các load balancers ở mọi lúc. Nếu con LB chính bị oẳng, thì sẽ có con khác thế vào, nếu cả cluster oẳng, thì việc rerouting bằng tay cũng có thể đc thực hiện như giải pháp khẩn cấp.

## Global and Local Load Balancing

- **Global server load balancing (GSLB):** Gồm các traffic tải phân tán qua các khu vực địa lý
- **Local load balancing:** Liên hệ tới các load balancing bên trong 1 data center. Kiểu load balancing này tập trung cải thiện hiệu năng và tối ưu tài nguyên cho hosting servers trong đó

### Global server load balancing

GSLB đảm bảo các traffic tải ở quy mô toàn cầu đc forward tới data center 1 cách hiệu quả. Ví dụ, khi 1 data center bị mất điện hoặc mất mạng, đòi hỏi tất cả traffic phải đc chuyển hướng tới data center khác. GSLB đưa ra quyết định forward dựa trên vị trí địa lý của ng dùng, số hosting servers ở các vị trí khác nhau, "sức khỏe" của data center, etc...

Illust dưới đây diễn tả rằng 1 GSLB có thể forward các requests tới 3 data centers khác nhau, trong mỗi data center sẽ lại có 1 con LB khác để forward tới các servers:

[image]
  src: /img/system-design/load-balancers-2.webp
  alt: Global server load balancing diagram

#### Load balancing in DNS

Ta đc biết rằng DNS có thể phản hồi tới nhiều địa chỉ IP chỉ với 1 DNS query. Ở post [DNS](/system-design/dns), ta cũng đc biết DNS cũng có thể sử dụng load balancing từ output của `nslookup`.

DNS sử dụng 1 kỹ thuật đơn giản để sắp xếp lại list các địa chỉ IP trong phản hồi của mỗi DNS query. Vì thế, các users khác nhau đều nhận list các địa chỉ IP đã đc sắp xếp. Bằng cách này, DNS phân tán tải của các requests đến data centers theo kỹ thuật round-robin:

```
ISP 1 -> DNS infra
=> DNS infra -> ISP 1 -> Data center 1's IP

ISP 2 -> DNS infra
=> DNS infra -> ISP 2 -> Data center 2's IP

ISP 3 -> DNS infra
=> DNS infra -> ISP 3 -> Data center 3's IP

ISP 4 -> DNS infra
=> DNS infra -> ISP 4 -> Data center 1's IP (round-robin)
```

Tuy nhiên, round-robin vẫn có 1 số hạn chế sau:

- Các ISPs khác nhau có số lượng users khác nhau. 1 ISP mà đang serve nhiều khách hàng sẽ cung cấp cùng cached IP tới các clients của nó, dẫn đến phân tán tải ko đều ở end-servers.
- Vì thuật toán round-robin load balancing ko quan tâm tới liệu server có đang bị crashed hay ko, nó tiếp tục phân tán các địa chỉ IP tới crashed servers cho đến khi TTL của cached IP hết hạn.

> DNS ko chỉ là 1 hình thái của GSLB. Application delivery controllers (ADCs) và cloud-based load balancing cũng là ví dụ điển hình cho áp dụng GSLB.

### Local load balancers

#### The need for local load balancers

DNS đóng vai trò sống còn trong việc cân bằng tải, nhưng nó cũng chịu những hạn chế sau:

- DNS packet chỉ có kích thước nhỏ (512 bytes) nên ko đủ để ôm trọn toàn bộ địa chỉ IP của các servers.
- Trạng thái của client được điều khiển rất hạn chế. Các clients có thể lựa chọn rất tùy tiện từ dải địa chỉ IP nhận đc, nên có khả năng địa chỉ IP lựa chọn lại thuộc về 1 data center rất là bận bịu.
- Clients ko thể xác định đc địa chỉ gần nhất để connect tới. Mặc dù ta vẫn có thể thực thi bất kỳ giải pháp địa lý hay truyền hình??? nào thì chúng vẫn ko phải là giải pháp tối ưu.
- Trong trường hợp oẳng, việc khôi phục lại hệ thống có thể tốn nhiều thời gian vì cơ chế caching, đặc biệt khi TTL đc set khá dài.

Để giải quyết mấy vấn đề trên, ta cần 1 layer khác của load balancing dưới dạng các LB nội bộ...

### What is local load balancing?

Các local load balancers đc đặt trong 1 data center, chúng thực hiện nhiệm vụ như 1 reverse proxy và cố gắng chia các requests đi tới các servers đang sẵn sàng. Các requests đi tới từ clients connect liền 1 mạch tới LB sử dụng 1 loại virtual IP address (VIP)

> 1 VIP là 1 address mà ko có máy chủ vật lý tương ứng.

## Advanced Details of Load Balancers

### Algorithms of load balancers

Load balancer phân tán các requests từ client dựa trên 1 số thuật toán, như là:

- **Round-robin scheduling:** Phân chia theo 1 dải địa chỉ IP có thứ tự.
- **Weighted round-robin:** Như trên nhưng các node sẽ đc lưu với độ lớn của nó, node càng to thì sẽ càng đc assign nhiều requests đi tới. Thích hợp với hệ thống chịu nhiều requests.
- **Least connections:** Trong 1 số trường hợp, kể cả khi các servers có cùng 1 sức chứa, vẫn có khả năng tải đc chia ko đều nhau. Ta sẽ cần thuật toán này để khắc phục vấn đề đó, requests càng mới thì sẽ đc assign vào servers đang có càng ít connections.
- **Least response time:** Ở các service yêu cầu tối ưu performance, các thuật toán như suggest response times là thứ rất cần thiết. Chúng giúp đảm bảo các requests từ clients đc ưu tiên tiếp nhận bởi các servers đang có thời gian phản hồi ngắn nhất.
- **IP hash:** Một số ứng dụng cung cấp mức dịch vụ khác nhau cho người dùng dựa trên địa chỉ IP của họ. Trong trường hợp đó, việc băm địa chỉ IP được thực hiện để gán yêu cầu của người dùng cho máy chủ.
- **URL hash:** 1 số dịch vụ của 1 app chỉ phục vụ cho 1 số servers nhất định. Trong trường hợp này, URL sẽ giúp đưa request đến 1 client requesting service phục vụ cho 1 số clusters hoặc nhóm servers

#### Static versus dynamic algorithms

Các thuật toán có thể static hoặc dynamic dựa trên trạng thái của máy tính:

- **Static algorithms** ko quan tâm tới sự thay đổi trạng thái của các servers. Vì vậy, việc bàn giao task sẽ đc dựa trên config của server.
- **Dynamic algorithms** là những thuật toán có quan tâm đến các trạng thái hiện tại hoặc gần đây của các servers. Các thuật toán sẽ duy trì trạng thái bằng cách liên tục giao tiếp với server, và việc quản lý state này khiến cho việc design chúng trở nên phwucs tạp hơn nhiều.

  Các dynamic algorithms yêu cầu các load balancing servers khác nhau để giao tiếp nhằm truyền tải thông tin. Vì thế, các dynamic algorithms có thể phân phạm vi hoạt động theo dạng module, ko cá thể nào đóng vai trò ra quyết định. Nhờ vậy, dù độ phức tạp cho các thuật toán tăng lên, nhưng chất lượng ở các forward decisions sẽ đc tăng cao. Cuối cùng, các dynamic algorithms còn giúp monitor sức khỏe của các servers và chỉ forward các requests tới những servers đang active.

#### Stateful vs stateless LBs

##### Stateful load balancing

Các stateful load balancing tham gia vào việc bảo trì 1 state của các sessions giữa clients và hosting servers. Stateful LB hợp nhất các thông tin của state vào thuật toán mà chúng sử dụng để thực hiện load balancing.

Đặc biệt, các stateful LBs lưu giữ 1 cấu trúc dữ liệu nhằm map các clients tới hosting servers. Tất cả thông tin về session của tất cả clients sẽ đc bảo toàn xuyên suốt toàn bộ load balancer khiến cho chúng trở nên phức tạp hơn và giảm độ scalability xuống.

[image]
  src: /img/system-design/load-balancers-3.webp
  alt: Stateful load balancing diagram

##### Stateless load balancing

Các stateless load balancing ko phải bảo trì các state nên nhẹ và nhanh hơn. Chúng sử dụng consistent hashing để thực hiện để thực hiện các forwading decisions.

Tuy nhiên, nếu cơ sở hạ tầng thay đổi, chẳng hạn như khi ta tạo thêm 1 application server mới, các stateless LBs có lẽ sẽ ko đủ cứng cáp bằng các stateful LBs. Chỉ 1 mình consistent hashing là ko đủ để route các request tới đúng application servers.

[image]
  src: /img/system-design/load-balancers-4.webp
  alt: Stateless load balancing diagram

### Types of load balancers

- **Layer 4 load balancers:** Layer 4 liên hệ tới các quá trình load balancing đc thực hiện trên nền tảng các giao thức như TCP và UDP. Chúng sẽ duy trì connection với clients và đảm bảo cùng 1 giao tiếp (TCP/UDP) sẽ đc forward tới cùng 1 backend server.
- **Layer 7 load balancers:** Layer 7 dựa trên dữ liệu của các giao thức lớp ứng dụng. Các forwading decisions dựa trên HTTP headers, URLs, cookies, etc... sẽ đc thực hiện ở đây. Bên cạnh việc thực thi TLS termination, các LBs ở lớp này còn chịu trách nhiệm cho việc giới hạn ng truy cập, HTTP routing và ghi đè header.

> Layer 7 thông minh, layer 4 nhanh...

### Load balancer deployment

Trên thực tế, chỉ 1 lớp LB là ko đủ cho 1 trung tâm dữ liệu lớn. 1 data center truyền thống có thể có cấu trúc 3-tier LB như sau:

[image]
  src: /img/system-design/load-balancers-5.webp
  alt: Load balancer layers diagram

#### Tier-0 and tier-1 LBs

Nếu DNS đc coi là tier-0 load balancer, equal cost multipath (ECMP) routers sẽ là tier-1 LBs.

Ở lớp này, lượng tải đi tới sẽ được chia đều dựa theo IP hoặc 1 số thuật toán như round-robin hoặc weighted round-robin. Tier-1 LBs sẽ cân bằng lượng tải giữa các đg dẫn khác nhau tới các tier load balancers cao hơn.

ECMP routers đóng vai trò thiết yếu cho tính horizontal scalability.

#### Tier-2 LBs

Tier-2 sẽ bao gồm layer 4 load balancers. Ở tier này, các LBs đảm bảo với bất kỳ kết nối nào, tất cả gói tin đi tới sẽ đc forward tới tier-3 LBs.

#### Tier-3 LBs

Ở tier-3 sẽ là layer 7 load balancers. Đây sẽ là lớp connect trực tiếp tới các backend servers. Và vì đây là lớp cuối trc server pool, chúng sẽ thực hiện việc montoring cho các servers ở cấp độ HTTP.

> - Tier-1 cân bằng tải giữa các load balancers
> - Tier-2 làm cầu nói để requests đc forward từ tier-1 tới tier-3 mượt mà
> - Tier-3 thực hiện nhiệm vụ load balancing giữa các backend servers
