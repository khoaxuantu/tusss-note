---
title: Inheritance
tags:
  - OOP
id:
date: 2023-04-07
unlisted: true
prev_article:
  path: /oop/4-pillars/encapsulation
  title: 4 Pillars | Encapsulation
next_article:
  path: /oop/4-pillars/polymorphism
  title: 4 Pillars | Polymorphism
---

# 4 Pillars - Inheritance

## Introduction

Qua 2 concept [Abstraction](/oop/4-pillars/abstraction) và [Encapsulation](/oop/4-pillars/encapsulation)
thì ta hẳn cũng nắm được lý do tồn tại của
_**Interface (Abstract Class)**_ rồi.

Trong các ví dụ ở các posts trước cũng như trong thực tế, ta
thấy được rằng sẽ luôn có nhiều `Class` áp dụng chung 1 _**Interface (Abstract Class)**_.

Giờ 1 câu
hỏi mới xuất hiện: làm thế nào để các `Class` áp dụng được chung 1 _**Interface (Abstract Class)**_
như thế, hay 1 _**Interface (Abstract Class)**_ có thể được sử dụng bởi nhiều `Class` như thế?

> Câu trả lời là **Inheritance**.

**Inheritance** là khả năng xây dựng 1 `Class` mới từ 1 `Class` đã tồn tại từ trước. Thằng này thì dễ
hiểu rồi ko như 2 thằng trước. Mục đích chính của **Inheritance** là để tái sử dụng code, giúp code
ngắn gọn dễ hiểu hơn. Thông thường trong OOP, ta hay có 1 **Base Class**, và ta tạo ra các `Class`
khác nhau "thừa hưởng" đặc điểm của **Base Class**. Ở đây, **Base Class** còn được gọi là **Parent Class**,
còn các `Class` phụ kia còn được gọi là **Child Class**.

Hầu hết các nnlt đều quy định **Inheritance** thông qua các keyword, phổ biến nhất là `extends` hoặc
`implements`:

- `extends`: Nghĩa là ta tạo 1 subclass từ cái base class, thường được sử dụng với **Abstract Class**
- `implements`: Nghĩa là ta "sử dụng" các method từ base class, thường được sử dụng với **Interface**

## Lưu ý

Trong các sơ đồ diễn tả **Inheritance** ở các tài liệu, ta sẽ thấy dạng

```
childClass -> baseClass
```

Diễn tả theo ngôn ngữ nói tiếng Anh, chính là "childClass inherits baseClass", dịch ra là
`childClass` thừa hưởng `baseClass`. Nhiều người mới học dễ bị nhầm lẫn ý nghĩa của từ _inheritance_
nên sẽ dễ hình dung ra trong đầu như sau

```
baseClass -> childClass
```

Việc hình dung theo hướng này nó ko đúng với ý nghĩa của từ _inheritance_ , vì vậy cũng nên chú ý ko
sau lại loạn khi nói về **Inheritance**.
