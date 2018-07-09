<template>
    <div class="projecttocontainer">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>{{projectId}}的容器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-input v-model="select_containerName" placeholder="输入容器名称" class="handle-input mr10"></el-input>
                <el-input v-model="select_containerId" placeholder="输入容器id" class="handle-input mr10"></el-input>

                <el-button type="primary" icon="search" @click="search" >搜索</el-button>
            </div>
            <!--项目信息展示区域-->
            <el-table :data="containerInfo" border style="width: 100%" ref="containerInfo">
                <el-table-column prop="createDate" label="创建日期"  width="180">
                </el-table-column>
                <el-table-column prop="id" label="容器id" width="165">
                </el-table-column>
                <el-table-column prop="name" label="容器名称" width="165">
                </el-table-column>
                <el-table-column prop="image" label="容器镜像" width="165">
                </el-table-column>
                <el-table-column prop="port" label="容器端口" width="180">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <router-link style=" text-decoration: none;" :to="{path:'/projecttocontainer', query:{id:scope.row.id}}">
                            <el-button
                                size="small"
                                type="primary"
                                style=";font-family: 微软雅黑;font-size: 14px;color: white "
                            >查看</el-button>
                        </router-link>

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
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProjectToContainer",
        data(){
          return{
              // 搜索特定条件的容器
              select_containerName:'',
              select_containerId:'',
              // 容器信息列表
              containerInfo:[],
              // 分页当前页码
              currentPage: 1,
              // 分页总条数
              totalCount:0,
              projectId:''
          }
        },
        methods:{
            getProjectContainer:function(){
                this.$axios.get('/container/list/' + this.projectId + '?current=' + this.currentPage + '&size=5')
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.containerInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: "获取容器信息失败！",
                                showClose: true
                            })
                        }
                    }).catch(function (err) {
                    console.log(err)
                })
            },
            search:function () {

            },
            handleCurrentChange:function (val) {
                this.$axios.get('/container/list/' + this.projectId + '?current=' + val + '&size=5')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.containerInfo = response.data.data.records;
                        }else {
                            this.$message.error({
                                message: "获取容器信息失败！",
                                showClose: true
                            })
                        }
                    }).catch(function (err) {
                    console.log(err)
                })
            }
        },

        created(){
            this.projectId = this.$route.query.id;
            this.getProjectContainer();
            console.log(this.projectId)
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
