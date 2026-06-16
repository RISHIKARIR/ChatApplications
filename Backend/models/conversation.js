import { DataTypes } from "sequelize";
import { seq } from "../db/db.js";




export const conversation = seq.define(
  "conversation_table",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    isGroup : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }

    // userOneId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "user_table",
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // },

    // userId : {
    //   type : DataTypes.INTEGER,
    //   allowNull : false,
    //   references : {
    //     model : "user_table",
    //     key : "id"
    //   },
    //   onDelete : "CASCADE",
    //   onUpdate : "CASCADE"
    // },




    // userTwoId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "user_table",
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // } 



  },
  {
    tableName: "conversation_table",
  }
);



//Junction Table//


export const conversation_members = seq.define("conversation_members_table",{
  id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey : true
  },
  user_id : {
    type : DataTypes.INTEGER,
    allowNull : true
  },
  conversation_id : {
    type : DataTypes.INTEGER,
    allowNull : true
  },
  joined_at : {
    type : DataTypes.DATE,
    allowNull : false
  }

}, { tableName : "conversation_members_table"}
)














