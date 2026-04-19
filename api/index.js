const app = require("../backend/src/app");
const connectDatabase = require("../backend/src/config/db");

module.exports = async (req, res) => {
  await connectDatabase();
  return app(req, res);
};
