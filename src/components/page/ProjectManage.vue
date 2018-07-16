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
                            <li style="float: left;color: #409EFF;cursor: pointer" @click="projectInfoClick(scope.$index, scope.row)">详情</li>

                            <el-dialog title="项目详情" :visible.sync="projectmore"  @open = "opendialog">
                                <el-tabs v-model="activeName" @tab-click="projectTabSwitch">
                                    <el-tab-pane  label="项目详情" name="first">
                                        <el-form :label-position='labelpos' label-width="80px" >
                                            <el-form-item label="项目id">
                                                <p>{{projectid}}</p>
                                            </el-form-item>
                                            <el-form-item label="项目名称">
                                                <p>{{projectname}}</p>
                                            </el-form-item>
                                            <el-form-item label="用户名">
                                                <p>{{projectuserName}}</p>
                                            </el-form-item>
                                            <el-form-item label="项目描述">
                                                <p>{{projectdescription}}</p>
                                            </el-form-item>
                                            <el-form-item label="创建日期">
                                                <p>{{projectcreateDate}}</p>
                                            </el-form-item>
                                            <el-form-item label="修改日期">
                                                <p>{{projectupdateDate}}</p>
                                            </el-form-item>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="项目日志" name="second">

                                        <el-table
                                            :data="logdata"
                                            style="width: 100%">
                                            <el-table-column
                                                prop="createDate"
                                                label="时间">
                                            </el-table-column>
                                            <el-table-column
                                                prop="containerName"
                                                label="容器名称">
                                            </el-table-column>
                                            <el-table-column
                                                prop="description"
                                                label="事件">
                                            </el-table-column>
                                        </el-table>

                                        <div class="pagination">
                                            <el-pagination
                                                @current-change="logPage"
                                                :current-page.sync="logPageContent"
                                                :page-size="10"
                                                layout="prev, pager, next, jumper"
                                                :total="logTotal">
                                            </el-pagination>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-dialog>
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
                projectid:'',
                projectuserId:'',
                projectname:'',
                projectuserName:'',
                projectdescription:'',
                projectcreateDate:'',
                projectupdateDate:'',
                labelpos:'left',
                logTotal:0,
                logPageContent:0,
                logdata:[{createDate:'',containerName:'',description:'',}],
                rowid : '',
            }
        },


        methods:{
            opendialog(){
                this.activeName = 'first';
                this.logdata = [{createDate:'',containerName:'',description:'',}];
            },

            logPage:function(val){
                console.log(this.rowid);
                this.$axios.get('/project/log/?projectId='+this.rowid+'&?current=' + val + '&size=10')
                    .then(response => {
                        this.logdata = response.data.data.records;
                    }).catch(function (err) {
                    console.log(err)
                })
            },

            projectInfoClick:function(index,row){
                this.projectmore= true;
                this.$axios.get('/project/'+row.id)
                    .then(response => {
                        this.projectid =response.data.data.id;
                        this.projectuserName = response.data.data.username;
                        this.projectname = response.data.data.name;
                        this.projectdescription =response.data.data.description;
                        this.projectcreateDate = response.data.data.createDate;
                        this.projectupdateDate = response.data.data.updateDate;
                        this.rowid = row.id;
                    }).catch(function (err) {
                    console.log(err);
                })
            },
            // 实现获取项目信息的功能
            projectTabSwitch(tab, event) {
                if(this.activeName==='second'){
                    this.$axios.get('/project/log/?projectId='+this.rowid)
                        .then(response => {
                            console.log(response.data.data.records);
                            this.logdata = response.data.data.records;
                            this.logTotal = response.data.data.total;
                        }).catch(function (err) {
                        console.log(err)
                    })
                }
            },

            getProjectInfo: function () {
                this.$axios.get('/project/list' + '?current=' + this.currentPage + "&size=5")
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
                this.$axios.get('/project/list' + '?current=' + val + "&size=5")
                    .then(response => {
                        this.projectInfo = response.data.data.records;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 按照搜索条件筛选项目信息
            search: function () {
                this.$axios.get('/project/list'+ "?name=" + this.select_projectName + "&username=" +  this.select_userName +  "&current=" + this.currentPage + "&size=5")
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
