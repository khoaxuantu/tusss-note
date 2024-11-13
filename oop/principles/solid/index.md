---
id:
tags:
  - OOP
unlisted: true
date: 2024-11-10
title: OOP | SOLID Principles
---

# SOLID Principles

Được giới thiệu bởi Robert Martins, quyển *Agile Software Development, Principles, Patterns, and Practices*

**SOLID** đại diện cho 5 nguyên tắc để viết code được dễ hiểu, dễ bảo trì và mở rộng

## Single responsibility principle

> A class should have one reason to change

Ta nên cố gắng định nghĩa 1 class chỉ chịu 1 trách nhiệm duy nhất, và tất cả các logic liên quan tới trách nhiệm đó sẽ được gói gọn trong class đó.

Mục đích chính của nguyên lý này là giảm độ phức tạp của code. Ta đương nhiên là không muốn phải đọc 1 method tới gần trăm dòng và 1 class tới ngàn dòng rồi.

Vấn đề thực sự xuất hiện khi app của ta liên tục tăng trưởng và phình to. Ở một thời điểm nào đó ta sẽ nhận được 1 cái class to đến nỗi không thể bao quát hết chi tiết trong nó.

Việc đọc code trở nên khó khăn khi phải tìm logic trong cả class, hoặc đôi khi phải tìm cả codebase, mọi thứ trở nên quá tải và ta sẽ bị mất kiểm soát cả bộ code.

Một vấn đề khác là nếu class chứa quá nhiều thứ, khi ta thay đổi logic, ta đang phải đánh cược với nguy cơ phá vỡ các logic không liên quan tới scope đang thay đổi tý nào.

**Hiểu cái này tưởng dễ nhưng lại rất khó, như thế nào là trách nhiệm duy nhất của 1 class?**

## Open/Closed Principle

> Classes should be open for extension but closed for modification.

Ý tưởng chính của nguyên lý này là tránh việc gây lỗi cho code cũ khi tính năng mới được thêm vào.

Với các classes đã được hoàn thiện logic, được test kỹ càng, và được đưa vào sử dụng bởi các classes khác, thì ta sẽ không chỉnh sửa interface mà các classes đó đang implement, cũng như các logic bên trong về lâu về dài nữa.

Khi có 1 logic flow mới, ta sẽ chỉ mở rộng từ class sẵn có, tạo class con rồi, override các method ở class cha nếu cần tái sử dụng.

Nếu như đây là 1 logic hoàn toàn mới, hay thiết kế 1 interface mới và tạo các class implement interface đó.

Nguyên lý này không áp dụng tuyệt đối ở tất cả các trường hợp class cần thay đổi. Nhiều khi vẫn còn bug ở class cũ, hoặc class cũ code xấu, cần refactor, etc... Những trường hợp này thì đừng ngại thay đổi.

### Example

Giả sử ta có 1 e-commerce app, trong đó có 1 class `Order` cung cấp method để tính giá ship.

Có nhiều loại ship, cách tính giá ship mỗi loại mỗi khác, và hiện tại các logic đều được hardcode vào trong 1 method chung.

```ts
class Order {
  ...
  getShippingCost(shipping: string) {
    if (shipping == "ground") {
      if (this.getTotal() > 100) return 0;
      return this.getTotalWeight() * 1.5;
    }

    if (shipping == "air") return this.getTotalWeight() * 3;
  }
  ...
}
```

Như vậy, class này vẫn có xu hướng phải chỉnh sửa nhiều trong tương lai. Đồng thời method sẽ có xu hướng phồng to nếu cần thêm logic cho shipping mới.

Để giải quyết vấn đề này, ta có thể đưa mỗi logic cho mỗi loại shipping sang 1 class riêng

```ts
interface Shipping {
  getCost(order): number;
}

class GroundShipping implements Shipping {
  private maxTotal = 100;
  private costRate = 1.5;

  getCost(order) {
    if (order.getTotal() > this.maxTotal) return 0;
    return order.getTotalWeight() * this.costRate;
  }
}

class AirShipping implements Shipping {
  private costRate = 3;

  getCost(order) {
    return order.getTotalWeight() * this.costRate;
  }
}

class Order {
  private shipping: Shipping;

  getShippingCost() {
    return this.shipping.getCost(this);
  }
}
```

## Liskov Substitution Principle

