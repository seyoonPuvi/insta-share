import './index.css'

const NotFound = props => {
  const {history} = props

  const onClickHomePageBtn = () => {
    history.replace('/')
  }

  return (
    <div className="not-found-cont">
      <img
        src="https://res.cloudinary.com/djiwbtd1u/image/upload/v1727442873/erroring_1_oxk0qq.svg"
        alt="page not found"
        className="not-found-img"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-text">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button
        type="button"
        onClick={onClickHomePageBtn}
        className="not-found-btn"
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound
