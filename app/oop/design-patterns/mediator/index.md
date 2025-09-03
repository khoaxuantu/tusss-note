---
title: Mediator
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-09-14
next_article:
  path: /oop/design-patterns/memento
  title: Memento
prev_article:
  path: /oop/design-patterns/iterator
  title: Iterator
---

# Mediator

Đây là pattern cho ta giảm sự hỗn loạn của việc phụ thuộc lẫn nhau giữa các objects. Pattern hạn chế việc object này giao tiếp trực tiếp với object kia, buộc chúng chỉ được hợp tác với nhau thông qua 1 object trung gian - mediator object.

## Problem

Giả sử ta có 1 dialog để tạo và chỉnh sửa user profile. Nó bao gồm nhiều form controls như text fields, checkboxes, buttons, etc...

1 số trong các form elements có thể tương tác với các form elements khác. Ví dụ, chọn "I have a dog" checkbox có thể hiển thị thêm 1 textfield bên cạnh để điền tên cho con chó, hoặc submit button phải validate các values của tất cả các fields trước khi lưu dữ liệu.

Với việc có rất nhiều logic đc implement trực tiếp trong code của các form elements, ta đã làm cho những classes của đống elements đó trở nên khó tái sử dụng. Ta sẽ chỉ có thể hoặc là cho tất cả các classes render lên profile form, hoặc là ko class nào đc render hết.

## Solution

Mediator pattern đề xuất rằng ta nên chấm dứt ngay các giao thức trực tiếp giữa các components mà ta đang muốn chúng độc lập với nhau. Thay vào đó, những components này phải hợp tác vs nhau 1 cách gián tiếp thông qua việc gọi 1 mediator object đặc biệt để chuyển hướng request tới components thích hợp. Kết quả là: các components chỉ còn phụ thuộc vào đúng 1 mediator class thay vì liên kết chồng chéo vs các components khác.

Trong ví dụ của ta, bản thân dialog class có thể hoạt động như 1 mediator. Dialog class này gần như liên hệ đc tới tất cả sub-elements của nó, nên ta sẽ ko cần phải thêm dependencies gì vô nó nữa.

Sự thay đổi lớn nhất đến từ các form elements. Hãy thử xem submit button phát. Trc đó, mỗi lần 1 user click vào cái button, nó phải validate các values trong tất cả form elements. Giờ công việc duy nhất của nó sẽ là thông báo tới dialog về cú click. Trên việc nhận đc thông báo, cái dialog sẽ thực hiện việc validation hoặc chuyển giao việc này tới các elements đơn. Nhờ đó, thay vì bị trói chặt với hàng tá các form elements, button giờ sẽ chỉ phục thuộc duy nhất vào dialog class.

Ta có thể phát triển thêm làm cho sự phụ thuộc bị nới lỏng hơn nữa bằng cách tạo 1 interface chung cho các lợi dialogs. Cái interface sẽ khai báo method thông báo sao cho tất cả form elements có thể sử dụng đc nó để báo cho cái dialog về các events xảy ra với những elements đó. Vì thế, cái submit button của ta giờ có thể hoạt động với bất kỳ dialog nào có implement cái interface đó.

Ví dụ thực tế lớn nhất của mediator này chính là trong phát triển web. Ta thường hay bắt gặp các mô hình MVC, MVP, MVVM, etc... mà trong đó đều có các controller objects đóng vai trò là mediators, thực hiện nhiệm vụ điều khiển các actions của trang web, giúp cho việc quản lý các actions 1 cách dễ dàng.

