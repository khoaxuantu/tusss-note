---
title: Rate Limiter
tags:
id:
unlisted: true
date: 2024-03-05
include:
  - components/image/able-to-zoom
prev_article:
  path: /system-design/cdn
  title: Content Delivery Network
---

# Rate Limiter

**Rate limiter:** Đặt giới hạn số lượng requests mà 1 service sẽ tiếp nhận.

1 client sử dụng API mà được cấu hình chỉ 500 requests/phút, nếu client request với tốc độ vượt qua giới hạn này, client sẽ bị block.

## Why do we need rate limiter?

Nhìn chung, rate limiter đc sử dụng như 1 lớp bảo vệ trước các hình thức tấn công có biểu hiện tăng cao lượng truy cập, như DDOS hay brute-force encryption.

Ngoài ra, nó còn đc ứng dụng vào các use case sau:

- Hạn chế cạn kiệt tài nguyên server
- Quản lý policies và quotas
- Điều khiển data flow
- Tránh vượt quá chi phí

## How will we design a rate limiter?

1. **Requirements**
2. **High-level design**
3. **Detailed design**
4. **Rate limiter algorithms**

## Requirements of Rate Limiter

### Functional Requirements

- Giới hạn số lượng requests mà 1 client có thể gửi tới.
- Có thể config được giới hạn cho mỗi client.
- Đảm bảo client có thể nhận được 1 thông báo nếu tốc độ truy cập vượt ngưỡng cho phép.

### Non-functional Requirements

- **Availability:** Bắt buộc phải tối ưu, đây là lớp bảo vệ cho hệ thống của ta.
- **Low latency:** Vì các API request phải đi qua 1 lớp rate limiter này nữa, nên độ trễ thấp là điều phải có để có thể tối ưu hiệu năng.
- **Scalability:** Highly scalable để có thể rate limit lượng requests tăng cao dần đều.

### Types of throttling

- **Hard throttling:** Set cứng 1 giới hạn.
- **Soft throttling:** Số lượng requests có thể vượt qua 1 giới hạn cho trước vài phần. Ví dụ nếu hệ thống của ta limit 500 requests/minute với 5% vượt giới hạn, ta có thể để client gửi đi 525 requests/minute.
- **Elastic or Dynamic throttling:** Số lượng requests có thể vượt qua giới hạn miễn là vẫn còn resource cho phép.

### Where to place rate limiter

- **Client side:** Đặt ở đây thì khá là dễ làm, nhưng lại ko đảm bảo đủ an toàn vì dễ bị tấn công sau khi request được phát từ client. Hơn nữa, cấu hình phía client cũng ko hỗ trợ tốt cho việc ứng dụng rate limiter.
- **Server side:** Server sẽ chỉ nhận các request mà vượt qua rate limiter được host cùng server đó.
- **Middleware:** Rate limiter hoạt động như 1 middleware, giới hạn các requests trước khi gửi tới servers.

### 2 models for implementing a rate limiter

Vì rate limter sẽ được cài đặt với số lượng khổng lồ cùng với bộ đếm cho lưu lượng requests đi tới, ta có thể sử dụng database để lưu lại thông số cùng với thông tin của người dùng.

- **A rate limiter with a centralized database:** Rate limiter tương tác với 1 database cục bộ, thường là Redis hoặc Cassandra. Với database cục bộ, ta có thể chắc chắn client ko thể vượt qua được giới hạn cho trước. Nhưng hạn chế là gia tăng độ trễ request nếu 1 lượng requests khổng lồ chọc vô database này, cùng với nguy cơ xảy ra race condition đối với lượng requests lớn đồng thời.
- **A rate limiter with a distributed database:** Sử dụng các cụm nodes độc lập cho rate limiter. Ở cách này, mỗi node sẽ phải track rate limit. Vấn đề là client có thể vượt quá giới hạn cho trước khi gửi yêu cầu tới các nodes khác nhau. Để đảm bảo giới hạn, ta phải gia cố các sessions trong load balancer để chắc chắn 1 request chỉ được gửi tới duy nhất 1 node.

### Building blocks we will use

- Databases
- Caches
- Queues

## Design of a Rate Limiter

### High-level design

1 rate limiter có thể đc deploy như là 1 service riêng biệt tương tác với web server. Khi 1 request đi tới, nó sẽ đưa ra quyết định request đó được đi tiếp hay ko.

