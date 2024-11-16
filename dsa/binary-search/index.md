---
title: DSA | Binary Search
date: 2023-05-26
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Binary Search

Trước hết, cần biết rằng ở các nnlt ta hay có 1 built-in library cho binary search rồi, và ta hoàn
toàn có thể sử dụng nó để giải quyết các câu hỏi về binary search. Chẳng hạn trong C++ ta có

```cpp
// Return true if x is in arr
binary_search(arr.begin(), arr.end(), x)

// Return a pointer to the first array element whose value is at least x
lower_bound(arr.begin(), arr.end(), x)

// Return a pointer to the first array element whose value is larger than x
upper_bound(arr.begin(), arr.end(), x)
```

Nhưng 1 số vấn đề sẽ yêu cầu ta phải implement hẳn cái binary search ra nên ở post này tôi sẽ điểm
lại cụ thể cơ chế của nó ra thôi, còn sau đó anh em có thể lựa chọn giữa built-in library với tự
implement nó ra tùy theo yêu cầu đề bài.

Về chi tiết, đầu tiên binary search được dùng để giải quyết bài toán tìm 1 element trong 1 list đã
được sắp xếp (nhớ nhé, sorted, sorted, sorted, đừng quên để đến lúc áp dụng vô mà chưa sorted lại ko
biết sai vì đâu 💀). Nó tuân thủ 2 nguyên tắc sau:

- Lấy ra 1 element ở giữa trong 1 khoảng, nếu nó có giá trị bé hơn giá trị cần tìm (x), có nghĩa là x nằm trong khoảng bên phải của element đó (nghĩa là trong khoảng toàn giá trị lớn hơn).
- Ngược lại, nếu nó có giá trị lớn hơn x, thì nghĩa là x nằm trong khoảng bên trái của element đó

Áp dụng vào pseudocode, ta sẽ được như sau:

```md
mid -> start + (end - start)/2
If arr[mid] equals to x, return found
Else if arr[mid] is less than x, start -> mid + 1
Else end -> mid - 1
```

Có 2 cách code cho binary search này (C++) , cho trước:

```cpp
vector<int> arr { ... }; // Some sorted numbers
int x;
```

1. Dùng đệ quy

```cpp
bool binary_search(int start, int end) {
  int mid = start + (end - start) / 2;
  if (arr[mid] == x) return true;
  else if (arr[mid] < x) return binary_search(mid+1, end);
  else return binary_search(start, mid-1);

  // If x is not in arr
  return false;
}
```

2. Dùng vòng lặp (hiện giờ tôi hay dùng cách này vì ta đều đc recommend ưu tiên khử đệ quy)

```cpp
bool binary_search(int start, int end) {
  while (start <= end) {
    int mid = start + (end - start) / 2;
    if (arr[mid] == x) return true;
    else if (arr[mid] < x) start = mid + 1;
    else end = mid - 1;
  }
  // If x is not in arr
  return false;
}
```

## Follow up

- Chú ý để tính mid tôi hay dùng start + (end - start) / 2 mà ko dùng (start + end) / 2  cho C++. Đó là vì ta cần tránh interger overflow, ví dụ end đề bài cho là `INTERGER_MAX`, thì như vậy start + end nó sinh ra lỗi rồi.
- Nhiều bài sẽ khó họ sẽ ko show hẳn cái list ra, cốt lõi ta cần nhận ra cái khoảng giá trị mà ta cần search là gì.
- Độ phức tạp O(logn), đây là độ phức tạp gần như là tốt nhất cho bài toán tìm giá trị trong 1 list đc sorted rồi, nếu muốn tốt hơn thì ta chỉ có cách dùng hash table thoy :v

## Sample questions

- [Order-agnostic binary search](https://leetcode.com/problems/binary-search/)
- [Ceiling of a number](https://leetcode.com/problems/search-insert-position/)
- [Next letter](https://leetcode.com/problems/find-smallest-letter-greater-than-target/)
- [Bitonic array maximum](https://leetcode.com/problems/peak-index-in-a-mountain-array/)
- [Find in mountain array](https://leetcode.com/problems/find-in-mountain-array/)
- [Search in sorted array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [Rotation count](https://www.geeksforgeeks.org/find-rotation-count-rotated-sorted-array/)
