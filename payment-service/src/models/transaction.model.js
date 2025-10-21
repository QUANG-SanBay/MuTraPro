import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Payment } from "./payment.model.js";
import { v4 as uuidv4 } from 'uuid';

export const Transaction = sequelize.define("Transaction", {
  transactionId: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("CHARGE", "REFUND"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  qr_url: {
  type: DataTypes.STRING,
  allowNull: false, // nếu thanh toán bằng QR
},
description: {
  type: DataTypes.STRING,
  allowNull: false, // nội dung chuyển khoản
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
