import Layout from '../components/ui/Layout'
import { FC } from 'react'
import { Button } from 'react-bootstrap'
import { routes } from '../constants/routesConstants'
import authStore from '../stores/auth.store'
import { useQuery } from 'react-query'
import * as API from '../api/Api'

const Home: FC = () => {
  const { data, isLoading, error } = useQuery(
    ['quote'],
    () => API.fetchRandomQuote(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <>
    <Layout>
      {authStore.user ? (
        <>
          {data ? (
            <div className='text-center'>
              <h2 className='red'>Quote of the day</h2>
              <p className='text'>Quote of the day is a randomly chosen quote</p>
              <div className="justify-content-between quoteBorder" style={{width: 500}}>
                <div className='col-md-1'>
                  <img src="upvote.png" alt="Upvote" />
                  <div>{data.data.karma}</div>
                  <img src="downvote.png" alt="Downvote" />
                </div>
                <div className='col-md-12'>
                  <div>{data.data.quote}</div>
                  <div className='quoteGrid'>
                    <img src={data.data.user.avatar} alt="User avatar" width={40}/>
                    <div>{data.data.user.first_name + ' ' + data.data.user.last_name}</div>
                  </div>
                </div>
              </div>
            </div>
          ):null
          }
        </>
      ):(
        <>
          <div className="py-4 text grid">
            <div className="text">
              <h1 className="display-1 font-family-raleway">Welcome to <span style={{color:'#DE8667'}}>Quotastic</span></h1>
              <p className="col-md-8 fs-4">
                Quotastic is a free online tool for you to explore the quips, quotes and proverbs.
                Sign up and express yourself. 
              </p>
              {/*Quote of the day when you're logged in*/}
              <p className="fs-4">
                <Button className="btnRegister" href={routes.SIGNUP}>
                  Sign up
                </Button>
              </p>
            </div>
            <div><img src="example_quote.png" width={456} alt="example quote" /></div>
          </div>
        </>
      )
    }  
    </Layout>
    </>
   
  )
}

export default Home