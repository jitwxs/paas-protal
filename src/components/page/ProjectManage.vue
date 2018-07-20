<template>
    <div class="projectmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>项目管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-input v-model="select_projectName" placeholder="输入项目名称" class="handle-input mr10"></el-input>
                <el-input v-model="select_userName" placeholder="输入用户名" class="handle-input mr10"></el-input>
                <el-date-picker
                    v-model="dateInterval"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm"
                    :picker-options="datePicker"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
                <el-button type="primary" icon="search" @click="search" >搜索</el-button>
            </div>
            <!--项目信息展示区域-->
            <el-table :data="projectInfo"  style="width: 100%" ref="projectInfo">
                <el-table-column prop="name" label="项目名称" >
                </el-table-column>
                <el-table-column prop="username" label="用户名" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <router-link :to="{path:'/ProjectDetails', query:{id:scope.row.id}}">
                                <li style="float: left;margin-left: 5px;color: #409EFF;cursor:pointer">详情</li>
                            </router-link>
                        </ul>
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
                select_userName:'',
                // 项目信息列表
                projectInfo: [{
                    name: '',
                    userId: '',
                }],
                // 当前页码
                currentPage: 1,
                // 当前项目的总条数
                totalCount: 0,
                projectmore: false,
                activeName: 'first',
                projectTab:[],

                labelpos:'left',
                logTotal:0,
                logPageContent:0,
                logdata:[{createDate:'',containerName:'',description:'',}],
                rowid : '',
                datePicker: {
                    shortcuts: [{
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateInterval:[]
            }
        },
        methods:{
            getProjectInfo: function () {
                this.$axios.get('/project/list' + '?current=' + this.currentPage + "&size=10")
                    .then(response => {
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
                this.$axios.get('/project/list' + '?current=' + val + "&size=10")
                    .then(response => {
                        this.projectInfo = response.data.data.records;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 按照搜索条件筛选项目信息
            search: function () {
                let url = '/project/list'+ "?name=" + this.select_projectName +
                    "&username=" +  this.select_userName +  "&current=" + this.currentPage + "&size=10";
                if(this.dateInterval !== null && this.dateInterval.length === 2) {
                    let startDate = dateFormatter(this.dateInterval[0]), endDate = dateFormatter(this.dateInterval[1]);
                    url += "&startDate=" + startDate + "&endDate=" + endDate;
                }

                this.$axios.get(url)
                    .then(response=>{
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
