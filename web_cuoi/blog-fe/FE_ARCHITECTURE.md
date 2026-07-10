# Kiến trúc dự án Frontend (blog-fe)

Tài liệu này lưu trữ cấu trúc thư mục và quy tắc phát triển giao diện (FE) của dự án Vietsure English. Tất cả mã nguồn FE mới hoặc sửa đổi đều phải tuân thủ nghiêm ngặt cấu trúc dưới đây.

## Cấu trúc thư mục (`src/`)

*   **`src/app/`**: Chứa code của các trang (pages/routes).
*   **`src/components/`**:
    *   **`ui/`**: Chứa các component được cài đặt tự động từ `shadcn/ui`. Không tự ý sửa đổi trừ khi cần cấu hình chung.
    *   **`custom/`**: Chứa các component tự định nghĩa phục vụ riêng cho dự án.
        *   **`common/`**: Chứa các component dùng chung (ví dụ: nút bấm dùng nhiều nơi, card dùng chung, v.v.).
*   **`src/context/`**: Quản lý React Context.
*   **`src/dto/`**: Các DTO dùng để mapping dữ liệu với Backend (Strapi).
*   **`src/lang/`**: Thư mục quản lý đa ngôn ngữ (hiện tại chưa dùng, giữ nguyên không xóa/thay đổi).
*   **`src/layout/`**: Chứa các thành phần layout lớn của trang web (Header, Footer, Navigation, v.v.).
*   **`src/lib/`**: Chứa các file tiện ích (`utils.ts`, cấu hình thư viện khác).
*   **`src/service/`**: Chứa các hàm/service gọi API tới Backend.
*   **`src/state-manager/`**: Quản lý global state của ứng dụng bằng `zustand`.

## Nguyên tắc triển khai

1.  Tuyệt đối không tự ý thay đổi cấu trúc thư mục trên.
2.  Khi viết component mới:
    *   Nếu là component dùng chung cho toàn dự án: đặt trong `src/components/custom/common/`.
    *   Nếu là component đặc thù của từng trang: đặt trong thư mục con tương ứng tại `src/components/custom/`.
3.  Khi thay đổi giao diện Header/Footer: viết tại `src/layout/`.
