---
title: OOP | Code Design Principles
tags:
  - OOP
id:
unlisted: true
date: 2024-11-10
---

# Code Design Principles

1 phần mềm như thế nào thì được coi là thiết kế tốt?

Ta đo lường chúng như thế nào?

Để đạt được nó, ta phải tuân theo quy tắc thực tiễn gì?

Làm sao để ta có được 1 kiến trúc linh hoạt, ổn định, và dễ hiểu?

## Encapsulate what varies

> Identify the aspects of your application that vary and
separate them from what stays the same.

Mục đích chính của nguyên tắc này là để hạn chế tối đa ảnh hưởng của các thay đổi.

Không ai muốn xảy ra việc chỉ thay đổi 1 class là oẳng cả feature đâu nhể?

### Encapsulate on a method level

Giả sử ta đang dev 1 e-commerce website. Ở 1 nơi nào đó trong codebase, có 1 method `getOrderTotal` thực hiện nhiệm vụ tính tổng giá trị của 1 order, bao gồm cả thuế.

Ta có thể dự đoán rằng đoạn code liên quan đến thuế có thể sẽ phải thay đổi trong tương lai, cụ thể hơn method `getOrderTotal` sẽ phải thay đổi nhiều lần, tùy theo luật ở các khu vực khác nhau.

Nhưng, đúng ra ta không nên quan tâm tới logic về thuế ở trong method chứ, tên method nó chỉ là `getOrderTotal` thôi mà.

Vì thế, ta nên tách logic tính thuế sang 1 method riêng, có tên gọi cho ta biết có chứa logic tính thuế trong đó. Và `getOrderTotal` sẽ gọi method đó để thực hiện công việc tính thuế.

Before:

```ts
getOrderTotal(order) {
  const total = 0;
  for (const item in order.items) {
	total += item.price * item.quantity;
  }

  if (order.country == "US") total += total * 0.07;
  else if (order.country == "EU") total += total * 0.2;

  return total;
}
```

After:

```ts
getOrderTotal(order) {
  const total = 0;
  for (const item in order.items) {
	  total += item.price * item.quantity;
  }

  total += total * getTaxRate(order.country);

  return total;
}

getTaxRate(country) {
  const countryRateMap = {
    "US": 0.07,
    "EU": 0.2,
  };

  return countryRateMap[country];
}
```

### Encapsulate on a class level

Qua thời gian, ta có thể phải thêm rất nhiều logic vào trong 1 class. Ví dụ như class `User`, có biết bao nhiêu là business với 1 `User` entity chứ.

Đi kèm với đó là hàng tá các methods khác nhau, khiến cho class phồng to lên quá nhiều.

Vì thế, tách các logic methods ra các classes riêng sẽ giúp ta thu gọn cái class chính lại và bảo trì dễ dàng hơn nhiều.

Before:

```ts
class Order {
  private items;
  private country;
  private state;
  private city;
  ... // > 20 fields

  getOrderTotal() { ... }
  getTaxRate() { ... }
  private getUSTax(state) { ... }
  private getEUTax(country) { ... }
  private getChineseTax(product) { ... }
  ... // Many methods more
}
```

After:

```ts
class Order {
  private taxCalulator; // Extract tax methods to a class, and make it Order's dependency
  private items;
  private state;
  private city;
  ... // > 20 fields

  getOrderTotal() {
    ...
    total += total * taxCalulator.getTaxRate(
      this.country,
      this.state,
      this.items[0].product,
    )
	...
  }
}

class TaxCalulator {
  getTaxRate(country, state, product) { ... }
  private getUSTax(state) { ... }
  private getEUTax(country) { ... }
  private getChineseTax(product) { ... }
}
```

## Program to an Interface, not an Implementation

1 design sẽ được gọi là đủ tính ling hoạt khi ta có thể dễ dàng mở rộng nó mà không sợ phải thay đổi full bộ code cũ.

Khi ta setup cho 2 classes liên kết với nhau, ta có thể cho 1 đứa phụ thuộc vào đứa còn lại. 1 cách khá đơn giản, và có phần "lười biếng". Ở cách này, ta chỉ đang gói gọn mọi thứ xoay quanh 2 classes, hoàn toàn ko có gì liên quan tới mở rộng ở đây.

Để làm các classes có được sự dễ mở rộng, ta nên tuân theo các bước sau:

- Xác định chính xác những gì mà object cần từ objects khác
- Mô tả các methods đó ở 1 interface hoặc abstract class mới
- Tạo 1 class mới implement interface trên
- Tạo class thứ 2, phụ thuộc vào interface thay vì phụ thuộc trực tiếp vào class riêng rẽ.

Ví du, ta đang phát triển 1 phần mềm mô phỏng 1 công ty phần mềm.

```ts
class Designer {
  designArchitecture() { ... }
}

class Developer {
  writeCode() { ... }
}

class Tester {
  test() { ... }
}

class Company {
  createSoftware() {
    const designer = new Designer();
    const developer = new Developer();
    const tester = new Tester();

    designer.designArchitecture();
    developer.writeCode();
    tester.test();
  }
}
```

