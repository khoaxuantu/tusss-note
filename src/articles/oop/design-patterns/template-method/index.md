---
title: Template Method
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-10-25
next_article:
  path: /oop/design-patterns/visitor
  title: Visitor
prev_article:
  path: /oop/design-patterns/strategy
  title: Strategy
---

# Template Method

## Problem

Thử tưởng tượng ta đang tạo 1 app data mining để phân tích các tài liệu của doanh nghiệp. Người dùng cung cấp cho app các tài liệu ở đa dạng format (PDF, DOC, CSV) và nó sẽ trích ra các dữ liệu có ích trong 1 format chung.

Version đầu của app chỉ có thể hoạt động với file DOC. Trong phiên bản sau, nó đã có thể hoạt động với file CSV. 1 tháng sau, ta "dạy" nó trích dữ liệu từ file PDF.

[image]
  src: /img/oop/template-method-1.webp
  alt: Data mining problem
  caption: "Data mining problem (Source: Refactoring Guru)"

Cùng lúc đó, ta để ý thấy cả 3 classes trên có rất nhiều đoạn code trùng lặp nhau. Trong khi đoạn code để xử lý các file có đều khác nhau theo format, thì code để xử lý phân tích lại giống hệt nhau.

1 vấn đề khác liên quan tới client code sử dụng những classes này. Nó có rất nhiều điều kiện để lựa chọn hành động đúng đắn dựa vào loại class của object đang xử lý. Nếu cả 3 classes xử lý có chung 1 interface hoặc 1 base clase, ta sẽ có thể loại trừ những điều kiện phải sử dụng ở client code ra.

## Solution

Template Method pattern đề xuất ta tách 1 thuật toán ra thành 1 chuỗi các bước, biến những bước này thành method, và đưa 1 chuỗi các calls tới các methods đó vào trong 1 _template method_. Những methods này có thể mang tính `abstract`, hoặc có thể có 1 số implementation mặc định. Để sử dụng thuật toán, client sẽ phải cung cấp class con của bản thân họ, implement các steps bị abstract, và ghi đè 1 số methods nếu cần (ngoại trừ template method ra).

Để áp vào ví dụ data mining app của ta thì nó sẽ ntn? Ta có thể tạo 1 base class cho cả 3 thuật toán. Cái class này định nghĩa 1 template method bao gồm 1 chuỗi các calls tới các loại steps xử lý tài liệu.

Trước tiên, ta có thể khai báo tất cả các steps, buộc các class con phải tự implement các methods đó. Trong ví dụ của ta, các class đều đã có tất cả implementations cần thiết, nên việc duy nhất ta cần làm sẽ là điều chỉnh các methods sao cho chúng khớp được với các methods của class cha.

[image]
  src: /img/oop/template-method-2.webp
  alt: Data mining with template method diagram
  caption: "Data mining with template method diagram (Source: Refactoring Guru)"

Giờ đến đống code bị lặp. Xem qua thì ta có thể loại ra các method đóng/mở files và extracting/parsing data vì mỗi format sẽ cần logic khác nhau. Nhưng ở những steps khác như logic phân tích dữ liệu thô và tổng hợp báo cáo thì code lại rất giống nhau.

Vậy thì chúng có thể đc đặt trên base class và chia sẻ cho các class con ở dưới Vậy là ta đúc rút ra đc 2 loại của steps:

- _abstract steps_: những steps cần được implemented ở các classes con
- _optional steps_: những steps đã có implementation mặc định, nhưng vẫn có thể bị ghi đè ở class con nếu cần thiết

```ts
abstract class DataMiner {
  void mine(path: string) {
    const file = this.openFile(path);
    const rawData = this.extractData(file);
    const data = this.parseData(rawData);
    const analysis = this.analyzeData(data);
    this.sendReport(analysis);
    this.closeFile(file);
  }

  File openFile(path: string) {
    throw new Error('openFile needs to be implemented');
  }

  DataRaw extractData(file: File) {
    throw new Error('extractData needs to be implemented');
  }

  DataFrame parseData(dataraw: DataRaw) {
    throw new Error('parseData needs to be implemented');
  }

  DataAnalyzed analyzeData(data: DataFrame) {
    /* Return an object of meaningful data */
  }

  void sendReport(analysis: DataAnalyzed) {
    /* Send the report to an API */
  }

  void closeFile(file: File) {
    throw new Error('closeFile needs to be implemented');
  }
}

/**
 * Override steps only for PDF format
*/
class PDFDataMiner extends DataMiner {
    ...
}

/**
 * Override steps onlyu for CSV format
*/
class CSVDataMiner extends DataMiner {
    ...
}

/**
 * Override steps only for DOC format
*/
class DocDataMiner extends DataMiner {
    ...
}
```

## Structure

[image]
  src: /img/oop/template-method.webp
  alt: Template method structure diagram
  caption: Template method structure diagram

1. **Abstract Class** khai báo các methods hoạt động như các bước của 1 thuật toán, cũng như 1 template method để gọi tất cả methods còn lại theo 1 trình tự cụ thể.
2. **Concrete Classes** có thể override tất cả có bước để phù hợp với thuật toán nó sử dụng

---

Tham khảo thêm về **Template Method** tại [https://refactoring.guru/design-patterns/template-method](https://refactoring.guru/design-patterns/template-method "Template Method - Refactoring Guru")
