/**
 * @value API_URL_DEV | API_URL
 * @desc Toggle value by Git branch
 */
export const API_URL = process.env.API_URL_DEV;

export const SOCKET_URL =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:3000"
    : window.location.host;

export const ROLES = {
  Admin: "ROLE ADMIN",
  Member: "ROLE MEMBER",
  Merchant: "ROLE MERCHANT"
};

export const CART_ITEMS = "cart_items";
export const CART_TOTAL = "cart_total";
export const CART_ID = "cart_id";

export const CART_ITEM_STATUS = {
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Not_processed: "Not processed"
};

export const MERCHANT_STATUS = {
  Rejected: "Rejected",
  Approved: "Approved",
  Waiting_Approval: "Waiting Approval"
};

export const REVIEW_STATUS = {
  Rejected: "Rejected",
  Approved: "Approved",
  Waiting_Approval: "Waiting Approval"
};

export const EMAIL_PROVIDER = {
  Email: "Email",
  Google: "Google",
  Apple: "Apple"
};

export const CONTACT_PHONE = "(618) 570-8641";

export const COMPANY_NAME = "Michael’s Machines";

export const COMPANY_START_YEAR = 2014;
