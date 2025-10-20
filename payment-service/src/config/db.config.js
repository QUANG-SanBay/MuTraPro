import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false, // false để tránh lỗi SSL local
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối SQL Server thành công!");


     sequelize.sync({ alter: false, force: false });
    console.log("Đồng bộ bảng thành công!");
  } catch (error) {
    console.error("Lỗi kết nối SQL Server:", error.message);
  }
};
