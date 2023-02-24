import Layout from '../../components/ui/Layout'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import useMediaQuery from '../../hooks/useMediaQuery'
import { UserType } from '../../models/auth'
import { Button, FormLabel } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UpdateUserFields, useCreateUpdateUserForm } from '../../hooks/react-hook-form/useCreateUpdateUser'
import { routes } from '../../constants/routesConstants'
import authStore from '../../stores/auth.store'
import { PropTypes } from 'mobx-react'
import Avatar from 'react-avatar'

const UserInfo: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)
  
  const { data, isLoading, error } = useQuery(
    ['user'],
    () => API.fetchCurrUser(),
  )
  const { mutate } = useMutation((id: number) => API.deleteUser(id), {
    onSuccess: (response) => {
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (
        response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(response.data.message)
        setShowError(true)
      } 
    },
    onError: () => {
      setApiError('Something went wrong while deleting a user')
      setShowError(true)
    },
  })

  const handleDelete = (id: number) => {
    mutate(id)
  }

  return ( 
    <Layout>
      { isLoading ? (
        <div className='text-center'>
          Loading data...
        </div>
      ): 
        <>
          {data ? (
            <div className="forms">
              <h1 className='display-5 text-center'>Your info</h1>
              <Form.Group className="d-flex flex-column justify-content-center align-items-center">
                <FormLabel htmlFor="avatar" id="avatar-p">
                  <Avatar round src={data.data.avatar} alt="Avatar" />
                </FormLabel>
              </Form.Group>
              <Form.Group className="mb-3">
                <FormLabel htmlFor="email">Email</FormLabel>
                <input
                  type="email"
                  value={data.data.email}
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
                      value={data.data.first_name}
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
                      value={data.data.last_name}
                      aria-label="Last name"
                      aria-describedby="last_name"
                      className='form-control'
                      style={{borderRadius:32, borderColor:'#DE8667', fontFamily:'Raleway'}}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </div>
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