<template>
    <div class="vvolumesmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-printer"></i>数据卷管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="select_volumesType" placeholder="选择数据卷类型" class="handle-select mr10">
                    <el-option key="1" label="容器数据卷" value="1"></el-option>
                    <el-option key="2" label="服务数据卷" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search">查看</el-button>
                <el-button type="danger"   style="float: right" @click="clean_container">清理容器</el-button>
                <el-button type="danger"   style="float: right" @click="clean_service">清理服务</el-button>
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

            <!--详情的模态框-->
            <div class="xiangQing">
                <el-dialog
                    title="数据卷详情"
                    :visible.sync="xiangQingVisible"
                    width="50%">
                    <el-form :label-position='labelpos' label-width="80px" :model="xiangQingInfo">
                        <el-form-item label="容器Id">
                            <p>{{xiangQingInfo.Name}}</p>
                        </el-form-item>
                        <el-form-item label="容器名称">
                            <p>{{xiangQingInfo.Driver}}</p>
                        </el-form-item>
                        <el-form-item label="项目Id">
                            <p>{{xiangQingInfo.DriverOpts}}</p>
                        </el-form-item>
                        <el-form-item label="项目名称">
                            <p>{{xiangQingInfo.Options}}</p>
                        </el-form-item>
                        <el-form-item label="默认指令">
                            <p>{{xiangQingInfo.Labels}}</p>
                        </el-form-item>
                        <el-form-item label="默认端口">
                            <p>{{xiangQingInfo.Mountpoint}}</p>
                        </el-form-item>
                        <el-form-item label="镜像名称">
                            <p>{{xiangQingInfo.Scope}}</p>
                        </el-form-item>
                        <el-form-item label="环境参数">
                            <p>{{xiangQingInfo.Status}}</p>
                        </el-form-item>

                    </el-form>
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
                select_volumesType:'',
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
                url:'http://192.168.100.151:8080/volumes/upload',
                name:'request',
                headers:{
                    Authorization: 'Bearer ' + sessionStorage.getItem('userToken')
                },

                // 每一行的数据卷id
                volumesId:'',
                labelpos:'left',
                // 分页信息
                // currentPage:1,
                // totalCount:0,
            }
        },
        methods:{
            // 获取容器数据卷信息
            getContainerVolumesInfo:function(){
                this.$axios.get('/volumes/list/1')
                    .then(response=>{
                        // console.log(response)
                        if (response.data.code == 0){
                            this.$message.success({
                                message:"获取容器数据卷信息成功！",
                                showClose:true
                            })
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
            // 获取容器数据卷信息
            getServiceVolumesInfo:function(){
                this.$axios.get('/volumes/list/2')
                    .then(response=>{
                        // console.log(response)
                        if (response.data.code == 0){
                            this.$message.success({
                                message:"获取服务数据卷信息成功！",
                                showClose:true
                            })
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
                if(this.select_volumesType == 1) {
                    this.getContainerVolumesInfo();
                }else if(this.select_volumesType == 2){
                    this.getServiceVolumesInfo();
                }
            },
            // 清理容器数据卷
            clean_container:function(){
                this.$axios.delete('/volumes/clean/1')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "清理容器数据卷成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message: "清理容器数据卷失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 清理服务数据卷
            clean_service:function(){
                this.$axios.delete('/volumes/clean/2')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "清理服务数据卷成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message: "清理服务数据卷失败！",
                                showClose:true
                            })
                        }
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
                            this.$message.success({
                                message:"上传数据卷信息成功！",
                                showClose:true
                            })
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
                console.log(row.Name)
                this.$axios.get('/volumes/inspect/name/' + row.Name)
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"获取数据卷详情成功！",
                                showClose:true
                            })
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
        },
        created(){
            this.getContainerVolumesInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 200px;
    }

    .handle-input {
        width: 150px;
        display: inline-block;
    }
</style>
