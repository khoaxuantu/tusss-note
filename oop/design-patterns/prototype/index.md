---
title: Prototype
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-05-30
next_article:
  title: Singleton
  path: /oop/design-patterns/singleton
prev_article:
  title: Builder
  path: /oop/design-patterns/builder
---

# Prototype

Đây là 1 kiểu design pattern cho phép ta copy các objects đã tồn tại mà ko phải khiến code của ta phụ thuộc vào các classes của các objects đó.

## Problem

Bắt đầu với việc ta có 1 object, và ta muốn tạo 1 bản copy từng cọng lông chân kẽ tóc của nó. Ta phải làm thế nào? Đầu tiên, ta phải tạo 1 object mới của cùng 1 loại class, rồi ta phải duyệt qua từng field 1 của object khởi đầu và copy giá trị vào cái object mới.

```ts
const objA = new classA(4,5);
const objB = new classA();
for (key in objA) {
  objB[key] = objA[key];
}
```

Đơn giản thế thoy, nhưng có 1 vấn đề. Sẽ có thể có nhiều field của object khởi đầu được set làm `private` và ko thể đc gọi ra ngoài object trực tiếp. Điều này khiến cách làm trên ko khả thi đc.

1 vde khác với cách trên, vì ta cần phải biết class của object khởi đầu để tạo 1 object clone mới, code của ta sẽ trở nên phục thuộc vào class đó. Đôi khi ta chỉ biết được cái interface mà cái object nó dựa vào mà ko phải cả cái class, nên lắm thứ phức tạp sẽ nảy sinh.

## Solution

Prototype pattern sẽ giao phó quá trình clone cho chính các objects mà đang được clone. Cái pattern sẽ khởi tạo 1 cái interface chung cho tất cả các objects mà hỗ trợ cloning. Cái interface này sẽ giúp ta clone 1 object mà ko phải gọi tới cái class của object nữa. Thông thường, kiểu interface này sẽ chỉ chứa đúng 1 cái `clone` method, và ta sẽ override method này trong các class của object luôn.

Như vậy, ta giải quyết được vấn đề các private fields của 1 object khi mà ta đã có thể truy cập được chúng bằng `clone` method trong object đó.

```ts
abstract class BaseClass {
  abstract clone(): BaseClass;
}

class ClassA extends BaseClass {
  constructor() {}

  // Calling when we want to clone an object of ClassA
  override clone() {
    return new ClassA(this);
  }
}
```

Cái object mà có hỗ trợ cloning sẽ được gọi là 1 _prototype_. Khi object của ta có hàng tá fields với hàng trăm config khả thi, clone chúng sẽ là 1 cách khác với tạo subclass.

Đây là cơ chế của nó: Ta tạo 1 set các objects, cấu hình 1 vài chỗ. Xong rồi khi ta cần 1 object giống như cái mà ta đã config, ta chỉ cần clone 1 prototype thay vì phải tạo 1 object mới từ đầu.

## Structure

### Basic implementation

[image]
  src: /img/oop/prototype.webp
  alt: Prototype basic implementation structure diagram
  caption: Prototype basic implementation structure diagram

1. `Prototype` interface khởi tạo method `clone`
2. `Concrete Prototype` class implements cloning method. Bên cạnh việc copy dữ liệu của object ban đầu (copy đơn giản với các giá trị đơn) bằng cách trả về 1 `new Class(this)` luôn, method này cũng cần xử lý 1 số edge cases phức tạp riêng như clone 1 object field, linked objects, etc... Chẳng hạn như ở TypeScript

  ```ts
  class A implements Prototype {
    constructor() {
      this.objField = {} // 1 object field
    }

    clone() {
      // We use Object.create() method to copy the object
      const clone = Object.create(this);

      // The object field needs distinct implementation
      clone.objField = Object.create(this.objField);

      return clone;
    }
  }
  ```

3. `Client` có thể sản xuất 1 bản copy của bất kỳ object nào follow cái prototype interface trên

### Prototype registry implementation

[image]
  src: /img/oop/prototype-1.webp
  alt: Prototype basic implementation structure diagram
  caption: Prototype basic implementation structure diagram

Cái `Prototype Registry` cung cấp cách đơn giản để truy cập tới các prototypes được dùng thường xuyên.

Nó lưu trữ 1 set các pre-built objects sẵn sàng để copy. Cách đơn giản nhất cho prototype registry đó là sử dụng `name -> prototype` hash map, nhưng nếu ta cần lập 1 cơ sở để search prototype tốt hơn là chỉ sử dụng những cái tên đơn giản, ta có thể tự build các hệ thống search phức tạp hơn

---

Tham khảo thêm về `Prototype` tại: [https://refactoring.guru/design-patterns/prototype](https://refactoring.guru/design-patterns/prototype "Prototype - Refactoring Guru")
