import './index.css'

const UserProfileInfo = props => {
  const {userProfileDetails, owner} = props
  const {
    profilePic,
    userName,
    followersCount,
    followingCount,
    postsCount,
    userBio,
    userId,
  } = userProfileDetails

  return (
    <>
      <div className="user-profile-info-cont">
        <img
          src={profilePic}
          alt={`${owner} profile`}
          className="user-profile-pic"
        />
        <div className="about-user">
          <h1 className="user-name">{userName}</h1>
          <div className="about-user-cont">
            <img
              src={profilePic}
              alt={`${owner} profile`}
              className="user-profile-pic-mobile"
            />
            <ul className="user-profile-stats-cont">
              <li className="user-post-count">
                <h1 className="user-stats-heading">{postsCount}</h1>
                <p className="user-post-count-text">posts</p>
              </li>
              <li className="user-post-count">
                <h1 className="user-stats-heading">{followersCount}</h1>
                <p className="user-post-count-text">followers</p>
              </li>
              <li className="user-post-count">
                <h1 className="user-stats-heading">{followingCount}</h1>
                <p className="user-post-count-text">following</p>
              </li>
            </ul>
          </div>
          <p className="user-id">{userId}</p>
          <p className="user-bio-info">{userBio}</p>
        </div>
      </div>
    </>
  )
}

export default UserProfileInfo
