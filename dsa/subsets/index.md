---
title: DSA | Subsets
date: 2023-06-05
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Subsets

Đến phần ta cần sử dụng nhiều đệ quy rồi đây @@. Ở post này ta sẽ nói tới pattern **Subsets**, đây
là pattern giúp ta giải quyết các bài toán yêu cầu tìm permutations và combinations ko lặp của các
elements trong 1 data structure.

Ví dụ, 1 array [1,2,3]. Ta có các subsets như sau

```md
{1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}
```

Ý tưởng là ta sẽ xây dựng nên các subsets từ từng elements trong array. Cụ thể trong ví dụ trên:

1. Ta bắt đầu với 1 tập rỗng {}. Từ tập rỗng này ta generate ra 2 array mới từ 2 option: bỏ qua
element 1 và thêm element 1 vào trong array. Như vậy ta đc:

```md
{}, {1}
```

2. Ta lưu tập hợp 2 array trên, rồi với mỗi array ta kết hợp với element `2` bằng 2 cách như ở
bước 1. Ta có;

```md
{}, {2}, {1}, {1,2}
```

3. Áp dụng tương tự với tập hợp các array có đc ở bước 2. Ta sẽ đc:

```md
{}, {3}, {2}, {2,3}, {1}, {1,3}, {1,2}, {1,2,3}
```

Như vậy bỏ qua tập rỗng ở đầu đi thì ta có được kết quả rồi.

[image /img/dsa/subsets.jpg alt="Subset example illustration"]
    Subset example illustration (Source: Internet)

Áp dụng vào đệ quy, ta sẽ có pseudocode như sau;

```md
function(saveArrays, inputIndex):

  If inputIndex >= inputArray.size:
    Return saveArrays
  Initialize size = saveArrays.size

  Repeat
  For i from 0 to size-1:
    Initialize newArray = saveArrays[i]
    Append inputArray[inputIndex] to newArray
    Append newArray to saveArrays
  End repeat

  Return function(saveArrays, inputindex+1)
```

## Snippet

```cpp
vector<vector<int>> subsets(vector<vector<int>>& saveArrays, int inputIndex) {
  if (inputIndex >= inputArray.size()) {
    return saveArrays;
  }

  int size = saveArrays.size();

  // Add new arrays with the new element to the newArrays
  for (int i = 0; i < size; i++) {
    vector<int> newArray (saveArrays[i]);
    newArray.push_back(inputArray[inputIndex]);
    saveArrays.push_back(newArray);
  }

  return subsets(saveArrays, inputIndex+1);
}
```

## Follow up

- Ta có thể áp dụng cách tiếp cận BFS thay vì đệ quy như trên. Gợi ý là trong phần ý tưởng ta đã
bàn tới phía trên, mỗi bước ta cần lưu từng set arrays một và dùng set đó để thêm element tiếp theo.
Đặc điểm này ta thấy giống hệt với cách ta sử dụng queue trong BFS rồi.
- Cách tiếp cận này sẽ tốn của ta tới O(n*2^n) time complexity. Nhìn chung các dạng bài về subsets
vs combinations đều có độ phức tạp thời gian rất lớn. Ae tiếp cận tới pattern subsets trước tiên
cũng tạo dựng bước tiền đề để sau này học pattern dynamic programming (quy hoạch động) được dễ dàng
hơn.

## Sample questions

- [Subsets](https://leetcode.com/problems/subsets/)
- [Subsets with duplicate](https://leetcode.com/problems/subsets-ii/)
- [Permutations](https://leetcode.com/problems/permutations/)
- [String permutations by changing case](https://leetcode.com/problems/letter-case-permutation/)
- [Balanced parentheses](https://leetcode.com/problems/generate-parentheses/)
- [Unique generalize abbreviation](https://leetcode.com/problems/generalized-abbreviation/) [(full question)](https://www.designgurus.io/course-play/grokking-the-coding-interview/doc/639dc70fef27e08651fb4a59)
- [Evaluate expression](https://leetcode.com/problems/different-ways-to-add-parentheses/)
- [Unique binary search tree](https://leetcode.com/problems/unique-binary-search-trees-ii/)
