---
title: DSA | Depth First Search (DFS)
date: 2023-04-29
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Depth First Search (DFS)

Bên canh **BFS**, ta còn có 1 kiểu traverse graph hay dùng nữa, gọi là **Depth First Search**. Khác
với **BFS** duyệt từng level của graph, thì ở **DFS** ta sẽ đi sâu thẳng 1 đường từ node xuất phát
cho tới "leaf node" (node mà không còn node liền kề nào có thể đi được nữa).

```
\             RootNode
          /            \
      Node1              Node2
    /      \            /    \
LeafNode1 LeafNode2 LeafNode3 LeafNode4
```

Với **DFS**, ta xuất phát từ `RootNode` => đi xuống `Node1` => đi xuống `LeafNode1` (ở node này ko
còn node liền kề mà chưa ta chưa đi nữa) => quay lại `Node1` => `LeafNode2` => quay lại `Node1` (lúc
này thì `Node1` cũng hết node để đi)  => quay lại `RootNode` => `Node2` => `LeafNode3` => quay lại
`Node2` => `LeafNode4` => quay lại `Node2` (cũng hết node để đi rồi) => quay lại `RootNode` và kết thúc.

Có thể thấy ta sẽ đi thẳng 1 mạch từ `RootNode` xuống `LeafNode1` trước, rồi khi mà ko còn node nào
có thể di chuyển tới được nữa, ta quay lại node ở trước node hiện tại của ta, và tiến tới các node
khác chưa đi.

Cái cơ chế trên thì chắc hẳn đọc qua anh em cũng thấy quen quen. Yup =))) Đây chính là đệ quy.
Cái khúc ta tới `LeafNode` rồi quay lại `Node` rồi đi tiếp `LeafNode` tiếp theo chính là giải thích
cho việc tại hàm `Node`, ta gọi đệ quy tới hàm `LeafNode` đầu, xử lý xong thì ta trở lại hàm `Node`
và gọi tới hàm `LeafNode` tiếp theo.

```md
f(RootNode)
=> f(Node1)
    => f(LeafNode1)
    => f(LeafNode2)
=> f(Node2)
    => f(LeafNode3)
    => f(LeafNode4)
```

Từ cách hiểu trên, ta xây dựng được 1 pseudocode sau:

```md
Recursive function starts at a Node:
  Check base case of the Node
  Repeat all childNodes:
    Call the recursive function to a childNode
  End repeat
  Return the required value
```

Snippet:

```py
# Python
def dfs(node):
  # Base case
  if node_is_base_case_or_leaf_node():
    return

  do_something()
  # Call to recursive function
  dfs(node.child1)
  dfs(node.child2)

  return
```

### Follow up

Khi ta áp dụng đệ qui như trên, đối với graph sẽ có nhiều trường hợp 1 node sẽ được đi lặp lại nhiều
lần, vậy nên ta cũng cần dùng hash table để đảm bảo việc mỗi node sẽ chỉ phải duyệt 1 lần.

Code snippet sẽ được updated lại như sau:

```py
# Init a new set as a global variable
visit = set()
def dfs(node):
  # Base case
  if node_is_base_case_or_leaf_node():
    return
  if node in visit:
    return

  do_something()
  # Call to recursive function
  dfs(node.child1)
  dfs(node.child2)

  visit.put(node)
  return
```
