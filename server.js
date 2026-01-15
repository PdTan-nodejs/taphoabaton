require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// Import routes
const introRoutes = require('./routes/intro');
const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const projectRoutes = require('./routes/project');
const postRoutes = require('./routes/post');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
// Static files with cache headers
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? 31536000000 : 0, // 1 year in production
  etag: true,
  lastModified: true
};
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make session available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', introRoutes);
app.use('/home', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/projects', projectRoutes);
app.use('/posts', postRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', { 
    title: '404 - Không tìm thấy trang',
    metaDescription: 'Trang bạn tìm kiếm không tồn tại.',
    layout: 'layout' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, log errors but don't expose stack trace
    // Consider using a logging service here
  } else {
    // In development, show error details
    console.error(err.stack);
  }
  
  res.status(500).render('500', { 
    title: '500 - Lỗi server',
    metaDescription: 'Đã xảy ra lỗi server. Vui lòng thử lại sau.',
    error: process.env.NODE_ENV === 'development' ? err : null,
    layout: 'layout' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

