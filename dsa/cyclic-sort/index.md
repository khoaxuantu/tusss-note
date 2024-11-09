---
title: DSA | Cyclic Sort
date: 2023-08-07
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Cyclic Sort

**Cyclic sort** là 1 cách sort nhằm sắp xếp thành 1 dãy các số có quy luật tăng dần đều
(vd... 1,2,3,4,...,n) bằng cách tận dụng sự tăng dần đều của index trong mảng và sắp xếp các phần
tử của mảng bằng cách đưa các phần tử đó về index tương ứng.

Ví dụ dưới đây sẽ giúp ta hình dung rõ hơn cách hoạt động của cyclic sort, cho trước 1 list gồm các
số từ 1 tới 5 và đang có thứ tự ko đc sắp xếp.

```md
before
arr = [3,1,2,5,4]

after
arr = [1,2,3,4,5]
```

Ta xét phần tử đầu tiên (index `0`): 3. Biết rằng vị trí của 3 trong dãy đã sort là index `2`, có
nghĩa là 3 đang ko ở đúng vị trí, vì thế ta sẽ swap 3 với `arr[2]`, vậy list của ta sau đó sẽ đc:

```md
[2,1,3,5,4]
```

Đến lượt 2 ở index `0`, nó vẫn ko đúng vị trí, vì vậy ta sẽ phải swap số 2 về đúng vị trí của nó ở
index `1`

```md
[1,2,3,5,4]
```

Ở đây, số 1 đã ở đúng vị trí của nó là index `0`, nên ta sẽ di chuyển tới index tiếp theo. Tương tự
theo logic như thế, ta sẽ đc thứ tự như sau:

```md
index 1, 2 is in order     => [1,2,3,5,4]
index 2, 3 is in order     => [1,2,3,5,4]
index 3, 5 is not in order => [1,2,3,4,5] swap 5 to index 4, 4 is in order
index 4, 5 is in order     => [1,2,3,4,5]
```

Như vậy, có thể thấy logic chủ đạo của cyclic sort đó là: trong 1 index, ta sẽ thực hiện việc đưa
các số đang ko ở đúng index về với vị trí đúng của nó cho tới khi ta có được số tương ứng với index
hiện tại.

Ta có thể rút ra đc pseudocode như sau

```md
Repeat the list, for each i:
  If list[i] is not in correct index:
    Swap list[i] with list[correctIndex]
  Else:
    Increment i
```

Vì cách để xác định correct index là ko cố định, tôi sẽ lấy code theo ví dụ bên trên cho dễ hiểu:
`arr[i] = i+1`

```cpp
int i = 0;
while (i < arr.size()) {
  if (arr[i] != i + 1) {
    arrSwap(i, arr[i] - 1);
  } else {
    i++;
  }
}
```

## Follow up

- Mẹo để giải quyết mấy bài có các số bị trùng, ta sẽ ko so trực tiếp số với index nữa, thay vì đó
ta sẽ so số hiện tại với số nằm trong index được tạo bởi giá trị của số hiện tại. Như đoạn code trên,
ta có thể thay mệnh đề `arr[i] != i + 1` thành `arr[i] != arr[arr[i] - 1]`.
- **Cyclic sort** đc áp dụng để giải hầu hết các bài tập yêu cầu phải xử lý với dãy số tăng dần đều,
ví dụ như tìm số còn thiếu trong dãy số => tìm số ko nằm đúng vị trí sau khi sort hoàn thành.

## Sample questions

- [Missing number](https://leetcode.com/problems/missing-number/)
- [First missing positive number](https://leetcode.com/problems/first-missing-positive/)
- [Find the corrupt pair](https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/)
- [K-th missing positive number](https://leetcode.com/problems/kth-missing-positive-number/)