Nguyên lý được đặt tên theo Barbara Liskov, được định nghĩa trong quyển *[Data abstraction and hierarchy](https://www.semanticscholar.org/paper/Data-Abstraction-and-Hierarchy-Liskov/36bebabeb72287ad9490e1ebab84e7225ad6a9e5?p2df)*, năm 1987.

> When extending a class, remember that you should be able to pass objects of the subclass in place of objects of the parent class without breaking the client code.

Class con nên tương thích hoàn toàn với behavior của class cha, output của class con nên trả về cùng kiểu dữ liệu với output của class cha.

Concept này rất quan trọng khi phát triển thư viện hoặc frameworks, vì code mình viết ra là để người khác dùng.

Nguyên lý này liệt kê ra các yêu cầu formal như sau:

- Kiểu dữ liệu của parameters trong 1 method của class con phải *match* hoặc *trừu tượng* hơn kiểu dữ liệu của parameters trong method tương ứng của class cha.
- Kiểu dữ liệu trả về của 1 method của class con phải *match* hoặc là *subtype* của kiểu dữ liệu trả vể của method tương ứng của class cha.
- 1 method ở class con không nên throw những exceptions mà base method không có throw
- 1 class con không nên tăng cường pre-conditions. Ví dụ, base method có 1 parameter với kiểu `int`. Nếu 1 class con override method này và yêu cầu input phải là số dương (handle điều kiện bằng cách throw thêm 1 exception nếu input là số âm), thì đây được gọi là tăng cường pre-conditions. Client code khi đang sử dụng tốt với base class cùng số âm, thì lại không sử dụng được class con nữa.
- 1 class con không nên giảm nhẹ post-conditions.
- Nhưng tính chất bất biến của class cha phải được bảo toàn
- 1 class con không nên thay đổi giá trị private fields của class cha.

## Interface Segregation Principle

> Clients shouldn’t be forced to depend on methods they do not use.

Cố gắng thiết kế interface đủ cô đọng sao cho các classes con không phải implement những behavior không cần thiết.

***Cái này thì dễ hiểu nên chắc không cần nói gì nhiều***

## Dependency Inversion Principle

> High-level classes shouldn’t depend on low-level classes. Both should depend on abstractions. Abstractions shouldn’t depend on details. Details should depend on abstractions.

Thông thường khi thiết kế phần mềm, ta có thể tạo phân lớp cho các classes riêng biệt.

- **Low-level classes** implement các operations cơ bản như connect vs database, ghi file đọc file, etc...
- **High-level classes** chứa đựng các business logic phức tạp điều hướng tới low-level classes để làm gì đó.

Đôi khi mọi người sẽ thiết kế low-level classes trước rồi mới bắt tay tạo các high-level classes sau. Với cách tiếp cận này thì các business logic classes sẽ có xu hướng phụ thuộc vào các low-level classes.

Nguyên lý dependency inversion thay vào đó sẽ đảo ngược phương hướng của dependency trên.

1. Ở bước khởi đầu, ta cần định nghĩa các interfaces cho low-level operations mà các high-level classes sẽ gọi tới, thể hiện qua các tên phương thức gắn liền với business. Ví dụ, business logic nên gọi tới method `openReport(file)` thay vì gọi 1 chuỗi các methods `openFile(x)`, `readBytes(x)`, `closeFile(x)`.
2. Rồi ta cho các high-level classes phụ thuộc vào những interfaces được định nghĩa, thay vì phụ thuộc vào các low-level classes riêng rẽ.
3. 1 khi các low-level classes implement các interfaces, chúng sẽ phụ thuộc vào business logic level.

### Example

High-level budget report class đang sử dụng low-level database class cho việc đọc và ghi dữ liệu.

Điều này đồng nghĩa với việc bất cứ thay đổi nào đến từ database class, như version mới của database server được released, đều sẽ ảnh hưởng ít nhiều lên high-level class, mà đáng lý ra chúng ko cần phải quan tâm đến các thay đổi trong database class.

```ts
class BudgetReport {
  private database: MySQLDatabase;

  open(date) {}

  save() {}
}

class MySQLDatabase {
  insert() {}

  update() {}

  delete() {}
}
```

Ta có thể khắc phục vấn đề trên bằng cách tạo 1 high-level interface với read/write operations và cho budget report class sử dụng interface thay vì trực tiếp database class.

Và rồi ta có thể mở rộng database class để implement các logic riêng cho các version hoặc loại database khác nhau.

```ts
interface Database {
  insert();
  update();
  delete();
}

class MySQL implements Database {
  insert() {}

  update() {}

  delete() {}
}

class MongoDB implements Database {
  insert() {}

  update() {}

  delete() {}
}

class BudgetReport {
  private database: Database;

  open(date) {}

  save() {}
}
```
