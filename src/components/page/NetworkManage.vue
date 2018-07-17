<template>
    <div class="networkmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-phone-outline"></i>网络管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="select_hasPublic" placeholder="选择网络性质" class="handle-select mr10">
                    <el-option key="1" label="公共网络" value="true"></el-option>
                    <el-option key="2" label="非公共网络" value="false"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary"  icon="el-icon-refresh" style="float: right" @click="syncNetwork">同步</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" style="float: right" @click="handleCreate">创建</el-button>
            </div>

            <!--用户信息展示部分-->
            <el-table
                :data="netWorkInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="name" label="网络名称" >
                </el-table-column>
                <el-table-column prop="scope" label="覆盖范围" >
                </el-table-column>
                <el-table-column prop="hasIpv6" label="是否开启ipv6" >
                </el-table-column>
                <el-table-column prop="hasPublic" label="网络性质" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <p style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i></p>
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

            <!--创建网络信息的模态框-->
            <div class="networkForm">
                <el-dialog title="创建网络" :visible.sync="networkFormVisible" >
                    <el-form :model="networkForm" >
                        <el-form-item label="网络名称" :label-width="formLabelWidth"  :rules="{
                             required: true, message: '网络名称不能为空', trigger: 'blur' }">
                            <el-input v-model="networkForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网络驱动" :label-width="formLabelWidth" :rules="{
                             required: true, message: '网络驱动不能为空', trigger: 'blur' }">
                            <el-input v-model="networkForm.driver" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网络标签" :label-width="formLabelWidth">
                            <el-input v-model="networkForm.labels" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="是否开启ipv6" :label-width="formLabelWidth">
                            <el-input v-model="networkForm.hasIpv6" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="createNetwork">确 定</el-button>
                    </div>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "NetworkManage",
        data(){
            return{
                // 搜索网络输入的名称
                select_hasPublic:'',
                // 网络列表信息
                netWorkInfo:[{
                    "id": "ae736f9a7b14dfcc8fe97bd2f57858078ec827d978eb5569863184b1a5ddcf9e",
                    "name": "none",
                    "scope": "local",
                    "driver": "null",
                    "hasInternal": false,
                    "hasIpv6": false,
                    "labels": "{}",
                    "hasPublic": true,
                    "userId": null,
                    "createDate": "2018-07-14 16:53:51",
                    "updateDate": null
                }],
                // 分页属性
                currentPage:1,
                totalCount:0,
                // 创建网络发送的信息
                networkForm:{
                name: '',
                driver: '',
                labels: '',
                hasIpv6: ''
                },
                networkFormVisible:false,
                formLabelWidth:'120px'
            }
        },
        methods:{
            // 获取网络列表信息
            getNetworkInfo:function(){
                this.$axios.get('/network/listAll' + "?current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "获取网络信息成功！",
                                showClose: true
                            })
                            this.netWorkInfo = response.data.data.records;
                            for(var i=0; i< this.netWorkInfo.length; i++){
                                if(this.netWorkInfo[i].hasPublic){
                                    this.netWorkInfo[i].hasPublic = '公共网络'
                                }else {
                                    this.netWorkInfo[i].hasPublic = '非公共网络'
                                }
                                if(this.netWorkInfo[i].hasIpv6){
                                    this.netWorkInfo[i].hasIpv6 = '是'
                                }else {
                                    this.netWorkInfo[i].hasIpv6 = '否'
                                }
                            }
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: "获取网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索网络名称
            search:function f() {
                this.$axios.get('/network/listAll' + "?hasPublic=" + this.select_hasPublic + "&current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "搜索网络信息成功！",
                                showClose: true
                            })
                            this.netWorkInfo = response.data.data.records;
                            for(var i=0; i< this.netWorkInfo.length; i++){
                                if(this.netWorkInfo[i].hasPublic){
                                    this.netWorkInfo[i].hasPublic = '公共网络'
                                }else {
                                    this.netWorkInfo[i].hasPublic = '非公共网络'
                                }
                                if(this.netWorkInfo[i].hasIpv6){
                                    this.netWorkInfo[i].hasIpv6 = '是'
                                }else {
                                    this.netWorkInfo[i].hasIpv6 = '否'
                                }
                            }
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: "获取网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 同步网络信息
            syncNetwork:function () {
                this.$axios.get('/network/sync')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "同步网络信息成功！",
                                showClose: true
                            })
                        }else {
                            this.$message.error({
                                message: "同步网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击创建按钮
            handleCreate:function(){
                this.networkFormVisible = true;
            },
            // 创建网络信息
            createNetwork:function(){
                this.networkFormVisible = false;
                this.$axios.post('/network/public/create',{
                    name: this.networkForm.name,
                    driver:this.networkForm.driver,
                    labels: this.networkForm.labels,
                    hasIpv6: this.networkForm.hasIpv6
                })
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "创建网络信息成功！",
                                showClose: true
                            })
                            this.getNetworkInfo();
                        }else {
                            this.$message.error({
                                message: "创建网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 删除网络信息
            handleDelete:function(index, row){
                this.$axios.delete('/network/delete/' + row.id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "删除网络信息成功！",
                                showClose: true
                            })
                        }else{
                            this.$message.error({
                                message: "删除网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页
            handleCurrentChange:function (val) {
                this.$axios.get('/network/listAll' + "?current=" + val + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.netWorkInfo = response.data.data.records;
                            for(var i=0; i< this.netWorkInfo.length; i++){
                                if(this.netWorkInfo[i].hasPublic){
                                    this.netWorkInfo[i].hasPublic = '公共网络'
                                }else {
                                    this.netWorkInfo[i].hasPublic = '非公共网络'
                                }
                                if(this.netWorkInfo[i].hasIpv6){
                                    this.netWorkInfo[i].hasIpv6 = '是'
                                }else {
                                    this.netWorkInfo[i].hasIpv6 = '否'
                                }
                            }
                        }else {
                            this.$message.error({
                                message: "获取网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getNetworkInfo();
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
        width: 150px;
        display: inline-block;
    }

</style>
