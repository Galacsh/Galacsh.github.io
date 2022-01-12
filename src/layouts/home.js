import React from "react"
import Seo from "../components/common/seo"

import AppContainer from "../components/common/app-container"
import MainContainer from "../components/common/main-container"
import Profile from "../components/home/profile"
import Intro from "../components/home/intro"
import SearchPostsButton from "../components/home/search-posts-button"
import AllPosts from "../components/home/all-posts"
import Footer from "../components/common/footer"
import FastScrollButton from "../components/common/fast-scroll-button"
import ToggleThemeButton from "../components/common/toggle-theme-button"
import ScrollIndicator from "../components/common/scroll-indicator"
import QuickNavigationButton from "../components/common/quick-navigation-button"

const HomeLayout = () => {
  return (
    <>
      <Seo title="Home"></Seo>
      <AppContainer>
        <MainContainer>
          <Profile />
          <Intro />
          <SearchPostsButton />
        </MainContainer>
        <MainContainer>
          <AllPosts />
        </MainContainer>
        <Footer />

        <FastScrollButton />
        <ToggleThemeButton />
        <ScrollIndicator />
        <QuickNavigationButton isHome={true} />
      </AppContainer>
    </>
  )
}

export default HomeLayout
