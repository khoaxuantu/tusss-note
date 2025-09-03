---
title: Proxy
tags:
  - OOP
  - DesignPattern
id:
date: 2023-08-09
unlisted: true
next_article:
  path: /oop/design-patterns/chain-of-responsibility
  title: Chain of Responsibility
prev_article:
  path: /oop/design-patterns/flyweight
  title: Flyweight
---

# Proxy

Đây là pattern giúp ta cung cấp 1 substitute hoặc placeholder cho 1 object khác. 1 proxy điều khiển tất cả hoạt động truy cập tới cái object gốc, cho phép ta biểu diễn 1 cái gì đó trước hoặc sau khi request đi qua object gốc này.

## Problem

Tại sao ta lại muốn điều khiển truy cập tới 1 object? Đây là 1 ví dụ: ta có 1 object khổng lồ đang tiêu thụ 1 lượng lớn tài nguyên hệ thống. Ta có thể cần tới nó lần này qua lần khác, nhưng ko phải luôn luôn cần đến thế.

Ta có thể implement 1 cách khởi tạo khá là lười biếng: tạo 1 object khi mà nó thật sự cần dùng đến. Tất cả các clients của object cần khai triển đoạn code khởi tạo đang đc trì hoãn. Nhưng thật ko may, việc này có thể sẽ tạo ra rất nhiều code lặp lại.

Trong môi trường lý tưởng, ta muốn cho đoạn code này trực tiếp vào trong class của object, nhưng cách đó ko khả thi trong mọi trường hợp. Chẳng hạn, cái class nằm trong 1 3rd-party library thì sao?

## Solution

Proxy pattern khuyên ta tao 1 class proxy mới với interface giống với service object gốc. Rồi ta cập nhât con app sao cho nó thông qua cái proxy object tới tất cả clients của object gốc. Từ việc nhận request từ client, proxy tạo 1 service obejct và chuyển tất cả phần việc cho nó.

Lợi ích ở đây là gì? Nếu ta cần khai triển cái gì đó trước hoặc sau logic chính của class, proxy sẽ cho phép ta thực hiện mà ko phải thay đổi class đó. Bởi vì proxy cũng đc implement cùng 1 interface với class gốc, nó có thể đc passed tới bất kỳ client nào như 1 service object thật sự.

```ts
interface IService {
  operation: () => void
}

class BackupService implements IService {
  operation() {
    console.log("Perform backup service");
  }
}

class ItemFlowService implements IService {
  operation() {
    console.log("Perform item flow service");
  }
}

class Proxy implements IService {
  private realService: IService;

  constructor(s: IService) {
    this.realService = s;
  }

  checkAccess() {
    console.log("Check access");
    return validAccess();
  }

  operation() {
    if (this.checkAccess()) this.realService.operation();
  }
}
```

## Structure

[image]
  src: /img/oop/proxy.webp
  alt: Proxy structure diagram
  caption: Proxy structure diagram

1. **Service Interface** khởi tạo interface cho các Services. Proxy phải follow theo cái interface này để có thể "cải trang" bản thân như 1 service object
2. **Service** là 1 class cung cấp các business logic hữu dụng
3. **Proxy** class có reference field chỉ tới service object. Sau khi proxy hoàn thành tiến trình của nó (e.g., lazy initialization, logging, access controll, caching, etc...), nó chuyển request tới cái service object. Thông thường, các proxies quản lý toàn bộ vòng đời của các service objects
4. **Client** nên làm việc với cả services lẫn proxies thông qua 1 interface. Nhờ vậy ta có thể pass cái proxy vào trong bất kỳ đoạn code nào như 1 service object

---

Tham khảo thêm về proxy tại [https://refactoring.guru/design-patterns/proxy](https://refactoring.guru/design-patterns/proxy "Proxy - Refactoring Guru")
