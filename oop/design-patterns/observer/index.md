---
title: Observer
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-09-27
next_article:
  path: /oop/design-patterns/state
  title: State
prev_article:
  path: /oop/design-patterns/memento
  title: Memento
---

# Observer

Pattern này cho phép ta định nghĩa 1 cơ chế theo dõi nhằm giúp thông báo hàng loạt objects về 1 sự kiện xảy ra với object mà chúng đang theo dõi.

## Problem

Thử tưởng tượng ta có 2 loại objects: `Customer` và `Store`. Customer đang chú ý tới 1 brand đặc biệt cho sản phẩm họ muốn mua đang chuẩn bị đc ra mắt (1 con iPhone đời mới chắng hạn).

Customer có thể đi tới Store hàng ngày để check xem mẫu đó đã đc mở bán hay chưa. Nhưng trong khi mẫu sản phẩm đó vẫn đang trong quá trình vận chuyển, tất cả chuyến đi đó của customer đều là vô nghĩa.

Mặt khác, Store có thể spam hàng tấn emails tới tất cả customers mỗi khi 1 sản phẩm mới đc ra mắt, giúp customers tiết kiệm đc những chuyến đi lặp đi lặp lại vô ích. Nhưng cách này lại có thể gây khó chịu cho bất cứ ai ko quan tâm tới sản phẩm mới ra sao.

Từ 2 điều trên, có vẻ ta gặp 1 conflict: hoặc là customers tốn thời gian để check sản phẩm đc mở bán chưa, hoặc là store tốn công sức thông báo tới sai đối tượng khách hàng.

## Solution

Ta đã nghe nhiều về cơ chế subscription trong cả đống dịch vụ rồi, từ Spotify, Youtube Premium đến newsletters subscription via emails, tại đó người dùng đăng ký để nhận các thông báo và tiện ích (events) về dịch vụ thường xuyên, ta vẫn thường gọi là subcribers. Ngược lại, ai cung cấp các dịch vụ subscription này sẽ đc gọi là publisher

Observer pattern đề xuất ta thêm cơ chế subscription tương tự vào trong các classes đóng vai trò như publishers, nhờ đó các objects có thể subcribe hoặc unsubcribe khỏi luồng events tới từ publisher. Ẩn sâu bên trong cơ chế này hoạt động thực tế lại đơn giản hơn ta tưởng. Nó bao gồm:

1. 1 trường array để lưu 1 list các references tới subcriber objects
2. 1 vài public methods cho phép add subcribers hoặc remove chúng khỏi list

Giờ, bất cứ khi nào 1 event quan trọng xảy ra với publisher, nó sẽ đi 1 loạt các subcribers và gọi method thông báo lên các objects đó

Apps thực tế có thể sẽ có hàng tá các subcriber classes theo dõi các events xảy ra trong cùng 1 publisher class. Ta hẳn sẽ ko muốn gắn chặt publisher tới tất cả classes đó. Bên cạnh đó, ta thậm chí có thể ko biết về chúng nếu publisher class có vai trò đc sử dụng bởi ng khác

Vì thế điều quan trọng nhất là tất cả subcribers phải đc implement cùng 1 interface và publisher chỉ giao tiếp với chúng thông qua interface đó. Interface nên khai báo 1 method thông báo cùng với 1 set các parameters có ích để publisher pass data với thông báo

```ts
interface Subscriber {
  id: number;
  getNotified(): () => void;
}

class BasicSubscriber implements Subscriber {
  getNotified() {
    console.log("Basic subcriber has been notified!");
  }
}

class PremiumSubscriber implements Subscriber {
  getNotified() {
    console.log("Premium subcriber has bên notified with extra gifts!");
  }
}

class Publisher {
  private subcribers: Subscriber[];

  ...
  notifySubscribers() {
    this.subcribers.forEach(subcriber => {
      subcriber.getNotified();
    })
  }

  addSubscriber(opt: "Basic" | "Premium") {
    switch (opt) {
      case "Basic":
        this.subcribers.push(new BasicSubscriber());
        break;
      case "Premium":
        this.subcribers.push(new PremiumSubscriber());
        break
    }
  }

  removeSubscriber(id: number) {
    this.subcribers.forEach((subcriber, index) => {
      if (subcriber.id === id) {
        const tmp = this.subcribers.slice(-1);
        this.subcribers[this.subcribers.length-1] = this.subcribers[index];
        this.subcribers[index] = tmp;
        this.subcribers.pop();
        break;
      }
    })
  }
}
```

Nếu app của ta có vài loại publishers và ta muốn subcribers tương thích với tất cả chúng, ta có thế nâng 1 mức lên tất cả publishers dùng chung 1 interface. Cái interface này sẽ chỉ cần mô tả vài subscription methods, và cho phép subcribers theo dõi states của publisher mà ko gắn chúng với các classes riêng biệt.

## Structure

[image]
  src: /img/oop/observer.webp
  alt: Observer structure diagram
  caption: Observer structure diagram

1. **Publisher** thông báo cho các objects theo dõi về các events đã xảy ra với nó. Publishers chứa đựng cấu trúc subscription cho phép subcribers mới gia nhập và subcribers rời khỏi list
2. Khi 1 event mới xuất hiện, publisher duyệt qua 1 lượt subscription list và gọi tới method `notify()` đc khai báo trong subscriber interface
3. **Subscriber** interface khai báo các các methods và fields cần thiết cho việc thông báo.
4. **Concrete Subscribers** thực hiện 1 số actions phản hồi lại các thông báo đc gửi bởi publisher. Tất cả classes này phải đc implement cùng 1 interface để publisher có thể tương tác với tất cả chúng
5. Thông thường, các subcribers cần 1 số data để xử lý update 1 cách đúng đắn nhất. Chính vì thế, publishers thường pass data như các arguments của method thông báo. Thậm chí chúng có thể pass cả bản thân vào method, giúp cho subcriber quét trực tiếp các data yêu cầu
6. **Client** tạo các publisher và subcriber objects riêng biệt nhau, rồi đăng ký các subcribers vào trong publisher

---

Tìm hiểu thêm về `Observer` tại [https://refactoring.guru/design-patterns/observer](https://refactoring.guru/design-patterns/observer "https://refactoring.guru/design-patterns/observer")
