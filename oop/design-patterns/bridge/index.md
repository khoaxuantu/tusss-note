---
title: Bridge
tags:
  - OOP
  - DesignPattern
id:
date: 2023-06-21
unlisted: true
next_article:
  path: /oop/design-patterns/composite
  title: Composite
prev_article:
  path: /oop/design-patterns/adapter
  title: Adapter
---

# Bridge

Pattern này cho phép ta tách 1 class lớn hoặc 1 set các classes liên quan tới nhau thành 2 bậc có thể đc phát triển độc lập với nhau - abstraction và implementation.

## Problem

Giả sử ta có 1 class hình học `Shape` với 1 đôi class con: `Circle` và `Square`. Ta muốn mở rộng tập hợp các class này bằng cách kết hợp với các màu riêng biệt, vậy nên ta lập kế hoạch để tạo `Red` và `Blue` shape subclasses. Tuy nhiên, ta đã có sẵn 2 class con rồi, để kết hợp mỗi class con với 1 màu nữa, thì ta sẽ cần phải tạo tổng cộng 4 classes, như là `BlueCircle` hay `RedSquare`.

Nếu cộng thêm 1 shape mới hoặc màu mới, số class ta cần viết sẽ tăng dần theo cấp số nhân, như vậy nó quá là phức tạp (tốn sức). Ta càng add thêm nhiều kiểu, thì càng spam nhiều classes, cấu trúc code nó sẽ càng tệ đi.

## Solution

Vấn đề trên nảy sinh vì ta đang cố gắng mở rộng cái shape classes dựa theo 2 chiều: chiều `form` và chiều `color`, đây thực ra là 1 vấn đề khá phổ biến với cơ chế kế thừa của class.

Bridge sẽ giải quyết vấn đề này bằng cách chuyển từ cơ chế inheritance sang áp dụng 1 mối quan hệ giữa các objects, cụ thể là composition. Điều này có nghĩa là ta đưa 1 trong các chiều cần đc mở rộng thành 1 class hierachy riêng biệt, nhờ đó các original classes sẽ có thể liên kết tới cái object của cái hierachy mới ấy, thay vì đưa hết các đặc điểm trạng thái cả nó vào trong class.

Dựa vào cách tiếp cận trên, ta gom các đoạn code liên quan tới `color` lại tạo thành 1 class riêng với 2 class con: `Red` và `Blue`. Cái `Shap` class sẽ liên kết với các 1 trong các color object, tạo nên 1 property riêng. Giờ thì cái shape class có thể chuyển toàn bộ công việc xử lý màu sang cho color class xử lý 1 cách an toàn. Tóm lại, mối liên kết này hoạt động như 1 cây cầu (bridge) kết nối giữa shape và color classes.

```ts
interface Color {
  name: string,
  hexCode: string,

  fill(): void
}

class Red implements Color {
  constructor() {
    this.name = "red";
    this.hexCode = "#FF0000";
  }

  fill() {
    /* do something */
  }
}

class Blue implements Color {
  constructor() {
    this.name = "blue";
    this.hexCode = "#0000FF";
  }

  fill() {
    /* do something */
  }
}

abstract class Shape {
  private color: Color;
  private shape: "circle" | "square";
  draw(): void
}

class Circle extends Shape {
  constructor(c: Color) {
    this.color = c;
    this.shape = "circle";
  }
  override draw() {
    drawCircle();
    color.fill();
  }
}

class Square extends Shape {
  constructor(c: Color) {
    this.color = c;
    this.shape = "square";
  }
  override draw() {
    drawSquare();
    color.fill();
  }
}
```

### Abstraction and implementation

Cụm từ này đc giới thiệu trong quyển GoF như là 1 phần trong định nghĩa của Bridge. Trong quyển này thì nó đc giải thích khá là khó hiểu, chính vì vậy ta được giới thiệu qua ví dụ shape và color ở trên để có 1 tý cảm giác về cụm từ này trc, nhờ vậy sẽ dễ hiểu hơn tại đây khi ta đào sâu vào giải thích nó.

