import { Avatar } from "antd"
import { useNavigate } from "react-router-dom"
import React, { forwardRef } from "react"
import PropTypes from "prop-types"
const AvataR = forwardRef(function AvataR({ size, addLink, userId }, ref) {
  const navigate = useNavigate()
  const { globalInfo } = React
  const goToUcenter = () => {
    if (addLink) {
      navigate("/user/" + userId)
    }
  }
  return (
    <Avatar
      ref={ref}
      size={size}
      onClick={goToUcenter}
      src={globalInfo.avatarUrl + userId}
    ></Avatar>
  )
})
AvataR.defaultProps = {
  size: 60,
}
AvataR.propTypes = {
  size: PropTypes.number,
  addLink: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
export default AvataR
