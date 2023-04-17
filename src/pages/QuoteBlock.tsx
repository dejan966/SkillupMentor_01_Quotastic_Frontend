import { FC, useState } from 'react'
import { Button, Toast, ToastContainer } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import { QuoteType } from 'models/quote'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import SuccessPopup from './Success'

interface Props {
  userQuote: QuoteType
  likedQuote?: QuoteType[]
  likeColor?: string[]
  dislikeColor?: string[]
  voting?: (
    quoteId: number,
    vote: string,
    likeState: string,
    dislikeState: string,
  ) => void
}

const QuoteBlock: FC<Props> = ({
  userQuote,
  likedQuote,
  likeColor,
  dislikeColor,
  voting,
}) => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)

  const navigate = useNavigate()

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  const toggleSuccess = () => {
    setSuccessDelete(!successDelete)
  }

  const deleteQuote = async (quoteId: number) => {
    const response = await API.deleteQuote(quoteId)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    }
  }

  const handleProceedUser = () => {
    if (userQuote.user.id === authStore.user?.id) {
      navigate('me/quotes')
      return
    }
    navigate(`users/${userQuote.user.id}/quotes`)
  }

  return (
    <div className="quoteBorder myQuotes mb-5" style={{ width: 400 }}>
      {authStore.user ? (
        <>
          {authStore.user?.id === userQuote.user.id ? (
            <>
              <div className="m-4">
                <svg
                  width="13"
                  height="7"
                  viewBox="0 0 13 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 6L6.5 1L11.5 6"
                    stroke="#322D38"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
                  {userQuote.karma}
                </div>
                <svg
                  width="13"
                  height="7"
                  viewBox="0 0 13 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 1L6.5 6L1.5 0.999999"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
                  {userQuote.quote}
                </div>
                <div className="authorGrid">
                  <img
                    className="voting userAvatar"
                    src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`}
                    alt="User avatar"
                    width={35}
                    onClick={handleProceedUser}
                  />
                  <div style={{ fontSize: 15, fontFamily: 'raleway' }}>
                    {userQuote.user.first_name + ' ' + userQuote.user.last_name}
                  </div>
                </div>
              </div>
              <div className="m-4">
                <Link
                  to={`${routes.EDITQUOTE}/${userQuote.id}`}
                  state={{ data: userQuote }}
                >
                  <svg
                    width="13"
                    height="15"
                    viewBox="0 0 13 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.71342 14.1668H5.28675C5.13471 14.1669 4.98722 14.1149 4.86875 14.0196C4.75029 13.9243 4.66796 13.7914 4.63542 13.6428L4.36408 12.3868C4.00212 12.2282 3.65891 12.0299 3.34075 11.7955L2.11609 12.1855C1.97113 12.2317 1.81472 12.227 1.67283 12.172C1.53095 12.1171 1.41212 12.0153 1.33609 11.8835L0.120086 9.78283C0.0448492 9.65092 0.0166073 9.49738 0.0399806 9.34733C0.0633538 9.19728 0.136958 9.05961 0.248752 8.95683L1.19875 8.09016C1.15555 7.69757 1.15555 7.30142 1.19875 6.90883L0.248752 6.04416C0.1368 5.94134 0.0630954 5.80355 0.0397183 5.65335C0.0163412 5.50316 0.0446785 5.34948 0.120086 5.2175L1.33342 3.1155C1.40945 2.98371 1.52828 2.88189 1.67017 2.82695C1.81205 2.77202 1.96846 2.76727 2.11342 2.8135L3.33808 3.2035C3.50075 3.0835 3.67009 2.9715 3.84475 2.87016C4.01342 2.7755 4.18675 2.6895 4.36408 2.61283L4.63609 1.35816C4.66847 1.20963 4.75064 1.07662 4.86898 0.981195C4.98733 0.885769 5.13473 0.833656 5.28675 0.833496H7.71342C7.86544 0.833656 8.01284 0.885769 8.13119 0.981195C8.24953 1.07662 8.3317 1.20963 8.36408 1.35816L8.63875 2.6135C9.0005 2.77209 9.3435 2.97042 9.66142 3.20483L10.8868 2.81483C11.0316 2.76877 11.1879 2.77361 11.3296 2.82854C11.4714 2.88346 11.5901 2.98518 11.6661 3.11683L12.8794 5.21883C13.0341 5.49016 12.9807 5.8335 12.7507 6.04483L11.8007 6.9115C11.844 7.30409 11.844 7.70024 11.8007 8.09283L12.7507 8.9595C12.9807 9.1715 13.0341 9.51416 12.8794 9.7855L11.6661 11.8875C11.59 12.0193 11.4712 12.1211 11.3293 12.176C11.1875 12.231 11.031 12.2357 10.8861 12.1895L9.66142 11.7995C9.34351 12.0337 9.00051 12.2318 8.63875 12.3902L8.36408 13.6428C8.33157 13.7912 8.24934 13.9241 8.13101 14.0194C8.01268 14.1147 7.86535 14.1667 7.71342 14.1668ZM3.58008 10.3195L4.12675 10.7195C4.25008 10.8102 4.37809 10.8935 4.51142 10.9695C4.63675 11.0422 4.76475 11.1075 4.89742 11.1668L5.51942 11.4395L5.82409 12.8335H7.17742L7.48208 11.4388L8.10408 11.1662C8.37542 11.0462 8.63342 10.8975 8.87275 10.7222L9.41942 10.3222L10.7808 10.7555L11.4574 9.5835L10.4021 8.6215L10.4768 7.94683C10.5101 7.6515 10.5101 7.3535 10.4768 7.05883L10.4021 6.38416L11.4581 5.42016L10.7808 4.2475L9.42008 4.68083L8.87275 4.28083C8.63329 4.10462 8.37559 3.95465 8.10408 3.8335L7.48208 3.56083L7.17742 2.16683H5.82409L5.51742 3.5615L4.89742 3.8335C4.62554 3.95257 4.36774 4.10148 4.12875 4.2775L3.58142 4.6775L2.22142 4.24416L1.54342 5.42016L2.59875 6.38083L2.52409 7.05616C2.49075 7.3515 2.49075 7.6495 2.52409 7.94416L2.59875 8.61883L1.54342 9.58083L2.22009 10.7528L3.58008 10.3195ZM6.49742 10.1668C5.79017 10.1668 5.1119 9.88588 4.6118 9.38578C4.1117 8.88568 3.83075 8.20741 3.83075 7.50016C3.83075 6.79292 4.1117 6.11464 4.6118 5.61454C5.1119 5.11445 5.79017 4.8335 6.49742 4.8335C7.20466 4.8335 7.88294 5.11445 8.38304 5.61454C8.88313 6.11464 9.16408 6.79292 9.16408 7.50016C9.16408 8.20741 8.88313 8.88568 8.38304 9.38578C7.88294 9.88588 7.20466 10.1668 6.49742 10.1668ZM6.49742 6.16683C6.23632 6.16709 5.98105 6.24401 5.76327 6.38804C5.54549 6.53206 5.37479 6.73686 5.27235 6.97702C5.16991 7.21718 5.14023 7.48213 5.187 7.739C5.23377 7.99587 5.35493 8.23336 5.53545 8.422C5.71596 8.61064 5.94789 8.74213 6.20246 8.80015C6.45702 8.85818 6.72302 8.84018 6.96746 8.7484C7.21189 8.65662 7.424 8.4951 7.57746 8.28387C7.73093 8.07264 7.819 7.82099 7.83075 7.56016V7.82683V7.50016C7.83075 7.14654 7.69028 6.8074 7.44023 6.55735C7.19018 6.30731 6.85104 6.16683 6.49742 6.16683Z"
                      fill="#DE8667"
                    />
                  </svg>
                </Link>
                <div style={{ color: '#fff' }}>s</div>
                <div className="cursor-pointer" onClick={togglePopup}>
                  <svg
                    width="11"
                    height="12"
                    viewBox="0 0 11 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.89214 0.5L5.5 4.89214L1.10786 0.5L0 1.60786L4.39214 6L0 10.3921L1.10786 11.5L5.5 7.10786L9.89214 11.5L11 10.3921L6.60786 6L11 1.60786L9.89214 0.5Z"
                      fill="#DE8667"
                    />
                  </svg>
                </div>
                {isOpen && (
                  <SuccessPopup
                    content={
                      <>
                        <h1 className="text display-6 mb-4">Are you sure?</h1>
                        <p className="text">
                          The quote will be deleted. There is no undo of this
                          action.
                        </p>
                        <div className="d-flex justify-content-start">
                          <Button
                            className="btnRegister col-md-3"
                            style={{ borderColor: '#DE8667' }}
                            onClick={() => {
                              deleteQuote(userQuote.id)
                              togglePopup()
                              toggleSuccess()
                            }}
                          >
                            Delete
                          </Button>
                          <p
                            className="text-decoration-none col-md-3 mx-3"
                            style={{ color: '#000000' }}
                            onClick={togglePopup}
                          >
                            Cancel
                          </p>
                        </div>
                      </>
                    }
                  />
                )}
                {successDelete && (
                  <SuccessPopup
                    content={
                      <>
                        <p className="text fs-5">
                          Your <span style={{ color: '#DE8667' }}>quote</span>{' '}
                          was deleted.
                        </p>
                        <div className="d-flex justify-content-start">
                          <Button
                            href="/"
                            className="btnRegister col-md-3"
                            style={{ borderColor: '#DE8667' }}
                            onClick={(e) => {
                              toggleSuccess()
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    }
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="myQuotes" style={{ width: 400 }}>
                <div className="m-4">
                  {likedQuote?.reduce((result: any[], element, i) => {
                    if (element.id === userQuote.id) {
                      result.push(
                        <>
                          <div
                            className="cursor-pointer"
                            onClick={(e) => {
                              voting!(
                                element.id,
                                'upvote',
                                likeColor![i],
                                dislikeColor![i],
                              )
                            }}
                          >
                            <svg
                              width="13"
                              height="7"
                              viewBox="0 0 13 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.5 6L6.5 1L11.5 6"
                                stroke={likeColor![i]}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
                            {element.karma}
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={(e) => {
                              voting!(
                                element.id,
                                'downvote',
                                likeColor![i],
                                dislikeColor![i],
                              )
                            }}
                          >
                            <svg
                              width="13"
                              height="7"
                              viewBox="0 0 13 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.5 1L6.5 6L1.5 0.999999"
                                stroke={dislikeColor![i]}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </>,
                      )
                    }
                    return result
                  }, [])}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
                    {userQuote.quote}
                  </div>
                  <div className="authorGrid">
                    <img
                      className="voting userAvatar"
                      src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`}
                      alt="User avatar"
                      width={35}
                      onClick={handleProceedUser}
                    />
                    <div style={{ fontSize: 15, fontFamily: 'raleway' }}>
                      {userQuote.user.first_name +
                        ' ' +
                        userQuote.user.last_name}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="m-4">
            <Link to={routes.LOGIN}>
              <svg
                width="13"
                height="7"
                viewBox="0 0 13 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 6L6.5 1L11.5 6"
                  stroke="#322D38"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
              {userQuote.karma}
            </div>
            <Link to={routes.LOGIN}>
              <svg
                width="13"
                height="7"
                viewBox="0 0 13 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 1L6.5 6L1.5 0.999999"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <div>
            <div style={{ fontSize: 18, fontFamily: 'raleway' }}>
              {userQuote.quote}
            </div>
            <div className="authorGrid">
              <img
                className="voting userAvatar"
                src={`${process.env.REACT_APP_API_URL}/uploads/${userQuote.user.avatar}`}
                alt="User avatar"
                width={35}
                onClick={handleProceedUser}
              />
              <div style={{ fontSize: 15, fontFamily: 'raleway' }}>
                {userQuote.user.first_name + ' ' + userQuote.user.last_name}
              </div>
            </div>
          </div>
        </>
      )}
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  )
}

export default QuoteBlock
