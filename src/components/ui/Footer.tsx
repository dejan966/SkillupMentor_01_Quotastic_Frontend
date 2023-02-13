import { FC } from 'react'
import quote from '../../images/Quotes.png'

const Footer: FC = () => {
  return (
    <footer  className="d-flex justify-content-between align-items-center p-3 footerText">
      <img src={quote} alt="SkillUp Mentor logo" width={33} />
      <p className="fs-6 align-items-center">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer