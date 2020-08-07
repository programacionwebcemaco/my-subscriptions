import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { compose } from 'recompose'
import { Modal, InputSearch, Spinner } from 'vtex.styleguide'

import { INSTANCE as PAGE } from '..'
import { queryWrapper } from '../../../tracking'
import SEARCH_QUERY, {
  Args as SearchArgs,
  Result as SearchResult,
  SubscribableItem,
} from '../../../graphql/queries/search.gql'
import Item from './SearchItem'

const messages = defineMessages({
  title: {
    id: 'store/add-item-modal.title',
    defaultMessage: 'Add new product',
  },
  placeholder: {
    id: 'store/add-item-modal.placeholder',
    defaultMessage: 'Search',
  },
  searchLabel: {
    id: 'store/add-item-modal.search-label',
    defaultMessage: 'What are you looking for?',
  },
})

const INSTANCE = `${PAGE}/SearchSubscribableProducts`

const LOADING = (
  <div className="w-100 flex justify-center">
    <Spinner />
  </div>
)

const EMPTY = <div>empty</div>

const AddItemModal: FunctionComponent<Props> = ({
  onCloseModal,
  onChangeSearch,
  isModalOpen,
  searchInput,
  intl,
  loading,
  items,
  currency,
}) => {
  return (
    <Modal
      title={intl.formatMessage(messages.title)}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      responsiveFullScreen
    >
      <InputSearch
        label={intl.formatMessage(messages.searchLabel)}
        placeholder={intl.formatMessage(messages.placeholder)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeSearch(e.target.value)
        }
        size="regular"
        value={searchInput}
      />
      <div className="mt8">
        {loading
          ? LOADING
          : items && items.length > 0
          ? items.map((item) => (
              <div key={item.skuId} className="mb6">
                <Item
                  name={item.name}
                  price={item.price}
                  currency={currency}
                  imageUrl={item.imageUrl}
                  brand={item.brand}
                  measurementUnit={item.measurementUnit}
                  unitMultiplier={item.unitMultiplier}
                />
              </div>
            ))
          : EMPTY}
      </div>
    </Modal>
  )
}

type InnerProps = InjectedIntlProps
interface OuterProps {
  isModalOpen: boolean
  onCloseModal: () => void
  onChangeSearch: (term: string) => void
  searchInput: string
  searchTerm: string
  currency: string
}

interface MappedProps {
  loading?: boolean
  items?: SubscribableItem[]
}

type Props = InnerProps & OuterProps & MappedProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  queryWrapper<OuterProps, SearchResult, SearchArgs, MappedProps>(
    INSTANCE,
    SEARCH_QUERY,
    {
      skip: ({ searchTerm }) => searchTerm.length < 2,
      props: ({ data }) => ({
        loading: data?.loading,
        items: data?.search,
      }),
    }
  )
)

export default enhance(AddItemModal)
