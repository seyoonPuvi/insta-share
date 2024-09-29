import {BsGrid3X3} from 'react-icons/bs'
import UserPostGridItems from '../UserPostGridItems'
import './index.css'

const UserProfilePostsInfo = props => {
  const {userProfileDetails, owner} = props
  const {posts} = userProfileDetails

  return (
    <div className="user-posts-cont">
      <div className="post-icon-cont">
        <BsGrid3X3 className="post-grid-icon" />
        <h1 className="post-heading">Posts</h1>
      </div>
      <UserPostGridItems posts={posts} owner={owner} />
    </div>
  )
}

export default UserProfilePostsInfo
