import { apiRoutes } from '../constants/apiConstants'
import { QuoteType } from '../models/quote'
import { apiRequest } from './Api'

export const fetchQuotes = async () =>
  apiRequest<undefined, QuoteType>('post', apiRoutes.FETCH_QUOTES)