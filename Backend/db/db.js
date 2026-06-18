import { Sequelize } from "sequelize";

export const seq = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    port: 5432,
  },
);

export const connectDb = async () => {
  try {
    const connect = await seq.authenticate();
    console.log("db connected successfully...");
  } catch (error) {
    console.log("error while db connect:", error.message);
  }
};
