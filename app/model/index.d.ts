import { Mongoose, Model, Document } from 'mongoose';

declare module 'egg' {
  export interface Context {
    model: IModel;
  }

  export interface IModel {
    Grid: Model<Jigsaw.Grid & Document> & Relationship.ModelStatic
  }
}