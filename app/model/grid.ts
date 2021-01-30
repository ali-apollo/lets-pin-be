import { Application } from 'egg';
import { Document } from 'mongoose';

export default (app: Application) => {
  const mongoose = app.mongoose;

  const PlayerSchema = new mongoose.Schema({
    id: String,
    name: String,
    pics: [Number],
  });

  const GridSchema = new mongoose.Schema({
    roomID: { type: String, index: true },
    currentVer: { type: String },
    checkData: { type: [Number] },
    verMatrix: { type: [String] },
    data: {
      type: Map,
      of: [[Number]],
    },
    players: [PlayerSchema],
  });

  return mongoose.model<Jigsaw.Grid & Document>('Grid', GridSchema);
};
