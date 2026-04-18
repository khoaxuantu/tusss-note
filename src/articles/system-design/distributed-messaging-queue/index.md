---
title: Distributed Messaging Queue
unlisted: true
date: 2026-01-29
id: distributed-messaging-queue
prev_article:
  path: /system-design/distributed-cache
  title: Distributed Cache
---
# Distributed Messaging Queue

## What is it?

**Messaging Queue** là 1 component trung gian phụ trách nhiệm vụ kết nối các components khác trong hệ thống với nhau, tuân theo mô hình producers - consumers.

## Key components

#### Producer

Là những components thực hiện generate dữ liệu hay các events cần được xử lý, và đẩy lên hệ thống messaging cho các components nhận có thể kéo về.

#### Consumers

Là những components thực hiện việc xử lý các dữ liệu hoặc events đang trong hàng chờ trên hệ thống messaging. Chúng subscribe lên 1 hàng chờ và sẽ kéo lệnh xử lý về khi hàng chờ xuất hiện 1 lệnh được đẩy từ các 1 producer lên.

#### Queues

Là cấu trúc dữ liệu được hệ thống messaging sử dụng để lưu trữ các messages được đẩy từ các producers và đang chờ các consumers kéo về xử lý.

#### Messages

Là các objects (packets) dữ liệu được gửi từ producers tới consumers thông qua queues.

## Advantages

- Tăng cường hiệu năng, độ tin cậy, độ mở rộng, và độ linh hoạt của hệ thống phân tán qua khả năng giao tiếp độc lập, bất đồng bộ.
- Cho phép các services tách rời độc lập với nhau.
