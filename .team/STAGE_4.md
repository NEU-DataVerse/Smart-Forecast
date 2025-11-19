Chắc chắn rồi. Đây là phân rã chi tiết cho Giai đoạn 4, giai đoạn "chạy nước rút" cuối cùng để hoàn thiện và đóng gói sản phẩm.

---

## 🏁 Giai đoạn 4: Hoàn thiện & Demo (01/12 – 05/12)

**Mục tiêu:** "Đóng băng" tính năng, tập trung sửa lỗi, đóng gói sản phẩm và chuẩn bị kịch bản demo hoàn chỉnh cho ngày 05/12.

### Epic 1: [P4] Kiểm thử & Sửa lỗi (Bug Fixing)

- **Người phụ trách:** Toàn nhóm
- **Mô tả:** Chuyển từ chế độ "Phát triển" (Development) sang "Kiểm thử" (Testing). Tính năng mới sẽ bị "đóng băng" (Feature Freeze).

| ID            | Issue (Công việc)                      | Mô tả chi tiết                                                                                                              | Người thực hiện |
| :------------ | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **P4-BUG-01** | [QA] Kiểm thử Luồng Xác thực           | (Toàn nhóm) Test đăng nhập, đăng ký, phân quyền Admin/Citizen, token hết hạn.                                               | Toàn nhóm       |
| **P4-BUG-02** | [QA] Kiểm thử Luồng Dữ liệu (1 chiều)  | (Đạt, Bích) Kiểm tra dữ liệu AQI/Weather hiển thị trên Web/Mobile có khớp với nhau và cập nhật tự động không.               | Đạt, Bích       |
| **P4-BUG-03** | [QA] Kiểm thử Luồng Báo cáo (Incident) | (Bích, Khải) Bích gửi báo cáo (kèm ảnh) từ Mobile. Khải/Đạt kiểm tra xem ảnh có trên MinIO và data có trong DB không.       | Bích, Khải      |
| **P4-BUG-04** | [QA] Kiểm thử Luồng Duyệt (Incident)   | (Đạt, Khải) Đạt duyệt/từ chối sự cố trên Web. Bích kiểm tra app có cập nhật trạng thái không (nếu có).                      | Đạt, Khải       |
| **P4-BUG-05** | [QA] Kiểm thử Luồng Cảnh báo (Alert)   | (Đạt, Bích) Đạt gửi cảnh báo từ Web. Bích kiểm tra Mobile (cả khi đang mở và tắt app) có nhận được Push Notification không. | Đạt, Bích       |
| **P4-BUG-06** | [QA] Sửa lỗi Responsive (Web)          | (Đạt) Kiểm tra và sửa lỗi vỡ giao diện Dashboard trên các kích thước màn hình khác nhau.                                    | Đạt             |
| **P4-BUG-07** | [QA] Sửa lỗi UI/UX (Mobile)            | (Bích) Rà soát lỗi chính tả, căn chỉnh, font chữ, trải nghiệm người dùng trên cả Android và iOS (qua Expo Go).              | Bích            |

### Epic 2: [P4] Đóng gói & Triển khai (Packaging)

- **Người phụ trách:** Khải (DevOps)
- **Mô tả:** Đảm bảo dự án có thể chạy mượt mà trên máy của ban giám khảo chỉ bằng một lệnh.

| ID            | Issue (Công việc)                        | Mô tả chiE-mail                                                                                                                           |
| :------------ | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **P4-DEP-01** | [DevOps] Hoàn thiện `docker-compose.yml` | Rà soát, dọn dẹp và tối ưu file docker-compose. Đảm bảo các service (backend, orion-ld, db...) khởi động đúng thứ tự (dùng `depends_on`). |
| **P4-DEP-02** | [DevOps] Hoàn thiện file `.env.example`  | Cung cấp file `.env.example` đầy đủ, rõ ràng tất cả các biến môi trường cần thiết để chạy dự án.                                          |
| **P4-DEP-03** | [DevOps] Build Docker Image (Backend)    | Tối ưu `Dockerfile` cho backend Node.js (dùng multi-stage build) để giảm dung lượng image.                                                |
| **P4-DEP-04** | [DevOps] Build file `.apk` (Mobile)      | (Hỗ trợ Bích) Hướng dẫn hoặc thực hiện build file `.apk` (Android) để cài đặt demo trực tiếp (nếu cần).                                   |

### Epic 3: [P4] Hoàn thiện Tài liệu & Kịch bản Demo

- **Người phụ trách:** Bích (Docs), Toàn nhóm
- **Mô tả:** Hoàn tất mọi tài liệu và chuẩn bị cho buổi thuyết trình cuối cùng.

| ID            | Issue (Công việc)                    | Mô tả chi tiết                                                                                                                                                   | Người thực hiện |
| :------------ | :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **P4-DOC-01** | [Docs] Hoàn thiện Slide Thuyết trình | (Bích) Hoàn thiện 100% slide, bổ sung ảnh chụp màn hình, sơ đồ kiến trúc (P2-DOC-02) và luồng demo.                                                              | Bích            |
| **P4-DOC-02** | [Docs] Hoàn thiện `README.md`        | (Bích) Cập nhật `README.md` ở thư mục gốc, bổ sung ảnh GIF demo (nếu có), hướng dẫn chạy nhanh (`docker compose up`).                                            | Bích            |
| **P4-DOC-03** | [Docs] Viết Kịch bản Demo (Script)   | (Toàn nhóm) Thống nhất một kịch bản demo (ví dụ: "Người dân Bích thấy cây đổ -> Gửi báo cáo -> Admin Đạt thấy báo cáo -> Duyệt -> Gửi cảnh báo cho khu vực đó"). | Toàn nhóm       |
| **P4-DOC-04** | [Demo] Chuẩn bị Data Demo            | (Khải) Chuẩn bị dữ liệu "sạch" (clean data) cho buổi demo. Xóa các dữ liệu test lộn xộn, "seed" (gieo) một vài sự cố, cảnh báo mẫu.                              | Khải            |
| **P4-DOC-05** | [Demo] Chạy thử (Rehearsal) lần 1    | (Toàn nhóm) Chạy thử kịch bản demo trên máy chiếu, canh thời gian, đảm bảo kết nối mạng, Expo Go Tunnel...                                                       | Toàn nhóm       |
| **P4-DOC-06** | [Demo] Chạy thử (Rehearsal) lần 2    | (Toàn nhóm) Chạy thử lần cuối, giả lập như đang trình bày thật.                                                                                                  | Toàn nhóm       |

### Ngày 05/12: D-Day (Ngày Demo)

- **Toàn nhóm:** Tự tin trình bày sản phẩm Smart Forecast!
