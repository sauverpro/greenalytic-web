'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="top-navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand fw-bold" href="/">Greenalytic</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/about">About Us</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/products">Products</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/team">Our Team</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
