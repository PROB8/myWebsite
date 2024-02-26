// Type definitions for Project Name
// Project Name
// Definitions by: Your Name here

import { ObjectId } from 'bson';

export interface Order {
  _id?: ObjectId;
  paid: boolean;
  userId?: ObjectId;
  orderId: string;
  link: string;
  sent: boolean;
  emailMessageId: string;
  __v?: number;
}

export interface SendEmailResult {
  body: string;
  user: User;
  headers: {};
  multiValueHeaders: {};
}

export interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: number;
  address1?: string;
  address2?: string;
  affiliateId?: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface PaypalResult {
  id: string;
  intent: string;
  status: string;
  purchase_units: [
    {
      reference_id: string;
      amount: {
        currency_code: 'USD';
        value: string;
      };
      payee: {
        email_address: string;
        merchant_id: string;
      };
      soft_descriptor: string;
      shipping: {
        name: {
          full_name: string;
        };
        address: {
          address_line_1: string;
          admin_area_2: string;
          admin_area_1: string;
          postal_code: string;
          country_code: 'US';
        };
      };
      payments: {
        captures: [
          {
            id: string;
            status: string;
            amount: {
              currency_code: 'USD';
              value: string;
            };
            final_capture: string;
            seller_protection: {
              status: string;
              dispute_categories: string[];
            };
            create_time: string;
            update_time: string;
          }
        ];
      };
    }
  ];
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
    address: {
      country_code: 'US';
    };
  };
  create_time: string;
  update_time: string;
  links: [
    {
      href: string;
      rel: string;
      method: 'GET';
    }
  ];
}
