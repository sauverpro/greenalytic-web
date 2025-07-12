type Props = {
  title: string
  excerpt: string
  date: string
  link: string
}

export default function BlogItem({ title, excerpt, date, link }: Props) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="card-text">{excerpt}</p>
      </div>
      <div className="card-footer bg-transparent">
        <small className="text-muted">{new Date(date).toLocaleDateString()}</small>
        <a href={link} className="btn btn-link float-end">Read More</a>
      </div>
    </div>
  )
}
