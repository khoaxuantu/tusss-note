---
title: Objects & Classes
tags:
  - OOP
unlisted: true
date: 2023-04-05
prev_article:
  path: /oop/objects-and-classes
  title: Objects & Classes
next_article:
  path: /oop/4-pillars/encapsulation
  title: 4 Pillars | Encapsulation
---

# 4 Pillars - Abstractions

**Abstraction** là một concept định nghĩa cho việc lọc ra các đặc điểm của object mà sẽ có ích
trong việc sử dụng bên ngoài object đó_

Cái concept này nó không liên quan nhiều lắm tới việc code như thế nào, mà thực chất ở đây nó định
nghĩa cho ta về việc design các objects trước khi bước vào code. Suy cho cùng thì khi bắt đầu build
sản phẩm theo OOP, ta luôn phải bắt đầu công việc đầu tiên là design các objects cần thiết.

Từ tên thuật ngữ với các cách giải thích trên mạng nghe thì màu mè hoa lá cành vậy thôi, chứ thực
chất ta đã sử dụng cái **abstraction** này ngay cả khi chưa nghe qua về về các thuật ngữ trên rồi.

Khi ta design objects, ta hầu như có xu hướng luôn dựa trên tất cả các sự vật, sự việc, hiện tượng
ngoài đời, nhưng 1 sự vật/hiện tượng có không biết bao nhiêu khía cạnh, hiển thị hết mọi thứ là
không cần thiết, nên thay vì thế ta chỉ nghĩ xem ở cái sự vật/hiện tượng đó, có đặc điểm gì mà ta
có thể sử dụng ko?

Như vậy, bằng cách mổ xẻ cái luồng suy nghĩ của ta ra, thì cái hướng khi design objects sẽ là như này:

> Đối chiếu từ object ngoài đời đưa vào 1 base object (gọi là object's pool) -> pick các đặc điểm có ích để hiển thị

Đây chính là _**Abstraction**_. Ta "vắn tắt" các đặc điểm cần thiết của object rồi hiển thị cho
user, và hide các thông tin không cần thiết đi.

Lấy 1 ví dụ cho dễ hiểu:

- Từ ngoài đời, ở trong 1 project viết app phần mềm cho 1 hãng hàng không, ta pick ra 1 cái object
`Airplane`, và nhận ra là nó có thể được sử dụng cho 2 service riêng biệt: Flight Simulator và
Booking Application
- **Flight Simulator**: Ta cần hiển thị các thông số của máy bay khi bay (tốc độ, độ cao, góc bay, etc...)
- **Booking Application**: Ta lại cần hiển thị các thông số liên quan đến chở hành khách như số chỗ ngồi hơn
- Dễ thấy ở 2 service trên, ta ko cần số chỗ ngồi cho **Flight Simulator**, cũng ko cần các thông
số khi bay cho **Booking Application**, như vậy ta đã áp dụng **Abstraction** thông qua việc lọc
các đặc điểm của máy bay rồi.

[image]
  src: /img/oop/abstraction.webp
  alt: Abstraction example
  caption: "Abstraction example illustration (Source: refactoring.guru)"

Cái thằng **Abstraction** này có thể thấy lý do lớn nhất mà nó xuất hiện là giúp cho các đặc điểm của
1 object trở nên cô đọng dễ hiểu hơn, user và dev có thể dễ dàng tìm thấy và truy cập các đặc điểm
thích hợp của object tùy theo từng chức năng.

Nói chung là code sẽ đỡ bị a đuồi và hạn chế khả năng gây OCD cho nhà phát triển 🐧

Sở dĩ ta nói về **Abstraction** đầu tiên vì đây cũng coi như là concept khởi đầu cho việc ứng dụng
OOP. Từ thằng này, ta mới có thể mở rộng ra các bước sau được. Ở khía cạnh code, concept này chính
là tiền đề để khái niệm **Abstract Class** và **Interface** ra đời.

Ta sẽ nói về 2 khái niệm này nhiều hơn ở concept tiếp theo [Encapsulation](/oop/4-pillars/encapsulation).

