---
title: Abstractions
unlisted: true
date: 2023-07-15
prev_article:
  path: /system-design/interview
  title: System Design Interview
next_article:
  path: /system-design/non-functional-system-characteristics
  title: Non-functional System Characteristics
---

# Abstractions

Như đã nói qua về abstractions ở bên OOP, đây là 1 cách định nghĩa cho việc che đi những điểm mà ta ko cần. Trong system design, các thành phần ta bàn tới sẽ ko yêu cầu phải rõ ràng chi tiết cấu tạo như nào, code như nào, mà thay vào đó ta chỉ cần hiểu chức năng và cách ứng dụng các thành phần đấy là được.

> Trong context của khoa học máy tính, ta sử dụng máy tính cho công việc của ta, chứ ko quan tâm tới chi tiết hardware với các dòng điện đang hoạt động trong nó.

**Database abstraction**

`Transactions` là 1 ví dụ tiêu biểu database abstraction khi mà nó đã che đi rất nhiều chi tiết, vấn đề đã diễn ra khỏi user khi họ đọc, viết và thay đổi data; và đưa ra đc cái interface để thông báo thành công hoặc lỗi. Cái abstraction của transaction giúp cho end users ko phải phân tâm vào các cơ chế sâu bên trong mà thay vào đó họ sẽ có thể tập trung hơn vào business logic.

**Abstractions in distributed systems**

Abstractions trong distributed systems giúp các kỹ sư đơn giản hóa công việc của họ. Cái abstraction này đã được mở rộng ra thể hiện rõ nhất ở các big techs, ví dụ điển hình anh em có thể liên hệ đó là nhà cung cấp cloud như AWS, GCP hay Azure. Tất cả các chi tiết được implements đằng sau các distributed services đã được ẩn đi về phía user, nhờ đó giúp cho các dev tập trung vào ứng dụng của họ hơn phải để ý thêm cả các distributed services nữa.

## Network Abstractions: Remote Procedure Calls

**Remote procedure calls** (RPCs) cung cấp 1 abstraction của 1 procedure call cho các dev bằng cách che đi những sự phức tạp của việc đóng gói và gửi các function arguments tới remote server, nhận lại kết quả đc trả về và quản lý các network retries

### What is RPC?

**RPC** là 1 interprocess communicaiton protocol được sử dụng rộng rãi trong distributed systems. Trong OSI model của giao thức mạng, RPC mở rộng ra các lớp vận chuyển và ứng dụng

Các cơ chế của **RPC** được gọi ra khi 1 chương trình máy tính tạo ra 1 procedure hoặc subroutine để thực thi trong các địa chỉ tách rời nhau

### How does RPC work?

Khi ta tạo 1 rpc, môi trường đang gọi nó đc tạm hoãn và các procedure params được gửi thông qua đg truyền mạng tới môi trường thực thi những procedure đó. Khi 1 procedure đc thực thi xong, kết quả đc trả về môi trường đang gọi nó

Để hình dung rõ hơn các hđ, ta sẽ lấy 1 ví dụ về 1 client-server program. Ta có 5 components chính tham gia vào chương trình RPC:

Client, client stub, và 1 RPC instance chạy trên client machine. Server, server stub và 1 RPC instance chạy trên server machine

[image]
  src: /img/system-design/abstractions.webp
  alt: The components of an RPC system
  caption: The components of an RPC system

Giữa quá trình RPC, các bước sau sẽ lần lượt diễn ra:

1. Client khởi tạo 1 client stub process. Cái client stub đc lưu trong address space của client
2. Cái client stub đổi các params thành format tiêu chuẩn và đóng gói chúng lại thành 1 message. Sau khi đóng gói, client stub request local RPC runtime để gửi cái message tới server, và đợi message kết quả từ server
3. RPC runtime tại client gửi message tới server. Sau khi gửi 1 message tới server, nó đợi message kết quả từ server
4. RPC runtime tại server nhận message và chuyển chúng tới server stub
5. Server stub mở bung cái message ra, lấy các params và gọi tới server routine mong muốn, sử dụng local procedure calls để thực thi request đc yêu cầu
6. Sau khi server routine thực thi xong, kết quả đc trả về server stub
7. Server stub đóng gói và kết quả đc trả về thành 1 meseage và gửi chúng tới RPC runtime tại server trên layer vận chuyển
8. RPC runtime của server trả về kết quả đc đóng gói tới RPC runtime của client
9. RPC runtime của client nhận kết quả và gửi tới client stub
10. Client stub mở bung các kết quả, và thực thi chúng để trả về cho caller

