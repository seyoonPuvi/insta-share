import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import SearchContext from '../../context/searchContext'
import NoSearchContent from '../NoSearchContent'
import Loading from '../Loader'
import './index.css'

const SearchedView = () => (
  <SearchContext.Consumer>
    {value => {
      const {
        searchedList,
        showSearchedContent,
        onClickSearchPostLike,
        searchedDataStatus,
        fetchSearchedPost,
        onClickNavItems,
      } = value

      const onRenderSuccessSearchedView = () => {
        if (searchedList.length === 0 && showSearchedContent) {
          return <NoSearchContent />
        }
        return (
          <div className="searched-post-container">
            <h1 className="search-text-heading">Search Results</h1>
            <ul className="searched-post-main-cont">
              {searchedList.map(each => (
                <li key={each.postId} className="post-list-cont">
                  <div className="searched-user-profile-logo-and-name-cont">
                    <div className="searched-profile-img-cont">
                      <img
                        src={each.profilePic}
                        className="searched-profile-pic"
                        alt="post author profile"
                      />
                    </div>

                    <Link
                      to={`/users/${each.userId}`}
                      onClick={() => onClickNavItems('')}
                    >
                      <span className="searched-profile-name">
                        {each.userName}
                      </span>
                    </Link>
                  </div>
                  <img
                    src={each.postDetails.imageUrl}
                    alt="post"
                    className="searched-post-image"
                  />
                  <div className="searched-like-comment-share-cont">
                    <button
                      type="button"
                      className="searched-like-share-comment-btn"
                      onClick={() => onClickSearchPostLike(each.postId)}
                    >
                      {each.isLiked ? (
                        <FcLike
                          className="searched-like-icon"
                          testid="unLikeIcon"
                        />
                      ) : (
                        <BsHeart
                          className="searched-like-icon"
                          testid="likeIcon"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      className="searched-like-share-comment-btn"
                    >
                      <FaRegComment className="searched-comment-icon like-icon" />
                    </button>
                    <button
                      type="button"
                      className="searched-like-share-comment-btn"
                    >
                      <BiShareAlt className="searched-share-icon like-icon" />
                    </button>
                  </div>
                  <div className="searched-likes-count-caption-cont">
                    <p className="searched-likes-count">
                      {each.likesCount} likes
                    </p>
                    <p className="searched-post-caption">
                      {each.postDetails.caption}
                    </p>
                  </div>
                  <ul className="searched-comment-list-cont">
                    {each.comments.map(eachComments => (
                      <li
                        className="searched-comment-list"
                        key={eachComments.userId}
                      >
                        <div className="comment-cont">
                          <span className="searched-commented-user-name">
                            {eachComments.userName}
                          </span>
                          <p className="searched-comment">
                            {eachComments.comment}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="searched-posted-time">{each.createdAt}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      }

      const onRenderFailureSearchedView = () => (
        <div className="searched-failure-cont">
          <img
            src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727225122/alert-triangle_dlfspo.svg"
            alt="failure view"
            className="searched-failure-img"
          />
          <p className="searched-failure-text">
            Something went wrong. Please try again
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={fetchSearchedPost}
          >
            Try again
          </button>
        </div>
      )

      const onRenderLoading = () => (
        <div className="searched-cont-loading" testid="loader">
          <Loading />
        </div>
      )

      const onRenderSearchedApiViews = () => {
        switch (searchedDataStatus) {
          case 'IN_PROGRESS':
            return onRenderLoading()
          case 'SUCCESS':
            return onRenderSuccessSearchedView()
          case 'FAILURE':
            return onRenderFailureSearchedView()
          default:
            return null
        }
      }

      return <>{onRenderSearchedApiViews()}</>
    }}
  </SearchContext.Consumer>
)

export default SearchedView
