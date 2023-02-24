import Layout from '../../../components/ui/Layout'
import CreateUpdateUserForm from '../../../components/user/CreateUpdateUserForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const UserEdit: FC = () => {
  const location = useLocation()
  return (
    <Layout>
      <div className="profileSettings">
        <h1>Profile <span style={{color:'#DE8667'}}>settings</span></h1>
        <div>Change your profile setting</div>
      </div>
      <CreateUpdateUserForm defaultValues={location.state} />
    </Layout>
  )
}

export default UserEdit
