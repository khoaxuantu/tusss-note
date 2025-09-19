---
title: Flyweight
tags:
  - OOP
  - DesignPattern
id:
date: 2023-07-19
unlisted: true
next_article:
  path: /oop/design-patterns/proxy
  title: Proxy
prev_article:
  path: /oop/design-patterns/facade
  title: Facade
---

# Flyweight

`Flyweight` là kiểu pattern cho ta xếp vừa nhiều object hơn vào trong 1 lượng RAM sẵn có bằng cách chia sẻ các phần chung giữa các objects để lưu trữ bộ dữ liệu chung để chúng có thể tái sử dụng khi cần, ko cần phải tạo thêm dữ liệu trùng lặp nữa.

## Problem

Ví dụ để giải trí sau những giờ chơi game căng thẳng, ta quyết định làm 1 tựa game fps. Ta triển khai 1 realistic particle system và đưa nó làm thành phần chủ đạo của game. 1 lượng khổng lồ đạn dược, khói lửa, cháy nổ sẽ cần được render trên toàn bản đồ để đem đến trải nghiệm ngon lành nhất cho người chơi (chơi Battlefield V đi các friend ~ ).

Khi hoàn thành việc code, ta push commit cuối, bắt đầu build cả game rồi tiến hành kiểm thử.

Bùm, máy bị crashed vì tràn RAM. Ta kiểu wtf máy mình 16gb cơ mà... Nhưng ôi bạn ei...

Vấn đề thực chất có liên quan tới particle system của ta. Mỗi particle, như viện đạn, tên lửa, mảnh đạn được biểu diễn bởi 1 object riêng biệt chứa hàng tá thuộc tính. Ở một mức độ lớn nào đó, khi mà màn hình của của ng chơi phải render 1 đống thứ như vậy (chơi Battlefield để hiểu thêm chi tiết), lượng object được tạo ra vượt quá dung lượng còn lại của RAM, dẫn tới tình trạng tràn RAM và crash máy.

## Solution

[image]
  src: /img/oop/flyweight-1.webp
  alt: Game crash example diagram
  caption: "Game crash example diagram (Source: Refactoring Guru)"

Ở sơ đồ trên, nhìn kỹ hơn vào class `Particle`, ta có thể nhận thấy bộ field `color` và `sprite` tiêu thụ bộ nhớ nhiều hơn hẳn các field khác. Một điều tệ hơn đó là 2 fields này lưu trữ data giống nhau ở hầu hết các particles, như các viên đạn có mã màu và sprite giống nhau.
Trong khi các fields `coords`, `vector`, `speed` lại luôn biến thiên ở mỗi particle, thì `color` và `sprite` lại luôn giữ nguyên giá trị của nó. Điều này rõ ràng la 1 sự lãng phí, ta hoàn toàn có thể cho các particle share chung 1 data `color` và `sprite` thay vì phải tạo những data copy như vậy.

Pattern Flyweight sẽ giúp ta giải quyết sự lãng phí này. Thay vì lưu trữ các fields cùng trong 1 object, ta có thể tách những fields biên thiên độc nhất cho mỗi cá thể ra thành class riêng, và giữ những fields bất biến trong 1 class chung để lưu giữ thuộc tính. Sau các object chứa fields độc nhất sẽ có thể tái sử dụng những thuộc tính chung bằng cách gọi tới object chứa những fields bất biến này

[image]
  src: /img/oop/flyweight-2.webp
  alt: Game example solution diagram
  caption: "Game example solution diagram (Source: Refactoring Guru)"

> Nói chút về định nghĩa state của object trong particle system. Những dữ liệu bất biến giữa các particle sẽ được gọi với thuật ngữ _intrinsic state_, tụi nó chỉ tồn tại trong particle, readonly và ko thể bị thay đổi bởi yếu tố bên ngoài object. Còn những dữ liệu bị thay đổi, biến thiên từ yếu tố bên ngoài sẽ đc gọi là _extrinsic state_.

### Extrinsic state storage

Những extrinsic state sau khi đc tạo ra sẽ chuyển đi đâu? Sẽ có 1 số class lưu trữ nó, trong hầu hết các trường hợp, chúng đc đưa vào 1 object container, nhằm tập hợp tất cả objects trước khi được ta đưa vào pattern.

Trong ví dụ của ta, cái main `Game` object lưu trữ tất cả particles trong `particles` field. Để đưa extrinsic state vô class này, ta cần tạo 1 vài trường arrays để lưu trữ tọa độ, vector và tốc độ của mỗi particle riêng lẻ. Ko chỉ vậy, ta cần tạo 1 mảng khác để lưu reference tới cái flyweight biểu thị cho 1 particle. Đống mảng này phải đc đồng bộ để ta có thể truy cập tới data của 1 particle thông qua index.

[image]
  src: /img/oop/flyweight-3.webp
  alt: Game example solution diagram
  caption: "Game example solution diagram (Source: Refactoring Guru)"

1 cách đỉnh hơn đó là tạo ra 1 context class riêng biệt có thể lưu giữ extrinsic state cùng với các reference tới flyweight object. Cách tiếp cận này chỉ yêu cầu có đúng 1 array trong container class, giúp giảm độ phức tạp của code

### Flyweight and immutability

