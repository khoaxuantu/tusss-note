---
title: DSA | Subsets
date: 2023-06-12
author: Xuan Khoa Tu Nguyen
unlisted: true
---

# Luận bàn về Greedy

Anh em ắt hẳn ko ít thì nhiều gặp khó trong các bài toán tối ưu (optimization problems), nhất là với
những anh em mới tập tành code.

Thông thường, gặp những bài toán tìm phương án tối ưu, não ta sẽ chủ động nghĩ tới các phương án mà
ta tưởng như là đúng nhất (kiểu trust me bro) nên chắc hẳn anh em nhiều khi sẽ chủ động hướng cách
giải của mình vào việc tìm đáp án tối ưu ở các khoảng xử lý nhỏ hơn, hay subproblems nhỏ hơn. Đây
ko hẳn là 1 phương án ngu ngốc, khi mà nhiều vấn đề nó lại là cách trực diện mà hay nhất để ta tìm
ra đáp án. Với độ hiệu quả của nó, ta có được thuật ngữ **Greedy**.

Lấy 1 ví dụ nổi tiếng về **Coin problem**:

Cho trước 4 loại coin mức `$1`, `$2`, `$5`, `$10`. Với `N` tổng giá trị, ta sẽ có lượng coin nhỏ
nhất là bao nhiêu?

Dễ thấy để có lượng coin nhỏ nhất, ta sẽ cần lấy trước hết coin có value lớn nhất để có thể giảm giá
trị `N` đi nhanh nhất. Như vậy, với `N=25$`, ta sẽ giải quyết bài toán như sau:

```md
coin = 0, N = 25    =>    put a $10
coin = 1, N = 15    =>    put a $10
coin = 2, N = 5     =>    put a $5
coin = 3, N = 0     =>    end
So we need 3 coins at least which are $10, $10, $5 for $25
```

Bài tập trên có trong nhiều lecture giới thiệu về nnlt chứ ko phải giải thuật rồi, và nếu anh em ko
nhận ra, thì cách giải trên chính là cách anh em ứng dụng Greedy để giải quyết bài toán.

**Greedy Techniques** là thuật ngữ để diễn tả một mẫu giải thuật chung về việc ở mỗi bước giải một
bài toán, ta chọn xử lý một lựa chọn tối ưu chỉ trong bước đó, rồi kết hợp từng giá trị tối ưu trong
từng bước để hi vọng tìm ra kết quả tối ưu cho toàn bài toán.

Trong bài toán **Coin problem** trên, với mỗi bước, ta lại chọn ra loại coin có value lớn nhất có
thể dùng đc (tối ưu nội trong 1 bước) để khấu trừ giá trị `N`, và trả về kết quả là tổng số bước ta
phải khấu trừ (kết quả tối ưu).

1 ví dụ cụ thể nữa:

Cho trước 4 container bao gồm 1 `20kg`, 1 `25kg`, 1 `40kg`, 1 `60kg` và 1 cargo có thể chứa tối đa
`90kg`. Cái cargo này có thể chứa nhiều nhất bao nhiêu container?

Áp dụng **Greedy**, ta lựa các container theo hướng tăng dần, như vậy:

```md
containers = 0, capacity = 90  =>  add 20kg-container
containers = 1, capacity = 70  =>  add 25kg-container
containers = 2, capacity = 45  =>  add 40kg-container
containers = 3, capacity = 5   =>  end, the capacity isn't enough for the 60kg-container
So we can add maximum 3 containers
```

## Follow up

1 hạn chế của **Greedy** đó chính là chỉ áp dụng giải được 1 số bài toán nhất định. Vì **Greedy** tìm kết
quả tối ưu dựa trên các giá trị cực trị , nên nó ko thể chắc chắn liệu giá trị tổng hợp cuối cùng là
tối ưu hay không.

Chẳng hạn như ví dụ container ở trên, nếu ta thêm value bất kỳ cho mỗi container và đổi câu hỏi
thành value lớn nhất mà cargo có thể chứa được là gì, thì **Greedy** ko thể giải bài này được nữa,
ta sẽ buộc phải tìm cách khác.

## Sample questions

- [Jump game](https://leetcode.com/problems/jump-game/)
- [Boats to save people](https://leetcode.com/problems/boats-to-save-people/)
- [Gas station](https://leetcode.com/problems/gas-station/)
- [Two city scheduling](https://leetcode.com/problems/two-city-scheduling/)
- [Jump game II](https://leetcode.com/problems/jump-game-ii/)
