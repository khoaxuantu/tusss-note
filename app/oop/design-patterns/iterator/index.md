---
title: Iterator
tags:
  - DesignPattern
  - OOP
id:
unlisted: true
date: 2023-09-07
next_article:
  path: /oop/design-patterns/mediator
  title: Mediator
prev_article:
  path: /oop/design-patterns/command
  title: Command
---

# Iterator

Đây là pattern cho phép ta duyệt các phần tử trong 1 collection mà ko phải "chọc" vào chi tiết bên trong nó (list, stack, tree, etc...).

## Problem

Collections là 1 trong những kiểu dữ liệu đc sử dụng rộng rãi nhất trong programming. Dù sao, 1 collection cũng là 1 container cho 1 nhóm các objects.

Hầu hết collections lưu trữ các phần tử của chúng trong những lists đơn giản. Tuy nhiên, 1 số chúng lại dựa trên stacks, trees, graphs và các loại cấu trúc dữ liệu phức tạp khác. Nhưng bất kể cái collection đc cấu trúc ra sao, nó vẫn phải cung cấp đc cách thức để truy cập tới elements của nó, có như thế mới có thể sử dụng collection ở các đoạn code khác đc. Ta cần phải tìm cách để duyệt qua các elements của collection mà ko phải truy cập đi truy cập lại tới cùng các phần từ.

Nghe thì có vẻ nhẹ nhàng với 1 collection dựa trên 1 list. Ta chỉ cần loop 1 vòng các elements. Nhưng làm thế nào để ta có thể duyệt 1 vòng các phần tử của 1 cấu trúc dữ liệu phức tạp, như tree? Bình thường ta có thể ok với BFS hoặc DFS, nhưng rồi 1 hôm, ta muốn truy câp 1 cách random tới tree elements thì sao.

Thêm càng nhiều thuật toán duyệt phần tử vào trong cái collection thì sẽ càng làm lu mờ trách nhiệm tiên quyết của nó, là 1 nơi lưu trữ dữ liệu hiệu quả. Ngoài ra, vài thuật toán có thể chỉ cố định trong 1 số trường hợp đặc biệt, nên thêm chúng vào 1 generic collection class trông nó khá là bủh.

Mặt khác, client code với việc sử dụng đa dạng các collections ko nên quan tâm tới cách chúng lưu trữ dữ liệu. Tuy nhiên, vì các collections cung cấp các cách khác nhau để truy cập tời các elements, ta ko có lựa chọn nào khác ngoài việc code tới các collection classes cụ thể ở client.

## Solution

Ý tưởng chính của Iterator pattern là trích ra trạng thái traversal của 1 collection thành 1 object riêng gọi là _iterator_.

Bên cạnh việc tự implement thuật toán, 1 iterator object che đi tất cả chi tiết vể cách duyệt, như là vị trí hiện tại hoặc còn bao nhiêu elements còn lại. Nhờ đó, vài iterators có thể duyệt cùng 1 collection trong 1 thời điểm đồng thời hoạt động độc lập vs nhau.

Thông thường, iterators cung cấp 1 primary method để quét các phần tử của collection. Client có thể tiếp tục chạy method này cho đến khi nó ko còn trả lại gì nữa, đồng nghĩa vs việc cái iterator đã duyệt hết tất cả phần tử. Tất cả iterators phải implement cùng loại interface. Nhờ thế client code mới ko phải quan tâm từng loại collection đc duyệt ra sao, chúng chỉ cần gọi đúng method từ interface còn logic bên trong sẽ do từng iterator quyết định.

[image]
  src: /img/oop/iterator-1.webp
  alt: Iterator solution
  caption: "Iterator solution (Source: Refactoring Guru)"

```ts
import { Queue } from 'queue-typescript';

interface BaseIterator {
    currentElement: Element,
    hasMore: () => bool,
    getNext: () => Element
}

class Element {
    public val: int;
    public left?: Element = null;
    public right?: Element = null;

    constructor() {
        this.val = 0;
    }

    constructor(val: number) {
        this.val = val;
    }
}

class TreeCollection {
    private root: Element;
    private iterator?: BaseIterator = null;

    constructor() {
        buildTree();
    }

    traverse() {
        if (!iterator) throw Error("Select iterator first");
        let arr = [];
        while(this.iterator.hasMore()) {
            arr.push(this.iterator.getNext().val);
        }
    }

    getDepthIterator() {
        this.iterator = new DFSIterator(this.root);
    }

    getBreadthIterator() {
        this.iterator = new BFSIterator(this.root);
    }
}

class DFSIterator implements BaseIterator {
    private nodeStack: Element[];

    constructor(root: Element) {
        this.currentElement = root;
        this.nodeStack = [];
    }

    hasMore() {
        return this.nodeStack.length !== 0;
    }

    getNext() {
         /* Implement Depth first iterator */
    }
}

class BFSIterator implements BaseIterator {
    private q: Queue;

    constructor(root: Element) {
        this.Element = root;
        this.q = new Queue<number>();
    }

    hasMore() {
        return this.q.length !== 0;
    }

    getNext() {
        /* Implement Breadth first iterator */
    }
}
```

## Structure

[image]
  src: /img/oop/iterator.webp
  alt: Iterator structure diagram
  caption: Iterator structure diagram

1. **Iterator** interface declares các operations cần thiết cho việc duyệt 1 collection
2. **Concrete** Iterators implement các thuật toán cụ thể cho việc duyệt collection
3. **Collection** interface declares 1 hoặc nhiều methods cho việc lấy iterators sẽ đc sử dụng cho collection
4. **Concrete Collections** trả về các instances của các interator riêng biệt mỗi lần client yêu cầu tới
5. **Client** làm việc với cả collections lẫn iterators thông qua interface của chúng. Nhờ thế client ko phải để ý tới chi tiết từng classes khác biết, cho phép ta sử dụng đa dạng collections và iterators với cùng 1 client code

---

Tham khảo thêm về `Iterator` tại [https://refactoring.guru/design-patterns/iterator](https://refactoring.guru/design-patterns/iterator "Iterator - Refactoring Guru")
