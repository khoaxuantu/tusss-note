---
title: DSA | Two Pointers
date: 2023-03-23
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về 2 pointers

Cái pattern này sử dụng 2 pointers để duyệt mảng hoặc list. Nó rất hữu dụng mỗi khi ta cần xử lý các
indexes khác nhau trong cùng 1 iteration, nên bất cứ khi nào đọc đề bài ta thấy yêu cầu check 2 phần
tử khác nhau trong 1 hoặc nhiều mảng thì two pointers nên là thứ đầu tiên ta tính đến.

Cách giải sử dụng two pointers phổ biến nhất:

```md
Initialize start and end index placed at the start and the end of the array

For each iteration, do something with the array[start] and array[end], then depend on the
requirements, increment the start and decrement the end.
```

Snippet:

```py
array = ["""A list"""]
left_index = 0
right_index = len(array)-1

while(left_index < right_index):
  """Do something"""

  """Check the conditions to change start and end"""
  left_index += 1
  right_index -= 1
```

Follow up:
- 1 số problems khó ta sẽ cần sử dụng nhiều hơn 2 pointers nhưng cùng lắm thì 3 hoặc 4 thôi, 5 thì
quá đà vl.
- **Sliding window** và **Fast and slow pointer** cũng là phát triển từ **Two pointers** nhưng tụi
này đã đc tách ra thành 2 patterns riêng nên sẽ được bàn tới trong các note riêng.
