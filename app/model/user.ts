import { Application } from 'egg';
import { Document } from 'mongoose';

export default (app: Application) => {
  const mongoose = app.mongoose;

  const UserSchema = new mongoose.Schema({
    userID: { type: String },
    username: { type: String },
    password: { type: String },
  });

  return mongoose.model<Jigsaw.User & Document>('User', UserSchema);
};
