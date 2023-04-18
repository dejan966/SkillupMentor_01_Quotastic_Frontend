import { apiRoutes } from '../constants/apiConstants'
import { CreateQuoteFields, UpdateQuoteFields } from '../hooks/react-hook-form/useCreateUpdateQuote'
import { QuoteType } from '../models/quote'
import { apiRequest } from './Api'

export const fetchQuotes = async () =>
  apiRequest<undefined, QuoteType>('get', apiRoutes.FETCH_QUOTES)

export const fetchQuote = async (id:number) =>
  apiRequest<undefined, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/${id}`)

export const fetchRandomQuote = async () =>
  apiRequest<undefined, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/random`)

export const fetchCurrUserQuotes = async () =>
  apiRequest<never, QuoteType>('get', `${apiRoutes.ME_QUOTES}`)

export const fetchUserMostLikedQuotes = async (id:number)=>
  apiRequest<never, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/mostLiked/users/${id}`)

export const fetchUserMostRecentQuotes = async (userId:number) =>
  apiRequest<never, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/recent/users/${userId}`)

export const usersMostRecentQuotes = async () => 
  apiRequest<never, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/recent`)

export const usersMostLikedQuotes = async () => 
  apiRequest<never, QuoteType>('get', `${apiRoutes.FETCH_QUOTES}/mostLiked`)

export const createQuote = async (data: CreateQuoteFields) =>
apiRequest<CreateQuoteFields, void>('post', apiRoutes.QUOTES_PREFIX, data)

export const updateQuote = async (data: UpdateQuoteFields, id: number) =>
  apiRequest<UpdateQuoteFields, QuoteType>(
    'patch',
    `${apiRoutes.QUOTES_PREFIX}/${id}`,
    data
  )

export const deleteQuote = async (id: number) =>
  apiRequest<string, QuoteType>('delete', `${apiRoutes.QUOTES_PREFIX}/${id}`)