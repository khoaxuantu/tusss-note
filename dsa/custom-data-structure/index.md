---
title: DSA | Custom Data Structure
date: 2023-08-28
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Custom Data Structure

Tới nay có thể nói là ta đã biết đc kha khá loại cấu trúc dữ liệu rồi. Tất cả đều là các loại cơ bản
giúp ta có thể thực hiện các phương pháp giải thuật khác nhau để giải quyết thành công vấn đề.

Dù vậy, chỉ với các loại cơ bản thì đương nhiên là ko đủ để xử lý mọi bài toán. Vẫn còn rất nhiều
bài yêu cầu 1 cấu trúc dữ liệu cụ thể và phức tạp hơn thế, và để có thể implement đc chúng cũng là 1
độ khó nhất định. Thành ra dạng bài custom data structures ra đời. Nếu ta đã luyện nhiều trên các
nền tảng luyện giải thuật như leetcode, hackerrank, etc..., thì ta sẽ dễ dàng bắt gặp 1 bài nào đó
 yêu cầu mình phải thiết kế ra 1 cấu trúc dữ liệu riêng để giải quyết 1 chức năng cụ thể.

Đương nhiên, trong các vòng coding interview, những bài thuộc loại này sẽ ko bị loại trừ ra rồi.
Tôi gặp 1 vòng rồi, trust me bro...

Với dạng này, cách xử lý sẽ rất đa dạng vì nó liên quan tới khía cạnh thiết kế nữa. Nhưng qua nhiều
lần giải, tôi có thể đúc kết vài tips hay ho như sau:

- Quen thuộc với `Class`
- Sử dụng các cấu trúc dữ liệu cơ bản (array, linked list, hash table, queue, stack, heap, graph)
để xây dựng nên các cấu trúc dữ liệu phức tạp hơn
- Chú ý làm sao để ta có thể tối ưu performance của cấu trúc dữ liệu tốt nhất có thể. Kiểm tra Big O
trong mỗi method, đáp án tốt nhất trong dạng bài này chính là mỗi method của cấu trúc dữ liệu tối ưu
cả về thời gian chạy lẫn bộ nhớ tiêu hao
- Đọc kỹ đề bài 🙂

## Sample questions

- [Snapshot array](https://leetcode.com/problems/snapshot-array)
- [Time-based key-value store](https://leetcode.com/problems/time-based-key-value-store)
- [Implement LRU cache](https://leetcode.com/problems/lru-cache)
- [Insert delete getRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1)
- [Min stack](https://leetcode.com/problems/min-stack)
- [LFU cache](https://leetcode.com/problems/lfu-cache)
