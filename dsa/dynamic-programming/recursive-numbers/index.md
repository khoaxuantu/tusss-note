---
title: DSA | Dynamic Programming | Recursive numbers
date: 2023-06-27
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Dynamic Programming: Recursive Numbers

> Đây là phần 1 trong [bộ 5 notes về Dynamic Programming của tôi](/dsa/dynamic-programming)

1 **recursive number** là 1 số mà có thể được tạo ra từ 1 phương trình sử dụng đệ quy để liên kết
các mệnh đề trong chương trình đó.

Lấy ví dụ cho dễ hiểu, dãy fibonacci, ae chắc hẳn quá quen rồi

```md
0 1 1 2 3 5 8 13 21
```

Trong dãy fibonacci, số *i* được tạo bởi tổng của số *i*-1 với số *i*-2.

Bắt đầu từ số 21 nhé (top-down)

```md
21 = (13 + 8)
   = (8 + 5) + (5 + 3)
   = (5 + 3) + (3 + 2) + (3 + 2) + (2 + 1)
   = (3 + 2) + (2 + 1) + (2 + 1) + (1 + 1) + (2 + 1) + (1 + 1) + (1 + 1) + (1 + 0)
```

Thấy đệ quy chưa?
Ta thử biến đổi block trên thành các hàm `f(x)` nhé

```md
f(21) = f(13) + f(8)
      = f(8) + f(5) + f(5) + f(3)
      = f(5) + f(3) + f(3) + f(2) + f(3) + f(2) + f(2) + f(1)
```

Vậy là ta được đệ quy vét cạn.

```cpp
int fibonacci(int n) {
  if (n == 0 || n == 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

Nhận thấy ở trên, các hàm `f(8)`, `f(5)`, `f(3)`, ... lặp đi lặp lại nhiều lần, vậy là ta có thể áp
dụng đc DP cho đệ quy đc rồi.

```cpp
vector<int> dp (n);
int fibonacci(int n) {
  if (n == 0 || n == 1) return n;
  if (dp[n] != 0) return dp[n] // Returns if we solve the subproblem before
  dp[n] = fibonacci(n - 1) + fibonacci(n - 2);
  return dp[n];
}
```

Top-down DP rồi, giờ ta thử hướng bottom-up xem. Bắt đầu từ 0, nhận thấy:

```md
0 + 1 = 1
1 + 1 = 2
1 + 2 = 3
2 + 3 = 5
3 + 5 = 8
5 + 8 = 13
8 + 13 = 21
```

Chuyển hóa thành dãy số, chương trình của ta có thể chạy như sau:

```md
   [0 1]
-> 0 [1 1]
-> 0 1 [1 2]
-> 0 1 1 [2 3]
-> 0 1 1 2 [3 5]
-> 0 1 1 2 3 [5 8]
-> 0 1 1 2 3 5 [8 13]
-> 0 1 1 2 3 5 8 [13 21]
```

Như cách chạy trên, ta cần lưu lại các số và dần dần hình thành 1 dãy aka mảng 1 chiều. Cuối cùng...

```cpp
int fibonacci(int n) {
  vector<int> dp (n+1);
  dp[0] = 0;
  dp[1] = 1;
  for (int i = 2; i < n+1; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp.back();
}
```

Vậy là ta chỉ tốn O(n) time và O(n) space cho bài fibonacci rồi.

Ngoài ra ta vẫn có thể tối ưu hơn nữa, vì cố định ở 2 số i-1 và i-2, nên ta hoàn toàn có thể sử dụng
2 var để lưu 2 số này cho tính toán, giúp giảm space complexity từ O(n) xuống còn O(1).

```cpp
int fibonacci(int n) {
  int i1 = 0, i2 =1;
  int ans = 0;
  for (int i = 2; i < n+1; i++) {
    ans = i1 + i2;
    i2 = ans;
    i1 = i2;
  }
  return ans;
}
```

## Sample questions

- [Fibonacci numbers](https://leetcode.com/problems/fibonacci-number/)
- [Staircase problem](https://leetcode.com/problems/climbing-stairs/)
- [Combination sum IV](https://leetcode.com/problems/combination-sum-iv/)
- [Count ways to score in a game](https://www.geeksforgeeks.org/count-number-ways-reach-given-score-game/)
- [Unique paths](https://leetcode.com/problems/unique-paths/)
- [N-th tribonacci number](https://leetcode.com/problems/n-th-tribonacci-number/)
- [N-th Catalan number](https://www.geeksforgeeks.org/program-nth-catalan-number/)
- [House robber](https://leetcode.com/problems/house-robber/)
- [Minimum jumps to react to the end](https://leetcode.com/problems/jump-game-ii/)
- [Minimum cost climbing stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)
- [Matrix chain multiplication](https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/)
