import {
  SubscriptionStatus,
  SubscriptionOrderStatus,
} from 'vtex.subscriptions-graphql'

import DETAIL_QUERY, { Args } from '../graphql/queries/subscription.gql'
import { Subscription } from '../components/Details'

export const SUBSCRIPTION_ID = 'C842CBFAF3728E8EBDA401836B2ED6D1'

export const MOCK_ROUTER_PARAM = { subscriptionId: SUBSCRIPTION_ID }

const PLAN: Subscription['plan'] = {
  frequency: {
    periodicity: 'MONTHLY',
    interval: 1,
  },
  purchaseDay: '10',
}

function generateSubscriptions(
  subscriptionsAmount: number
): Subscription['subscriptions'] {
  const subscriptions = []
  for (let i = 0; i < subscriptionsAmount; i++) {
    subscriptions.push({
      id: `0A19A86877B04D149D314D7453F538${i}C`,
      sku: {
        id: `1${i}`,
        name: 'Ração para peixe',
        productName: 'Ração para peixe',
        imageUrl:
          'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155392-55-55/AlconKOI.jpg?v=635918402228600000',
        detailUrl: '/racaoparapeixe/p',
        variations: null,
        measurementUnit: 'un',
      },
      quantity: 1,
      currentPrice: 100,
    })
  }

  return subscriptions
}

interface GenerationArgs {
  subscriptionsGroupId?: string
  status?: SubscriptionStatus
  subscriptionsAmount?: number
  nextPurchaseDate?: string
  estimatedDeliveryDate?: string
  hasPaymentMethod?: boolean
  hasShippingAddress?: boolean
  lastOrderStatus?: SubscriptionOrderStatus
}

export function generateSubscriptionsGroup({
  status = 'ACTIVE',
  subscriptionsAmount = 1,
  nextPurchaseDate = '2019-07-10T09:00:57Z',
  estimatedDeliveryDate = '2019-07-16T00:00:00Z',
  hasPaymentMethod = true,
  hasShippingAddress = true,
  lastOrderStatus = 'IN_PROCESS',
}: GenerationArgs): Subscription {
  return {
    __typename: 'SubscriptionsGroup',
    id: SUBSCRIPTION_ID,
    cacheId: SUBSCRIPTION_ID,
    status,
    isSkipped: false,
    name: null,
    subscriptions: generateSubscriptions(subscriptionsAmount),
    plan: PLAN,
    shippingAddress: hasShippingAddress
      ? {
          id: 'b3665b68c9714441bdea54c35a4d0cd6',
          street: 'Avenida Evandro Lins e Silva',
          number: '1',
          complement: null,
          neighborhood: 'Barra da Tijuca',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'BRA',
          postalCode: '22631-470',
          reference: null,
          geoCoordinate: null,
          receiverName: 'clara szwarcman',
          addressType: 'residential',
        }
      : null,
    purchaseSettings: {
      paymentMethod: hasPaymentMethod
        ? {
            paymentSystemId: '2',
            paymentSystemName: 'Visa',
            paymentSystemGroup: 'creditCard',
            paymentAccount: {
              id: '5FE0FD2838AB47BF852E9E43402DE553',
              cardNumber: '************1111',
              bin: '',
            },
          }
        : null,
      currencyCode: 'BRL',
    },
    nextPurchaseDate,
    totals: [
      {
        id: 'Items',
        value: 100,
      },
      {
        id: 'Shipping',
        value: 300,
      },
    ],
    lastOrder: {
      id: '3748EAF9A6F44F72B899359C92DF6C81',
      status: lastOrderStatus,
    },
    estimatedDeliveryDate,
  }
}

const variables: Args = { id: SUBSCRIPTION_ID }

export function generateDetailMock(args?: GenerationArgs) {
  return {
    request: {
      query: DETAIL_QUERY,
      variables,
    },
    result: {
      data: {
        subscription: generateSubscriptionsGroup(args ?? {}),
      },
    },
  }
}
