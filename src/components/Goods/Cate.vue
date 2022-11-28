<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-col>
                    <el-button
                        type="primary"
                        @click="showAddDialog"
                    >
                        添加分类
                    </el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table
                ref="cateListRef"
                :data="cateList"
                row-key="cat_id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                border
                @row-click="expandRow"
            >
                <!-- 分类名称列 -->
                <el-table-column
                    prop="cat_name"
                    label="分类名称"
                ></el-table-column>

                <!-- 等级列 -->
                <el-table-column label="分类等级">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.cat_level === 0">一级分类</el-tag>
                        <el-tag
                            type="success"
                            v-if="scope.row.cat_level === 1"
                        >
                            二级分类
                        </el-tag>
                        <el-tag
                            type="warning"
                            v-if="scope.row.cat_level === 2"
                        >
                            三级分类
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 状态列 -->
                <el-table-column label="是否可用">
                    <template v-slot="scope">
                        <el-tag :type="!scope.row.cat_deleted ? 'success' : 'error'">
                            {{ !scope.row.cat_deleted ? '可用' : '不可用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 编辑按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row, $event)"
                            round
                        >
                            编辑
                        </el-button>

                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteCate(scope.row, $event)"
                            round
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>

            <!-- 添加分类对话框 -->
            <el-dialog
                title="添加商品分类"
                :visible.sync="addDialog"
                width="50%"
                @closed="closeAddDialog"
            >
                <!-- 添加的表单 -->
                <el-form
                    ref="addCateFormRef"
                    :model="addCateForm"
                    label-width="80px"
                    :rules="addCateRules"
                >
                    <!-- 分类名称 -->
                    <el-form-item
                        label="分类名称"
                        prop="cat_name"
                    >
                        <el-input
                            v-model="addCateForm.cat_name"
                            placeholder="输入分类名称"
                        ></el-input>
                    </el-form-item>

                    <!-- 父级分类 -->
                    <el-form-item label="父级分类">
                        <el-cascader
                            v-model="selectedKeys"
                            :options="cascaderList"
                            :props="cascaderProps"
                            @change="handleChange"
                            placeholder="请选择父级分类"
                            clearable
                        ></el-cascader>
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
                        @click="addCate"
                    >
                        确 定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑分类对话框 -->
            <el-dialog
                title="修改分类信息"
                :visible.sync="editDialog"
                width="=50%"
                @closed="closeEditDialog"
            >
                <el-form
                    ref="editCateFormRef"
                    label-width="80px"
                    :model="editCateForm"
                    :rules="editCateFormRules"
                >
                    <el-form-item label="分类名称">
                        <el-input v-model="editCateForm.cat_name"></el-input>
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
                        @click="editCate"
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
        name: 'Cate',
        data() {
            return {
                // 请求商品分类要传递的数据
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },

                // 商品分类的列表数据
                cateList: [],
                // 数据总条数
                total: 0,

                // 控制添加对话框的显示 / 隐藏
                addDialog: false,
                // 添加分类的表单
                addCateForm: {
                    // 分类名称
                    cat_name: '',
                    // 父级id
                    cat_pid: 0,
                    // 分类层架，默认 0 一级分类
                    cat_level: 0,
                },
                // 添加分类的表单验证规则
                addCateRules: {
                    cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
                },
                // 级联选择器的值
                selectedKeys: [],
                // 级联分类数据
                cascaderList: [],
                // 级联分类配置项
                cascaderProps: {
                    expandTrigger: 'hover',
                    children: 'children',
                    value: 'cat_id',
                    label: 'cat_name',
                    checkStrictly: true,
                },

                // 控制编辑对话框的显示 / 隐藏
                editDialog: false,
                // 编辑分类的表单
                editCateForm: {
                    cat_id: 0,
                    cat_name: '',
                },
                // 原先的分类名字
                currentName: '',
                // 编辑分类的验证规则
                editCateFormRules: {
                    cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
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
                const { data: res } = await this.$axios
                    .get('categories', {
                        params: this.queryInfo,
                    })
                    .catch(err => {
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
                this.cateList = res.data.result
                this.total = res.data.total
            },
            // 点击单行展开
            expandRow(row) {
                this.$refs.cateListRef.toggleRowExpansion(row)
            },

            // 单页条数变化
            async handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                // 发请求
                this.getCateList()
            },

            // 当前页数变化
            handleCurrentChange(currentPage) {
                this.queryInfo.pagenum = currentPage
                // 发请求
                this.getCateList()
            },

            /* 添加分类 */
            // 显示添加分类对话框
            showAddDialog() {
                this.addDialog = true
                this.getCascaderList()
            },
            // 关闭添加对话框
            closeAddDialog() {
                this.addCateForm.cat_name = ''
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
                this.selectedKeys = []
            },
            // 获取级联选择器列表
            async getCascaderList() {
                const { data: res } = await this.$axios
                    .get('categories', {
                        params: { type: 2 },
                    })
                    .catch(err => {
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
                this.cascaderList = res.data
            },
            // 选择父级分类后
            handleChange() {
                // console.log(this.selectedKeys)
                // selectedKeys 长度大于 0 ，证明选择的父级分类
                if (this.selectedKeys.length > 0) {
                    // 父级分类时 selectedKeys 数组的最后一个值
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    // 分类等级就是 selectedKeys 的长度
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            // 发起请求，添加分类
            addCate() {
                // console.log(this.addCateForm)
                // 验证数据是否合法
                this.$refs.addCateFormRef.validate(async isAdopt => {
                    // 验证不通过
                    if (!isAdopt) return
                    // 验证通过，关掉对话框并发起请求
                    this.addDialog = false
                    const { data: res } = await this.$axios
                        .post('categories', this.addCateForm)
                        .catch(err => {
                            this.errMsg(err)
                        })
                    if (res.meta.status !== 201) {
                        return this.$message({
                            message: res.meta.msg,
                            type: 'error',
                            duration: 1000,
                        })
                    }

                    this.$message({
                        message: '添加分类成功',
                        type: 'success',
                        duration: 1000,
                    })
                    this.getCateList()
                })
            },

            /* 编辑分类 */
            // 显示编辑对话框
            showEditDialog(cate, event) {
                // 阻止冒泡事件，防止点击按钮展开整行
                event.stopPropagation()
                this.editDialog = true
                this.getCateName(cate.cat_id)
            },
            // 根据id获取分类名称
            async getCateName(id) {
                const { data: res } = await this.$axios.get(`categories/${id}`).catch(err => {
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
                this.editCateForm.cat_id = id
                this.editCateForm.cat_name = res.data.cat_name
                this.currentName = res.data.cat_name
            },
            // 关闭编辑对话框
            closeEditDialog() {
                this.$refs.editCateFormRef.resetFields()
            },
            // 发起编辑请求
            editCate() {
                // console.log(this.editCateForm)
                // 校验数据是否合法
                this.$refs.editCateFormRef.validate(async isAdopt => {
                    // 校验未通过
                    if (!isAdopt) return

                    // 校验通过
                    // 关闭对话框
                    this.editDialog = false
                    // 如果没有改变信息，则不发起请求
                    if (this.currentName === this.editCateForm.cat_name) {
                        return
                    }
                    // 改变了信息，发起请求
                    const { data: res } = await this.$axios
                        .put(`categories/${this.editCateForm.cat_id}`, {
                            cat_name: this.editCateForm.cat_name,
                        })
                        .catch(err => {
                            this.errMsg(err)
                        })

                    console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message({
                            message: res.meta.msg,
                            type: 'error',
                            duration: 1000,
                        })
                    }
                    this.$message({
                        message: '修改分类信息成功',
                        type: 'success',
                        duration: 1000,
                    })
                    this.getCateList()
                })
            },

            /* 删除分类 */
            deleteCate(cate, event) {
                event.stopPropagation()
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(async () => {
                        // console.log(cate)
                        const { data: res } = await this.$axios
                            .delete(`categories/${cate.cat_id}`)
                            .catch(err => {
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
                            message: '删除分类成功',
                            type: 'success',
                            duration: 1000,
                        })
                        this.getCateList()
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                            duration: 1000,
                        })
                    })
            },
        },
        created() {
            this.getCateList()
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
    .el-cascader {
        width: 100%;
    }
</style>
