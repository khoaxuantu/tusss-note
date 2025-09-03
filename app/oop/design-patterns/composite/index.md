---
title: Composite
tags:
  - OOP
  - DesignPattern
id:
date: 2023-06-28
unlisted: true
next_article:
  path: /oop/design-patterns/decorator
  title: Decorator
prev_article:
  path: /oop/design-patterns/bridge
  title: Bridge
---

# Composite

Đây là pattern giúp ta tổ chức các objects thành cấu trúc cây (tree structure) và rồi làm việc với các cấu trúc này như thể chúng là các objects đơn lẻ.

> Composite pattern chỉ có tác dụng khi những core model trong app của ta có thể được thể hiện dưới dạng cây.

## Problem

Tưởng tượng ta có 2 loại objects: `Products` và `Boxes`. 1 `Box` có thể chứa đựng vài `Products` cũng như 1 vài `Box` nhỏ hơn. Những `Box` nhỏ hơn cũng có thể chứa vài `Products` và các `Box` thậm chí còn nhỏ hơn nữa...

Ta quyết tạo 1 hệ thống order sử dụng những class này. Các orders của ta có thể sẽ chứa những sản phẩm đơn giản riêng lẻ ko cần phải đóng gói gì, nhưng cũng có các orders ta cần đóng gói lại thành hộp, bên trong có thể sẽ là các loại sản phẩm khác nhau, và thêm cả những hộp nhỏ hơn. Vậy làm sao để ta có thể xác định đc giá bán tổng cộng cho chúng?

Ta có thể tiếp cận trực tiếp: mở bung cái hộp ra, check tất cả sản phẩm rồi cộng tổng lại. Này ở thế giới thực thì hợp lý, nhưng bê vào code, nó ko hề đơn giản như là chỉ chạy 1 vòng lặp. Ta sẽ phải biết các classes của `Products` và `Box` mà ta phải duyệt, và tệ nhất là phải xử lý đống nesting level chồng chéo nhau.

```js
"Box": {
  "Products": [Receipt],
  "Small Box 1": {
    "Products": [Hammer]
  },
  "Small Box 2": {
    "Small Box 3": {
      "Products": [Phone, Headphones]
    },
    "Small Box 4": {
      "Products": [Charger]
    }
  }
}
```

## Solution

`Composite` pattern gợi ý ta làm việc với `Products` và `Boxes` thông qua 1 interface chung trong đó có khởi tạo 1 method dành cho việc tính toán tổng tiền.

Cái method này hoạt động thế nào? Với 1 product, nó đơn giản là trả về giá tiền của sản phẩm đó. Với 1 box, nó sẽ đi hết các item trong cái hộp đó, check giá và trả về tổng giá tiền của box đó. Nếu 1 trong các items là 1 box nhỏ hơn, cái box đó cũng sẽ tính các item mà nó chứa. Cứ thế cứ thế cho đến khi giá tiền của các thành phần được tính. Bản thân cái box cũng có thể cộng thêm 1 số chi phí đội lên, như là giá đóng gói hoặc giá ship.

Nghe qua giống áp dụng đệ quy phết nhể 🤔

Lợi ích của cách tiệp cận này là ta ko cần phải quan tâm tới các classes riêng biệt của các objects trong cấu trúc tree này. Ta ko cần phải biết cái object là 1 product đơn giản hay là 1 box với nhiều thành phần trong đó. Nhờ có interface ta chỉ cần quan tâm tới việc gọi ra method để lấy giá tiền, còn cách tính như nào thì bản thân cái object sẽ override cho.

```ts
interface Goods {
  getPrice(): number,
  getKey(): string
}

class Box implements Goods {
  children: {};

  add(good: Goods) {
    children[good.getKey()] = good;
  }

  remove(good: Goods) {
    delete Children[good.getKey()];
  }

  getKey(): string {
    /* Implement your own rule for box's key */
  }

  getPrice(): number {
    let total = 0;
    for (const item of Object.values(children)) {
      total += item.getPrice();
    }
    return total;
  }
}

class Product implements Goods {
  private price: number;

  constructor(product: string) {
    this.price = PriceCatalog[product]; // A price catalog dictionary for short hand price assignment
  }

  getKey(): string {
    /* Implement your own rul for product's key */
  }

  getPrice(): number {
    return this.price;
  }
}
```

## Structure

[image]
  src: /img/oop/composite.webp
  alt: Composite structure diagram
  caption: Composite structure diagram

1. **Component** interface miêu tả các operation chung cho các element nằm trong cấu trúc dạng cây
2. **Leaf** là các based element, giống kiểu based case ta hay sử dụng trong đệ quy ấy. Tại các element này thường ta sẽ trả về các thuộc tính của nó hơn, như ví dụ trên trong class `Product`

  ```ts
  getPrice() {
    return this.price;
  }
  ```

3. **Container** (aka _composite_) là loại element mà có các element phụ bên trong. Giống `Box` ấy ~
4. **Client** làm việc với toàn bộ các element thông qua API đc cung cấp bởi cái **Component interface**. Kết quả là, ko quan trọng đang động tới element nào, client chỉ cần gọi ra đúng 1 method trong nó là các cơ chế đều được hoạt động ổn thỏa nhờ `override` hết.

---

Tham khảo thêm về `Composite` tại [https://refactoring.guru/design-patterns/composite](https://refactoring.guru/design-patterns/composite "https://refactoring.guru/design-patterns/composite")
