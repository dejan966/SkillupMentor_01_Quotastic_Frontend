import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="d-flex justify-content-between p-3 footer">
      <img src="quotes.png" alt="Quotes" width={33} />
      <p className="fs-6 align-items-center">All rights received | skillupmentor.com</p>
    </footer>
  )
}

export default Footer