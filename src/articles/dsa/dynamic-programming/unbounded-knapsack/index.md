---
title: DSA | Dynamic Programming | Unbounded Knapsack
date: 2023-07-11
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Dynamic Programming: Unbounded Knapsack

> Đây là phần 3 trong [bộ 5 notes về Dynamic Programming của tôi](/dsa/dynamic-programming)

Đây là 1 dạng khác của bộ knapsack problems, yêu cầu của nó cũng giống như khi ta bàn về
0/1 knapsack thôi: tìm giá trị tối ưu sao cho vừa với 1 capacity cho trước.

Nhưng có 1 điểm khác với 0/1 knapsack, khi ở dạng 0/1 ta có điều kiện là mỗi item chỉ đc dùng 1 lần,
còn ở dạng unbounded này mỗi items ta sẽ ko có giới hạn sử dụng. Nói cách khác, ta có thể cộng dồn
nhiều items trong cùng 1 loại với nhau để tìm ra giá trị tối ưu.

Điều này khiến cho hướng giải quyết bài toán có chút thay đổi so với 0/1 knapsack. Ở dạng 0/1, ta
cần check các tập hợp có các phần tử khác nhau. Ở dạng unbounded, ta sẽ cần check toàn bộ tập hợp,
bất kể có phần tử trùng nhau hay khác nhau. Ta cần chú ý ở đoạn này nếu ko muốn nhầm lẫn giữa cách
giải 0/1 với unbounded. Như vậy, pseudo code của ta theo đó cũng sẽ bị thay đổi.

Để tìm mọi tập hợp có thể hợp thành, tại mỗi item ta sẽ có 2 options:

- Skip item đó: Qua item tiếp theo, giữ nguyên capacity
- Cộng dồn item đó: 1 sự thay đổi nhỏ ở lựa chọn này là ta sẽ ko chuyển qua item tiếp theo mà sẽ vẫn
giữ nguyên item này cho bước sau, rồi khấu trừ capacity đi

## Example

Cho trước:

- 1 balo có thể chở tối đa 8kg
- 4 items với `[weight, value]` lần lượt là

```md
item 1: [1kg, $1]
item 2: [2kg, $4]
item 3: [3kg, $7]
item 4: [5kg, $10]
```

```cpp
int Capacity = 8;
int N = 4;
vector<int> weights { 1, 2, 3, 5 };
vector<int> values { 1, 4, 7, 10 };
```

Mỗi item đều không giới hạn số lượng có thể chọn.

Giá trị tối ưu cho đề bài trên sẽ là tập hợp các item 3, 3, 2 với value là `7+7+4 = 18 ($)`

Vậy chương trình sẽ chạy như thế nào để đc kết quả trên?

## Solution

Dựa vào 2 options ta đã đề cập ở trên, cách giải của ta theo từng bước sẽ là như sau

### Brute force

Vì cũng là bài toán tìm tập hợp, ta sẽ lại gọi đệ quy dựa vào 2 options như trên:

- Skip item: `f(item+1, capacity)`
- Include item: `f(item, capacity - weights[item]) + values[item]`

```cpp
f(item, capacity) = max(f(item+1, capacity), f(item, capacity - weights[item]) + values[item])
```

```cpp
int dfs(int item, int capacity) {
  // Base case
  if (item >= N || capacity <= 0) return 0;

  int skipItemVal = dfs(item+1, capacity);
  int includeItemVal = (capacity - weights[item] >= 0) ?
    dfs(item, capacity-weights[item]) + values[item] : 0;

  return max(skipItemVal, includeItemVal);
}
```

Độ phức tạp thời gian của cách vét cạn này sẽ là O(2^N) với bộ nhớ tiêu tốn có thể lên tới O(N)

### Memoization

Dễ thấy với việc ta phải đệ quy để tìm tất cả tập hợp, chắc chắn ta sẽ có lúc phải gọi lại các hàm
có input trùng nhau (item giống nhau và capacity giống nhau). Thực ra lấy ví dụ N items với mỗi item
có weight 1 và value 1 là hiểu ngay @@

Vậy nên ta sẽ cần bảng memory để ghi nhớ các hàm đã giải, và tái sử dụng nó về sau. Trong bài toán
này ta sẽ sử dụng mảng 2 chiều với dòng là item và cột là capacity

```cpp
vector<vector<int>> dp (N, vector<int> (Capacity+1, 0));
int dfs(int item, int capacity) {
  // Base case
  if (item >= N || capacity <= 0) return 0;
  if (dp[item][capacity] != 0) return dp[item][capacity];

  int skipItemVal = dfs(item+1, capacity);
  int includeItemVal = (capacity - weights[item] >= 0) ?
    dfs(item, capacity-weights[item]) + values[item] : 0;

  dp[item][capacity] = max(skipItemVal, includeItemVal);
  return dp[item][capacity];
}
```

Cách giải này sẽ tối ưu lại độ phức tạp thời gian xuốn còn O(N^Capacity) và bộ nhớ tiêu tốn là O(N\*Capacity).

### Tabular

Giờ ta bẻ ngược cách tiệp cận xuống build up từ dưới lên, tương tự như ở dạng 0/1 knapsack. Ở đây,
ta sẽ dùng bảng 2 chiều để khử đệ quy, với dòng là items và cột là capacity.

```cpp
int unboundedKnapsack() {
  vector<vector<int>> dp (N, vector<int> (Capacity+1, 0));

  for (int i = 0; i < N; i++) {
    for (int j = 1; j < Capacity+1; j++) {
      // At the first item, we can only include if its weights < the capacity, and
      // we need to pay attention to the combination of similar items.
      if (i == 0) {
        if (weights[i] <= j) dp[i][j] = values[i] + dp[i][j-weights[i]];
      } else {
        dp[i][j] = dp[i-1][j];
        if (j - weights[i] >= 0) dp[i][j] = max(dp[i][j], dp[i][j-weights[i]]+values[i]);
      }
    }
  }

  return dp[N-1][Capacity];
}
```

Cách giải này tối ưu đc độ phức tạp thời gian xuốn còn O(N\*Capcity) và bộ nhớ tiêu tốn là O(N\*Capacity).

## Sample questions

- [Unbounded knapsack](https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/)
- [Maximum ribbon cut](https://www.geeksforgeeks.org/maximum-product-cutting-dp-36/) ([Codeforce](https://codeforces.com/problemset/problem/189/A))
- [Rod cutting](https://www.interviewbit.com/blog/rod-cutting-problem/)
- [Minimum coin change](https://leetcode.com/problems/coin-change/)
- [Coin change II](https://leetcode.com/problems/coin-change-ii/)
