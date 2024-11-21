---
title: State
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-10-11
next_article:
  path: /oop/design-patterns/strategy
  title: Strategy
prev_article:
  path: /oop/design-patterns/observer
  title: Observer
---

# State

Đây là pattern cho phép 1 object sửa đổi trạng thái của nó khi state của nó thay đổi, trông giống như nó đổi class vậy.

## Problem

Cái concept của State pattern nó có mối liên quan gần gũi tới concept của [Finite-State Machine](https://en.wikipedia.org/wiki/Finite-state_machine "Finite-State Machine").

Ý tưởng chính là: tại 1 thời điểm bất kỳ, sẽ có 1 số lượng _hữu hạn_ các _states_ mà 1 chương trình có thể có. Chương trình sẽ thể hiện trạng thái khác nhau ở trong bất cứ state độc nhất nào, và nó có thể đc chuyển đồng thời từ 1 state này tới 1 state khác. Những quy luật chuyển đổi này được gọi là _transitions_ và chúng cũng hữu hạn và đc xác định trước.

Ta cũng có thể áp dụng cách tiếp cận này vào các objects. Tưởng tượng ta có 1 class `Document`. 1 document có thể ở 1 trong 3 `states` sau: `Draft`, `Moderation`, và `Published`. Method `publish()` của document sẽ hoạt động khác 1 chút ở mỗi `state`:

- Trong `Draft`, nó chuyển document tới nơi riêng cho moderation
- Trong `Moderation`, nó public document ra, nhưng với điều kiện chỉ khi user hiện tại mang quyền admin
- Trong `Published`, nó ko phải làm gì hết

State machines thường được implemented với rất nhiều cú pháp điều kiện (`if` hoặc `switch`) để lựa chọn trạng thái phù hợp dựa trên state hiện tại của obejct. Thông thường, cái "state" này chỉ là 1 set các giá trị trong các fields của object. Kể cả khi ta chưa bao giờ nghe đến thuật ngữ finite-state machine trước kia, ta kiểu gì cũng đã từng implemented kiểu state ít nhất 1 lần rồi, tựa tụa như này:

```ts
class Document {
  private state: string;

  // ...
  publish() {
    switch(state) {
      case "draft":
        state = "moderation";
        break;
      case "moderation":
        if (currentUser.role == "admin") {
            state = "published";
        }
        break;
      case "published":
        // Do nothing
        break;
    }
  }
}
```

Điểm yếu lớn nhất của 1 state machine dựa vào các cú pháp điều kiện sẽ tự bộc lộ khi ta thêm ngày càng nhiều states và trạng thái phụ thuộc states vào trong `Document` class. Hầu hết methods sẽ chứa đụng 1 lượng cú pháp điều kiện khổng lồ để lựa chọn trạng thái phù hợp với states, thành ra code sẽ trở lên rất khó để bảo trì.

Vấn đề này sẽ ngày càng tệ hơn theo chiều phát triển của project. Ở bước thiết kế, việc dự đoán tất cả states có thể xảy ra là 1 điều rất rất khó khăn, thế nên 1 state machine được xây dựng với 1 lượng điều kiện ít ỏi ban đầu có thể trở thành 1 đống hổ lốn qua thời gian.

## Solution

State pattern đề xuất rằng ta nên tạo các classes mới cho tất cả states có thể xảy ra với 1 object, và trích tất cả trạng thái mang tính chất như state vào các classes này.

Thay vì implement tất cả trạng thái vào bên trong bản thân, thì object khởi đầu, còn đc gọi là context, sẽ lưu 1 tham chiếu đến 1 trong các state objects mà thể hiện state hiện tại, và đưa tất cả các công việc liên quan tới state cho cái state object đó.

Để chuyển đổi context object sang state khác, ta thay thế active state object với 1 object khác thể hiện state mới. Và điểu này có thể đạt đc nhờ việc các state object follow theo 1 interface cùng với đó bản thân context object sẽ tương tác với các state object thông qua interface đó

```ts
interface State {
  name: string,
  render: () => string,
  publish: () => void,
}

class Draft implements State {
  private document: Document;
  private user: User;

  constructor(document: Document) {
    this.name = "Draft";
    this.user = User.find(cache["user_id"]);
    this.document = document;
  }

  render() {
    if (this.user.isAdmin() && this.user.isAuthor()) {
        // Render the document
    } else {
      throw new Error("The user does not have permission to perform draft");
    }
  }

  publish() {
    this.document.changeState(new Moderation(this.document));
  }
}

class Moderation implements State {
  private document;
  private user;

  constructor(document: Document) {
    this.name = "Moderation";
    this.user = User.find(cache["user_id"]);
    this.document = document;
  }

  render() {
    // Render the document
  }

  publish() {
    if (this.user.isAdmin()) {
      this.document.changeState(new Published(this.document));
    }
  }
}

class Published implements State {
  private document;
  private user;

  constructor(document: Document) {
    this.name = "Published";
    this.user = User.find(cache["user_id"]);
    this.document = document;
  }

  render() { /* Render the document */ }
  publish() { /* Do nothing */ }
}

class Document {
  private state: State;

  render() {
    return this.state.render();
  }

  changeState(state: State) {
    this.state = state;
  }
}
```

## Structure

[image]
  src: /img/oop/state.webp
  alt: State structure diagram
  caption: State structure diagram

1. **Context** lưu trữ 1 tham chiếu tới 1 trong các state objects riêng biệt. Context giao tiếp với các state objects thông qua state interface, và tạo 1 setter để cập nhật state object mới
2. **State** interface khai báo các methods cụ thể cho state. Những methods này cần phải dùng được cho tất cả states riêng biệt vì ta sẽ ko muốn states của ta có những methods vô dụng ko bao giờ đc gọi
3. **Concrete States** cung cấp implementations riêng cho các methods
4. Cả context và states có thể gán state tiếp theo của context và thực hiện chuyển đổi state bằng cách thay thế state obejct đang đc liên kết với context

---

Tham khảo thêm về `State` tại [https://refactoring.guru/design-patterns/state](https://refactoring.guru/design-patterns/state "State - Refactoring Guru")
