import Layout from '../../../components/ui/Layout'
import UpdatePasswordForm from '../../../components/user/UpdatePasswordForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UserPasswordEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <UpdatePasswordForm defaultValues={location.state.data} />
    </Layout>
  )
}

export default UserPasswordEdit
