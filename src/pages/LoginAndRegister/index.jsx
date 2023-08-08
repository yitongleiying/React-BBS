import Dialog from "../../components/Modal"
import { Button, Checkbox, Form, Input, Popover, message } from "antd"
import { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from "react"
import md5 from "js-md5"
import { observer } from "mobx-react-lite"
import useStore from "@/store/index"
import { useSetState, useCookieState } from "ahooks"
import styles from "./index.module.scss"
import verify from "@/utils/Verify.js"
import Request from "../../utils/Request"
const api = {
  checkCode: "/api/checkCode",
  sendMailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
}
const LoginAndRegister = observer(
  forwardRef(function LoginAndRegister(props, ref) {
    // 向外暴露的方法
    useImperativeHandle(ref, () => {
      return {
        showDialog(type) {
          showPanel(type)
        },
      }
    })
    // 登陆注册表单数据绑定
    const [form] = Form.useForm()

    // 验证码数据绑定
    const [formCode] = Form.useForm()

    const [checkCodeUrl, setCheckCodeUrl] = useState(api.checkCode)
    const [checkCodeUrl4SendMailCode, setCheckCodeUrl4SendMailCode] = useState(api.checkCode)
    // 验证码刷新
    const changeCheckCode = (type) => {
      if (type === 0) {
        setCheckCodeUrl(api.checkCode + "?type=" + type + "&time=" + new Date().getTime())
      } else {
        setCheckCodeUrl4SendMailCode(
          api.checkCode + "?type=" + type + "&time=" + new Date().getTime(),
        )
      }
    }
    // 设置登陆信息的cookie
    const [loginCookie, setLoginCookie] = useCookieState("loginInfo", {
      expires: () => new Date()(),
    })
    // 重置表单验证
    const resetForm = (type) => {
      setDialog(() => ({ show: true }))
      if (type === 0) {
        setDialog(() => ({ title: "注册" }))
      } else if (type === 1) {
        setDialog(() => ({ title: "登陆" }))
      } else if (type === 2) {
        setDialog(() => ({ title: "重置密码" }))
      }
      changeCheckCode(0)
      form.resetFields()
    }

    // 二次输入密码验证规则
    const checkRepassword = (rule, value) => {
      const { registerPassword } = form.getFieldValue()
      if (value !== registerPassword) {
        return Promise.reject(new Error(rule.message))
      } else {
        return Promise.resolve()
      }
    }
    // =0:注册1：登陆：2：重置密码
    const [opType, setOpType] = useState(0)

    const showPanel = (type) => {
      setOpType(type)
      resetForm(type)
    }
    // 登陆注册对话框
    const [dialog, setDialog] = useSetState({
      show: false,
      title: "登陆",
    })
    // 邮箱验证码对话框
    const [dialogConfig4SendMailCode, setDialogConfig4SendMailCode] = useSetState({
      show: false,
      title: "发送邮箱验证码",
      buttons: [
        {
          type: "primary",
          text: "发送验证码",
          click: () => {
            if ("nickName" in form.getFieldsValue()) {
              sendEmailCode(0)
            } else {
              sendEmailCode(1)
            }
          },
        },
      ],
    })

    // 发送邮箱验证码弹框
    const getEmailCode = () => {
      form.validateFields(["email"]).then((vaild) => {
        if (!vaild) {
          return
        }
        setDialogConfig4SendMailCode({ show: true })
        formCode.resetFields()
        changeCheckCode(1)
        setEmail(form.getFieldValue("email"))
        formCode.setFieldValue("email", form.getFieldValue("email"))
      })
    }

    const [email, setEmail] = useState("")

    // 发送邮件
    const sendEmailCode = (type) => {
      formCode.validateFields().then(async (vaild) => {
        if (!vaild) {
          return
        }
        const params = {
          email: formCode.getFieldValue("email"),
          checkCode: formCode.getFieldsValue().checkcode,
          type: type,
        }
        let reslut = await Request({
          url: api.sendMailCode,
          params,
          errorCallback: () => {
            changeCheckCode(1)
          },
        })
        if (!reslut) {
          return
        }
        message.success("验证码发送成功，请登陆邮箱查看")
        setDialogConfig4SendMailCode({ show: false })
      })
    }
    const { userStore } = useStore()
    const { updateLoginUserInfo } = userStore
    const doSubmit = () => {
      form.validateFields().then(async (valid) => {
        if (!valid) {
          return
        }
        let url = null
        let params = {}
        Object.assign(params, form.getFieldsValue())
        if (opType === 0 || opType == 2) {
          params.password = params.registerPassword
          delete params.registerPassword
          delete params.reRegisterPassword
        }
        if (opType === 1) {
          let cookiePassword = loginCookie == null ? null : loginCookie.password
          if (params.password !== cookiePassword) {
            params.password = md5(params.password)
          }
        }
        if (opType === 0) {
          url = api.register
        } else if (opType === 1) {
          url = api.login
        } else if (opType == 2) {
          url = api.resetPwd
        }
        const result = await Request({
          url: url,
          params,
          errorCallback: () => {
            changeCheckCode(0)
          },
        })
        if (!result) {
          return
        }
        if (opType === 0) {
          message.success("注册成功，请登陆")
          showPanel(1)
        } else if (opType === 1) {
          if (params.rememberMe) {
            const loginInfo = {
              email: params.email,
              password: params.password,
              rememberMe: params.rememberMe,
            }
            setLoginCookie(loginInfo, {
              expires: (() => new Date(+new Date() + 604800000))(),
            })
          } else {
            setLoginCookie()
          }
          setDialog({ show: false })
          message.success("登陆成功")
          updateLoginUserInfo(result.data)
        } else if (opType === 2) {
          message.success("重置密码成功，请登陆")
          showPanel(1)
        }
      })
    }
    // 根据面板判断初始化信息
    const initFormValues = useCallback(() => {
      if (opType === 1 && loginCookie !== undefined) {
        return loginCookie
      } else {
        return {}
      }
    }, [opType, loginCookie])
    useEffect(() => {
      // 解决bug，改变optype类型值，初始化值不变
      form.resetFields()
    }, [opType, form])
    return (
      <>
        <Dialog
          onClose={() => setDialog(() => ({ show: false }))}
          show={dialog.show}
          title={dialog.title}
          showCancel={false}
        >
          <Form form={form} className={styles["login-register"]} initialValues={initFormValues()}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱!",
                },
                {
                  validator: verify.email,
                  message: "请输入合法的邮箱",
                },
              ]}
            >
              <Input
                prefix={<span className="iconfont icon-account"></span>}
                placeholder="请输入邮箱"
              />
            </Form.Item>
            {/* 登陆密码 */}
            {opType == 1 && (
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                  {
                    validator: verify.password,
                    message: "密码只能由数字，字母，特殊符号的8-18位",
                  },
                ]}
              >
                <Input.Password
                  prefix={<span className="iconfont icon-password"></span>}
                  placeholder="请输入密码"
                  autoComplete="off"
                />
              </Form.Item>
            )}
            {/* 注册邮箱验证码 */}
            {(opType === 0 || opType === 2) && (
              <Form.Item>
                <div className={styles["send-email-panel"]}>
                  <Form.Item
                    name="emailCode"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "请输入邮箱验证码",
                      },
                    ]}
                  >
                    <Input
                      prefix={<span className="iconfont icon-checkcode"></span>}
                      placeholder="请输入邮箱验证码"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    className={styles["send-email-btn"]}
                    onClick={() => getEmailCode()}
                  >
                    获取验证码
                  </Button>
                </div>
                <Popover
                  placement="left"
                  trigger="click"
                  content={
                    <div>
                      <p>1：在垃圾箱里查找邮箱验证码</p>
                      <p>2：在邮箱中设置头像-设置-反垃圾-白名单-设置邮箱白名单</p>
                      <p>3：将邮箱【3056414361@qq.com】加入白名单</p>
                    </div>
                  }
                >
                  <Button type="link">未收到邮箱验证码</Button>
                </Popover>
              </Form.Item>
            )}
            {/* 注册时的昵称 */}
            {opType === 0 && (
              <Form.Item
                name="nickName"
                rules={[
                  {
                    required: true,
                    message: "请输入昵称",
                  },
                ]}
              >
                <Input
                  prefix={<span className="iconfont icon-account"></span>}
                  placeholder="请输入昵称"
                />
              </Form.Item>
            )}
            {/* 注册或重置密码时的密码 */}
            {(opType === 0 || opType === 2) && (
              <Form.Item
                name="registerPassword"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                  {
                    validator: verify.password,
                    message: "密码只能由数字，字母，特殊符号的8-18位",
                  },
                ]}
              >
                <Input.Password
                  prefix={<span className="iconfont icon-password"></span>}
                  placeholder="请输入密码"
                  autoComplete="off"
                />
              </Form.Item>
            )}
            {(opType === 0 || opType === 2) && (
              <Form.Item
                name="reRegisterPassword"
                rules={[
                  {
                    required: true,
                    message: "请再次输入密码",
                  },
                  {
                    validator: checkRepassword,
                    message: "两次输入的密码不一致",
                  },
                ]}
              >
                <Input.Password
                  prefix={<span className="iconfont icon-password"></span>}
                  placeholder="请再次输入密码"
                  autoComplete="off"
                />
              </Form.Item>
            )}
            <Form.Item>
              <div className={styles["check-code-panel"]}>
                <Form.Item
                  noStyle
                  name="checkCode"
                  rules={[
                    {
                      required: true,
                      message: "请输入图片验证码",
                    },
                  ]}
                >
                  <Input
                    prefix={<span className="iconfont icon-checkcode"></span>}
                    placeholder="请输入验证码"
                  />
                </Form.Item>
                <img
                  src={checkCodeUrl}
                  alt=""
                  className={styles["check-code"]}
                  onClick={() => changeCheckCode(0)}
                />
              </div>
            </Form.Item>
            {opType == 1 && (
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
            )}
            {opType == 1 && (
              <Form.Item>
                <div className={styles["no-account"]}>
                  <Button type="link" onClick={() => showPanel(2)}>
                    忘记密码 ？
                  </Button>
                  <Button type="link" onClick={() => showPanel(0)}>
                    没有账号 ？
                  </Button>
                </div>
              </Form.Item>
            )}
            {opType == 0 && (
              <Form.Item>
                <Button type="link" onClick={() => showPanel(1)}>
                  已有账号 ？
                </Button>
              </Form.Item>
            )}
            {opType == 2 && (
              <Form.Item>
                <Button type="link" onClick={() => showPanel(1)}>
                  去登陆 ？
                </Button>
              </Form.Item>
            )}
            <Form.Item>
              <Button block type="primary" htmlType="submit" onClick={doSubmit}>
                {opType === 0 && <span>注册</span>}
                {opType === 1 && <span>登陆</span>}
                {opType === 2 && <span>重置密码</span>}
              </Button>
            </Form.Item>
          </Form>
        </Dialog>
        {/* 获取邮箱验证码 */}
        <Dialog
          onClose={() => setDialogConfig4SendMailCode(() => ({ show: false }))}
          show={dialogConfig4SendMailCode.show}
          title={dialogConfig4SendMailCode.title}
          showCancel={false}
          buttons={dialogConfig4SendMailCode.buttons}
        >
          <Form
            form={formCode}
            className={styles["login-register"]}
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item label="邮箱">{email}</Form.Item>
            <Form.Item>
              <div className={styles["check-code-panel"]}>
                <Form.Item
                  name="checkcode"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "请输入图片验证码",
                    },
                  ]}
                >
                  <Input
                    prefix={<span className="iconfont icon-checkcode"></span>}
                    placeholder="请输入验证码"
                  />
                </Form.Item>
                <img
                  src={checkCodeUrl4SendMailCode}
                  alt=""
                  className={styles["check-code"]}
                  onClick={() => changeCheckCode(1)}
                />
              </div>
            </Form.Item>
          </Form>
        </Dialog>
      </>
    )
  }),
)
export default LoginAndRegister
