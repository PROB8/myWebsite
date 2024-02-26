//! if you try to put these enums .d.ts file it will break the code,
//! probably because we are importing and using the enums and they are not types.

export enum ServerErrors {
  ItBroke = 'Something broke',
  RouteNotFound = "We don't have a method to handle this request:",
  CannotConnectDb = 'Cannot connect to database.',
  failedToSaveToDB = 'FAILED_TO_SAVE_ORDER',
  failedToMakeLink = 'FAILED_TO_MAKE_LINK',
  failedToSendBook = 'FAILED_TO_SEND_BOOK',
}

export enum Collections {
  Users = 'users',
  Orders = 'orders',
}

export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Delete = 'DELETE',
  Put = 'PUT',
}

export enum LambdaBRoutes {
  getById = '/api/lambdab/{id}',
  deleteRoute = '/api/lambdab/users/{userId}',
  updateRoute = '/api/lambdab/users/{userId}/case/{caseId}',
}

export enum PaypalRoutes {
  order = '/api/jngpaypal/order',
  orderstaging = '/api/jngpaypal-staging/order',
}
