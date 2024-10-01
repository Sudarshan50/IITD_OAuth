const requestCounts = new Map();

export function rateLimitByUserId(windowMs, maxRequests) {
  return (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json("Unauthorized");
    }

    const currentTime = Date.now();
    const userRequestInfo = requestCounts.get(userId) || {
      count: 0,
      startTime: currentTime,
    };

    if (currentTime - userRequestInfo.startTime > windowMs) {
      userRequestInfo.count = 1;
      userRequestInfo.startTime = currentTime;
    } else {
      userRequestInfo.count += 1;
    }
    requestCounts.set(userId, userRequestInfo);
    if (userRequestInfo.count > maxRequests) {
      return res.status(429).json("Too many requests, please try again later.");
    }

    next();
  };
}
