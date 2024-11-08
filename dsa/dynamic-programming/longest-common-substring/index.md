---
title: DSA | Dynamic Programming | Longest Commong Substring
date: 2023-07-18
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Dynamic Programming: Longest Common Substring

> Đây là phần 4 trong [bộ 5 notes về Dynamic Programming của tôi](/dsa/dynamic-programming)

Đầu tiền tìm hiểu về định nghĩa của Longest Common Substring (LCS) phát:

- 1 LCS được định nghĩa như là substring lớn nhất có trong 2 input strings.
- 1 substring `X`, được gọi là LCS của `S1` và `S2` khi nó tồn tại ở trong cả 2 strings và ko có
substring chung nào khác có độ dài lớn hơn nó.

> substring phải liền nhau.

## Example

Lấy ví dụ nhỏ, cho trước 2 string "BCDAACD" và "ACDBAC".

```cpp
string S1 = "BCDAACD"
string S2 = "ACDBAC"
```

Với mọi substring, ta sẽ có những substring chung sau: "ACD", "CD", "AC". Dễ thấy "ACD" có độ dài
lớn nhất nên ta sẽ trả về kết quả là "ACD".

Vậy làm thế nào để có đc kết quả trên?

## Solution

### Brute force

Để giải quyết yêu cầu đề bài, ta sẽ cần đối chiếu 2 string này với nhau, 1 char của string này sẽ so
với 1 char của string còn lại. Ta có thể bắt đầu chạy từ char đầu tiên hoặc char cuối cùng đều đc,
ở đây tôi sẽ lựa chọn char cuối. Ở mỗi char index (ta quy ước về hàm là `f(index1, index2, lcsLength)`),
ta sẽ phân ra được những trường hợp sau cần xử lý để xác định đc substring, và lấy ra giá trị lớn
nhất ở những trường hợp này:

- Nếu 2 char của 2 string là giống nhau, ta hoàn toàn có thể đưa vào LCS, như vậy ta sẽ cần dịch cả
char index của cả 2 string về trước 1 index và tăng độ dài cho LCS lên 1 =>
`f(index1 - 1, index2 - 1, lcsLength + 1)`
- Dịch index ở string 1 về trước, ta reset lại `lcsLength` (tìm substring mới) và ở hàm tiếp theo ta
sẽ đối chiếu `index1 - 1` với `index2` => `f(index1 - 1, index2, 0)`
- Dịch index ở string 2 về trước, ta reset lại `lcsLength` và ở hàm tiếp theo ta sẽ đối chiếu `index1`
với `index2 - 1` => `f(index1, index2 - 1, 0)`

```cpp
if S1[index1] == S2[index2]
  tmp = f(index1 - 1, index2 - 1, lcsLength + 1)

f(index1, index2, lcsLength) = max(tmp, max(f(index1 - 1, index2, 0), f(index1, index2 - 1, 0)))
```

```cpp
int lcs(int index1, int index2, int lcsLength) {
  // Base case
  if (index1 < 0 || index2 < 0) return lcsLength;

  if (S1[index1] == S2[index2]) lcsLength = lcs(index1-1, index2-1, lcsLength+1);
  int tmp1 = lcs(index1-1, index2, 0);
  int tmp2 = lcs(index1, index2-1, 0);

  return max(lcsLength, max(tmp1, tmp2));
}

lcs(S1.size()-1, S2.size()-1, 0);
```

Ở cách này ta sẽ lại tốn độ phức tạp thời gian lên tới O(2^N) với `N` là độ dài của string dài nhất,
trong trường hợp ko có char nào giống nhau giữa 2 string, buộc ta phải gọi đệ quy tới 2 hàm mỗi
call stack.

Ta cũng có thể tốn bộ nhớ lên tới N tượng trưng cho số stack tối đa chương trình gọi tới, tương ứng
theo độ dài của string dài nhất.

### Memoization

Như các bài DP khác, ở bài này ta lại nhận thấy sẽ có các subproblems lặp lại nhau, nên ta sẽ cần
tạp 1 bảng memory để ghi nhớ và tái sử dụng.

Ở trong ví dụ này, với 3 hằng số biến thiên liên tục là `index1`, `index2` và `lcsLength`, ta sẽ lập
mảng 3 chiều với trục thẳng đứng y tượng trưng cho `index1` và trục nằm ngang x tượng trưng cho
`index2` và trục z cho `lcsLength`

