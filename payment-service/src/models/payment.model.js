import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { v4 as uuidv4 } from "uuid";

export const Payment = sequelize.define(
  "Payment",
  {
    paymentId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "VND", 
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    method: {
      type: DataTypes.ENUM("QR" , "BANK", "STRIPE","CARD"),
      allowNull: false,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Payments",
    timestamps: false,
    freezeTableName: true, 
  }
);
