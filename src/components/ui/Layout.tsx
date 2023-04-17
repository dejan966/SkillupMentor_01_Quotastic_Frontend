import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="display">
        <Navbar />
        <div className="container p-4 content">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout