---
title: Abstract Factory
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-05-14
prev_article:
  path: /oop/design-patterns/factory-method
  title: Factory Method
next_article:
  path: /oop/design-patterns/builder
  title: Builder
---

# Abstract Factory

Đây là 1 kiểu creational design pattern giúp ta tạo ra 1 bộ "họ hàng hang hốc" các objects mà không phải định ra các class riêng biệt cho từng bộ.

## Problem

Tưởng tượng ta đang tạo ra 1 app giả lập cửa hàng nội thất.

- Ta cần các sản phẩm hợp lại thành 1 bộ, giả sử: `Chair` + `Sofa` + `Coffee Table`
- Từ bộ trên ta có các collection khác nhau. Ví dụ, `Modern`, `Victorian`, `ArtDeco`

Ở đây ta cần có 1 cách để tạo ra các sản phẩm đơn lẻ sao cho đúng với nhu cầu của người dùng. Người dùng họ muốn 1 `Chair` kiểu `Modern`, ta ko thể đưa cho họ cái `Chair` kiểu `ArtDeco` được... Ăn đấm ngay 😄

Bên cạnh đó, ta lại ko muốn phải thay đổi cấu trúc code của ta đi cả. 1 cái catalog có thể xuất hiện rất nhiều collections, ta ko thể mỗi lần add 1 collection mới lại phải tạo thêm 1 class mới rồi tích hợp class đó vào các tính năng đang có được, thế là quá phức tạp. Vậy phải làm như nào?

## Solution

`Abstract Factory` sẽ được sử dụng để giải quyết vấn đề này.

Đầu tiên, ta cần quy định mỗi sản phẩm 1 cái `interface` để rồi có thể viết nên các biến thể của sản phẩm dựa trên `interface` của nó. Chẳng hạn 1 interface `Chair` cho các biến thể `ModernChair`, `VictorianChair` hay `ArtDecoChair`

```ts
interface Chair {
  hasLegs(): bool
  sitOn(): void
}

class VictorianChair implements Chair {
  hasLegs() {}
  sitOn() {}
}

...
```

Tiếp theo ta cần khởi tạo 1 cái _Abstract Factory_ - 1 cái interface với 1 list các methods để tạo các product

```ts
interface FurnitureFactory {
  createChair(): Chair
  createCoffeeTable(): CoffeeTable
  createSofa(): Sofa
}
```

Giờ để quy định các collection riêng, ta sẽ khởi tạo các factory class riêng implements cái _Abstract Factory_ trên, mà tại đó ta sẽ tạo ra các loại sản phẩm tương ứng, chẳng hạn

```ts
class VictorianFurniture implements FurnitureFactory {
  createChair() {
    return new VictorianChair();
  }

  createCoffeeTable() {
    return new VictorianCoffeeTable();
  }

  createSofa() {
    return new VictorianSofa();
  }
}
```

Client sẽ không phải quan tâm tới các loại factory class khác nhau, thay vào đó họ chỉ cần đảm bảo input có các label để tự động gọi tới đúng loại factory.

```ts
type Label = "Modern" | "Victorian" | "ArtDeco";
type Product = "Chair" | "Sofa" | "CoffeeTable";

// API
class FactoriesCatalog {
  getFactory(label: Label) {
    if (label == "Modern") return new ModernFurniture();
    else if (label == "Victorian") return new VictorianFurniture();
    else if (label == "ArtDeco") return new ArtDecoFurniture();
  }
}

// Client code
class Shop {
  constructor(product: Product, label: Label) {
    this.product = product;
    this.factory = new FactoriesCatalog().getFactory(label);
  }

  someOperation() {
    let prod;
    if (this.product == "Chair") prod = this.factory.createChair();
    else if (this.product == "Sofa") prod = this.factory.createSofa();
    else if (this.product == "CoffeeTable") prod = this.factory.createCoffeeTable();
  }
}
```

## Structure

[image]
  src: /img/oop/abstract-factory.webp
  alt: Abstract Factory structural diagram
  caption: Abstract Factory structural diagram

1. **Abstract Products** khởi tạo interfaces cho các products
2. **Concrete Products** sẽ implement khác nhau dựa vào khuôn mẫu **Abstract Products**
3. **Abstract Factory** interface khởi tạo các methods để tạo nên các products riêng biệt
4. **Concrete Factories** implement các method từ **Abstract Factory**
5. Cuối cùng **Client** sẽ "lựa chọn" các factory bằng cách giao tiếp với interface chung **Abstract Factory**

---

Tham khảo về "Abstract Factory" kỹ hơn tại [Refactoring Guru](https://refactoring.guru/design-patterns/abstract-factory).
