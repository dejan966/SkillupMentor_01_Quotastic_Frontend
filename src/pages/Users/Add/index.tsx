import Layout from '../../../components/ui/Layout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'

const UsersAdd: FC = () => {
  return (
    <Layout>
      <h1 className="mb-4 text-center">Create new user</h1>
      <CreateUpdateUserForm />
    </Layout>
  )
}

export default UsersAdd
