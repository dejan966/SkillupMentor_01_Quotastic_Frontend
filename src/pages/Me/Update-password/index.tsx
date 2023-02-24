import Layout from '../../../components/ui/Layout'
import UpdatePasswordForm from '../../../components/user/UpdatePasswordForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UserPasswordEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <div className="profileSettings">
        <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
        <div>Change your profile setting</div>
      </div>
      <UpdatePasswordForm defaultValues={location.state} />
    </Layout>
  )
}

export default UserPasswordEdit