```ts
type AuthenticationType = "login" | "register";

// Class name as BaseForm is better, but I use Mediator here for better understanding the pattern
abstract class Mediator {
  protected username: Textbox;
  protected password: Textbox;
  protected rememberMe: Checkbox;
  protected cancelBtn: CancelButton;
  protected okBtn: LoginButton | RegistrationButton;
  protected title: string = "A Dialog";

  constructor(purpose: AuthenticationType) {
    this.username = new Textbox(this);
    this.password = new Textbox(this);
    this.rememberMe = new Checkbox(this);
    this.cancelBtn = new CancelButton(this);
    this.selectSubmitButton(purpose);
  }

  notify(event: string): void {
    switch (event) {
      case "Validate":
        this.validateForm();
        break;
      case "Close":
        this.close();
        break;
      default:
        throw new Error("Invalid event!");
    }
  }

  protected validateForm(): Object {
    let result = {
      result: "Success",
      message: "",
    }

    this.password.validate(result);
    this.username.validate(result);

    return result;
  }

  protected close(): void {}

  private selectSubmitButton(purpose: AuthenticationType) {
    switch (purpose) {
      case "login":
        this.okBtn = new LoginButton(this);
        this.title = "Log In";
        break;
      case "register":
        this.okBtn = new RegistrationButton(this);
        this.title = "Register";
        break;
    }
  }
}

class FormComponent {
    protected dialog: Mediator;

    constructor(dialog: Mediator) {
        this.dialog = dialog;
    }

    click() {}
    validate(response: Object) {}
}

class FormButton extends FormComponent {
  constructor(dialog: Mediator) {
    super(dialog);
  }
}

class LoginButton extends FormButton {
  constructor(dialog: Mediator) {
    super(dialog);
  }

  override click() {
    this.dialog.notify("Validate");
  }
}

class RegistrationButton extends FormButton {
  constructor(dialog: Mediator) {
    super(dialog);
  }

  override click() {
    this.dialog.notify("Validate");
  }
}

class CancelButton extends FormButton {
  constructor(dialog: Mediator) {
    super(dialog);
  }

  override click() {
    this.dialog.notify("Cancel");
  }
}

class Textbox extends FormComponent {
  constructor(dialog: Mediator) {
    super(dialog);
  }

  override validate(response: Object) {}
}

class Checkbox extends FormComponent {
  constructor(dialog: Mediator) {
    super(dialog);
  }

  override validate(response: Object) {}
}

class LoginForm extends Mediator {
  constructor() {
    super("login");
  }
}

class RegistrationForm extends Mediator {
  private email: Textbox;

  constructor() {
    super("register");
    this.email = new Textbox(this);
  }

  protected validate(): Object {
    let result = super.validateForm();
    this.email.validate(result);
    return result;
  }
}
```

## Structure

[image]
  src: /img/oop/mediator.webp
  alt: Mediator structure diagram
  caption: Mediator structure diagram

1. **Components** là những classes chứa đựng những business logic. Mỗi component ánh xạ tới cái mediator, được khai báo với kiểu của mediator interface. Component ko cần phải biết class thực sự của mediator, nên ta có thể tái sử dụng các component trong các chương trình khác bằng cách liên kết trường của nó tới mediator khác
2. **Mediator** interface khai báo các phương thức giao tiếp với các components, thông thường sẽ là 1 method thông báo. Các components có thể pass bất kỳ nội dung nào như những arguments của method này, bao gồm chính object của chúng, khi và chỉ khi cách đó ko khiến component nhận và component gửi có thêm liên hệ với nhau
3. **Concrete Mediators** che đi những mỗi liên hệ giữa các components. Các mediators riêng biệt này thường giữ tham chiếu tới tất cả components mà chúng quản lý và thỉnh thoảng là cả vòng đời của nó
4. Các components ko nên quan tâm về các components khác. Nếu 1 cái event gì đó quan trọng xảy ra vs chúng, chúng cần phải báo một mình mediator duy nhất. Khi cái mediator nhận đc thông báo, nó nên có khả năng xác định đc component đã gửi để có thể quyết định component nào đc kích hoạt để tạo ra phản hồi

_(Trong ví dụ trên tôi ko để tính năng nhận biết components trong `notify()` method vì ko cần thiết ~lười~, nhưng nếu như 2 form trên yêu cầu việc validate mỗi khi nhập xong 1 field cho form, thì nhận biết components sẽ rất hữu ích cho con mediator)_

---

Tham khảo thêm về `Mediator` tại [https://refactoring.guru/design-patterns/mediator](https://refactoring.guru/design-patterns/mediator "Mediator - Refactoring Guru")
