import { sequelize } from "../config/db.config.js";
import { Payment } from "./payment.model.js";
import { Transaction } from "./transaction.model.js";

export { sequelize, Payment, Transaction };