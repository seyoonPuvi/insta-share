import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loading from '../Loader'
import UserProfileInfo from '../UserProfileInfo'
import UserProfileStoryInfo from '../UserProfileStoryInfo'
import UserProfilePostsInfo from '../UserProfilePostsInfo'
import SearchContext from '../../context/searchContext'
import SearchedView from '../SearchedView'
import EmptySearchScreen from '../EmptySearchScreen'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userProfileDetails: {},
  }

  componentDidMount() {
    this.fetchUserProfileData()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {params} = match
    const {id} = params

    // Check if the current ID in the URL is different from the previous one
    if (prevProps.match.params.id !== id) {
      this.fetchUserProfileData(id)
    }
  }

  onSuccessUserProfileDataFetch = data => {
    const formattedUserDetails = {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      profilePic: data.profile_pic,
      followersCount: data.followers_count,
      followingCount: data.following_count,
      userBio: data.user_bio,
      postsCount: data.posts_count,
      posts: data.posts.map(each => ({
        id: each.id,
        image: each.image,
      })),
      stories: data.stories.map(each => ({
        id: each.id,
        image: each.image,
      })),
    }

    this.setState({
      userProfileDetails: formattedUserDetails,
      apiStatus: apiStatusConstants.success,
    })
  }

  fetchUserProfileData = async updatedId => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(`id:${id}`)

    const activeId = updatedId || id

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${activeId}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, option)
    const responseData = await response.json()

    if (response.ok) {
      this.onSuccessUserProfileDataFetch(responseData.user_details)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRenderSuccessApiView = () => {
    const {userProfileDetails} = this.state
    return (
      <>
        <UserProfileInfo userProfileDetails={userProfileDetails} owner="user" />
        <UserProfileStoryInfo
          userProfileDetails={userProfileDetails}
          owner="user"
        />
        <UserProfilePostsInfo
          userProfileDetails={userProfileDetails}
          owner="user"
        />
      </>
    )
  }

  onRenderFailureApiView = () => (
    <div className="failure-cont">
      <img
        src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727225122/alert-triangle_dlfspo.svg"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.fetchUserProfileData}
      >
        Try again
      </button>
    </div>
  )

  onRenderLoadingApiView = () => (
    <div className="loading-cont">
      <Loading />
    </div>
  )

  onRenderApiViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.onRenderLoadingApiView()
      case apiStatusConstants.success:
        return this.onRenderSuccessApiView()
      case apiStatusConstants.failure:
        return this.onRenderFailureApiView()
      default:
        return null
    }
  }

  render() {
    return (
      <SearchContext.Consumer>
        {value => {
          const {
            showSearchScreen,
            showSearchedContent,
            searchedDataStatus, // New state for tracking loading status
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

              {/* Show the default home content (user stories and posts) */}
              {!showSearchScreen &&
                !showSearchedContent &&
                searchedDataStatus !== 'IN_PROGRESS' && (
                  <div className="user-profile-cont">
                    <div className="user-profile-main-cont">
                      {this.onRenderApiViews()}
                    </div>
                  </div>
                )}
            </>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default UserProfile
