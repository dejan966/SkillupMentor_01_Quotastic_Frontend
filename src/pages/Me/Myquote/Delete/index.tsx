import Layout from '../../../../components/ui/Layout'
import { FC } from 'react'
import CreateUpdateQuoteForm from '../../../../components/quote/CreateUpdateQuoteForm'
import { useLocation } from 'react-router-dom'

const QuotesDelete: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      {/* <CreateUpdateQuoteForm defaultValues={location.state.data}/> */}
    </Layout>
  )
}

export default QuotesDelete