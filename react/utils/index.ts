import { ApolloError } from 'apollo-client'

import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatusEnum,
  TagTypeEnum,
  MenuOptionsEnum,
} from '../constants'

export function parseErrorMessageId(error: ApolloError): string {
  if (
    error &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions &&
    error.graphQLErrors[0].extensions
  ) {
    return `subscription.fetch.${(error.graphQLErrors[0].extensions.error &&
      error.graphQLErrors[0].extensions.error.statusCode &&
      error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
      'timeout'}`
  }

  return ''
}

export function convertFilter(
  filter: SubscriptionDisplayFilterEnum
): SubscriptionStatusEnum[] {
  if (filter === SubscriptionDisplayFilterEnum.Canceled) {
    return [SubscriptionStatusEnum.Canceled]
  }

  return [SubscriptionStatusEnum.Active, SubscriptionStatusEnum.Paused]
}

export function convertStatusInTagType(
  status: SubscriptionStatusEnum
): TagTypeEnum | null {
  switch (status) {
    case SubscriptionStatusEnum.Canceled:
      return TagTypeEnum.Error
    case SubscriptionStatusEnum.Paused:
      return TagTypeEnum.Warning
    default:
      return null
  }
}

export function retrieveMessagesByStatus(status: SubscriptionStatusEnum) {
  let titleMessageId = ''
  let bodyMessageId = ''

  switch (status) {
    case SubscriptionStatusEnum.Active:
      titleMessageId = 'subscription.restore.title'
      bodyMessageId = 'subscription.restore.text'
      break
    case SubscriptionStatusEnum.Paused:
      titleMessageId = 'subscription.pause.title'
      bodyMessageId = 'subscription.pause.text'
      break
    case SubscriptionStatusEnum.Canceled:
      titleMessageId = 'subscription.cancel.title'
      bodyMessageId = 'subscription.cancel.text'
      break
  }

  return {
    bodyMessageId,
    cancelationMessageId: 'subscription.change.status.modal.cancelation',
    confirmationMessageId: 'subscription.change.status.modal.confirmation',
    titleMessageId,
  }
}

export const makeCancelable = (promise: Promise<any>) => {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    },
  }
}

export function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatusEnum
) {
  return isSkipped
    ? [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Unskip,
        MenuOptionsEnum.Pause,
        MenuOptionsEnum.Cancel,
      ]
    : status === SubscriptionStatusEnum.Paused
    ? [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Restore,
        MenuOptionsEnum.Cancel,
      ]
    : [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Skip,
        MenuOptionsEnum.Pause,
        MenuOptionsEnum.Cancel,
      ]
}
