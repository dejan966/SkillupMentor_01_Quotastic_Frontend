import { apiRoutes } from '../constants/apiConstants'
import { CreateQuoteFields, UpdateQuoteFields } from '../hooks/react-hook-form/useCreateUpdateQuote'
import { QuoteType } from '../models/quote'
import { apiRequest } from './Api'

export const createVote = async (data: CreateQuoteFields) =>
apiRequest<CreateQuoteFields, void>('post', apiRoutes.USERS_PREFIX, data)

export const updateVote = async (data: UpdateQuoteFields, id: number) =>
  apiRequest<UpdateQuoteFields, QuoteType>(
    'patch',
    `${apiRoutes.QUOTES_PREFIX}/${id}`,
  )

export const deleteVote = async (id: number) =>
  apiRequest<string, QuoteType>('delete', `${apiRoutes.QUOTES_PREFIX}/${id}`)