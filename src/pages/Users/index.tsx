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
  const [pageNumber, setPageNumber] = useState(1)
  
  const { data } = useQuery(
    ['fetchUser', pageNumber],
    () => API.fetchUser(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <Layout>
      <div className="mb-4">
        {data?.data.data.map((item: UserType, index: number) => (
          <>
            <div key={index} className="textColorReverse">
              <img src={item.avatar} alt="User avatar" />
              <h1 className="mb-4 text-center">{item.first_name || ' ' || item.last_name}</h1>
            </div>
            <div>
              {/*Most liked quotes*/} 
              {/*Most recent quotes*/}
              {/*Liked*/}
            </div>
          </>
        ))}
      </div>
    </Layout>
  )
}

export default Users