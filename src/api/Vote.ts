import { apiRoutes } from '../constants/apiConstants'
import { VoteType } from '../models/vote'
import { apiRequest } from './Api'

export const createUpvote = async (quoteId: number) =>
  apiRequest<number, void>(
    'post',
    `${apiRoutes.VOTES_PREFIX}/${quoteId}/upvote`,
    quoteId,
  )

export const createDownvote = async (quoteId: number) =>
  apiRequest<number, void>(
    'post',
    `${apiRoutes.VOTES_PREFIX}/${quoteId}/downvote`,
    quoteId,
  )

export const fetchCurrUserVotes = async () =>
  apiRequest<never, VoteType>('get', apiRoutes.ME_VOTES)

export const fetchUserVotes = async (userId: number) =>
  apiRequest<never, VoteType>(
    'get',
    `${apiRoutes.VOTES_PREFIX}/users/${userId}`,
  )
