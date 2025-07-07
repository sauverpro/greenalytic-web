'use client'

export default function ContactForm() {
  return (
    <form className="row g-3">
      <div className="col-md-6">
        <input type="text" className="form-control" placeholder="Full Name" required />
      </div>
      <div className="col-md-6">
        <input type="email" className="form-control" placeholder="Email Address" required />
      </div>
      <div className="col-12">
        <input type="text" className="form-control" placeholder="Subject" />
      </div>
      <div className="col-12">
        <textarea className="form-control" rows={5} placeholder="Your Message" required></textarea>
      </div>
      <div className="col-12 text-center">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  )
}
