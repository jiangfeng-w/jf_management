import Vue from 'vue'
// import { Button, Form, FormItem, Input } from 'element-ui'

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

// 全局导入
import ElementUI, { Message } from 'element-ui'
//引入ElementUI全部样式
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 挂载message组件
Vue.prototype.$message = Message
