import React, { Component } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Box } from 'vtex.styleguide'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Display from './DisplayData'

const messages = defineMessages({
  title: {
    id: 'store/details-page.preferences.title',
  },
})

class PreferencesContainer extends Component<Props> {
  public state = {
    isEditMode: false,
  }

  public render() {
    const { plan, address, payment, intl } = this.props

    return (
      <Box title={intl.formatMessage(messages.title)}>
        <Display plan={plan} address={address} payment={payment} />
      </Box>
    )
  }
}

type Props = {
  subscriptionId: string
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
} & WrappedComponentProps

export default injectIntl(PreferencesContainer)