```cpp
vector<vector<vector<int>>> dp (N, vector<vector<int>> (M, vector<int> (max(N, M), -1)));
int lcs(int index1, int index2, int lcsLength, vector<vector<vector<int>>>& dp) {
  // Base case
  if (index1 < 0 || index2 < 0) return lcsLength;
  if (dp[index1][index2][lcsLength] != -1) return dp[index1][index2][lcsLength];

  int tmp = lcsLength;
  if (S1[index1] == S2[index2]) tmp = lcs(index1-1, index2-1, lcsLength+1, dp);
  int tmp1 = lcs(index1-1, index2, 0, dp);
  int tmp2 = lcs(index1, index2-1, 0, dp);

  dp[index1][index2][lcsLength] = max(tmp, max(tmp1, tmp2));
  return dp[index1][index2][lcsLength];
}
```

Với cách này ta sẽ tối ưu đc thời gian chạy xuống còn O(N\*M) với N là độ dài của string dài nhất
còn M là độ dài của string còn lại, và tốn bộ nhớ lên tới O(N^2\*M)

### Tabular

Để làm được cách này, ta cần tiếp cận từ bottom-up lên, build LCS qua từng index. Để thuận theo thứ
tự của bảng, tôi sẽ xử lý từ char đầu tiên (index 0) tới char cuối cùng của 2 strings. Khác với
**memoization** khi ta phải lập mảng 3 chiều, ở tabular ta chỉ cần lập mảng 2 chiều là đủ.

Tôi sẽ quy ước string `S1` chạy theo trục dọc của mảng còn string `S2` chạy theo trục ngang của mảng, và
mỗi ô trong mảng tượng trưng cho độ dài substring chung lớn nhất mà 2 string tạo được khi đến
`index1` và `index2`

> Thật ra thì để giải đc *Longest Common Substring* bằng cách này tôi thấy phải đc luyện qua rồi chứ
> mới lần đầu vô làm thì khó nghĩ ra lắm 💀

Ý tưởng để chạy bảng là như sau:

- Vì khi chạy 2 string đều có trường hợp là substring bị ngắt quãng sang substring khác, nên ta sẽ
cần 1 giá trị để lưu lại substring lớn nhất qua các bước => `maxLength`
- Tưởng tượng ở mỗi ô, ta đã có 1 "substring" ảo được build cho tới index trước ô đó, vì vậy ta sẽ
có thể "cộng dồn" char hiện tại vào "substring" => `dp[index1-1][index2-1] + 1`. Cuối cùng ta sẽ
lấy max giữa `maxLength` với giá trị cộng dồn để lưu độ dài lớn nhất

Nói chung thì khó giải thích luồng logic cho cái này để mọi ng hiểu lắm, phải chăng nếu có vid mô
phỏng lại thì dễ hiểu hơn 🙁

```cpp
int lcs() {
  vector<vector<int>> dp (S1.size()+1, vector<int> (S2.size()+1, 0));

  int maxLength = 0;

  for (int i = 1; i <= S1.size(); i++) {
    for (int j = 1; j <= S2.size(); j++) {
      if (S1[i-1] == S2[j-1]) {
        dp[i][j] = dp[i-1]][j-1] + 1;
        maxLength = max(maxLength, dp[i][j]);
      }
    }
  }

  return maxLength;
}
```

Cách này sẽ giúp ta tối ưu thời gian chạy xuống còn O(M\*N) và bộ nhớ O(M\*N).

## Sample questions

- [Longest common subsequence](https://leetcode.com/problems/longest-common-subsequence/)
- [Shortest common supersequence](https://leetcode.com/problems/shortest-common-supersequence/)
- [Minimum number of deletions or insertions](https://www.geeksforgeeks.org/minimum-number-deletions-insertions-transform-one-string-another/)
- [Edit distance](https://leetcode.com/problems/edit-distance/)
- [Longest repeating subsequence](https://www.geeksforgeeks.org/longest-repeating-subsequence/)
- [Distinct subsequence](https://leetcode.com/problems/distinct-subsequences/)
- [Interleaving string](https://leetcode.com/problems/interleaving-string/)
- [Word break II](https://leetcode.com/problems/word-break-ii/)
- [Longest increasing subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
- [Minimum deletions to make a sorted sequence](https://www.geeksforgeeks.org/minimum-number-deletions-make-sorted-sequence/)
- [Maximum sum increasing subsequence](https://www.geeksforgeeks.org/maximum-sum-increasing-subsequence-dp-14/)
- [Longest bitonic subsequence](https://www.geeksforgeeks.org/longest-bitonic-subsequence-dp-15/)
- [Longest alternating subsequence](https://www.geeksforgeeks.org/longest-alternating-subsequence/)
- [Building bridges](https://www.geeksforgeeks.org/dynamic-programming-building-bridges/)
