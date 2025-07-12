const partners = [
  '/logos/ncst.png',
  '/logos/cmu.png',
  '/logos/rem.png',
  '/logos/mastercard.png',
  '/logos/ict.png'
]

export default function PartnerLogos() {
  return (
    <section className="py-5 bg-light text-center">
      <div className="container">
        <h3 className="mb-4">Our Partners</h3>
        <div className="row justify-content-center align-items-center">
          {partners.map((logo, index) => (
            <div key={index} className="col-4 col-md-2 mb-3">
              <img src={logo} alt="Partner Logo" className="img-fluid" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
