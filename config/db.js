



import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


// for local postgres db
// const sequelize = new Sequelize(
//   process.env.DB_NAME,        // database name
//   process.env.DB_USER,        // username
//   process.env.DB_PASSWORD,    // password
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "postgres",
//     logging: false        // disable SQL logging in console (optional)

//     //logging: console.log, // enable query logging
//   }
// );

// export default sequelize;





const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});


export default sequelize;