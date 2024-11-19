---
title: Chain of Responsibility
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-08-19
next_article:
  path: /oop/design-patterns/command
  title: Command
prev_article:
  path: /oop/design-patterns/proxy
  title: Proxy
---

# Chain of Responsibility

Đây là pattern cho ta pass requests thông qua 1 chuỗi các handlers khác nhau. Từ lúc nhận request, mỗi handler quyết định xử lý request hoặc pass nó tới handler tiếp theo trong chuỗi

## Problem

Thử tưởng tượng ta đang làm 1 hệ thống đặt hàng online. Ta muốn giới hạn access tới hệ thống sao cho chỉ những users đã đc xác thực mới có thể tạo orders, đồng thời những users có quyền admin phải có quyền truy cập tới toàn bộ orders.

Sau 1 hồi lên kế hoạch, ta nhận ra các checks phải đc thực hiện 1 cách tuần tự. Cái app có thể cố gắng thực hiện xác thực người dùng mỗi khi nó nhận 1 request có chứa credentials của ng dùng đó. Tuy nhiên, nếu những credentials này ko đúng và xác thực thất bại, ko có lý do gì để nó tiếp tục thực hiện request đó nữa.

Qua vài tháng tiếp theo, ta implement thêm 1 vài checks khác:

- 1 trong số các đồng nghiệp đề xuất rằng việc chuyển raw data thẳng vào hệ thống ordering là ko an toàn, nên ta thêm 1 bước validation để sanitize data trong request
- Sau đó, ai đó để ý thấy rằng hệ thống đang dễ bị tổn thương với brute force password cracking. Để tránh nguy cơ này, ta lại phải thêm 1 bước check nhằm lọc ra những requests bị thất bại 1 cách lặp đi lặp lại từ cùng 1 địa chỉ IP
- 1 ng khác đề xuất rằng ta có thể tăng tốc hệ thống bằng cách sử dụng kết quả đc cached từ những requests đc lặp lại. Vì thế, ta thêm 1 check khác cho phép request pass qua hệ thống chỉ khi ko có cached phù hợp

Đống code cho việc checks, vốn dĩ đã khá là rắc rối rồi, nay lại càng thêm phức tạp bởi các logic đc thêm vào sau. Thay đổi 1 check có thể ảnh hưởng tới các checks sau, và tệ nhất là khi ta cố gắng sử dụng lại những checks này để bảo vệ các components khác của hệ thống, ta lại phải duplicate thêm nhiều đoạn code của từng check mà các components đó cần sử dụng.

Hệ thống giờ đây trở nên vô cùng khó và đắt đỏ để bảo trì, ta sẽ phải chịu đựng đống hỗn độn này chừng nào chưa quyết định refactor lại chúng.

## Solution

Giống như các behavioral design patterns khác, **Chain of Responsibility** dựa vào biến đổi các behaviors đặc biệt thành các stand-alone objects gọi là _handlers_. Trong trường hợp của ta, mỗi check nên đc lôi tới class của nó với đúng 1 method thực hiện việc check.

Cái pattern đề xuất ta link những handlers này thành 1 chuỗi (chain). Mỗi handler đc link có 1 field để lưu trữ 1 reference tới handler tiếp theo trong chuỗi. Request đi dọc theo chain cho đến khi tất cả handlers có cơ hội thực hiện request đó.

Đặc biệt, 1 handler có thể quyết định khi nào nên pass khi nào ko nên cho cái request, nhờ vậy nó hoàng toàn có thể dừng bất kỳ request nào nếu có gì bất thường xảy ra.

Trong ví dụ của ta về hệ thống ordering, 1 handler biểu diễn quá trình thực thi và rồi quyết định khi nào có thế pass cái request qua chuỗi. Giả sử 1 request chứa valid data, tất cả handlers có thể thực thi behavior chủ đạo của chúng, bất kể là authentication checks hay caching.

```ts
interface CheckHandler {
  setNext(h: Handler): void;
  handle(request: Object): void
  execute(request: Object): void;
}

abstract class BaseCheck implements CheckHandler {
  private nextCheck: CheckHandler;

  setNext(h: Handler) {
    this.nextCheck = h;
  }

  handle(request: Object) {
    if (this.nextCheck) this.nextCheck.handle(request);
  }

  abstract execute(request: Object): void;
}

class CheckA extends BaseCheck {
  override handle(request: Object) {
    if (canHandle(request)) {
      this.execute(request);
      super.handle(request);
    } else {
      return checkFailed();
    }
  }

  override execute(request: Object) {
    ...
  }
}

class CheckB extends BaseCheck {
  override handle(request: Object) {
    if (canHandle(request)) {
      this.execute(request);
      super.handle(request);
    } else {
      return checkFailed();
    }
  }

  override execute(request: Object) {
    ...
  }
}

/* Client */
const c1 = new CheckA();
const c2 = new CheckB();
c1.setNext(c2);
c1.handle(request);
```

Dù vậy, vẫn có 1 cách tiếp cận hơi khác biệt đó là: trên việc nhận 1 request, 1 handler có thể  quyết định xem nó có phải là đứa xử lý chính hay không, nếu có, nó sẽ xử  lý request đó và ko pass cái request xa hơn. Như vậy, trong 1 chuỗi thì sẽ chỉ có 1 handler có thể xử lý các requests hoặc ko handler nào cả. Cách tiếp cận này khá là phổ biến khi ta phải đối phó với những events trong các stacks của các elements trong 1 giao diện ng dùng.

Ví dụ, khi 1 user click vào 1 nút, event đc truyền qua 1 chuỗi các GUI elements từ cái button, qua containers của nó (như form hay panels), kết thúc ở cửa sổ chính của app. Cái event đc xử lý bởi element đầu tiên trong chain mà có khả năng handler nó. Ta cũng có thể note ví dụ này lại vì nó đang cho ta thấy 1 "chuỗi" luôn luôn có thể đc hình dung ra từ 1 object tree.

Điểm quan trọng nhất là tất cả handler classes đều đc implement cùng 1 interface. Mỗi handler riêng biệt nên chỉ nên quan tâm logic bên trong `execute` method, nhờ vậy ta có thể sáng tạo ra chuỗi trong runtime sử dụng 1 vài handlers mà ko tách rời code ra thành các classes riêng rẽ.

## Structure

[image]
  src: /img/oop/chain-of-responsibility.webp
  alt: Chain of responsibility structure diagram
  caption: Chain of responsibility structure diagram

1. **Handler** khởi tạo interface chung cho tất cả handlers riêng biệt.
2. **Base Handler** là 1 class tùy chọn mà tại đó ta có thể cho boilerplate code chung cho tất cả handler classes
3. **Concrete Handlers** chứa đựng các code với logic riêng dành cho 1 handler
4. **Client** có thể tạo ra các chain 1 cách hard-code hoặc tạo ra chúng dynamically, phục thuộc vào logic của application

Tham khảo thêm về **Chain of Responsibility** tại [https://refactoring.guru/design-patterns/chain-of-responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility "Chain of responsibility - Refactoring Guru")
