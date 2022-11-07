<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 用户表格 -->
            <el-table
                :data="rightsList"
                border
                stripe
            >
                <!-- 序号列 -->
                <el-table-column
                    type="index"
                    label="序号"
                    width="50px"
                ></el-table-column>

                <!-- 权限名称列 -->
                <el-table-column
                    prop="authName"
                    label="权限名称"
                ></el-table-column>

                <!-- 路径列 -->
                <el-table-column
                    prop="path"
                    label="路径"
                ></el-table-column>

                <!-- 权限等级列 -->
                <el-table-column
                    prop="level"
                    label="权限等级"
                >
                    <template v-slot="scpoe">
                        <el-tag v-if="scpoe.row.level === '0'">一级权限</el-tag>
                        <el-tag
                            v-if="scpoe.row.level === '1'"
                            type="success"
                        >
                            二级权限
                        </el-tag>
                        <el-tag
                            v-if="scpoe.row.level === '2'"
                            type="warning"
                        >
                            三级权限
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Rights',
        data() {
            return {
                // 权限列表
                rightsList: [],
            }
        },
        methods: {
            async getRightsList() {
                const { data: res } = await this.$axios({
                    method: 'get',
                    url: 'rights/list',
                })
                // console.log(res)
                this.rightsList = res.data
                // console.log(this.rightsList)
            },
        },
        created() {
            this.getRightsList()
        },
    }
</script>

<style></style>
