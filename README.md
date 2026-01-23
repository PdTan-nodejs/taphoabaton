# Tạp Hóa Bát Ổn - Blog Website

Website blog được xây dựng với Node.js, Express, EJS và Sequelize (MySQL) theo kiến trúc MVC.

## Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express** - Web framework
- **EJS** - Template engine
- **Sequelize** - ORM cho MySQL
- **MySQL** - Database
- **Multer** - File upload
- **bcryptjs** - Password hashing
- **express-session** - Session management

## Cấu trúc thư mục

```
taphoabaton/
├── config/              # Cấu hình database
│   ├── database.js
│   └── config.json
├── controllers/         # Controllers (MVC)
│   ├── adminController.js
│   ├── contactController.js
│   ├── homeController.js
│   └── postController.js
├── middleware/          # Middleware
│   └── auth.js
├── migrations/          # Database migrations
│   ├── 20240101000001-create-categories.js
│   ├── 20240101000002-create-posts.js
│   └── 20240101000003-create-users.js
├── models/              # Sequelize models
│   ├── Category.js
│   ├── Post.js
│   ├── User.js
│   └── index.js
├── public/              # Static files
│   ├── css/
│   │   ├── style.css
│   │   ├── admin.css
│   │   └── header.css
│   └── js/
│       └── main.js
├── routes/              # Routes
│   ├── admin.js
│   ├── contact.js
│   ├── home.js
│   └── post.js
├── seeders/             # Database seeders
│   ├── 20240101000001-seed-categories.js
│   ├── 20240101000002-seed-users.js
│   └── 20240101000003-seed-posts.js
├── uploads/             # Uploaded images (tự động tạo)
├── utils/               # Utilities
│   ├── helpers.js
│   └── upload.js
├── views/               # EJS templates
│   ├── layout.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── admin-header.ejs
│   ├── home/
│   │   └── index.ejs
│   ├── post/
│   │   ├── list.ejs
│   │   └── detail.ejs
│   ├── contact/
│   │   └── index.ejs
│   ├── admin/
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── posts.ejs
│   │   └── post-form.ejs
│   ├── 404.ejs
│   └── 500.ejs
├── .env.example         # Example environment file
├── .gitignore
├── .sequelizerc         # Sequelize CLI config
├── package.json
├── server.js            # Entry point
└── README.md
```

## Cài đặt và chạy project

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taphoabaton_db
DB_USER=root
DB_PASSWORD=your_password
SESSION_SECRET=your-secret-key-change-this
```

**Lưu ý:** Cần tạo database MySQL trước:

```sql
CREATE DATABASE taphoabaton_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Chạy migrations

Tạo các bảng trong database:

```bash
npm run migrate
```

Hoặc sử dụng sequelize-cli trực tiếp:

```bash
npx sequelize-cli db:migrate
```

### 4. Chạy seeders

Thêm dữ liệu mẫu vào database:

```bash
npm run seed
```

Hoặc:

```bash
npx sequelize-cli db:seed:all
```

**Thông tin đăng nhập mặc định:**
- Username: `admin`
- Password: `admin123`

### 5. Tạo thư mục uploads

Thư mục `uploads/` sẽ được tạo tự động khi upload ảnh lần đầu. Hoặc bạn có thể tạo thủ công:

```bash
mkdir uploads
```

### 6. Chạy server

**Development mode (với nodemon):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## Các trang chính

### Frontend
- **Trang chủ:** `http://localhost:3000/`
- **Danh sách bài viết:** `http://localhost:3000/posts`
- **Chi tiết bài viết:** `http://localhost:3000/posts/:slug`
- **Liên hệ:** `http://localhost:3000/contact`

### Admin
- **Đăng nhập:** `http://localhost:3000/admin/login`
- **Dashboard:** `http://localhost:3000/admin/dashboard`
- **Quản lý bài viết:** `http://localhost:3000/admin/posts`
- **Tạo bài viết mới:** `http://localhost:3000/admin/posts/create`

## Tính năng

### Frontend
- ✅ Trang chủ với banner, giới thiệu và danh sách bài viết
- ✅ Trang danh sách bài viết với phân trang và lọc theo danh mục
- ✅ Trang chi tiết bài viết với bài viết liên quan
- ✅ Trang liên hệ với form gửi tin nhắn
- ✅ Responsive design

### Admin
- ✅ Đăng nhập/đăng xuất
- ✅ Dashboard với thống kê
- ✅ CRUD bài viết (Tạo, Đọc, Sửa, Xóa)
- ✅ Upload ảnh cho bài viết
- ✅ Quản lý trạng thái bài viết (draft/published)
- ✅ Quản lý danh mục

## Models và Relationships

### Category
- `id` (INT, PK)
- `name` (STRING)
- `slug` (STRING, unique)
- `description` (TEXT)

### Post
- `id` (INT, PK)
- `title` (STRING)
- `slug` (STRING, unique)
- `excerpt` (TEXT)
- `content` (TEXT)
- `image` (STRING)
- `views` (INT, default: 0)
- `status` (ENUM: 'draft', 'published')
- `categoryId` (INT, FK -> Category)

**Relationship:** Category hasMany Post, Post belongsTo Category

### User
- `id` (INT, PK)
- `username` (STRING, unique)
- `email` (STRING, unique)
- `password` (STRING, hashed)
- `role` (ENUM: 'admin', 'editor')

## Lệnh hữu ích

### Migrations
```bash
# Chạy migrations
npm run migrate

# Rollback migration cuối cùng
npm run migrate:undo

# Rollback tất cả migrations
npx sequelize-cli db:migrate:undo:all
```

### Seeders
```bash
# Chạy tất cả seeders
npm run seed

# Rollback tất cả seeders
npm run seed:undo
```

## Lưu ý

1. **Upload ảnh:** Chỉ chấp nhận file ảnh (jpg, png, gif, webp), tối đa 5MB
2. **Session:** Mặc định session tồn tại 24 giờ
3. **Slug:** Tự động tạo từ tiêu đề bài viết (hỗ trợ tiếng Việt)
4. **CKEditor:** Sử dụng CKEditor 4 cho editor nội dung bài viết

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin trong file `.env`
- Đảm bảo database đã được tạo

### Lỗi migration
- Đảm bảo database đã được tạo
- Kiểm tra quyền của user database
- Xóa database và tạo lại nếu cần

### Lỗi upload ảnh
- Kiểm tra thư mục `uploads/` có quyền ghi
- Kiểm tra kích thước file (tối đa 5MB)
- Kiểm tra định dạng file (chỉ ảnh)

## License

ISC

