import pg from "pg";

export const users = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "3030",
  database: "nodepg",
  port: 5432,
});
