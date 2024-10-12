import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginPage extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSuccessLogin = jwtToken => {
    this.setState({showError: false})
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    console.log('logged in succesfully')
    history.replace('/')
  }

  onClickLogin = async event => {
    event.preventDefault()

    const {usernameInput, passwordInput} = this.state

    const userDetails = {
      username: usernameInput,
      password: passwordInput,
    }

    const loginApiUrl = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApiUrl, option)
    const responseData = await response.json()

    if (response.ok) {
      this.onSuccessLogin(responseData.jwt_token)
    } else {
      this.setState({errorMsg: responseData.error_msg, showError: true})
    }
  }

  onRenderLeftContainer = () => (
    <div className="left-cont">
      <img
        src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727155424/IllustrationloginImg_vrpmxt.svg"
        alt="website login"
        className="login-page-img"
      />
    </div>
  )

  onRenderRightContainer = () => {
    const {showError, errorMsg, usernameInput, passwordInput} = this.state

    return (
      <div className="right-cont">
        <div className="logo-cont">
          <img
            src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727155437/logo_ogo_mvjq26.svg"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="website-name">Insta Share</h1>
        </div>
        <form className="form-cont" onSubmit={this.onClickLogin}>
          <div className="input-cont">
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="username : rahul"
              onChange={this.onChangeUsername}
              value={usernameInput}
            />
          </div>
          <div className="input-cont">
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Pasword : rahul@2021"
              onChange={this.onChangePassword}
              value={passwordInput}
            />
            {showError && <p className="errorText">{errorMsg}</p>}
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    )
  }

  render() {
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-cont">
        {this.onRenderLeftContainer()}
        {this.onRenderRightContainer()}
      </div>
    )
  }
}

export default LoginPage
