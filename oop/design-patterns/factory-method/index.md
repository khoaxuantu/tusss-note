---
title: Factory Method
tags:
  - OOP
  - DesignPattern
id:
date: 2023-04-19
unlisted: true
---

# Factory Method

Ta sẽ bắt đầu với pattern đầu tiên là **Factory Method** (còn có tên khác là Virtual Constructor). Đây là 1 creational design pattern cung cấp các `interface` nhằm định nghĩa nên các object ở 1 base class (superclass), nhưng cho phép các class con có thể biến đổi các kiểu của objects sắp được tạo.

## Problem

Tưởng tượng rằng ta đang viết 1 ứng dụng quản lý logistic. Ở version 1 của App đó ta chỉ cần phải xử lý 1 class `Truck`, nên cả codebase của ta xoay quanh cái class `Truck` này. Hoạt động đc 1 thời gian, cái App của ta trở nên nổi tiếng hơn, nhiều khách hàng đã bắt đầu tiếp cận tới ta hơn, rồi ta nhận thấy rằng có rất nhiều request trong đó là từ các cty vận tải đường biển. Như vậy, để đáp ứng nhu cầu khách hàng, ta sẽ phải tạo thêm 1 class `Ship` cho vận tải đường biển nữa.

Từ đây, vấn đề bắt đầu nảy sinh. Trong rất nhiều trường hợp, `Truck` có dependencies riêng (4 bánh, tài xế lái xe tải, động cơ xe tải, etc...), và `Ship` cũng có dependencies riêng (phi công, động cơ tàu thủy, etc...)

Vì codebase của ta đang xoay quanh `Truck`, việc add thêm `Ship` sẽ khiến cho ta phải thay đổi toàn bộ codebase. Đây là 1 điều ko tốt đẹp tý nào, vì mỗi lần tạo thêm 1 class mới như thế, ta sẽ tốn vô cùng nhiều thời gian và công sức để chỉnh sửa lại cả cấu trúc code, mà kết quả sẽ cho ra 1 đống code phức tạp và rối rắm kinh khủng.

```ts
type Vehicles = "truck" | "ship";

type Goods = {
  totalWeight: number; // tons
};

interface Vehicle {
  go(): void;
}

class Truck implements Vehicle {
  static capacity = 4; // tons

  go() {}
}

class Ship implements Vehicle {
  static capacity = 1000; // tons

  go() {}
}

class Logistics {
  deliver(vehicle: Vehicles, goods: Goods) {
    switch (vehicle) {
      case "truck":
        const trucksQuantity = Math.ceil(
          goods.totalWeight / Truck.capacity
        );
        for (let i = 0; i < trucksQuantity; i++) {
          new Truck().go();
        }
        break;

      case "ship":
        const shipsQuantity = Math.ceil(
          goods.totalWeight / Ship.capacity
        );
        for (let i = 0; i < shipsQuantity; i++) {
          new Ship().go();
        }
        break;
    }
  }
}
```

## Solution

Factory Method sẽ giải quyết vấn đề trên bằng cách thay việc gọi trực tiếp object constructor ra (với `new` operator) bằng việc gọi tới một `factory` method đặc biệt.

After

```ts
abstract class BaseFactory {
  abstract create(): Vehicle;

  protected abstract getQuantityNeeded(weight: number): number;

  createForGoods(weight: number) {
    const vehicles: Array<Vehicle> = [];

    for (let i = 0; i < this.getQuantityNeeded(); i++) {
      vehicles.push(this.create());
    }

    return vehicles;
  }
}

class TruckFactory extends BaseFactory {
  override create() {
    return new Truck();
  }

  protected override getQuantityNeeded(weight: number) {
    return Math.ceil(goods.totalWeight / Truck.capacity);
  }
}

class ShipFactory extends BaseFactory {
  override create() {
    return new Ship();
  }

  protected override getQuantityNeeded(weight: number) {
    return Math.ceil(goods.totalWeight / Ship.capacity);
  }
}
```

Mới đầu nhìn qua thì có vẻ hơi thừa thãi, nhưng để ý thì sẽ thấy thực chất giờ đây ta đã có thể thiết lập cách khởi tạo object một cách có trật tự hơn bằng cách override các method từ class base factory, nhờ đó mà bảo trì code cũng được chặt chẽ dễ hiều hơn, ngoài ra nó cũng sẽ có lợi khi ta tạo 1 class bản lề để quyết định xem mình nên "sản xuất" ra object gì.

```ts
type Vehicles = "truck" | "ship";

class Logistics {
  private factories: Record<Vehicles, BaseFactory>;

  constructor() {
    this.factories = {
      "truck": new TruckFactory(),
      "ship": new ShipFactory(),
    };
  }

  deliver(vehicle: Vehicles, goods: Goods) {
    const vehicles = this.factories[vehicle].createForGoods(goods.totalWeight);
    vehicles.forEach((vehicle) => vehicle.go());
  }
}
```

## Structure

Cấu trúc chung của factory được diễn tả theo sơ đồ như sau

![Factory Method structure diagram](https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png?id=4cba0803f42517cfe8548c9bc7dc4c9b)

Tham khảo về **Factory Method** kỹ hơn tại [https://refactoring.guru/design-patterns/factory-method](https://refactoring.guru/design-patterns/factory-method "Factory Method (Refactoring Guru)")
