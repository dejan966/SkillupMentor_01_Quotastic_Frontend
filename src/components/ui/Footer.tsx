import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="container-xxl justify-content-between align-items-center p-4">
        <img src="/quotes.png" alt="Quotes" width={33} />
        <p className="fs-6" style={{ float: 'right' }}>
          All rights received | skillupmentor.com
        </p>
      </div>
    </footer>
  )
}

export default Footer
