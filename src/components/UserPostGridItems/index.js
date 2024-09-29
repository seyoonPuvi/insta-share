import NoPostYet from '../NoPostYet'
import './index.css'

const UserPostGridItems = props => {
  const {posts, owner} = props

  if (posts.length === 0) {
    return <NoPostYet />
  }

  return (
    <ul className="user-posts-grid-cont">
      {posts.map(each => (
        <li key={each.id} className="grid-image-list">
          <img src={each.image} alt={`${owner} post`} className="grid-image" />
        </li>
      ))}
    </ul>
  )
}

export default UserPostGridItems
