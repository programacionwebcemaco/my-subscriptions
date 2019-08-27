import React, { FunctionComponent } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'

import { SubscriptionOrderStatusEnum } from '../../../../constants'
import style from './style.css'

const HistoryItem: FunctionComponent<OuterProps> = ({ order }) => {
  const { date, status } = order

  let statusColor = `c-muted-3`

  switch (status) {
    case SubscriptionOrderStatusEnum.Success:
    case SubscriptionOrderStatusEnum.SuccessWithPartialOrder:
      statusColor = `c-success`
      break
    case SubscriptionOrderStatusEnum.Skiped:
    case SubscriptionOrderStatusEnum.SuccessWithNoOrder:
      statusColor = `c-warning`
      break
    case SubscriptionOrderStatusEnum.Failure:
    case SubscriptionOrderStatusEnum.OrderError:
    case SubscriptionOrderStatusEnum.PaymentError:
      statusColor = `c-danger`
      break
  }

  return (
    <li className={`${style.historyListItem} pb5 f5 c-on-base lh-copy`}>
      <div className={`${style.historyListItemDot} ${statusColor}`}></div>
      <div className={`${style.historyListItemContent}`}>
        <FormattedMessage id={`store/subscription.order.status.${status}`}>
          {text => <span className={style.historyListItemStatus}>{text}</span>}
        </FormattedMessage>
        <FormattedDate
          value={date}
          year="numeric"
          month="long"
          day="2-digit"
          timeZone="UTC"
        >
          {text => <time className="db f6 c-muted-2 lh-title">{text}</time>}
        </FormattedDate>
      </div>
    </li>
  )
}

interface OuterProps {
  order: SubscriptionOrder
}

export default HistoryItem