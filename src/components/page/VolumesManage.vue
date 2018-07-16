<template>
    <div class="vvolumesmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-phone-outline"></i>数据卷管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-input v-model="select_name" placeholder="输入数据卷名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="danger"   style="float: right" @click="clean">清理</el-button>
            </div>

            <!--用户信息展示部分-->
            <el-table
                :data="volumesInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="Name" label="数据卷名称" >
                </el-table-column>
                <el-table-column prop="Driver" label="数据卷驱动" >
                </el-table-column>
                <el-table-column prop="Scope" label="覆盖范围" >
                </el-table-column>
                <el-table-column prop="Status" label="数据卷状态" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="getXiangQingInfo(scope.$index, scope.row)">详情</li>
                            <li style="float: left;color: #409EFF;cursor: pointer;" @click="handleUpload(scope.$index, scope.row)">上传</li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <!--<div class="pagination">-->
                <!--<el-pagination-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page.sync="currentPage"-->
                    <!--:page-size="5"-->
                    <!--layout="prev, pager, next, jumper"-->
                    <!--:total="totalCount">-->
                <!--</el-pagination>-->
            <!--</div>-->

            <!--详情的模态框-->
            <div class="xiangQing">
                <el-dialog
                    title="数据卷详情"
                    :visible.sync="xiangQingVisible"
                    width="30%">
                    <span>
                        <ul style="list-style-type: none">
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷名称：{{xiangQingInfo.Name}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷驱动：{{xiangQingInfo.Driver}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷驱动选项：{{xiangQingInfo.DriverOpts}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷选项：{{xiangQingInfo.Options}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷标签：{{xiangQingInfo.Labels}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷挂载点：{{xiangQingInfo.Mountpoint}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷覆盖范围：{{xiangQingInfo.Scope}}</li>
                            <li style="margin-bottom: 5px;font-family: 微软雅黑;font-size: 14px">数据卷状态：{{xiangQingInfo.Status}}</li>
                        </ul>
                    </span>
                </el-dialog>

            </div>
            <!--上传的模态框-->
            <div class="upload">
                <el-dialog title="上传文件" :visible.sync="uploadFormVisible">
                    <el-form :model="uploadForm">
                        <el-form-item label="数据卷id" :label-width="formLabelWidth">
                            <el-input v-model="uploadForm.id" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="选择文件" :label-width="formLabelWidth">
                            <!--<el-input v-model="uploadForm.file" auto-complete="off"></el-input>-->
                            <el-upload
                                class="upload-demo"
                                :action=url
                                :name=name
                                :headers="headers"
                                :data="uploadForm"
                                :before-upload="beforeUpload"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :before-remove="beforeRemove"
                                :limit="1">
                                <el-button size="small" type="primary">上传视频</el-button>
                                <div slot="tip" class="el-upload__tip"></div>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="uploadVolumes">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "VolumesManage",
        data(){
            return{
                // 搜索输入的关键词
                select_name:'',
                // 数据卷信息
                volumesInfo:[],
                // 详情信息
                xiangQingInfo:{},
                xiangQingVisible:false,

                // 上传相关属性
                uploadFormVisible:false,
                formLabelWidth:'120px',

                uploadForm:{
                    id:'',
                    file:''
                },
                url:'http://192.168.100.142:8080/volumes/upload',
                name:'request',
                headers:{
                    Authorization: 'Bearer ' + sessionStorage.getItem('userToken')
                },

                // 每一行的数据卷id
                volumesId:'',
                // 分页信息
                // currentPage:1,
                // totalCount:0,
            }
        },
        methods:{
            // 获取本地数据卷信息
            getVolumesInfo:function(){
                this.$axios.get('/volumes/list')
                    .then(response=>{
                        // console.log(response)
                        if (response.data.code == 0){
                            this.volumesInfo = response.data.data.Volumes;
                            for(var i=0; i< this.volumesInfo.length; i++){
                                if(this.volumesInfo[i].Scope == 'local'){
                                    this.volumesInfo[i].Scope = '本地'
                                }
                                if(this.volumesInfo[i].Status == null){
                                    this.volumesInfo[i].Status = '无'
                                }
                            }
                        }else {
                            this.$message.error({
                                message:"获取数据卷信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索数据卷
            search:function () {

            },
            // 清理本地数据卷
            clean:function(){
                this.$axios.delete('/volumes/clean')
                    .then(response=>{
                        console.log(response)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            handleUpload:function(index, row){
                this.uploadFormVisible = true;
                this.volumesId = row.id;
            },
            beforeUpload:function(){
                if (this.uploadForm.id == "" || this.uploadForm.file == "") {
                    this.$message.error({
                        message:"请完善需上传的信息!",
                        showClose:true
                    })
                } else{
                    this.url = this.url  + this.uploadForm;
                }
            },
            handlePreview:function(){

            },
            handleRemove:function(){

            },
            handleSuccess:function(){

            },
            beforeRemove:function(){

            },

            // 上传数据卷
            uploadVolumes:function () {
                this.uploadFormVisible = false;
                this.$axios.post('/volumes/upload',{
                    id: this.volumesId,
                    file: this.uploadForm.file
                })
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){

                        }else {
                            this.$message.error({
                                message:"上传数据卷信息失败！",
                                showClose:true
                            })
                        }
                    })
            },
            // 获取数据卷详情
            getXiangQingInfo:function(index, row){
                this.xiangQingVisible = true;
                console.log(row.id)
                this.$axios.get(' /volumes/inspect/' + row.id)
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.xiangQingInfo = response.data.data;
                        }else {
                            this.$message.error({
                                message:"获取数据卷信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页
            handleCurrentChange:function (val) {

            }

        },
        created(){
            this.getVolumesInfo();
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
