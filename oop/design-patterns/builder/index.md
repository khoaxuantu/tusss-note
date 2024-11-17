---
title: Builder
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-05-22
next_article:
  title: Prototype
  path: /oop/design-patterns/prototype
prev_article:
  title: Abstract Factory
  path: /oop/design-patterns/abstract-factory
---

# Builder

Đây là kiểu pattern cho phép ta cấu trúc nên 1 object theo từng bước, sản xuất ra sán phẩm có các kiểu và các đặc điểm khác nhau từ 1 cấu trúc code.

## Problem

Thử tưởng tượng 1 object vô cùng phức tạp cần khởi tạo rất nhiều fields và objects lồng tại constructor, đó hẳn sẽ là 1 đống code kinh khủng với hằng hà vô số các parameters.

Ví dụ, cách để tạo nên `House` object? Để xây 1 căn nhà đơn giản, ta cần xây 4 bức tường và 1 cái sàn, lắp đặt cửa ra vào, thêm vài cái cửa sổ, rồi đắp mái. Nhưng nếu ta muốn 1 căn to hơn, xịn hơn, nhiều tiện nghi hơn thì sao?

Cách dễ nhất thì ta sẽ `extend` cái base `House` class, tạo nên 1 set các subclasses mà cover hết các kiểu nhà ta muốn xây. Tuy nhiên, sau cùng ta sẽ có 1 lượng ko nhỏ các subclasses, tăng thêm nhiều độ phức tạp của code.

1 cách tiếp cận khác là tạo nên 1 cái constuctor khổng lồ bao gồm hết các options để xây nhà. Chẳng hạn

```ts
House(windows, doors, rooms, hasGarage, hasSwimPool, hasStatues, hasGarden, ...)
```

Cuối cùng vấn đề sẽ nảy sinh khi ta tạo các object mới bằng `new`, các constuctor calls sẽ vô cùng xấu, và nhiều parameter thì trở nên vô dụng

```ts
House1 = new House(4, 2, 4, true, null, null, null, ...)
House2 = new House(4, 2, 4, true, true, true, true, ...)
```

## Solution

Cái `Builder` pattern khuyến nghị ta đưa phần construction (not constructor) code trong classes vô các objects riêng biệt gọi là `builder` và các classes sẽ gọi object `builder` đó để thực hiện nhiệm vụ construction

Cái pattern sẽ tổ chức việc object construction thành 1 set các bước khác nhau (`buildWalls`, `buildDoor`, etc...). Để tạo nên 1 object, ta chỉ cần execute 1 chuỗi các bước cần thiết đó trong class builder mà ko cần phải gọi tất cả các bước ra.

Một số bước có thể yêu cầu cách implementation khác nhau khi ta cần build các kiểu dáng khác nhau của sản phẩm. Ví dụ tường của 1 căn cabin có thể xây bằng gỗ, nhưng tường của 1 tòa lâu đài đc xây bằng đá. Trong trường hợp này, ta cần tạo các builder classes khác nhau, implement 1 set các bước giống nhau, nhưng khác biệt về implementation. Rồi ta sẽ sử dụng builder class tương ứng với từng kiểu dáng.

### Director

Để ý trong trường hợp trên, ta sẽ cần phải gọi thủ công tới các construction steps. Nhưng nếu ta ko muốn phải gọi thủ công như vậy, muốn sắp xếp các bước phải "dynamic" hơn tý, ta có thể đưa builder vào 1 class riêng biêt gọi là `director`. Cái director class sẽ định nghĩa thứ tự để lựa chọn và execute các bước, còn các builders cung cấp các implementation cho các bước.

## Structure

![Builder Structure diagram](/img/oop/builder.webp)

1. Cái `Builder` interface khởi tạo các construction steps chung cần có cho tất cả các loại builders của sản phẩm
2. `Concrete Builder` cung cấp các implementations khác nhau của các construction steps. Concrete builder có thể sản xuất ra các sản phẩm mà ko follow theo interface chung
3. `Products` là objects kết quả. Products mà được tạo nên bởi các builders khác nhau sẽ ko phải phụ thuộc vào cùng 1 kiểu class hoặc interface
4. `Director` class định nghĩa nên thứ tự để gọi các construction steps, nên ta có thể tạo nên và tái sử dụng các configuration cụ thể cho các sản phẩm khác nhau.
5. `Client` cần phải cung cấp một trong các builder objects với director. Thông thường là chỉ cần cung cấp 1 lần qua parameters của director's constructor, rồi director sẽ dùng cái builder object đó cho tất cả việc cấu tạo sau này.

Ngoài ra, vẫn có 1 cách tiếp cận khác là khi client pass thẳng 1 builder object vào cái production method của director. Ở trường hợp này, ta có thể sử dụng thêm builder khác mỗi lần ta sản xuất thứ gì đó với director => 1 builder từ director's constructor, 1 builder từ production method parameter, hình dung ra code:

```ts
builder1 = new Builder1();
builder2 = new Builder2();
director = new Director(builder1);
director.make(builder2); // Thay vì pass type như dười ta pass thẳng 1 builder luôn
```

---

Tham khảo thêm về `Builder` tại [https://refactoring.guru/design-patterns/builder](https://refactoring.guru/design-patterns/builder "Builder - Refactoring Guru")
