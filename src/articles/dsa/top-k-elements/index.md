---
title: DSA | Top-K Elements
date: 2023-05-22
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Top-K Elements

Thêm 1 vấn đề vấn đề phổ biến mà ta sẽ ứng dụng **Heap** nữa, lần này sẽ là pattern **Top K Elements**.
Pattern này sẽ giúp ta tìm k số cụ thể như k số nhỏ nhất hoặc k số lớn nhất từ input với time
complexity đc tối ưu.

Đầu tiên, khi nghĩ tới các bài toán về tìm *k* số nhỏ nhất/lớn nhất trong 1 dãy *n* số, ta có thể
bật ra ngay là sort dãy số trước rồi lấy ra *k* số cần lấy. Như vậy nó sẽ tốn của ta O(nlogn) time
để sort, và lấy *k* số tốn ta O(k) time.

Với top k elements, thay vì phải sort đầu tiên, ta luôn đảm bảo chỉ có k số trong 1 heap nên sẽ chỉ
phải tốn time complexity là O(nlogk), được biết *k <= n* nên thời gian sẽ tối ưu hơn so với cách sort
trên.

Ta có 1 pseudocode chung chung cho việc tìm k largest(dùng min-heap) / smallest(dùng max-heap)
elements như sau:

```md
Insert the first k elements from the given set of elements to the min-heap or max-heap
Iterate through the rest of the elements
  For min-heap, if you find the larger element, remove the top (smallest number) of the min-heap and insert the new larger element
  For max-heap, if you find the smaller element, remove the top (largest number) of the max-heap and insert the new smaller element
```

## Snippet

```cpp
vector<int> arr {};

priority_queue<int> maxHeap; // For smallest k
priority_queue<int, vector<int>, greater<int>> minHeap; // For largest k

for (int i = 0; i < k; i++) {
  if (maxHeap.size() < k) {
    maxHeap.push(arr[i]);
  }
  else if (arr[i] < maxHeap.top()) {
    maxHeap.pop();
    maxHeap.push(arr[i]);
  }
}

vector<int> ans;
while (!maxHeap.empty()) {
  ans.push_back(maxHeap.top());
  maxHeap.pop();
}

return ans;
```

## Sample questions

- [Top k elements](https://leetcode.com/problems/kth-largest-element-in-an-array/)
- [Connect ropes](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) [(detail question)](https://leetcode.ca/all/1167.html)
- [Top k frequent numbers](https://leetcode.com/problems/top-k-frequent-elements/)
- [Frequency sort](https://leetcode.com/problems/sort-characters-by-frequency/)
- [Kth largest number in a stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)
- [K closet number](https://leetcode.com/problems/find-k-closest-elements/)
- [Maximum distinct elements](https://www.geeksforgeeks.org/maximum-distinct-elements-removing-k-elements/)
- [Rearrange string k distance apart](https://leetcode.com/problems/rearrange-string-k-distance-apart/) [(detail question)](https://www.lintcode.com/problem/907/)
- [Scheduling tasks](https://leetcode.com/problems/task-scheduler/)
