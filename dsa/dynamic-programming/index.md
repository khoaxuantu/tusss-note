---
title: DSA | Dynamic Programming
date: 2023-06-27
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Dynamic Programming (5 parts)

> Dynamic Programming, Quy hoạch động, DP, ... Bao nhiêu ông tạch vì topic này rồi 💀

## Đây là cái gì?

Đại khái thì đây là 1 cách tối ưu giải thuật bằng cách lưu lại giá trị cần thiết trong 1
state/subproblem và tái sử dụng nó khi phải lặp lại 1 state/problem giống hệt.

Chẳng hạn, ta có 1 state gọi là `f("Tuslipid")`, ta giải nó tốn 69 bước, đc giá trị `khoaxuantu`,
ta lưu nó lại trong "bộ nhớ"

[table caption="Memory table"]
    key      | value
    Tuslipid | khoaxuantu

Chương trình của ta sau khi tính đc state đó, chạy tiếp vài bước, thì lại bắt gặp 1 state y hệt
`f("Tuslipid")`, bình thường nếu muốn giải quyết tiếp bước này, chương trình ta phải chạy tới 69
bước nữa.

Nhưng ta đã có "bộ nhớ" trên, vậy nên ta chỉ cần truy cập bộ nhớ đó, lấy ra giá trị theo
khóa `Tuslipid`, vậy là chỉ tốn 1 bước, ta đã cắt giảm đc 68 bước rồi ~

## Khi nào thì ta dùng DP?

Có rất nhiều bài toán bắt ta phải giải bằng phương pháp đệ quy áp dụng cách tiếp cận chia để trị
(divide & conquer).

Theo concept chia để trị, ta chia nhỏ 1 problem lớn thành các subproblem nhỏ hơn, kết hợp kết quả có
đc từ các subproblems để được kết quả cuối cùng của problem lớn. Với đệ quy, từng subproblem ta lại
chia ra các subproblem nhỏ hơn, 1 main -> 2 sub, 2 sub -> 4 smaller sub, 4 smaller sub -> 8 smaller
smaller sub,... đến khi ko thể chia tiếp đc nữa, ta đến base case.

**Divide & conquer** có hạn chế đó là độ phức tạp lớn khủng khiếp:

- 1 tập N phần tử có thể phải gọi tới O(k^n) hàm đệ quy
- Đồng thời trong đó sẽ có thể gọi tới rất nhiều hàm trùng nhau, tưởng tượng duyệt các tập hợp trong list [1,2,3,2,1], ta dễ dàng sẽ gọi tời hàm f(1,2,3) >2 lần

Như vậy, để tối ưu được vấn đề trên, ta đã có DP, giải trước 1 hàm, lưu kết quả lại, sau đó nếu gặp
lại hàm này thì ta chỉ lấy kết quả đã lưu ra thôi. Liên hệ tới cache, tại đó ta lưu các thông tin
cần thiết để có thể tái sử dụng mà ko phải tính toán lấy kết quả từ đầu nữa.

Về cách sử dụng DP, có cả thảy 2 cách:

- **Top-down approach:** Đây là cách tiếp cận "typical" chia để trị, ta tiếp cận tới ví dụ chính ở đề bài, chia nhỏ ví dụ đó ra thành các subproblems nhỏ hơn, giải quyết nó (hình tượng hóa giống cấu trúc đồ thị ở hình trên). Với cách tiếp cận này, ta implement bằng đệ quy, từ cao đến thấp, như DFS vậy. Ở Vn, nhiều ae nói tới concept về đồ thị trong DP, thì có lẽ anh em đang nói tới cách tiếp cận top-down đó.
- **Bottom-up approach:** Trái lại, ta cũng có thể xây dựng "từ dưới lên". Bắt đầu từ index nhỏ nhất giải quyết subproblem nhỏ nhất, cộng dồn cho các subproblems lớn hơn, cho tới problem chính cuối cùng. Ở Vn, theo tôi thấy ae hay nói tới cách tiếp cận này với thuật ngữ "khử đệ quy", vì ta sẽ implement theo bảng (tabular) cho cách tiếp cận bottom-up đó.

Về mẫu giải, ta có thể suy ra pseudocode chung cho 2 cách tiếp cận như sau:

- **Top-down:**

```md
Memoization table -> dp[]
function f(state):
  check base case, return value
  if state is solved in dp, return dp[state]

  dp[state] = f(next_state) with f(another_next_state) with ...
  return dp[state]
```

- **Bottom-up**

```md
function f(input):
  tabular -> dp[]

  preset some base cases, dp[] at index 0 or 1 or something like this...

  traverse dp[], repeat:
    dp[state] = dp[prev_state] with dp[another_prev_state] with ...
    state -> next_state
  end repeat

  return dp[input]
```

> Fact: Khi hỏi về các câu hỏi DP, interviewer họ đánh giá rất cao nếu ae diễn giải cho họ lần lượt
> 3 hướng trên (thứ tự brute force -> memoization -> tabular).
>
> Họ tìm kiếm ứng viên có tư duy suy
> nghĩ, chứ ko tìm kiếm 1 máy giải thuật toán. Nếu ae nhảy vô cách tối ưu nhất là bottom-up khử đệ
> quy thì chưa chắc họ lại ấn tượng bằng giải lần lượt đâu.

Đây là 1 phần khó, nhìn chung muốn giải đc dạng này thì chỉ có cách luyện nhiều, ko có cách nào khác đâu 💀

## Tham khảo thêm về cách giải dynamic programming

- [(FeeCodeCamp) Follow these steps to solve any dynamic programming interview problem](https://www.freecodecamp.org/news/follow-these-steps-to-solve-any-dynamic-programming-interview-problem-cc98e508cd0e)
- [(FeeCodeCamp) Dynamic programming made easy](https://www.freecodecamp.org/news/dynamic-programming-made-easy)
- [(FeeCodeCamp) Demystifying dynamic programming](https://www.freecodecamp.org/news/demystifying-dynamic-programming-3efafb8d4296/)

## Patterns

1. [Recursive numbers](/dsa/dynamic-programming/recursive-numbers)
2. [0/1 knapsack](/dsa/dynamic-programming/0-1-knapsack)
3. [Unbounded knapsack](/dsa/dynamic-programming/unbounded-knapsack)
4. [Longest common substring](/dsa/dynamic-programming/longest-common-substring)
5. [Longest palindromic subsequence](/dsa/dynamic-programming/palindromic-subsequence)
