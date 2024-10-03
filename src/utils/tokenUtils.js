import jwt from "jsonwebtoken";
const generateOnboardingToken = (user,client_id,redirect_uri) => {
  const payload = {
    sub: user._id,
    username : user.username,
    client_id,
    redirect_uri,
    iss: "https://iitdoauth.vercel.app", // TODO: Change this to your domain
    token_type: "onboarding",
  };

  return jwt.sign(payload, process.env.ONBOARDING_SECRET, {
    expiresIn: "10m",
  });
};
const verifyOnboardingToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.ONBOARDING_SECRET);

    if (!payload) {
      return null;
    }

    if (
      payload.iss !== "https://iitdoauth.vercel.app" ||
      payload.token_type !== "onboarding"
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export { generateOnboardingToken, verifyOnboardingToken };
