import { type FondyPayment } from '@/modules/payments';

export const fondyPaymentMock: FondyPayment = {
  rrn: '111111111111',
  masked_card: '444455XXXXXX1111',
  sender_cell_phone: '',
  sender_account: '',
  currency: 'UAH',
  fee: '',
  reversal_amount: '0',
  settlement_amount: '0',
  actual_amount: '5200',
  response_description: '',
  sender_email: 'demetrxx@gmail.com',
  order_status: 'approved',
  response_status: 'success',
  order_time: '26.11.2023 14:27:39',
  actual_currency: 'UAH',
  order_id: '6',
  tran_type: 'purchase',
  eci: '5',
  settlement_date: '',
  payment_system: 'card',
  approval_code: '123456',
  merchant_id: '1537036',
  settlement_currency: '',
  payment_id: '692312983',
  card_bin: '444455',
  response_code: '',
  card_type: 'VISA',
  amount: '5200',
  signature: 'bb6a657c4c84c10415c5d51d526d9cff48daadf3',
  product_id: '1',
  merchant_data: '',
  additional_info:
    '{"capture_status": null, "capture_amount": null, "reservation_data": "{}", "transaction_id": 1822080165, "bank_response_code": null, "bank_response_description": null, "client_fee": 0.0, "settlement_fee": 1.25, "bank_name": "SOME BANK IN US COUNTRY", "bank_country": "US", "card_type": "VISA", "card_product": "empty_visa", "card_category": "", "timeend": "26.11.2023 14:27:46", "ipaddress_v4": "95.67.87.38", "payment_method": "card", "version_3ds": 1, "is_test": true}',
  response_signature_string:
    '**********|5200|UAH|{"capture_status": null, "capture_amount": null, "reservation_data": "{}", "transaction_id": 1822080165, "bank_response_code": null, "bank_response_description": null, "client_fee": 0.0, "settlement_fee": 1.25, "bank_name": "SOME BANK IN US COUNTRY", "bank_country": "US", "card_type": "VISA", "card_product": "empty_visa", "card_category": "", "timeend": "26.11.2023 14:27:46", "ipaddress_v4": "95.67.87.38", "payment_method": "card", "version_3ds": 1, "is_test": true}|5200|123456|444455|VISA|UAH|5|444455XXXXXX1111|1537036|6|approved|26.11.2023 14:27:39|692312983|card|1|success|0|111111111111|demetrxx@gmail.com|0|purchase',
};
