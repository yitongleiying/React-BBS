import axios from "axios"
import { Spin, message } from "antd"
import ReactDOM from "react-dom/client"

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8"
const contentTypeJson = "application/json"

const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
})
let loading = false
function showLoading() {
  loading = true
  const dom = document.createElement("div")
  dom.className = "loading"
  document.body.appendChild(dom)
  ReactDOM.createRoot(dom).render(<Spin size="large"></Spin>)
}
function hideLoading() {
  loading = false
  document.body.removeChild(document.querySelector(".loading"))
}
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      showLoading()
    }
    return config
  },
  (error) => {
    if (error.config.showLoading && loading) {
      hideLoading()
    }
    message.error("请求发送失败", 2)
    return Promise.reject("请求发送失败")
  },
)
instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallback, showError } = response.config
    if (showLoading) {
      hideLoading()
    }
    const responseData = response.data
    if (responseData.code === 200) {
      return responseData
    } else if (responseData.code === 901) {
      return Promise.reject({ showError: false, msg: "登陆超时" })
    } else {
      if (errorCallback) {
        errorCallback(responseData)
      }
      return Promise.reject({ showError: showError, msg: responseData.info })
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      hideLoading()
    }
    return Promise.reject({ showError: true, msg: "网络异常" })
  },
)
const Request = (config) => {
  //  适用于文件上传
  const { url, params, dataType, showLoading = true, errorCallback, showError = true } = config
  let contentType = contentTypeForm
  let formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key] == undefined ? "" : params[key])
  }
  if (dataType != null && dataType == "json") {
    contentType = contentTypeJson
  }
  let headers = {
    "Content-Type": contentType,
    "X-Request-with": "XMLHttpRequest",
  }
  return instance
    .post(url, formData, {
      headers: headers,
      showLoading: showLoading,
      errorCallback: errorCallback,
      showError: showError,
    })
    .catch((error) => {
      if (error.showError) {
        message.error(error.msg)
      }
      return null
    })
}
export default Request
