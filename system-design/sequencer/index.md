---
title: Sequencer
tags:
id: sequencer
unlisted: true
date: 2025-02-12
include:
  - components/image/able-to-zoom
  - components/block/note
prev_article:
  path: /system-design/rate-limiter
  title: Rate Limiter
description: Trong 1 hệ thống phân tán lớn, mỗi giây sẽ có hàng triệu events xảy ra. Làm sao để thiết kế 1 component có thể định danh từng đấy sự kiện trong một khoảnh khắc?
---

# Sequencer

## Motivation

Trong 1 hệ thống phân tán lớn, mỗi giây sẽ có hàng triệu events xảy ra.

> Comments trong Facebook?
> 1 Tweet được share?
> 1 post Instagram?

Ta sẽ cần 1 cơ chế để có thể phân biệt hàng tấn events với nhau. 1 trong các cách đó là tạo 1 ID độc nhất cho mỗi event.

Các ID độc nhất sẽ giúp ta xác định đc luồng của events và giúp cho việc debug trở nên dễ dàng hơn.

## How do we design a sequencer?

1. **Design of a Unique ID Generator**
2. **Unique IDs with Causality**

## Design of a Unique ID Generator

### Requirements for unique identifiers

- **Uniqueness**
- **Scalability:** Áng trước 1 chiếc generator có thể gen được 1 tỷ IDs 1 ngày
- **Availability:** Với việc các events chỉ diễn ra trong hàng nanoseconds, ta cần phải đảm bảo độ sẵn sàng tối đa để có thể gen IDs cho tất cả events
- **64-bit numeric ID:** Ta giới hạn độ dài bit chỉ trong 64-bit, nhiêu đó là đủ để có được ID dùng cho rất nhiều năm sau này.

### First solution: UUID

Đây là 1 số 128 bit và được biểu diễn dưới dạng hexadecimal ví dụ như sau:

```
123e4567e89b12d3a456426614174000
```

Giải pháp này cho ta 10^38 số.

Mỗi server có thể tự gen ID của riêng no và gán ID vào các event liên quan tới nó. Vì UUID độc lập với server nên việc scale là rất dễ dàng. Ngoài ra chúng cũng cho độ sẵn sàng cao với tỷ lệ bị lặp rất thấp.

#### Hạn chế

- Sử dụng số 128 bit làm primary key khiến việc index theo primary key trở nên chậm hơn, dẫn tới tiến trình insert sẽ chậm hơn.
- Vẫn có nguy cơ bị trùng ID.

### Second solution: using a database

Sử dụng 1 database tập trung để gen unique IDs.

[.note]

  Nhằm tránh việc giải pháp này có thể trở thành 1 single point failure, ta có thể đối phó như sau:

  Chỉnh sửa tính năng auto-increment của database. Thay vì cộng dồn 1 đơn vị như thường lệ, ta sẽ cộng dồn dựa theo 1 giá trị `m`, với `m` là số database servers mà ta có.

  Mỗi server gen 1 ID, và cộng dồn ID tiếp theo với step là `m`.

  Ví dụ nếu ta có 3 database servers, thì server đầu sẽ gen ID theo thứ tự 1 -> 4 -> 7 -> 10 -> ...

#### Hạn chế

Giải pháp này sẽ khá khó scale cho hệ thống được đặt ở nhiều data centers.

### Third solution: using a range handler

Tưởng tượng trong 1 dãy số từ 1 đến 2 tỷ, ta có thể chia thành các khoảng nhỏ. Ví dụ như 1 -> 1000000, 1000001 -> 2000000, etc...

Ta có thể cho các server đăng ký từng khoảng một như vậy, và chúng sẽ sử dụng các đơn vị trong khoảng đó để làm ID. Khi 1 khoảng được dùng hết, server sẽ cần request để được cấp phát thêm 1 khoảng mới.

Như vậy, ta sẽ cần 1 service nhỏ để làm nhiệm vụ quản lý các khoảng ID được cấp phát cho các servers. Service này sẽ lưu các khoảng đang bận và thông tin cùng trạng thái của server đang sử dụng 1 khoảng nào đó.

Service quản lý các khoảng IDs cũng có thể trở thành single point of failure, nên ta cũng cần failover server cho service đó.

#### Ưu điểm

Scalable, available, unique IDs. Ta có thể bảo trì các khoảng với dạng số 64 bits.

