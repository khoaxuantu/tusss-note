---
title: DSA | Heap
date: 2023-08-05
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Heap

[image /img/dsa/min-max-heap.png]
    Min heap & max heap illustration (source: Internet)

## Heap

**Heap** là kiểu cấu trúc dữ liệu đảm bảo mọi dữ liệu luôn được sắp xếp theo theo đúng thứ tự từ cao
tới thấp hoặc từ thấp tới cao. Bình thường ta hay quen với các kiểu bài toán sắp xếp khi mà mình
được cho trước 1 array và được yêu cầu sắp xếp lại cho đúng thứ tự, thì Heap cũng là 1 method tương
đương như vậy (mà nó cũng có 1 kiểu sort riêng gọi là Heap Sort cmnr :v).

Về bản chất, Heap là 1 *complete binary tree* (binary tree được fill lần lượt từng level theo chiều
từ trái sang phải) - binary heap. Heap giúp ta đảm bảo dữ liệu luôn theo thứ tự bằng cách: ở
binary-heap, tất cả các node con phải có giá trị nhỏ hơn/lớn hơn node hiện tại => root node sẽ luôn
là node lớn nhất/nhỏ nhất.

Vì với input là binary tree việc implement heap sẽ khá là khó khăn (phải swap các node với nhau),
nên thay vào đó ta sẽ sử dụng input là array và mô phỏng array cho tương ứng với 1 binary tree bằng
cách tận dụng index của array (quá trình này còn được gọi là heapify). Chi tiết các operations
ta có thể tham khảo ở:

[https://www.programiz.com/dsa/heap-data-structure#operations](https://www.programiz.com/dsa/heap-data-structure#operations)

## Priority Queue

Để giải quyết các bài toán liên quan tới **Heap**, giang hồ sẽ có xu hướng sử dụng **Priority Queue**
hơn. Đây là kiểu dữ liệu kết hợp giữa Queue và Heap. Hiểu nôm na là ta có 1 cái queue FIFO, và khi
ta pop element đầu tiên của nó ra, ta sẽ luôn lấy được giá trị lớn nhất/giá trị nhỏ nhất

=> Cũng nhờ thế mà ta có được dữ liệu theo thứ tự tăng/giảm dần.

> Chi tiết các operations của nó ta tham khảo:
>
> [https://www.programiz.com/dsa/priority-queue](https://www.programiz.com/dsa/priority-queue)
>
> Dễ thấy trong article này họ cho vài cách implement priority queue luôn nhưng cách hiệu quả nhất
> chính là implement với heap.

## Ví dụ

[accordion.tabs name="tabs"]
    ## C++

    ```cpp
    #include <queue>

    priority_queue<DataType> maxHeap;
    priority_queue<DataType, vector<DataType>, greater<DataType>> minHeap;
    ```

    Với các DataType có nhiều hơn 1 giá trị, ta cần thay greater bằng 1 custom comparator ta tự viết ra

    ## Python

    ```py
    import heapq

    inputList = []
    heapq.heapify(inputList)
    ```

    ## Java

    ```java
    import java.util.*;

    PriorityQueue<DataType> pq = new PriorityQueue<>();
    ```

## Chú ý

Với các element ko so sánh được vì có nhiều giá trị con, hoặc ta muốn tự mình quy định là max heap
hay min heap, ta sẽ cần tự viết custom comparator.

Ví dụ trong C++

[http://neutrofoton.github.io/blog/2016/12/29\/c-plus-plus-priority-queue-with-comparator](https://neutrofoton.github.io/blog/cpp/2016/12/29/c-plus-plus-priority-queue-with-comparator.html)

```cpp
auto custCmp = [](DataType& x, DataType& y){
  // If you want a max heap
  return x.val < y.val;
  // If you want a min heap
  return x.val > y.val;
};

// Initialize a priority queue
priority_queue<DataType, vector<DataType>, decltype(custCmp)> pq(custCmp);
```
