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
                <el-button type="success"  @click="dialogFormVisible = true" >创建项目</el-button>
            </div>
            <!--项目信息展示区域-->
            <el-table :data="projectInfo"  style="width: 100%" >
                <el-table-column prop="name" label="项目名称" >
                </el-table-column>
                <el-table-column prop="description" label="项目描述" >
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <router-link style=" text-decoration: none;" :to="{path:'/projectdetails_u', query:{id:scope.row.id}} ">
                        <el-button size="small" type="success">详情</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>

            <div class="moTaiKuang">
                <el-dialog title="项目信息" :visible.sync="dialogFormVisible">
                    <el-form :model="projectForm">
                        <el-form-item label="项目名称" :label-width="formLabelWidth">
                            <el-input v-model="projectForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="项目描述" :label-width="formLabelWidth">
                            <el-input v-model="projectForm.description" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="success" @click="handleCreate">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProjectManage_u",
        data(){
            return{
                // 展示项目信息数组
                projectInfo:[],

                // 模态框信息的绑定
                projectForm:{
                    name:'',
                    description:''
                },
                formLabelWidth:'120px',

                // 创建模态框的显示属性
                dialogFormVisible:false,

                // 分页属性
                currentPage:1,
                totalCount:0,
            }
        },
        methods:{
            // 获取普通用户项目信息
            getProjectInfo:function(){
                this.$axios.get('/project/self/list' + "?current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.projectInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        }else{
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },



            // 创建项目的请求
            handleCreate:function(){
                this.$axios.post('/project/create',{
                    "name":this.projectForm.name,
                    "description":this.projectForm.description,
                })
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"创建项目成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message:"创建项目失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 删除项目的请求
            handleDelete:function(index,row){
                this.$axios.delete('/project/delete/' + row.id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"删除项目信息成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message:"删除项目信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页请求
            handleCurrentChange:function (val) {
                this.$axios.get('/project/self/list' + "?current=" + val + "&size=5")
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.projectInfo = response.data.data.records;
                        }else{
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }

        },
        created(){
            this.getProjectInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
        float: right;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
</style>
