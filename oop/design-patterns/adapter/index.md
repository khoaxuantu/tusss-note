---
title: Adapter
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-06-13
next_article:
  path: /oop/design-patterns/bridge
  title: Bridge
prev_article:
  path: /oop/design-patterns/singleton
  title: Singleton
---

# Adapter

Đây là kiểu pattern cho phép các objects với các interfaces ko tương thích nhau có thể cộng tác với nhau.

## Problem

Tưởng tượng ta đang phát triển 1 app thị trường chứng khoán. Cái app này tải về dữ liệu chứng khoán từ nhiều nguồn khác nhau dưới định dạng XML để xử lý và hiển thị cho người dùng.

Sau đó, ta quyết định cải tiến app bằng cách tích hợp 1 3rd-party library chuyên để phân tích dữ liệu. Nhưng vấn đề mới lại nảy sinh: cái library này lại chỉ hoạt động với các dự liệu định dạng JSON, vậy là trước mắt cái libary đang ko tương thích với app của ta bởi sự xung khắc định dạng dữ liệu.

Ta có thể đổi code của library để nó hoạt động đc với XML, nhưng như thế có thể làm hỏng 1 số code có sẵn đang dựa vào library đó. Mà thực ra ta còn chưa chắc đc sờ tới source code của library để tiến hành chỉnh sửa 😄 Như vậy, ta cần tìm 1 giải pháp tối ưu hơn...

## Solution

Quay lại với ví dụ về app chứng khoán trên. Để giải quyết vấn đề về format ko tương thích, ta có thể tạo XML-to-JSON adapter cho mỗi class của cái 3rd-party library. Rồi ta cho code của app liên lạc với cái library thông qua cái adapter này. Khi adapter nhận 1 call, nó sẽ dịch dữ liệu XML đc chuyển tới thành cấu trúc JSON và pass cái call tới method phù hợp của library object

[image]
  src: /img/oop/adapter-2.webp
  alt: Adapter solution (by refactoring.guru)
  caption: Adapter solution (by Refactoring Guru)

```ts
class AnalyticsLibrary {
  chartAnalyze(data: JSON) {
    return chart(data);
  }
}

abstract class CoreClasses {
  drawChart(data: XML) {}
}

class XmlToJsonAdapter extends CoreClasses {
  private adaptee: AnalyticsLibrary;

  constructor() {
    super();
    this.adaptee = new AnalyticsLibrary();
  }

  private convertToJSON(data: XML): JSON {
    /* Convert to JSON format */
  }

  public override drawChart(data: XML) {
    let jsonData = this.convertToJSON(data);
    return adaptee.chartAnalyze(jsonData);
  }
}

// Somewhere in client code
const apiKey = "abcxyz";
const dataProvider = new StockDataProvider(apiKey);
const xmlData = dataProvider.getData();

// We assign an adapter instead of a new CoreClasses to draw a chart
const adapter: CoreClasses = new XmlToJsonAdapter();
const chart = adapter.drawChart(xmlData);
render(chart);
```

## Structure

Có 2 loại structure cho adapter:

- Object adapter
- Class adapter

### Object adapter

Ở đây việc implementation sử dụng nguyên lý của object composition: cái adapter implments cái interface của 1 object và wrap 1 object khác vào trong 1 field của nó. Cách này có thể implement ở hầu hết các nnlt oop phổ biến

[image]
  src: /img/oop/adapter.webp
  alt: Object adapter structure diagram
  caption: Object adapter structure diagram

1. **Client** là 1 class chứa các business logic của 1 chương trình
2. **Client interface** mô tả 1 protocol mà các classes khác phải follow theo để có thể tương tác với client code
3. **Service** là 1 số class hữu dụng (thường là 3rd-party library hoặc legacy). Client đang ko thể dụng những class này trực tiếp vì interface ko tương thích
4. **Adapter** là class có thể hoạt động với cả client lẫn code của bên thứ 3: nó implements cái client interface, cùng với đó wrap cái service object lại. Cái adapter nhận các calls từ client thông qua adapter interface và dịch chúng thành các calls tới cái service object mà cái adapter đã wrap lại với forrmat mà cái object đó có thể hiểu.
5. Cái client code ko liên quan tới adapter cho đến nó hoạt động với adapter thông qua client interface. Nhờ cơ chế này, ta có thể giới thiệu các loại adapters tới chương trình mà ko lo sẽ làm hỏng client code đang tồn tại. Nó có thể hữu dụng khi interface của service class được thay đổi hoặc thay thế: ta sẽ chỉ cần tạo 1 adapter class mới mà ko phải thay đổi client code tương ứng

### Class adapter

Cách này thì sử dụng tính kế thừa: adapter kế thừa các interfaces từ cả 2 object client và service cùng 1 lúc. Lưu ý rằng chỉ những nnlt hỗ trợ đa kế thừa (như C++, C#, etc...) mới có thể implement theo cách này

[image]
  src: /img/oop/adapter-1.webp
  alt: Object adapter structure diagram
  caption: Object adapter structure diagram

**Class adapter** ko cần phải wrap bất kỳ objects nào vì chúng kế thừa các thuộc tính từ cả client lẫn service. Việc adaptation sẽ diễn ra bên trọng các method đc override

---

Tham khảo thêm về **Adapter** tại:
[https://refactoring.guru/design-patterns/adapter](https://refactoring.guru/design-patterns/adapter "https://refactoring.guru/design-patterns/adapter")
