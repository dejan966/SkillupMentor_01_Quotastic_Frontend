export type UserType = {
  id: number
  first_name: string
  last_name: string
  email: string
  current_password:string
  password:string
  confirm_password:string
  avatar: string
  quotes:{
    id:number
    karma:number
    quote:string
    posted_when:string
  }
  votes:{
    id:number
    value:boolean
    user:{
      id:number
    }
  }
}