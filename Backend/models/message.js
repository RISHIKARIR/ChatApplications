import { DataTypes } from "sequelize";
import { seq } from "../db/db.js";
import { conversation } from "./conversation.js";


export const messageModel = seq.define(
        "message_table",
          {
        id :{
           type :  DataTypes.INTEGER,
           primaryKey : true,
           autoIncrement : true
        },
        senderId : {
            type : DataTypes.INTEGER
        },
   
        conversation_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : "conversation_table",
                key : "id"
            }
        },
        message : {
            type : DataTypes.TEXT,
            allowNull : false
        }
},

{ tableName : "message_table" })




conversation.hasMany(messageModel,{
    foreignKey : "conversation_id",
    as : "messages"
})


messageModel.belongsTo(conversation,{
    foreignKey : "conversation_id",
    as : "conversation"

})