[image]
  src: /img/system-design/abstractions-1.webp
  alt: The workflow of an RPC
  caption: The workflow of an RPC

## Spectrum of Consistency Models

### Consistency là gì?

Trong distributed systems, consistency có thể mang nhiều ý nghĩa. 1 có thể là mỗi replica node có cùng data view trong 1 thời điểm. Mặt khác đó là mỗi read req lấy giá trị của lần write gần nhất.

Trên đây ko phải là những định nghĩa duy nhất của consitency vì có rất nhiều cách định nghĩa khác nhau phù thuộc vào chủ đề. Thông thường, **consistency models** cung cấp cho ta với các absractions nhằm đưa ra lý do cho sự đúng đắn của distributed systems trong việc reads, writes and mutations data

Nếu ta có thiết kế hoặc build 1 application mà cần 1 3rd-party storage system như S3 hay Cassandra, ta có thể nhìn vào cái consistency guarantees đươc cung cấp bới S3 để quyết định khi nào sử dụng chúng.

Có điểm giới hạn của consistency spectrum:

- Strongest consistency
- Weakest consistency
  Giữa 2 điểm này, ta sẽ có các consistency models đc phân bố tăng dần từ weakest tới strongest:
- Eventual consistency
- Causal consistency
- Sequential consistency
- Strict consistency / linearizability

Bên cạnh đó, có 1 sự khác biệt về consistency giữa ACID properties và CAP theorem:

- Database rules là trái tim của **ACID theorem**. Nếu 1 schema đặt rõ các giá trị phải là độc nhất, 1 consistent system sẽ chắc chắn rằng các giá trị đó độc nhất ở mọi actions.

  Nếu 1 khóa ngoại chỉ ra rằng xóa 1 dòng sẽ xóa cả những dòng đc tổ chức với dòng đó, 1 consistent system sẽ chắc chắn state đó ko thể chứa đựng các dòng liên quen 1 khi dòng base đã bị hủy đi

- **CAP consistency** đảm bảo rằng, trong 1 distributed system, mỗi replica của 1 logical value có cùng chính xác 1 giá trị trong toàn thời gian. Lưu ý rằng đây như 1 đảm bảo về tính logic hơn là về tính vật lý.

  Bởi vận tốc ánh sáng, replicate những con số qua 1 cluster có lẽ tốn 1 ít thời gian. Bằng việc ngăn clients truy cập tới values khác nhau ở các node tách rời, cái cluster có thể nhờ thế mà đưa ra 1 bức tranh logic tổng thể

### Eventual consistency

**Eventual consistency** là consistency model yếu nhất. Các ứng dụng ko có yêu cầu về thứ tự quá chặt chẽ và ko cần phải lấy lastest writes mỗi lần read request có thể chọn model này.

Eventual consistency đảm bảo tất cả replicas sẽ trả về cùng 1 kết quả cho cái read request theo từng event, nhưng trả lại kết quả ko có nghĩa là trả lại kết quả mới nhất. Tuy vậy, đến cuối cùng giá trị vẫn sẽ đạt tới state mới nhất của nó

> Eventual consistency đảm bảo **high availability**

#### Ví dụ

**Domain name system** là system với highly available cho phép tra cứu hàng trăm triệu thiết bị thông qua internet. Nó sử dụng 1 eventual consistency model và ko cần phải đối chiếu tới giá trị mới nhất

### Causal consistency

**Causal consistency** hoạt động bằng cách phân hạng các operations thành dependent và independent. **Dependent operations** còn đc gọi là causally-related operations. Causal consistency bảo toàn thứ tự của causally-related operations.

```
|-----------|
| x = a     |
| b = x + 5 |
| y = b     |
|-----------|

           |--------------------------------------------------> Time
Process P1: write(x) -> a
Process P2:                   | read(x) <- a | write(y) -> b |
```

Trong sơ đồ trên, process P1 viết 1 giá trị _a_ tới vị trí x. Process P2 viết giá trị _b_ tới vị trí y, nhưng để viết được thì trước tiên nó phải tính giá trị _b_ trước. Vì _b=x+5_, read operation lên x nên đc thực hiện trước việc viết b lên y. Thế nên _read(x)a_ và _write(y)b_ có tính causally related

Cái model này ko đảm bảo đc tính causally related cho thứ tự của các operations. Nhìn chung, độ consistency của cái causal thuộc dạng yếu, nhưng nó vẫn mạnh hơn eventual consistency model

#### Ví dụ

