---
title: Command
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-08-30
next_article:
  path: /oop/design-patterns/iterator
  title: Iterator
prev_article:
  path: /oop/design-patterns/chain-of-responsibility
  title: Chain of Responsibility
---

# Command

Đây là pattern biến 1 request thành 1 stand-alone object chứa đựng tất cả thông tin về request đó. Sự biến đổi này cho phép ta pass các requests như 1 method arguments, delay hoặc xếp các bước execution vào 1 queue, và hỗ trợ các operations ko thể undo đc

## Problem

Tưởng tượng ta đang viết 1 app text editor. Task hiện tại là tạo 1 toolbar với 1 đống nút cho các operations đa dạng của editor. Ta tạo 1 class `Button` siêu thô để sử dụng cho các buttons của toolbar, cũng như cho các generic buttons ở các dialogs khác.

Trong khi tất cả các buttons đó trông giống nhau, chúng đều hỗ trợ các thứ khác nhau. Vậy thì ta cần phải để đống code để handler những buttons này ở đâu? Giải pháp đơn giản nhất là tạo hàng tấn subclasses cho mỗi nơi mà có button đc sử dụng.

Dần dần thì ta nhận ra cách tiếp cận này khá là á đù:

- Ta sẽ có 1 số lượng subclasses khổng lồ, cái GUI code của ta sẽ trở nên phụ thuộc 1 cách hỗn loạn với các đoạn code cho business logic
- 1 số operations như copy/paste text, sẽ cần đc gọi tới rất nhiều nơi. Ng dùng có thể click copy ở toolbar, hoặc đơn giản tổ hợp `Ctrl+C`. Mới đầu, ta chỉ implement tới `CopyButton` class cho toolbar, chỉ thế thôi thì đơn giản. Nhưng rồi, ta implement context menus, shortcuts, rồi cả tá thứ khác, và ta phải hoặc là duplicate đoạn code copy trong rất nhiều classes khác nhau, hoặc là làm mấy màn menus phải phục thuộc vào những buttons đang có, cách này thậm chí còn tệ hơn 😑

## Solution

1 software đc design tốt thường dựa trên _principle of separation of concerns_ và từ đó bóc tách 1 cái app thành các layers. Ví dụ điển hình nhất có thể kể đến: 1 layer cho GUI và 1 layer khác cho business logic. GUI layer chịu trách nhiệm cho việc render ra 1 giao diện thật đẹp trên màn hình, "nghe" từng input 1 và hiện thị lại kết quả từ input. Khi nó động tới những tiến trình quan trọng, như là xuất bản ra báo cáo hằng năm,... cái GUI layer sẽ chuyển giao công việc lại cho layer dưới chuyên xử lý business logic.

Trong đoạn code flow nó trông như thế này: 1 GUI object gọi 1 method của 1 business logic object, pass vào đó 1 số arguments. Quá trình này thường đc miêu tả như là 1 object gửi 1 _request_ tới object khác.

Command pattern đề xuất các GUI objects ko nên gửi các requests 1 cách trực tiếp. Thay vào đó, ta nên trích tất cả chỉ tiết của request, tên của method và list các arguments thành 1 _command_ class riêng với đúng 1 method để kích hoạt cái request.

Các command objects đóng vai trò như 1 các liên kết giữa GUI và business logic objects. Từ giờ, GUI object ko cần phải biết business logic nào sẽ nhận request và các chúng thực thi như nào nữa. GUI object chỉ cần trigger command, còn lại mọi thứ chi tiết command sẽ lo.

Bước tiếp theo là làm 1 interface cho các commands. Thông thường chúng chỉ có đúng 1 execution method ko nhận parameters nào. Cái interface này cho phép ta sử dụng đa dạng commands cho cùng 1 object gửi request mà ko phải tách chúng thành các classes riêng biệt. Thêm vào đó, giờ ta có thể chuyển đổi các command objects đã được liên kết tới object gửi với nhau, giúp cho thay đổi trạng thái của object gửi 1 cách hiệu quả.

> Về request parameters thì sao?

1 GUI object có thể đã cung cấp cho business layer vài parameters. Nhưng vì execution method ko có nhận bất kỳ arguments nào, ta sẽ phải làm thế nào để có thể đưa chi tiết của request tới business object? Cái command nên được config từ trước những data đó, hoặc là có khả năng tự lấy data đó ko cần trông đợi vào object gửi.

Quay lại text editor của ta. Sau khi ta áp dụng Command pattern, ta ko còn cần tất cả đống button subclasses đó nữa. Chỉ 1 field trong `Button` class là đủ để lưu trữ reference tới command object và khiến cho button thực thi command trong 1 cú click.

Ta sẽ implement 1 nhóm các command classes cho mỗi nhóm operation và liên kết chúng tới các buttons đặc biệt, dựa vào trạng thái mà buttons hướng tới.

Các GUI elements khác, như là menus, shortcuts hoặc toàn bộ dialogs, có thể đc implemented với cách giống như trên. Chúng sẽ đc liên kết tới 1 command mà sẽ đc thực thi khi ng dùng tương tác với GUI elements. Nhờ đó giúp tránh đc các đoạn code bị lặp lại.

Kết quả là, commands đã trở thành 1 layer nằm giữa vô cùng thuận tiện giúp giảm sự tách biệt giữa GUI và business logic layers

```ts
interface Command {
  execute: () => void;
}

class SaveCommand implements Command {
  execute() {
    doSave();
  }
}

class OpenCommand implements Command {
  execute() {
    doOpen();
  }
}

class PrintCommand implements Command {
  execute() {
    doPrint();
  }
}

class ToolbarButton {
  private command: Command;

  constructor() {}

  setCommand(command: Command) {
    this.command = command;
  }

  listen() {
    if (interactionCaptured()) this.command.execute();
  }
}
```

## Structure

[image]
  src: /img/oop/command.webp
  alt: Command structure diagram
  caption: Command structure diagram

1. **Sender** class (aka _invoker_) chịu trách nhiệm cho khởi tạo request. Class phải có 1 trường để lưu trữ reference tới 1 command object
2. **Command** interface thường đc khởi tạo với 1 method cho việc thực thi command
3. **Concrete Commands** implements cách thực thi tới đa dạng các loại requests
4. **Receiver** class bao gồm những business logic. Hầu hết commands chỉ xử lý việc pass 1 request tới đúng receiver, còn lại những công đoạn chính sẽ do receiver đảm nhiệm
5. **Client** tạo và config các command objects. Client phải pass tất cả request parameters, bao gồm receiver instance, vào trong constructor của command. Sau đó, command sẽ có thể đc associated với 1 hoặc nhiều senders

---

Tham khảo thêm về **Command** tại [https://refactoring.guru/design-patterns/command](https://refactoring.guru/design-patterns/command "Command - Refactoring Guru")
