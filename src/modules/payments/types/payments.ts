export interface FondyPayment {
  rrn: string;
  masked_card: string;
  sender_cell_phone: string;
  sender_account: string;
  currency: string;
  fee: string;
  reversal_amount: string;
  settlement_amount: string;
  actual_amount: string;
  response_description: string;
  sender_email: string;
  order_status: string;
  response_status: string;
  order_time: string;
  actual_currency: string;
  order_id: string;
  tran_type: string;
  eci: string;
  settlement_date: string;
  payment_system: string;
  approval_code: string;
  merchant_id: string;
  settlement_currency: string;
  payment_id: string;
  card_bin: string;
  response_code: string;
  card_type: string;
  amount: string;
  signature: string;
  product_id: string;
  merchant_data: string;
  additional_info: string;
  response_signature_string: string;
}

export interface FondySubscription {
  data: string;
}
