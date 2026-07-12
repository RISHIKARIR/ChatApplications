import { DataTypes } from "sequelize";
import { seq } from "../db/db.js";
import { conversation } from "./conversation.js";

export const messageModel = seq.define(
  "message_table",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
    },

    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "conversation_table",
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },

  { tableName: "message_table" },
);

export const mediaModel = seq.define(
  "media_table",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resource_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { tableName: "media_table" },
);

messageModel.hasMany(mediaModel, {
  foreignKey: "messageId",
  as: "media",
});

mediaModel.belongsTo(messageModel, {
  foreignKey: "messageId",
  as: "media_message",
});

conversation.hasMany(messageModel, {
  foreignKey: "conversation_id",
  as: "messages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

messageModel.belongsTo(conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
