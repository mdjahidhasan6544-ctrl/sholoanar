const app = require("../backend/src/app");
const connectDatabase = require("../backend/src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("[vercel-api] startup failed", {
      message: error?.message,
      stack: error?.stack
    });

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: error?.message || "Startup failed"
      })
    );
  }
};
