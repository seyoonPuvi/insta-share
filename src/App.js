import {Route, Switch, Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import ProtectedRoute from './components/ProtectedRoute'
import SearchContext from './context/searchContext'
import LoginPage from './components/LoginPage'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import NotFound from './components/NotFound'

import './App.css'

const searchedDataStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    searchInput: '',
    searchedList: [],
    searchedDataStatus: searchedDataStatusConstants.initial,
    showSearchedContent: false,
    activeTabName: '',
    showSearchContainer: false,
    showSearchScreen: false,
  }

  onSuccessSearchedFetchData = data => {
    const formattedPostsList = data.map(each => ({
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
      searchedList: formattedPostsList,
      showSearchedContent: true,
      searchedDataStatus: searchedDataStatusConstants.success,
    })
  }

  fetchSearchedPost = async () => {
    this.setState({
      searchedDataStatus: searchedDataStatusConstants.inProgress,
      showSearchScreen: false,
      searchedList: [],
      showSearchedContent: false,
    })

    const {searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (searchInput !== '') {
      const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
      const option = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      try {
        const response = await fetch(apiUrl, option)
        const responseData = await response.json()

        if (response.ok) {
          this.onSuccessSearchedFetchData(responseData.posts)
        } else {
          // If the response is not ok, update the state to reflect failure
          this.setState({
            showSearchedContent: false,
            searchedDataStatus: searchedDataStatusConstants.failure,
            showSearchScreen: false,
          })
        }
      } catch (error) {
        // Handle any network errors
        console.error('API call failed:', error)
        this.setState({
          showSearchedContent: false,
          searchedDataStatus: searchedDataStatusConstants.failure,
          showSearchScreen: false,
        })
      }
    } else {
      this.setState({
        showSearchedContent: true,
        searchedList: [],
        searchedDataStatus: searchedDataStatusConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    if (event.target.value !== '') {
      this.setState({
        searchInput: event.target.value,
        showSearchScreen: true,
      })
    } else {
      this.setState({
        searchInput: event.target.value,
        showSearchScreen: false,
        showSearchedContent: false,
        searchedDataStatus: searchedDataStatusConstants.initial,
      })
    }
  }

  onClickSearchPostLike = async postId => {
    const {searchedList} = this.state
    // fetchLikeApi respond

    const jwtToken = Cookies.get('jwt_token')
    const post = searchedList.find(each => each.postId === postId)
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
    // updating likes
    if (response.ok) {
      this.setState(prevState => ({
        searchedList: prevState.searchedList.map(each => {
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

  onClickNavItems = name => {
    let activeName = ''

    switch (name) {
      case 'Home':
        activeName = 'Home'
        break
      case 'Profile':
        activeName = 'Profile'
        break
      case 'Search':
        activeName = 'Search'
        break
      default:
        activeName = ''
    }

    this.setState({
      searchInput: '',
      searchedList: [],
      showSearchedContent: false,
      activeTabName: activeName,
      searchedDataStatus: searchedDataStatusConstants.initial,
      showSearchContainer: activeName === 'Search',
    })
  }

  render() {
    const {
      searchInput,
      showSearchedContent,
      searchedList,
      activeTabName,
      searchedDataStatus,
      showSearchContainer,
      showSearchScreen,
    } = this.state
    return (
      <SearchContext.Provider
        value={{
          searchInput,
          searchedList,
          showSearchedContent,
          activeTabName,
          searchedDataStatus,
          showSearchContainer,
          showSearchScreen,
          onChangeSearchInput: this.onChangeSearchInput,
          fetchSearchedPost: this.fetchSearchedPost,
          onClickSearchPostLike: this.onClickSearchPostLike,
          onClickNavItems: this.onClickNavItems,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <Route exact path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
