

import User from "./userModel.js";
import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";


const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

export default Post;