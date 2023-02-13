import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateQuoteFields {
  quote?:string
}

export interface UpdateQuoteFields {
  quote?:string
}

export const useCreateUpdateQuoteForm = () => {
  const CreateUserSchema = Yup.object().shape({
    quote: Yup.string().notRequired(),
  })

  const UpdateQuoteSchema = Yup.object().shape({
    quote: Yup.string().notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      //old quote value
      // ...defaultValues,
    },
    mode: 'onSubmit',
/*     resolver: defaultValues
      ? yupResolver(UpdateUserSchema)
      : yupResolver(CreateUserSchema), */
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateQuoteForm = ReturnType<typeof useCreateUpdateQuoteForm>