Rate limiter bao hàm các quy tắc được tuân thủ chặt chẽ, định nghĩa nên throttling limit cho mỗi operation. Dưới đây là 1 ví dụ về limiter rule từ [Lyft](https://github.com/envoyproxy/ratelimit):

```yaml
domain: messaging
descriptors:
	- key: message_type
	- value: marketing
	- rate_limit:
		- unit: day
		- request_per_unit: 5
```

### Detailed design

- Where are the rules stored?
- How do we handle requests that are rate limited?

Trong phần này ta sẽ thảo luận về các components trọng yếu cấu tạo nên rate limiter:

[image is=able-to-zoom]
	src: /img/system-design/rate-limiter-1.webp
	alt: Rate limiter components

**Rule database:** 1 database để chứa các rules. Mỗi rule xác định 1 số lượng giới hạn các requests được chấp nhận trong 1 khoảng thời gian.

**Rule retriever:** Là background process được chạy định kỳ để kiểm tra bất kỳ sự thay đổi nào của rules. Rule cache sẽ được cập nhật từ đó.

**Throttle rules cache:** Cache bao gồm các rules được xuất từ **rule database**. Bộ nhớ cache phục vụ các rate-limiter request nhanh hơn các bộ nhớ ổn định, giúp gia tăng hiệu năng cho hệ thống.

**Decision-maker:** Bộ phận chịu trách nhiệm đưa ra quyết định theo các rules trong bộ nhớ cache.

**Client identifier builder:** Bộ phận này generate ra các ID độc nhất cho request từ 1 client. Nó có thể là 1 địa chỉ remote IP, login ID, hay là giá trị tổng hợp từ nhiều attributes. ID được gen ra này sẽ đc coi là 1 khóa lưu trữ cho dữ liệu ng dùng trong key-value database. Thế nên nó sẽ được chuyển tới **decision-maker** cho các lựa chọn tiếp theo.

Trong trường hợp giới hạn cho trước bị vượt quá, APIs sẽ trả về HTTP code `429 Too many requests`, rồi áp dụng 1 trong 2 chiến lược xử lý sau:

- Bác bỏ request và trả response cụ thể về client.
- Nếu 1 số request bị giới hạn vì hệ thống quá tải, ta có thể lưu lại request đấy trong queue để xử lý sau.

### Request Processing

Khi một request đi tới, _client identifier builder_ sẽ định danh nó và forward tới _decision-maker_. Decision-maker xác định service mà request này yêu cầu, rồi kiểm tra bộ nhớ cache để đối ứng số lượng requests cho phép và rules được thiết lập bởi service.

Nếu request không vượt quá giới hạn cho phép, nó sẽ forward tới _request processor_.

### Race Condition

Trong trường hợp có lượng request đồng thời cao, hiện tượng race condition sẽ dễ xảy ra.

Race condition chủ yếu xuất hiện ở quá trình cập nhật counter của rate limiter. Khi counter được query, tăng số rồi cập nhật lại vào database, sẽ có thể có nhiều requests đi tới cùng một lúc, dẫn tới việc đếm bị sai lệch.

Để tránh vấn đề này, ta có thể sử dụng cơ chế locking, nhưng như thế sẽ phải chấp nhận nguy cơ nút thắt cổ chai và giảm hiệu năng.

1 cách khác ta có thể sử dụng đó là cơ chế "set-then-get", nghĩa là ta sẽ cộng số đếm trước, rồi insert vô database, như thế sẽ đỡ hẳn 1 quá trình query, thu hẹp thời gian cập nhật xuống.

Ngoài ra, ta nên ưu tiên việc shard counter, scale tới nhiều bộ đếm để có thể xử lý lượng request đồng thời cao.

### A rate-limiter should not be on the client's critical path

Giả sử 1 trường hợp thực tế với hàng triệu requests hit vô frontend server. Mỗi request sẽ gọi ra, cập nhật và đẩy số đếm vô database. Quá trình này sẽ gây nên độ trễ lớn trong bối cảnh phải xử lý 1 lượng request khổng lồ. Để tránh vấn đề này, ta nên chia workload thành phần xử lý online và offline.

Ban đầu, khi nhận 1 request đc gửi từ client, hệ thống sẽ tính bộ đếm tương ứng. Nếu nó ít hơn giới hạn cho phép, hệ thống sẽ chấp nhận request này. Ở phase thứ 2, hệ thống sẽ cập nhật bộ đếm và bộ nhớ cache offline. Ở 1 vài request, ta sẽ ko thấy thay đổi nào đáng kể, nhưng với hàng triệu requests, ta sẽ thấy được hiệu suất được cải thiện rõ ràng.

## Rate Limiter Algorithms

- Token bucket
- Leaking bucket
- Fixed window counter
- Sliding window log
- Sliding window counter

### Token bucket algorithm

[image]
	src: /img/system-design/rate-limiter-2.webp
	alt: Token bucket algorithm illustration

Thuật toán này sử dụng sự tương đồng giữa một sức chứa cho trước với 1 cái xô bucket. Bucket theo định kỳ được làm đầy bởi các tokens với tốc độ không đổi. 1 token có thể được coi là 1 gói tin với kích thước cụ thể. Thuật toán kiểm tra token trong bucket mỗi khi nhận 1 request.

Giả sử ta có một rate limit đã đc định nghĩa _R_ và sức chứa của 1 bucket là _C_, flow của thuật toán sẽ như sau:

1. Thuật toán thêm 1 token mới vào bucket mỗi 1/_R_ giây.
2. Thuật toán bỏ qua token mới nếu số lượng token trong bucket bằng với _C_.
3. Nếu ta có _N_ requests đi tới trong khi bucket có _N_ tokens, các tokens sẽ được tiêu thụ, và requests được forward tới các services sau.
4. Nếu ta có _N_ requests đi tới trong khi bucket có số tokens ít hơn _N_, ta sẽ chỉ chấp nhật số requests theo số tokens hiện có trong bucket.

#### Essential parameters

- **Bucket capacity (C)**
- **Rate limit (R)**
- **Refill rate (1/R)**
- **Request count (N)**

#### Advantages

- Phục vụ lượng requests thoải mái miễn là có đủ tokens trong bucket.
- Tối ưu về mặt bộ nhớ tiêu thụ. Ta có thể kiểm soát thông qua kiểm soát lượng token trong bucket.

#### Disadvantages

- Việc lựa chọn parameters hợp lý cho tối ưu sẽ là một việc khó.

### The leaking bucket algorithm

[image]
	src: /img/system-design/rate-limiter-3.webp
	alt: Leaking bucket algorithm illustration

Đây là 1 biến thể của thuật toán token bucket. Thay vì sử dụng token, thuật toán sử dụng 1 bucket với sức chứa có hạn để chứa các requests đi tới

Ý tưởng của thuật toán là dựa theo hiện tượng nước bị nhỏ giọt khỏi 1 xô nước bị quá đầy theo tốc độ không đổi. Lượng requests có thể tới với tốc độ bất kỳ, nhưng sẽ được xử lý theo tốc độ bất biến với thứ tự FIFO

#### Essential parameters

- **Bucket Capacity (C)**
- **Inflow Rate (Rin)**
- **Outflow Rate (Rout)**

#### Advantages

- Nhờ tốc độ xử lý bất biết **Rout**, rate limiter sẽ tránh được hiện tượng burst rate, khi mà 1 lượng lớn requests đi tới trong 1 khoảnh khắc có thể vượt qua giới hạn limit của thuật toán token bucket.
- Với 3 đại lượng trên, thuật toán cho ta khả năng quản lý bộ nhớ rất mạnh mẽ.
- Phù hợp với các ứng dụng có tốc độ output ổn định

#### Disadvantages

- Burst requests có thể làm đầy bucket nhanh chóng, nếu ko xử lý kịp trong thời gian chỉ định, các yêu cầu gần nhất sẽ bị ảnh hưởng.
- Việc xác định bucket size và outflow rate tối ưu là 1 thử thách.

### Fixed window counter algorithm

[image]
	src: /img/system-design/rate-limiter-4.webp
	alt: Fixed window counter algorithm illustration

Thuật toán chia chia thời gian chạy thành các quãng liên tục (được gọi là **windows**) và gán bộ đếm cho từng quãng. Khi 1 window nhận 1 request, bộ đếm tương ứng sẽ tăng 1. Một khi bộ đếm đến giới hạn, rate limiter sẽ ngừng tiếp nhận requests trong quãng thời gian đó.

#### Essential parameters

- **Window size (W)**
- **Rate limit (R)**
- **Request count**

#### Advantages

- Giúp tiết kiệm không gian nhờ ràng buộc về tốc độ requests.

#### Disadvantages

- Có 1 vấn đề lớn với thuật toán này. 1 burst requests có thể xảy đến tại thời điểm chuyển giao giữa 2 windows. Ví dụ, rate limiter chỉ chấp nhận tối đa 10 requests trong 1 phút. Nhưng nếu trong thời điểm 1:30 đến 2:00, có 10 requests tới, rồi 2:00 đến 2:30 lại có 10 requests khác; thành ra đã có tổng 20 requests đi qua rate limiter rồi.

### Sliding window log algorithm

[image]
	src: /img/system-design/rate-limiter-5.webp
	alt: Sliding window log algorithm illustration

Thuật toán này theo dõi từng request đi đến. Khi 1 request tới nơi, thời điểm đó sẽ được lưu lại trong 1 hash map, như là 1 log. Logs này được sorted dựa theo timestamp của request, và số lượng requests được chấp thuận sẽ dựa vào kích cỡ cho phép của log cùng khoảng thời gian hợp lệ.

#### Essential parameters

- **Log size (L)**
- **Arrival time (T)**
- **Time range (Tr)**

#### Advantages

- Thuật toán này không bị ràng buộc bởi các trường hợp chuyển giao giữa các window.

#### Disadvantages

- Nó tốn thêm bộ nhớ để lưu trữ thêm thông tin và timestamp của các requests đến.

### Sliding window counter algorithm

[image]
	src: /img/system-design/rate-limiter-6.webp
	alt: Sliding window counter algorithm illustration

Khác với thuật toán sliding window log ở trên, thuật toán này không giới hạn số lượng requests dựa theo giới hạn thời gian. Thuật toán áp dụng cả fixed window counter lẫn sliding window log để khiến cho requests được xử lý trôi chảy hơn.

#### Essential Parameters

- **Rate limit (R)**
- **Size of the window (W)**
- **The number of requests in the previous window (Rp)**
- **The number of requests in the current window (Rc)**
- **Overlap time (Ot)**

#### Advantages

- Tiết kiệm bộ nhớ nhờ giới hạn các trạng thái: Số lượng requests ở window hiện tại, số lượng request ở window trước đó, phần trăm bị trùng lặp, v.v...
- Xử lý trôi chảy burst requests với tốc độ xấp xỉ tốc độ trung bình dựa theo window trước.

#### Disadvantages

- Thuật toán này giả định số lượng requests trong window trước được phân bố điều, mà đây là điều không phải lúc nào cũng đạt được.

#### E.g

Trong sơ đồ dưới đây, ta có 88 requests ở window trc và 12 requests ở window hiện tại. Ta đã set rate limit ở mức 100 requests tối đa mỗi phút.

Tưởng tượng 1 sliding window đã trượt sang window hiện tại 15s. Tại phút 2:15, thêm 1 request được đi tới, và ta sẽ quyết định chấp nhận request này hay ko dựa trên công thức sau:

```
Rate = Rp * (time_frame - overlap_time) / time_frame + Rc
```

Tại đây, **_Rp_** là số lượng requests trong cửa sổ trước, 88. **_Rc_** là số lượng requests trong cửa sổ hiện tại, 12. _Time frame_ sẽ là 60s (1 phút), và _overlap time_ là 15s.

```
Rate = 88 * (60 - 15) / 60 + 12
     = 78

=> Rate < 100
```

Như vậy request sẽ được chấp nhận.

### A comparison of rate-limiting algorithms

Ta sẽ so sánh các thuật toán dựa trên 2 tiêu chí sau đây:

- **Memory efficient**
- **Allowed burst request bypass**

#### Token bucket algorithm

- **Memory efficient:** Yup
- **Allowed burst requests handle:** Yup

#### Leaking bucket algorithm

- **Memory efficient:** Yup
- **Allowed burst requests handle:** Nope

#### Fixed window counter algorithm

- **Memory efficient:** Yup
- **Allowed burst requests handle:** Yup, 1 burst request ở thời điểm chuyển giao giữa 2 windows có thể vượt qua limit được set

#### Sliding window log algorithm

- **Memory efficient:** Nope
- **Allowed burst requests handle:** Nope

#### Sliding window counter algorithm

- **Memory efficient:** Yup, nhưng sẽ cao hơn các thuật toán có khả năng tối ưu không gian khác.
- **Allowed burst requests handle:** Xử lý burst request đc mượt mà nhất.
