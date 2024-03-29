import Layout from 'components/ui/Layout'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UserEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <CreateUpdateUserForm defaultValues={location.state.data} />
    </Layout>
  )
}

export default UserEdit
