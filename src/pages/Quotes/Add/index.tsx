import DashboardLayout from '../../../components/ui/Layout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'

const QuotesAdd: FC = () => {
  return (
    <DashboardLayout>
      <h1 className="mb-4 text-center">Create new user</h1>
      <CreateUpdateUserForm />
    </DashboardLayout>
  )
}

export default QuotesAdd
