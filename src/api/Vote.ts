import { apiRoutes } from '../constants/apiConstants'
import { CreateQuoteFields, UpdateQuoteFields } from '../hooks/react-hook-form/useCreateUpdateQuote'
import { UpdateVoteFields } from '../hooks/react-hook-form/useCreateUpdateVote'
import { QuoteType } from '../models/quote'
import { VoteType } from '../models/vote'
import { apiRequest } from './Api'

export const createVote = async (data: CreateQuoteFields) =>
apiRequest<CreateQuoteFields, void>('post', apiRoutes.VOTES_PREFIX, data)

export const updateVote = async (data: UpdateVoteFields, id: number) =>
  apiRequest<UpdateVoteFields, VoteType>(
    'patch',
    `${apiRoutes.VOTES_PREFIX}/${id}`,
    data
  )

export const fetchCurrUserVotes = async () =>
  apiRequest<never, VoteType>('get', apiRoutes.ME_VOTES)

export const fetchUserVotes = async (userId:number) =>
  apiRequest<never, VoteType>('get', `${apiRoutes.VOTES_PREFIX}/users/${userId}`)

export const deleteVote = async (id: number) =>
  apiRequest<string, VoteType>('delete', `${apiRoutes.VOTES_PREFIX}/${id}`)