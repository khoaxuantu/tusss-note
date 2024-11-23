---
id:
date: 2023-04-07
title: Polymorphism
tags:
  - OOP
unlisted: true
next_article:
  path: /oop/objects-relationship
  title: Objects Relationship
prev_article:
  path: /oop/4-pillars/inheritance
  title: 4 Pillars | Inheritance
---

# 4 Pillars - Polymorphism

## Introduction

Như đã nói ở ⁠Basic. Objects, Classes, `objects` thì muôn hình vạn trạng, `classes` nhóm lại các `objects` có khuôn mẫu chung, nhưng "khuôn mẫu chung" không có nghĩa là giống nhau.

Với việc nhiều class con thừa hưởng 1 base class từ `Inheritance`, các đặc tính trong base class cũng sẽ có ở trong các class con, nhưng những đặc tính đó sẽ không thể nào giống nhau về chi tiết được (giống nhau thì tạo ra các class con khác nhau làm chi 😐), `size` giữa chó và mèo ko thể nào giống nhau, `số chân` giữa gà và lợn ko thể nào giống nhau, các `method` tuy giống nhau về tên nhưng sẽ khác nhau về code bên trong.

Từ cái sự nhập nhằng này, làm sao để máy tính có thể nhận biết được đúng `method` và trả về kết quả đúng? Đây là lý do ta có **Polymorphism**.

**Polymorphysim** là khả năng xác định loại `Class` chính xác của 1 `object` của máy tính. Từ việc nhận ra đúng loại `Class`, máy tính mới có thể gọi tới đúng cái **implementation method** được

Ở concept này, ta sẽ được giới thiệu 1 keyword mới là `override`. Đây là keyword có sẵn trong hầu hết các nnlt oop, nhằm mục đích để cả người code lẫn compiler hiểu rằng đang override 1 method ở base class, giúp đảm bảo code chạy đúng và dễ debug hơn. Từ phía compiler, với keyword này nó sẽ giúp ta check xem ta có đang thực sự viết lại method của base class ko.

Nhiều trường hợp ta đang viết lại 1 method của base class, nếu ta ko có `override` mà viết sai tên của method đó chẳng hạn, thì thành ra class con của ta đã tạo ra method mới và cứ thế mà chạy, ta sẽ ko biết là mình vừa viết sai tên method; còn nếu ta có `override` mà viết sai tên, thì compiler sẽ báo lại ta là lỗi, như vậy ta có thể đảm bảo là mình đang thực sự viết lại method đó rồi.

## Example

[image]
  src: /img/oop/polymorphism.webp
  alt: Polymorphism example diagram
  caption: Polymorphism example diagram

Hầu hết `Animals` có thể tạo ra tiếng, thế nên ta có declare 1 cái abstract method `makeSound()` ở base class `Animals`. Khi ta tạo class con `Cat` và `Dog` thừa hưởng `Animal`, cái method `makeSound()` của 2 con này ko thể nào giống nhau được, nên ta sẽ phải `override` lại nó.

```python
# python
class Animals():
  def makeSound():
    pass

class Cat(Animals):
  @override
  def makeSound():
    print("Meo Meo")

class Dog(Animals):
  @override
  def makeSound():
    print("Gau Gau")

class Bomman(Animals):
  @override
  def makeSound():
    print("Ui gioi oi! De vai l...")
```

Ta tạo 1 list `room` chứa các object `Cat` và `Dog`, rồi duyệt từng object để xem `makeSound()` trả về kết qua như thế nào

```python
room = [Cat(), Dog()]

for obj in room:
  obj.makeSound()
```

Thì terminal sẽ in ra như sau

```
Meo Meo
Gau Gau
```

Dễ thấy là nhờ có **Polymorphism**, máy đã truy ra đúng implementation của method `makeSound()` và trả về kết quả ta mong muốn.

## Caution

Khi học về concept này, ta hay nghĩ theo kiểu "shorthand" như "Polymorphism - viết lại các method thừa hưởng từ class cha". Cách nghĩ này dễ gây nhầm lẫn, nó sẽ dễ khiến ta nghĩ **Polymorphism** là việc ta có thể viết lại các method thừa hưởng. Nhưng về bản chất thì **Polymorphism** là cơ chế phục vụ cho việc viết lại các method được thừa hưởng từ class cha.

Trong các tài liệu, họ đều định nghĩa concept này như 1 cơ chế của `program`, nên việc bị "conflict" giữa hướng giải thích của tài liệu với cái trong đầu mình đang tưởng có thể là nguyên nhân khiến nhiều người thấy khó hiểu phần này

> The program doesn't know the concrete type of the object contained inside the `a` variable; but,
> thanks to the special mechanism called *polymorphism*, the program can trace down the subclass,
> of the object whose method is being executed and run the appropriate behavior.
>
> *Polymorphism* is the ability of a program to detect the real class of an object and call its
> implementation even when its real type is unknown in the current context.
>
> You can also think of polymorphism as the ability of an object to "pretend" to be something else,
> usually a class it extends or an interface it implements. In our example, the dogs and cats in
> the bag were pretending to be generic animals.
>
> ~ Alexander Shvets - Refactoring Guru ~
