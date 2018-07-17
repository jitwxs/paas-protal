<template>
    <div class="noticemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i>通知管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="form-box">
                <el-form ref="noticeForm" :model="noticeForm" label-width="80px">
                    <el-form-item label="表单名称">
                        <el-input v-model="noticeForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择器">
                        <el-select v-model="noticeForm.region" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NoticeManage",
        data(){
            return{
                input_title:'',
                noticeForm:[],
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 100px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>
