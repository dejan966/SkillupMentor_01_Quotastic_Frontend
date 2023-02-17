import Layout from '../../../../components/ui/Layout'
import { FC } from 'react'
import CreateUpdateQuoteForm from '../../../../components/quote/CreateUpdateQuoteForm'

const QuotesEdit: FC = () => {
  return (
    <Layout>
      <CreateUpdateQuoteForm />
    </Layout>
  )
}

export default QuotesEdit