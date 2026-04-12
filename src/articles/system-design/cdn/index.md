---
title: CDN
tags:
id:
unlisted: true
date: 2024-02-21
include:
  - components/image/able-to-zoom
prev_article:
  path: /system-design/key-value-store
  title: Key-value Store
next_article:
  path: /system-design/rate-limiter
  title: Rate Limiter
---

# The Content Delivery Network (CDN)

## Problem statement

> Nếu hàng triệu người dùng sử dụng app nặng về dữ liệu của ta, và ta chỉ deploy dịch vụ lên 1 data center tập trung để phục vụ user request, những vấn đề nào sẽ bị nảy sinh?

- Độ trễ cao.
- Các ứng dụng cần nhiều dữ liệu sẽ yêu cầu truyền tải lượng traffic rất lớn. Việc tất cả traffic bị đổ dồn vào 1 nơi sẽ dễ gây nên quá tải.
- Resource của trung tâm dữ liệu trở nên khan hiếm: việc đổ dồn traffic như vậy khiến cho data center phải tiêu tốn tối đa tài nguyên để xử lý hết các request.

## How will we design a CDN?

Ta sẽ chia việc thiết kế hệ thống CDN này ra 4 sections:

- **Introduction to a CDN**
- **Design a CDN**
- **In-depth Investigation of CDN**
- **Evaluation of CDN**

## Introduction to a CDN

### Proposed Solution

> CDN - giải pháp nghe như sấm bên tai rồi.

Đây là 1 nhóm các proxy servers phân tán theo vị trí địa lý.

1 **proxy server** là 1 server trung gian nằm giữa client và server gốc. Các proxy servers được đặt trong _network edge_ - 1 vùng mà tại đó kết nối mạng nội bộ hoặc thiết bị tới Internet.

Vì network edge ở gần với end users, việc đặt các proxy servers ở đây giúp phân phối nội dung tới ng dùng 1 các nhanh chóng với việc giảm độ trễ và băng thông.

Ở đây, ta có thể đưa dữ liệu tới gần người dùng hơn bằng cách đặt 1 data center nhỏ gần họ và lưu trữ bản copy của dữ liệu ở trong data center này. CDN chủ yếu lưu trữ 2 loại dữ liệu: tĩnh (có thể tồn tại trong thời gian dài như ảnh ọt) và động (có thể bị thay đổi liên tục như ads, live video).

Từ những vấn đề đc nêu ra ở problem statement, CDN có thể giải quyết ntn:

- **High latency:** CDN mang content tới gần với end users hơn => giảm độ trễ.
- **Data-intensive applications:** vì con đường từ client tới điểm lấy dữ liệu chỉ giới hạn trong ISP và các CDN components gần đó, các app phải xử lý nhiều dữ liệu sẽ ko phải lo sợ khi lượng người dùng truy cập lớn nữa.
- **Scarcity of data center resources:** Hầu hết traffic sẽ chỉ tới các CDN thay vì servers gốc, nên lượng tải tới servers gốc được tối thiểu hóa.

1 số nhà cung cấp CDN phổ biến:

- Cloudflare
- Akamai
- StackPath
- Rackspace
- Amazon Cloudfront
- Google Cloud CDN

### Requirements

#### Functional requirements

- **Retrieve:** Khả năng lấy dữ liệu. Dựa trên CDN models (push hoặc pull)
- **Request:** CDN servers phải phản hồi lại các requests đến từ người dùng
- **Deliver:** CDN phân phối nội dung tới người dùng, server gốc đẩy content tới CDN
- **Search:** Khả năng tìm kiếm content theo request từ người dùng nếu đã cached, còn ko thì request lấy content tới server gốc
- **Update:** Ở hầu hết trường hợp CDN sẽ lấy content từ server. Nhưng ta nên thêm tính năng có thể lấy dữ liệu từ CDN gần đó như 1 Point of Presence.
- **Delete:** Dựa trên kiểu nội dung, CDN cần có khả năng xóa cached entries sau 1 thời gian nào đó

#### Non-functional requirements

- **Performance:** Tối thiểu độ trễ là ưu tiên hàng đầu.
- **Availability:** Expected sẵn sàng ở mọi lúc, và đứng vững được các cuộc tấn công DDOS.
- **Scalability:** Sẽ có lượng lớn người dùng truy cập CDN, cùng với tính chất phân tán của nó, khả năng scale theo chiều ngang sẽ là cách lý tưởng được yêu cầu.
- **Reliability and Security:** Cần đảm bảo ko có single point failure, và cần có giải pháp giúp bảo mật nội dung trc nhiều loại tấn công.

#### Building blocks we will use

1 combo default luôn song hành cùng nhau, đó là:

- **DNS**: map các tên CDN name thân thiện với con người thành các địa chỉ IP thân thiện với máy tính, đưa ng dùng tới proxy servers.
- **Load Balancers**: phân tán hàng triệu requests qua các proxy servers.

## Design a CDN

### CDN overview

Ta sẽ đi 1 lượt về thiết kế của CDN trong 2 phases:

1. Phase thứ nhất bao gồm các components tạo nên 1 hệ thống CDN.
2. Phase thứ hai sẽ khám phá các workflow bằng cách giải thích cách mỗi components tương tác với components khác để phát triển nên CDN đầy đủ tính năng.

#### CDN Components

[image is=able-to-zoom]
	src: /img/system-design/cdn.webp
	alt: CDN components

- **Clients:** End users sử dụng nhiều browsers và thiết bị để request lấy nội dung từ CDN.
- **Routing system:** Hệ thống routing để chuyển hướng người dùng tới CDN server gần nhất.
- **Scrubber servers:** Các servers này được sử dụng để chia tách traffic an toàn khỏi các traffic nhiễm độc và bảo vệ hệ thống khỏi các loại tấn công nổi tiếng như DDOS.
- **Proxy servers:** Proxy hoặc edge proxy servers lưu trữ các hot data ở RAM, cold data ở disk.
- **Distribution system:** Chịu trách nhiệm phân tán nội dung tới tất cả proxy servers và các tiện nghi CDN khác.
- **Origin server:** Các cơ sở hạ tầng của CDN được xây dựng với mục đích giúp người dùng nhận được dữ liệu từ server gốc. Các server gốc phục vụ bất kỳ dữ liệu mà ko có sẵn ở CDN cho client.
- **Management system:** Cung cấp các số liệu như độ trễ, downtime, packet loss, server load, etc... phục vụ cho business và quản lý.

#### Workflow

1. Server gốc cung cấp URI namespace tới tất cả object được cached trong CDN tới hệ thống request routing.
2. Server gốc gửi nội dung tới hệ thống chịu trách nhiệm phân tán nội dung qua các edge proxy servers.
3. Hệ thống phân tán nội dung gửi nội dung tới các proxy servers và gửi feedback lại hệ thống request routing. Các feedback này sẽ hữu dụng trong việc tối ưu lựa chọn proxy gần nhất tới request client.
4. Client yêu cầu hệ thống routing địa chỉ IP của proxy server phù hợp.
5. Hệ thống request routing trả về địa chỉ IP của proxy server phù hợp.
6. Request của client đc được route qua các scrubber servers để đảm bảo bảo mật.
7. Scrubber servers forward các traffic an toàn tới edge proxy servers.
8. Edge proxy servers phục vụ nội dung theo client request.

### API Design

#### Retrieve (proxy server to origin server)

Proxy server yêu cầu content từ origin server với GET method như sau:

```
GET /retrieve
```

```go
retrieveContent(proxy_server_id, content_type, content_version, description)
```

- _Params_:
	- **proxy_server_id:** ID độc nhất của 1 proxy server.
	- **content_type:** Loại content mong muốn.
	- **content_version:** Phiên bản của content. Nếu ko có phiên bản trước nào trong proxy server, giá trị sẽ là `null`.
	- **description:** Mô tả chi tiết của content.
- _Return:_ Response as JSON

	```json
	{
		"text": "",
		"content_type": "",
		"url": "",
		...
	}
	```

#### Deliver (origin server to proxy servers)

Server gốc dùng API này để gửi các nội dung cụ thể tới proxy servers.

```
/deliver
```

```go
deliverContent(origin_id, server_list, content_type, content_version, description)
```

- _Params:_
	- **origin_id:** ID của server gốc.
	- **server_list:** List các proxy servers mà nội dung sẽ đc gửi tới.
	- **content_version:** Phiên bản content được cập nhật. Proxy server nhận content này sẽ bỏ phiên bản cũ đi.
	- **description:** Thông tin chi tiết đi kèm.

#### Request (clients to proxy servers)

Người dùng sử dụng API này để yêu cầu content từ proxy servers.

```
/request_content
```

```go
requestContent(user_id, content_type, description)
```

- _Params:_
	- **user_id**: ID của người dùng.
	- **content_type:** Loại content mong muốn.
	- **description:** Thông tin chi tiết đi kèm.

#### Search (proxy server to peer proxy servers)

Proxy server sử dụng API này để có thể tìm kiếm content từ các peer proxy servers khác, từ đó giảm tải hơn nữa lượng tải tới server gốc.

```
/search
```

```go
searchContent(proxy_server_id, content_type, description)
```

- _Params:_
	- **proxy_server_id:** ID của proxy server request.
	- **content_type:** Kiểu nội dung mong muốn.
	- **description:** Thông tin chi tiết đi kèm.

#### Update (proxy server to peer proxy servers)

Proxy server sử dụng API này để cập nhật nội dung lấy từ peer proxy servers POP.

```
/update
```

```go
updateContent(proxy_server_id, content_type, description)
```

- _Params:_
	- **proxy_server_id:** ID của peer proxy server được chỉ định để lấy content.
	- **content_type:** Kiểu dữ liện cho content được update.
	- **description:** Thông tin chi tiết đi kèm.

## In-depth Investigation of CDN

### Content caching strategies in CDN

#### Push CDN

[image]
	src: /img/system-design/cdn-1.webp
	alt: Push CDN illustration

Trong push CDN model, nội dung được gửi tự động từ origin server tới proxy servers. Nhà cung cấp nội dung sẽ chịu trách nhiệm trong việc chuyển giao nội dung tới các CDN proxy servers.

Thích hợp với static content delivery, tại đó origin server quyết định nội dung nào được đưa tới người dùng qua CDN. Nội dung được đẩy lên proxy servers ở các đa dạng vị trí địa lý tùy thuộc theo độ phổ biến ở đó.

Nếu nội dung liên tục thay đổi, mô hình này có thể gặp khó khăn để theo kịp sự thay đổi với rất nhiều content push dư thừa.

#### Pull CDN

[image]
	src: /img/system-design/cdn-2.webp
	alt: Pull CDN illustration

CDN kéo các dữ liệu ko có sẵn từ origin server tới người dùng. Các proxy servers lưu trữ các files trong 1 thời gian nhất định rồi xóa nếu chúng ko còn được yêu cầu trong suốt thời gian đó để cân bằng dung lượng và chi phí.

Bản thân CDN chịu trách nhiệm trong việc kéo nội dung được yêu cầu từ origin server và deliver cho người dùng. Mô hình này thích hợp nhất với các dynamic content và lượng traffic tải cao.

> - Hầu hết nhà cung cấp nội dung áp dụng cả 2 mô hình để tận dụng được lợi thế cả 2.
> - Vì static content hướng tới tệp người dùng rộng lớn hơn dynamic content, push CDN sẽ yêu cầu nhiều replicas hơn pull CDN để đáp ứng tính sẵn sàng cao nhất.

### Dynamic content caching optimization

1 số việc tạo dynamic content yêu cầu phải thực thi các đoạn scripts ở proxy server thay vì origin server. Chẳng hạn, ta có thể có những trường hợp cần generate dynamic content dựa trên vị trí người dùng, thời gian theo vùng, APIs cụ thể cho từng vùng, etc...

Để giảm thiểu lưu lượng dữ liệu giữa server gốc và các proxy servers, cùng với giới hạn về storage ở proxy servers, ta có thể áp dụng giải pháp nén dữ liệu lại. Ví dụ, Cloudflare sử dụng Railgun để nén dynamic content.

### Multi-tier CDN architecture

[image is=able-to-zoom]
	src: /img/system-design/cdn-3.webp
	alt: Multi-tier CDN architecture illustration

CDN tuân theo kiến trúc dạng cây để giảm bớt gánh nặng phân tán dữ liệu cho server gốc.

Cấu trúc dạng cây này giúp ta scale hệ thống dễ dàng hơn. Khi lượng người dùng truy cập tăng cao, ta chỉ cần thêm các server nodes ở "nhánh cây".

Với 1 2 tầng proxy servers (caches), lượng tải tới server gốc cũng được giảm tải đáng kể xuống còn 1 nửa

### Find the nearest proxy server to fetch data

#### Important factors that affect the proximity of the proxy server

- **Network distance:** giữa người dùng và proxy server
  - Độ dài của network
  - Giới hạn băng thông
- **Request load:** là lượng tải mà 1 proxy server phải xử lý trong 1 thời điểm. Nếu 1 proxy server bị quá tải, hệ thống request routing phải forward request tới server ít tải hơn.

#### DNS redirection

> DNS có thể trả về client 1 URI thay vì 1 IP

[image is=able-to-zoom]
	src: /img/system-design/cdn-4.webp
	alt: DNS redirection illustration

Cách tiếp cận bằng DNS redirection này bao gồm 2 bước:

1. Map clients với vị trí network thích hợp.
2. Phân tán tải qua các proxy servers trong vị trí đó để cân bằng tải.

#### Anycast

**Anycast** là 1 phương pháp routing mà tại đó tất cả edge servers trong nhiều địa điểm chia sẻ chung 1 địa chỉ IP. Chúng sử dụng **Border Gateway Protocol (BGP)** để route clients dựa trên Internet.

#### Client multiplexing

**Client multiplexing** gửi cho clients 1 list các servers ứng viên. Client chọn ra 1 server trong list đó để gửi request tới.

#### HTTP redirecting

Đây là cách dễ nhất. Clients sẽ gửi yêu cầu nội dung tới server gốc. Server gốc sẽ phản hồi với 1 HTTP protocol để chuyển hướng người dùng thông qua URL của nội dung.

Dưới đây là 1 đoạn HTML snippet của Facebook. Ta có thể để ý từ thẻ `<img></img>`, người dùng sẽ được chuyển hướng tới CDN cho Facebook logo.

