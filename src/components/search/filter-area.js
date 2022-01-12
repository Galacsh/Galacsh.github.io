import React, { useEffect, useState } from "react"

const FilterArea = ({ filterPosts, allPosts }) => {
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [titleInput, setTitleInput] = useState()

  useEffect(() => {
    let filtered = allPosts.posts
    if (selectedTags.size !== 0) {
      filtered = filtered.filter(
        post => post.tags?.find(tag => selectedTags.has(tag)) != null
      )
    }
    if (titleInput != null && titleInput !== "") {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(titleInput.toLowerCase())
      )
    }
    filterPosts(filtered)
  }, [selectedTags, allPosts, filterPosts, titleInput])

  return (
    <div className={"mx-10 mb-50 filter-area"}>
      <div className={"mb-10"}>
        <input
          type="text"
          placeholder="Title to search..."
          className="pa-05 text-10 title-filter"
          onChange={e => {
            setTitleInput(e.target.value.trim())
          }}
        />
      </div>
      <div className="tag-filter">
        {allPosts.tags.map((tag, idx) => (
          <TagButton
            key={"tag-" + idx}
            isActive={isTagActive(selectedTags, tag)}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            tagName={tag}
          />
        ))}
      </div>
    </div>
  )
}

const isTagActive = (selectedTags, tag) => {
  return selectedTags.has(tag)
}

const TagButton = ({ isActive, setSelectedTags, selectedTags, tagName }) => {
  const toggleTag = () => {
    if (isActive) {
      selectedTags.delete(tagName)
      setSelectedTags(new Set([...selectedTags]))
    } else {
      setSelectedTags(new Set([...selectedTags, tagName]))
    }
  }

  return (
    <span onClick={toggleTag} className={"tag" + (isActive ? " active" : "")}>
      {tagName}
    </span>
  )
}

export default FilterArea
