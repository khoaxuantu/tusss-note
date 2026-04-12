---
title: Decorator
tags:
  - OOP
  - DesignPattern
id:
date: 2023-07-05
unlisted: true
prev_article:
  title: Composite
  path: /oop/design-patterns/composite
next_article:
  title: Facade
  path: /oop/design-patterns/facade
---

# Decorator

Đây là kiểu design pattern cho ta đính kèm các hành vi mới của objects bằng cách đặt objects vào trong các wrapper objects đặc biệt mà chứa những hành vi đó.

## Problem

Giả sử ta đang viết 1 thư viện về thông báo giúp cho các chương trình khác thông báo cho users của họ về những sự kiện quan trọng.

Phiên bản đầu tiên của thư viện là dựa vào `Notifier` class với chỉ một vài fields, 1 cái constructor và 1 cái `send` method. Cái method có thể nhận argument biểu thị tin nhắn từ client và gủi tin tới 1 list các emails đc pass tới cái notifier thông qua constructor. 1 app bên thứ 3 đóng vai trò là client nhận nhiệm vự tạo ra và cấu hình cái object notifier, và rồi sử dụng nó mỗi khi có cái gì đó quan trọng xảy ra.

Ở 1 mức độ nào đó, bạn nhận ra là ng dùng kỳ vọng ở cái thư viện của mình làm đc nhiều hơn là chỉ 1 chức năng thông báo email. Rất nhiều ng muốn có thể nhận thông báo SMS về các thông tin tối quan trọng. Nhiều ng khác lại muốn đc nhận thông báo từ Facebook, và đương nhiên các cộng tác viên cũng muốn nhận thông báo từ Slack của họ.

Mở rộng đc như trên thì khó như thế nào? Ta mở rộng `Notifier` class và đưa thêm các method thông báo khác vào trong subclasses mới. Giờ client sẽ phải khởi tạo class thông báo mong muốn và sử dụng chúng cho những chức năng thông báo xa hơn.

Nhưng rồi như lẽ thường tình, ai đó lại hỏi bạn: "Ei bạn ei sao thư viện của bạn lại ko có khả năng sử dụng các loại thông báo khác nhau cùng 1 lúc? Tính năng này cần thiết chứ. Chẳng hạn như nhà bạn bị khủng bố, bạn lại chẳng muốn thông báo ngay tới mọi kênh thông tin quá @@"

Ta thử xử lý vấn đề trên bằng cách tạo thêm 1 subclass đặc biệt gom hết các method thông báo lại. Tuy vậy, ta lại nhanh chóng nhận ra cách này sẽ khiến code phồng lên ngày một lớn, ko chỉ code trong thư viện mà còn client code cũng bị. Ta phải tìm 1 cách nào đó khác để cấu trúc các class thông báo để tránh việc khiến cho code của ta phá kỷ lục guiness một ngày nào đó...

[image]
  src: /img/oop/decorator.png
  alt: Social media example diagram
  caption: "Social media example diagram (Source: Refactoring Guru)"

## Solution

Mở rộng 1 class là thứ đầu tiên ta có thể nghĩ đến trong trường hợp trên. Nhưng ta cần lưu ý tính kế thừa cũng cho ta 1 số cảnh báo nghiêm trọng về đặc điểm của nó:

- Tính kế thừa là static. Ta ko thể biến đổi các hành vi của 1 object trong runtime. Ta chỉ có thể thay thế 1 object mới hoàn toàn đc tạo nên từ subclass khác
- Subclasses có khả năng chỉ có thể có 1 class cha. Trong nhiều ngôn ngữ, 1 class ko thể kế thừa các đặc điểm của nhiều classes cùng 1 lúc

1 cách để tránh những cảnh báo này là sử dụng _Aggregation_ hoặc _Composition_ thay cho _Inheritance_. Cả 2 đều hoạt động theo cùng 1 cách: 1 object có reference tới 1 object khác và giao phó cho nó đỡ vài việc.

Với cách tiếp cận mới này ta có thể thay thế object "helper" đã đc kết nối với 1 helper khác, thay đổi hành vi của cả cục trong runtime. 1 object sẽ có thể sử dụng các tính năng của cơ số classes khác, tạo reference với nhiều objects và phó thác chúng hoàn thành công việc giúp mình.

