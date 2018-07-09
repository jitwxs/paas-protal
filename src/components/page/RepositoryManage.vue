<template>
    <div class="imagemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>仓储管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--创建仓储的模态框-->
        <div class="repositoryForm">
            <el-dialog title="创建仓储" :visible.sync="dialogFormVisible" style="width: 800px;margin-left: 18%">
                <el-form :model="repositoryForm" >
                    <el-form-item label="仓储类型" :label-width="formLabelWidth">
                        <el-input v-model="repositoryForm.type" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="仓储地址" :label-width="formLabelWidth">
                        <el-input v-model="repositoryForm.address" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="createRepository">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <el-button type="primary"  @click="dialogFormVisible = true"  style="float: right;margin-right: 3%;margin-bottom: 2%;margin-top: 2%">创建仓储</el-button>
        <!--展示仓储信息-->
        <div class="container">
            <el-table :data="repositoryInfo" border style="width: 100%" ref="repositoryInfo">
                <el-table-column prop="id" label="仓储id"  width="330">
                </el-table-column>
                <el-table-column prop="type" label="仓储类型" width="330">
                </el-table-column>
                <el-table-column prop="address" label="仓储地址" width="350">
                </el-table-column>
            </el-table>
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
        name: "RepositoryManage",
        data(){
            return{
                // 仓储信息
                repositoryInfo:[],
                // 分页当前页码
                currentPage: 1,
                // 分页总条数
                totalCount:0,
                // 创建仓储的模态框的相关属性
                dialogFormVisible:false,
                formLabelWidth: '80px',
                repositoryForm:{
                    type:'',
                    address:''
                },
            }
        },
        methods:{
            getRepositoryInfo:function(){
                this.$axios.get('/repository/list' + "?current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0) {
                            this.repositoryInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message:"获取仓储信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            handleCurrentChange:function (val) {
                this.$axios.get('/repository/list' + "?current=" + val + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0) {
                            this.repositoryInfo = response.data.data.records;
                        }else {
                            this.$message.error({
                                message:"获取仓储信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            createRepository:function () {
                this.$axios.post('/repository/create',{
                    "type": this.repositoryForm.type,
                    "address": this.repositoryForm.address,
                })
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0) {
                            this.dialogFormVisible = false,

                            this.getRepositoryInfo();
                            this.repositoryForm = []
                        }else {
                            this.$message.error({
                                message:"获取仓储信息失败！",
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
            this.getRepositoryInfo();
        }
    }
</script>

<style scoped>

</style>
