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

const UserInfo: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)

  const { data } = useQuery(
    ['currUserInfo'],
    () => API.currUserInfo(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )
  console.log(data.request)
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
      <div className="form-group forms mb-4">
        {data?.map((item: UserType, index: number) => (
          <>
            {/*read only text fields */}
            <div key={index} className="text-center">
              <div className="mb-12">
                {item.avatar}
              </div>
              <div className="mb-12">
                {item.email}
              </div>
              <div className="d-flex justify-content-between mb-3">
                <div className="col-md-5">
                  {item.first_name}
                </div>
                <div className="col-md-5">
                  {item.last_name}
                </div>
              </div>
              <div>
              <div className="d-flex justify-content-between mb-3">
                <div className="col-md-3">
                  {/*Get current user data and send it to me/edit*/}
                  <Button href={routes.USEREDIT}>Edit</Button>
                </div>
                <div className="col-md-3">
                  <Button href={routes.USERDELETE}>Disable account</Button>
                </div>
              </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </Layout>
  )
}

export default UserInfo