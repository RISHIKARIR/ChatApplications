import { Sequelize } from "sequelize";

export const seq = new Sequelize(
process.env.DATABASE_URL  
,
  {
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
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
