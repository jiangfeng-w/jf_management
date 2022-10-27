<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 添加与搜索 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <!-- 搜索筛选框 -->
                    <div>
                        <el-input
                            placeholder="搜索用户"
                            v-model="userPramas.query"
                            class="input-with-select"
                            clearable
                        >
                            <el-button
                                @click="searchUser"
                                slot="append"
                                icon="el-icon-search"
                            ></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="1">
                    <el-button
                        type="primary"
                        @click="addDialog = true"
                    >
                        添加用户
                    </el-button>
                </el-col>
            </el-row>

            <!-- 用户表格 -->
            <el-table
                :data="userList"
                style="width: 100%"
                border
                stripe
            >
                <!-- 序号列 -->
                <el-table-column
                    type="index"
                    label="序号"
                    width="50px"
                ></el-table-column>

                <!-- 姓名列 -->
                <el-table-column
                    prop="username"
                    label="姓名"
                ></el-table-column>

                <!-- 邮箱 -->
                <el-table-column
                    prop="email"
                    label="邮箱"
                ></el-table-column>

                <!-- 电话列 -->
                <el-table-column
                    prop="mobile"
                    label="电话"
                ></el-table-column>

                <!-- 角色列 -->
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>

                <!-- 状态列 -->
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#eaecf0"
                            @change="changeStatus(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 编辑按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="编辑信息"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row)"
                                round
                            ></el-button>
                        </el-tooltip>

                        <!-- 删除按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="删除信息"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                round
                                @click="deleteUser(scope.row)"
                            ></el-button>
                        </el-tooltip>

                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                round
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="userPramas.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="userPramas.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>

            <!-- 添加用户对话框 -->
            <el-dialog
                title="添加用户"
                :visible.sync="addDialog"
                width="30%"
                @close="closeAddDialog"
            >
                <!-- 内容区域 -->
                <el-form
                    ref="addUserRef"
                    :model="addUserForm"
                    :rules="addUserRules"
                    label-width="80px"
                    class="add_user_form"
                    status-icon
                >
                    <!-- 用户名 -->
                    <el-form-item
                        label="用户名"
                        prop="username"
                    >
                        <el-input
                            prefix-icon="el-icon-user"
                            v-model="addUserForm.username"
                        ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item
                        label="密码"
                        prop="password"
                    >
                        <el-input
                            prefix-icon="el-icon-lock"
                            v-model="addUserForm.password"
                            type="password"
                        ></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item
                        label="邮箱"
                        prop="email"
                    >
                        <el-input
                            prefix-icon="el-icon-message"
                            v-model="addUserForm.email"
                        ></el-input>
                    </el-form-item>
                    <!-- 电话 -->
                    <el-form-item
                        label="电话"
                        prop="mobile"
                    >
                        <el-input
                            prefix-icon="el-icon-mobile-phone"
                            v-model="addUserForm.mobile"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <!-- 按钮区域 -->
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button @click="addDialog = false">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="addUser"
                    >
                        确 定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑用户信息对话框 -->
            <el-dialog
                title="修改用户信息"
                :visible.sync="editDialog"
                @close="closeEditDialog"
                width="30%"
            >
                <!-- 内容区域 -->
                <el-form
                    ref="editUserRef"
                    :model="editUserForm"
                    :rules="editUserRules"
                    label-width="80px"
                    class="add_user_form"
                    status-icon
                >
                    <!-- 用户名 -->
                    <el-form-item label="用户名">
                        <el-input
                            prefix-icon="el-icon-user"
                            v-model="editUserForm.username"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item
                        label="邮箱"
                        prop="email"
                    >
                        <el-input
                            prefix-icon="el-icon-message"
                            v-model="editUserForm.email"
                        ></el-input>
                    </el-form-item>
                    <!-- 电话 -->
                    <el-form-item
                        label="电话"
                        prop="mobile"
                    >
                        <el-input
                            prefix-icon="el-icon-mobile-phone"
                            v-model="editUserForm.mobile"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <!-- 按钮区域 -->
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button @click="editDialog = false">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="editUser"
                    >
                        确 定
                    </el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Users',
        data() {
            // 邮箱校验规则
            var checkEmail = (rule, value, callback) => {
                // 正则
                const reg =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                if (!reg.test(value)) {
                    return callback(new Error('请输入正确的邮箱'))
                }
                callback()
            }
            // 电话校验规则
            var checkTel = (rule, value, callback) => {
                // 正则
                const reg =
                    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

                if (!reg.test(value)) {
                    return callback(new Error('请输入正确的手机号'))
                }
                callback()
            }

            return {
                // 搜索框
                input: '',
                // 用户列表
                userList: [],
                // 总条数
                total: 0,
                // 发送请求携带的数据
                userPramas: {
                    query: '',
                    // 当前页码
                    pagenum: 1,
                    // 每页条数
                    pagesize: 5,
                },
                // 控制添加用户对话框隐藏或显示
                addDialog: false,
                // 添加用户的表单
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },
                // 添加用户验证规则
                addUserRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '用户名在 1 到 10 个字符', trigger: 'blur' },
                    ],

                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 16, message: '密码在 6 到 16 个字符', trigger: 'blur' },
                    ],

                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' },
                    ],

                    mobile: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator: checkTel, trigger: 'blur' },
                    ],
                },

                // 编辑添加用户对话框隐藏或显示
                editDialog: false,
                // 编辑用户的表单
                editUserForm: {},
                // 编辑用户验证规则
                editUserRules: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' },
                    ],

                    mobile: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator: checkTel, trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            // 获取用户列表
            getUserList() {
                this.$axios({
                    method: 'get',
                    url: 'users',
                    params: this.userPramas,
                }).then(res => {
                    const data = res.data
                    // console.log(data)
                    if (data.meta.status !== 200)
                        return this.$message({
                            message: '获取管理员列表失败',
                            type: 'error',
                            duration: 1000,
                        })
                    this.$message({
                        message: '获取管理员列表成功',
                        type: 'success',
                        duration: 1000,
                    })
                    this.userList = data.data.users
                    this.total = data.data.total
                })
            },
            //用户状态改变
            changeStatus(user) {
                // console.log(user)
                this.$axios({
                    method: 'put',
                    url: `users/${user.id}/state/${user.mg_state}`,
                })
                    .then(res => {
                        // 更改失败
                        if (res.data.meta.status !== 200) {
                            user.mg_state = !user.mg_state
                            return this.$message({
                                message: '更新用户状态失败',
                                type: 'error',
                                duration: 1000,
                            })
                        }
                        this.$message({
                            message: '更新用户状态成功',
                            type: 'success',
                            duration: 1000,
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            // 筛选用户
            searchUser() {
                this.getUserList()
                this.userPramas.query = ''
            },
            // 单页条数改变
            handleSizeChange(newSize) {
                // console.log('单页条数改变', newSize)
                this.userPramas.pagesize = newSize
                this.getUserList()
            },
            // 页码变化
            handleCurrentChange(newCurrent) {
                // console.log('页码变化', newCurrent)
                this.userPramas.pagenum = newCurrent
                this.getUserList()
            },
            // 添加用户并提交到服务端
            addUser() {
                // 验证信息并请求服务端
                this.$refs.addUserRef.validate(isAdopt => {
                    // 验证不通过
                    if (!isAdopt) return
                    // 验证通过，关掉对话框并发起请求
                    this.addDialog = false
                    this.$axios({
                        method: 'post',
                        url: 'users',
                        data: this.addUserForm,
                    })
                        .then(res => {
                            // console.log(res.data)
                            if (res.data.meta.status !== 201) {
                                // 状态码为400，用户名已存在
                                if (res.data.meta.status === 400)
                                    return this.$message({
                                        message: res.data.meta.msg,
                                        type: 'error',
                                        duration: 1000,
                                    })
                                return this.$message({
                                    message: '用户添加失败',
                                    type: 'error',
                                    duration: 1000,
                                })
                            }

                            this.$message({
                                message: '用户添加成功',
                                type: 'success',
                                duration: 1000,
                            })
                            this.getUserList()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            },
            // 关闭添加对话框时重置表单
            closeAddDialog() {
                this.$refs.addUserRef.resetFields()
            },

            // 用户操作
            // 关闭添加对话框时重置表单
            closeEditDialog() {
                this.$refs.editUserRef.resetFields()
            },
            // 显示编辑用户信息对话框
            showEditDialog(user) {
                this.editDialog = true
                // console.log(user)
                // this.editUserForm.id = user.id
                // this.editUserForm.username = user.username
                // this.editUserForm.email = user.email
                // this.editUserForm.mobile = user.mobile

                // 从服务端获取信息
                this.$axios({
                    method: 'get',
                    url: `users/${user.id}`,
                })
                    .then(res => {
                        // console.log(res.data)
                        this.editUserForm = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            // 编辑用户信息并提交到用户端
            editUser() {
                // 验证信息
                this.$refs.editUserRef.validate(isAdopt => {
                    // 验证不通过
                    if (!isAdopt) return
                    // 验证通过，关掉对话框并发起请求
                    this.editDialog = false
                    this.$axios({
                        method: 'put',
                        url: `users/${this.editUserForm.id}`,
                        data: {
                            email: this.editUserForm.email,
                            mobile: this.editUserForm.mobile,
                        },
                    })
                        .then(res => {
                            // console.log(res.data)
                            if (res.data.meta.status !== 200) {
                                return this.$message({
                                    message: '更新用户更新失败',
                                    type: 'error',
                                    duration: 1000,
                                })
                            }

                            this.$message({
                                message: '更新用户更新成功',
                                type: 'success',
                                duration: 1000,
                            })
                            this.getUserList()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            },
            // 删除用户
            deleteUser(user) {
                // 弹出删除提示框
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        // console.log(user.id)
                        // 发起请求
                        this.$axios({
                            method: 'delete',
                            url: `users/${user.id}`,
                        })
                            .then(res => {
                                // console.log(res)
                                if (res.data.meta.status !== 200)
                                    return this.$message({
                                        message: '用户删除失败',
                                        type: 'error',
                                        duration: 1000,
                                    })

                                this.$message({
                                    message: '用户删除成功',
                                    type: 'success',
                                    duration: 1000,
                                })
                                this.getUserList()
                            })
                            .catch(err => {
                                this.$message({
                                    message: '用户删除失败',
                                    type: 'error',
                                    duration: 1000,
                                })
                                console.log(err)
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        })
                    })
            },
        },
        created() {
            this.getUserList()
        },
    }
</script>

<style lang="less" scoped>
    .el-table {
        margin-top: 15px;
    }
    .el-pagination {
        margin-top: 15px;
    }
</style>
