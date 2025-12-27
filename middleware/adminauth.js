const adminauth = async (req, res, next) => {
  try {
    console.log("ADMIN AUTH HIT");
    console.log("TOKEN RECEIVED:", req.headers.token);

    if (!req.headers.token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Admin auth failed",
    });
  }
};

export default adminauth;
