import Layout from '../components/ui/Layout'
import { FC } from 'react'
import example from '../images/Example.png'
import { Button } from 'react-bootstrap'
import { routes } from '../constants/routesConstants'

const Home: FC = () => {
  return (
    <Layout>
      <div className="py-4 text grid">
        <div className="text">
          <h1 className="display-1 font-family-raleway">Welcome to <span style={{color:'#DE8667'}}>Quotastic</span></h1>
          <p className="col-md-8 fs-4">
            Quotastic is a free online tool for you to explore the quips, quotes and proverbs.
            Sign up and express yourself. 
          </p>
          <p className="fs-4">
            <Button className="btnRegister" href={routes.SIGNUP}>
              Sign up
            </Button>
          </p>
        </div>
        <div><img src={example} width={456} alt="quote" /></div>
      </div>
    </Layout>
  )
}

export default Home