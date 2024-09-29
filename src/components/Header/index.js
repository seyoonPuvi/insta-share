import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import {RiCloseCircleFill} from 'react-icons/ri'
import SearchContext from '../../context/searchContext'
import './index.css'

class Header extends Component {
  state = {
    showMobileNavContainer: false,
  }

  toggleOnMobileNavContainer = () => {
    this.setState({showMobileNavContainer: true})
  }

  toggleOffMobileNavContainer = () => {
    this.setState({showMobileNavContainer: false})
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onRenderMobileNav = () => (
    <SearchContext.Consumer>
      {value => {
        const {onClickNavItems, activeTabName} = value

        return (
          <div className="mobile-nav-cont">
            <div className="mobile-nav">
              <Link to="/" onClick={() => onClickNavItems('Home')}>
                <p
                  className={`nav-items-list ${
                    activeTabName === 'Home' ? 'active' : null
                  }`}
                >
                  Home
                </p>
              </Link>
              <p
                className={`nav-items-list ${
                  activeTabName === 'Search' ? 'active' : null
                }`}
                onClick={() => {
                  onClickNavItems(activeTabName === 'Search' ? null : 'Search')
                }}
              >
                Search
              </p>
              <Link to="/my-profile" onClick={() => onClickNavItems('Profile')}>
                <p
                  className={`nav-items-list ${
                    activeTabName === 'Profile' ? 'active' : null
                  }`}
                >
                  Profile
                </p>
              </Link>
              <button
                type="button"
                className="logout-btn"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
              <button
                type="button"
                className="close-icon-btn"
                onClick={() => {
                  this.toggleOffMobileNavContainer()
                  onClickNavItems('')
                }}
              >
                <RiCloseCircleFill className="close-icon" />
              </button>
            </div>
          </div>
        )
      }}
    </SearchContext.Consumer>
  )

  onRenderMobileSearchContainer = () => (
    <SearchContext.Consumer>
      {value => {
        const {searchInput, onChangeSearchInput, fetchSearchedPost} = value

        return (
          <div className="mobile-search-cont">
            <input
              type="search"
              placeholder="Search Caption"
              className="searchInput"
              value={searchInput}
              onChange={onChangeSearchInput}
            />
            <button
              type="button"
              className="search-btn"
              onClick={fetchSearchedPost}
              testid="searchIcon"
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
        )
      }}
    </SearchContext.Consumer>
  )

  render() {
    const {showMobileNavContainer} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {
            searchInput,
            onChangeSearchInput,
            fetchSearchedPost,
            onClickNavItems,
            activeTabName,
            showSearchContainer,
          } = value
          return (
            <>
              <div className="header">
                <div className="main-cont">
                  <div className="website-logo-cont">
                    <Link to="/">
                      <img
                        src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727155437/logo_ogo_mvjq26.svg"
                        alt="website logo"
                        className="website-logo"
                      />
                    </Link>
                    <h1 className="website-name">Insta Share</h1>
                  </div>
                  <div className="nav-cont">
                    <div className="search-cont">
                      <input
                        type="search"
                        placeholder="Search Caption"
                        className="searchInput"
                        value={searchInput}
                        onChange={onChangeSearchInput}
                      />
                      <button
                        type="button"
                        className="search-btn"
                        onClick={fetchSearchedPost}
                        testid="searchIcon"
                      >
                        <FaSearch className="search-icon" />
                      </button>
                    </div>
                    <ul className="nav-items-list-cont">
                      <Link to="/" onClick={() => onClickNavItems('Home')}>
                        <li
                          className={`nav-items-list ${
                            activeTabName === 'Home' ? 'active' : null
                          }`}
                        >
                          Home
                        </li>
                      </Link>
                      <Link
                        to="/my-profile"
                        onClick={() => onClickNavItems('Profile')}
                      >
                        <li
                          className={`nav-items-list ${
                            activeTabName === 'Profile' ? 'active' : null
                          }`}
                        >
                          Profile
                        </li>
                      </Link>
                      <li className="nav-items-list">
                        <button
                          className="logout-btn"
                          type="button"
                          onClick={this.onClickLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="hamburger-btn"
                    onClick={this.toggleOnMobileNavContainer}
                  >
                    <GiHamburgerMenu className="hamburger-icon" />
                  </button>
                </div>
              </div>
              {showMobileNavContainer && this.onRenderMobileNav()}
              {showSearchContainer && this.onRenderMobileSearchContainer()}
            </>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default withRouter(Header)
