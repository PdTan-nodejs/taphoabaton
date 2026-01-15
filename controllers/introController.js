// Controller cho trang intro (loading mở đầu)
exports.index = (req, res) => {
  res.render('intro/index', {
    title: 'Tạp Hóa Bất ổn',
    layout: false
  });
};
