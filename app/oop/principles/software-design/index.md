---
title: Software Design Principles
tags:
  - OOP
id:
unlisted: true
date: 2024-11-10
prev_article:
  path: /oop/objects-relationship
  title: Objects Relationship
next_article:
  path: /oop/principles/code-design
  title: Code Design Principles
---

# Software design principles

Trước khi ta bắt đầu bước vào tìm hiểu từng pattern một, có lẽ ta nên điểm lại các điểm cần lưu ý trong thiết kế cấu trúc phần mềm: thứ ta cần đạt được và thứ ta cần tránh.

## Code reuse

Chi phí và thời gian là 2 đại lượng có giá trị nhất để đo lường quá trình phát triển phần mềm.

Phần mềm càng được release sớm đồng nghĩa với việc ta càng gia nhập thị trường sớm hơn so với các đối thủ cạnh tranh.

Phần mềm càng tốn ít chi phí đồng nghĩa với việc ta càng có thể dành nhiều tiền hơn cho marketing và các kênh kết nối tới khách hàng tiềm năng.

**Code reuse** (tái sử dụng code) là 1 trong những cách phổ biến nhất để giảm chi phí phát triển phần mềm.

Ý tưởng thì tốt, nhưng để có thể áp dụng hiệu quả trong thực tiễn đòi hỏi cả 1 hành trình gian nan.

## Extensibility

**Change** (thay đổi) là 1 thứ bất biến suốt cuộc đời lập trình viên.

- Bạn vừa release 1 game trên Windows, giờ mọi người lại đòi 1 phiên bản cho macOS
- Bạn tạo 1 UI framework với default là nút vuông, nhưng vài tháng sau nút tròn lại thành trend

...

Bất cứ nhà phát triển phần mềm nào cũng sẽ gặp phải những câu chuyện tương tự như trên. Ta có thể hiểu vì sao nó lại diễn ra qua vài lý do sau:

- Bạn của phiên bản app thứ 2 khác với bạn khi release phiên bản app thứ nhất. Sau 1 thời gian dài bảo trì app, bạn đã thu nạp cho bản thân hiểu biết sâu rộng về logic, nghiệp vụ liên quan tới app đó, bạn nhìn lại đoạn code phiên bản 1 bạn viết khi xưa, bỗng thấy nhiều chỗ có thể tối ưu. Và bạn quyết định viết lại, cho ra đời phiên bản 2.
- Sự thay đổi từ nhân tố mà bạn không kiểm soát được. Chẳng hạn, mấy cụ hồi xưa hay sử dung Flash để phát triển online app đều phải tất bật thay đổi code khi các trình duyệt thông báo dừng hỗ trợ Flash.
- Sự thay đổi trong kế hoạch của client. Sẽ có nhiều trường hợp sau khi đã hài lòng với phiên bản đầu tiên của bạn, client lại thấy các hướng đi mới từ phiên bản đó, và họ muốn thay đổi các tính năng.