#### Nhược điểm

Ta có thể bị mất 1 khoảng IDs lớn nếu 1 server đã đăng ký sử dụng 1 khoảng IDs bị oẳng giữa chừng.

Nhằm giảm thiểu thiệt hại nếu trường hợp này xảy ra, ta nên chi cấp pháp các khoảng IDs nhỏ vừa đủ cho các servers.

### Use UNIX time stamps

UNIX time stamps được chia theo đơn vị millisecond và có thể sử dụng để xác định timeline của các events.

Ta có thể áp dụng UNIX time stamps để tạo 1 server gen IDs có thể gen 1 ID mỗi millisecond. Bất kỳ request gen ID đều sẽ được điều hướng tới server này.

Khả năng gen ID theo ms cho phép ta có thể gen 1000 IDs/s ⇒ Trong 1 ngày, ta có thể gen tới:

```
24(hour) * 60(min/hour) * 60*(sec/min) * 1000 (ID/sec) = 86400000 (IDs)
```

[.note]

  Nhằm tránh server gen ID có thể trở thành 1 single point of failure, ta có thể thêm nhiều server gen ID cùng lúc. Mỗi server đảm bảo việc gen ra unique ID bằng cách thêm 1 prefix độc nhất của server đó cùng với time stamps vào ID.

#### Ưu điểm

Cách tiếp cận này đơn giản, đảm bảo tính mở rộng, và cho phép nhiều servers handle requests đồng thời.

#### Nhược điểm

Nếu chỉ có 1 server gen ID, các request đồng thời sẽ nhận cùng 1 time stamps, dẫn tới việc ID ko còn độc nhất.

### Twitter Snowflake

[image is=able-to-zoom]
  src: /img/system-design/sequencer.svg
  title: Twitter Snowflake illustration
  caption: "Twitter Snowflake illustration (Source: Educative.io)"

***Chú thích***

- **Sign bit:** Bit đánh dấu, giá trị luôn luôn là 0, nhằm đảm bảo luôn luôn gen ra số dương bất kể môi trường nào.
- **Time stamp:** 41 bits đại diện cho giá trị milliseconds. 41 bits này cho phép ta dùng hết trong xấp xỉ 69 năm nếu tiêu thụ ở mức 1000 identifiers/s. Ta có thể lấy time stamp hiện tại, trừ đi time stamp khi server được deploy và chuyển giá trị được trừ về dạng nhị phân.
- **Worker number:** 10 bits đại diện cho mã số của worker, cho ta sử dụng tối đa 2^10 = 1024 worker IDs.
- **Sequence number:** 12 bits đại diện cho số thứ tự tăng dần. Với mỗi ID được gen ra, số thứ tự sẽ được tăng thêm 1 đơn vị. 12 bits cho ta tối đa 2^12 = 4096 số thứ tự độc nhất, và ta có thể reset về 0 nếu số thứ tự đạt 4096.

#### Ưu điểm

- Có thể sắp xếp thứ tự theo thời gian
- Độ sẵn sàng cao

#### Nhược điểm

- Có thể bị ảnh hưởng bởi hiện tường **dead period**. Đó là khi ko có request gen ID nào được gửi tới server. Các IDs trong khoảng thời gian này sẽ bị lãng phí
- Hệ thống này phụ thuộc vào thời gian nên có thể bị ảnh hưởng bởi Network Time Protocol (NTP). Nếu 1 clock của 1 server lệch 2s về tương lai, tất cả servers còn lại bị coi như chậm 2s so với server đó. NTP sẽ điều chỉnh clock bị chệch về cân bằng. Nhưng trong tiến trình đó, IDs cho thời gian bị chệch có thể đã được gen ra, gây nên nguy cơ lặp IDs.

### Using logical clocks

#### Lamport clocks

Trong **Lamport clocks**, mỗi node đều có bộ đếm riêng.

Trước khi thực thi 1 event ở 1 node, bộ đếm tăng giá trị lên 1 đơn vị. Message được gửi từ event này sẽ mang theo giá trị đó đến node mục tiêu.

Khi node mục tiêu nhận message, node đó sẽ update logical clock bằng cách so giá trị lớn nhất của bộ đếm trong node với giá trị của message. Node cập nhật bộ đếm xong rồi mới thực thi message.

