---
title: Objects Relationship
tags:
  - OOP
id:
unlisted: true
date: 2023-04-15
next_article:
  path: /oop/principles/software-design
  title: Software Design Principles
prev_article:
  path: /oop/4-pillars/polymorphism
  title: 4 Pillars | Polymorphism
---

# Objects Relationship

## Introduction

[image]
  src: /img/oop/objects-relationship.webp
  alt: Objects releationship illustration
  caption: "Objects relationship illustration (Source: Refactoring Guru)"

## Dependency

Đây là loại liên kết diễn tả sự ảnh hưởng của 1 class lên 1 class. `Class A` sẽ được gọi là phụ thuộc vào `Class B` nếu những thay đổi trong cấu trúc của `Class B` có thể dẫn tới sự chỉnh sửa `Class A`.

Ví dụ, class `Professor` phụ thuộc vào class `Course`. Obj `Professor` đưa các obj `Course` vào list đăng ký của mình; nhưng nếu 1 obj `Course` bị hủy (thay đổi trong Class B), thì list đăng ký trong obj `Professor` cũng sẽ xóa obj đó (sự chỉnh sửa trong Class A)

```
// Pay attention to the UML arruw
Professor --> Course
```

## Association

Đây là loại liên kết diễn tả việc 1 obj tương tác lên 1 obj khác.

Ví dụ, object `Professor` tương tác với object `Student`

```
// A direct arrow
Professor -> Student
```

Tưởng tượng 1 cách trực quan hơn trong code sẽ có dạng thế này

```ruby
class Professor is
  field Student student

  method teach(Course c) is
    this.student.remember(c.getKnowledge())
```

## Aggregation

Đây là kiểu liên kết đặc biệt diễn tả các mối quan hệ `one-to-many`, `many-to-many`, hoặc `whole-part` của các obj.

Ví dụ, 1 `Department` liên kết với nhiều `Professor`

```
// UML arrow with an empty diamond at the end
Department <>-> Professor
```

## Composition

Đây là 1 kiểu đặc biệt của **Aggregation**, diễn tả việc 1 obj được cấu thành từ nhiều obj, nhưng obj A quản lý vòng đời của obj B. Nói cách khác là obj B chỉ tồn tại khi obj A tồn tại.

Ví dụ, 1 `University` bao gồm nhiều `Department`. Ko có obj `University` thì ko có các obj `Department`

```
// UML arrow with a dense diamond at the end
University ◆-> Department
```

## Ultimately...

- **Dependency**: Class A bị ảnh hưởng bởi các thay đổi của class B
- **Association**: Obj A tương tác lên obj B
- **Aggregation**: Obj A bao gồm obj B.
- **Composition**: Cũng là obj A bao gồm obj B, nhưng obj A quản lý vòng đời của obj B
- **Implementation**: Class A định nghĩa các method đã đc declare trong interface B
- **Inheritance**: Class A kế thừa mọi field và method đã được định nghĩa từ class B, và có thể mở rộng ra nhiều đặc điểm mới
