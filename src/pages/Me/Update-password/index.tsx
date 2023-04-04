import Layout from 'components/ui/Layout'
import UpdatePasswordForm from 'components/user/UpdatePasswordForm'
import { FC } from 'react'

const UserPasswordEdit: FC = () => {
  return (
    <Layout>
      <UpdatePasswordForm />
    </Layout>
  )
}

export default UserPasswordEdit
