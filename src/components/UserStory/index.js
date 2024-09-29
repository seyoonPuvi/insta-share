import Slider from 'react-slick'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 660,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
}

const UserStory = props => {
  const {userStoryList} = props

  return (
    userStoryList.length !== 0 && (
      <>
        <div className="main-container">
          <div className="slick-container">
            <Slider {...settings}>
              {userStoryList.map(eachStory => {
                const {storyUrl, userId, userName} = eachStory
                return (
                  <div className="slick-item" key={userId}>
                    <div className="story-item">
                      <img
                        className="story-image"
                        src={storyUrl}
                        alt="user story"
                      />
                      <p className="story-user-name marquee">
                        <span>{userName}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      </>
    )
  )
}

export default UserStory
