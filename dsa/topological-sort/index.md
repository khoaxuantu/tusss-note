---
title: DSA | Topological Sort
date: 2023-08-14
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Topological Sort

Pattern này sẽ được sử dụng khi ta cần tìm ra 1 thứ tự chính xác cho các phần tử có các phần tử phụ
thuộc vào nó, hoặc các phần tử mà nó phụ thuộc. Nói theo cách đơn giản, topological order có thể đc
mô tả như thứ tự 1 phần, khác với thứ tự toàn phần, ta ko nhất thiết phải cho ra đúng 1 thứ tự đúng
duy nhất mà thay vào đó, các đáp án sẽ dược linh hoạt khác nhau.

Với thứ tự toàn phần, ta có thể kể đến việc sort 1 mảng `[5,2,1]` về thứ tự tăng dần. Ta sẽ chỉ được
chấp nhận kết quả duy nhất là `[1,2,5]` - 1 complete order.

Mặt khác, trong thứ tự 1 phần, ta có thể lấy ví dụ như sau: Cho trước 3 môn học, *English I*,
*English II* và *Mathematics*, sắp xếp thứ tự các môn học ưu tiên, biết rằng *English I* phải luôn
được lấy trước *English II*. Vì ko có ràng buộc nào cho *Mathematics*, ta xếp nó ở đâu cũng được,
kết quả sẽ đc chấp nhập trong 3 đáp án sau:

- English I, English II, Mathematics
- Mathematics, English I, English II
- English I, Mathematics, English II

Với topological sort pattern, vì ta phải xử lý các phần tử có mối liên quan phục thuộc lẫn nhau,
điều đầu tiên ta cần làm chính là đưa input về dạng directed graph. Rồi bắt đầu từ phần tử root,
duyệt tới hết các phần tử có thể chạy. Vì topological order dựa theo level-by-level của graph, ta
sẽ áp dụng BFS để duyệt.

Ở dạng bài topological sort tiêu biểu, input của ta thường đc biểu diễn như 1 list các kết nối, mỗi
kết nối bao gồm 2 phần tử `[source, destination]`.

```md
input = [[a, b], [a, c], [c, d], [b, a]]
```

Ta sẽ rút ra đc pseudocode dạng này:

```md
# Create a graph from input
Initialize a graph map { node: [neighbors] }
Initialize a indegree map { node: parentsNumber }
For each arr in input:
  indegree[arr[0]] <- 0
For each connection in input:
  Push connection[1] to graph[connection[0]]
  Increment indegree[connection[1]]

# Find the root nodes
Initialize queue q for bfs
For each entry in indegree:
  if entry.value is 0:
    push entry.key to q

Traverse the graph by BFS
```

## Snippet

```cpp
vector<vector<int>> input { ... };
```

```cpp
unordered_map<int, vector<int>> graph;
unordered_map<int, int> inDegree;

for (auto& arr : input) {
  inDegree[arr[1]] = 0;
  inDegree[arr[0]] = 0;
}
for (auto& connection : input) {
  graph[connection[0]].push_back(connection[1]);
  inDegree[connection[1]]++;
}

queue<int> q;

for (auto& entry : inDegree) {
  if (entry.second == 0) q.push(entry.first);
}

while(!q.empty()) {
  int size = q.size();
  for (int i = 0; i < size; i++) {
    int curNode = q.front();
    q.pop();

    doSomething();

    for (int& nei : graph[curNode]) {
      if (inDegree[nei] > 0) {
        inDegree[nei]--;
        q.push(nei);
     }
    }
  }
}
```

## Follow up

- Dạng này áp dụng tốt với directed graph, với indirected graph thì nên cẩn thận.
- Nhìn thì tự hỏi sao ko gộp chung với BFS, nhưng mà để ý thì thấy ở đây input yêu cầu ta phải tự tạo ra 1 graph cho riêng mình.
- Để ý ở code trên ta có 1 hash table là `inDegree`. Hash table này biểu diễn cho số lượng node cha của mỗi node, nhờ đó ta có thể tìm ra đc root node trong graph và kiểm soát ta đã đi qua node đó hay chưa.

## Sample questions

- [Compilation order](https://gist.github.com/ayushdwivedi18/d0f2abd90fb550ce72328e03bf33c1c7)
- [Alien dictionary](https://leetcode.com/problems/alien-dictionary)
- [Verifying an Alien Dictionary](https://leetcode.com/problems/verifying-an-alien-dictionary/)
- [Course schedule II](https://leetcode.com/problems/course-schedule-ii/)
- [Find all possible recipes from given supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/)
