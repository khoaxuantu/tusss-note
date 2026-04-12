---
title: DSA | Backtracking
date: 2023-06-20
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Backtracking

> 1 pattern "khó" vleu

Kỹ thuật yêu cầu ứng dụng khá rộng việc xử lý đệ quy, anh em nào chưa quen dùng đệ quy lắm thì sẽ
thấy dạng này hơi khó thở, tuy nhiên luyện qua rồi thì anh em có thể tự tin nắm khá vững về cách
dùng đệ quy như nào rồi đấy.

**Backtracking** là 1 kỹ thuật giúp ta tìm lời giải bằng cách khám phá các "hướng đi" (well typical
recursion). Nó xây dựng lời giải bằng cách cập nhật giá trị/ lựa chọn cần xử lý ở từng bước, và
thông qua các ràng buộc xóa đi những giá trị/lựa chọn ko còn cần thiết nữa đi.

Để hình dung cho rõ cơ chế **backtracking** như nào, ta xem thử ví dụ sau:

Cho 1 tree như sau, liệt kê các nhánh cây của nó, mỗi nhánh cây tương đương với 1 list.

```md
      1
    /   \
   4     5
  / \   / \
 3   2  6  7
```

Solution lý tưởng là ta sẽ chỉ cần gọi đệ quy tới mỗi node 1 lần.

Đầu tiên, ta sẽ cần 1 list [] để lưu các node của tree lại. Và nhiệm vụ của ta sẽ là cập nhật cái
list này sao cho nó đảm bảo lưu đủ các node tạo thành 1 nhánh cây.

Để duyệt tree, trong mỗi node ta sẽ gọi đệ quy tới các node con (typical DFS), và chương trình sẽ
chạy các bước cụ thể như sau:

```md
Start with an empty list: []
Add 1: [1]
Add 4: [1, 4]
Add 3: [1, 4, 3]
```

Đến đây, ta đã được 1 leftmost path là [1,4,3], ta lưu list này lại answer set. Vì ta đã đi tới
leaf node của tree là 3, nên ta sẽ quay lại node 4. Tại đây, muốn đạt được nhánh cây tiếp theo, ta
phải chỉnh sửa lại list đang có là [1,4,3].

Công việc rất đơn giản, node 3 ko còn tác dụng nữa, vậy nên ta xóa nó đi (có thể hiểu như là ta
backtrack cái list về node 4), rồi gọi đệ quy tiếp tới childnode tiếp theo của node 4 là node 2.

```md
Remove 3: [1,4]
Add 2: [1,4,2]
```

Rồi ta được nhánh cây tiếp theo là [1,4,2]. Đến đây, node 2 cũng hết tác dụng như node 3, ta lại
làm giống như bước trên. Và tổng kết lại:

```md
Remove 2: [1,4]
Remove 4: [1]
Add 5: [1,5]
Add 6: [1,5,6] => Push to answer
Remove 6: [1,5]
Add 7: [1,5,7] => Push to answer
Remove 7: [1,5]
Remove 5: [1]
Remove 1: [] => End
```

Cuối cùng, ta có kết quả là:

```md
[1,4,3], [1,4,2], [1,5,6], [1,5,7]
```

Từ ví dụ trên,  ta có thể đúc ra đc 1 pseudocode chung cho **backtracking** như sau:

```md
Initialize a tracking record (a list, a set, a variable, etc...)
Recursive function f():
  If base case:
    Return
  Repeat recursive calls:
    Update a value "val" to the tracking record
    Call recursively to f()
    Remove the "val"
  End repeat
  Return
```

## Follow up

Tôi nói topic này nó khó vleu thực ra ko phải vì cơ chế của backtracking nó khó, mà là vì tính chất
các problem mà cần dùng backtracking để giải nó khó, và để apply đc backtracking là cả 1 vấn đề.
Liên hệ problem nổi tiếng **N-Queens**, leetcode hard problem đei ~

## Sample questions

- [N-Queens](https://leetcode.com/problems/n-queens-ii/)
- [Word Search](https://leetcode.com/problems/word-search/)
- [House Robber III](https://leetcode.com/problems/house-robber-iii/)
- [Restore IP addresses](https://leetcode.com/problems/restore-ip-addresses/)
- [Sudoku solver](https://leetcode.com/problems/sudoku-solver/)