Lamport clocks giúp sắp xếp thứ tự các sự kiện, nhưng chỉ cung cấp thứ tự tương đối mà ko thể hiện được sự kiện nào đã thực sự xảy ra trước sự kiện nào trên toàn hệ thống. Ta có thể giải quyết hạn chế này qua **Vector clocks**.

#### Vector clocks

Vector clocks duy trì thứ tự nhân quả của các sự kiện. Để thực hiện được nhiệm vụ này ta cũng cần 1 cấu trúc dữ liệu phù hợp để capture lại lịch sử nhân quả của mỗi sự kiện.

- **Sign bit:** 1 bit đánh dấu với giá trị luôn bằng 0
- **Vector clock:** 53 bits biểu diễn số đếm của mỗi node
- **Worker number:** 10 bits biểu diễn worker IDs. Cung cấp cho ta 2^10 = 1024 IDs

Để có thể capture toàn bộ chuỗi nhân quả của sự kiện, 1 vector clock phải chứa ít nhất *n* nodes. Hệ quả là tổng số nodes tham gia vào gen IDs tăng lên số lượng khổng lồ, dẫn đến vector clocks phải tiêu tốn 1 lượng lưu trữ rất lớn.

Ở một số hệ thống hiện nay, như web apps, coi mỗi browser của client như 1 node. Nhưng thông tin của browser có thể tăng độ dài của ID lên rất nhiều, làm cho việc xử lý, lưu trữ và mở rộng gặp nhiều khó khăn.

### TrueTime API

**Google's TrueTime API** trong Google Spanner là 1 lựa chọn khá hay ho. Thay vì 1 time stamp cụ thể, nó sẽ report lại 1 interval of time.

Khi truy xuất thời điểm hiện tại, ta sẽ nhận đc 2 giá trị: *sớm nhất* và *muộn nhất*, tượng trưng cho thời điểm sớm nhất và thời điểm muộn nhất mà Spanner nhận thức được với request.

Dựa vào 2 giá trị này, đồng hồ trong hệ thống của ta có thể nhận biết thời gian thực tế sẽ nằm trong khoảng giữa 2 giá trị.

Google deploys 1 GPS receiver hoặc atomic clock ở mỗi data center, và các đồng hồ được đồng bộ trong khoảng 7ms, cho phép Spanner tối thiểu mức sai lệch thời gian giữa các đồng hồ.

Nếu A\[earliest] < A\[latest] < B\[earliest] < B\[latest], thì B chắc chắn xảy ra sau A.

Để sử dụng TrueTime intervals cho unique ID, giả sử interval sớm nhất là TE, muộn nhất là TL, và sai số là *ε*. Ta sử dụng TE với đơn vị milliseconds biểu diễn cho time stamp trong ID:

- **Time stamp:** 41 bits cho time stamp. Sử dụng TE.
- **Uncertainty:** 4 bits cho sai số. Sai số trong Spanner TrueTime API được ghi lại trong khoảng từ 6 - 10ms, nên ta dùng 4bits để lưu nó.
- **Worker number:** 10 bits cho worker => 1024 worker IDs.
- **Sequence number:** 8 bits cho đánh số thứ tự. Với mỗi ID được gen ra ta lại tăng lên 1 đơn vị. Tối đa 256 giá trị, và ta sẽ reset về 0 khi số thứ tự đạt đến 256.

#### Ưu điểm

- Đáp ứng toàn bộ các yêu cầu cho 1 ID generator service.
- Đáp ứng được việc gen unique 64-bit identifier.
- Nhân quả cho các sự kiện được bảo toàn.
- Scalable & highly available.

#### Nhược điểm

- Nếu 2 intervals trùng vào nhau, ta ko thể chắc chắn được thứ tự diễn ra của sự kiện A và sự kiện B.
- Spanner đắt 💰💰💰.

### Requirements filled by these options

|                         | Unique | Scalable | Available | 64-bit numeric ID |
| ----------------------- | ------ | -------- | --------- | ----------------- |
| Using UUID              | false  | true     | true      | false             |
| Using database servers  | false  | true     | true      | true              |
| Using a range handler   | true   | true     | true      | true              |
| Using UNIX time stamps  | false  | weak     | true      | true              |
| Using Twitter Snowflake | true   | true     | true      | true              |
| Using vector clocks     | true   | weak     | true      | can exceed        |
| Using TrueTime          | true   | true     | true      | true              |
