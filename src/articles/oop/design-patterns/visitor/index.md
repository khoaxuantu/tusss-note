---
title: Visitor
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2024-10-31
prev_article:
  path: /oop/design-patterns/template-method
  title: Template Method
---

# Visitor

Đây là pattern cho ta tách các thuật toán khỏi các objects vận hành chúng.

## Problem

Giả sử team ta phát triển 1 ứng dụng sử dụng thông tin địa lý như 1 cái graph khổng lồ. Mỗi node trong graph biểu thị cho 1 cụm như thành phố, khu công nghiệp, khu du lịch, etc... Mỗi kiểu node này sẽ được thể hiện trong từng class riêng, trong khi đó từng node cụ thể trong graph sẽ là 1 object. Các nodes được gọi là kết nối với nhau nếu giữa chúng có 1 con đường thông cả 2.

Vào 1 hôm nào đó, ta có 1 task yêu cầu implement tính năng xuất cái graph ra thành định dạng XML. Nghe qua thì có vẻ là 1 công việc khá "straight-forward". Ta lên kế hoạch thêm 1 export method vào mỗi node class rồi đệ quy duyệt hết từng node trong graph, gọi ra các export method trong đó. Trông có vẻ tín. Nhờ polymorphism, ta có thể tách biệt được các phương thức export của các class riêng biệt của các nodes ra.

Nhưng ko may, ông kỹ sư kiến trúc hệ thống của ta ko cho ta thay đổi những node classes hiện có. Lý do là bởi code đã lên production và ổng ko muốn mạo hiểm cho những thay đổi có nguy cơ gây bug này.

Bên cạnh đó, ổng còn hỏi ngược lại là liệu có cần thiết phải thêm những logic về trích xuất định dạng XML vào những node classes này? Công việc chính của chúng là tập trung vào các dữ liệu địa lý, chứ ko phải vào logic trích xuất XML. Ngoài ra, kiểu gì thì kiểu sau khi tính năng trên đc implemented xong, sẽ có 1 ai đó ra vỗ vai ta thêm tính năng tương tự với định dạng khác. Lúc đấy độ phức tạp trong code lại tăng theo, dần dần lên tới mức ko thể bảo trì đc nữa là chết.

## Solution

Visitor pattern đề xuất việc ta đặt tính năng mới vào 1 class riêng biệt đc gọi là _visitor_ thay vì cố lồng chúng vào trong class đã có. Object ban đầu mà phải thực hiện cả trạng thái mới đó giờ đây sẽ chỉ chuyền qua 1 trong các methods của visitor là đủ.

Giờ, nếu tính năng này có thể đc thực thi qua các objects của các classes khác nhau thì sẽ như thế nào? Ví dụ như trong trường hợp trích xuất XML của ta, các node classes hiển nhiên sẽ cần cách implementation khác nhau rồi. Vì vậy, class visitor có lẽ sẽ phải định nghĩa 1 loạt các methods, mỗi method lấy các loại arguments khác nhau như sau:

```ts
class ExportVisitor {
  doForCity(City c) { ... }
  doForIndustry(Industry f) { ... }
  doForSightSeeing(SightSeeing ss) { ... }
}
```

Nhưng thế thì ta nên gọi các methods đó như thế nào cho tiện? Những methods này rất khác nhau, ta ko thể áp dụng polymorphism đc. Mà muốn lấy từng method cho từng class, thì ta phải xác định class trước.

```ts
for (const node in graph) {
  if (node instanceof City) {
    exportVisitor.doForCity(node);
  } else if (node instanceof Industry) {
    exportVisitor.doForIndustry(node);
  } else if (node instanceof SightSeeing) {
    exportVisitor.doForSightSeeing(node);
  }
}
```

Trông cũng hơi khoai 🤔

Lại có 1 phương án khác nảy ra: Tại sao ta ko dùng method overloading? Đó là khi ta cho tất cả các methods về cùng 1 tên gọi, kể cả khi chúng yêu cầu bộ parameters khác nhau. Nhưng rõ ràng tính năng này ko phải ngôn ngữ nào cũng hỗ trợ, mà kể cả khi chúng hỗ trợ (như C# hay Java), thì cũng ko giúp ích đc mấy. Bởi vì ta đang ko biết được trực tiếp mỗi class cụ thể của từng node, cơ chế overloading này cũng ko thể xác định method đúng để thực thi. Khả năng cao nó sẽ gọi tới method default được implement trong base class hơn.

Well, những phương án trên xem ra ko hiểu quả, và đó là lý do Visitor xuất hiện. Nó sử dụng 1 kỹ thuật đc gọi là **Double Dispatch**, giúp thực thi method trong 1 object mà ko phải động tới việc kiểm tra điều kiện. Thay vì để cho client phải chọn đúng method để gọi, ta sẽ chuyển việc chọn đó cho các node objects thì sao?

Vì các objects biết class của chúng là gì, ta có thể giúp chúng chọn đc đúng method từ visitor:

```ts
class City {
  ...
  accept(Visitor v) {
    v.doForCity(this);
  }
}

class Industry {
  ...
  accept(Visitor v) {
    v.doForIndustry(this);
  }
}
```

Và ở client code, công việc sẽ trở nên đơn giản hơn nhiều:

```ts
for (const node in graph) {
  node.accept(ExportVisitor);
}
```

Từ đây, nếu ta có 1 interface chung cho tất cả visitors, tất cả nodes đang tồn tại sẽ có thể hoạt động với bất kỳ visitor nào mà ta muốn pass vô. Sau này mà ta cần tích hợp thêm những visitor mới, công việc sẽ chỉ còn gói gọn trong việc tạo 1 class visitor mới là xong ~

## Structure

[image]
  src: /img/oop/visitor.webp
  alt: Visitor structure diagram
  caption: Visitor structure diagram

1. **Visitor** interface khai báo 1 bộ các methods có thể nhận các thành phần của 1 object như là các arguments
2. Mỗi **Concrete Visitor** implements vài phiên bản của 1 tính năng, và gắn chức năng của chúng với các classes riêng biệt
3. **Element** interface khai báo 1 method để nhận các visitors. Method này cần có ít nhất 1 parameter đc khai báo bằng type của visitor interface
4. Mỗi **Concrete Element** phải implement method nhận visitors. Mục đích của method này để chuyển hướng method tương ứng của visitor.
5. **Client** thường là 1 bộ hoặc 1 vài objects phức tạp, như **Composite** tree. Thông thường, client ko phải bận tâm tới tất cả element classes riêng rẽ vì chúng hoạt động với các objects thông qua vài abstract interface là chính

---

Tham khảo thêm về `Visitor` tại [https://refactoring.guru/design-patterns/visitor](https://refactoring.guru/design-patterns/visitor "Visitor - Refactoring Guru")
