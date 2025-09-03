---
title: DSA | Fast & Slow Pointers
date: 2023-03-27
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Fast & Slow Pointers

Pattern này sử dụng 2 pointers với tốc độ khác nhau để duyệt các cấu trúc dữ liệu kiểu "iterable",
ví dụ như 1 vòng tuần hoàn trong linked list. Trong các dạng bài yêu cầu mình phải duyệt cycle của
linked list, array, etc... thì ta nên nghĩ tới pattern này đầu tiên.

Ở đây, ta sẽ được tiếp cận tới 1 cấu trúc dữ liệu mới, gọi là linked list.
Để ôn lại về linked list, anh em có thể qua [đây](/dsa/linked-list)

Nhìn chung, mấy cái pointer cần phải được đảm bảo điều kiện là 1 pointer nhanh và 1 pointer chậm, và
dễ thấy trong các problem phổ biến nhất là pointer fast sẽ nhanh gấp đôi pointer slow. Ta sẽ có cách
giải phổ biến nhất như sau:

```md
Initialize fast and slow pointers

For each iteration traversing the linked list/array,
  fast = fast->next->next or fast = array[fast[fast]]
  slow = slow->next or slow = array[slow]
  do something with the fast and slow
```

Snippet:

- Với linked list:

```py
fast, slow = head, head
while True:
  fast = fast.next.next
  slow = slow.next
  if fast is None or fast.next is None:
    break
```

- Với array:

```py
# Each node represents an index in the arr
# 2 node are connected together in the format arr[i], which means node i connects to node arr[i]
# arr[i] == -1 means node i connects to NULL
arr = [-1,3,2,6,2,5,4,-1]
fast, slow = 0, 0
while True:
  fast = arr[fast[fast]]
  slow = arr[slow]
  if fast != -1 or arr[fast] != -1:
    break
```

Follow up:
- 1 số problem ngoại lệ như **Check a happy number** không có các cấu trúc dữ liệu tiêu biểu nêu
trên nhưng vẫn được giải bằng fast & slow pointers. Thế nên là chủ yếu ta cần xác định xem liệu có
cycle nào ta cần phải duyệt theo đề bài không

  Ví dụ trong **Check a happy number**, happy number là số mà sau khi ta liên tiếp lấy tổng bình
  phương các chữ số của số đó để thay thế chính nó, ta đạt được kết quả bằng 1. Chẳng hạn:

```md
n = 12
1^2 + 2^2 = 5
5^2 = 25
2^2 + 5^2 = 29
2^2 + 9^2 = 85
8^2 + 5^2 = 89
8^2 + 9^2 = 145
1^2 + 4^2 + 5^2 = 42
4^2 + 2^2 = 20
2^2 + 0^2 = 4
4^2 = 16
1^2 + 6^2 = 37
3^2 + 7^2 = 58
5^2 + 8^2 = 89
=> n=12 is not a happy number
```

Dễ thấy ở trên ta tạo đươc 1 cycle tại số 89, nên fast & slow pointer sẽ giải được bài này.
