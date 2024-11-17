---
title: Facade
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
next_article:
  path: /oop/design-patterns/flyweight
  title: Flyweight
prev_article:
  path: /oop/design-patterns/decorator
  title: Decorator
date: 2023-07-12
---

# Facade

Đây là pattern cung cấp 1 interface được đơn giản hóa tới 1 thư viện, 1 framework, hoặc bất kỳ set phức tạp của classes.

## Problem

Tưởng tượng ta phải làm cho code của ta hoạt động đc với 1 set các objects thuộc về 1 thư viện hoặc 1 framework nào đó cực kỳ rắc rối. Ta sẽ cần phải khởi tạo toàn bộ số objects đó, theo dõi các dependencies, thực thi các methods theo thứ tự đúng, vân vân và mây mây.

Kết quả là, business logic trong class của ta trở nên vô cùng khó bảo trì và lĩnh hội cho ng mới.

## Solution

1 facade là 1 cái class cung cấp 1 interface đơn giản tới một hệ thống phụ phức tạp mà chứa đụng rất nhiều bước thực thi. 1 facade sẽ chỉ bao gồm những chức năng mà clients thực sự quan tâm đến.

Như vậy, khi ta cần tích hợp app của ta với một thư viện rối rắm với hàng tá các features và chỉ cần tận dụng 1 lượng nhỏ trong đống đó, thì facade sẽ là giải pháp.
Ví dụ, 1 cái app về mxh muốn upload 1 video ngắn zui zui có thể sử dụng 1 thư viện xử lý video. Tuy nhiên, tất cả những gì nó cần chỉ là gọi tới 1 method duy nhất `encode(filename, format)`. Sau khi tạo 1 class chỉ có chứa đúng 1 method đó và connect class này với thư viện xử lý video kia, ta sẽ đc 1 facade đầu tiên.

```ts
class VideoFacade {
  private static linkToLibrary: Object = import('VideoConversionLibrary')
    .then(module => { default: module });;

  static encode(filename: string, format: VideoFormat) {
    const video = this.linkToLibrary.open(filename);
    const newVideo = this.linkToLibrary.convert(video, format);
    return newVideo;
  }
}

// Client code
VideoFacade.encode('./path/to/video.mkv', '.mp4')
```

## Structure

[image]
  src: /img/oop/facade.webp
  alt: Facade structure diagram
  caption: Facade structure diagram

1. **Facade** cung cấp các bước truy cập thuận tiện tới 1 phần trọng yếu trong các chức năng của subsystem.
2. **Additional Facade** class có thể đc tạo ra để hạn chế nguy cơ cái **Facade** chính bị lộn xộn đi bởi quá nhiều chức năng được đưa vào.
3. **Complex Subsystem** bao gồm hàng đống các objects khác nhau.
4. **Client** sẽ sử dụng **Facade** thay vì gọi tới subsytem 1 cách trực tiếp.

---

Tham khảo thêm về `Facade` tại [https://refactoring.guru/design-patterns/facade](https://refactoring.guru/design-patterns/facade "Facade - Refactoring Guru")
