---
title: DSA | Linked List's In-place Reversal
date: 2023-04-17
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Linked List's In-place Reversal

Khi ta giải các problems liên quan đến linked list, dễ thấy ta sẽ gặp khá nhiều câu hỏi yêu cầu đảo
lại cái list đó. Cái cách brute force mà ta có thể nghĩ tới ở đây là tạo 1 linked list mới và kết
nối các giá trị node tương ứng theo chiều ngược lại.

Cách làm này nó á đù thật khi mà với mỗi node, ta lại phải chạy từ head node tới node đó để có thể
kết nối tới list mới, điều này sẽ khiến ta đạt tới O(n^2) về time comlexity.

Với pattern này, ta sẽ được làm quen với cách để đảo 1 cái linked list mà ko phải tốn thêm bộ nhớ,
và sẽ chỉ phải tốn O(n) time khi mà chỉ cần 1 vòng lặp duyệt hết cái input linked list là được rồi.

Ta sẽ sử dụng sức mạnh của pointer cho pattern này, được biết mỗi node sẽ có dạng sau:

```md
Class Node is:
  val: number
  Next: Node // A ptr pointing to next node
```

Ở node cuối ta sẽ có next node chỉ tới `NULL`

```md
Next = nullptr
```

Ý tưởng thì nó tương đối dễ hiểu nhưng cũng dễ lừa, trong 1 linked list **1 -> 2 -> 3 -> 4 -> 5**,
ta gán node đầu tiên vào 1 pointer mới tượng trưng cho node cuối cùng, gọi là *tail*, rồi đảo mỗi
node tiếp theo của node *tail* lên đầu list. Như vậy, cái list sẽ được diễn tả như sau:

```md
header->1(tail)->2->3->4->5->null | Gán pointer tail vào node 1
header->2->1(tail)->3->4->5->null
header->3->2->1(tail)->4->5->null
header->4->3->2->1(tail)->5->null
header->5->4->3->2->1(tail)->null
```

Snippet:

```py
# python
tail = head
# Lặp đến khi tail.next không phải là null
while tail.next:
  nextNode = tail.next # Lây node tiếp theo (nextNode)
  tail.next = nextNode.next # Kêt nối node đuôi với node tiêp theo của nextNode
  nextNode.next = head # Kêt nối nextNode với node đầu tiên của list
  head = nextNode # Gán pointer head vào nextNode
```

### Follow up

- Ta cần chú ý node *tail*, node `nextNode` và *head* cho pattern này
- Nhiều bài ta chỉ phải đảo 1 đoạn trong linked list, khi đó thay vì *head*, ta cần có 1 pointer
thay thế đảm nhiệm chức năng tương tự cho *head*. Ví dụ:
  + Ta cần đảo đoạn 2->3->4 trong đoạn 1->2->3->4->5. Ta sẽ phải tạo 1 ptr `firstNode` trỏ vào node
  ở trước node 2 (node 1), khi đó `firstNode.next` sẽ có chức năng tương tự với *head*
