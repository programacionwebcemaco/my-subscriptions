export enum SubscriptionStatusEnum {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Expired = 'EXPIRED',
  Paused = 'PAUSED',
}

export enum SubscriptionDisplayFilterEnum {
  Active = 'ACTIVE_FILTER',
  Canceled = 'CANCELED_FILTER',
}

export enum TagTypeEnum {
  Error = 'error',
  Warning = 'warning',
}

export enum PaymentGroupEnum {
  BankInvoice = 'bankInvoice',
  PayPal = 'payPal',
  GiftCard = 'giftCard',
  DebitCard = 'debitCard',
  CreditCard = 'creditCard',
}

export enum SubscriptionOrderStatusEnum {
  Triggered = 'TRIGGERED',
  InProcess = 'IN_PROCESS',
  Failure = 'FAILURE',
  Success = 'SUCCESS',
  Expired = 'EXPIRED',
  OrderError = 'ORDER_ERROR',
  PymentError = 'PAYMENT_ERROR',
  Skiped = 'SKIPED',
  SuccessWithNoOrder = 'SUCCESS_WITH_NO_ORDER',
  SuccessWithPartialOrder = 'SUCCESS_WITH_PARTIAL_ORDER',
}

export enum MenuOptionsEnum {
  Skip = 'skip',
  Unskip = 'unskip',
  Pause = 'pause',
  Cancel = 'cancel',
  Restore = 'restore',
  OrderNow = 'orderNow',
}

export const WEEK_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const MONTH_OPTIONS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
]

export const CSS = {
  subscriptionGroupImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionGroupItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
  cardWrapper:
    'bg-base t-body c-on-base pa5 pa7-ns b--muted-5 bw1 bt bb bl-ns br-ns h-100',
}
