<template>
        <div id="projectDetails">
            <el-tabs v-model="message">
                <el-tab-pane :label="`容器列表`" name="first" style="min-height: 530px">
                    <el-table :data="containerInfo"  style="width: 100%">
                        <el-table-column prop="createDate" label="创建日期">
                        </el-table-column>
                        <el-table-column prop="name" label="容器名称">
                        </el-table-column>
                        <el-table-column prop="status" label="状态编号">
                        </el-table-column>
                        <el-table-column prop="image" label="容器镜像">
                        </el-table-column>
                        <el-table-column prop="port" label="容器端口">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="success"
                                           @click="dialogFormVisible=true">启动</el-button>
                                <el-button size="small" type="success"
                                           @click="dialogFormVisible=true">停止</el-button>
                                <el-button size="small" type="success"
                                           @click="dialogFormVisible=true">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>

                <el-tab-pane :label="`项目信息`" name="second" style="min-height: 530px">
                    <!--项目信息展示区域-->
                    <el-table :data="projectInfo"  style="width: 100%" >
                        <el-table-column prop="createDate" label="创建日期">
                        </el-table-column>
                        <el-table-column prop="id" label="项目id" >
                        </el-table-column>
                        <el-table-column prop="description" label="项目描述">
                        </el-table-column>
                        <el-table-column width="70">
                            <template slot-scope="scope">
                                <el-button size="small" type="success"
                                @click="dialogFormVisible=true">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

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

                </el-tab-pane>

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
                            <el-button type="success" @click="handleEdit">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>

                <el-tab-pane :label="`项目日志`" name="third" style="min-height: 530px">
                    <ul class="time-vertical" v-for="(item,index) in projectLog">
                        <li><b></b><span>{{index + 1}}</span><a href="#">{{item.createDate}}</a></li>
                    </ul>
                </el-tab-pane>

                <el-tab-pane :label="`删除项目`" name="fourth" >
                    <div class="plugins-tips">
                        你确定要删除此项目吗？
                        输入密码执行下一步操作
                    </div>
                    <div class="drag-box">
                        <div class="drag-box-item">
                            <el-col :span="22">
                                <el-input></el-input>
                            </el-col>
                            <el-button :span="2" type="success" size="small" style="float: right"
                            @click="handleDelete">确认</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
</template>

<script>
    export default {
        name: "ProjectDetails_u",
        data(){
            return{
                // 接收项目管理传过来的项目id
                projectId:'',
                // tab页的相关属性
                message:'first',
                // 项目信息
                projectInfo:[],
                // 编辑模态框的显示属性
                projectForm:{
                    name:'',
                    description:''
                },
                dialogFormVisible:false,
                formLabelWidth:'120px',
                // 某个项目的容器列表
                containerInfo:[{
                    name:"fdsjhjd",

                }],
                // 项目日志
                projectLog:[],


                // 分页属性
                currentPage:1,
                totalCount:0,
            }
        },
        methods:{
            // 获取项目其他信息
            getProjectInfo:function(){
                this.$axios.get('/project/self/list' + "?current=" + this.currentPage + "&size=5")
                    .then(response=>{
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
            // 获取项目的容器列表
            getContainerInfo:function(){
              this.$axios.get('/container/list/' + this.projectId)
                  .then(response=>{
                      if(response.data.code == 0){
                          this.containerInfo = response.data.data.records;
                      }else {
                          this.$message.error({
                              message:"获取项目的容器列表信息失败！",
                              showClose:true
                          })
                      }
                  })
                  .catch(function (err) {
                      console.log(err)
                  })
            },
            // 更新项目的请求
            handleEdit:function(){
                this.$axios.put('/project/update',{
                    "id":this.projectId,
                    "name":this.projectForm.name,
                    "description":this.projectForm.description,
                })
                    .then(response=>{
                        if(response.data.code == 0){
                            this.dialogFormVisible = false,
                            this.$message.success({
                                message:"更新项目成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message:"更新项目失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取项目日志信息
            getProjectLog:function () {
                this.$axios.get('/project/log' + '?projectId=' + this.projectId)
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.projectLog = response.data.data.records;
                            console.log(this.projectLog)
                        }else{
                            this.$message.error({
                                message:"获取项目日志信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 项目信息分页操作
            handleCurrentChange:function (val) {
                this.$axios.get('/project/self/list' + "?current=" + val + "&size=5")
                    .then(response=>{
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
            },
            // 删除项目的请求
            handleDelete:function(){
                this.$axios.delete('/project/delete/' + this.projectId)
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
        },
        created(){
            this.projectId = this.$route.query.id;
            this.getProjectInfo();
            this.getProjectLog();
            this.getContainerInfo();
        }
    }
</script>

<style scoped>
    #projectDetails{
        position: relative;
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }
    /*纵向时间轴*/
    .time-vertical {
        list-style-type: none;
        border-left: 1px solid #707070;
        padding: 0px;
        height: 40px;
        margin-left: 20px;
    }

    .time-vertical li {
        height: 100px;
        position: relative;
    }

    .time-vertical li a {
        display: inline-block;
        margin-left: 20px;
        margin-top: 15px;
        text-decoration: none;
        color: #000;
    }

    .time-vertical li b:before {
        content: '';
        position: absolute;
        top: 15px;
        left: -12px;
        width: 18px;
        height: 18px;
        border: 2px solid #67C23A;
        border-radius: 10px;
        background: #67C23A;
    }

    .time-vertical li span {
        position: absolute;
        color: #fff;
        top: 18px;
        left: -6px;
    }
</style>
