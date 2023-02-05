import Layout from '../../../components/ui/Layout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UsersEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <h1 className="mb-4 text-center">Edit user</h1>
      <CreateUpdateUserForm defaultValues={location.state} />
    </Layout>
  )
}

export default UsersEdit
