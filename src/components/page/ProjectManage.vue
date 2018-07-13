<template>
    <div class="projectmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>项目管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-input v-model="select_projectName" placeholder="输入项目名称" class="handle-input mr10"></el-input>
                <el-input v-model="select_projectId" placeholder="输入项目id" class="handle-input mr10"></el-input>

                <el-button type="primary" icon="search" @click="search" >搜索</el-button>
            </div>
            <!--项目信息展示区域-->
            <el-table :data="projectInfo" border style="width: 100%" ref="projectInfo">
                <el-table-column prop="createDate" label="创建日期"  width="180">
                </el-table-column>
                <el-table-column prop="id" label="项目id" width="165">
                </el-table-column>
                <el-table-column prop="name" label="项目名称" width="165">
                </el-table-column>
                <el-table-column prop="description" label="项目描述" width="165">
                </el-table-column>
                <el-table-column prop="userId" label="用户id" width="180">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <router-link style=" text-decoration: none;" :to="{path:'/projecttocontainer', query:{id:scope.row.id}}">
                            <el-button
                                size="small"
                                type="primary"
                                style=";font-family: 微软雅黑;font-size: 14px;color: white "
                                >我的容器</el-button>
                        </router-link>

                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="4"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProjectManage",
        data(){
            return{
                // 搜索项目的关键词
                select_projectName:'',
                select_projectId:'',
                // 项目信息列表
                projectInfo: [{
                    createDate: '',
                    description:'',
                    id: '',
                    name: '',
                    userId: '',
                }],
                // 当前页码
                currentPage: 1,
                // 当前项目的总条数
                totalCount: 0,
            }
        },
        methods:{
            // 实现获取项目信息的功能
            getProjectInfo: function () {
                this.$axios.get('/project/list' + '?current=' + this.currentPage + "&size=4")
                    .then(response => {
                        // console.log(response)
                        if (response.data.code == 0) {
                            this.projectInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "获取项目信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 实现分页的功能
            handleCurrentChange: function (val) {
                this.$axios.get('/project/list' + '?current=' + val + "&size=4")
                    .then(response => {
                        this.projectInfo = response.data.data.records;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 按照搜索条件筛选项目信息
            search: function () {
                this.$axios.get('/project/list'+ "?id=" + this.select_projectId + "&name=" +  this.select_projectName +  "&current=" + this.currentPage + "&size=4")
                    .then(response=>{
                        console.log(response)
                        this.projectInfo = response.data.data.records;
                        this.totalCount = response.data.data.total;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

        },
        created(){
            this.getProjectInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
</style>
