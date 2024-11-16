---
title: DSA | Merge Intervals
date: 2023-04-10
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Merge Intervals

Ở pattern này, ta sẽ cần làm quen với 1 kiểu dữ liệu custom là `Interval`.

Mỗi `Interval` sẽ được biểu diễn bởi 2 giá trị start và time. Ví dụ, 1 Interval của [10, 20] có đơn
vị start là 10 còn đơn vị end là 20. Có nhiều cách để thể hiện kiểu dữ liệu này trong code. Trong
các đề bài giải thuật, ta sẽ thường thấy người ta hay cho trước Interval các kiểu như sau:

- Kiểu array:

```cpp
// c++
vector<vector<int>> Intervals {{1,2}, {3,5}, {4,7}};
```

- Kiểu class:

```cpp
// c++
class Interval
{
public:
  int start;
  int end;
  Interval(int start, int end) : start(start), end(end) {}
};

vector<Interval> intervals {{1,2}, {3,5}, {4,7}};
```

Pattern này được áp dụng khá phổ biến trong các vấn đề về sắp xếp thời gian biểu (scheduling) và
input của nó khá đặc trưng nên anh em có thể dễ dàng nhận biết dạng bài này.

Để giải được các vấn đề liên quan tới **Merge Intervals**, chủ yếu ta sẽ cần phải nắm vững cách mà 2
`Interval` overlap nhau. Cho trước `Interval` x và `Interval` y, có 6 kiểu overlap tất cả:

- No overlap, x starts before y

```md
x:[1,2]  y:[3,4]
```

- x.end after y.start

```md
x:[1,3]  y:[2,4]
```

- y completely ovelaps x

```md
x:[1,4]  y:[2,3]
```

- y.end after x.start

```md
x:[2,4]  y:[1,3]
```

- x completely overlaps y

```md
x:[2,3]  y:[1,4]
```

- No overlap, y starts before x

```md
x:[3,4]  y:[1,2]
```


Thế thoy ~

Follow up:
- Hầu như ở các dạng bài này, input của ta đều cần yêu cầu theo thứ tự thống nhất. Nếu đề bài họ cho input đã sorted thì ko sao, còn ko thì ta sẽ phải kiếm các built-in function để đưa input về đúng thứ tự thôi
- Có 2 cách để giải quyết các input theo thứ tự:
  - Dùng `sort()`
  - Dùng `priority_queue` hoặc `heap`
- Trong các ví dụ thường thấy cho sort() hay priority_queue, ta chỉ áp dụng đối với 1 kiểu dữ liệu
đơn như `int`, `char`, etc... nhưng ở đây ta có cả 1 cục `Interval`. Vậy nên ta sẽ cần tới cái mà
giang hồ gọi là *custom comparator*. Chi tiết gg search trc nhé 💀