"Wrapper" là 1 nickname khác của Decorator pattern. 1 _wrapper_ là 1 object có thể đc liên kết với 1 vài objects mục tiêu. Cái wrapper chứa đựng cùng 1 set method với mục tiêu và hỗ trợ chúng xử lý mọi requests mà chúng nhận. Tuy vây, wrapper có thể làm thay đồi kết quả trước hoặc sau khi nó chuyển request cho mục tiêu.

Vậy khi nào 1 wrapper đơn giản trở thành 1 decorator thực thụ? Như ta đã đề cập, wrapper implements cùng interface với các object được wrapped. Vì thế, từ phía client các objects đó là y hệt nhau, làm cho reference field của wrapper chấp nhật bất kỳ object nào tuân theo inteface đó.

[image]
  src: /img/oop/decorator-1.png
  alt: Solution for social media example
  caption: "Solution for social media example (Source: Refactoring Guru)"

Trong ví dụ của ta ở trên, ta sẽ bỏ cái thông báo email đơn giản vào trong cái base `Notifier` class, và chuyển tất cả các phương thức thông báo khác thành decorators. Client code sẽ cần wrap cái basic notifier object vào 1 set các decorators sao cho phù hợp với ưu tiên của họ.

Cái objects nhận đc sẽ đc cấu trúc như 1 stack. Cái decorator cuối cùng trong stack sẽ là object mà client thực sự muốn. Vì tất cả decorators implement cùng 1 interface giống như cái base `Notifier`, phần còn lại của client code sẽ ko quan tâm liệu nó sẽ hoạt động ổn với "pure" notifier object hay object đc decorated hay ko.

```ts
class Notifier {
  private sender: Sender;
  private receivers: Receiver;
  constructor(sender: Sender, receivers: Receiver) {
    this.sender = sender;
    this.receivers = receivers;
  }

  send(message) {
    sender.deliver_to(receivers);
  }
}

class BaseDecorator extends Notifier {
  protected wrappee: Notifier;
  constructor(notifier: Notifier) {
    super();
    this.wrappee = notifier;
  }
  override send(message) {
    this.wrappee.send(message);
  }
}

class SMSDecorator extends BaseDecorator {
  constructor(notifier: Notifier) {
    super(notifier);
  }
  override send(message) {
    super.send(message);
    sendSMS(message);
  }
}

class FacebookDecorator extends BaseDecorator {
  constructor(notifier: Notifier) {
    super(notifier);
  }
  override send(message) {
    super.send(message);
    sendFB(message);
  }
}

class SlackDecorator extends BaseDecorator {
  constructor(notifier: Notifier) {
    super(notifier);
  }
  override send(message) {
    super.send(message);
    sendSlack(message);
  }
}

function Client() {
  let stack = new Notifier(sender, receivers);
  if (facebookEnabled()) {
    stack = new FacebookDecorator(stack);
  }
  if (slackEnabled()) {
    stack = new SlackDecorator(stack);
  }

  stack.send("Alert!"); // Email -> Facebook -> Slack
}
```

## Structure

[image]
  src: /img/oop/decorator.webp
  alt: Decorator structure diagram
  caption: Decorator structure diagram

1. **Component** khởi tạo interface chung cho cả wrappers lẫn object đc wrapped
2. **Concrete Component** là 1 class của objects đang đc wrapped. Nó định nghĩa các đặc điểm cơ bản mà có thể bị biến đổi bởi decorators.
3. **Base Decorator** class có 1 field để refer tới cái object đc wrapped. Type của field này cần đc khởi tạo bằng component interface để nó có thể chứa cả concrete components lẫn decorators.
4. **Concrete Decorators** định nghĩa thêm các đặc điểm mà có thể thêm vào components 1 cách cơ động. Concrete decorators override các methods của base decorators và execute các đặc điểm riêng của nó trước và sau khi gọi tới method của class cha (base decorator)
5. **Client** wrap đống components vào trong nhiều lớp decorators, miễn là nó hoạt động đc với tất cả objects thông qua interface của component.

---

Tham khảo thêm về `Decorator` tại [https://refactoring.guru/design-patterns/decorator](https://refactoring.guru/design-patterns/decorator "Decorator - Refactoring Guru")
