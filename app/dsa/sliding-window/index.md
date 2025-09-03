---
title: DSA | Sliding Window
date: 2023-04-03
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Sliding Window

Pattern này sử dụng 2 pointers biểu diễn 1 khoảng liên tiếp trên 1 mảng 1 chiều hoặc 1 chuỗi, khoảng
này đúng như tên gọi của nó được gọi là window.

Nói theo 1 cách dễ hiểu hơn thì ae cứ tưởng tượng 1 cái cửa sổ trượt, với cái cửa sổ tượng trưng cho
cái khoảng liên tiếp và cái đế trượt của nó tượng trưng cho mảng/chuỗi cần xử lý. Anh em sẽ thường
áp dụng hướng giải này trong các dạng bài yêu cầu xử lý 1 đoạn liên tiếp trong array/string.

Nhìn chung, trong mỗi bài áp dụng pattern này, ta sẽ thường phải chú ý đảm bảo sự thay đổi vị trí
của cái window sao cho phù hợp với yêu cầu của đề bài. Ta có pseudocode mẫu như sau:

```md
Initialize start and end pointer at the starting index of the array/string

Repeat:
  When [end...start] (window) meets a condition
    Do something and slide the window (increment start)
  Increment end
```

Snippet:

```py
arr = [""" Some values """] or "string"
start, end = 0, 0
while slow < len(arr):
  doSomething()
  if qualifyCondition(end - start + 1):
    slideWindow()
  doSomething()
  end += 1
```

Follow up:
- Trong 1 số advanced problem, ta thường sẽ phải tính tới các giá trị ngoài lề liên quan tới các giá trị trong mảng, chẳng hạn như số lần xuất hiện của các giá trị. Khi đó, ta thường áp dụng thêm các cấu trúc dữ liệu khác nhau để hỗ trợ giải quyết.

  Phổ biến nhất hiện tại ta có thể tính tới hash table. Để ôn lại về hash table, mời ae qua
  [Luận bàn về Hash Table](/dsa/hash-table)
