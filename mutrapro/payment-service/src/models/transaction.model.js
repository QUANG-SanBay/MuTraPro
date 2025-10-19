import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Payment } from "./payment.model.js";

export const Transaction = sequelize.define("Transaction", {
  transactionId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM("CHARGE", "REFUND"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  gatewayTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Transactions",
  timestamps: false,
});


Payment.hasMany(Transaction, {
  foreignKey: "paymentId",
  as: "transactions",
});

Transaction.belongsTo(Payment, {
  foreignKey: "paymentId",
  as: "payment",
});
