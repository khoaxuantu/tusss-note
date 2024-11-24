---
title: The Key-Value Store
tags:
id:
unlisted: true
date: 2024-01-22
include:
  - components/image/able-to-zoom
next_article:
  path: /system-design/cdn
  title: Content Delivery Network (CDN)
prev_article:
  path: /system-design/databases
  title: Databases
---

# Key-value Store

## Introduction

**Key-value store** là các hệ thống bảng băm phân tán (distributed hash tables - DHTs). Trong 1 key-value store, 1 key được gen ra từ hash function và liên kết tới 1 giá trị cụ thể mà ko cần phải quan tâm tới cấu trúc của giá trị đó là như thế nào.

Thông thường, key-value store đc sử dụng để lưu trữ lượng dữ liệu nhỏ, từ vài KB tới vài MB, tồn tại trong thời gian hữu hạn và linh động thay đổi. Chúng rất hữu dụng khi lưu trữ session của người dùng hoặc xây dựng 1 NoSQL database.

Ví dụ cho việc ứng dụng key-value store có thể kể đến như:

- Danh sách sản phẩm trending / tiêu thụ nhiều nhất
- Giỏ mua đồ
- Quản lý session
- Catalogs

### How will we design a key-value store

Ta sẽ chia việc thiết kế cái này ra thành 4 mục riêng:

1. **Design a key-value store overview:** nhằm xác định yêu cầu chính và thiết kế API.
2. **Ensure scalability and replication:** tìm hiểu cách đạt được scalability bằng consistent hashing và sao lưu partitioned data.
3. **Versioning data and achieving configurability:** tìm hiểu cách giải quyết các conflicts được tạo nên bởi sự thay đổi của 1 hoặc nhiều entity, và ta sẽ tìm hiểu cách làm cho hệ thống có khả năng thay đổi cấu hình đáp ứng các use cases khác nhau.
4. **Enable fault tolerance and failure detection:** tìm hiểu cách để tạo nên hệ thống có khả năng chịu được lỗi và phát hiện lỗi.

## Design of a Key-Value Store

Đầu tiên, ta cần xác định list các requirements trước

### Functional Requirements

- Đương nhiên phải tối thiểu đáp ứng được 2 tính năng `get` và `put`.
- Cần cung cấp tính năng cấu hình: 1 số ứng dụng có xu hướng đánh đổi tính nhất quán cao cho tính sẵn sàng được mạnh hơn. Ta cần cung cấp 1 service có thể cấu hình sao cho các ứng dụng khác nhau dùng được nhiều mô hình nhất quán; đồng thời giúp đảm bảo sự cân bằng giữa tính sẵn sàng, tính nhất quán, hiệu năng và tối ưu chi phí.

> Những configs đó sẽ chỉ được thực hiện khi khởi tạo 1 key-value store instance mới và ko thể bị thay đổi khi hệ thống đang hoạt động.

- Đáp ứng được nhu cầu ghi vào storage vượt trội: Các ứng dụng luôn luôn có thể ghi vào key-value storage.
- Tính ko đồng nhất về phần cứng: Ta muốn thêm các servers mới mà ko làm thay đổi các servers đang hoạt động. Hệ thống của ta phải có khả năng chứa đựng và tận dụng mọi dung lượng của các servers, cùng với đó đảm bảo chức năng cốt lõi (`get` và `put` data) hoạt động đúng trong khi phải chia đều tải ra theo dung lượng các servers.

### Non-functional Requirements

- **Scalability:** Ta phải thêm bớt các servers sao cho hạn chế việc làm gián đoạn các services và đảm bảo có thể phục vụ được lượng khách hàng truy cập khổng lồ.
- **Fault tolerance:** Phải có khả năng hoạt động ngay cả khi sự số xảy ra trong các servers hoặc trong thành phần của nó.

### Assumptions

- Trung tâm dữ liệu host dịch vụ này là đáng tin.
- Tất cả tiến trình xác thực cần thiết đều đã được thực hiện.
- Request và response từ người dùng đều theo dạng HTTPS.

### API design

#### `get` function

```
get(key)
```

Trả lại giá trị mà key trỏ vào. Khi dữ liệu đc sao lưu, nó sẽ đc đặt trong 1 replica object tổ chức với 1 khóa cụ thể.

#### `put` function

```
put(key, value)
```

Lưu giá trị `value` với 1 khóa `key`. Hệ thống sẽ tự động quyết định dữ liệu đc đặt ở đâu. Ngoài ra, hệ thống còn thường giữ metadata của object chúng lưu trữ, có thể bao gồm phiên bản của object.

### Data type

Key ở đây sẽ được coi như là khóa chính trong 1 key-value store, còn value thì có thể là bất kỳ kiểu dữ liệu nhị phân nào.

