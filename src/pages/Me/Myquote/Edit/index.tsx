import Layout from '../../../../components/ui/Layout'
import { FC } from 'react'
import CreateUpdateQuoteForm from '../../../../components/quote/CreateUpdateQuoteForm'
import { useLocation } from 'react-router-dom'

const QuotesEdit: FC = () => {
  const location = useLocation()
  //console.log(location.state.data.id)
  return (
    <Layout>
      <CreateUpdateQuoteForm defaultValues={location.state.data}/>
    </Layout>
  )
}

export default QuotesEdit