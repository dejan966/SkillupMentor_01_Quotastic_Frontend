import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="container-xxl d-flex justify-content-between align-items-center p-4">
      <img src="/images/logo.png" alt="SkillUp Mentor" width={123} />
      <p className="fs-4">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer