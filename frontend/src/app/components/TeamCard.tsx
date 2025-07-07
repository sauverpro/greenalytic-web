type Props = {
  name: string
  title: string
  bio: string
  imageUrl: string
}

export default function TeamCard({ name, title, bio, imageUrl }: Props) {
  return (
    <div className="card h-100 text-center">
      <img src={imageUrl} alt={name} className="card-img-top" style={{ objectFit: 'cover', height: 250 }} />
      <div className="card-body">
        <h5 className="card-title fw-bold">{name}</h5>
        <p className="text-muted">{title}</p>
        <p className="card-text">{bio}</p>
      </div>
    </div>
  )
}
