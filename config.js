const env = process.env;

const config = {
  // db: {
  //   /* don't expose password or any sensitive info, done only for demo */
  //   host:
  //     env.DB_HOST ||
  //     "us-cdbr-east-05.cleardb.net",
  //   user: env.DB_USER || "b4c2f49b9004f8",
  //   password: env.DB_PASSWORD || "eec8f03f",
  //   database: env.DB_NAME || "heroku_97aa3930a07e780",
  // },

  // db: {
  //   /* don't expose password or any sensitive info, done only for demo */
  //   host:
  //     env.DB_HOST ||
  //     "localhost",
  //   user: env.DB_USER || "root",
  //   password: env.DB_PASSWORD || "",
  //   database: env.DB_NAME || "cove",
  // },
  // digital ocean
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: env.DB_HOST || "localhost",
    user: env.DB_USER || "root",
    password: env.DB_PASSWORD || "",
    database: env.DB_NAME || "cove",
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
