---
title: DSA | Stack
date: 2023-08-21
author: Xuan Khoa Tu Nguyen
unlisted: true
---

[image //cdn.programiz.com/sites/tutorial2program/files/stack.png]
    Stack illustration (credit: Programiz)

# Luận bàn về Stack

Stack là 1 cấu trúc dự liệu dạng thẳng tuân theo quy luật last in, first out (LIFO), có nghĩa là
phần tử được đưa vào stack mới nhất sẽ là phần tử đầu tiên đc đưa ra khỏi stack.

Để hình dung dễ dàng cách hoạt động của stack, ta có thể liên tưởng đến hình ảnh 1 chồng đĩa. Ta
luôn phải bỏ cái đĩa trên cùng (cái đĩa đc đưa vô mới nhất) ra khỏi chồng trước tiên.

Stack có các operation chính sau:
- **push:** operation đẩy phần tử vào trong 1 stack
- **pop:** operation lấy phần tử đứng đầu ra khỏi 1 stack và trả về phần tử đó
- **top/peek:** trả về phần tử đầu tiên trong stack
- **isFull:** Kiểm tra xem stack đầy tới giới hạn chưa
- **isEmpty:** Kiểm tra xem stack có rỗng ko

***Ví dụ***

[codetabs "C++ | Python | Java | JS/TS" languages="cpp | python | java | ts"]

    stack<T> st;

    ---

    stack = [] # Use list

    from collections import deque # Use collections.deque
    stack = deque()

    from queue import LifoQueue # Use queue module
    stack = LifoQueue()

    ---

    Stack<T> stack = new Stack<T>();

    ---

    const stack = [] // Use array

## Solving problems using stack

Thực ra cũng chẳng có cách giải nào đặc biệt khác cho stack ngoài việc nắm rõ các operations của nó
trong lòng bàn tay :>

Chủ yếu ta nên để ý xem yêu cầu đề bài phải xử lý 1 dãy data theo thứ tự như thế nào.

Nếu ta muốn lấy các phần tử ra khỏi container với thứ tự ngược lại với thứ tự khi ta thêm chúng,
thì stack sẽ đc dùng. Còn nếu ta cần giữ nguyên thứ tự lấy ra khỏi container với đẩy phần tử vô,
hay 1 đề bài ko cần quan trọng thứ tự xử lý các phần tử, thì ta sẽ ko thể dùng đc stack.

1 số câu hỏi mẫu, ae tham khảo:

- [Basic calculator](https://leetcode.com/problems/basic-calculator/)
- [Remove all adjacent duplicates in string](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)
- [Minimum remove to make valid parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses)
- [Exclusive execution time of functions](https://leetcode.com/problems/exclusive-time-of-functions/)
- [Flatten nested list iterator](https://leetcode.com/problems/flatten-nested-list-iterator)
- [Implement queue using stack](https://leetcode.com/problems/implement-queue-using-stacks)
- [Valid parentheses](https://leetcode.com/problems/valid-parentheses)