> Chú ý rằng ta đang ko nói tới `interfaces` hay `abstract classes` ở các nnlt nhé, 2 cái ko giống nhau, ko cẩn thận lại nhầm lẫn.

_Abstraction_ (còn đc gọi là _interface_) là 1 layer điểu khiển ở high level cho 1 số đối tượng. Cái layer này ko cần phải làm toàn bộ các công việc như xử lý logic một mình, mà nó nên chuyển các công việc đó qua layer _implementation_ (còn đc gọi là _platform_)

Khi nói về ứng dụng thực tế, cái abstraction có thể coi là biểu thị cho giao diện người dùng (GUI), và cái implementation có thể là các code điều hành đằng sau (API), cái mà GUI layer gọi tới nhằm phản hồi lại tương tác người dùng.

Ở góc nhìn chung, ta có thể mở rộng cái app theo 2 chiều:

- Có vài GUIs khác nhau (ví dụ 1 cái cho user 1 cái cho admin)
- Hỗ trợ các APIs đa nền tảng (để có thể lauch cái app cho Windows, Linux và macOS)

Trong viễn cảnh xấu nhất, cái app này sẽ trông như 1 bát mỳ rồi rắm với hàng trăm connect giữa các GUIs với APIs @@ Ta vẫn có thể ra lệnh cho cái đống loạn xình ngậu này lảm việc ổn thỏa, nhưng sớm thôi ta sẽ phát hiện ra source code của ta sử dụng nhiều classes 1 cách thái quá. Cái class hierarchy nó đã tăng trưởng theo cấp số nhân bởi việc hỗ trợ thêm GUI và API yêu cầu tạo thêm càng nhiều class. Cứ tưởng tượng phải viết lại docs cho hàng trăm cái classes ấy, kinh khủng 💀

Cái abstraction object điều khiển việc render diện mạo cho cái app, vứt các công việc logic chính sang cái implementation object được liên kết cùng. Các implementations khác nhau vẫn có thể thay thế đc cho nhau miễn là nó tuân theo 1 interface chung, giúp cho cùng 1 GUI có thể hoạt động dưới cả Windows lẫn Linux.
Kết quả là, ta giờ có thể thay dổi GUI mà ko phải động tới các classes liên quan tới layer API. Hơn nữa, việc thêm hỗ trợ cho các hệ điều hành khác sẽ chỉ yêu cầu tạo thêm 1 class con trong cái implementation hierarchy là được.

[image]
  src: /img/oop/bridge-1.webp
  alt: Bridge abstract and implementation example illustration
  caption: "Bridge abstract and implementation example illustration (Source: Refactoring Guru)"

## Structure

[image]
  src: /img/oop/bridge.webp
  alt: Bridge structure diagram
  caption: Bride structure diagram

1. Cái **Abstraction** cung cấp các logic điều khiển ở high-level. Nó dựa vào implementation object để thực hiện các công việc ở low-level.
2. Cái **Implementation** khởi tạo interface chung cho tất cả các implementations riêng biệt. 1 abstraction chỉ có thể giao tiếp với 1 implementation object thông qua các methods đc khởi tạo ở đây.
3. **Concrete Implementations** là các implementations riêng biệt.
4. **Refined Abstractions** cung cấp các biến thể của logic điều khiển. Giống như class cha, chúng hoạt động với các implementations khác nhau thông qua implementation interface chung.
5. Thông thường, **Client** sẽ chỉ quan tâm tới abstraction. Tuy nhiên, công việc họ cần làm sẽ là liên kết cái abstraction object với 1 trong các implementation objects

---

Tham khảo thêm về `Bridge` tại [https://refactoring.guru/design-patterns/bridge](https://refactoring.guru/design-patterns/bridge "https://refactoring.guru/design-patterns/bridge")
