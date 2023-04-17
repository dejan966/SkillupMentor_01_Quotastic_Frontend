import { apiRoutes } from '../constants/apiConstants'
import { UpdateUserFields } from '../hooks/react-hook-form/useCreateUpdateUser'
import { LoginUserFields } from '../hooks/react-hook-form/useLogin'
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister'
import { UserType } from '../models/auth'
import { apiRequest } from './Api'

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>('post', apiRoutes.SIGNUP, data)

export const refreshTokens = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.REFRESH_TOKENS)

export const uploadAvatar = async (formData: FormData, id: number) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )

export const fetchCurrUser = async () =>
  apiRequest<never, UserType>('get', apiRoutes.ME)

export const fetchUser = async (id: number) =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.FETCH_USERS}/${id}`)

export const updateUser = async (data: UpdateUserFields, id: number) =>
  apiRequest<UpdateUserFields, UserType>(
    'patch',
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data,
  )

export const deleteUser = async (id: number) =>
  apiRequest<undefined, UserType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)

export const fetchCurrUserUpvotes = async () =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.ME}/upvotes`)

export const fetchCurrUserUpvotedQuotes = async () =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.ME}/upvoted`)

export const fetchUserUpvotes = async (userId: number) =>
  apiRequest<undefined, UserType>(
    'get',
    `${apiRoutes.FETCH_USERS}/upvotes/${userId}`,
  )

export const fetchUserUpvotedQuotes = async (userId: number) =>
  apiRequest<undefined, UserType>(
    'get',
    `${apiRoutes.FETCH_USERS}/upvoted/${userId}`,
  )

export const updateUserPass = async ({
  current_password,
  password,
  confirm_password,
}: UpdateUserFields) =>
  apiRequest<UpdateUserFields, UserType>(
    'patch',
    `${apiRoutes.ME}/update-password`,
    { current_password, password, confirm_password },
  )

export const updateUserAvatar = async ({ avatar }: UpdateUserFields) =>
  apiRequest<UpdateUserFields, UserType>(
    'patch',
    `${apiRoutes.ME}/update-avatar`,
    { avatar },
  )
