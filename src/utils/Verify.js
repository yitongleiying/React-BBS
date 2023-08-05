const regs = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  number: /^([0]|[1-9]|[0-9]*)$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/
}
const verify= (rule,value,reg)=>{
  if(value){
    if(reg.test(value)){
      return Promise.resolve()
    }else{
      return Promise.reject(new Error(rule.message))
    }
  }else{
    return Promise.resolve()
  } 
}
export default {
  email:(rule,value)=>{
    return verify(rule,value,regs.email)
  },
  number:(rule,value)=>{
    return verify(rule,value,regs.number)
  },
  password:(rule,value)=>{
    return verify(rule,value,regs.password)
  },
}