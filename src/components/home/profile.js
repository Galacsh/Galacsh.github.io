import React from "react"

import profileImageSrc from "../../images/profile.png"

const Profile = () => {
  return (
    <div className="profile-area col justify-content-center align-items-center mx-10 pt-100 mb-100">
      <div className="col justify-content-center">
        <div className="col align-items-center">
          <img
            className="profile-img mb-10"
            src={profileImageSrc}
            alt="Profile"
          />
          <h1 className="profile-name text-30 font-700">Galacsh</h1>
          <h2 className="profile-mail text-10 font-400">
            galacsh.dev@gmail.com
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Profile
