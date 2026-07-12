import { DataTypes } from "sequelize";
import { seq } from "../db/db.js";
import { conversation } from "./conversation.js";

export const createUser = seq.define("user_table",
    {
        id : {
         type: DataTypes.INTEGER,
         allowNull : false,
         primaryKey : true,
         autoIncrement : true
  },

  Profile_img : {
    type : DataTypes.STRING,
    allowNull : true,
    defaultValue : null
  },

     name : {
        type : DataTypes.STRING,
        allowNull : false,
       },
      email : {
     type : DataTypes.STRING,
       allowNull : false,
       unique : true
      },
    password : {
        type : DataTypes.STRING,
        allowNull : false,    
   },
        refreshtoken : {
            type : DataTypes.STRING,
              allowNull : true
            }
    }

    
,{  tableName : "user_table"  }
)



