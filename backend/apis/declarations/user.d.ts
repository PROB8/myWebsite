// Type definitions for Project Name
// Project Name
// Definitions by: Your Name here

import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
}
