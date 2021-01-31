// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGrid from '../../../app/model/grid';
import ExportGroup from '../../../app/model/group';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Grid: ReturnType<typeof ExportGrid>;
    Group: ReturnType<typeof ExportGroup>;
    User: ReturnType<typeof ExportUser>;
  }
}
