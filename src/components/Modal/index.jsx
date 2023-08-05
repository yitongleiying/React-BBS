import PropTypes from "prop-types"
import { Modal, Button } from "antd"
import styles from "./index.module.scss"
const Dialog = ({ title, show, width, buttons, children, onClose, showCancel }) => {
  return (
    <>
      <Modal
        // forceRender
        title={title}
        open={show}
        width={width}
        onCancel={onClose}
        maskClosable={false}
        footer={[
          (buttons && buttons.length > 0) || showCancel ? (
            <div key="dialog">
              {showCancel && (
                <Button type="primary" onClick={onClose}>
                  取消
                </Button>
              )}
              {buttons.map((item) => (
                <Button key={item.type} type={item.type} onClick={item.click}>
                  {item.text}
                </Button>
              ))}
            </div>
          ) : null,
        ]}
      >
        <div className={styles["dialog-body"]}>{children}</div>
      </Modal>
    </>
  )
}
Dialog.defaultValues = {
  title: "对话框",
  show: false,
  showClose: null,
}
Dialog.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool.isRequired,
  showClose: PropTypes.bool,
  showCancel: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttons: PropTypes.array,
  children: PropTypes.element,
  onClose: PropTypes.func,
}
export default Dialog
