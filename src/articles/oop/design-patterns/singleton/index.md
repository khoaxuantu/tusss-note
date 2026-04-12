---
title: Singleton
tags:
  - OOP
  - DesignPattern
id:
date: 2023-06-06
unlisted: true
next_article:
  path: /oop/design-patterns/adapter
  title: Adapter
prev_article:
  path: /oop/design-patterns/prototype
  title: Prototype
---

# Singleton

Đây là kiểu pattern cho ta đảm bảo rằng chỉ có đúng 1 instance xuyên suốt hoạt động của hệ thống và cung cấp điểm truy cập global tới instance đó.

## Problem

`Singleton` giúp ta giải quyết 2 vấn đề sau:

1. **Đảm bảo 1 class chỉ có 1 instance đc chạy.** Vì sao ta lại cần kiểm soát số lượng instance như thế? Lý do thông thường nhất giải thích cho câu hỏi này là để kiểm soát vấn đề truy cập tới 1 nguồn chung - như là 1 database hoặc 1 file.

  Đây là cơ chế hoạt động: tưởng tượng ta tạo 1 object, nhưng sau đó lại quyết định tạo 1 cái mới. Nhưng thay vì nhận 1 fresh object như thường, ta lại nhận đc cái object duy nhất mà ta đã tạo trc đó.

  Note rằng cái trạng thái này ko thể đc implement với constructor thông thường bởi 1 constructor call sẽ luôn luôn trả lại 1 new object

2. **Cung cấp 1 điểm truy cập global tới instance đó**. Liên hệ tới đống global variables mà ta sử dụng trong các project, đôi khi ta cần lưu 1 số object phức tạp. Dù cho nó tiện, nó vẫn ko thật sự an toàn khi mà một đoạn code nào đó có thể overwrite lại các variables đó và gây crash ứng dụng.

  Giống như đống global variables, Singleton cho ta truy cập tới 1 số object ở mọi nơi trong chương trình. Ko chỉ thế, nó còn bảo vệ instance đó khỏi bị overwrite bởi đoạn code khác.

  1 khía cạnh khác với cái problem này: ta ko muốn đoạn code có thể giải quyết problem `1` lại bị phân tán ra nhiều chỗ trong chương trình mình. Việc gói gọn trong 1 class vẫn sẽ ngon hơn nhiều, đặc biệt là khi phần code còn lại phụ thuộc vào nó.

## Solution

Thông thường, Singleton sẽ đc implement trong 2 bước:

- Đưa cái default constructor về private, nhằm ngăn các objects khác dùng `new` operator với cái Singleton class.
- Tạo 1 static creation method hoạt động như 1 constructor. Chi tiết hơn, cái method này sẽ gọi tới cái private constructor để tạo object mới nếu chưa tạo rồi lưu object đó vào 1 cái static field. Tất cả các call sau đó sẽ trả về cái object đã đc lưu (cached object) thay vì gọi tới cái private constructor 1 lần nữa.

Nếu đoạn code của ta có truy cập tới cái Singleton class, nó sẽ có thể gọi Singleton's static method. Vậy nên bất cứ khi nào method đó đc gọi, 1 object duy nhất sẽ luôn đc trả về

```ts
class Singleton {
  // Private constructor
  private constructor() {}

  // A static field to cache the instance
  private static instance: Singleton;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Singleton();
    }
    return this.instance;
  }

  public doSomething() {
    console.log("Hello world");
  }
}
```

```ts
const obj = Singleton.getInstance();
obj.doSomething();
```

## Structure

[image]
  src: /img/oop/singleton.webp
  alt: Singleton structure diagram
  caption: Singleton structure diagram

Cái **Singleton** class khởi tạo static method `getInstance` để return 1 instance duy nhất của chính class của nó. Cái constructor của **Singleton** cần đc bị che đi khỏi client code. Gọi tới `getInstance` nên là cách duy nhất để lấy cái Singleton object.

---

Tham khảo thêm về **Singleton** tại [https://refactoring.guru/design-patterns/singleton](https://refactoring.guru/design-patterns/singleton "Singleton - Refactoring Guru")
