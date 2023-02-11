import Layout from '../components/ui/Layout'
import { FC } from 'react'
import example from '../images/Example.png'
import { Button } from 'react-bootstrap'

const Home: FC = () => {
  return (
    <Layout>
      <div className="p-2 mb-4 grid">
        <div className="container-fluid py-4 text">
          <h1 className="display-1 font-family-raleway">Welcome to <span style={{color:'#DE8667'}}>Quotastic</span></h1>
          <p className="col-md-8 fs-4">
            Quotastic is a free online tool for you to explore the quips, quotes and proverbs.
            Sign up and express yourself. 
          </p>
          <p className="col-md-8 fs-4">
            <Button className='btnRegister'>
              Sign up
            </Button>
          </p>
        </div>
        <div><img src={example} width={456} /></div>
      </div>
    </Layout>
  )
}

export default Home