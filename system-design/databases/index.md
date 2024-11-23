---
title: Databases
tags:
id:
unlisted: true
date: 2024-01-02
next_article:
  path: /system-design/key-value-store
  title: Key-value Store
prev_article:
  path: /system-design/load-balancers
  title: Load Balancers
---

# Databases

## Introduction

> Bất cứ 1 con app, 1 hệ thống nào cũng đều cần databases, ta đều cần 1 nơi lưu trữ dữ liệu.

Trước khi có database thì sao? Thử đào lại cách nguyên thủy nhất từ cổ chí kim: file storage.

Ta có thể tự tạo 1 chiếc file để lưu hết tất cả các bản ghi theo dòng và dùng code đọc từng dòng 1 để lấy dữ liệu. Nhưng như vậy, dễ thấy sẽ có rất nhiều vấn đề nảy sinh:

- Ta sẽ ko thể quản lý các ng dùng truy cập đồng thời tới storage files từ các vị trí khác nhau.
- Ta ko thể chắc chắn rằng mình phân quyền cho đúng ng dùng.
- Hệ thống file storage sẽ scale như thế nào khi thêm hàng ngàn entries để đọc dữ liệu?
- Làm sao để ta có thể tìm kiếm nội dung cho các ng dùng khác nhau chỉ trong 1 thời gian ngắn?

Vì đống bất cập kể trên, **database** ra đời. Đây là 1 hệ tổ chức quản trị dữ liệu giúp ta quản lý và chỉnh sửa dữ liệu (lưu trữ, thêm, sửa, xóa) dễ dàng.

Databases có 2 kiểu, khác nhau ở use cases mà chúng ứng dụng, dạng dữ liệu lưu trữ và các phương thức lưu trữ của chúng:

- SQL (relational databases)
- NoSQL (non-relational databases)

**Relational databases**, giống như các quyển danh bạ điện thoại với các bảng lưu thông tin sđt và địa chỉ, được tổ chức thành các schemas dạng bảng mà tại đó thông tin sẽ được phân bố theo từng cột và mỗi bản ghi tương đương với 1 dòng trong bảng.

**Non-relational databases**, giống như 1 folder lưu giữ bất kỳ kiểu cấu trúc dữ liệu nào với schemas linh động, ko thống nhất.

### Advantages

- Managing large data
- Retrieving accurate data (data consistency)
- Easy updation
- Security
- Data integrity
- Availability
- Scalability

### How will we explain databases

Ở đây ta sẽ bàn về databases theo các khía cạnh sau:

- **Types of Databases:** Về các kiểu databases, lợi ích và bất lợi của chúng.
- **Data Replication:** Về các cách chúng sao lưu dữ liệu.
- **Data Partitioning:** Về các cách chúng phân chia dữ liệu.
- **Cost-benefit analysis:** Về các cách tiếp cận sharding database để tối ưu được chi phí nhất.

## Type of databases

### Relational databases

> Tables - Records - Unique key - Relations

1 kiểu database nhà nhà biết, phân chia dữ liệu thành các bảng (tables) theo các schemas được định nghĩa trc. Mỗi dòng tượng trưng cho 1 bản ghi (records), mỗi bản ghi sẽ có 1 id độc nhất (unique key), và thông qua id độc nhất đó, liên kết với các dòng trong các bảng khác (relations).

