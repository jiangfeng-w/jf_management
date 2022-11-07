<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div @click="toHome">
                <img
                    src="../assets/logo.jpg"
                    alt="头像"
                />
                <span>电商管理系统</span>
            </div>
            <el-button
                type="info"
                @click="toLogout"
            >
                退出登录
            </el-button>
        </el-header>
        <el-container>
            <!-- 侧边导航栏 -->
            <el-aside :width="isCollapse ? '64px' : '180px'">
                <!-- 折叠按钮 -->
                <div
                    class="toggle-button"
                    @click="toggleCollapse"
                >
                    | | |
                </div>
                <el-menu
                    background-color="#313743"
                    text-color="#fff"
                    active-text-color="#409eff"
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="$router.currentRoute.name"
                >
                    <el-menu-item
                        index="welcome"
                        @select="selectWel"
                    >
                        <i class="el-icon-star-on"></i>
                        <span slot="title">欢迎</span>
                    </el-menu-item>

                    <el-submenu
                        :index="String(firstMenu.id)"
                        v-for="firstMenu in menuList"
                        :key="firstMenu.id"
                    >
                        <!-- 一级菜单 -->
                        <template slot="title">
                            <i :class="iconsObj[firstMenu.id]"></i>
                            <span>{{ firstMenu.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="String(secondMenu.path)"
                            v-for="secondMenu in firstMenu.children"
                            :key="secondMenu.id"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ secondMenu.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                // 菜单栏数据
                menuList: [],
                // 一级菜单图标
                iconsObj: {
                    125: 'iconfont icon-user',
                    103: 'iconfont icon-tijikongjian',
                    101: 'iconfont icon-shangpin',
                    102: 'iconfont icon-danju',
                    145: 'iconfont icon-baobiao',
                },
                // 是否折叠菜单
                isCollapse: false,
            }
        },
        methods: {
            // 登出
            toLogout() {
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            },
            // 点击标题文字回到主页
            toHome() {
                this.$router.push('/home')
            },
            // 进入页面就获取信息
            getMenusList() {
                this.$axios({
                    methods: 'get',
                    url: 'menus',
                }).then(res => {
                    const data = res.data
                    // console.log(data)
                    // 请求失败
                    if (data.meta.status !== 200) {
                        return this.$message({
                            message: '获取菜单列表失败',
                            type: 'error',
                            duration: 1000,
                        })
                    }
                    // 请求成功
                    this.$message({
                        message: data.meta.msg,
                        type: 'success',
                        duration: 1000,
                    })
                    this.menuList = data.data
                    // console.log(this.menuList)
                })
            },
            // 折叠菜单
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            selectWel(index, path) {
                console.log(index)
            },
        },
        created() {
            this.getMenusList()
        },
    }
</script>

<style lang="less" scoped>
    .home_container {
        height: 100%;
    }
    .el-header {
        background-color: #363d40;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
            display: flex;
            align-items: center;
            img {
                height: 60px;
                border-radius: 50%;
                margin-right: 15px;
            }
            span {
                font-size: 20px;
                cursor: pointer;
            }
        }
    }
    .el-aside {
        background-color: #313743;
        color: #fff;
        transition: 0.5s;
        .el-menu {
            border-right: none;
        }

        .toggle-button {
            width: 100%;
            color: #fff;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            height: 20px;
            cursor: pointer;
        }
    }
    .el-aside::-webkit-scrollbar {
        display: none;
    }
    .iconfont {
        margin-right: 10px;
    }
</style>
