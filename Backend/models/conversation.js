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





export const groupTable = seq.define("Group_table",{
  id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    autoIncrement : true,
    primaryKey : true
  },
  Group_name : {
    type : DataTypes.STRING,
    allowNull : false
  },
  Group_image : {
    type : DataTypes.STRING,
    allowNull : true
  },
  Group_Description : {
    type : DataTypes.TEXT,
    allowNull : false
  },
  conversation_id : {
    type : DataTypes.INTEGER,
    allowNull : false
  }


},{tableName : "Group_table"}
)

export const GroupAdmins = seq.define("Group_admins",{
    id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      autoIncrement : true,
      primaryKey : true
    },
    Group_id : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    user_id : {
      type : DataTypes.INTEGER,
      allowNull : false
    }


},{tableName : "Group_admins"})



groupTable.hasMany(GroupAdmins,{
  foreignKey : "Group_id",
  as : "groupadmins"
})


GroupAdmins.belongsTo(groupTable,{
  foreignKey : "Group_id",
  as : "Group"
})




