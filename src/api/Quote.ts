import { apiRoutes } from '../constants/apiConstants'
import { CreateQuoteFields, UpdateQuoteFields } from '../hooks/react-hook-form/useCreateUpdateQuote'
import { QuoteType } from '../models/quote'
import { apiRequest } from './Api'

export const fetchQuotes = async () =>
  apiRequest<undefined, QuoteType>('get', apiRoutes.FETCH_QUOTES)

export const fetchQuote = async (id:number) =>
  apiRequest<undefined, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/${id}`)

export const fetchRandomQuote = async () =>
  apiRequest<undefined, QuoteType>('get', apiRoutes.FETCH_RANDOM_QUOTE)

export const createQuote = async (data: CreateQuoteFields) =>
apiRequest<CreateQuoteFields, void>('post', apiRoutes.USERS_PREFIX, data)

export const updateQuote = async (data: UpdateQuoteFields, id: number) =>
  apiRequest<UpdateQuoteFields, QuoteType>(
    'patch',
    `${apiRoutes.QUOTES_PREFIX}/${id}`,
    data
  )

export const deleteQuote = async (id: number) =>
  apiRequest<string, QuoteType>('delete', `${apiRoutes.QUOTES_PREFIX}/${id}`)