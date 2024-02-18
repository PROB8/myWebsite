// Type definitions for Project Name
// Project Name
// Definitions by: Your Name here

import { ObjectId } from 'mongodb';

export type RouteMap = {
  GET?: {
    [name: string]: string;
  };
  POST?: {
    [name: string]: string;
  };
  PUT?: {
    [name: string]: string;
  };
  DELETE?: {
    [name: string]: string;
  };
};

export type ParamMap = {
  [name: string]: ObjectId;
};