```html
<!––  The code below is taken from Facebook. -->
<div class="fb_content clearfix " id="content" role="main">
  <div>
    <div class="_8esj _95k9 _8esf _8opv _8f3m _8ilg _8icx _8op_ _95ka">
      <div class="_8esk">
        <div class="_8esl">
          <div class="_8ice">
            <img class="fb_logo" src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" />
          </div>
          <h2 class="_8eso">Facebook helps you connect and share with the people in your life.</h2>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Content consistency in CDN

Dữ liệu trong proxy servers nên được thống nhất với dữ liệu trong server gốc, nhưng cũng ko lại trừ nguy cơ dữ liệu ở 2 bên bị lệch nhau. Điều này khiến cho người dùng có thể truy cập tới nội dung bị chậm cập nhật.

Ta có thể áp dụng nhiều cơ chế khác nhau để củng cố tính thống nhất của dữ liệu, tùy vào model pull CDN hay push CDN.

#### Periodic polling

Được sử dụng cho pull model. Proxy servers yêu cầu server gốc cập nhật dữ liệu và thay cached content định kỳ. Periodic polling sử dụng **time-to-refresh (TTR)** để đặt thời gian yêu cầu cập nhật dữ liệu.

#### Time-to-live (TTL)

Với TTR, proxy servers có thể yêu cầu cập nhật các dữ liệu vô dụng, nên có 1 cách khác tốt hơn có thể giảm tải số lượng request cập nhật lại, đó là **time-to-live (TTL)**.

Mỗi object sẽ có 1 attribute TTL được gán bởi server gốc, tượng trưng cho thời gian mà object này sẽ hết hạn. Proxy server sẽ phục vụ phiên bản của object này cho đến khi chũng hết hạn.

Khi xác định được là dữ liệu đã hết hạn, proxy servers sẽ kiểm tra cập nhật từ server gốc. Nếu dữ liệu đã được thay đổi, proxy servers sẽ lấy phiên bản mới nhất của dữ liệu đó, còn ko thì chúng sẽ giữ nguyên dữ liệu và chỉ thay đổi TTL.

#### Leases

Ở kỹ thuật này, server gốc sẽ cho proxy server "thuê", hoặc "subscribe" data.

Nghĩa là nếu proxy server yêu cầu 1 data object, server gốc sẽ gửi object đó đi kèm với thông tin "cho thuê", bao gồm 1 giá trị time range. Giá trị quãng thời gian đó đóng vai trò xác định thời gian mà proxy server sẽ được server gốc "thông báo" nếu có sự thay đổi phiên bản của data object.

Như vậy, nếu ở server gốc có cập nhật nào với 1 data object, nó sẽ "thông báo" tới các proxy server đang subscribe object này, và cập nhật tới phiên bản mới nhất.

### Deployment

Trước khi cài đặt các tiện nghi cho CDN, ta cần phải trả lời được 2 câu hỏi này trước:

- Địa điểm tối ưu nhất để cài đặt proxy servers cho CDN là đâu?
- Ta sẽ cài đặt bao nhiều CDN servers?

#### Placement of CDN proxy servers

Các CDN proxy servers phải được đặt ở nơi có mạng lưới networks được kết nối tốt:

- **On-premise small data centers** có thể đặt gần với các major IXPs.
- **Off-premises** đặt các CDN servers ở các networks của ISP.

Hiện nay, việc lưu giữ 1 lượng lớn dữ liệu dạng video trong 1 cơ sở hạ tầng CDN mà đc đặt trong ISP là điều hoàn toàn khả thi.

Tuy vậy, với các dịch vụ như Zootube, lượng dữ liệu là quá lớn và ngày càng mở rộng thêm nên việc quyết định cho cái gì cần người dùng là 1 thử thách khó khăn.

Google sử dụng split TCP để giảm delay từ phía người dùng bằng cách giữ kết nối liên tục với các TCP windows khổng lồ từ cơ sở hạ tầng cấp IXP tới trung tâm dữ liệu ưu tiên của họ. Áp dụng cách này sẽ giúp cho Zootube tránh được việc phải khởi tạo 3-way handshake trong 1 TCP connection và tình trạng slow-start ở các host cách xa địa lý.

> Akamai và Netflix đã phổ cập ý tưởng về giữ các CDN proxy servers của họ trong ISPs của clients. Mặt khác, Google cũng có cơ sở hạ tầng CDN riêng tư nhưng dựa vào các servers gần IXPs hơn, lý do chủ yếu đến từ việc lượng dữ liệu khổng lồ và việc thay đổi các patterns.

#### CDN as a service

Trước khi sử dụng các dịch vụ public CDN, các nhà cung cấp nội dung cần cân nhắc các điều kiện sau:

- Nếu public CDN oẳng, ta sẽ chỉ có thể ngồi chờ cho đến khi dịch vụ đc khôi phục lại.
- Nếu các dịch vụ CDN ko có các proxy servers đặt tại vùng hoặc quốc gia gần với nơi mà website traffic bắt đầu, đen thôi đỏ quên đê
- Có trường hợp các miền và địa chỉ IP của nhà cung cấp CDN bị chặn ở 1 số quốc gia.

> 1 số công ty sẽ tự xây dựng CDN thay vì sử dụng các dịch vụ của nhà cung cấp CDN. Như Netflix họ tự build nên 1 hệ thống riêng gọi là **Open Connect**.

#### Specialized CDN

Trong trường hợp công ty tự xây dựng CDN, họ sẽ quan tâm tới những điểm sau:

- 1 specialized CDN bao gồm các points of presence (PoPs) mà chỉ phục vụ nội dung cho bản thân công ty. Những PoPs này có thể là các caching servers, reverse proxies hoặc application delivery controllers.
- Ban đầu việc xây dựng specialized CDN sẽ rất tốn kém, nhưng chi phí sẽ giảm dần về sau.
- PoPs trong specialized CDN bao gồm rất nhiều proxy servers phục vụ hàng TBs nội dung. 1 private CDN có thể cùng tồn tại với 1 public CDN, để trong trường hợp private CDN bị oẳng thì sẽ có public CDN ứng cứu.

Netflix's **Open Connect Appliance (OCA)** là 1 ví dụ điển hình. Các OCA servers ko lưu lại dữ liệu của người dùng, thay vào đó chúng đáp ứng đầy đủ các tasks sau:

- Chúng báo cáo lại status của chúng, các routes đã ghi nhận, và thông tin chi tiết của nội dung đc cached cho Open Connect control plane trên AWS.
- Chúng phục vụ nội dung đc cached mà đc yêu cầu bởi người dùng.

#### Why Netflix built its CDN

- Các nhà cung cấp CDN không đủ nguồn lực để mở rộng cơ sở hạ tầng của họ sao cho đáp ứng được tốc độ tăng trưởng nhanh của Netflix.
- Với sự tăng cao vượt trội của lượt streaming video, chi phí cho dịch vụ CDN bị đội lên nhiều lần.
- Video streaming là business cốt lõi của Netflix, nên việc bảo mật an toàn nội dung được đặt lên ưu tiên hàng đầu.
- Để cung cấp media streaming 1 cách tối ưu nhất cho người dùng, Netflix cần phải tối đa hóa khả năng kiểm soát video player của người dùng, network giữa người dùng và servers của Netflix.
- OCA của Netflix có thể custom HTTP modules và các thuật toán liên quan TCP connection để có thể detect vấn đề network 1 cách nhanh nhất.
- Netflix muốn giữ các nội dung nổi trội trong 1 thời gian dài, nếu phục vụ chúng bằng public CDN thì chi phí sẽ rất cao.

## Evaluation of CDN's Design

Để nhắc lại, requirements chính của ta là hiệu năng cao, tính sẵn sàng, tính scalability, độ tin cậy và an toàn bảo mật.

### Performance

CDN đạt được hiệu năng cao nhờ tối ưu độ trễ. 1 số điểm đang chú ý như sau:

- Proxy servers phục vụ nội dung bằng RAM.
- CDN proxy servers được đặt ở gần người dùng.
- 1 CDN có thể đóng vai trò là 1 provider cho các proxy servers đc đặt trong ISP hoặc **Internet exchange points (IXPs)** để xử lý traffic cao.
- Hệ thống request routing đảm bảo người dùng đc điều hướng tới proxy server gần nhất.
- Proxy servers lưu trữ long-tail content trong SSD hoặc HDD.
- Proxy servers có thể được implemented theo layers mà tại đó nếu 1 layers ko chứa nội dung yêu cầu, request sẽ được gửi tới layers tiếp theo để lấy nội dung.

### Availability

1 CDN có thể đối phó với lượng traffic khổng lồ nhờ đặc tính phân tán của nó.

Tính sẵn sàng đc đảm bảo thông qua việc content đc cached có thể đc tận dụng như backup trong trường hợp server gốc oẳng.

Edge proxy servers có thể đạt được tính sẵn sàng nhờ việc sao lưu dữ liệu tới nhiều proxy servers để tránh single point failure và thỏa mãn lượng tải yêu cầu.

Load balancer cũng đóng vai trò quan trọng trong việc phân tán request của người dùng tới các proxy servers.

### Scalability

- CDN mang nội dung đến gần người dùng và giảm thiểu yêu cầu băng thông cao, nên đảm bảo được mục đích của tính scalability.
- Ta có thể áp dụng horizontal scalability bằng cách thêm các replicas dưới dạng edge proxy servers.
- Hạn chế của horizontal scalability và dung lượng lưu trữ của 1 proxy server có thể đc xử lý bằng cấu trúc chia CDNs theo layers.

### Reliability and Security

- CDN đảm bảo ko single point failure bằng cách thực hiện các chu kỳ bảo trì và tích hợp thêm phần cứng và phần mềm nếu cần.
- CDN xử lý traffic khổng lồ bằng các phân tán lượng tải đều tới các proxy servers, cùng với đó là các scrubber servers để đối phó lại DDOS.
- Ta có thể sử dụng **hearbeat protocol** để monitor trạng thái của các servers và xác định được các servers bị sập.
- Các real-time applications cũng tự xây dựng nên CDN để tránh khỏi việc nội dung bị leak, giúp bảo mật nội dung cho người dùng.
