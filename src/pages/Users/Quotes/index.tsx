import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { Button } from 'react-bootstrap'
import { QuoteType } from 'models/quote'
import { VoteType } from 'models/vote'
import { useNavigate, useParams } from 'react-router-dom'
import authStore from 'stores/auth.store'

const UserQuotesInfo: FC = () => {
  const [otherUserId, setOtherUserId] = useState(1)
  const navigate = useNavigate()
  const { id } = useParams()
  const userId: number = parseInt(id!)

  const { data: otherUserMostLiked, isLoading: isLoadingOtherMostLiked } =
    useQuery(
      ['otherUserMostLikedQuotes'],
      () => API.fetchUserMostLikedQuotes(userId),
      {
        refetchOnWindowFocus: false,
      },
    )

  const { data: otherUserMostRecent, isLoading: isLoadingOtherMostRecent } =
    useQuery(
      ['otherUserMostRecentQuotes'],
      () => API.fetchUserMostRecentQuotes(userId),
      {
        refetchOnWindowFocus: false,
      },
    )

  const { data: otherUserLiked, isLoading: isLoadingLiked } = useQuery(
    ['otherUserLikes'],
    () => API.fetchUserVotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )

  const handleProceedUser = () => {
    if (otherUserId === authStore.user?.id) {
      navigate('../me/quotes')
      return
    }
    navigate(`users/${userId}/quotes`)
  }

  return (
    <Layout>
      <div>
        <div className="quoteRow mb-5">
          <div>
            <h2 className="red">Most liked quotes</h2>
            <div className="mb-5">
              {isLoadingOtherMostLiked ? (
                <div>Loading...</div>
              ) : (
                <>
                  {otherUserMostLiked ? (
                    <>
                      {otherUserMostLiked.data.map(
                        (item: QuoteType, index: number) => (
                          <div
                            className="quoteBorder myQuotes mb-5"
                            key={index}
                            style={{ width: 400 }}
                          >
                            <div className="m-4">
                              <img
                                className="voting"
                                src="/upvote.png"
                                alt="Upvote"
                              />
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.karma}
                              </div>
                              <img
                                className="voting"
                                src="/downvote.png"
                                alt="Downvote"
                              />
                            </div>
                            <div>
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.quote}
                              </div>
                              <div className="authorGrid">
                                <img
                                  className="voting userAvatar"
                                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`}
                                  alt="User avatar"
                                  width={35}
                                />
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontFamily: 'raleway',
                                  }}
                                >
                                  {item.user.first_name +
                                    ' ' +
                                    item.user.last_name}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </>
                  ) : (
                    <div
                      className="quoteBorder mb-5 mx-auto"
                      style={{ width: 400 }}
                    >
                      <div className="m-4">
                        <div
                          className="text-center"
                          style={{ fontSize: 18, fontFamily: 'raleway' }}
                        >
                          There are no quotes available.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h2 className="text">Most recent</h2>
            <div className="mb-5">
              {isLoadingOtherMostRecent ? (
                <div>Loading...</div>
              ) : (
                <>
                  {otherUserMostRecent ? (
                    <>
                      {otherUserMostRecent.data.map(
                        (item: QuoteType, index: number) => (
                          <div
                            className="quoteBorder myQuotes mb-5"
                            key={index}
                            style={{ width: 400 }}
                          >
                            <div className="m-4">
                              <img
                                className="voting"
                                src="/upvote.png"
                                alt="Upvote"
                              />
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.karma}
                              </div>
                              <img
                                className="voting"
                                src="/downvote.png"
                                alt="Downvote"
                              />
                            </div>
                            <div>
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.quote}
                              </div>
                              <div className="authorGrid">
                                <img
                                  className="voting userAvatar"
                                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.user.avatar}`}
                                  alt="User avatar"
                                  width={35}
                                />
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontFamily: 'raleway',
                                  }}
                                >
                                  {item.user.first_name +
                                    ' ' +
                                    item.user.last_name}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </>
                  ) : (
                    <div
                      className="quoteBorder mb-5 mx-auto"
                      style={{ width: 400 }}
                    >
                      <div className="m-4">
                        <div
                          className="text-center"
                          style={{ fontSize: 18, fontFamily: 'raleway' }}
                        >
                          There are no quotes available.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h2 className="text">Liked</h2>
            <div className="mb-5">
              {isLoadingLiked ? (
                <div>Loading...</div>
              ) : (
                <>
                  {otherUserLiked ? (
                    <>
                      {otherUserLiked.data.map(
                        (item: VoteType, index: number) => (
                          <div
                            className="quoteBorder myQuotes mb-5"
                            key={index}
                            style={{ width: 400 }}
                          >
                            <div className="m-4">
                              <img
                                className="voting"
                                src="/upvoted.png"
                                alt="Upvoted"
                              />
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.quote.karma}
                              </div>
                              <img
                                className="voting"
                                src="/downvote.png"
                                alt="Downvote"
                              />
                            </div>
                            <div>
                              <div
                                style={{ fontSize: 18, fontFamily: 'raleway' }}
                              >
                                {item.quote.quote}
                              </div>
                              <div className="authorGrid">
                                <img
                                  className="voting userAvatar"
                                  src={`${process.env.REACT_APP_API_URL}/uploads/${item.quote.user.avatar}`}
                                  alt="User avatar"
                                  width={35}
                                  onPointerMove={() => {
                                    setOtherUserId(item.quote.user.id)
                                  }}
                                  onClick={handleProceedUser}
                                />
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontFamily: 'raleway',
                                  }}
                                >
                                  {item.quote.user.first_name +
                                    ' ' +
                                    item.quote.user.last_name}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </>
                  ) : (
                    <div
                      className="quoteBorder mb-5 mx-auto"
                      style={{ width: 400 }}
                    >
                      <div className="m-4">
                        <div
                          className="text-center"
                          style={{ fontSize: 18, fontFamily: 'raleway' }}
                        >
                          There are no quotes available.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <Button className="btnLogin">Load more</Button>
        </div>
      </div>
    </Layout>
  )
}

export default UserQuotesInfo
