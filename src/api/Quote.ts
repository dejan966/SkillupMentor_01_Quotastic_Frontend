import { apiRoutes } from '../constants/apiConstants'
import { QuoteType } from '../models/auth'
import { apiRequest } from './Api'

export const fetchUserQuotes = async () =>
  apiRequest<undefined, QuoteType>('post', apiRoutes.FETCH_QUOTES)