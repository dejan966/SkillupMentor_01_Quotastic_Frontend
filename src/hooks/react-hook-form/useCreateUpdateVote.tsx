import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { VoteType } from '../../models/vote'

export interface CreateVoteFields {
  value:boolean
  quote:{
    id:number
  }
}

export interface UpdateVoteFields {
  value?:boolean
}

interface Props {
  defaultValues?: VoteType
}

export const useCreateUpdateVoteForm = ({ defaultValues }: Props) => {
  const CreateVoteSchema = Yup.object().shape({
    value: Yup.boolean().required(),
  })

  const UpdateVoteSchema = Yup.object().shape({
    value: Yup.boolean().notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      value: false,
      ...defaultValues
    },
    mode: 'onSubmit',
    resolver: defaultValues
      ? yupResolver(UpdateVoteSchema)
      : yupResolver(CreateVoteSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateVoteForm = ReturnType<typeof useCreateUpdateVoteForm>