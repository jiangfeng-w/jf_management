<template>
    <div class="Params">
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区 -->
        <el-card>
            <!-- 顶部警示 -->
            <el-alert
                title="只允许为第三级分类设置参数"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>

            <!-- 选择分类 -->
            <el-row class="cate_opt">
                <span>选择商品分类：</span>

                <!-- 级联选择器 -->
                <el-cascader
                    v-model="selectedKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"
                    placeholder="请选择分类"
                    clearable
                ></el-cascader>
            </el-row>

            <!-- 标签页 -->
            <el-tabs
                v-model="activeName"
                @tab-click="tabClick"
            >
                <!-- 动态参数 -->
                <el-tab-pane
                    label="动态参数"
                    name="many"
                >
                    <el-button
                        type="primary"
                        size="small"
                        :disabled="isBtnDisabled"
                        @click="showAddDialog"
                    >
                        添加参数
                    </el-button>

                    <!-- 动态参数表格 -->
                    <el-table
                        v-if="activeName === 'many'"
                        :data="cateParams.many"
                        border
                    >
                        <!-- 展开列 -->
                        <el-table-column
                            type="expand"
                            width="50px"
                        >
                            <template v-slot="scope">
                                <!-- tag标签页 -->
                                <el-tag
                                    v-for="(item, index) in scope.row.attr_vals"
                                    :key="index"
                                    v-if="index"
                                    closable
                                    @close="deleteTag(scope.row, index)"
                                >
                                    {{ item }}
                                </el-tag>

                                <!-- 新增输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 新增按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>

                        <!-- 序号列 -->
                        <el-table-column
                            type="index"
                            label="序号"
                            width="50px"
                        ></el-table-column>

                        <!-- 名称列 -->
                        <el-table-column
                            prop="attr_name"
                            label="参数名称"
                        ></el-table-column>

                        <!-- 操作列 -->
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <!-- 编辑按钮 -->
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    round
                                    @click="showEditDialog(scope.row)"
                                >
                                    编辑
                                </el-button>

                                <!-- 删除按钮 -->
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    round
                                    @click="deleteParams(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 静态属性 -->
                <el-tab-pane
                    label="静态属性"
                    name="only"
                >
                    <el-button
                        type="primary"
                        size="small"
                        :disabled="isBtnDisabled"
                        @click="showAddDialog"
                    >
                        添加属性
                    </el-button>

                    <!-- 静态属性表格 -->
                    <el-table
                        v-if="activeName === 'only'"
                        :data="cateParams.only"
                        border
                    >
                        <!-- 展开列 -->
                        <el-table-column
                            type="expand"
                            width="50px"
                        >
                            <template v-slot="scope">
                                <!-- tag标签页 -->
                                <el-tag
                                    v-for="(item, index) in scope.row.attr_vals"
                                    :key="index"
                                    v-if="index"
                                    closable
                                    @close="deleteTag(scope.row, index)"
                                >
                                    {{ item }}
                                </el-tag>

                                <!-- 新增输入框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 新增按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>

                        <!-- 序号列 -->
                        <el-table-column
                            type="index"
                            label="序号"
                            width="50px"
                        ></el-table-column>

                        <!-- 名称列 -->
                        <el-table-column
                            prop="attr_name"
                            label="属性名称"
                        ></el-table-column>

                        <!-- 操作列 -->
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <!-- 编辑按钮 -->
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    round
                                    @click="showEditDialog(scope.row)"
                                >
                                    编辑
                                </el-button>

                                <!-- 删除按钮 -->
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    round
                                    @click="deleteParams(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加对话框 -->
        <el-dialog
            :title="`添加${titleText}`"
            :visible.sync="addDialog"
            width="50%"
            @closed="closeAddDialog"
        >
            <el-form
                ref="addFormRef"
                :model="addForm"
                :rules="addFormRules"
                label-width="100px"
                status-icon
            >
                <el-form-item
                    :label="titleText"
                    prop="attr_name"
                >
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <!-- 按钮 -->
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addParams"
                >
                    确 定
                </el-button>
            </span>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog
            :title="`编辑${titleText}`"
            :visible.sync="editDialog"
            width="50%"
            @closed="closeEditDialog"
        >
            <el-form
                ref="editFormRef"
                :model="editForm"
                :rules="editFormRules"
                label-width="100px"
                status-icon
            >
                <el-form-item
                    :label="titleText"
                    prop="attr_name"
                >
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <!-- 按钮 -->
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editParams"
                >
                    确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Params',
        data() {
            return {
                // 分类列表
                cateList: [],
                // 分类总个数
                total: 0,
                // 级联选择器配置项
                cateProps: {
                    expandTrigger: 'hover',
                    children: 'children',
                    value: 'cat_id',
                    label: 'cat_name',
                },
                // 级联选择器的值
                selectedKeys: [],

                // 当前标签页的name
                activeName: 'many',
                // 获取到的分类参数和属性
                cateParams: {
                    only: [],
                    many: [],
                },

                /* 添加对话框 */
                // 添加对话框的显示 / 隐藏
                addDialog: false,
                // 添加表单
                addForm: {
                    attr_name: '',
                },
                // 添加表单验证规则
                addFormRules: {
                    attr_name: [
                        {
                            required: true,
                            message: `请输入内容`,
                            trigger: 'blur',
                        },
                    ],
                },

                /* 编辑对话框 */
                // 编辑对话框的显示 / 隐藏
                editDialog: false,
                // 编辑表单
                editForm: {
                    attr_name: '',
                },
                // 编辑表单验证规则
                editFormRules: {
                    attr_name: [
                        {
                            required: true,
                            message: `请输入内容`,
                            trigger: 'blur',
                        },
                    ],
                },
            }
        },
        methods: {
            // 请求时发生错误的消息提示
            errMsg(err) {
                if (err.code === 'ERR_NETWORK') {
                    return this.$message({
                        message: '网络错误，请检查网络后重试',
                        type: 'error',
                        duration: 1000,
                    })
                }
                this.$message({
                    message: err.message,
                    type: 'error',
                    duration: 1000,
                })
            },

            // 获取分类列表
            async getCateList() {
                const { data: res } = await this.$axios.get('categories').catch(err => {
                    this.errMsg(err)
                })
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: res.meta.msg,
                        type: 'error',
                        duration: 1000,
                    })
                }
                // console.log(res)
                this.cateList = res.data
                this.total = this.cateList.length
            },

            // 获取分类参数或属性
            async getCateParams() {
                // 如果 length !==3 说明，选择的不是三级分类
                if (this.selectedKeys.length !== 3) {
                    this.selectedKeys = []
                    this.cateParams.only = []
                    this.cateParams.many = []
                    return
                }
                // 根据所选的分类 id ，获取属性和参数
                const { data: res } = await this.$axios({
                    method: 'get',
                    url: `categories/${this.cateId}/attributes`,
                    params: {
                        sel: this.activeName,
                    },
                }).catch(err => {
                    this.errMsg(err)
                })
                // console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: res.meta.msg,
                        type: 'error',
                        duration: 1000,
                    })
                }
                // 将标签转化为数组
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.split(',')

                    // 控制新增标签输入框的显示 / 隐藏
                    this.$set(item, 'inputVisible', false)
                    // 输入框的值
                    this.$set(item, 'inputValue', '')
                })
                // 根据tab不同，赋值给不同子数组
                this.cateParams[this.activeName] = res.data
                // console.log(this.cateParams[this.activeName])
            },

            // 级联选择器选择分类的回调
            async handleChange() {
                // console.log(this.selectedKeys)
                this.getCateParams()
            },

            // 点击标签页时的回调
            tabClick(tab) {
                // console.log(tab.name)
                this.getCateParams()
            },

            /* 添加属性 / 参数 */
            // 显示添加对话框
            showAddDialog() {
                this.addDialog = true
            },
            // 关闭添加对话框
            closeAddDialog() {
                this.$refs.addFormRef.resetFields()
            },
            // 发起添加请求
            addParams() {
                this.$refs.addFormRef.validate(async isAdopt => {
                    // 验证未通过
                    if (!isAdopt) return
                    // 验证通过
                    this.addDialog = false
                    const { data: res } = await this.$axios({
                        method: 'post',
                        url: `categories/${this.cateId}/attributes`,
                        data: {
                            attr_name: this.addForm.attr_name,
                            attr_sel: this.activeName,
                        },
                    }).catch(err => {
                        this.errMsg(err)
                    })
                    // 状态码不对
                    if (res.meta.status !== 201) {
                        return this.$message({
                            message: res.meta.msg,
                            type: 'error',
                            duration: 1000,
                        })
                    }
                    // 成功
                    this.$message({
                        message: `添加${this.titleText}成功`,
                        type: 'success',
                        duration: 1000,
                    })
                    this.getCateParams()
                })
            },

            /* 编辑属性 / 参数 */
            // 显示编辑对话框
            async showEditDialog(attr) {
                // console.log(params)

                /* // 直接使用本地数据
                this.editForm.attr_name = params.attr_name */

                // 向服务端发起请求，获取最新数据
                const { data: res } = await this.$axios({
                    method: 'get',
                    url: `categories/${this.cateId}/attributes/${attr.attr_id}`,
                    params: {
                        attr_sel: this.activeName,
                    },
                }).catch(err => {
                    this.errMsg(err)
                })
                // console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: res.meta.msg,
                        type: 'error',
                        duration: 1000,
                    })
                }

                this.editForm = res.data
                this.editDialog = true
            },
            // 关闭编辑对话框
            closeEditDialog() {
                this.$refs.editFormRef.resetFields()
            },
            // 发起编辑请求
            editParams() {
                // 验证数据是否正确
                this.$refs.editFormRef.validate(async isAdopt => {
                    // 验证未通过
                    if (!isAdopt) return
                    // 验证通过
                    this.editDialog = false
                    const { data: res } = await this.$axios({
                        method: 'put',
                        url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                        data: {
                            attr_name: this.editForm.attr_name,
                            attr_sel: this.editForm.attr_sel,
                            attr_vals: this.editForm.attr_vals,
                        },
                    }).catch(err => {
                        this.errMsg(err)
                    })
                    // console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message({
                            message: res.meta.msg,
                            type: 'error',
                            duration: 1000,
                        })
                    }

                    this.$message({
                        message: '更新成功',
                        type: 'success',
                        duration: 1000,
                    })

                    this.getCateParams()
                })
            },

            // 删除参数 / 属性
            deleteParams(attr) {
                this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(async () => {
                        const { data: res } = await this.$axios({
                            method: 'delete',
                            url: `categories/${this.cateId}/attributes/${attr.attr_id}`,
                        })
                        if (res.meta.status !== 200) {
                            return this.$message({
                                message: res.meta.msg,
                                type: 'error',
                                duration: 1000,
                            })
                        }
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration: 1000,
                        })
                        this.getCateParams()
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                            duration: 1000,
                        })
                    })
            },

            // 隐藏新增标签, 显示新增输入框
            showInput(attr) {
                attr.inputVisible = true
                // 文本框自动聚焦
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },

            // 失焦或者按下enter
            async handleInputConfirm(attr) {
                attr.inputVisible = false
                // 输入的是空格
                if (attr.inputValue.trim().length === 0) {
                    attr.inputValue = ''
                    return
                }
                // 将输入框的值添加到标签数组
                attr.attr_vals.push(attr.inputValue)
                attr.inputValue = ''
                // console.log(attr.attr_vals.join(',').trim())

                // 发起请求
                const { data: res } = await this.$axios({
                    method: 'put',
                    url: `categories/${this.cateId}/attributes/${attr.attr_id}`,
                    data: {
                        attr_name: attr.attr_name,
                        attr_sel: attr.attr_sel,
                        attr_vals: attr.attr_vals.join(','),
                    },
                }).catch(err => {
                    this.errMsg(err)
                })
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: res.meta.msg,
                        type: 'error',
                        duration: 1000,
                    })
                }
                this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 1000,
                })
            },

            // 点击标签的关闭按钮
            async deleteTag(attr, index) {
                // 从数组中删除这一项
                attr.attr_vals.splice(index, 1)
                // 发起请求
                const { data: res } = await this.$axios({
                    method: 'put',
                    url: `categories/${this.cateId}/attributes/${attr.attr_id}`,
                    data: {
                        attr_name: attr.attr_name,
                        attr_sel: attr.attr_sel,
                        attr_vals: attr.attr_vals.join(','),
                    },
                }).catch(err => {
                    this.errMsg(err)
                })
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: res.meta.msg,
                        type: 'error',
                        duration: 1000,
                    })
                }
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000,
                })
            },
        },
        computed: {
            // 按钮是否禁用
            isBtnDisabled() {
                if (this.selectedKeys.length === 3) {
                    return false
                }
                return true
            },
            // 选中的三级id
            cateId() {
                if (this.selectedKeys.length === 3) {
                    return this.selectedKeys[2]
                }
                return null
            },
            // 添加对话框的标题
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            },
        },
        created() {
            this.getCateList()
        },
    }
</script>

<style lang="less" scoped>
    .cate_opt {
        margin: 15px 0;
    }
    .cate_opt span {
        font-size: 15px;
    }
    .el-cascader {
        width: 250px;
    }
    .el-table {
        margin-top: 15px;
    }
    .el-tag {
        margin-right: 10px;
        margin-top: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: auto;
        vertical-align: bottom;
    }
</style>
