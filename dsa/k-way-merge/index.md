---
title: DSA | K-way Merge
date: 2023-05-28
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về K-way Merge

Đây là 1 pattern ứng dụng kiểu dữ liệu Heap khá hay. Ta sẽ giải quyết các vấn đề yêu cầu thống nhất
các dãy đã sort bằng pattern này.

Input cho các dạng bài này khá đặc trưng, anh em chỉ cần để ý xem input có phải là 1 nhóm các mảng
sorted hay 1 nhóm các sorted linked list thôi. Ví dụ tiêu biểu, cho 3 sorted array:

```rb
A = [1, 3, 4, 6]
B = [2, 3, 3, 5]
C = [4, 5, 8, 9]
```

Merge 3 arrays trên lại với nhau để trả về 1 sorted array duy nhất

```rb
output = [1, 2, 3, 3, 3, 4, 4, 5, 5, 6, 8, 9]
```

Về ý tưởng trước mắt, ta có thể thấy là ta cần phải rà soát từng phần tử nhỏ nhất ở mỗi array để xếp
vào output. Mổ xẻ vào chi tiết sâu hơn, rõ ràng là để rà soát được phần tử nhỏ nhất như vậy thì ta
cần trước hết giữ thông tin phần tử nhỏ nhất của từng array, và rồi đối chiếu từng array để lấy ra
phần tử nhỏ nhất trong toàn bộ.

Như vậy, ta sẽ tạo nên bộ ba khởi đầu, trước tiên anh em có thể hình dung theo data model như sau:

```md
{
  array: The array name,
  minVal: The current minimum value of the array
}
```

Rồi bộ 3 dựa vào data model trên ta được

```md
{A, 1}  {B, 2}  {C, 4}
```

Với mỗi lần lấy số, ta sẽ lấy số nhỏ nhất trong bộ 3 trên, nhưng 1 vấn đề nảy sinh: Khi ta lấy đi 1
số của 1 dãy, ta sẽ update dãy đó chọn số tiếp theo, vậy thứ tự các số thì sao?

Ở bộ 3 số trên, nếu ta lấy `{A, 1}` ra, ta sẽ update số tiếp theo trong array A là 3, và ta có
`{A, 3}`.

```md
{A, 3}  {B, 2}  {C, 4}
```

Điểm cốt lõi để có thể giải quyết bài toán này chính là làm sao để ta luôn giữ cho bộ trên luôn có
thứ tự từ thấp đến cao, nhưng như anh em thấy ở trên nó ko còn theo thứ tự vậy nữa. Chính vì thế,
ta sẽ phải dùng tới Heap để giữ cho bộ số trên luôn theo thứ tự

Như vậy, có thể tóm tắt cách dùng Heap ở pattern này như sau:

1. Insert mỗi phần tử đầu tiên ở mỗi array vào 1 heap
2. Remove phần tử top của heap và add vào merged array
3. Update phần tử tiếp theo dựa theo thông tin array đi kèm
4. Insert phần tử đc update lại heap
5. Repeat bước 2 và 4
