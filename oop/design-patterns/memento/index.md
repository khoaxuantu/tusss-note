---
title: Memento
tags:
  - OOP
  - DesignPattern
id:
unlisted: true
date: 2023-09-22
next_article:
  path: /oop/design-patterns/observer
  title: Observer
prev_article:
  path: /oop/design-patterns/mediator
  title: Mediator
---

# Memento

Đây là pattern cho phép ta lưu trữ 1 state trước đó của 1 object mà ko làm bộc lộ ra chi tiết implement của nó.

## Problem

Thử tưởng tượng ta đang tạo 1 text editor app. Bên cạnh việc chỉnh sửa text, editor của ta có thể format text, syntax highlighting, etc...

Ở lúc nào đó, ta quyết định cho users undo bất kỳ operations nào liên quan tới việc chỉnh sửa text. Tính năng này đã là phổ biến từ xưa tới nay nên giờ mọi ng chắc chắn yêu cầu nó rồi. Cho việc implementation, ta chon cách tiếp cận trực diện. Trc khi thực hiện bất kỳ chỉnh sửa gì trong text, app sẽ ghi lại state của tất cả objects và lưu chúng đâu đó trong storage. Về sau, khi mà ng dùng quyết định undo, app sẽ lấy state đã đc lưu trong lịch sử và restore state đó lại.

Đào sâu 1 chút về đống state snapshot này. Chúng ta quy ước 1 state chính xác là như nào? Chắc chắn ta sẽ cần đi qua tất cả các trường trong 1 object và copy giá trị của chúng vào storage. Tuy nhiên, việc này chỉ hiệu quả nếu object cho phép show hết content của chúng ra. Thật ko may, hầu hết objects thật sự ko cho ta khả năng truy cập dễ thế với tất cả data quan trọng đc đặt trong private fields.

Vậy là ta đang có 1 tình huống oái oăm, để private thì sẽ ko thể copy các trường, để public thì lại là unsafe code. Thậm chí nếu sau này ta muốn refactor objects, thêm hoặc xóa bớt trường đi, ta lại phải để ý thay đổi các classes chịu trách nhiệm copy state của objects bị ảnh hưởng.

Thêm nữa, thử để ý "snapshots" thực sự cho state của editor. Sẽ có dữ liệu gì trong nó? Ở mức tối thiểu, nó phải chứa đc text, vị trí của con trỏ hay vị trí lăn chuột, etc... Để tạo ra 1 snapshot, ta cần phải thu thập tất cả dữ liệu kiểu vậy và cho nó vào 1 kiểu container.

Ta sẽ lưu rất nhiều container objects này trong 1 list đại diện cho lịch sử. Tóm lại các containers sẽ là các objects của 1 class. Cái class này có thể ko có method nào, nhưng sẽ có cực nhiều fields để tái hiện lại 1 state của cả editor. Để cho phép các objects khác có thể viết và đọc dữ liệu từ 1 snapshot, ta đương nhiên phải cho fields của nó đc public. Thành ra các classes khác sẽ trở nên phụ thuộc vào snapshot class dù chỉ là 1 tý thay đổi.

Cuối cùng, ta hoặc là phơi bày hết chi tiết bên trong các classes, làm chúng trở nên dễ tổn thương, hoặc là chặn mọi access tới state của chúng, làm cho việc tạo snapshot trở nên bất khả thi. Liệu có cách nào tốt hơn để implement "undo"?

## Solution

Tất cả đống vấn đề ta gặp phải đều đến từ việc phá vỡ encapsulation và 1 vài objects đang cố làm nhiều hơn trách nhiệm của nó. Để thu thập đc dữ liệu để thực hiện vài hành động, chúng đã lấn chiếm trường private trong các objects khác thay vì để những objects đó thực hiện hành động thực sự

Memento pattern đưa việc tạo snapshot qua chủ nhân thực sự của state đó - object khởi đầu. Nhờ thế, thay vì các objects cố copy editor's state từ ngoài, tự bản thân editor class có thể làm snapshot vì chúng có full access tới state của nó.

Pattern đề xuất lưu bản copy của object's state trong 1 object đặc biệt tên là memento. Nội dung của memento ko đc cho bất kỳ object nào truy cập ngoại trừ object mà sản xuất ra snapshot. Các objects khác phải giao tiếp với memento thông qua 1 interface nhưng chỉ giới hạn cho fetch metadata của snapshot (như thời gian tạo, tên của operation đã thực hiện, etc...) mà ko phải bản thân state của object chứa đựng trong snapshot.

Với quy luật đc thắt chặt như thế, ta sẽ có thể lưu trữ các mementos trong các objects khác thường đc gọi là caretakers. Vì caretaker hoạt động với memento thông qua interface bị giới hạn, nó  sẽ ko thể quấy nhiễu state đc lưu giữ trong memento. Cùng lúc đó, object khởi đầu có access tới tất cả các trường trong memento, cho phép chúng restore state trước nếu cần.

Trong ví dụ text editor của ta, ta có thể tạo 1 history class riêng biệt để hoạt động như 1 caretaker. 1 stack của các mementos đc lưu trong cái caretaker sẽ phát triển mỗi lần editor thực thi 1 operation. Ta còn có thể render stack này trong UI của app, hiển thị lịch sử của của các operation đc thực hiện trước đó tới ng dùng.

