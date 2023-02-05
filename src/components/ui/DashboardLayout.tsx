import { FC, ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface Props {
  children: ReactNode | ReactNode[]
}

const Dashboard: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="d-flex">
        Dashboard
        <Sidebar />
        <Topbar />
      </div>
    </>
  )
}

export default Dashboard