Vì cùng 1 flyweight object có thể được sử dụng ở những nội dung khác nhau, ta phải chắc chắn state của chúng ko thể bị chỉnh sửa được. 1 flyweight khởi tạo state của nó đúng 1 lần duy nhất, thông qua constructor, nó ko nên để bất kỳ setter cho trường public nào lọt ra ngoài cho những objects khác

### Flyweight factory

Để thuận tiện hơn cho việc truy cập tới các flyweights, ta có thể tạo 1 factory method cho việc quản lý các flyweight objects đang tồn tại. Phương thức này chấp nhận intrinsic state của flyweight đc yêu cầu từ client, tìm kiếm những flyweight trùng khớp đang tồn tại, và return nó nếu tìm ra. Còn nếu ko, nó sẽ tạo 1 flyweight mới và thêm vào trường các flyweight đang hoạt động của nó.

Có 1 vài lựa chọn cho việc đặt factory method này ở đâu. Cách hiển nhiên nhất thì ta đặt mọe luôn trong con flyweight container, _all in a container_. Ngoài ra thì ta có thể tạo ra 1 factory class mới, hoặc cho cái factory method dạng static và đặt trong flyweight class.

```ts
interface ParticleState {
  coords: Coordinate,
  vector: Vector,
  speed: Speed
}
type Particle = 'bullet' | 'explosion';

abstract class ParticleBase {
  public color: string;
  public sprite: Sprite;

  constructor(color: string, sprite: Sprite) {
    this.color = color;
    this.sprite = sprite;
  }
}

class BulletParticle extends ParticleBase {
  constructor() {
    super(BULLET_COLOR, BULLET_SPRITE);
  }
}

class ExplosionParticle extends ParticleBase {
  constructor() {
    super(EXPLOSION_COLOR, EXPLOSION_SPRITE);
  }
}

abstract class MovingParticleBase {
  private state: ParticleState;
  private particle: ParticleBase;

  constructor(state: ParticleState, particle: Particle) {
    this.state = state;
    this.particle = particle;
  }

  move(nextState: ParticleState) {
    this.state = nextState;
  }

  draw(canvas) {}
}

class BulletMovingParticle extends MovingParticleBase {
  constructor(state: ParticleState) {
    super(state, 'bullet');
  }
}

class ExplosionMovingParticle extends MovingParticleBase {
  constructor(state: ParticleState) {
    super(state, 'explosion');
  }
}

class Game {
  static mps: MovingParticleBase[];
  static particles: Object = {
    bullet: new BulletParticle();
    explosion: new ExplosionParticle();
  };

  static addParticle(initState: ParticleState, particleType: Particle) {
    switch(particleType) {
      case 'bullet':
        mps.push(new BulletMovingParticle(initState));
        break;
      case 'explosion':
        mps.push(new ExplosionMovingParticle(initState));
        break;
    }
  }

  static draw(canvas) {}
}

class Unit {
  private coords: Coordinate;

  fireAt(target: Unit) {
    const initState: ParticleState = {
      coords: this.coords,
      vector: 0,
      speed: 0
    }
    Game.addParticle(initState, 'bullet');
    ...
  }
}
```

## Structure

[image]
  src: /img/oop/flyweight.webp
  alt: Flyweight structure diagram
  caption: Flyweight structure diagram

1. Cái Flyweight pattern trông giống như 1 cách tối ưu. Trước khi áp dụng nó, hãy chắc chắn chương trình của ta gặp vấn đề ở tiêu tốn RAM mà lỗi ở việc có quá nhiều các objects giống nhau trong cùng 1 lúc, và ko có cách ngon nào khác giải quyết đc vấn đề này
2. Cái **Flyweight** class chứa đựng các tính chất của chung có thể chia sẻ cho các object cùng loại với nhau (bullet vs bullet). State được lưu ở trong flyweight được gọi là _intrinsic_, còn state được pass tới các methods của flyweight đc gọi là _extrinsic_
3. **Context** class chứa các extrinsic state, là độc nhất qua toàn bộ original objects. Khi 1 context được bắt cặp với 1 trong các flyweight object, nó sẽ thể hiện toàn bộ state của original object đó
4. Thông thường, trạng thái của original object tồn tại trong flyweight class. Trong trường hợp này, bất cứ ai gọi tới flyweight method phải pass tất cả extrinsic state thích hợp thành method's parameters. Mặt khác, trạng thái này có thể được chuyển tới context class để liên kết tới flyweight như là data object
5. **Client** tính toán và lưu trữ extrinsic state của flyweights. Từ góc nhìn của client, 1 flyweight là 1 template object mà có thể config trong runtime bằng cách pas 1 số contextual data vào methods của nó
6. **Flyweight Factory** quản lý 1 pool các flyweights đang tồn tại. Với cái factory, clients ko cần quan tâm trực tiếp tới flyweights mà thay vào đó, họ gọi cái factory, pass các instrinsic state vào flyweight họ muốn. Cái factory tìm trong những flyweights đã đc tạo và trả về cái đang tồn tại hoặc tạo 1 cái mới nếu ko tìm thấy cái thích hợp

---

Tham khảo thêm về **Flyweight** tại [https://refactoring.guru/design-patterns/flyweight](https://refactoring.guru/design-patterns/flyweight "Flyweight - Refactoring Guru")
