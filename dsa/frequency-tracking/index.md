---
title: DSA | Frequency Tracking
date: 2023-09-11
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Frequency Tracking

> 1 pattern phổ biến ứng dụng hash table

Pattern này hầu như đc sử dụng để tìm frequency count của dữ liệu sao cho tránh exponential time
complexity cho việc tìm duyệt các phần tử. Bằng cách xác định key mang giá trị số được thể hiện từ
dữ liệu đầu vào và lưu chúng vào hash tables, ta có thể rút gọn việc tìm frequency xuống còn O(1)
time.

Các kiểu dữ liệu đầu vào mà sử dụng được với pattern này sẽ chủ yếu là array với string. 1 ví dụ cơ
bản nhất cho pattern này chính là yêu cầu tìm chữ cái xuất hiện nhiều nhất trong 1 chuỗi. Với
**tracking frequency**, ta sẽ lưu số lần xuất hiện của mỗi phần tử vào 1 hash table, và rồi lấy ra
key (chữ cái) có giá trị lớn nhât...

Tóm lại, trong pattern **tracking frequency**, ta follow chính 2 bước sau:

1. Xây dựng hash table
2. Từ các giá trị frequency trong hash table, ta xử lý để trả về kết quả mà đề bài yêu cầu

## Follow up

- Ta sẽ cần lình hoạt lựa chon key cho hash table, đây có lẽ là phần khó nhất trong hầu hết các bài
tập về tracking frequency này.
- Ae có thể để ý, trong pattern **sliding window**, nhiều bài ta cũng sử dụng kỹ thuật
**tracking frequency**, hầu hết chính là để track frequency của các phần tử nằm trên 1 window.

## Sample questions

- [Palindrome permutation](https://www.lintcode.com/problem/916/)
- [Valid anagram](https://leetcode.com/problems/valid-anagram)
- [Design Tic-tac-toe](https://www.lintcode.com/problem/746/description)
- [Group anagrams](https://leetcode.com/problems/group-anagrams)
- [Maximum frequency stack](https://leetcode.com/problems/group-anagrams)
- [First unique character in a string](https://leetcode.com/problems/first-unique-character-in-a-string)
- [Find all anagrams in a string](https://leetcode.com/problems/first-unique-character-in-a-string)
- [Longest palindrome by concatenating two-letter words](https://leetcode.com/problems/longest-palindrome-by-concatenating-two-letter-words)
- [Ransom note](https://leetcode.com/problems/ransom-note)
