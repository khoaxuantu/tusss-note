---
title: DSA | Queue
date: 2023-03-27
author: Xuan Khoa Tu Nguyen
unlisted: true
include:
  - components/accordion
---

# Luận bàn về Queue

[image //media.geeksforgeeks.org/wp-content/cdn-uploads/20221213113312/Queue-Data-Structures.png]
    Queue illustration (Credit: GeeksforGeeks)

**Queue** là 1 kiểu cấu trúc dữ liệu rất dễ hiểu. Nó chỉ có quy tắc duy nhất là FIFO, hay còn gọi là
First In First Out, element đi vô queue đầu tiên thì sẽ ra khỏi queue đầu tiên.

Anh em có thể liên tưởng đến hàng người đang xếp hàng chờ đặt đồ ăn, first come first serve... là đủ
để hiểu queue hoạt động ra sao rồi. Queue sẽ vô cùng hữu dụng trong các task yêu cầu xử lý I/O,
jobs scheduling, asynchronously data transfer, etc...

Các **operations** cơ bản của queue

- **Enqueue:** add 1 element vào queue
- **Dequeue:** remove 1 element tại vị trí đầu của queue
- **IsEmpty:** check xem cái queue nó có rỗng ko
- **isFull:** check xem cái queue nó có đạt tới giới hạn cho trước ko
- **Peek:** lấy giá trị của element đầu tiên của queue mà ko xóa nó đi

***Ví dụ***

```md
Queue q
```

[accordion.tabs name="tabs"]
    ## C++

    ```cpp
    #include<queue>

    queue<DataType> q;
    ```

    ## Python

    ```py
    from queue import Queue

    q = Queue()
    ```

    ## Java

    ```java
    import java.util.Queue;
    import java.util.LinkedList;

    Queue<DataType> q = new LinkedList();
    ```

    ## JS/TS

    ```js
    import { Queue } from '@datastructures-js/queue';

    const queue = new Queue();
    ```

Anh em nào hứng thú với cách 1 queue được implement như nào thì có thể tham khảo của tụi programiz

[https://www.programiz.com/dsa/queue#code](https://www.programiz.com/dsa/queue#code)
