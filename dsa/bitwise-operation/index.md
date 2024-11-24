---
title: DSA | Bitwise Operation
date: 2023-09-26
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Bitwise Operation

> Góc tự nhục, xuyên suốt 10 tháng ôn coding interview với hàng trăm bài luyện tập, thì somehow các
> bài luyên quan tới bitwise tôi lại chỉ luyện có tầm 10 20 bài gì đó, và hậu quả là thường xuyên bị
> trớ khi gặp phải những câu hỏi tương tự lúc blind leetcode 🙂 Để mà nói thì đến giờ tôi vẫn chưa
> sẵn sàng giải bài nào thuộc dạng bitwise đâu, vì 1 lý do nào đó mà ko thể tập trung nổi :v

Nhưng ko sẵn sàng giải ko có nghĩa là tôi ko thể hiểu đc nó. ~~Tôi lười dei~~. Và dạng này nói gì
thì nói vẫn là 1 dạng đã đc hỏi trong interview, nên dù oải thì vẫn ko đc phép bỏ qua nó dou.

**Bitwise manipulation** là quá trình chỉnh sửa các bits 1 trực tiếp bằng code thông qua các
bitwise operators. Chỉnh logic ở cấp độ bits chính là cách để máy tính thực hiện tính toán nhanh
nhất vì ta đã trực tiếp ra lệnh các processors xử lý mà ko phải thông qua lớp trung gian nào cả.
Cũng dễ hiểu vì sao các công ty lại đưa dạng này vào hỏi, nhất là mấy công ty chủ đạo về phần cứng
hoặc hệ thống native - low level.

Trước khi nhảy vô các operators, ta cần phải làm rõ convention khi đọc đoạn binary code đã, nó hơi
lừa tẹo.

> [Check out Quora thread để hiểu rõ hơn](https://qr.ae/pK8WZb)

Có 4 logical operator đc sử dụng phổ biến trong dạng này:

- NOT (`~`) - đc gọi là unary operator. Nếu 1 argument là 1-bit, operator này sẽ thay nó thành bit nghịch đảo (1 thành 0, 0 thành 1). Nếu argument là 1 chuỗi các bits, tất cả các bits trong chuỗi sẽ đc nghịch đảo.
- AND (`&`) - Nếu cả 2 bits là 1, thì kết quả là 1. Nếu ko thì kết quả là 0.
- OR (`|`) - Nếu ít nhất 1 trong 2 bits là 1, thì kết quả là 1. Nếu ko thì kết quả là 0.
- XOR (`^`) - Nếu cả 2 bits bằng nhau, thì kết quả là 0. Ngược lại thì kết quả là 1.

```cpp
a == 1;
~a; // 0

a = 1, b = 1, c = 0, d = 0;

a & b == 1;
a & c == 0;

a | c == 1;
a | b == 1;
a | d == 0;

a ^ b == 0;
a ^ c == 1;
```

Ngoài ra, ta còn sử dụng khá nhiều 2 bitwise operators như sau:

- Shift right (`>>`) - Dịch tất cả bit-1 trong 1 dãy bits sang phải n ô (bits)
- Shift left (`<<`) - Dịch tất cả bit-1 trong 1 dãy bits sang trái n ô (bits)

Thông thường, ta có thể để ý các input của bài tập thuộc pattern này đề là các đại số thường hay các
char, chuỗi và ta thường đc yêu cầu thực hiện các phép tính logic thay vì giải thuật thông thường.

## Sample questions

- [Find the difference](https://leetcode.com/problems/find-the-difference)
- [Complement of base 10 number](https://leetcode.com/problems/complement-of-base-10-integer)
- [Flipping an image](https://leetcode.com/problems/flipping-an-image)
- [Single number](https://leetcode.com/problems/single-number)
- [Two single numbers](https://leetcode.com/problems/single-number-iii/)
- [Encode and decode string](https://leetcode.com/problems/encode-and-decode-strings)
- [Reverse bits](https://leetcode.com/problems/reverse-bits)
