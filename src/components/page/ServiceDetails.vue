<template>
    <div class="servicedetails">

        <!--数据卷模态框-->
        <el-dialog title="上传文件" :visible.sync="dialogVisible" width="30%">
            <el-upload
                class="upload-demo"
                drag
                ref="upload"
                action="/api/volumes/upload"
                :headers="usertoken"
                :data="formdata"
                :before-upload="beforeupload"
                :on-success="successupload"
                :file-list="fileList"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

            </el-upload>
            <el-button style="margin-left: 10px;margin-top: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-dialog>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>服务详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="c">
                <el-tab-pane label="服务信息" name="first">

                    <el-form :label-position='labelpos' label-width="80px" v-model="serviceBasicInfo" >
                        <el-form-item label="服务名称">
                            <p>{{serviceBasicInfo.name}}</p>
                        </el-form-item>
                        <el-form-item label="项目名称">
                            <p>{{serviceBasicInfo.projectName}}</p>
                        </el-form-item>
                        <el-form-item label="横向扩展">
                            <p>{{serviceBasicInfo.replicas}}</p>
                        </el-form-item>
                        <el-form-item label="命令">
                            <p>{{serviceBasicInfo.command}}</p>
                        </el-form-item>
                        <el-form-item label="端口">
                            <p>{{serviceBasicInfo.port}}</p>
                        </el-form-item>
                        <el-form-item label="镜像">
                            <p>{{serviceBasicInfo.image}}</p>
                        </el-form-item>
                        <el-form-item label="环境变量">
                            <p>{{serviceBasicInfo.env}}</p>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <p>{{serviceBasicInfo.createDate}}</p>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="服务详情" name="second">
                    <div id="editor" class="json-editor"></div>
                    <pre id="json"></pre>
                </el-tab-pane>
                <el-tab-pane label="数据卷信息" name="third">
                    <el-table
                        :data="volumesInfo"
                        tooltip-effect="dark"
                        style="width: 100%">

                        <el-table-column prop="name" label="数据卷名称" width="400px">
                        </el-table-column>
                        <el-table-column prop="destination" label="挂载点">
                        </el-table-column>
                        <el-table-column prop="source" label="外部目录" width="500px">
                        </el-table-column>
                        <el-table-column prop="createDate" label="创建日期" width="200px">
                        </el-table-column>
                        <el-table-column label="操作" width="130px">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="uploadVolume(scope.$index, scope.row)" type="primary">上传</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    import '../../../static/tree/jsoneditor'
    export default {
        name: "ServiceDetails",
        data() {
            return {
                usertoken:{'Authorization':sessionStorage.userToken},
                fileList:[],
                formdata:{},

                dialogVisible:false,
                volumeName:'',
                total:0,
                volumeFile:'',
                volumeId:'',
                // 该条服务信息的id
                serviceId: '',
                activeName: 'first',
                // 服务详情信息
                serviceInfo: {},
                // 服务日志信息
                logInfo: [],
                // 服务数据卷信息
                volumesInfo: [],
                //服务基本信息
                serviceBasicInfo:{},
                labelpos:'left',
                c:'first',
            }
        },
        methods: {
            beforeupload(){
                this.formdata.id=this.volumeId;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            successupload(){
                this.$message.success('文件上传成功');
            },
            //上传数据卷
            uploadVolume(index,row){
                this.volumeId = row.id;
                this.dialogVisible=true;
            },
            //提交上传的文件
            submitvolume(){
                let that = this;
                let formdata = new FormData();
                console.log(this.volumeId);
                // return;
                formdata.append('id',this.volumeId);
                formdata.append('file',this.volumeFile);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "api/volumes/upload",
                    dataType: 'json',
                    headers:{
                        'Authorization': sessionStorage.userToken
                    },
                    // 告诉jQuery不要去处理发送的数据
                    processData : false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    data: formdata,
                    success: function (res) {
                        that.getVolumesInfo();
                        this.volumeFile = '';
                        this.volumeName='';
                        this.dialogVisible = false
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },

            importVolume(event){
                event.preventDefault();//取消默认行为
                this.volumeFile = event.target.files[0];
            },
            //获取服务基本信息
            getServiceBasicInfo(){
                this.$axios.get("/service/" + this.serviceId)
                    .then((res)=>{
                        if (res.data.code === 0) {
                            this.serviceBasicInfo = res.data.data;
                            this.serviceBasicInfo.port = formatPort2(this.serviceBasicInfo.port);
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            // 获取服务详情信息
            getServiceInfo: function () {
                this.$axios.get('/service/inspect/' + this.serviceId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.serviceInfo = response.data.data;

                            let json = response.data.data;
                            $('#editor').jsonEditor(json, {
                                change: function () {
                                    $('#json').html(JSON.stringify(json));
                                }
                            });
                        } else {
                            this.$message.error( "获取服务详情信息失败！");
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取服务数据卷信息
            getVolumesInfo: function () {
                this.$axios.get('/volumes/list/obj' + "?objId=" + this.serviceId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.volumesInfo = response.data.data.records;
                        } else {
                            this.$message.error("获取服务数据卷信息失败！");
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created() {
            this.serviceId = this.$route.query.id;
            this.getServiceBasicInfo();
            this.getServiceInfo();
            this.getVolumesInfo();
        }
    }
</script>

<style >
</style>
