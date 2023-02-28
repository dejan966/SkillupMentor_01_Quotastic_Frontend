import Layout from '../../components/ui/Layout'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import useMediaQuery from '../../hooks/useMediaQuery'
import { Button, FormLabel } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { routes } from '../../constants/routesConstants'
import Avatar from 'react-avatar'
import { UserType } from '../../models/auth'

const UserInfo: FC = () => {
  const [user, setUser] = useState([])
  const [loading, isLoading] = useState(true)
  const [error, setError] = useState(true)

  useEffect(() => {
    API.fetchCurrUser().then(data=>{
      setUser(Object.values(data))
      isLoading(false)
      console.log(data)
    }).catch(error=>{
      setError(error)
    })/*  ,
    ({
      onSuccess:(data:any)=>{
        console.log(data)
      }
    }) */
  },[user])

/*   useQuery(
    ['currUserMe'],
    () => API.fetchCurrUser().then(data=>{
      isLoading(false)
      setUser(Object.values(data))
      console.log(data)
    }),
    {
      onSuccess: (data)=>(setUser(Object.values(data)), isLoading(false)),
      //onError:(error) => setError(error)
    }
  ) */

  return ( 
    <Layout>
      { loading ? (
        <div className='text-center'>
          Loading data...
        </div>
      ): 
        <>
          {user ? (
            <div className="forms">
              <h1 className='display-5 text-center'>Your info</h1>
              {user.map((item:UserType, index:number)=>(
                <div key={index}>
                <Form.Group className="d-flex flex-column justify-content-center align-items-center">
              <FormLabel htmlFor="avatar" id="avatar-p">
                <Avatar round src={item.avatar} alt="Avatar" />
              </FormLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <input
                type="email"
                value={item.email}
                aria-label="Email"
                aria-describedby="email"
                className='form-control'
                style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                readOnly
              />
            </Form.Group>
            <div className="d-flex justify-content-between mb-3">
              <div className="col-md-5">
                <Form.Group className="mb-3">
                  <FormLabel htmlFor="first_name">First name</FormLabel>
                  <input
                    type="text"
                    value={item.first_name}
                    aria-label="First name"
                    aria-describedby="first_name"
                    className='form-control'
                    style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className='col-md-5'>
                <Form.Group className="mb-3">
                  <FormLabel htmlFor="last_name">Last name</FormLabel>
                  <input
                    type="text"
                    value={item.last_name}
                    aria-label="Last name"
                    aria-describedby="last_name"
                    className='form-control'
                    style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            </div>
              ))}
              <div className="d-flex justify-content-between mb-3">
                <Button href={routes.USEREDIT} className='btnRegister'>Edit</Button>
                <a className="text-decoration-none col-md-3" style={{color:'#000000'}} href={routes.USERDELETE}>Disable account</a>
              </div>
            </div> 
            ) : null
          }
        </>
      }
    </Layout>
  )
}
export default UserInfo