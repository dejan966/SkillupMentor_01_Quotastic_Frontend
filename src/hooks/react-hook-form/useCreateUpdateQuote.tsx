import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { QuoteType } from 'models/quote'

export interface CreateQuoteFields {
  quote:string
}

export interface UpdateQuoteFields {
  quote?:string
  karma?:number
}

interface Props {
  defaultValues?: QuoteType
}

export const useCreateUpdateQuoteForm = ({ defaultValues }: Props) => {
  const CreateQuoteSchema = Yup.object().shape({
    quote: Yup.string().required(),
  })

  const UpdateQuoteSchema = Yup.object().shape({
    quote: Yup.string().notRequired(),
    karma: Yup.number().notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      quote: defaultValues?.quote,
      ...defaultValues
    },
    mode: 'onSubmit',
    resolver: defaultValues
      ? yupResolver(UpdateQuoteSchema)
      : yupResolver(CreateQuoteSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateQuoteForm = ReturnType<typeof useCreateUpdateQuoteForm>