> [Đọc đi đừng lười](https://cloud.google.com/learn/what-is-a-relational-database)
>
> [Đọc đi đừng lười 1](https://www.ibm.com/topics/relational-databases)

Để tương tác với database, ta sử dụng Structure Query Language (SQL).

Relational databases cung cấp các tính chất **ACID**:

- **Atomicity:** Hoặc là tất cả tiến trình trong 1 transaction được thực hiện thành công, hoặc là ko tiến trình nào thực hiện cả. Nếu 1 tiến trình trong đó bị oẳng, mọi thứ sẽ đc rollback về trc khi bắt đầu transaction.
- **Consistency:** Trong 1 thời điểm, database phải đảm bảo trạng thái đồng nhất của nó. Nếu nhiều users muốn xem 1 record giống nhau, database phải trả về kết quả giống nhau.
- **Isolation:** Trong trường hợp nhiều transactions chạy song song, chúng ko đc ảnh hưởng lẫn nhau. Trạng thái cuối cùng của database phải giống như các transactions chạy liên tiếp nhau.
- **Durability:** Hệ thống phải đảm bảo rằng các transactions đc hoàn thành phải được tồn tại mãi kể cả khi hệ thống xảy ra việc oẳng, ko để xảy ra việc thất thoát dữ liệu.

1 số database management systems (DBMS) phổ biến:

- MySQL
- Oracle Database
- Microsoft SQL Server
- IBM DB2
- Postgres
- SQLite
- Oracle Database

#### Why relational databases?

##### Flexibility

Nhờ sự xuất hiện của SQL

##### Reduced redundancy

Với việc tận dùng mối quan hệ giữa các bảng, ta có thể tập trung từng thông tin cụ thể vào từng bảng một và kết nối chúng với nhau qua các khóa ngoại. Nhờ thế việc lặp dữ liệu sẽ được giảm thiểu tối đa.

##### Concurrency

Trong nhiều scenario, data được đọc và ghi bởi nhiều người dùng ở cùng 1 thời điểm là điều rất phổ biến. Ta cần phải đảm bảo những tương tác đó tránh được việc data ko đồng nhất. Thông qua transactions của relational databases, thì việc truy cập đồng bộ sẽ được đảm bảo tối ưu.

##### Integration

Việc phải tổng hợp dữ liệu từ nhiều nguồn là 1 quy trình rất phổ biến ở các hệ thống enterprise. Cách thông thường đc sử dụng trong quy trình đó chính là tích hợp 1 shared database mà nhiều ứng dụng cùng lưu trữ dữ liệu. Nhờ đó, tất cả ứng dụng có thể truy cập dữ liệu của ứng dụng khác dễ dàng.

##### Backup and disaster recovery

Relational databases đảm bảo việc trạng thái của dữ liệu đc đồng nhất ở bất kỳ thời điểm nào. Việc hỗ trợ export và import operation cũng giúp cho việc backup và khôi phục trở nên dễ dàng hơn. Hầu hết cloud-based relational databases đề thực hiện việc sao lưu liên tục để tránh việc thất thoát dữ liệu và giúp quá trình khôi phục dữ liệu dễ dàng và nhanh hơn.

#### Drawback

**Impedance mismatch**

Thông thường, các data model cho relational database sẽ được tổ chức thành các cấu trúc dạng bảng với relations và tuples. Điều này dẫn tới 1 vài hạn chế. Trong nhiều trường hợp thực tế, dữ liệu sẽ cần được tổng hợp thành 1 model rất phức tạp để trả về clients, khiến cho ta phải tương tác với nhiều bảng cùng lúc rất thường xuyên, gia tăng độ phức tạp cho các business logics để đảm bảo ko bị chớ về khía cạnh performance.

[image]
  src: /img/system-design/databases.webp
  alt: Complex db model illustration
  caption: Data can be complex model in RDBMS

### Non-relational (NoSQL) databases

Như tên gọi, ta ko phải dùng SQL với kiểu này. Ta cũng đã học rất nhiều loại cấu trúc dữ liệu, vậy tại sao ta lại ko nghĩ tới việc áp dụng chúng để lưu trữ dữ liệu?

Những database này được sử dụng ở những ứng dựng mà yêu cầu lượng lớn semi-structured và unstructured data, cần ít độ trễ và data models linh hoạt

#### Why non-relational databases?

##### Simple design

Nhờ sự linh hoạt trong data model, ta có thể design dữ liệu cho các databases rất dễ dàng

##### Horizontal scaling

1 ưu điểm của NoSQL đó là khả năng chạy các databases trong 1 cluster lớn, giúp giải quyết vấn đề khi lưu lượng ng dùng truy cập tại 1 thời điểm tăng cao.

NoSQL giúp cho việc scale trở nên dễ dàng hơn nhiều nhờ việc dữ liệu tới 1 đối tượng cụ thể đc lưu trong 1 document riêng thay vì vài bảng qua các nodes. Chúng thường phân bố dữ liệu qua nhiều nodes và cân bằng dữ liệu với các queries qua các nodes tự động. Trường hợp có 1 node bị oẳng, chúng có thể thay thế bằng node khác mà ko làm gián đoạn cả ứng dụng

##### Availability

Việc thay thế các node trong 1 hệt thống NoSQL đc diễn ra với 0 downtime, và hầu hết các biến thể NoSQL databases đề hỗ trợ sao lưu dữ liệu để đảm bảo tính availability cao và khả năng phục hồi sau khi oẳng

##### Support for unstructured and semi-structured data

Các NoSQL databases có thể tương tác với dữ liệu mà ko cần định nghĩa schema trước. Ví dụ, document databases chấp nhận các documents (JSON, XML, BSON, etc...) với nhiều trường khác nhau, ko có 1 cấu trúc cố định

#### Types of NoSQL databases

**Key-value database:** Sử dụng phương thức key-value như hash tables để lưu dữ liệu thành các cặp `{ key: value }`. 1 số loại phổ biến có thể kể đến Amazon DynamoDB, Redis và Memcached DB.

_Use case:_ Key-value database rất hiệu quả cho việc ứng dụng lưu dữ liệu theo session

**Document database:** Đc thiết kế để lưu trữ và lấy các documents dạng XML, JSON, BSON, etc... Có thể kể đến như MongoDB, Amazon DocumentDB hay Google Cloud Firestore

_Use case:_ Thích hợp cho việc ứng dụng các dữ liệu ko dễ định nghĩa cấu trúc trước. Chẳng hạn như trong 1 ứng dụng e-commerce, 1 sản phẩm có thể có hàng ngàn thuộc tính, nếu dùng relational databases thì việc design schema sẽ khá khó khăn, còn với document databases, ta sẽ ko cần phải quan tâm tới những thuộc tính này ảnh hưởng sao nữa. Tất cả sẽ đc gói gọn trong 1 document

```json
{
	"id": 2908,
	"name": "Khoa Tu",
	"nickname": ["Tusss", "Tuslipid"],
	"title": "Mr.",
	"occupation": "Software Engineer",
	"salary": "Nghìn đô",
	...
}
```

**Graph database:** Sử dụng cấu trúc dữ liệu dạng graph để lưu trữ dữ liệu, trong đó các nodes tượng trưng cho các entities, và các cạnh tượng trưng cho quan hệ giữa các entities. 1 số lại graph databases phổ biến bao gồm Neo4J, OrientDB và InfiniteGraph

_Use case:_ Được ứng dụng rộng rãi trong các app mạng xã hội và địa lý

**Columnar database:** Lưu dữ liệu dưới dạng cột chứ ko phải là dòng như trong relational database. Chúng kích hoạt khả năng truy cập dữ liệu ở mọi entries. Các columnar databases nổi tiếng có thể kể đến như Cassandra, HBase, Hypertable và Amazon Redshift.

_Use case:_ Hiệu quả với các use case cần tổng hợp lượng lớn dữ liệu và các queries phân tích dữ liệu. Loại database này giúp giảm mạnh lượng I/O tiêu thụ.

#### Drawbacks of NoSQL databases

##### Lack of standardization

Vì tính ko có schema của chúng, nên việc tiêu chuẩn hóa cho thiết kế các databases này là 1 cơn đau đầu nhức nhối

##### Consistency

Các NoSQL databases cung cấp các sản phẩm khác nhau dựa trên các trade-offs giữa tính consistency và availability khi các sự cố xảy ra. Với các databases này, ta sẽ ko có được sự toàn vẹn dữ liệu như bên relational databases.

### Choose the right database

| Relational Database                    | Non-relational Database                       |
| -------------------------------------- | --------------------------------------------- |
| Nếu data có cấu trúc                   | Nếu data ko có cấu trúc                       |
| Nếu tính chất ACID là yêu cầu bắt buộc | Nếu cần serialize và deserialize dữ liệu      |
| Nếu kích thước dữ liệu đơn lẻ nhỏ      | Nếu kích thước dữ liệu đơn lẻ lớn và phức tạp |

## Data Replication

1 data store của ta đòi hỏi phải có những tính chất như sau:

- Tính availability khi gặp sự cố
- Tính scalability
- Performance (độ trễ thấp và throughput cao)

### Replication

Thuật ngữ này liên hệ tới việc giữ các bản copy khác nhau của dữ liệu tại các nodes khác nhau (phân bố ở các khu vực địa lý).

Replication hỗ trợ ta trong việc cải thiện tính availability, scalability và performance, nhưng đi kèm với đó là độ phức tappj tăng cao. Vấn đề bắt đầu nảy sinh khi ta phải bảo trì các thay đổi trong các dữ liệu đc sao lưu qua thời gian.

- Làm sao để ta giữ các bản copies của dữ liệu được đồng nhất?
- Làm sao để ta xử lý các replica nodes bị gặp sự cố?
- Ta nên replicate đồng bộ hay bất đồng bộ?
- Ta sẽ xử lý vấn đề lag khi replication trong trường hợp bất đồng bộ như thế nào?
- Ta sẽ xử lý các concurrent writes ra sao?
- Làm sao để ta chọn ra các model nhất quán để show cho lập trình viên?

[image]
  src: /img/system-design/databases-1.webp
  alt: Database replication diagram
  caption: Database replication diagram

#### Synchronous vs asynchronous replication

- **Synchronous replication:** node chính cần chờ xác nhận từ các nodes phụ về việc cập nhật dữ liệu. Sau khi nhận đc tất cả xác nhận, node chính trả tín hiệu thành công về client.
  - Lợi ích của con này là tất cả các node phụ sẽ luôn được cập nhật mới nhất
  - Hạn chế thì node chính sẽ ko thể thực hiện hoạt động tiếp theo khi tất cả các nodes phụ chưa gửi xác nhận về, dẫn tới việc độ trễ cao để phản hồi lại client.
- **Asynchronous replication:** node chính ko cần đợi xác nhận từ các nodes phụ mà trả thông báo thẳng về client sau khi bản thân nó đc cập nhật thành công.
  - Lợi ích là node chính có thể tiếp tụ thực hiện hoạt động tiếp theo kể cả khi node phụ gặp sự cố.
  - Nhưng nếu node phụ gặp sự cố, điều đó đồng nghĩa là dữ liệu đáng lẽ đc copy vào node này sẽ bị mất.

[image]
  src: /img/system-design/databases-2.webp
  alt: Synchronous vs asynchronous sequence diagram

### Data replication models

#### Single leader/primary-secondary replication

[image]
  src: /img/system-design/databases-3.webp
  alt: Primary-secondary replication diagram

##### Primary-secondary replication

- data được sao lưu qua nhiều nodes. 1 node đc thiết kế như node chính, chịu trách nhiệm cho việc viết dữ liệu vào cluster, và gửi tất cả dữ liệu cần đc viết tới các nodes phụ, giữ cho chúng đồng bộ nhau.
- Thích hợp cho các workload nặng về đọc dữ liệu.
- Node chính có thể bị dính bottleneck nếu replicate quá nhiều node phụ.
- Có lợi thế về read resilient. Các nodes phụ vẫn có thể xử lý các requests đọc trong trường hợp node chính oẳng.
- Nếu ta sử dụng asynchronous replication, cách tiếp cận này sẽ bị ko nhất quán.

##### Primary-secondary methods

- Statement-based replication: node chính lưu tất cả câu lệnh mà nó thực thi (insert, delete, update, etc...) và gửi chúng tới nodes phụ để thực hiện tương tự.
- Write-ahead log (WAL) shipping: node chính lưu câu query trc khi thực thi vào 1 log file (write-ahead lgo file). Rồi chúng sử dụng file log đó để copy dữ liệu vào nodes phụ.
- Logical (row-based) log replication: tất cả nodes phụ replicate các sự thay đổi của dữ liệu.

#### Multi-leader replication

[image]
  src: /img/system-design/databases-4.webp
  alt: Multi-leader replication diagram

- **Multi-leader replication:** Gồm nhiều nodes chính thực hiện các lệnh writes và gửi tới các nodes chính và phụ khác
- Khá hữu dụng trong các ứng dụng mà cần hoạt động kể cả khi người dùng đang offline. Ví dụ 1 calendar sắp xếp cuộc họp mà ta có thể đồng bộ lịch giữa các người dùng kể cả khi họ đang không offline.

##### Conflict

Vì các nodes chính xử lý các write requests 1 cách đồng thời, chúng có thể đang chỉnh sửa cùng 1 dữ liệu, tạo nên conflict.

[image]
  src: /img/system-design/databases-5.webp
  alt: Conflict diagram

##### Handle conflicts

- _Conflict avoidance:_ Ngăn việc conflict diễn ra ngay từ đầu vào.
- _Last-write-wins:_ Sử dụng local clock, tất cả nodes gán timestamp vào mỗi update. Khi 1 conflict xảy ra, update với timestamp mới nhất sẽ được lựa chọn.
- _Custom logic:_ Ta có thể tự viết logic để xử lý conflicts dựa theo app của ta.

#### Peer-to-peer/leaderless replication

[image]
  src: /img/system-design/databases-6.webp
  alt: Peer-to-peer replication diagram

- Xử lý vấn đề nút thắt cổ chai ở primary-secondary replication bằng cách vứt cái gọi là node chính ra chuồng gà.
- Tất cả các nodes có độ ưu tiên như nhau và chấp nhận cả read & write requests.
- Vẫn có thể gây ra sự ko nhất quán dữ liệu. Vì nhiều nodes chấp nhận write requests có thể gây ra các tiến trình writes đồng thời.

##### Quorums

Thử tưởng tượng ta có 3 nodes. Nếu ít nhất 2 nodes trên 3 nodes đảm bảo trả về updates thành công, nghĩa là chỉ có tối đa 1 node bị oẳng. Điều này đồng nghĩa vs việc ta có thể đọc ở 2 nodes, và ít nhất 1 trong 2 con này sẽ có phiên bản đã đc updated, và hệ thống của ta có thể tiếp tục hoạt động.

Nếu ta có n nodes, mỗi write phải đc updated ở ít nhất w nodes thì mới đc tính là thành công. Để có thể luôn đọc được dữ liệu đã được cập nhật, ta sẽ phải đọc từ r nodes sao cho _w + r > n_ (ít nhất 1 trong các nodes sẽ có dữ liệu đc cập nhật). Lệnh đọc và viết của quorum tương đương với giá trị r và w. Những giá trị n,w và r này đều có thể config lại ở các databases dạng Dynamo.

[image]
  src: /img/system-design/databases-7.webp
  alt: Quorums illustration

## Data Partitioning

### Why do we partition data?

- Lượng data lớn, đồng nghĩa mỗi câu query, mỗi operation mà database phải thực hiện sẽ càng nặng, tốn nhiều tài nguyên và thời gian.
- Để giải quyết vấn đề trên, có thể cân nhắc tới giải pháp chuyển qua hệ thống cho NoSQL, nhưng làm thế thì sẽ phải sửa lại cả codebase tương thích, khá là chớ với 1 legacy codebase.
- Có thể scale databases truyền thống bằng các giải pháp bên thứ ba. Nhưng làm thế lại gia tăng độ phức tạp với việc cấu hình để tích hợp với bên thứ 3.
- Cách tốt nhất là ta tự chia lẻ dataset của ta ra. Data partitioning (hoặc sharding) cho phép ta sử dụng nhiều nodes trong đó mỗi nodes chỉ quản lý 1 phần nhất định của cả cục dataset.

[image]
  src: /img/system-design/databases-8.webp
  alt: Partition illustration

### Sharding

Cách để phân chia dữ liệu từ 1 cục dataset lớn thành các chùm nhỏ hơn?

- Vertical sharding
- Horizontal sharding

#### Vertical sharding

Ta có thể tách 1 bảng lớn ra thành các bảng nhỏ hơn chứa các trường khác nhau ban đầu thuộc về bảng lớn. Và chứa các bảng khác nhau ở các database instances khác nhau.

Thông thường, **vertical sharding** thường đc sử dụng để tách các bảng chứa những cột với đoạn text vô cùng dài hoặc blob ra riêng khỏi các cột khác, nhằm tăng tốc độ lấy dữ liệu từ bảng chính.

[image]
  src: /img/system-design/databases-9.webp
  alt: Vertical sharding illustration
  caption: An employee with name and picture can be sharded to a table containing profile information only and a table containing media data only

#### Horizontal sharding

**Horizontal sharding** (hay còn gọi là partitioning) đc sử dụng để chia 1 bảng lớn thành các bảng nhỏ theo cách phân dòng. Mỗi partition của bảng gốc được phân tán qua các database servers và đc gọi là **shard**.

Thông thường, có 2 chiến lược để phân bảng như sau:

- Key-range based sharding
- Hash based sharding

#### Key-range based sharding

Mỗi partition đc assigned theo các chuỗi khóa liên tiếp nhau.

[image]
  src: /img/system-design/databases-10.webp
  alt: Key-range based sharding illustration

Đôi khi 1 database sẽ bao gồm nhiều bảng đc liên kết với nhau qua các khóa ngoại. Trong trường hợp này, việc shard horizontally cần phải đc thực hiện với cùng các partition key ở mọi bảng đc liên kết. Các bảng có cùng partition key sẽ đc phân tán qua 1 database shard.

[image]
  src: /img/system-design/databases-11.webp
  alt: Key-range based sharding illustration

- **Advantages**

  - Dễ implement nhờ key-range method
  - Queries theo khoảng id có thể thực hiện được bằng cách sử dụng partitioning keys và giữ được thứ tự của id

- **Disadvantages**

  - Queries theo khoảng id ko thể đc thực hiện với các khóa khác
  - Nếu các keys ko đc phân bố cẩn thận, nhiều nodes sẽ phải lưu trữ lượng dữ liệu lớn hơn nhiều nodes khác

#### Hash-based sharding

Sử dụng hash function để băm giá trị 1 trường ra 1 giá trị riêng, rồi chia phần dư giá trị đó với số lượng node để phân chia vào node tương ứng.

[image]
  src: /img/system-design/databases-12.webp
  alt: Hash based sharding illustration

- **Advantages**

  - Các khóa đc phân bố đều nhau qua các nodes

- **Disadvantages**

  - Ta ko thể thực hiện query theo khoảng với kỹ thuật này

#### Consistent hashing

Ta chỉ định các servers và các key đc băm vào 1 vòng tròn trừu tượng mà tại đó ta quy định quy luật để key nào map vào server nào

- **Advantages**

  - Dễ scale ngang, vị trí của dữ liệu đc shard ít bị ảnh hưởng khi số lượng servers thay đổi
  - Tăng throughput và cải thiện độ trễ của ứng dụng

- **Disadvantages**

  - Việc chỉ định node 1 cách bất kỳ như vậy có thể khiến phân tán ko đều nhau

#### Rebalance the partitions

Độ tải của query có thể ko cân bằng thông qua các nodes vì những lý do sau:

- Độ phân tán của dữ liệu ko đều
- Quá nhiều dữ liệu trong 1 partition
- Query traffic tăng cao

Ta có thể cân bằng partitions với những chiến lược sau:

- Tránh việc băm phần dư với n vì số lượng server thay đổi ảnh hưởng lên kỹ thuật này
- Cố định số lượng partitions, đc sử dụng trong Elasticsearch, Riak, etc...
- Dynamic partitioning, đc sử dụng trong HBase và MongoDB
- Partition propotionally to nodes, đc sử dụng trong Cassandra và Ketama

#### Partitioning and secondary indexes

Ở những phần trên ta đều đã nói tới các mẫu data partitioning với bảng ghi đc lấy bằng khóa chính. Nhưng nếu ta phải truy cập tới bản ghi bằng index khác thì sao?

Ta có thể partition index phụ theo những cách sau

**Partition secondary indexes by document**

Mỗi partition có index riêng chỉ để bao hàm các documents trong chúng và ko quan tâm tới dữ liệu ở các partition khác. Index này còn đc gọi là local index.

[image]
  src: /img/system-design/databases-13.webp
  alt: Partition secondary indexes by document illustration

**Partition secondary indexes by the term**

Ta có thể tạo 1 global index cho 1 term mà bao gồm dữ liệu ở tất cả partitions.

[image]
  src: /img/system-design/databases-14.webp
  alt: Partition secondary indexes by the term illustration

Cách này sẽ có hiệu quả đọc dữ liệu tốt hơn hẳn secondary indexes by document, tuy nhiên tiến trình viết sẽ trở nên phức tạp hơn vì ảnh hưởng lên nhiều partitions.

### Request Routing

1 vấn đề khá là phổ biến khi làm việc với database đã đc partition. Đó là làm sao để client có thể biết node nào là database đúng để gửi request tới.

Vấn đề này trong giới còn mang tên là **service discovery**. Ta có thể có trc 1 vài cách tiếp cận sau:

- Chấp nhận client gửi request tới node bất kỳ, nếu node này ko có data, request sẽ đc forward sang node khác để tìm
- Ta cần thêm 1 lớp router. Tất cả requests sẽ đc forward tới lớp này đầu tiên, và nó sẽ xác định node nào cần connect tới với mỗi request
- Client đã có sẵn thông tin liên quan tới partition liên quan nên học có thể connect trực tiếp tới node đó

Để track sự thay đổi trong cluster, nhiều hệ thống dữ liệu phân tán phải sử dụng 1 server quản lý riêng như ZooKeeper, ví dụ như HBase, Kafka, etc...

## Trade-offs in Database

### Pros & cons of a centralized database

#### Advantages

- Dễ bảo trì dữ liệu
- Đảm bảo tính thống nhất với ACID transactions tốt hơn so với hệ phân tán
- Cung cấp data model đơn giản hơn
- Hiệu quả cho các business yêu cầu lượng dữ liệu nhỏ

#### Disadvantages

- Khi lưu lượng người dùng tăng cao, centralized database có thể bị tăng độ trễ, giảm hiệu năng
- Single point failure

### Pros & Cons of a distributed database

#### Advantages

- Hiệu năng truy cập dữ liệu cao
- Dữ liệu với mức độ minh bạch khác nhau có thể đc lưu trữ ở vị trí khác nhau
- Các transactions phức tạp bao gồm các queries có thể đc chia thành các queries phụ tối ưu hoạt động song song với nhau

#### Disadvantages

- Thỉnh thoảng dữ liệu sẽ đc yêu cầu từ nhiều phía khác nhau, dẫn tới việc thời gian phản hồi tăng cao ngoài mong đợi
- Các bảng được partitioned qua các node nên việc join cần đc tái tạo các quan hệ dữ liệu 1 cách chuẩn xác, thành ra những tiến trình này sẽ vô cùng tốn kém
- Việc bảo trì dữ liệu giữa các phía trong database phân tán sẽ rất khó khăn, đòi hỏi rất nhiều đại lượng đc đo đạc thêm
- Việc update và backup sẽ tốn thêm thời gian để dữ liệu có thể đồng bộ nhau

### Query optimization and processing speed in a distributed database

1 transaction trong 1 distributed database phụ thuộc vào kiểu query, số lượng các shard tham gia, tốc độ truyền dữ liệu, ngoài ra còn yếu tố phần cứng và kiểu database.

Ví dụ, ta có 1 query truy cập tới 3 bảng: `Store`, `Product`, và `Sales` nằm ở các nơi host database khác nhau.

[image]
  src: /img/system-design/databases-15.webp
  alt: Database example image

Biết rằng dữ liệu ở các bảng đc phân bố tới các sites như sau:

- Bảng `Store` lưu 10000 tuples ở site A
- Bảng `Product` lưu 100000 tuples ở site B
- Bảng `Sale` lưu 1 triệu tuples ở site A

Giờ ta cần thực hiện query như sau

```
Select store_key from (Store join Sale join Product)
where region='East' and brand='Wolf'
```

Đầu tiên, có thể thấy ta sẽ cần join cả 3 bảng trước, rồi lọc ra các tuple có Store.region là 'East' và Product.brand là 'Wolf', tiến hành chọn ra trường store_key.

Ta đc cho biết rằng mỗi tuple nặng tầm 200 bits, tương đương với 25 bytes. Ngoài ra:

- Số lượng `Wolf` brand là 10
- Số lượng stores ở region `East` là 3000 (trong tổng 10000 stores)
- Lưu lượng giao tiếp dữ liệu thì như sau:
  - Data rate: 50M bits/s
  - Độ trễ truy cập: 0.1 s

#### Parameters assumption

Gọi:

- a = Tổng độ trễ truy cập
- b = Data rate
- v = Khối lượng dữ liệu

Ta có công thức để tính thời gian giao tiếp giữa các site sẽ là:

```
T = a + v/b
```

#### Possible approaches

- Mang `Product` tới site A và thực hiện câu query ở A. Ta sẽ cần chuyển 100000 tuples ở B tới A.

```
T = 0.1 + (100000*200) / 50000000 = 0.5 (s)
```

- Mang `Store` và `Sale` từ A tới B. Ta sẽ cần chuyển 10000 `Store` tuples và 1 triệu `Sale` tuples tới B.

```
T = 0.1 + (10000+1000000)*200 / 50000000 = 4.24 (s)
```

- Chỉ lấy những tuples có brand `Wolf` ở site B (10), rồi mang sang A để thực hiện query.

```
T = 0.1 + (10*200) / 50000000 ~ 0.1 (s)
```

Chỉ cần tính ra như vậy là ta có thể biết ngay cách tiệp cận nào sẽ là tối ưu để thực hiện câu query trong hệ database phân tán trên.
