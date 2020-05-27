import React from 'react'
import { render } from '@vtex/test-tools/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/Details'
import { MOCK_ROUTER_PARAM, generateDetailMock } from '../mocks'

describe('Display Address Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  it('Should display edit button disabled', async () => {
    const { queryByTestId } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [generateDetailMock({ status: 'PAUSED' })],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    const paymentButton = queryByTestId('edit-payment-button')
    const addressButton = queryByTestId('edit-address-button')
    const frequencyButton = queryByTestId('edit-frequency-button')

    expect((paymentButton as any).disabled).toBe(true)
    expect((addressButton as any).disabled).toBe(true)
    expect((frequencyButton as any).disabled).toBe(true)
  })

  it('Shouldnt display edit button', async () => {
    const { queryByTestId } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [generateDetailMock({ status: 'CANCELED' })],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    const paymentButton = queryByTestId('edit-payment-button')
    const addressButton = queryByTestId('edit-address-button')
    const frequencyButton = queryByTestId('edit-frequency-button')

    expect(paymentButton).toBeNull()
    expect(addressButton).toBeNull()
    expect(frequencyButton).toBeNull()
  })
})
