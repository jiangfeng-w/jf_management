<template>
    <div class="login_ocntainer">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img
                    src="../assets/logo.png"
                    alt=""
                />
            </div>
            <!-- 登录信息 -->
            <el-form
                ref="loginRef"
                :model="loginForm"
                :rules="loginRules"
                label-width="80px"
                class="login_form"
            >
                <!-- 用户名 -->
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input
                        prefix-icon="iconfont icon-user"
                        v-model="loginForm.username"
                        type="string"
                    ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item
                    label="密码"
                    prop="password"
                >
                    <el-input
                        prefix-icon="iconfont icon-3702mima"
                        v-model="loginForm.password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-row class="btns">
                    <el-button
                        type="primary"
                        @click="toLogin"
                    >
                        登录
                    </el-button>
                    <el-button
                        type="info"
                        @click="resetForm"
                    >
                        重置
                    </el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                // 表单数据绑定
                loginForm: {
                    username: 'admin',
                    password: '123456',
                },
                // 表单验证规则
                loginRules: {
                    // 验证用户名
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '用户名在 3 到 10 个字符', trigger: 'blur' },
                    ],
                    // 验证密码
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 16, message: '密码在 6 到 16 个字符', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            // 表单重置
            resetForm() {
                this.$refs.loginRef.resetFields()
            },
            // 登录
            toLogin() {
                // 整个表单校验
                this.$refs.loginRef.validate(isAdopt => {
                    // 失败
                    if (!isAdopt) {
                        return this.$message.error('登录失败，用户名或错误')
                    }
                    // 成功
                    // console.log(this.loginForm)
                    this.$axios({
                        method: 'post',
                        url: 'login',
                        data: this.loginForm,
                    })
                        .then(res => {
                            // console.log(res.data)
                            const data = res.data
                            // 登录失败
                            if (data.meta.status !== 200) {
                                return this.$message.error('登录失败，用户名或错误')
                            }
                            // 登录成功
                            this.$message.success('登录成功')
                            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                            //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                            //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                            window.sessionStorage.setItem('token', data.data.token)
                            this.$router.push('/home')
                        })
                        .catch(err => {
                            // 网络错误
                            if (err.message === 'Network Error') {
                                this.$message.error('网络错误，请检查网络后重试')
                            }
                        })
                })
            },
            /* // 登录成功
            loginSuccess() {
                this.$message({
                    // message: '登录成功',
                    type: 'success',
                })
            }, */
        },
    }
</script>

<style lang="less" scoped>
    .login_ocntainer {
        // background-color: #fff;
        background-color: #40b681;
        height: 100%;
        .login_box {
            background-color: #fff;
            width: 450px;
            height: 300px;
            border-radius: 3px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px rgb(171, 171, 171);
            .avatar_box {
                width: 100px;
                height: 100px;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .login_form {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        width: 80%;
    }
    .btns {
        display: flex;
        justify-content: center;
    }
</style>
