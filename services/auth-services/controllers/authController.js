exports.register = (req, res) => {
  const { email, password } = req.body;

  // sementara dummy dulu
  res.json({
    message: "User registered",
    email,
  });
};