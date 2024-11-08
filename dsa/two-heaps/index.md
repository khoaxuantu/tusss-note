---
title: DSA | Two Heaps
date: 2023-05-28
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Two Heaps

Cái tên nói lên định nghĩa, ở pattern này ta sẽ sử dụng liền 2 Heap để giải quyết bài toán.

Bởi vì ta đưa hết vô heap cho dạng này, ta cần chú ý mỗi operation insert hay remove của ta với heap
sẽ tốn O(logn) time complexity, và để access tới giá trị root của heap sẽ chỉ tốn O(1) time. Nhớ
được mấy cái này sẽ giúp ta dễ tính độ phức tạp của các bài áp dụng pattern này hơn.

Để ôn lại về heap, ta có thể qua đây tham khảo:
[Luận bàn về Heap](/dsa/heap)

Ta sẽ cần chọn giữa [1 maxHeap với 1 minHeap], [2 maxHeap] hoặc [2 minHeap], tùy vào yêu cầu đề bài.

- Với bài yêu cầu xử lý các element có giá trị trong khoảng giữa của input/data stream (ví dụ như
tìm median), ta sẽ cần tới 1 maxHeap và 1 minHeap và đảm bảo giá trị lớn nhất của maxHeap < giá trị
nhỏ nhất của minHeap.
- Với bài yêu cầu xử lý 2 giá trị lớn nhất, ta có thể sẽ cần tới 2 maxHeap.
- Với bài yêu cầu xử lý 2 giá trị nhỏ nhất, ta có thể sẽ cần tới 2 minHeap.

Sẽ ko có code snippet chung cho dạng này, vì câu chuyện sẽ chỉ là ta cần khởi tạo 2 heap và xử lý
input xoay quanh 2 heap đó thoy. Pseudocode thì chắc là như này =)))

```md
Initialize the first heap
Initialize the second heap
Iterate the input stream
  Decide to push to the first heap or the second heap
Do something with the complete 2 heaps
```
