---
title: Objects & Classes
tags:
  - OOP
unlisted: true
date: 2023-04-04
---

# Objects, Classes

## Object-oriented Programming

1 kiểu lập trình xoay quanh **Objects** và **Classes**, xuyên suốt những khía cạnh về OOP, chúng ta
chỉ cần tập trung vào 2 thuật ngữ này là coi như hiểu được đại khái rồi. Vậy cụ thể chúng là gì?

### Objects

Đúng như tên gọi của nó thôi, 1 object, nhiều objects ... Để dễ hiểu thì ta chỉ cần tưởng tượng mọi
thứ xung quanh ta đều là objects:

1 cái cốc -> object

1 cái bàn -> object

1 con mèo -> object

...


1 cái nút bấm trên web -> object

1 ML model -> object

1 data model -> object etc...

**Objects** có muôn vàn muôn vẻ, vậy thứ gì sẽ định hình objects? Câu trả lời chính là **Classes**

### Classes

Tuy rằng objects muôn hình vạn trạng, giữa các objects vẫn có nhiều khuôn mẫu chung nhất định,
chẳng hạn như mèo ta - mèo tây, nút đăng nhập - nút đăng xuất. Ngoài ra còn có các trường hợp nhiều
objects y hệt nhau, như các buttons group thường thấy trong các trang web hay app. Trong 1 sản
phẩm, ta cũng có thể xác định được rất nhiều object như thế, vậy nên, **Classes** ra đời nhằm nhóm
các objects lại với nhau, giúp cho cấu trúc sản phẩm trở nên mạch lạc, đỡ bị loạn hơn.

Có thể nói **Classes** trong góc nhìn lập trình đóng vai trò như "blueprints", "bản vẽ" cho objects,
ta có thể định nghĩa các thuộc tính, tính chất, phương thức cho objects thông qua classes.

Nói khái quát thế là đc rồi ,bây giờ, ta sẽ đi vào chi tiết về **Class**. Thông thường, ta sẽ chia
**Class** làm 3 phần chính, và mọi ngôn ngữ lập trình hướng đối tượng đều viết theo 3 phần này:

- **Name**
- **Fields (state)**
- **Methods (behavior)**

Về **Name**:

- Tên cho cái class thoy :v
- Quy chuẩn đặt tên thường thấy thì là 1 cụm danh từ liền nhau, viết hoa các chữ cái đầu, (vd: HomeButton, NavigateButton, v.v...)

Về **Fields (state)**:

- Là các tính chất, thuộc tính cho object.

> Ví dụ 1 quả bóng ta có thể xác đinh `fields` như: + Thể tích + Khối lượng + Hình dáng + Màu

- Quy chuẩn dễ thấy là dùng các danh từ/cụm danh từ

Về **Methods (behavior)**:

- Là các phương thức giúp cho object tương tác với mọi thứ xung quanh nó

> Ví dụ thường thấy ở các giáo trình hoặc sách là mèo, chó thì có các method như:
> - `gaugau()`
> - `meomeo()`

- Ví dụ thực tế trong lập trình hơn thì như 1 object `App`:
	- Nếu muốn khởi động `App`, ta có thể tạo 1 method `start()`
	- Nếu muốn đóng `App`, ta có thể tạo 1 method `close()`
	- Nếu muốn reset `App`, ta có thể tạo 1 method `open()` etc...

Tổng kết lại, **class** sẽ có dạng giống như sau hình sau:

[image]
  src: /img/oop/objects-and-classes.webp
  alt: Class illustration
  caption: Class illustration