> Dynamo sử dụng MD5 hash lên key để generate ra 128-bit identifier. Các identifiers này giúp hệ thống có thể xác định server node nào sẽ chịu trách nhiệm cho cái key đó.

## Ensure Scalability and Replication

### Add Scalability

Ta lưu trữ các dữ liệu key-value trong các storage nodes. Theo nhu cầu, ta sẽ cần phải thêm hoặc xóa các nodes. Điều này có nghĩa là ta cần partition dữ liệu qua các nodes trong hệ thống để phân tán tải theo đó.

#### Consistent hashing

1 cách hiệu quả để quản lý tải cho các nodes.

Trong consistent hashing, ta có thể giả sử 1 vòng hash từ 0 tới n-1, trong đó n là số lượng giá trị hash. Ta sử dụng mỗi node ID để tính toán ra hash của chúng và map vào các điểm theo đường tròn của vòng hash.

Với các requests tới storage, ta sẽ áp 1 quá trình tương tự. Mỗi request sẽ đc thực thi bởi node đầu tiên mà chúng tìm thấy khi di chuyển theo chiều kim đồng hồ trên vòng hash.

Mỗi khi 1 node được thêm vào vòng, node tiếp theo ở chiều kim đồng hồ sẽ bị ảnh hưởng, còn các node còn lại thì ko bị. Như vậy, ta đã giữ cho số lượng nodes bị ảnh hưởng về mức tối thiểu, giúp cho việc scale đc dễ dàng hơn.

[image]
  src: /img/system-design/key-value-store.webp
  alt: Consistent hashing illustration

Nhược điểm của cách hash này là lượng tải trên thực tế ko đc phân bổ thực sự đều. Bất kỳ server nào nhận lượng lớn dữ liệu đều có thể thành nút thắt cổ chai trong hệ thống phân tán.

[image]
  src: /img/system-design/key-value-store-1.webp
  alt: Consistent hashing illustration
  caption: Các node có thể phân bố không được đồng đều với consistent hashing

#### Use virtual nodes

Ta sẽ sử dụng kỹ thuật virtual nodes để đảm bảo tải được phân bố đến các nodes đều hơn: áp nhiều hash functions lên 1 key thay vì chỉ 1 hash function như ban đầu.

Ví dụ, ta có 3 hash functions. Với mỗi node, ta tính ra 3 hashes và đặt chúng vào vòng. Với mỗi request thì ta chỉ áp 1 hash function lên chúng. Khi chúng được đưa vào bất kỳ vị trí nào trên vòng hash, node gần nhất theo chiều kim đồng hồ sẽ thực hiện request đó.

Với 3 hash functions trên, ta sẽ đặt mỗi server lên 3 vị trí khác nhau trên vòng hash, nhờ đó tải requests sẽ đều hơn.

##### Advantages of virtual nodes

- Nếu 1 node bị oẳng, workload sẽ được phân bố đều ra các nodes khác gần chúng.
- Các node có thể tùy ý lựa chọn số lượng virtual nodes dựa theo cơ sở hạ tầng của chúng. Nếu 1 node có dung lượng tính toán lớn gấp đôi các node khác, chúng có thể áp gấp đôi hash function để chiếm nhiều vị trí trên vòng hash hơn. Từ đó nhận xử lý nhiều requests hơn.

### Data Replication

#### Primary-secondary approach

1 trong các storages sẽ đc lựa chọn ưu tiên primary, các storage còn lại thì là ưu tiên secondary. Primary sẽ phục vụ các write requests còn secondary phục vụ read requests.

Sau khi thực hiện write, việc replication có thể xảy ra hiện tượng lag. Bên cạnh đó thì nếu primary mà oẳng, ta sẽ ko thể thực hiện ghi vào storage, thành ra mẫu này cũng mang đặc điểm single point failure.

Thế nên để đáp ứng đc yêu cầu ghi luôn luôn sẵn sàng của key-value store, ta sẽ cần thêm tính năng phòng trường hợp khi primary storage bị oẳng, như là promote 1 secondary storage lên thay thế.

#### Peer-to-peer approach

Tất cả storages sẽ mang ưu tiên primary, và chúng sao lưu dữ liệu để đảm bảo dữ liệu được cập nhật mới nhất. Thông thường thì việc sao lưu toàn bộ nodes là vô cùng tốn kém và kém hiệu quả, nên chỉ những node quan trọng nhất (tầm 3 - 5 nodes) là được sao lưu.

Với việc sao lưu dựa trên quan hệ peer-to-peer, ta có thể mở rộng việc sao lưu ra nhiều nodes để đạt được độ tin cậy và độ sẵn sàng.

Mỗi node, khi được sau lưu dữ liệu tới các nodes khác, sẽ gọi tới 1 node điều phối xử lý các tiến trình đọc ghi sao lưu. Node điều phối này sẽ được gán 1 key đặc biệt, và sao lưu key đó tới _n_ - 1 virtual nodes có node vật lý tiếp theo trong ring (theo chiều kim đồng hồ), trong đó _n_ là số node sẽ được sao lưu tới. List của virtual nodes này còn đc gọi là list ưu tiên, chúng sẽ bỏ qua các virtual nodes mà có node vật lý nằm trong list này để tránh sao lưu trùng node.

Như hình dưới đây, ta có _n_ là 3. Với khóa `K`, việc sao lưu sẽ đc thực hiện bởi 3 node: B, C, D. Tương tự với khóa `L`, 3 node C, D, E sẽ chịu trách nhiệm sao lưu.

[image]
  src: /img/system-design/key-value-store-2.webp
  alt: Peer-to-peer approach illustration

> Ảnh hưởng của sao lưu đồng bộ hoặc bất đồng bộ?
>
> - Trong sao lưu đồng bộ, tốc độ ghi rất lâu vì dữ liệu phải đc sao lưu vào 1 node hoàn toàn trước khi thông báo lại tới ng dùng. Nó ảnh hưởng lên tính sẵn sàng nên ta ko thể áp dụng vào sao lưu key-value store được.
> - Với sao lưu bất đồng bộ, tốc độ ghi của ta sẽ được tăng cao hơn nhiều.

Theo cách nói của CAP theorem, key-value store có thể vừa thống nhất vừa sẵn sàng trong điều kiện tồn tại mạng lưới partitions.

Với key-value stores, ta ưu tiên tính sẵn sàng hơn là tính thống nhất. Có nghĩa là nếu 1 node bị mất kết nối, hệ thống vẫn tiếp tục xử lý các request tới như thường, và khi node đó kết nối lại, dữ liệu sẽ lại được đồng bồ trở lại.

## Versioning Data and Achieving Configurability

### Data versioning

Khi mạng lưới bị phân vùng và các nodes bị mất kết nối đang trong lúc cập nhật, nguy cơ dữ liệu bị bất đồng bộ khá cao.

Để xử lý được nguy cơ ko đồng nhất này, ta cần phải duy trì tính liên hệ giữa các sự kiện với nhau.

1 cách tiếp cận đó là sử dụng đồng hồ vector. 1 đồng hồ vector là 1 list các cặp (node, counter). Với mỗi phiên bản của 1 object, tồn tại 1 cặp (node, counter) đơn. Nếu 2 objects có đồng hồ vector khác nhau, ta có thể xác định được liệu chúng có liên quan tới nhau hay ko.

### Modify the API design

Ở thiết kế ban đầu, API call cho việc lấy giá trị là như sau:

```
get(key)
```

Kết hợp với data versioning, ta sẽ expect nhận được 1 object chứa giá trị mong muốn, cùng với thuộc tính `context`. Thuộc tính này cho ta thông tin về metadata của giá trị, bao gồm phiên bản của object.

Để có được object như mong muốn, API call để put giá trị vào store sẽ được đổi thành như sau:

```
put(key, value, context)
```

Method sẽ tìm node tương ứng với key để put value vào, đồng thời kiểm tra `context` đã có được trả lại bởi hệ thống qua `get`. Nếu có ta nhận được 1 list các `context` bị xung đột, ta sẽ cần yêu cầu client resolve nó.

Để cập nhật giá trị cho 1 key, client cũng phải cung cấp `context`. Ta xác định thông tin phiên bản sử dụng 1 đồng hồ vector bằng cách cung cấp `context` từ tiến trình đọc mới nhất. Nếu key-value store đã truy cập tới nhiều nhánh lịch sử khác nhau, nó cung cấp tất cả objects ở leaf nodes, kết hợp với thông tin phiên bản trong `context` và merge tất cả lại thành 1 phiên bản mới.

> Ta có thể liên hệ quá trình giải quyết conflict trên với giải quyết conflict trong Git.

### The `get` and `put` operations

1 trong các functional requirements của ta là khả năng cấu hình được để có thể điều khiển trade-off giữa tính sẵn sàng, thống nhất, tối ưu chi phí và hiệu năng.

Mỗi node đều có thể thực hiện được `get` (tiến trình đọc) và `put` (tiến trình ghi) trong hệ thống của ta. Node tiếp nhận xử lý tiến trình đọc hoặc ghi, nằm vị trí đầu tiên trong _n_ top nodes của preference list được gọi là **coordinator**.

Có 2 cách để client lựa chọn node:

- Route request tới 1 generic load balancer. Ở cách này thì client sẽ ko cần phải liên kết tới các nodes.
- Sử dụng thư viện hỗ trợ partition ở client để route request thẳng tới coordinator node. Ở cách này thì độ trễ sẽ được giảm đi.

