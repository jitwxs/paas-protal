<template>
    <div class="servicemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-service"></i>服务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div class="handle-box">
                <div style="margin-top: -10px;margin-bottom: 10px">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">创建</el-button>
                </div>
            </div>

            <!--服务信息展示部分-->
            <el-table
                :data="serviceInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="name" label="服务名称" >
                </el-table-column>
                <el-table-column prop="statusName" label="服务状态" >
                </el-table-column>
                <el-table-column prop="projectName" label="服务项目" >
                </el-table-column>
                <el-table-column prop="image" label="服务镜像" >
                </el-table-column>
                <el-table-column prop="replicas" label="横向扩展" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">更多</li>
                            <li style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i></li>
                        </ul>
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

            <!--创建服务信息的form表单-->
            <div class="createService">
                <el-dialog title="创建服务" :visible.sync="serviceFormVisible" >
                    <el-form :model="serviceForm" >
                        <el-form-item label="镜像id" :label-width="formLabelWidth"  :rules="{
                             required: true, message: '镜像id不能为空', trigger: 'blur' }">
                            <el-input v-model="serviceForm.imageId" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="服务名称" :label-width="formLabelWidth" :rules="{
                             required: true, message: '服务名称不能为空', trigger: 'blur' }">
                            <el-input v-model="serviceForm.driver" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网络标签" :label-width="formLabelWidth">
                            <el-input v-model="serviceForm.labels" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="是否开启ipv6" :label-width="formLabelWidth">
                            <el-input v-model="serviceForm.hasIpv6" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="create">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
    </div>
    </div>
</template>

<script>
    export default {
        name: "ServiceManage",
        data(){
            return{
                // 服务信息列表
                serviceInfo:[],
                // 创建服务信息的表单
                serviceFormVisible:false,
                formLabelWidth:'120px',
                serviceForm:{

                },
                // 分页信息
                currentPage:1,
                totalCount:0,


            }
        },
        methods:{
            // 获取服务信息
            getServiceInfo:function(){
                this.$axios.get('/service/list' + "?current=1" + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"获取服务信息成功！",
                                showClose:true
                            })
                            this.serviceInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        }else{
                            this.$message.error({
                                message:"获取服务信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击创建按钮触发的操作
            handleCreate:function(){
                this.serviceFormVisible = true;
            },
            // 创建服务信息
            create:function(){
                this.serviceFormVisible = false;
            },
            // 删除服务信息
            handleDelete:function(index,row){
                this.$axios.delete('/service/delete/' + row.id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"删除服务信息成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message:"删除服务信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页信息
            handleCurrentChange:function (val) {
                this.$axios.get('/service/list' + "?current=" + val +  "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"获取服务信息成功！",
                                showClose:true
                            })
                            this.serviceInfo = response.data.data.records;
                        }else{
                            this.$message.error({
                                message:"获取服务信息失败！",
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
            this.getServiceInfo();
        }
    }
</script>

<style scoped>

</style>
