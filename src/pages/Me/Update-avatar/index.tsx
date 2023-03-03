import Layout from '../../../components/ui/Layout'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'
import UpdateAvatarForm from '../../../components/user/UpdateAvatarForm'

const UserAvatarEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <UpdateAvatarForm defaultValues={location.state.data}/>
    </Layout>
  )
}

export default UserAvatarEdit
