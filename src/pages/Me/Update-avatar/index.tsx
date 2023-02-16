import Layout from '../../../components/ui/Layout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UserAvatarEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <h1 className="mb-4 text-center">Update user avatar</h1>
      <CreateUpdateUserForm defaultValues={location.state} />
    </Layout>
  )
}

export default UserAvatarEdit