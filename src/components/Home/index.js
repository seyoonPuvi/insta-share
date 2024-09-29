import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import Loading from '../Loader'
import Header from '../Header'
import UserStory from '../UserStory'
import SearchContext from '../../context/searchContext'
import SearchedView from '../SearchedView'
import EmptySearchScreen from '../EmptySearchScreen'

import './index.css'

const userStoryApiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const postsApiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    userStoryPostList: [],
    postsList: [],
    userStoryApiStatus: userStoryApiStatusConstants.initial,
    postApiStatus: postsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchUserStoryPostList()
    this.fetchPostsDataList()
  }

  // user story fetching
  onSuccessUserStoryDataFetch = data => {
    const formattedUserStoryList = data.users_stories.map(each => ({
      userId: each.user_id,
      userName: each.user_name,
      storyUrl: each.story_url,
    }))

    this.setState({
      userStoryPostList: formattedUserStoryList,
      userStoryApiStatus: userStoryApiStatusConstants.success,
    })
  }

  fetchUserStoryPostList = async () => {
    this.setState({userStoryApiStatus: userStoryApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const userStoryApiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(userStoryApiUrl, option)
    const responseData = await response.json()

    if (response.ok) {
      this.onSuccessUserStoryDataFetch(responseData)
    } else {
      this.setState({userStoryApiStatus: userStoryApiStatusConstants.failure})
    }
  }

  // user posts data fetching
  onSuccessPostsListDataFetch = data => {
    const formattedPostsList = data.posts.map(each => ({
      postId: each.post_id,
      userId: each.user_id,
      userName: each.user_name,
      profilePic: each.profile_pic,
      postDetails: {
        imageUrl: each.post_details.image_url,
        caption: each.post_details.caption,
      },
      likesCount: each.likes_count,
      comments: each.comments.map(eachComment => ({
        userName: eachComment.user_name,
        userId: eachComment.user_id,
        comment: eachComment.comment,
      })),
      createdAt: each.created_at,
      isLiked: false,
    }))
    this.setState({
      postsList: formattedPostsList,
      postApiStatus: postsApiStatusConstants.success,
    })
  }

  fetchPostsDataList = async () => {
    this.setState({postApiStatus: postsApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const postApiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postApiUrl, option)
    const responseData = await response.json()

    if (response.ok) {
      this.onSuccessPostsListDataFetch(responseData)
    } else {
      this.setState({postApiStatus: postsApiStatusConstants.failure})
    }
  }

  // updating likes api
  onFetchPostLikeApi = async postId => {
    const jwtToken = Cookies.get('jwt_token')
    const {postsList} = this.state

    const post = postsList.find(each => each.postId === postId)

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const option = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: !post.isLiked}),
    }

    const response = await fetch(apiUrl, option)
    const responseData = await response.json()
    console.log(responseData.message)

    if (response.ok) {
      // UPDATING LIKES
      this.setState(prevState => ({
        postsList: prevState.postsList.map(each => {
          if (each.postId === postId) {
            return {
              ...each,
              isLiked: !each.isLiked,
              likesCount: each.isLiked
                ? each.likesCount - 1
                : each.likesCount + 1,
            }
          }
          return each
        }),
      }))
    }
  }

  onClickLikeIcon = postId => {
    this.onFetchPostLikeApi(postId)
  }

  // user story api views

  onRenderUserStoryApiViews = () => {
    const {userStoryApiStatus, userStoryPostList} = this.state

    switch (userStoryApiStatus) {
      case userStoryApiStatusConstants.inProgress:
        return (
          <div className="user-story-loading-container">
            <Loading />
          </div>
        )
      case userStoryApiStatusConstants.success:
        return <UserStory userStoryList={userStoryPostList} />
      case userStoryApiStatusConstants.failure:
        return (
          <div className="userStory-ApiFailure-cont">
            {this.onRenderFailureApi(this.fetchUserStoryPostList)}
          </div>
        )
      default:
        return null
    }
  }

  // user posts api view
  onRenderSuccessPostApiView = () => {
    const {postsList} = this.state

    return (
      <>
        <div className="post-container">
          <ul className="post-main-cont">
            {postsList.map(each => (
              <li key={each.postId} className="post-list-cont">
                <div className="user-profile-logo-and-name-cont">
                  <div className="profile-img-cont">
                    <img
                      src={each.profilePic}
                      className="profile-pic"
                      alt="post author profile"
                    />
                  </div>

                  <Link to={`/users/${each.userId}`}>
                    <p className="profile-name">{each.userName}</p>
                  </Link>
                </div>
                <img
                  src={each.postDetails.imageUrl}
                  alt="post"
                  className="post-image"
                />
                <div className="like-comment-share-cont">
                  <button
                    type="button"
                    className="like-share-comment-btn"
                    onClick={() => this.onClickLikeIcon(each.postId)}
                  >
                    {each.isLiked ? (
                      <FcLike className="like-icon" testid="unLikeIcon" />
                    ) : (
                      <BsHeart className="like-icon" testid="likeIcon" />
                    )}
                  </button>
                  <button type="button" className="like-share-comment-btn">
                    <FaRegComment className="comment-icon like-icon" />
                  </button>
                  <button type="button" className="like-share-comment-btn">
                    <BiShareAlt className="share-icon like-icon" />
                  </button>
                </div>
                <div className="likes-count-caption-cont">
                  <p className="likes-count">{each.likesCount} likes</p>
                  <p className="post-caption">{each.postDetails.caption}</p>
                </div>
                <ul className="comment-list-cont">
                  {each.comments.map(eachComments => (
                    <li className="comment-list" key={eachComments.userId}>
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
                <p className="posted-time">{each.createdAt}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  onRenderPostApiViews = () => {
    const {postApiStatus} = this.state

    switch (postApiStatus) {
      case postsApiStatusConstants.inProgress:
        return (
          <div className="post-loading-container">
            <Loading />
          </div>
        )
      case postsApiStatusConstants.success:
        return this.onRenderSuccessPostApiView()
      case postsApiStatusConstants.failure:
        return (
          <div className="postApiFailure-cont">
            {this.onRenderFailureApi(this.fetchPostsDataList)}
          </div>
        )
      default:
        return null
    }
  }

  onRenderFailureApi = fetchData => (
    <div className="failure-cont">
      <img
        src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727225122/alert-triangle_dlfspo.svg"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button type="button" className="retry-btn" onClick={fetchData}>
        Try again
      </button>
    </div>
  )

  render() {
    return (
      <SearchContext.Consumer>
        {value => {
          const {
            showSearchScreen,
            showSearchedContent,
            searchedDataStatus,
            fetchSearchedPost, // New state for tracking loading status
          } = value

          return (
            <>
              <Header />

              {/* Display loading indicator when search is in progress */}
              {searchedDataStatus === 'IN_PROGRESS' && (
                <div className="post-loading-container">
                  <Loading />
                </div>
              )}

              {/* Show empty search screen if search input is there but no results yet */}
              {showSearchScreen &&
                !showSearchedContent &&
                searchedDataStatus !== 'IN_PROGRESS' && <EmptySearchScreen />}

              {/* Show searched content when search is successful */}
              {searchedDataStatus === 'SUCCESS' && <SearchedView />}

              {/* Show failure view if search fails */}
              {searchedDataStatus === 'FAILURE' &&
                this.onRenderFailureApi(fetchSearchedPost)}

              {/* Show the default home content (user stories and posts) */}
              {!showSearchScreen &&
                !showSearchedContent &&
                searchedDataStatus !== 'IN_PROGRESS' && (
                  <>
                    {this.onRenderUserStoryApiViews()}
                    {this.onRenderPostApiViews()}
                  </>
                )}
            </>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default Home
