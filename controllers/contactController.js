exports.index = (req, res) => {
  res.render('contact/index', {
    title: 'Liên hệ',
    message: null,
    error: null
  });
};

exports.submit = (req, res) => {
  const { name, email, phone, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.render('contact/index', {
      title: 'Liên hệ',
      message: null,
      error: 'Vui lòng điền đầy đủ thông tin bắt buộc'
    });
  }

  // Here you can add email sending logic or save to database
  console.log('Contact form submission:', { name, email, phone, message });

  res.render('contact/index', {
    title: 'Liên hệ',
    message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
    error: null
  });
};

