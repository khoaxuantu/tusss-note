---
title: Non-functional System Characteristics
unlisted: true
date: 2023-09-25
next_article:
  path: /system-design/back-of-the-envelop-calculations
  title: Back-of-the-envelop Calculations
prev_article:
  path: /system-design/abstractions
  title: Abstractions
---

# Non-functional System Characteristics

## Availability

Là phần trăm thời gian 1 service hoặc cơ sở hạ tầng có thể truy cập tới clients và đc vận hành dưới điều kiện bình thường. Chẳng hạn, khi 1 service có 100% availability, service nó có thể hoạt động trong toàn thời gian

### Measuring availability

```r
A (%) = [(Total time - Amount of time service was down) / Total time] * 100
```

### The Nines of Availability

[image]
  src: /img/system-design/nsc.webp
  alt: The Nines of Availability Table
  caption: "Source: educative.io"

## Reliability (R)

- Là xác suất 1 service sẽ thực hiện chức năng của nó trong 1 thời gian cụ thể ở các điều kiện vận hành khác nhau.

Ta thường sử dụng **mean time between failures (MTBF)** và **mean time to repair (MTTR)** như thông số để đo `R`

```md
MTBF = (Total elapsed time - Sum of Downtime) / Total Number of Failures

MTTR = Total Maintenance Time / Total Number of Repairs
```

### Reliability (R) and availability (A)

Reliability and availability là 2 thông số quan trọng trong đo lường sự tuân thủ của service với các _service level objectives (SLO)_ đã được thỏa thuận

Availability được đo đạc dựa theo sự khấu hao thời gian, trong khi đó tần suất và mức độ ảnh hưởng của sự cố được sử dụng để đo đạc reliability

Reliability (`R`) và availability (`A`) là 2 concepts riêng biệt, nhưng chúng có sự liên quan tới nhau. Về mặt toán học, `A` là 1 hàm của `R`, có nghĩa là giá trị của `R` có thể thay đổi 1 cách độc lập, còn giá trị của `A` đc thay đổi dựa vào `R`. Vì thế, ta có những trường hợp sau có thể xảy ra:

- low `A`, low `R`?
- low `A`, high `R`?
- high `A`, low `R`?
- high `A`, high `R`? -> Desirable

## Scalability

- Là khả năng của 1 hệ thống trong việc đối phó lượng tải cao mà ko bị tác động quá lớn tới hiệu năng. Ví dụ 1 search engine sẽ phải đáp ứng được số lượng người dùng tăng cao và 1 lượng lớn dữ liệu mà nó index tới

Lượng tải nói tới ở đây có thể có nhiều loại:

- **Request workload**: Số lượng request mà hệ thống phục vụ
- **Data/storage workload**: Lượng dữ liệu được lưu trữ trong hệ thống

### Dimensions

- **Size scalability**: 1 hệ thống được gọi là scalable về kích thước nếu ta có thể thêm người dùng và tài nguyên vào nó 1 cách đơn giản
- **Administrative scalability**: là sức chứa cho lượng người dùng hoặc tổ chức chia sẻ 1 hệ thống phân tán
- **Geographical scalability**: liên quan tới việc 1 chương trình có thể cung cấp dịch vụ ở các vị trí địa lý khác nhau mà vẫn đáp ứng được yêu cầu về hiệu năng tới bao nhiêu.

### Different approaches of scalability

- **Vertical scalability - scaling up**: Tăng tài nguyên cho 1 máy (CPU, RAM, etc...)
- **Horizontal scalability - scaling out**: Tăng thêm nhiều máy phục vụ cho 1 tác vụ

## Maintainability

Bên cạnh việc xây dựng hệ thống, 1 trong những tasks chính sau đó chính là việc bảo trì hệ thống: tìm và fix bug, thêm chức năng, giữ cho nền tảng của hệ thống luôn được cập nhật, đảm bảo việc vận hành được trôi chảy.

Ta có thể chia concept của maintainability thành 3 khía cạnh:

- **Operability**: Ta có thể đảm bảo hệ thống vận hành mượt mà dưới điều kiện bình thường và khôi phục lại bình thường khi gặp sự cố được bao nhiêu
- **Lucidity**: Cái này liên hệ tới độ đơn giản của code. Code base càng đơn giản dễ đọc, thời gian và công sức bảo trì cả nhẹ
- **Modifiability**: Khả năng của hệ thống để tích hợp các sửa đổi cập nhật

### Measuring maintainability

**Maintainability**, `M`, là xác suất để 1 service khôi phục lại chức năng của nó trong 1 thời điểm cụ thể xảy ra sự cố. `M` đo lường mức độ thuận tiện và nhanh chóng mà 1 service khôi phục lại bình thường

Ví dụ, cho trước 1 component có độ maintainability là 95% cho nửa giờ. Trong trường hợp này, xác suất để component đó khôi phục lại đầy đủ chức năng của nó trong nửa giờ là 0.95

Ta sử dụng (mean time to repair) MTTR cho đại lượng của `M`

```md
MTTR = (Total Maintenance Time) / (Total Number of Repairs)
```

### Maintainability and reliability

Maintainability có thể đc định nghĩa rõ hơn trong khi liên hệ gần gũi với reliability. Khác biệt duy nhất giữa chúng là gíá trị chúng đảm nhận. Maintainability liên hệ tới `time-to-repair`, trong khi đó reliability liên hệ tới cả `time-to-repair` và `time-to-failure`. Kết hợp 2 đại lượng này giúp ta có cái nhìn rõ ràng vào availability, downtime và uptime của 1 hệ thống

## Fault tolerance

Các ứng dụng quy mô lớn trong thực tế chạy hàng trăm servers và databases để đáp ứng hàng tỷ request và lưu trữ hàng petabytes dữ liệu. Những ứng dụn này cần 1 cơ chế giúp đảm bảo an toàn dữ liệu và giảm mọi tác vụ tính toán lặp lại bằng cách tránh các điểm sự cố

**Fault tolerance** liên hệ tới khả năng của hệ thống trong việc duy trì thực thi kể cả khỉ 1 hoặc vài components của nó chết. Ở đây, components có thể là phần mềm hoặc phần cứng. Để hình thành đc 1 hệ thống có 100% fault tolerance là 1 điều cực kỳ khó

Ta có thể kể đến vài khía cạnh khiến cho fault tolerance trở nên rất cần thiết:

- Avaiability tập trung vào việc hứng mọi request từ client nên cần phải sẵn sàng 24/7
- Reliability quan tâm tới việc phản hồi mọi request từ client

### Fault tolerance techniques

#### Replication

1 trong những kỹ thuật đc sử dụng phổ biến nhất là **replication-based fault tolerance**. Với kỹ thuật này, ta có thể sao lưu cả services lẫn data. Ta có thể dổi những nodes bị chết với những nodes đang hoạt động bình thường và đổi 1 data store bị chết với bản sao lưu của nó. 1 service lớn có thể thực hiện việc switch mà ko ảnh hưởng tới người dùng cuối

Ta tạo 1 vài copies của dữ liệu của ta vào storage riêng. Tất cả copies cần đc update thường xuyên cho bất kỳ update nào xảy ra với data chính. Cập nhật dữ liệu ở các replicas là 1 công việc thử thách. Khi 1 hệ thống cần consistency mạnh, ta có thể đồng bộ data vào replicas.

Tuy nhiên, nó sẽ làm giảm độ avaiability của hệ thống. Ta cũng có thể cập nhật data bất đồng bộ trong replicas khi ta theo eventual consistency, với kết quả là việc reads bị trì hoãn cho đến khi tất cả replicas đc bao gồm. Vì thế, đây là 1 sự trade-off giữa cả 2 cách tiếp cận consistency. Ta thống nhất hoặc là availability hoặc là consitency dưới điều kiện bị chết - 1 thực tế đã được gạch ra trong [CAP Theorem](https://www.ibm.com/topics/cap-theorem).

#### Checkpointing

Checkpointing là kỹ thuật lưu state của hệ thống trong 1 storage ổn định khi state được nhất quán. Checkpointing được thể hiện trong rất nhiều bước ở các cung thời gian khác nhau. Mục đích tiên quyết là nhằm lưu trữ được các tính toán trong 1 điểm cho trước. Khi hệ thống bị oẳng, ta có thể lấy data đã đc tính toán gần nhất từ checkpoint trc và bắt đầu từ đó.

Checkpointing cũng có cùng vấn đề với replication. Khi hệ thống thực hiện checkpointing, nó chắc chắn rằng hệ thống đang ở trong trạng thái nhất quán, nghĩa là tất cả processes đc dừng lại trừ những read processes. Kiểu checkpointing này còn đc biết đến là **synchronous checkpointing**. Mặt khác, checkpointing trong 1 trạng thái ko nhất quán dẫn tới các vấn đề về dữ liệu thiếu nhất quán.