Để giúp cho dịch vụ của ta có thể cấu hình được, ta có thể sử dụng 1 consistency protocol giống như trong quorum system.

**Ví dụ:**

_n_ = 3. _n_ là số top nodes trong preference list. Nếu lệnh ghi được thực hiện ở node A, bản sao của dữ liệu sẽ được ghi vào node B và C.

_r_: số nodes tối thiểu để hoàn thành 1 tiến trình đọc.
_w_: số nodes tối thiểu để hoàn thành 1 tiến trình ghi.

Với quorum system, ta sẽ có _r_ + _w_ > _n_.

Bảng dưới đây sẽ cho thấy cách mà _r_, _w_, _n_ ảnh hưởng tới tốc độ đọc và ghi:

| n   | r   | w   | Description                     |
| --- | --- | --- | ------------------------------- |
| 3   | 2   | 1   | Vi phạm điều kiện r + w > n     |
| 3   | 2   | 2   | Thỏa mãn điều kiện r + w > n    |
| 3   | 3   | 1   | Tốc độ ghi cao, tốc độ đọc chậm |
| 3   | 1   | 3   | Tốc độ đọc cao, tốc độ ghi chậm |

## Enable Fault Tolerance and Failure Detection

### Handle temporary failure

Cách điển hình nhất mà 1 hệ thống phân tán sử dụng để xử lý sự cố là quorum-based approach. 1 quorum là số lượng votes (servers) tối thiểu được yêu cầu để 1 distributed transaction được hoàn thành. Nếu 1 servers trong số đó oẳng, transaction sẽ ko thể được hoàn thành => ảnh hưởng tới tính sẵn sàng và bền vững.

Nếu tiếp cận bằng 1 strict quorum, 1 server leader sẽ quản lý việc giao tiếp giữa các servers tham gia. Hạn chế của cách tiếp cận này là nếu leader bị oẳng dù chỉ trong 1 lát, server thành viên sẽ ko thể đưa response tới. Khi đó, chúng cho rằng leader đã oẳng, nên 1 server mới sẽ được bầu cho chức leader. Tiến trình bầu đi bầu lại này sẽ có thể ảnh hưởng tiêu cực tới hiệu năng cử hệ thống.

Nếu tiếp cận bằng 1 sloppy quorum, ta sẽ cho _n_ nodes đầu tiên trong preference list xử lý toàn bộ tiến trình đọc ghi (lại tưởng tượng ra 1 vòng ring và đặt các nodes lên đó nào). _n_ nodes này ko nhất thiết toàn bộ phải khỏe mạnh. Nếu 1 node bị chết, request sẽ được đưa tới node sau theo chiều kim đồng hồ của vòng. Khi được xử lý xong thì node sẽ đợi nodes đang bị oẳng hồi phục lại rồi gửi lại response về như cũ.
=> Cách tiếp cận này còn được gọi là **hinted handoff**, giúp ta đảm bào việc đọc ghi vẫn đc hoàn thành nếu 1 node tạm thời bị down.

### Handle permanent failure

Khi 1 sự cố lâu dài xảy ra, ta nên giữ các replicas tiếp tục được đồng bộ để đảm bảo tính tin cậy. Ta cần phải tăng tốc detect ra sự ko thống nhất giữa các replicas và giảm số lượng dữ liệu đã được transfer đi. Ta sẽ sử dụng kỹ thuật Merkle tree để đối phó nó.

Trong 1 **Merkle tree**, giá trị của mỗi key được hashed lại và quy ước như 1 lá cây của cả cây. Mỗi nhánh cây trong cả cây Merkle có thể được xác định 1 cách độc lập mà ko cần phải tải cả cây hoặc toàn bộ dataset về.

[image is=able-to-zoom]
  src: /img/system-design/key-value-store-3.webp
  alt: Merkle tree illustration
  caption: Merkle tree

Áp dụng vào việc kiểm tra sự ko đồng nhất giữa các bản copies, Merkle tree sẽ giúp cho giảm lượng dữ liệu phải được thay đổi xuống.

Ta sẽ ko cần phải đồng bộ lại dữ liệu nếu, ví dụ, giá trị băm của 2 ngọn cây (root) là giống nhau (đồng nghĩa với việc lá cây sẽ giống nhau)

Nếu xảy ra sự ko đồng bộ giữa 2 copies, ta sẽ thực hiện việc so sánh 2 tree từ root xuống lá, nếu tìm ra 2 leaf hash khác nhau, ta sẽ xác định được là dữ liệu ko đồng bộ ở đâu.

Hạn chế của cách này đó là khi 1 node tham gia vào hệ thống, các hash trong tree sẽ phải được tính toán lại, tùy thuộc theo số lượng key bị ảnh hưởng.
