import React, { useState } from "react"
import Seo from "../components/common/seo"

import allPosts from "../posts.json"

import AppContainer from "../components/common/app-container"
import PostsList from "../components/common/posts-list"
import Footer from "../components/common/footer"
import FastScrollButton from "../components/common/fast-scroll-button"
import ToggleThemeButton from "../components/common/toggle-theme-button"
import ScrollIndicator from "../components/common/scroll-indicator"
import AboutPosts from "../components/search/about-posts"
import FilterArea from "../components/search/filter-area"
import MainContainer from "../components/common/main-container"
import QuickNavigationButton from "../components/common/quick-navigation-button"
import SearchResult from "../components/search/search-result"

const SearchLayout = () => {
  const [posts, filterPosts] = useState(allPosts.posts)

  return (
    <>
      <Seo title="Search"></Seo>
      <AppContainer>
        <MainContainer>
          <AboutPosts />
          <FilterArea filterPosts={filterPosts} allPosts={allPosts} />
        </MainContainer>
        <MainContainer>
          <SearchResult posts={posts} />
        </MainContainer>
        <Footer />

        <FastScrollButton />
        <ToggleThemeButton />
        <ScrollIndicator />
        <QuickNavigationButton />
      </AppContainer>
    </>
  )
}

export default SearchLayout
