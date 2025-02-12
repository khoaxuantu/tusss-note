---
title: System Design | Lời mở đầu
title_template: Tusss Notes | %s
date: 2023-04-15
include:
  - components/block/note
next_article:
  path: /system-design/interview
  title: System Design Interview
---

# Lời Mở Đầu

[block.note]
  Tôi vẫn đang trong tiến trình học system design nên vẫn chưa có đầy đủ các notes nhé.

Cho những con người có định hướng đào sâu về mảng Backend và có thể mở rộng ra DevOps sau này 💀

Hàng ngàn request mỗi giây => server quá tải => ta phải scale up hoặc tái cấu trúc app của mình lên => một đống vấn đề khác nảy sinh (đồng bộ, đảm bảo hiệu năng, giữ bảo mật etc...)... Cứ thế cứ thế các vde mới lại xuất hiện như hiệu ứng domino, đó là lý do mới có cái **System Design** này.

Ta thiết kế hệ thống nhằm đảm bảo các yếu tố chính về độ tin cậy (reliable), hiệu quả (effective) và khả năng bảo trì (maintainable):

- 1 hệ thống đáng tin cậy sẽ đối phó với các tình huống xảy ra lỗi (fault, failure, errors) 1 cách hợp lý.
- 1 hệ thống có hiệu quả sẽ đáp ứng mọi yêu cầu từ business và users.
- 1 hệ thống có khả năng bảo trì sẽ linh hoạt với đa dạng cấu trúc, dễ scale up/down và thêm tính năng mới.

## Acknowledgement

- [Grokking the Modern System Design Interview](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers) - educative.io
- [System Design 101](https://github.com/ByteByteGoHq/system-design-101) - ByteByteGo
- [Grokking the System Design Interview](https://www.designgurus.io/course/grokking-the-system-design-interview) - Guru99

## Catalog

- Overview:
  - [System Design Interview](/system-design/interview)
  - [Abstractions](/system-design/abstractions)
  - [Non-functional System Characteristics](/system-design/non-functional-system-characteristics)
  - [Back-of-the-envelop Calculations](/system-design/back-of-the-envelop-calculations)
- Components:
  - [Domain Name System (DNS)](/system-design/dns)
  - [Load Balancers](/system-design/load-balancers)
  - [Databases](/system-design/databases)
  - [Key-value Stores](/system-design/key-value-store)
  - [Content Delivery Network (CDN)](/system-design/cdn)
  - [Sequencer](/system-design/sequencer)
  - Distributed Monitoring
  - Monitor Server-side Errors
  - Monitor Client-side Errors
  - Distributed Cache
  - Distributed Messesing Queue
  - Pub-sub
  - [Rate Limiter](/system-design/rate-limiter)
  - Blob Store
  - Distributed Search
  - Distributed Logging
  - Distributed Task Scheduler
  - Sharded Counter
  - Spectacular Failures
- Sample designs:
  - Design Youtube
  - Design Quora
  - Design Google Maps
  - Design a Proximity Service / Yelp
  - Design Uber
  - Design Twitter
  - Design Newsfeed System
  - Design Instagram
  - Design a URL Shortening Service / TinyURL
  - Design a Web Crawler
  - Design WhatsApp
  - Design Typeahead Suggestion
  - Design a Collaborative Document Editing Service / Google Docs
