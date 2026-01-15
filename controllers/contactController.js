exports.index = (req, res) => {
  res.render('contact/index', {
    title: 'Liên hệ',
    metaDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
    metaKeywords: 'liên hệ, contact, thông tin liên hệ',
    ogTitle: 'Liên hệ - Tạp Hóa Bất ổn',
    ogDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
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
      metaDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
      metaKeywords: 'liên hệ, contact, thông tin liên hệ',
      ogTitle: 'Liên hệ - Tạp Hóa Bất ổn',
      ogDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
      message: null,
      error: 'Vui lòng điền đầy đủ thông tin bắt buộc'
    });
  }

  // Email sending logic or database save would go here

  res.render('contact/index', {
    title: 'Liên hệ',
    metaDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
    metaKeywords: 'liên hệ, contact, thông tin liên hệ',
    ogTitle: 'Liên hệ - Tạp Hóa Bất ổn',
    ogDescription: 'Liên hệ với Tạp Hóa Bất ổn - Chúng tôi luôn sẵn sàng lắng nghe và phản hồi mọi thắc mắc của bạn.',
    message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
    error: null
  });
};

