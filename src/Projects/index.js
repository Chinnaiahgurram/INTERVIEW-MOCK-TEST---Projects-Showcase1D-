import './index.css'

const Projects = props => {
  const {projects} = props
  const {imageUrl, name} = projects
  return (
    <li className="list">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name">{name}</p>
    </li>
  )
}
export default Projects
