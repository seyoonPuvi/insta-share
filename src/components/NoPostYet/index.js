import {BiCamera} from 'react-icons/bi'
import './index.css'

const NoPostYet = () => (
  <div className="no-post-cont">
    <div className="no-post-icon-cont">
      <BiCamera className="no-post-icon" />
    </div>
    <h1 className="no-post-heading">No Posts</h1>
  </div>
)

export default NoPostYet
