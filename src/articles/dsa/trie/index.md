---
title: DSA | Heap
date: 2023-08-28
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Trie

[image /img/dsa/trie.webp]
    Trie illustration (Credit: educative.io)

**Trie** là ứng dụng mở rộng của cấu trúc dữ liệu dạng tree được sử dụng rộng rãi cho việc giải quyết
vấn đề liên quan tới lưu trữ và locating các keys từ set cho trước. Các keys này thường đc biểu diễn
như các strings và được lưu trữ trong trie theo dạng từ chữ cái này sang chữ cái khác. Nói cách khác,
mỗi node của trie sẽ lưu trữ 1 chữ cái của 1 string, và từ root node, ta truy node này qua node khác
để có đc 1 chuỗi hoàn chỉnh.

Ứng dụng phổ biến thường thấy nhất của trie có thể kể đến đó là search engines, từ điển, etc...
Trong các dạng bài tập, ta sẽ chủ yếu ứng dụng trie để xử lý 1 set các chuỗi.

Để ý trong ảnh trên, ở node (level) đầu tiên mà root node chỉ tới ta có lưu trữ 2 chữ cái, chính là
2 chữ cái đầu tiên của 'are' và 'two', tiếp theo node 2 là chữ cái thứ 2, rồi node 3 sẽ là chữ cái
thứ 3. Well, đại khái thì cơ chế của trie thì cũng dễ hiểu vậy thôi, còn implement thế nào thì cũng
hơi dài dòng chút

## Implementation

Ta có thể nhận thấy các node là thành phần duy nhất cấu tạo nên cấu trúc dạng cây cho trie, thế nên
đầu tiên, ta cần thiết kế riêng 1 class biểu thị node cho chúng. Ta gọi class đó là `TrieNode`.

Ở trong mỗi node, ta sẽ cần 1 trường để chứa các chữ cái, từ mỗi chữ cái này ta kết nối với node
tiếp theo, tương tự như cách các node liên kết trong linked list hay tree.

Tiếp đến, ta cần 1 cái flag để đánh dấu node kết thúc của 1 string, đây sẽ là node mà chữ cái cuối
cùng trong string đó trỏ đến, nên ta có thể tạo 1 trường boolean, lấy tên là `isEnd`.

```cpp
class TrieNode {
public:
  unordered_map<char, TrieNode*> next;
  bool isEnd;

  TrieNode() {
    this->isEnd = false;
  }
}
```

Có được `TrieNode` rồi, ta sẽ bắt đầu tạo class `Trie`. Trong class này, ta sẽ cần 1 trường biểu thị
root node, là nơi bắt đầu ngọn cây cho cả cấu trúc trie.

1 trie sẽ có 2 methods cơ bản nhất:

- `insert()`: Để đưa 1 string vào cấu trúc trie
- `exists()`: Để truy tìm 1 string liệu đã tồn tại trong cấu trúc trie chưa

Trong `insert()` method, ta sẽ đi lần lượt từng char 1, mỗi char ta sẽ check liệu trong hash table
`next` đã trỏ tới node tiếp theo chưa. Nếu có rồi, ta sẽ chạy con trỏ tới node tiếp theo. Còn nếu
chưa, ta sẽ tạo mới 1 `TrieNode` và chạy tới node đó.

```cpp
void insert(string& s) {
  TrieNode* runner = this->root;
  for (char& c : s) {
    if (!runner->next[c]) runner->next[c] = new TrieNode();
    runner = runner->next[c];
  }
  runnert->isEnd = true; // Mark the final node as the end
}
```

Ở `exists()` method, ta sẽ chạy các node y như hàm insert trên, chỉ khác chỗ là nếu ta gặp đc char
trỏ tới rỗng trong trường next khi chưa chạy hết string, ta sẽ trả về false, còn khi đi tới node
`isEnd` là true, ta sẽ trả về true

```cpp
bool exists(string& s) {
  TrieNode* runner = this->root;
  for (char& c : s) {
    if (!runner->next[c]) return false;
    runner = runeer->next[c];
  }
  return runner->isEnd; // isEnd now is true
}
```

Như vậy, 1 class `Trie` của ta sẽ có code như sau

```cpp
class Trie {
private:
  TrieNode* root;
public:
  Trie() {
    this->root = new TrieNode();
  }

  void insert(string& s) {
    TrieNode* runner = this->root;
    for (char& c : s) {
      if (!runner->next[c]) runner->next[c] = new TrieNode();
      runner = runner->next[c];
    }
    runnert->isEnd = true; // Mark the final node as the end
  }

  bool exists(string& s) {
      TrieNode* runner = this->root;
      for (char& c : s) {
        if (!runner->next[c]) return false;
        runner = runeer->next[c];
      }
      return runner->isEnd; // isEnd now is true
  }

  bool existsPrefix(string& s) {}
}
```

## Sample questions

- [Implement trie](https://leetcode.com/problems/implement-trie-prefix-tree)
- [Search suggestion system](https://leetcode.com/problems/search-suggestions-system)
- [Replace words](https://leetcode.com/problems/replace-words)
- [Design add & search words data structure](https://leetcode.com/problems/design-add-and-search-words-data-structure)
- [Word search II](https://leetcode.com/problems/word-search-ii)
- [Lexicographical numbers](https://leetcode.com/problems/lexicographical-numbers)
