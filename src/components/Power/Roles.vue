<template>
    <div class="roles">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 角色添加按钮 -->
            <el-row>
                <el-col>
                    <el-button
                        type="primary"
                        @click="addDialog = true"
                    >
                        添加角色
                    </el-button>
                </el-col>
            </el-row>

            <!-- 角色表格 -->
            <el-table
                :data="rolesList"
                border
                stripe
            >
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row
                            v-for="(r1, index) in scope.row.children"
                            :key="r1.id"
                            class="right_row item_center"
                            :class="['tagbottomb', index === 0 ? 'tagtopb' : '']"
                        >
                            <!-- 一级权限 -->
                            <el-col
                                :span="5"
                                class="tight1"
                            >
                                <el-tag
                                    closable
                                    @close="closeTag(scope.row, r1.id)"
                                >
                                    {{ r1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <el-row
                                    v-for="(r2, index) in r1.children"
                                    :key="r2.id"
                                    class="item_center"
                                    :class="[index === 0 ? '' : 'tagtopb']"
                                >
                                    <!-- 二级 -->
                                    <el-col :span="6">
                                        <el-tag
                                            @close="closeTag(scope.row, r2.id)"
                                            closable
                                            type="success"
                                        >
                                            {{ r2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级 -->
                                    <el-col :span="18">
                                        <el-tag
                                            @close="closeTag(scope.row, r3.id)"
                                            class="right3"
                                            v-for="(r3, index) in r2.children"
                                            :key="r3.id"
                                            closable
                                            type="warning"
                                        >
                                            {{ r3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <!-- 序号列 -->
                <el-table-column
                    type="index"
                    label="序号"
                    width="50px"
                ></el-table-column>

                <!-- 角色名称 -->
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                ></el-table-column>

                <!-- 角色描述 -->
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                ></el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <!-- 编辑按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showEditDialog(scope.row)"
                            round
                        >
                            编辑
                        </el-button>

                        <!-- 删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            round
                            @click="deleteRoles(scope.row)"
                        >
                            删除
                        </el-button>

                        <!-- 分配角色按钮 -->
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showSetRightsDialog(scope.row)"
                            round
                        >
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色对话框 -->
            <el-dialog
                title="添加角色"
                :visible.sync="addDialog"
                width="30%"
                @closed="closeAddDialog"
            >
                <el-form
                    ref="addRolesRef"
                    :model="addRolesForm"
                    :rules="addRolesRules"
                    label-width="100px"
                    class="add_Roles_form"
                    status-icon
                >
                    <!-- 角色名称 -->
                    <el-form-item
                        label="角色名称"
                        prop="roleName"
                    >
                        <el-input
                            prefix-icon="el-icon-user"
                            v-model="addRolesForm.roleName"
                        ></el-input>
                    </el-form-item>

                    <!-- 角色描述 -->
                    <el-form-item
                        label="角色描述"
                        prop="roleDesc"
                    >
                        <el-input
                            prefix-icon="el-icon-document"
                            v-model="addRolesForm.roleDesc"
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
                        @click="addRole"
                    >
                        确 定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑角色对话框 -->
            <el-dialog
                title="编辑角色信息"
                :visible.sync="editDialog"
                width="30%"
                @closed="closeEditDialog"
            >
                <el-form
                    ref="editRolesRef"
                    :model="editRolesForm"
                    :rules="addRolesRules"
                    label-width="100px"
                    class="edit_Roles_form"
                    status-icon
                >
                    <!-- 角色名称 -->
                    <el-form-item
                        label="角色名称"
                        prop="roleName"
                    >
                        <el-input
                            prefix-icon="el-icon-user"
                            v-model="editRolesForm.roleName"
                        ></el-input>
                    </el-form-item>

                    <!-- 角色描述 -->
                    <el-form-item
                        label="角色描述"
                        prop="roleDesc"
                    >
                        <el-input
                            prefix-icon="el-icon-document"
                            v-model="editRolesForm.roleDesc"
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
                        @click="editRole"
                    >
                        确 定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 分配权限对话框 -->
            <el-dialog
                title="分配角色权限"
                :visible.sync="setRightsDialog"
                width="40%"
                @closed="closeSetRightsDialog"
            >
                <div class="tree_container">
                    <el-tree
                        ref="treeRef"
                        :data="rightList"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="checkedRightList"
                        :props="treeProps"
                    ></el-tree>
                </div>

                <!-- 按钮区域 -->
                <span
                    slot="footer"
                    class="dialog-footer"
                >
                    <el-button @click="setRightsDialog = false">取 消</el-button>
                    <el-button
                        type="primary"
                        @click="setRights"
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
        name: 'Roles',
        data() {
            return {
                rolesList: [],
                // 控制添加角色对话框隐藏 / 显示
                addDialog: false,
                // 添加角色的表单
                addRolesForm: {
                    roleName: '',
                    roleDesc: '',
                },
                // 添加角色验证规则
                addRolesRules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '角色名在 1 到 10 个字符', trigger: 'blur' },
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        {
                            min: 5,
                            max: 20,
                            message: '角色描述在 5 到 20 个字符之间',
                            trigger: 'blur',
                        },
                    ],
                },

                // 控制编辑角色信息对话框的显示 / 隐藏
                editDialog: false,
                // 编辑角色的表单
                editRolesForm: {},
                // 验证角色规则和添加一样，直接复用，所以 略

                // 控制权限设置对话框的显示 / 隐藏
                setRightsDialog: false,
                // 权限列表
                rightList: [],
                // 树形配置
                treeProps: {
                    children: 'children',
                    label: 'authName',
                },
                // 默认勾选的权限id
                checkedRightList: [],
                // 保存当前正在分配权限的角色的 id
                roleId: 0,
            }
        },
        methods: {
            // 获取角色列表
            async getRolesList() {
                const { data: res } = await this.$axios.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message({
                        message: '获取角色列表失败',
                        type: 'error',
                        duration: 1000,
                    })
                }
                this.rolesList = res.data
                // console.log(this.rolesList)
            },

            // 关闭添加对话框时重置表单
            closeAddDialog() {
                this.$refs.addRolesRef.resetFields()
            },
            // 发起添加请求
            addRole() {
                // 验证信息并请求服务端
                this.$refs.addRolesRef.validate(isAdopt => {
                    // 验证不通过
                    if (!isAdopt) return

                    // 验证通过，关闭对话框，发起请求
                    this.addDialog = false
                    this.$axios({
                        method: 'post',
                        url: 'roles',
                        data: this.addRolesForm,
                    })
                        .then(res => {
                            if (res.data.meta.status !== 201) {
                                return this.$message({
                                    message: '添加角色失败',
                                    type: 'error',
                                    duration: 1000,
                                })
                            }
                            // 添加成功
                            this.$message({
                                message: '添加角色成功',
                                type: 'success',
                                duration: 1000,
                            })
                            this.getRolesList()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            },

            // 角色操作
            // 关闭编辑对话框时重置表单
            closeEditDialog() {
                this.$refs.editRolesRef.resetFields()
            },
            // 显示编辑对话框
            showEditDialog(role) {
                this.editDialog = true
                // console.log(role)
                this.$axios({
                    method: 'get',
                    url: `roles/${role.id}`,
                })
                    .then(res => {
                        // console.log(res.data)
                        this.editRolesForm = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            // 发起编辑请求
            editRole() {
                // 验证信息
                this.$refs.editRolesRef.validate(isAdopt => {
                    // 验证不通过
                    if (!isAdopt) return

                    // 验证通过，关闭对话框，发起请求
                    this.editDialog = false
                    this.$axios({
                        method: 'put',
                        url: `roles/${this.editRolesForm.roleId}`,
                        data: {
                            roleName: this.editRolesForm.roleName,
                            roleDesc: this.editRolesForm.roleDesc,
                        },
                    }).then(res => {
                        // console.log(res.data)
                        if (res.data.meta.status !== 200) {
                            return this.$message({
                                message: res.data.meta.msg,
                                type: 'error',
                                duration: 1000,
                            })
                        }
                        this.$message({
                            message: '修改角色信息成功',
                            type: 'success',
                            duration: 1000,
                        })
                        this.getRolesList()
                    })
                })
            },
            // 删除角色
            deleteRoles(role) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        // 确认删除，发起请求
                        this.$axios({
                            method: 'delete',
                            url: `roles/${role.id}`,
                        })
                            .then(res => {
                                if (res.data.meta.status !== 200) {
                                    return this.$message({
                                        message: res.data.meta.msg,
                                        type: 'error',
                                        duration: 1000,
                                    })
                                }
                                this.$message({
                                    message: '角色删除成功',
                                    type: 'success',
                                    duration: 1000,
                                })
                                this.getRolesList()
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

            // 角色权限操作
            // 删除权限
            closeTag(role, rightId) {
                this.$confirm('此操作将移除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        // console.log(role, rightId)
                        // 确认删除，发起请求
                        this.$axios({
                            method: 'delete',
                            url: `roles/${role.id}/rights/${rightId}`,
                        })
                            .then(res => {
                                if (res.data.meta.status !== 200) {
                                    return this.$message({
                                        message: res.data.meta.msg,
                                        type: 'error',
                                        duration: 1000,
                                    })
                                }
                                this.$message({
                                    message: '权限移除成功',
                                    type: 'success',
                                    duration: 1000,
                                })
                                // this.getRolesList()
                                role.children = res.data.data
                            })
                            .catch(err => {
                                this.$message({
                                    message: '权限移除失败',
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
            // 关闭分配权限对话框
            closeSetRightsDialog() {
                this.checkedRightList = []
            },
            // 显示分配权限对话框
            showSetRightsDialog(role) {
                this.roleId = role.id
                this.$axios({
                    method: 'get',
                    url: 'rights/tree',
                })
                    .then(res => {
                        // console.log(res.data)
                        this.rightList = res.data.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                this.getCheckedRightList(role)
                // 加定时器，否则会出现复选框闪现之前的勾选情况
                setTimeout(() => {
                    this.setRightsDialog = true
                }, 50)

                // console.log(role)
            },
            // 获取默认勾选的权限id并存在数组中
            getCheckedRightList(node) {
                // node.children 为假，即是最后一层，将 id 存入数组
                if (!node.children) {
                    return this.checkedRightList.push(node.id)
                }
                // 不是最后一层，遍历本层的所有 children ，执行 getCheckedRightList
                node.children.forEach(cnode => {
                    this.getCheckedRightList(cnode)
                })
            },
            // 发起请求设置权限
            setRights() {
                const checkedKeys = this.$refs.treeRef.getCheckedKeys()
                const halfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
                const list = [...checkedKeys, ...halfCheckedKeys]
                const listStr = list.join(',')
                // console.log(listStr)
                this.setRightsDialog = false
                // 发起请求
                this.$axios({
                    method: 'post',
                    url: `roles/${this.roleId}/rights`,
                    data: {
                        rids: listStr,
                    },
                })
                    .then(res => {
                        // console.log(res.data)
                        if (res.data.meta.status !== 200) {
                            return this.$message({
                                message: '修改权限失败',
                                type: 'error',
                                duration: 1000,
                            })
                        }
                        this.$message({
                            message: '修改权限成功',
                            type: 'success',
                            duration: 1000,
                        })
                        this.getRolesList()
                    })
                    .catch(err => {
                        this.$message({
                            message: err.message,
                            type: 'error',
                            duration: 1000,
                        })
                    })
            },
        },
        created() {
            this.getRolesList()
        },
    }
</script>

<style lang="less" scoped>
    .el-table {
        margin-top: 15px;
    }
    .right_row {
        margin-left: 48px;
    }
    .el-tag {
        margin: 10px;
    }
    .tagtopb {
        border-top: 1px solid #ebeef5;
    }
    .tagbottomb {
        border-bottom: 1px solid #ebeef5;
    }
    .right3 {
        margin-right: 3px;
    }
    .item_center {
        display: flex;
        align-items: center;
    }
    .tree_container {
        height: 400px;
        overflow: auto;
    }
</style>
