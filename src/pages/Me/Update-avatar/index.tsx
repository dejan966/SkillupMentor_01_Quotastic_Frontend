import Layout from '../../../components/ui/Layout'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'
import UpdateAvatarForm from '../../../components/user/UpdateAvatarForm'

const UserAvatarEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <div className="profileSettings">
        <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
        <div>Change your profile setting</div>
      </div>
      <UpdateAvatarForm defaultValues={location.state}/>
    </Layout>
  )
}

export default UserAvatarEdit
