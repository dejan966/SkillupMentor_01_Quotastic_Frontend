import { FC } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/ui/Layout'

const Page404: FC = () => {
  return (
    <Layout>
      <div className="page-404">
      <h1>
        Nothing found <b>404</b>!
      </h1>
      <Link to="/">Go home</Link>
    </div>
    </Layout>
  )
}

export default Page404
