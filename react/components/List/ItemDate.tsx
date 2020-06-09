import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const messages = defineMessages({
  nextPurchase: {
    id: 'store/subscription.list.item.date.next.purchase',
    defaultMessage: '',
  },
  since: {
    id: 'store/subscription.list.item.date.since',
    defaultMessage: '',
  },
  paused: {
    id: 'store/subscription.status.paused',
    defaultMessage: '',
  },
  canceled: {
    id: 'store/subscription.status.canceled',
    defaultMessage: '',
  },
})

const SubscriptionsItemDate: FunctionComponent<Props & InjectedIntlProps> = ({
  status,
  nextPurchaseDate,
  lastUpdate,
  intl,
}) => {
  const content =
    status === 'ACTIVE'
      ? intl.formatMessage(messages.nextPurchase, {
          date: intl.formatDate(nextPurchaseDate),
        })
      : intl.formatMessage(messages.since, {
          date: intl.formatDate(lastUpdate),
          status: intl.formatMessage({
            id: `store/subscription.status.${status.toLowerCase()}`,
          }),
        })

  return <span className="t-small c-muted-2">{content}</span>
}

interface Props {
  status: SubscriptionStatus
  nextPurchaseDate: string
  lastUpdate: string
}

export default injectIntl(SubscriptionsItemDate)