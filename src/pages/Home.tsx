import Layout from '../components/ui/Layout'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
          <h1 className="display-5">Welcome to {/*Span*/} Quotastic</h1>
          <p className="col-md-8 fs-4">
            Quotastic is a free online tool for you to explore the quips, quotes and proverbs.
            Sign up and express yourself. 
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Home