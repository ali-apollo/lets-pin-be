import { Application } from 'egg';
import { Document } from 'mongoose';

export default (app: Application) => {
  const mongoose = app.mongoose;

  const MemberSchema = new mongoose.Schema({
    id: String,
    name: String,
    role: String,
  });

  const GroupSchema = new mongoose.Schema({
    roomID: String,
    roomName: String,
    players: [MemberSchema],
    difficult: Number,
    score: Number,
    createTime: Number,
  });

  return mongoose.model<Jigsaw.User & Document>('Group', GroupSchema);
};
