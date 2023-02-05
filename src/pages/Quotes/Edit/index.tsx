import DashboardLayout from '../../../components/ui/DashboardLayout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'

const QuotesEdit: FC = () => {
  return (
    <DashboardLayout>
      <h1 className="mb-4 text-center">Create new quote</h1>
      <CreateUpdateUserForm />
    </DashboardLayout>
  )
}

export default QuotesEdit