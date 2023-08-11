import styles from "./index.module.scss"
import { Divider } from "antd"
import ArtcleItem from "../ArticleItem"
import DataList from "../../../components/DataList"
import React from "react"
import { useSetState } from "ahooks"
import Request from "../../../utils/Request"
import { useRequest } from "ahooks"
const api = {
  loadArticle: "/forum/loadArticle",
}
function ArticleList() {
  const { globalInfo } = React
  const [articleInfo, setArticleInfo] = useSetState({})
  const loadArticle = async (pageNo) => {
    let params = {
      pageNo: pageNo,
      boardId: 0,
    }
    let reslut = await Request({
      url: api.loadArticle,
      params,
    })
    if (!reslut) {
      return
    }
    setArticleInfo(reslut.data)
  }
  useRequest(loadArticle)
  // 渲染文章列表
  const renderArticleList = () => {
    if (articleInfo.list !== undefined) {
      return articleInfo.list.map((item) => (
        <ArtcleItem
          key={item.articleId}
          data={item}
          showComment={true}
          showEdit={true}
        ></ArtcleItem>
      ))
    } else {
      return <></>
    }
  }
  return (
    <div
      className={[styles["article-list-body"], "container-body"].join(" ")}
      style={{ width: globalInfo.bodyWidth }}
    >
      <div className={styles["article-panel"]}>
        <div className={styles["top-tab"]}>
          <div>热榜</div>
          <Divider type="vertical" />
          <div>发布时间</div>
          <Divider type="vertical" />
          <div>最新</div>
        </div>
        <div className={styles["article-list"]}>
          <DataList dataSource={articleInfo} loadData={loadArticle}>
            {renderArticleList()}
          </DataList>
        </div>
      </div>
    </div>
  )
}
export default ArticleList
