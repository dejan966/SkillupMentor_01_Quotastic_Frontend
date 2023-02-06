import Layout from '../../components/ui/Layout'
import { useState } from 'react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useQuery, useMutation } from 'react-query'
import useMediaQuery from '../../hooks/useMediaQuery'
import * as API from '../../api/Api'
import { routes } from '../../constants/routesConstants'
import { StatusCode } from '../../constants/errorConstants'
import { UserType } from '../../models/auth'
import authStore from '../../stores/auth.store'

const Users: FC = () => {
  //show user info
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)
  const [pageNumber, setPageNumber] = useState(1)
/* 
  const { data, isLoading, refetch } = useQuery(
    ['featchUsers', pageNumber],
    () => API.fetchUsers(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const { mutate } = useMutation((id: string) => API.deleteUser(id), {
    onSuccess: (response) => {
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (
        response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
        refetch()
      }
    },
    onError: () => {
      setApiError('Something went wrong while deleting a user')
      setShowError(true)
    },
  })

  const handleDelete = (id: string) => {
    mutate(id)
  } */

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="mb-4">User Info</h1>
      </div>
      <div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Full name</th>
              <th>Email</th>
            </tr>
          </thead>
{/*           <tbody>
            {data?.data.data.map((item: UserType, index: number) => (
              <tr key={index}>
                <td>
                  {item.first_name || ' ' || item.last_name}
                </td>
                <td>{item.email}</td>
              </tr>
            ))}
          </tbody> */}
        </Table>
      </div>
    </Layout>
  )
}

export default Users