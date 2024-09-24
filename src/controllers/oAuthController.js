let oAuth = {};

oAuth.login = async (req, res) => {
  const { client_id, redirect_uri } = req.query;
  res.cookie("client_id", client_id).cookie("redirect_uri", redirect_uri);
  // console.log(req.session);
  res.redirect("auth/microsoft");
};

export default oAuth;
