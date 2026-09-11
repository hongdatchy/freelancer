# Kiến trúc dự án Frontend (thai_huong_schedule)

Tài liệu này quy chuẩn cấu trúc thư mục và nguyên tắc phát triển giao diện (FE) của hệ thống Quản lý Tiến độ Sản xuất Thái Hương (thai_huong_schedule). Tất cả mã nguồn mới hoặc sửa đổi đều phải tuân thủ nghiêm ngặt cấu trúc dưới đây.

## Cấu trúc thư mục (`src/`)

*   **`src/app/`**: Chứa code của các trang (App Router của Next.js).
    *   `src/app/page.tsx`: Dashboard tổng quan danh sách đơn sản xuất.
    *   `src/app/orders/`: Quản lý tạo đơn, chi tiết và chỉnh sửa tiến độ 7 mốc.
    *   `src/app/track/[code]/`: Trang theo dõi timeline dành riêng cho Khách hàng.
    *   `src/app/api/`: Các Next.js API route (gửi mail, webhook,...).
*   **`src/components/`**:
    *   **`ui/`**: Chứa các component được cài đặt từ `shadcn/ui` (Button, Dialog, Badge, Input, Card, Tabs, Progress,...). Không tự ý sửa đổi trừ khi cấu hình chung.
    *   **`custom/`**: Chứa các component tự định nghĩa phục vụ riêng cho dự án.
        *   **`common/`**: Chứa các component dùng chung (Navbar, Header, Footer, StatusBadge, v.v.).
        *   **`timeline/`**: Component chuyên trách cho Interactive Timeline 7 mốc, MilestoneCard, v.v.
        *   **`orders/`**: Form tạo đơn hàng, bảng danh sách đơn hàng.
*   **`src/context/`**: Quản lý React Context (NotificationContext, AuthContext).
*   **`src/dto/`**: Các DTO & Type definitions (`OrderDTO.ts`, `MilestoneDTO.ts`, `NotificationLogDTO.ts`).
*   **`src/lang/`**: Thư mục quản lý đa ngôn ngữ (giữ nguyên quy chuẩn cấu trúc).
*   **`src/layout/`**: Chứa các thành phần layout lớn của trang web (Header, Sidebar, Navigation).
*   **`src/lib/`**: Chứa các file tiện ích (`utils.ts`, `firebase.ts`, `mail-template.ts`).
*   **`src/service/`**: Chứa các hàm/service thao tác Backend/Firebase (`order-service.ts`, `milestone-service.ts`, `notification-service.ts`).
*   **`src/state-manager/`**: Quản lý global state của ứng dụng bằng `zustand` (`order-store.ts`, `user-store.ts`).

## Nguyên tắc triển khai

1.  Tuyệt đối không tự ý thay đổi cấu trúc thư mục trên.
2.  Khi viết component mới:
    *   Nếu là component dùng chung toàn dự án: đặt trong `src/components/custom/common/`.
    *   Nếu là component đặc thù theo tính năng (timeline, orders): đặt trong thư mục con tương ứng tại `src/components/custom/`.
3.  Khi gọi Firebase hoặc API gửi mail, luôn viết qua tầng `src/service/`, không gọi trực tiếp Firestore query trong component giao diện.
4.  Tất cả kiểu dữ liệu trao đổi giữa Service và UI phải thông qua các DTO trong `src/dto/`.
