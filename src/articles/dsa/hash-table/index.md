---
title: DSA | Hash Table
date: 2023-03-04
author: Xuan Khoa Tu Nguyen
unlisted: true
include:
  - components/accordion
---

# Luận bàn về Hash Table

**Hash table** là cấu trúc dữ liệu mà tại đó ta lưu mỗi element theo dạng `{key: value}`
(khóa chính - giá trị). Mục đích của Hash table chính là tối ưu tìm kiếm dữ liệu nên đây chính là
cấu trúc dữ liệu đầu tiên anh em cần nghĩ tới mỗi khi cần truy cập dữ liệu nào đó một cách nhanh
nhất.

## Ưhy???

Đầu tiên thử liệt kê 1 chút vài cách tìm kiếm phổ biến nhất: Binary Search, Linear search, etc...
Linear search thì chẳng khác gì brute force, duyệt từng phần tử để tìm phần tử thỏa mãn điều kiện.
Điều này khiến nó bị a đuồi, O(n^k) - polynomial time??? Oẳng 🐧

> À, với ai chưa quen với complexity, ae có thể check qua bài này ... .

Binary search thì tốt hơn nhiều, chỉ có O(logn), cũng là first option nếu muốn tìm phần tử trong
1 mảng sort, sau này nó sẽ được nhắc lại trong 1 pattern riêng. Tuy nhiên, cách tìm này vẫn chưa
phải là tối ưu nhất vì nên nhớ trong time comlexity, tối ưu nhất ta có chính là constant time - O(1).

Vậy làm sao để đạt được tối ưu, câu trả lời chính là hash table. Với cấu trúc `{key: value}`, ta dễ
dàng truy cập 1 phần tử ngay lập tức bằng cách đưa cho thg hash table cái key.

Rồi thế làm thế nào mà đưa cái key lại chỉ tốn có O(1), ta sẽ chuyển qua phần dưới, giải thích về
quá trình gọi là hashing của thằng hash table.

## Hashing

Đây là quá trình nối cái key với một index trong hash table. Nôm na thì thg hash table bản chất nó
ở dạng cơ bản nhất là cũng được tạo ra từ array, nên nó cần cái index để truy cập vô, và thông qua
hash, ta sẽ generate cái key ra 1 cái index để truy cập vào cái array đó.

```
hash(key) = index
```

Với function `hash()`, ta chỉ cần 1 phép tính là ra kết quả, ví dụ

```
// C++
int MOD = 10;

int hash(int key) {
  return key % MOD;
}
```

Nên cuối cùng là tốn có O(1) thoy :v

Có rất nhiều cách hashing khác nhau, tất cả nhằm mục đích sao cho với mỗi key, function hash() sẽ
trả về 1 kết quả khác nhau. Trên thế giới ng ta cũng có nhiều nghiên cứu về các hashing function
rồi. Ae ta newbie nên có thể tham khảo trước bài viết về mấy cái hash function phổ biến sau

[https://www.geeksforgeeks.org\/hash-functions-and-list-types-of-hash-functions/](https://www.geeksforgeeks.org/hash-functions-and-list-types-of-hash-functions/)

**Các cách sử dụng hash table với một số ngôn ngữ lập trình**

[accordion.tabs name="tabs"]
  ## C++

  ```cpp
  unordered_map<KeyType, ValType> map;
  map<KeyType, ValType> map;
  unordered_set<KeyType> set;
  set<KeyType> set;
  ```

  ## Java

  ```java
  // Theo giới giang hồ
  Map<KeyType, ValType> map = new HashMap<KeyType, ValType>();
  Set<KeyType> set = new HashSet<KeyType>();
  ```

  ## Python

  ```py
  # Dùng dict và set
  map = {key: value}
  set = set()
  ```

  ## JavaScript

  ```js
  // Dùng object và Set
  const map = {key: value};
  const set = new Set()
  ```

## Sample questions

- [Design hashmap](https://leetcode.com/problems/design-hashmap)
- [Fraction to recurring decimal](https://leetcode.com/problems/fraction-to-recurring-decimal)
- [Logger rate limiter (premium)](https://leetcode.com/problems/logger-rate-limiter) / [(free)](https://www.lintcode.com/problem/3620/)
- [Next greater elemernt](https://leetcode.com/problems/next-greater-element-i)
- [Isomorphic strings](https://leetcode.com/problems/isomorphic-strings)
- [Longest palindrome](https://leetcode.com/problems/longest-palindrome)