Khi ng dùng kích hoạt undo, history sẽ lấy memento gần nhất từ trong stack và pass chúng lại editor, yêu cầu đc rollback. Vì editor có full access tới memento, nó thay đổi state của nó theo giá trị lấy đc từ cái memento đó.

```ts
interface CursorCoordinate {
  x: number,
  y: number
}

interface Snapshot {
  name: string,
  createdDate: Date,
  text: string,
  cursorPos: CursorCoordinate,
  font: string,
}


class Mememto {
  public snapshot: Snapshot;

  constructor(snapshot: Snapshot) {
    this.snapshot = snapshot;
  }

  getName(): string {
    return this.snapshot.name;
  }

  getSnapshotDate(): Date {
    return this.snapshot.createdDate;
  }
}


class Cursor {
  private position: CursorCoordinate;

  constructor() {
    this.position = {
      x: 50,
      y: 50
    }
  }

  getPos(): CursorCoordinate {
    return this.position;
  }

  setPos(position: CursorCoordinate) {
    this.position = position;
  }
}


class Tooling {
  private editor: Editor;
  private history: Mememto[] = [];

  constructor(editor: Editor) {
    this.editor = editor;
  }

  doSomething() {
    const snapshot = this.editor.makeSnapshot();
    this.history.push(snapshot);
  }

  undo() {
    const prevSnapshot = this.history.pop() as Mememto;
    this.editor.restore(prevSnapshot);
  }
}


class Editor {
  private text: string = '';
  private cursor: Cursor;
  private font: string;

  constructor() {
    this.cursor = new Cursor();
    this.font = 'A font';
  }

  makeSnapshot(): Mememto {
    const snapshot = {
      name: 'A name',
      createdDate: new Date(),
      text: this.text,
      cursorPos: this.cursor.getPos(),
      font: this.font,
    }
    return new Mememto(snapshot);
  }

  restore(prevSnapshot: Mememto) {
    this.text = prevSnapshot.snapshot.text as string;
    this.cursor.setPos(prevSnapshot.snapshot.cursorPos as CursorCoordinate);
    this.font = prevSnapshot.snapshot.font as string;
  }
}
```

## Structure

### Implementation based on nested classes

Classic implementation phụ thuộc vào việc lồng các classes, có thể đc implement dễ dàng bằng hầu hết nnlt phổ biến (C++, C#, Java...)

[image]
  src: /img/oop/memento.webp
  alt: Implementation based on nested classes diagram
  caption: Implementation based on nested classes diagram

1. **Originator** class có thể tạo các snapshots cho state của nó, cũng như khôi phục state từ các snapshots khi cần
2. **Memento** là 1 object hoạt động như 1 snapshot của originator's state.
3. **Caretaker** biết ko chỉ "khi nào" hay "vì sao" nó cần chụp lại state của originator, mà còn khi nào state được khôi phục. 1 caretaker có thể theo dõi lịch sử hoạt động của originator bằng cách lưu 1 stack mementos. Khi originator khôi phục lịch sử, caretaker sẽ lấy memento đầu tiên trong stack và pass vô method khôi phục của originator
4. Trong cách implementation này, class memento đc lồng trong originator, giúp originator truy cập đến các fields và methods của memento kể cả khi chúng đc khai báo private. Mặt khác, caretaker lại chỉ có access rất hạn chế tới các fields và methods của memento, giúp cho chúng lưu đc mementos trong 1 stack mà ko quấy nhiễu state

### Implementation based on an intermediate interface

1 cách implementation khác dành cho những nnlt ko hỗ trợ classes lồng (well, PHP...)

[image]
  src: /img/oop/memento-1.webp
  alt: Implementation based on an intermediate interface
  caption: Implementation based on an intermediate interface

1. Để tránh phải lồng classes, ta có thể hạn chế access tới các fields của mementos bằng cách xuất bản 1 convention sao cho caretakers có thể hoạt động với 1 memento thông qua 1 intermediary interface đc khai bảo chỉ định.
2. Mặt khác, originators có thể hoạt động trực tiếp với 1 memento object, truy cập các fields và methods đc khai báo bên trong memento class. Nhược điểm của cách tiếp cận này đó là ta cần phải khai báo public toàn bộ members của memento

### Implementation with even stricter encapsulation

Vẫn còn 1 cách implementation nữa khá hữu dụng khi ta ko muốn để lọt ra bất kỳ cơ hội nào cho class khác truy cập vào state của originator qua memento

[image]
  src: /img/oop/memento-2.webp
  alt: Implementation with even stricter encapsulation
  caption: Implementation with even stricter encapsulation

1. Cách implementation cho phép có nhiều kiểu originators và mementos. Mỗi originator hoạt động với 1 memento class tương ứng. Cả originators lẫn mementos đều ko lộ state của chúng ra bất kỳ đâu
2. Caretaker giờ sẽ bị hạn chế khỏi việc thay đổi các state đc lưu trong mementos. Hơn nữa. caretaker class trở nên độc lập khỏi originator vì method khôi phục giờ đây đã đc định nghĩa trong memento class
3. Mỗi memento liên kết với originator mà sản sinh ra nó. Bản thân originator đc pass vào constructor của memento mang theo giá trị của state. Nhờ mối liên hệ gần gũi của những classes này, memento mới có thể khôi phục lại state của originator

---

Tham khảo thêm về `Memento` tại [https://refactoring.guru/design-patterns/memento](https://refactoring.guru/design-patterns/memento "Memento - Refactoring Guru")
