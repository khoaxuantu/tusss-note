---
title: DSA | Linked List
date: 2023-03-27
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Linked List

**Linked list** là 1 cấu trúc dữ liệu bao gồm các node được kết nối với nhau tạo nên trục thẳng
(mỗi node connect với 1 thằng đi vào và 1 thằng đi ra).

## Singly linked list

[image //cdn.programiz.com/sites/tutorial2program/files/linked-list-concept.png]
  Linked list illustration (Credit: Programiz)

Mỗi node ở đây ta thấy chứa 1 block data và 1 block next

- Block data sẽ chứa mọi dữ liệu mà ta cần dùng
- Block next sẽ chứa địa chỉ trỏ tới block tiếp theo. Đây chính là block tạo nên kết nối giữa các
node với nhau.

***Ví dụ***

[codetabs "C | C++ | Python" languages="c | cpp | python"]

  struct Node {
      int data;
      struct Node *next;
  };

  ---
  class Node {
  public:
      Data* data; // from a Data class
      Node* next;
      Node(Data* data) : data(data), next(nullptr) {}
  };

  ---
  class Node:
      def __init__(data):
          self.data = data
          self.next = None

Để tạo 1 linked list, bước đâu tiên là ta tạo 1 head node để khởi đầu trước

```python
class LinkedList:
  def __init__():
    self.head = None

  def insertNode(node):
    if self.head is None:
      self.head = node
      return
    runner = self.head
    while runner.next is not None:
      runner = runner.next
    runner.next = node


linked_list = LinkedList()
```

Rồi tạo 1 node mới

```py
node1 = Node(1)
```

Tiếp theo kết nối với linked list ta vừa tạo

```py
linked_list.insertNode(node1)
```

voila...

Các ngôn ngữ khác cũng tương tự logic như vây, nhưng tôi lưởi liệt kê lắm 🐧

## Doubly linked list

Linked List còn 1 kiểu khác ngoài kiểu cơ bản mà ta đã nhắc tới bên trên. Ở kiểu bên trên giang hồ
hay xưng là Singly Linked List, còn kiểu tôi sắp đề cập dưới đây sẽ là Doubly Linked List

Doubly Linked List là 1 linked list 2 chiều. Nếu như kiểu ở trên ta định nghĩa mỗi node sẽ có 1
connect đi vào và 1 connect đi ra, thì ở kiểu này sẽ có 2 connect đi vào và 2 connect đi ra nhưng
ngược chiều nhau. Nói dễ hiểu hơn thì trong 1 list, mỗi node sẽ có liên kết tới 1 node tiếp theo,
gọi là NextNode, và 1 node ở trước nó, gọi là PreviousNode.

Về code, mỗi node cũng tương tự với Singly Linked List, khác 1 điều là nó sẽ khởi tạo thêm 1 pointer
trỏ tới node trước previousNode. Ví dụ

```cpp
// C++
class Node
{
public:
  Data* data; // from a Data class
  Node* next;
  Node* prev;
  Node(Data* data) : data(data), next(nullptr), prev(nullptr) {}
};
```

Cũng cần chú ý là vì có thêm cái prev node, nên là chi tiết các method insert(), delete(), etc...
node cũng sẽ thay đổi theo tương ứng nhé 😐

[image /img/dsa/doubly-linked-list.png]
  Doubly linked list illustration (Credit: GeekforGeeks)
