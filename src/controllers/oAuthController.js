let oAuth = {};

oAuth.login = async (req, res) => {
  res.redirect("auth/microsoft");
};

export default oAuth;

