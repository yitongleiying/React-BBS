import styles from "./index.module.scss"
import PropTypes from "prop-types"
import { Pagination } from "antd"
function DataList({ dataSource, children, loadData }) {
  const onPageChange = (pageNo) => {
    loadData(pageNo)
  }
  return (
    <>
      <div>{children}</div>
      <div className={styles.pagination}>
        <Pagination
          onChange={onPageChange}
          defaultPageSize={15}
          defaultCurrent={1}
          total={dataSource.totalCount}
        />
      </div>
    </>
  )
}
DataList.propTypes = {
  dataSource: PropTypes.object,
  loading: PropTypes.bool,
  noMsg: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadData: PropTypes.func,
}
export default DataList
