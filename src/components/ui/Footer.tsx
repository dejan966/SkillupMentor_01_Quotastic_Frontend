import { FC } from 'react'
import quote from '../../images/Quotes.png'

const Footer: FC = () => {
  return (
    <footer className="d-flex justify-content-between align-items-center p-4 footerText">
      <img src={quote} alt="SkillUp Mentor logo" width={33} />
      <p className="fs-4">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer