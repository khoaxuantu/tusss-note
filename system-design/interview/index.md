---
title: Interview
date: 2023-04-24
unlisted: true
next_article:
  path: /system-design/abstractions
  title: Abstractions
prev_article:
  path: /system-design
  title: Lời Mở Đầu
---

# System Design Interview

## SDIs khác với các interview khác như thế nào?

- Cũng giống như các vòng interview khác, ta cũng cần tiếp cận SDI một cách bài bản. SDIs khác với coding interviews, ở đây rất hiếm khi yêu cầu code (vì sẽ nói tới hệ thống là chính thoy)
- Ở 1 cái SDI, ta cần làm sáng tỏ các yêu cầu và map chúng vào các computational components cùng với các high-level communication protocols đảm nhiệm vai trò kết nối các subsytems với nhau.
- 1 cái SDI sẽ ko quan trọng kết quả ứng viên ra là gì, mà nó sẽ quan trọng tới quá trình và cách tiếp cận suy nghĩ mà ứng viên đó thể hiện hơn.

## Tips giải quyết các câu hỏi về system design

Các câu hỏi system design thường khá mở, và người đc hỏi sẽ thấy có phần nhập nhằng để nghĩ xem bắt đầu từ đâu. Cái sự nhập nhằng này nó tương tự với các business thực tế hiện nay.

Người phỏng vấn thường hỏi về 1 problem phổ biến - ví dụ như design WhatsApp. Trên thực tế, WhatsApp có lượng features khổng lồ, và gói gọn chúng để tái hiện lại 1 cái WhatsApp clone sẽ là 1 điều bất khả thi cho 1 buổi phỏng vấn. Thay vào đó, ta tập trung vào các chức năng cốt lõi của hệ thống là đủ để thể hiện mình trong system design rồi.

Dưới đây là 1 số tip ta nên theo ở trong buổi SDI:

- Xác định chắc chắn requirements
- Xác định rõ phạm vi câu hỏi để có thể đưa ra phương án hợp lý trong giới hạn thời gian của buổi interview (35 ~ 40 phút)
- Giao tiếp với người phỏng vấn là điều vô cùng quan trọng. Như thế mới có thể chắc chắn được rằng họ hiểu luồng suy nghĩ của ta.

## Trình bày high-level design

Ở mức high-level, các components có thể là frontend, load balancer, caches, data processing, etc... Việc design system là cho biết làm sao để hợp các components đó lại với nhau.

Một sơ đồ thiết kế cấu trúc sẽ thường diễn tả các components như các khối, và các mũi tên sẽ diễn tả bộ phận nào kết nối với bộ phận nào

## Chuẩn bị như nào cho kỹ?

- Rất nhiều resource trên mạng
- Tham khảo các techinal blogs. Thông qua các blogs này,  ta có thể có được 1 góc nhìn về các vấn đề mà các cty lớn phải giải quyết và cách giải quyết nó như nào. Dưới đây là một số technical blogs quan trọng đáng đọc:
  - [Engineering at Meta](https://engineering.fb.com/)
  - [Meta Research](https://research.fb.com/)
  - [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/)
  - [Amazon Science Blog](https://www.amazon.science/blog)
  - [Netflix TechBlog](https://netflixtechblog.com/)
  - [Google Research](https://research.google/)
  - [Engineering at Quora](https://quoraengineering.quora.com/)
  - [Uber Engineering Blog](https://eng.uber.com/)
  - [Databricks Blog](https://databricks.com/blog/category/engineering)
  - [Pinterest Engineering](https://medium.com/@Pinterest_Engineering)
  - [BlackRock Engineering](https://medium.com/blackrock-engineering)
  - [Lyft Engineering](https://eng.lyft.com/)
  - [Salesforce Engineering](https://engineering.salesforce.com/)
- Tự hỏi rằng tại sao hệ thống lại hoạt động:
  - Tìm hiểu cách các ứng dụng nổi tiếng hoạt động, ví dụ như Facebook, Insta, Twitter, etc...
  - Tìm hiểu và hỏi vì sao một số components lại được dùng thay vì các components khác, ví dụ NoSQL vs SQL
  - Nếu đc có thể build các side project, bắt đầu từ 1 product backend đơn giản rồi dần dần cải tiến nó
  - (Nếu đc) Build a system from scratch - làm quen với các process và chi tiết cấu tạo của nó
- Quyết định đúng hướng. System design xử lý các components đã được hoàn thành trước về chi tiết, nên ta nên tránh để bị sa lầy vào việc chọn các components ko hợp lý xong rồi sau này phải build lại
- Mock interview
