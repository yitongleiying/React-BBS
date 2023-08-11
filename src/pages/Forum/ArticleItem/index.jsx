import styles from "./index.module.scss"
import { Link } from "react-router-dom"
import { Divider } from "antd"
import PropTypes from "prop-types"
import AvataR from "../../../components/Avatar"
import Cover from "../../../components/Cover"
function ArtcleItem({ data, showComment, showEdit }) {
  return (
    <div className={styles["article-item"]}>
      <div className={styles["article-item-inner"]}>
        <div className={styles["article-body"]}>
          <div className={styles["user-info"]}>
            <AvataR userId={data.userId} size={40}></AvataR>
            <Link to={"/user/" + data.userId} className={styles["link-info"]}>
              {data.nickName}
            </Link>
            <Divider type="vertical" />
            <div className={styles["post-item"]}>{data.postTime}</div>
            <div className={styles.address}>&nbsp;·&nbsp;{data.userIpAddress}</div>
            <Divider type="vertical" />
            <Link to={`/forum/${data.pBoardId}`} className={styles["link-info"]}>
              {data.pBoardName}
            </Link>
            {data.boardId && (
              <>
                <span>&nbsp;&nbsp;</span>
                <Link
                  to={`/forum/${data.pBoardId}/${data.boardId}`}
                  className={styles["link-info"]}
                >
                  {data.boardName}
                </Link>
              </>
            )}
          </div>
          <Link to={`/post/${data.articleId}`} className={styles["title-info"]}>
            {data.topType == 1 && <span className={styles["top"]}>置顶</span>}
            {data.topType == 0 && <span className="tag tag-no-audit">待审核</span>}
            <span className={styles.title}>{data.title}</span>
          </Link>
          <div className={styles.summary}>{data.summary}</div>
          <div className={styles["article-info"]}>
            <span className="iconfont icon-eye-solid">
              {data.readCount === 0 ? "阅读" : data.readCount}
            </span>
            <span className="iconfont icon-good">
              {data.goodCount === 0 ? "点赞" : data.goodCount}
            </span>
            {showComment && (
              <span className="iconfont icon-comment">
                {data.commentCount === 0 ? "评论" : data.commentCount}
              </span>
            )}
            {showEdit && (
              <span className={["iconfont icon-edit", styles["edit-btn"]].join(" ")}>编辑</span>
            )}
          </div>
        </div>
        <Cover width={100} cover={data.cover}></Cover>
      </div>
    </div>
  )
}
ArtcleItem.propTypes = {
  data: PropTypes.object,
  showComment: PropTypes.bool,
  showEdit: PropTypes.bool,
}
export default ArtcleItem
