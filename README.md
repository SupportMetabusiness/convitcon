# CCVMMO1 - E-commerce Platform

Một nền tảng thương mại điện tử hiện đại được xây dựng với Nuxt 3, Vue 3 và SQLite.

## 🚀 Tính năng chính

- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm với hình ảnh và variants
- **Giỏ hàng thông minh**: Quản lý giỏ hàng với tính năng urgency
- **Thanh toán an toàn**: Xử lý thanh toán với OTP verification
- **Thông báo Telegram**: Tích hợp thông báo real-time qua Telegram
- **Admin Dashboard**: Giao diện quản trị đầy đủ
- **Đa ngôn ngữ**: Hỗ trợ nhiều ngôn ngữ và tiền tệ
- **Responsive Design**: Tương thích mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Nuxt Server API, SQLite
- **Database**: Better SQLite3
- **Icons**: FontAwesome
- **Editor**: Dragon Editor
- **Deployment**: PM2, Nginx

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🗄️ Database

Dự án sử dụng SQLite với các bảng chính:

- `product`: Thông tin sản phẩm
- `payment_info`: Thông tin thanh toán
- `telegram_settings`: Cấu hình Telegram
- `admin_account`: Tài khoản admin

## 🔧 Cấu hình

### Telegram Bot

1. Tạo bot Telegram và lấy token
2. Thêm bot vào group/channel
3. Lấy chat_id
4. Cấu hình trong admin dashboard

### Environment Variables

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

## 📁 Cấu trúc dự án

```
├── components/          # Vue components
│   ├── admin/          # Admin components
│   ├── product/        # Product components
│   └── globals/        # Global components
├── pages/              # Nuxt pages
├── server/             # Server API
│   ├── api/           # API endpoints
│   ├── database/      # Database setup
│   └── utils/         # Utility functions
├── composables/        # Vue composables
├── assets/            # Static assets
└── public/            # Public files
```

## 🚀 Deployment

### VPS Deployment

```bash
# Build project
npm run build

# Copy .output to server
scp -r .output user@server:/path/to/app

# Install dependencies on server
cd /path/to/app
npm install better-sqlite3

# Start with PM2
pm2 start ecosystem.config.cjs
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Bảo mật

- Validation đầu vào nghiêm ngặt
- Sanitize data trước khi gửi Telegram
- Timeout cho API calls
- Error handling toàn diện

## 📝 Changelog

### v2.0.0 (Latest)

- ✅ Dọn dẹp code và xóa file không sử dụng
- ✅ Tối ưu hóa performance
- ✅ Loại bỏ debug logs
- ✅ Cải thiện error handling

### v1.0.0

- 🎉 Phiên bản đầu tiên
- 📦 Tính năng cơ bản hoàn thiện

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub hoặc liên hệ qua email.
