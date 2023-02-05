import Layout from '../../../components/ui/Layout'
import { FC } from 'react'
import CreateUpdateQuoteForm from '../../../components/quote/CreateUpdateQuoteForm'

const QuotesEdit: FC = () => {
  return (
    <Layout>
      <h1 className="mb-4 text-center">Create new quote</h1>
      <CreateUpdateQuoteForm />
    </Layout>
  )
}

export default QuotesEdit