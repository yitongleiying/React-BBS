import styles from "./index.module.scss"
import React from "react"
import PropTypes from "prop-types"
import { Image } from "antd"
function Cover({ cover, width }) {
  const { globalInfo } = React
  return (
    <>
      {cover && (
        <div className={styles.cover} style={{ width: width, height: width }}>
          <Image width={width} height={width} src={globalInfo.imageUrl + cover}></Image>
        </div>
      )}
    </>
  )
}
Cover.propTypes = {
  cover: PropTypes.string,
  width: PropTypes.number,
}
export default Cover
