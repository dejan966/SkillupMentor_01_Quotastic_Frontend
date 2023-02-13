import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container p-4">{children}</div>
      <Footer />
    </>
  )
}

export default Layout