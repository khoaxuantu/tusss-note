---
title: DSA | Breadth First Search (BFS)
date: 2023-04-29
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Breadth First Search (BFS)

[image https://www.guru99.com/images/1/020820_0543_BreadthFirs1.png alt="BFS concept illustration"]
    BFS concept illustration (Credit: Guru99)

Nay ta sẽ bàn tới 1 pattern mới cực phổ biến cho các bài tập liên quan tới graph. Anh em ai chưa
quen với graph có thể qua đây ôn lại - [Graph & Tree](/dsa/graphs-and-trees).

**Breadth First Search** là 1 phương thức để ta duyệt hết các phần tử của graph theo thứ tự từng
level một. lấy ví dụ 1 tree cho dễ hiểu:

```
\             RootNode
          /            \
      Node1              Node2
    /      \            /    \
LeafNode  LeafNode  LeafNode  LeafNode
```

Với **BFS**, ta duyệt xuất phát từ `RootNode`, rồi duyệt `[Node1, Node2]`, rồi cuối cùng duyệt
`[LeafNode, LeafNode, LeafNode, LeafNode]`. Thế thoy, ez ~

*Vậy cơ chế chi tiết của BFS là như thế nào?*

Như quan sát bên trên, ta đã nhóm các node ở mỗi level của tree vào cùng với nhau, để rồi duyệt từng
node trong mỗi nhóm. Cách tốt nhất để làm được như thế chính là áp dụng queue (ta có thể qua
[Queue](/dsa/queue) để ôn lại).

Ý tưởng sẽ là sử dụng vòng lặp, với mỗi vòng lặp ta sẽ xử lý 1 level
trong queue, rồi pop cái level đó ra và đẩy level tiếp theo vào. Để ý thấy mỗi node sẽ có các
`childNode` hoặc các `adjacentNode`, nên ta có thể đẩy level tiếp theo vào queue bằng cách thông qua
mỗi node, đẩy các `childNode` của nó vào queue.

Vậy ta sẽ có 1 pseudocode chung như sau:

```md
Initialize a queue
Push the root node to queue
Repeat until the queue is empty:
  Take the current size of the queue (size -> queue.size)
  Repeat 0 -> size-1:
    Get the first node of the queue (cur_node -> queue.front)
    Pop the queue
    Do something with the node
    Push the cur_node's adjacent nodes to queue
  End repeat
End repeat
```

Snippet

```py
# Python
from queue import Queue

q = Queue()

q.put(root_node)

while not q.empty():
  size = q.qsize()
  for i in range(size):
    cur_node = q.get() # This method performs both get and pop

    do_something_with_current_node()

    for node in cur_node.child_node:
      q.put(node)
```

### Follow up

Trong nhiều trường hợp graph, ta nhận thấy có thể ta sẽ đi tới cùng 1 node nhiều lần. Để tối ưu điều
này, ta sẽ cần phải dùng hash table để lưu lại các node đã đi và ko push lại node đấy vào queue khi
gặp lại nữa. Như thế code snippet sẽ được chỉnh lại như sau:

```py
from queue import Queue

q = Queue()
q.put(root_node)

# Init a new set to save visited node
visit = set(root_node)

while not q.empty():
  size = q.qsize()
  for i in range(size):
    cur_node = q.get() # This method performs both get and pop

    do_something_with_current_node()

    for node in cur_node.child_node:
      if node not in visit:
        q.put(node)
        set.add(node)
```