`Company` đang lệ thuộc vào các class riêng rẽ, mỗi class lại cung cấp 1 method khác nhau, thành ra code khá rối. Sau công ty lại thêm 1 role employee mới thì lại tốn công sửa phức tạp.

Ta tối ưu đoạn code trên cho nó clean hơn bằng cách tạo 1 interface chung cho `Designer`, `Developer` và `Tester`. Họ đề "làm việc" mà ~

```ts
interface Employee {
  do();
}

class Designer implements Employee {
  do() { ... }
}

class Developer implements Employee {
  do() { ... }
}

class Tester implements Employee {
  do() { ... }
}

class Company {
  createSoftware() {
    const employees = [new Designer(), new Developer(), new Tester()];
    for (const employee in employees) {
      employee.do();
    }
  }
}
```

Giờ vấn đề là, nếu ta cần thêm 1 loại `Company` khác, với cách tổ chức nhân sự khác thì sao?

Rõ ràng đoạn code trên `Company` vẫn phụ thuộc vào `Employee`. Giờ thêm 1 class `CompanyA` mới, ta lại phải ghi đè hầu hết method cũ của `Company` thay vì tái sử dụng. Như vậy thật tốn công quá.

Để giải quyết vấn đề này, ta có thể gói gọn các `Employee` vào 1 method, và chỉ cần định nghĩa method này với mỗi loại `Company` khác nhau.

```ts
interface Employee {
  do();
}

abstract class Company {
  abstract getEmployees();

  createSoftware() {
    const employees = this.getEmployees();
    for (const employee in employees) {
      employee.do();
    }
  }
}

class Designer implements Employee {
  do() { ... }
}

class Developer implements Employee {
  do() { ... }
}

class Tester implements Employee {
  do() { ... }
}

class CompanyA extends Company {
  getEmployees() {
    return [new Developer(), new Tester()];
  }
}

class CompanyB extends Company {
  getEmployees() {
    return [new Designer(), new Developer(), new Tester()];
  }
}
```

Như vậy, class `Company` đã không còn phục thuộc vào các class `Employee` riêng biệt nữa. Giờ ta đã có thể thêm các company mới và employee mới thoải mái.

Để code có khả năng được mở rộng, ta cũng phải chấp nhận đánh đổi việc code của ta trông sẽ phức tạp hơn so với sơ khai ban đầu. Nhưng nếu ta nhận thấy việc này giúp ta có khả năng thêm nhiều tính năng trong tương lai, thì đừng ngần ngại gì mà sử dụng nó ~

## Favor composition over inheritance

Tính kế thừa hiển nhiên là 1 cách đơn giản để tái sử dụng code giữa các classes.

Thật ko may, một số hạn chế của tính kế thừa chỉ bộc lộ khi ta có hàng tấn classes và thay đổi chúng sẽ tốn rất nhiều resources:

- **Class con ko thể thay thế interface của class cha**. Ta có thể sẽ phải implements toàn bộ các abstract methods trong 1 class kể cả khi ko có nhu cầu sử dụng chúng.
- **Khi override 1 method, ta phải đảm bảo behavior mới phải tương thích với behavior base**. Điều này rất quan trọng vì class con có thể gọi tới method của class cha bất kỳ lúc nào, và ta đều ko muốn chương trình sẽ oẳng chỉ vì gọi tới method của class cha.
- **Kế thừa phá vỡ sự đóng gói của class cha**. Đó là bởi các chi tiết nội tại trong class cha sẽ được bộc lộ với class con.
- **Class con có sự liên kết chặt chẽ với class cha**. Bất kể sự thay đổi ở class cha đều có thể gây ra lỗi với class con.
- **Cố gắng tái sử dụng code qua tính kế thừa có thể dẫn tới các phân lớp kế thừa song song**. Ta có thể tưởng tượng kế thừa theo 1 chiều thẳng đứng, với việc kế thừa quá nhiều tầng lớp sẽ gia tăng độ phức tạo của các classes với tầng tầng lớp lớp kế thừa.

Ví dụ:

[image]
  src: /img/oop/deep-inheritance.webp
  alt: Deep inheritance example
  caption: "Deep inheritance example (Source: Refactoring Guru)"

Ta có thể giải quyết vấn đề của tính kế thừa bằng composition.

Như ở ví dụ trên, thay vì các objects `Car` phải implement behavior của riêng chúng, chúng có thể chuyển công việc đó sang loại object khác.

Chẳng hạn, ta có thể định nghĩa các dependencies chung ở `Transport`, thể hiện behaviors chung. 1 phương tiện kiểu gì chẳng cần 1 động cơ hoặc 1 tài xế phải không?

Ta tạo 2 dependencies `engine` và `driver`, ánh xạ tới 2 interfaces riêng là `Engine` với `Driver`. Như vậy là ở các class con, ta chỉ cần gán object dependencies tuân theo các interfaces đó là được rồi.

[image]
  src: /img/oop/composition-example.webp
  alt: Composition example
  caption: "Composition example (Source: Refactoring Guru)"
