import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { Button } from 'react-bootstrap'
import { QuoteType } from 'models/quote'
import { VoteType } from 'models/vote'
import authStore from 'stores/auth.store'
import { useNavigate } from 'react-router-dom'
import QuoteBlock from 'pages/QuoteBlock'

const UserQuotesInfo: FC = () => {
  const [otherUserId, setOtherUserId] = useState(1)
  const navigate = useNavigate()

  const [allQuotes, setAllQuotes] = useState<QuoteType[]>([])
  const [likedStroke, setLikedStroke] = useState<string[]>([])
  const [dislikedStroke, setDislikedStroke] = useState<string[]>([])

  const userId = authStore.user?.id as number

  const grabQuotes = (data: any) => {
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i]?.votes[0]) {
        if (data.data[i].votes[0].value === true) {
          likedStroke.push('#DE8667')
          dislikedStroke.push('black')
        } else if (data.data[i].votes[0].value === false) {
          likedStroke.push('black')
          dislikedStroke.push('#DE8667')
        }
      } else {
        likedStroke.push('black')
        dislikedStroke.push('black')
      }
      allQuotes.push(data.data[i])
    }
    setLikedStroke(likedStroke)
    setDislikedStroke(dislikedStroke)
    setAllQuotes(allQuotes)
  }

  useQuery(['allQuotesUserInfo'], () => API.fetchQuotes(), {
    onSuccess(data) {
      grabQuotes(data)
    },
    refetchOnWindowFocus: false,
  })

  const { data: mostLiked, isLoading: isLoadingMostLiked } = useQuery(
    ['currUserMostLikedQuotes'],
    () => API.fetchUserMostLikedQuotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: mostRecent, isLoading: isLoadingMostRecent } = useQuery(
    ['currUserMostRecentQuotes'],
    () => API.fetchUserMostRecentQuotes(userId),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: liked, isLoading: isLoadingLiked } = useQuery(
    ['currUserLikes'],
    () => API.fetchCurrUserVotes(),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const handleProceedUser = () => {
    navigate(`../users/${otherUserId}/quotes`)
  }

  return (
    <Layout>
      <div>
        <div className="quoteRow mb-5">
          <div>
            <h2 className="red">Most liked quotes</h2>
            <div className="mb-5">
              {isLoadingMostLiked ? (
                <div>Loading...</div>
              ) : (
                <>
                  {mostLiked ? (
                    <>
                      {mostLiked.data.map((item: QuoteType, index: number) => (
                        <QuoteBlock
                          key={index}
                          userQuote={item}
                          quotes={allQuotes}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text text-center">No quotes available</div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <h2 className="text">Most recent</h2>
            <div className="mb-5">
              {isLoadingMostRecent ? (
                <div>Loading...</div>
              ) : (
                <>
                  {mostRecent ? (
                    <div>
                      {mostRecent.data.map((item: QuoteType, index: number) => (
                        <QuoteBlock
                          key={index}
                          userQuote={item}
                          quotes={allQuotes}
                        />
                      ))}
                    </div>
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
                  {liked ? (
                    <>
                      {liked.data.map((item: VoteType, index: number) => (
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
                              <>
                                {item.quote.user ? (
                                  <>
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
                                  </>
                                ) : (
                                  <>
                                    <img
                                      className="voting userAvatar"
                                      src={`${process.env.REACT_APP_API_URL}/uploads/Blank-Avatar.jpg`}
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
                                      Unknown
                                    </div>
                                  </>
                                )}
                              </>
                            </div>
                          </div>
                        </div>
                      ))}
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
