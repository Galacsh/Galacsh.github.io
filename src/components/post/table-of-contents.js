import { navigate } from "gatsby"
import React from "react"

const TableOfContents = ({ items }) => {
  return (
    <div className={items && "toc-wrapper"}>
      {items && <ToCList items={items} />}
    </div>
  )
}

const ToCList = ({ items, depth = 1 }) => {
  return items.map((item, idx) => (
    <ToCItem depth={depth} item={item} key={"toc-" + depth + "-" + idx} />
  ))
}

const ToCItem = ({ item, depth = 1 }) => {
  return (
    <>
      <div
        className={"btn toc-item"}
        style={{ marginLeft: 0.5 * (depth - 1) + "rem" }}
        onClick={() => navigate(item.url)}
        onKeyDown={() => navigate(item.url)}
      >
        {item.title}
      </div>
      {item.items && <ToCList depth={depth + 1} items={item.items} />}
    </>
  )
}

export default TableOfContents
