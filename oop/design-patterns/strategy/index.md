---
title: Strategy
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-10-17
next_article:
  path: /oop/design-patterns/template-method
  title: Template Method
prev_article:
  path: /oop/design-patterns/state
  title: State
---
# Strategy

Đây là pattern cho ta định nghĩa 1 họ các thuật toán, đưa chúng vào trong 1 class riêng biệt, và làm các objects của chúng có thể thay đổi lẫn nhau được.

## Problem

1 ngày nào đó ta quyết định tạo 1 app du hành cho hội du lịch. Con app của ta sử dụng i tấm bản đồ giúp cho những người dùng có thể thiết kế hướng đi cho hành trình của họ 1 cách dễ dàng.

1 trong các tính năng được yêu cầu nhiều nhất của app là lập chuyến đi tự động. 1 ng dùng chỉ cần nhập địa chỉ là sẽ có được đường đi nhanh nhất hiển thị trên bản đồ.

Version đầu tiên của app chỉ cần tính năng đó cho các chuyến đi trên đường nhựa. Tất cả người đi du lịch bằng ô tô xe máy đều dùng ngon lành. Nhưng rồi ta nhận ra ko phải tất cả đều đi xe cho chuyến đi nghỉ dưỡng của họ. Nên ở bản cập nhật tiếp theo, ta thêm 1 lựa chọn phương tiên công cộng, rồi lại 1 lựa chọn đi bộ nữa.

Về sau, ta lại muốn xây dựng chuyến đi cho những ng đạp xe đạp, và rồi sau nữa... 1 chuyến đặc biệt đi qua các điểm du lịch chỉ định...

Có thể thấy về mặt kỹ thuật, app của ta đang gặp vấn đề rất đau đầu. Mỗi lần ta thêm 1 thuật toán tìm đường riêng, class chính cho tính năng đó lại phồng lên gấp đôi. Tới một mức độ nào đó, con class này sẽ trở nên quá đỗi khổng lồ để có thể bảo trì

Bất cứ sự thay đổi nào tới 1 trong các thuật toán trong đó đều có thể ảnh hưởng tới toàn bộ class, tăng nguy cơ tạo thêm lỗi cho những code vốn dĩ đang chạy ổn.

Thêm vào đó, teamwork trở nên ko hiệu quả. Các teammates của ta có nhiều người đc nhận vào sau khi con app được release lâu rồi, và họ đều sẽ phàn nàn quả code khủng bố trong đó. Thêm tính năng khó, refactor khó, nói chung là tiền đình chetme :)))

## Solution

Strategy pattern đề xuất ta lấy 1 class mà đang phải chứa rất nhiều thuật toán khác nhau cho 1 nhóm tính năng tách thành các classes riêng biệt gọi là strategies.

Class khởi đầu, còn đc gọi là context, phải có 1 trường lưu trữ tham chiếu tới 1 trong các strategies. Context sẽ đẩy tất cả đầu việc tới strategy đc kết nối thay vì phải tự thực thi chúng.

Context ko chịu trách nhiệm cho việc lựa chọn thuật toán phù hợp cho 1 job. Thay vào đó, client sẽ pass strategy mong muốn vào trong context. Mà thực ra context lại ko có biết nhiều tới các strategies, bởi context làm việc với chúng thông qua 1 interface chung với các method để kích hoạt việc thực hiện thuật toán.

Nhờ cách này, context trở nên đọc lập với các strategies riêng biệt, về sau ta có thể thêm các thuật toán mới mà ko phải lo ảnh hưởng tới cả context lẫn strategies đang tồn tại.

[image]
  src: /img/oop/strategy-1.webp
  alt: Route Strategy solution diagram
  caption: "Route Strategy solution diagram (Source: Refactoring Guru)"

Trong app của ta, mỗi thuật toán tìm đường có thể cho vào class riêng với 1 `buildRoute()` method. Cái method chấp nhận tọa độ đầu và cuối và trả lại 1 tập hợp các checkpoints cho chuyến đi.

Dù được cho các arguments giống nhau, mỗi class tìm đường có thể xây dựng 1 route khác nhau, class điều hướng chính ko cần phải quan tâm về loại thuật toán đang được sử dụng, công việc chính của chúng sẽ là render ra set các checkpoints trên bản đồ. Class điều hướng sẽ có 1 method để chuyển routing strategy đang hoạt động, nên clients của chúng, như các buttons trên GUI, có thể thay thế routing mode hiện có với 1 cái khác.

```ts
interface Coordinate {
  x: Coordinate,
  y: Coordinate
}

interface RouteStrategy {
  buildRoute: (a: Coordinate, b: Coordinate) => Coordinate[]
}

class RoadStrategy implements RouteStrategy {
  buildRoute(a: Coordinate, b: Coordinate) {
    // Build route travelling on road
  }
}

class PublicTransportStrategy implements RouteStrategy {
  buildRoute(a: Coordinate, b: Coordinate) {
    // Build route travelling by public transportation
  }
}

class WalkingStrategy implements RouteStrategy {
  buildRoute(a: Coordinate, b: Coordinate) {
    // Build route travelling on foot
  }
}

class Navigator {
  private routeStrategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.routeStrategy = strategy;
  }

  buildRoute(a: Coordinate, b: Coordinate) {
    return this.routeStrategy.buildRoute(a, b);
  }

  set routeStrategy(strategy: RouteStrategy) {
    this.routeStrategy = strategy;
  }
}
```

## Structure

[image]
  src: /img/oop/strategy.webp
  alt: Strategy structure diagram
  caption: Strategy structure diagram

1. **Context** duy trì tham chiếu tới 1 trong các strategies và giao tiếp với chúng thông qua interface
2. **Strategy** interface sử dụng chung cho tất cả strategies riêng rẽ
3. **Concrete Strategies** implements các biến thể thuật toán cho context
4. Context gọi tới method thực thi trong strategy object đc liên kết mỗi lần nó cần chạy giải thuật. Context sẽ ko biết loại strategy mà chúng đang hoạt động cùng và thuật toán đc thực thi như thế nào
5. **Client** tạo 1 strategy object và pass chúng vào context. Cái context sẽ có 1 setter để giúp clients thay thế loại strategy dễ dàng

---

Tham khảo thêm về `Strategy` tại [https://refactoring.guru/design-patterns/strategy](https://refactoring.guru/design-patterns/strategy "Strategy - Refactoring Guru")
