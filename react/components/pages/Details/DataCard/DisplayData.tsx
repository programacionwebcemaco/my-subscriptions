import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { CSS } from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import FrequencyInfo from '../../../commons/FrequencyInfo'
import LabeledInfo from '../../../commons/LabeledInfo'

const DisplayData: FunctionComponent<Props> = ({
  subscriptionsGroup,
  intl,
  onOpenEdit,
}) => {
  let displayDelivery = false
  if (subscriptionsGroup.shippingEstimate.estimatedDeliveryDate) {
    displayDelivery =
      subscriptionsGroup.shippingEstimate.estimatedDeliveryDate >
      subscriptionsGroup.nextPurchaseDate
  }

  return (
    <div className={CSS.cardWrapper}>
      <div className="flex">
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({ id: 'subscription.data' })}
        </div>
        <div className="ml-auto">
          <EditButton
            onEdit={onOpenEdit}
            subscriptionStatus={subscriptionsGroup.status}
          />
        </div>
      </div>

      <div className="pt5-s pt5-ns w-100-s mr-auto">
        <FrequencyInfo subscriptionsGroup={subscriptionsGroup} />

        <div className="flex-l">
          <div className="w-50-l pt6">
            <LabeledInfo labelId="subscription.nextPurchase">
              <div className="flex flex-row">
                <span className="db fw3 f5-ns f6-s c-on-base">
                  {intl.formatDate(subscriptionsGroup.nextPurchaseDate)}
                </span>
                {subscriptionsGroup.isSkipped && (
                  <div className="lh-solid mt1 ml3">
                    <Tag type="warning">
                      {intl.formatMessage({ id: 'subscription.skip.confirm' })}
                    </Tag>
                  </div>
                )}
              </div>
            </LabeledInfo>
          </div>

          <div className="w-50-l pt6">
            <LabeledInfo labelId="subscription.data.estimatedDelivery">
              {displayDelivery &&
                intl.formatDate(
                  subscriptionsGroup.shippingEstimate
                    .estimatedDeliveryDate as string,
                  { timeZone: 'UTC' }
                )}
            </LabeledInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  onOpenEdit: () => void
}

export default injectIntl(DisplayData)
