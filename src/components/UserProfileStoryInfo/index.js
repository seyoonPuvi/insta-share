import './index.css'

const UserProfileStoryInfo = props => {
  const {userProfileDetails, owner} = props

  if (userProfileDetails.stories.length !== 0) {
    return (
      <>
        <ul className="user-profile-story-info-cont">
          {userProfileDetails.stories.map(each => (
            <li className="user-story-cont" key={each.id}>
              <img
                src={each.image}
                alt={`${owner} story`}
                className="user-story-img"
              />
            </li>
          ))}
        </ul>
        <hr className="horiontal-line" />
      </>
    )
  }
  return null
}

export default UserProfileStoryInfo
