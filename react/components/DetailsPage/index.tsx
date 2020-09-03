import React, { Component, ErrorInfo } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { graphql, MutationResult } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import DETAILS_PAGE_QUERY, {
  Subscription,
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/detailsPage.gql'
import ORDER_NOW, {
  Args as AddItemArgs,
} from '../../graphql/mutations/orderNow.gql'
import UPDATE_STATUS, {
  Args as UpdateStatusArgs,
} from '../../graphql/mutations/updateStatus.gql'
import UPDATE_IS_SKIPPED, {
  Args as UpdateIsSkippedArgs,
} from '../../graphql/mutations/updateIsSkipped.gql'
import { logError, queryWrapper, logGraphqlError } from '../../tracking'
import Header from './PageHeader'
import { SubscriptionAction, retrieveModalConfig } from './utils'
import ConfirmationModal from '../ConfirmationModal'
import ActionBar from './ActionBar'
import Products from './Products'
import Preferences from './Preferences'
import Summary from '../Summary'
import History from './History'
import Skeleton from './Skeleton'

export const INSTANCE = 'SubscriptionsDetails'

export const PAYMENT_DIV_ID = 'vtex.subscription.payment.div.id'
export const ADDRESS_DIV_ID = 'vtex.subscription.address.div.id'

const messages = defineMessages({
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
  },
})

class SubscriptionsDetailsContainer extends Component<Props, State> {
  public state = {
    isModalOpen: false,
    errorMessage: null,
    actionType: null,
    displayHistory: false,
    editPreferences: false,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error,
      errorInfo,
      runtime: this.props.runtime,
      instance: INSTANCE,
    })
  }

  private handleOpenHistory = () => this.setState({ displayHistory: true })

  private handleCloseHistory = () => this.setState({ displayHistory: false })

  private handleUpdateStatus = (status: SubscriptionStatus) => {
    const { updateStatus, subscription, runtime } = this.props

    if (!subscription) return null

    const variables = {
      status,
      subscriptionId: subscription.id,
    }

    return updateStatus({
      variables,
    }).catch((error: ApolloError) => {
      logGraphqlError({
        error,
        variables,
        runtime,
        type: 'MutationError',
        instance: 'UpdateStatus',
      })
      throw error
    })
  }

  private handleUpdateAction = (action: SubscriptionAction) => {
    this.setState({ isModalOpen: true, actionType: action })
  }

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleError = () =>
    this.setState({
      errorMessage: this.props.intl.formatMessage(messages.errorMessage),
    })

  private handleUpdateSkipped = () => {
    const { updateIsSkipped, subscription, runtime } = this.props

    if (!subscription) return null

    const variables = {
      subscriptionId: subscription.id,
      isSkipped: !subscription.isSkipped,
    }

    return updateIsSkipped({
      variables,
    }).catch((error: ApolloError) => {
      logGraphqlError({
        error,
        variables,
        runtime,
        type: 'MutationError',
        instance: 'UpdateIsSkipped',
      })
      throw error
    })
  }

  private handleOrderNow = () => {
    const { orderFormId, orderNow, subscription, runtime } = this.props

    if (!subscription) return null

    const items = subscription.items.map((item) => ({
      quantity: item.quantity,
      id: parseInt(item.id, 10),
      seller: '1',
    }))

    const variables = {
      orderFormId,
      items,
    }

    return orderNow({ variables })
      .then(() => (window.location.href = '/checkout/'))
      .catch((error: ApolloError) => {
        logGraphqlError({
          error,
          variables,
          runtime,
          type: 'MutationError',
          instance: 'OrderNow',
        })
        throw error
      })
  }

  public render() {
    const { subscription, orderFormId, intl } = this.props
    const { actionType, isModalOpen, errorMessage, displayHistory } = this.state

    if (!subscription) return null

    const modalProps = retrieveModalConfig({
      orderNow: this.handleOrderNow,
      onCloseModal: this.handleCloseModal,
      onError: this.handleError,
      updateSkip: this.handleUpdateSkipped,
      updateStatus: this.handleUpdateStatus,
      intl,
      action: actionType,
      isModalOpen,
      errorMessage,
    })

    return (
      <>
        <History
          subscriptionId={subscription.id}
          isOpen={displayHistory}
          onClose={this.handleCloseHistory}
        />
        <ConfirmationModal {...modalProps} />
        <Header
          name={subscription.name}
          status={subscription.status}
          subscriptionId={subscription.id}
          orderFormId={orderFormId}
          skus={subscription.items.map((item) => ({
            detailUrl: item.sku.detailUrl,
            name: item.sku.name,
          }))}
          isSkipped={subscription.isSkipped}
          onUpdateAction={this.handleUpdateAction}
          onOpenHistory={this.handleOpenHistory}
        />
        <div className="pa5 pa7-l flex flex-wrap">
          <div className="w-100 w-60-l">
            <ActionBar
              status={subscription.status}
              isSkipped={subscription.isSkipped}
              address={subscription.shippingAddress}
              payment={subscription.purchaseSettings.paymentMethod}
              onUpdateAction={this.handleUpdateAction}
              nextPurchaseDate={subscription.nextPurchaseDate}
            />
            <Products
              subscriptionId={subscription.id}
              status={subscription.status}
              items={subscription.items}
              planId={subscription.plan.id}
              currencyCode={subscription.purchaseSettings.currencyCode}
            />
          </div>
          <div className="w-100 w-40-l pt6 pt0-l pl0 pl6-l">
            <Preferences
              status={subscription.status}
              plan={subscription.plan}
              payment={subscription.purchaseSettings}
              currentPaymentAccountId={subscription.paymentAccountId ?? null}
              address={subscription.shippingAddress}
              currentAddressId={subscription.addressId ?? null}
              subscriptionId={subscription.id}
              lastExecutionStatus={subscription.lastExecution?.status}
            />
            <Summary
              totals={subscription.totals}
              currencyCode={subscription.purchaseSettings.currencyCode}
            />
          </div>
        </div>
      </>
    )
  }
}

interface Variables<T> {
  variables: T
}

type State = {
  isModalOpen: boolean
  displayHistory: boolean
  errorMessage: string | null
  actionType: SubscriptionAction | null
  editPreferences: boolean
}

type Props = {
  orderNow: (args: Variables<AddItemArgs>) => Promise<MutationResult>
  updateIsSkipped: (
    args: Variables<UpdateIsSkippedArgs>
  ) => Promise<MutationResult>
  updateStatus: (args: Variables<UpdateStatusArgs>) => Promise<MutationResult>
} & InjectedRuntimeContext &
  WrappedComponentProps &
  ChildProps

type InputProps = RouteComponentProps<{ subscriptionId: string }>

interface ChildProps {
  loading: boolean
  subscription?: Subscription
  orderFormId?: string
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  withRuntimeContext,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ORDER_NOW, { name: 'orderNow' }),
  queryWrapper<InputProps, Result, QueryArgs, ChildProps>(
    INSTANCE,
    DETAILS_PAGE_QUERY,
    {
      options: (input) => ({
        variables: {
          id: input.match.params.subscriptionId,
        },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        subscription: data?.subscription,
        orderFormId: data?.orderForm?.orderFormId,
      }),
    }
  ),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(SubscriptionsDetailsContainer)
