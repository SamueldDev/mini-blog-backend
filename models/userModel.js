
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileImage: {
    type: DataTypes.STRING, 
    defaultValue: ''
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default User;