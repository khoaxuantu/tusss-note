---
title: DSA | Graphs & Trees
date: 2023-03-04
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Graphs và Trees

Đây là 1 chủ đề rất rộng và cũng chiếm 1 phần quan trọng trong giải thuật, với nhiều người thì đây
cũng là 1 phần khó ở cả việc hiểu lẫn giải quyết các vấn đề liên quan. Ở post này tôi sẽ khái quát
các mặt chính về 2 loại cấu trúc dữ liệu trên để ae có thể hình dung tốt hơn về 2 cái này.

## Graph

Đồ thị - Nghe là thấy hình học rồi 😐. Đây là kiểu dữ liệu mà tại đó ta đưa dữ liệu đầu vào của ta
về các node (các điểm, các chấm, etc...) với các đường thẳng kết nối với nhau tạo nên 1 hình đồ thị.

Nhìn chung cái khái niệm đồ thị này thì nó rất rộng, và ta hay áp dụng vào bất cứ vấn đề mà ta
"thấy" được sự liên kết giữa các data hoặc các "state" của data. Ví dụ, 2 địa chỉ được kết nối với
nhau, 1 array (thay vì ta tưởng tượng là 1 ô vuông thì giờ ta coi nó là 1 node), hoặc khi lập chuỗi
permutation (ta có các node ở các state của data):

```
a
ab ba
cab acb abc cba bca bac
...
```

Để hình dung ra hình ảnh trong đầu, ta có thể tưởng tượng graph nó giống như các sơ đồ mạng thường
thấy, với các điểm truy cập đều được gọi là các node.

Thông thường trong các bài giải thuật, ta có thể implement graph qua hash table hoặc tạo 1 class
riêng về graph theo kiểu oop.

Chẳng hạn có 1 graph như sau:

```
1-2-4-7
| |
3-5-6
```

Với hash table, graph sẽ được diễn tả như sau, key tương trưng cho node và value tượng trưng cho
list các node liền kề với key

```js
graph = {
  "1": [2,3],
  "2": [1,4,5],
  "3": [1,5],
  "4": [2,7],
  "5": [2,3,6],
  "6": [5],
  "7": [4]
}
```

Còn với class, ta sẽ tạo 1 class `Node` riêng với fields chính bao gồm value và list các node liền kề,
và tạo graph với các object `Node`

```py
# python
class Node:
  def __init__(val):
    self.val = val
    self.neighbors = []
  # Append obj node to neighbors list
  def connect(node):
    self.neighbors.append(node)
```

Lưu ý: Ta có thể dùng 1 số data structure khác nhau cho neighbors list, ko nhất thiết là array như
trên, tùy theo yêu cầu truy cập tới các neighbor node

### Cách để duyệt graph

Ta áp dụng 2 cách điển hình để duyệt graph là **BFS** và **DFS**, ta sẽ bàn sâu hơn 2 cách này trong các pattern riêng

## Tree

Đây là 1 cấu trúc dữ liệu đặc biệt được phát triển từ graph. Tại đây, ta hình dung các node kết nối
với nhau tạo thành hình cây. Điểm khác biệt chính của tree với graph là ở tree, ta có 1 node *root*
khởi đầu (gốc cây) và quy định hướng di chuyển từ *root* tới các *leaf node* (lá cây).

```md
             RootNode
          /            \
      Node               Node
    /      \            /    \
LeafNode  LeafNode  LeafNode  LeafNode
```

Thông thường trong các bài giải thuật, tree sẽ được khởi tạo bằng các obj `TreeNode` và kiểu tree
ta dễ gặp nhất là binary tree (tree có 2 children node ở mỗi node) . Cách implement class `TreeNode`
sẽ gần giống với cách implement class `ListNode` trong Linked List:

```py
# python binary tree
class TreeNode:
  def __init__(val):
    self.val = val
    self.left = None
    self.right = None
```

### Cách để duyệt binary tree

Ta sẽ áp dụng **DFS** để duyệt. Ở các recursion call, ta sẽ có 3 cách để xử lý tree:

- Xử lý logic trước khi gọi đến 2 children node (Pre-order Traversal)
- Gọi đến 1 children node trước -> xử lý logic -> gọi đến children node còn lại (In-order Traversal)
- Gọi đến 2 children node trước rồi mới xử lý logic (Post-order Traversal)

### Phân biệt binary tree với binary search tree

Ngoài binary tree, ta cũng hay gặp 1 kiểu tree nữa là binary search tree. Nhiều ng lầm tưởng 2 loại
này giống nhau, nhưng thực chất đây là 2 thứ khác nhau. Binary search tree chỉ có 1 trường hợp đặc
biệt của binary tree, các giá trị mỗi node của BST phải tuân thủ quy tắc sau:

- Tất cả các descendent node thuộc *left* phải có giá trị không lớn hơn giá trị của node hiện tại
- Giá trị của node hiện tại không được lớn hơn tất cả các descendent node thuộc *right*

Ví dụ

```md
           8
       /      \
     3          12
   /    \      /  \
  2      5    9    13
```
