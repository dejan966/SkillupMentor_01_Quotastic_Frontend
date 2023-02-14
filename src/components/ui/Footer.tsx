import { FC } from 'react'
import quote from '../../images/Quotes.png'

const Footer: FC = () => {
  return (
    <footer className="d-flex justify-content-between p-3 footer">
      <img src={quote} alt="SkillUp Mentor logo" width={33} />
      <p className="fs-6 align-items-center">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer