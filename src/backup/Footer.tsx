import React from 'react'
import { FC } from 'react'
import quote from '../../images/Quotes.png'

const Footer: FC = () => {
  return (
    <footer className="container-xxl d-flex justify-content-between align-items-center p-4">
      <img src={quote} alt="SkillUp Mentor logo" width={123} />
      <p className="fs-4">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer