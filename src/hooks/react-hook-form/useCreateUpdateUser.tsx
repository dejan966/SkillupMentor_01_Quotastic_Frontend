import { yupResolver } from '@hookform/resolvers/yup'
import { UserType } from '../../models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
}

export interface UpdateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
}

interface Props {
  defaultValues?: UserType
}

export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must have atleast one number, lower or upper case letter and it has to be longer than five characters',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Passwords do not match'),
  })

  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string().notRequired(),
    last_name: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string().notRequired(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: defaultValues
      ? yupResolver(UpdateUserSchema)
      : yupResolver(CreateUserSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateUserForm = ReturnType<typeof useCreateUpdateUserForm>