Causal consistency model đc sử dụng trong hệ thống comment. Ví dụ, để phản hồi 1 comment trên 1 post Facebook, ta muốn hiển thị các comments sau cái comment mà nó phản hồi tới

### Sequential consistency

**Sequential consistency** có độ consistency mạnh hơn so với mô hình causal consistency. Nó bảo toàn thứ tự đc quy định cụ thể bởi mỗi client. Tuy nhiên, sequential consistency ko đảm bảo việc writes đc hiển thị ngay lập tức hoặc trong cùng thứ tự theo thời gian

#### Ví dụ

Trong app mạng xã hội, ta thường ko quan tâm tới thứ tự xuất hiện posts của bạn vè. Tuy nhiên, khi truy cập tới bảng tin của 1 account ta vẫn cần các posts đc sắp xếp theo đúng thứ tự như thời gian chúng đc tạo. Tương tự, ta cũng kỳ vọng các comments trong 1 post nên đc hiển thị theo comments mới nhất.

### Strict consistency a.k.a linearizability

1 **strict consistency** (hay **linearizability**) là model có độ consistency mạnh nhất. Model này đảm bảo 1 read request từ bất kỳ replicas sẽ nhận đc giá trị mới nhất. 1 khi 1 client truyền đi thông tin rằng write operation đã đc thực thi, các clients khác có thể đọc đc giá trị đó

Linearizability là 1 bài toán khó trong hệ thống phân tán. 1 số lý do cho độ khó này là độ trễ của mạng và failures

```
|---------------|
| Node A = 2    |
| Node B = 2    |
| Node C = 2    |
|---------------|

\- Client A writes value 10 to Node A -> Node A response success to client A and forwards updates to Node B and Node C
\- Node B receives the updates and has the value 10 now
\- Client B reads the Node B, it returns 10
\- Node C has not received the updates
\- Client C reads the Node C, it returns 2
```

Thông thường, việc sao lưu đồng bộ là 1 trong những yếu tố chính để có đc độ consistency mạnh dù cho nó ko đc thỏa đáng cho lắm. Ta có thể cần các thuật toán đồng thuận như Paxos và Raft để đạt đc consistency

Linearizability ảnh hưởng tới tính availability nên ko đc sử dụng thường xuyên. Các ứng dụng vs yêu cầu consistency cao sẽ sử dụng các kỹ thuật như **quorum-based replication** để tăng cường độ availability cho hệ thống

#### Ví dụ

Thay đổi mật khẩu cho 1 account yêu cầu tính consistency cao. Ví dụ, nếu ta nghi ngờ 1 hoạt động trong tài khoản ngân hàng của ta, ta phải thay đổi mật khẩu ngay lập tức để ngăn cho unauthorized users truy cập tới tài khoản của ta. Nếu account của ta vẫn đc truy cập bằng mật khẩu cũ vì độ consistency yếu, thì việc đổi mật khẩu rõ ràng là vô dụng

## The spectrum of failure models

Bất cứ hệ thống nào cũng đều có failures, và chúng diễn ra với biểu hiện đa dạng. Dưới đây là sơ đồ hiển thị các failure models khác nhau.

### Fail-stop

1 node trong hệ thống phân tán tạm dừng thường xuyên. Tuy nhiên, các nodes khác vẫn detect ra việc node đó tạm dừng thông qua giao tiếp giữa chúng. Từ góc nhìn của người xây dựng nên hệ thống phân tán, fail-stop failures là vấn đề dễ giải quyết nhất

### Crash

1 node tạm dừng 1 cách im lặng méo ai hay, các node khác ko thể detect ra rằng 1 node đã dừng hoạt động

### Omission failures

Trong **ommission failures**, 1 node gửi và nhận tin nhắn thất bại. Failures này có 2 loại:

- Nếu node phản hồi các request thất bại, đó là _send omission failure_
- Nếu node nhận request thất bại, đó là _receive omission failure_

### Temporal failures

1 node tính ra kết quả đúng, nhưng thời gian thực thi lại quá chậm. Kiểu failure này có thể do thuật toán tối ưu kém, chiến lược thiết kế kém, hoặc việc đồng bộ giữa các processor bị thất thoát

### Byzantine failures

1 node biểu hiện ra trạng thái random như gửi tin nhắn tùy ý trong thời gian bất kỳ, trả về kết quả sai, hoặc dừng thực thi giữa chừng. Kiểu failure này xảy ra hầu hết vì bị tấn công từ 1 bên mã độc hoặc do bug của phần mềm. Đại khái thì mấy quả bug từ trên trời rơi xuống nên nó cứ là khó để xử lý nhất
