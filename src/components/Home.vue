<template>
    <div>
        <el-button
            type="info"
            @click="toLogout"
        >
            退出登录
        </el-button>
    </div>
</template>

<script>
    export default {
        name: 'home',
        methods: {
            toLogout() {
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            },
        },
    }
</script>

<style></style>
