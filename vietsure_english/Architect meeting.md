# Architectural Notes & Deployment Guide - Vietsure English

## 1. Role & Component Mapping

> [!IMPORTANT]
> - **Màn Giáo viên (Teacher Screen)**: [`blog-fe/src/components/custom/common/floating-jitsi-widget.tsx`](file:///d:/freelancer/vietsure_english/blog-fe/src/components/custom/common/floating-jitsi-widget.tsx)
>   - Giáo viên sử dụng widget nổi `floating-jitsi-widget.tsx`.
>   - Khi Giáo viên phóng to full màn hình, hệ thống gọi HTML5 Fullscreen API trực tiếp trên widget container (`widgetInnerRef.requestFullscreen()`), KHÔNG dùng và KHÔNG chuyển sang trang `page.tsx`.
> - **Màn Học viên (Student Screen)**: [`blog-fe/src/app/classroom/[roomName]/page.tsx`](file:///d:/freelancer/vietsure_english/blog-fe/src/app/classroom/[roomName]/page.tsx)
>   - Trang này DÀNH RIÊNG cho Học viên mở đường dẫn lớp học `/classroom/[roomName]`.
>   - Hiển thị màn hình chào mừng và form nhập tên Học viên trước khi vào phòng.

---

## 2. Structure of Custom Jitsi Scripts (`custom-config.js`)

File `custom-config.js` (inside `jitsi-demo/`) has been modularized into 5 manageable files inside `jitsi-demo/custom-modules/`:

- `custom-modules/01-base-config-and-styles.js`: Base Jitsi config, console error filters, bright theme & custom CSS layout overrides.
- `custom-modules/02-whiteboard-and-excalidraw.js`: Excalidraw integration, Highlighter tool button, safe camera lock, event interceptors, whiteboard state sync.
- `custom-modules/03-toolbar-and-games.js`: Custom toolbar buttons (Timer, Praise, Dice, Wheel games menu).
- `custom-modules/04-pip-manager.js`: Composite Video Picture-in-Picture (320x180 landscape canvas aggregator).
- `custom-modules/05-events-and-messaging.js`: Audio ticking & alarm sounds, breakout room handlers, speaking indicator highlights, chat message & toast filters.

---

## 3. Strict Rules for Build & Docker Restart Commands

> [!CAUTION]
> - **CHỈ KHI NÀO NGƯỜI DÙNG YÊU CẦU CHẠY LẠI / RESTART** mới được chạy `node build-custom-config.js` và `docker compose restart web`.
> - Không tự ý chạy `node build-custom-config.js` hay `docker compose restart web` khi chưa có yêu cầu trực tiếp từ người dùng!
