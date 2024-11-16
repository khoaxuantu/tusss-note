---
title: Encapsulation
tags:
  - OOP
date: 2023-04-06
unlisted: true
---

# 4 Pillars - Encapsulation

## Introduction

Chúng ta đã được giới thiệu qua về **Abstraction**, hiểu được rằng thông qua **Abstraction** ta có
thể lọc được trong 1 Object đặc điểm nào cần thể hiện ra bên ngoài đặc điểm nào ko cần.

Cái câu
chuyện nhận biết, lọc này coi như là xong rồi, ta coi như định hình được 1 `model` cho cái object
đó rồi, vậy thì làm sao để ta có thể áp dụng cái `model` đấy vào trong code của ta, để rồi cấu tạo
nên sản phẩm?

> Câu trả lời là **Encapsulation**.

**Encapsulation** là khả năng che đi (hide) (về code) của một bộ phận trong toàn bộ khía cạnh của 1
object. **To encapsulate something** nghĩa là đưa một cái gì đó về trạng thái riêng tư bí mật (make
it *private*).

Ở **Abstraction**, ta đây là lọc các đặc điểm cần che cần hiển thị khi thiết kế nên các object,
thì ở **encapsulation** sẽ là nói về khả năng (cách) để ta đưa những cái thiết kế đó vào trong code.

Thế nên, trong concept này, ta sẽ được giới thiệu một số thuật ngữ sau:

- public
- private
- protected
- Interface
- Abstract class
- Getters, setters

## Về public, private và protected

3 cái này nhìn chung thì cũng dễ hiểu, hầu hết các nnlt oop cũng đều cung cấp 3 keyword này. Mỗi
keyword sẽ được sử dụng bằng cách gắn trước các method hoặc variables, ví dụ

```java
public void doSomething();
private int var;
protected void bruh();
```

- `public`: là keyword giúp cho compiler biết rằng method/var là public. Qua keyword này, các method/var sẽ truy cập được ở bên ngoài `Class`
- `private`: ngược lại với `public`. Các method/var của `Class` vs keyword này sẽ chỉ có thể được truy cập ở bên trong cái `Class` đó.
- `protected`: Gần giống với `private`, nhưng các method/var vs keyword này có thể được truy cập ở các `Subclass` của `Class`.

## Về interface và abstract class

[image]
  src: /img/oop/encapsulation.webp
  alt: Encapsulation airport example diagram
  caption: "Encapsulation airport example diagram"

Để khởi động 1 con ô tô, ta cần cắm cái chìa hoặc bầm nút khởi động xe, đấy là hành động từ phía ta,
hay nói cách khác là tác động từ bên ngoài lên object ô tô. Thông qua nó, dòng điện, động cơ
blabla... trong con xe bắt đầu khởi động.

Dưới góc nhìn oop, object ô tô đã "hiển thị" ra cái công
tắc để ta tác động vô cái object đó, còn các chi tiết bên trong xe đã được "ẩn" đi. Cái công tắc đó,
khi mà được "public" khỏi ô tô và ta có thể tác động lên ô tô qua nó, thì sẽ gọi là gì?

**Interface** là bộ phận bao gồm các _**PHƯƠNG THỨC (METHODS)**_ `public` của 1 object, nhằm mục
đích tương tác với các objects khác.

Ví dụ ở ảnh trên ta có 1 `FlyingTransport` interface với method `fly(origin, destination, passengers)`.
Khi thiết kế 1 ứng dụng mô phỏng kiểm soát không lưu, ta có thể giới hạn `Airport` class chỉ có thể
tương tác với các objects mà `implement` cái `FlyingTransport` interface.

Đấy là định nghĩa chung của **Interface**, nhưng trên thực tế về mặt ngôn ngữ thì cái từ _interface_
đại diện cho tất cả các phần `public` của 1 object. Sự nhập nhằng này là 1 trong những nguyên nhân
khiến cho ko biết bao ng mất gốc thg **encapsulation** 😑

> The fact that the word interface stands for a public part of an object, while there's also the
> `interface` type in most programming languages, is very confusing. I'm with you on that
>
> ~ Alexander Shvets - Refactoring Guru ~

Yup, **Interface** trong programming là như trên, còn đại diện cho **TỪ** interface thực sự thì là
`Abstract Class`. 1 ví dụ sẽ là như sau đây, nó là đủ để ae hình dung đc rồi

```cpp
// C++
class AbstractClass
{
public:
  virtual void doSomethingPublic() = 0;
private:
  // Đống này đã đc ẩn đi
  int var1 = 0;
  int var2 = 1;
  int var3 = 2;
};
```

## Getters, setters

1 khía cạnh ngoài lề ae có thể cũng được nghe đến nhiều, đó là `get` và `set`

Đây là cách để ta sử dụng và chỉnh sửa các thuộc tính `private` hoặc `protected` của 1 object ở
bên ngoài `Class` định nghĩa nên object đó thôi.

Mỗi ngôn ngữ lập trình OOP sẽ lại có syntax sử dụng `get/set` khác nhau.
