<template>
    <div>
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
                <el-breadcrumb-item><i class="el-icon-date"></i>容器详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="projectTabSwitch">
                <el-tab-pane  label="容器信息" name="first">
                    <el-form :label-position='labelpos' label-width="80px" >
                        <el-form-item label="容器名称">
                            <p>{{name}}</p>
                        </el-form-item>
                        <el-form-item label="项目名称">
                            <p>{{projectName}}</p>
                        </el-form-item>
                        <el-form-item label="默认指令">
                            <p>{{command}}</p>
                        </el-form-item>
                        <el-form-item label="默认端口">
                            <p>{{port}}</p>
                        </el-form-item>
                        <el-form-item label="镜像名称">
                            <p>{{image}}</p>
                        </el-form-item>
                        <el-form-item label="环境参数">
                            <p>{{env}}</p>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <p>{{createDate}}</p>
                        </el-form-item>
                        <el-form-item label="修改时间">
                            <p>{{updateDate}}</p>
                        </el-form-item>
                        <el-form-item label="运行状态">
                            <el-tag size="medium">{{ statusName }}</el-tag>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane  :disabled="tabbool" label="容器进程" name="second">

                    <el-select v-model="value"  placeholder="请选择刷新间隔" style="margin-bottom: 20px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button icon="el-icon-refresh" circle @click="refreshNow"></el-button>

                    <el-table :data="jsonmessage" style="width: 100%">
                        <el-table-column prop="UID" label="UID" ></el-table-column>
                        <el-table-column prop="PID" label="PID" ></el-table-column>
                        <el-table-column prop="PPID" label="PPID" ></el-table-column>
                        <el-table-column prop="C" label="C" ></el-table-column>
                        <el-table-column prop="STIME" label="STIME" ></el-table-column>
                        <el-table-column prop="TTY" label="TTY" ></el-table-column>
                        <el-table-column prop="TIME" label="TIME" ></el-table-column>
                        <el-table-column prop="CMD" label="CMD" ></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane  label="数据卷" name="third"  >

                    <el-table
                        :data="volumeInfo"
                        style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="Driver:">
                                        <span>{{ props.row.volume.Driver }}</span>
                                    </el-form-item>
                                    <el-form-item label="Options:">
                                        <span>{{ props.row.volume.Options }}</span>
                                    </el-form-item>
                                    <el-form-item label="labels:">
                                        <span>{{ props.row.volume.Labels }}</span>
                                    </el-form-item>
                                    <el-form-item label="Mountpoint:">
                                        <span>{{ props.row.volume.Mountpoint }}</span>
                                    </el-form-item>
                                    <el-form-item label="Scope:">
                                        <span>{{ props.row.volume.Scope }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="挂载点"
                            prop="destination" width="300">
                        </el-table-column>
                        <el-table-column
                            label="外部目录"
                            prop="source">
                        </el-table-column>
                        <el-table-column
                            label="创建时间"
                            prop="createDate">
                        </el-table-column>

                        <el-table-column label="操作" width="100px">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="success"
                                    @click="uploadFiles(scope.$index, scope.row)">上传文件</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="网络管理" name="fourth">

                    <el-button type="primary" icon="el-icon-refresh" circle style="margin-left: 20px;margin-bottom: 20px" @click="syncNetwork"></el-button>
                    <el-table
                        :data="networkList"n
                        style="width: 100%">
                        <el-table-column
                            prop="network.name"
                            label="名称"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="network.scope"
                            label="范围"
                           >
                        </el-table-column>
                        <el-table-column
                            prop="network.driver"
                            label="驱动">
                        </el-table-column>
                        <el-table-column
                            prop="createDate"
                            label="创建日期">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "ContainerDetails",
        data(){
            return{
                usertoken:{'Authorization':sessionStorage.userToken},
                fileList:[],
                formdata:{},

                volumeFile:'',
                dialogVisible:false,
                time:'',
                options: [{
                    value: 10000,
                    label: '10秒'
                }, {
                    value: 60000,
                    label: '1分钟'
                }, {
                    value:  300000,
                    label: '5分钟'
                }, {
                    value: 1800000,
                    label: '半小时'
                }, {
                    value: 3600000,
                    label: '一小时'
                }],
                value:10000,


                activeName:'first',
                labelpos:'left',
                id:'',
                name:'',
                projectId:'',
                projectName:'',
                status:'',
                command:'',
                port:'',
                image:'',
                env:'',
                createDate:'',
                updateDate:'',
                statusName:'',
                jsonmessage:[],
                tabbool:true,
                volumeInfo:[],
                currentPage:1,
                total:0,
                uploadForm:{
                    id:'',
                    file:''
                },
                fileName:'',
                networkList:[]
            }
        },
        methods:{
            beforeupload(){
                this.formdata.id=this.volumeId;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            successupload(){
                this.$message.success('文件上传成功');
            },


            //同步容器网络配置
            syncNetwork(){
                this.$axios.get("/network/sync/container/"+this.containerId)
                    .then((res)=>{
                        if (res.data.code === 0){
                            let message = "添加：" + res.data.data.add + "条，删除：" + res.data.data.delete + "条";
                            this.$notify({
                                message: message    ,
                                type: 'success'
                            });
                            this.getContainerNetworkList();
                        }
                    })
            },
            //上传文件改变时
            importVolume(event){
                event.preventDefault();//取消默认行为
                this.volumeFile = event.target.files[0];
                this.fileName = event.target.files[0].name;
            },
            //上传数据卷
            submitvolume(){
                let that = this;
                let formdata = new FormData();
                formdata.append('id',this.volumeId);
                formdata.append('file',this.volumeFile);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "/api/volumes/upload",
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
                        if(res.code === 0) {
                            that.dialogVisible = false;
                            that.$message.success("上传成功");
                            that.getVolumeInfo();
                            that.volumeFile = '';
                            that.fileName='';
                        } else {
                            that.$message.success(res.message);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            refreshNow:function(){
                this.jsonmessage=[];
                this.$axios.get('/container/top/'+this.containerId)
                    .then(response=>{
                        if (this.status ===1){
                            for (let i=0 ; i<response.data.data.Processes.length; i++){
                                let json = {};
                                json.UID = response.data.data.Processes[i][0];
                                json.PID = response.data.data.Processes[i][1];
                                json.PPID = response.data.data.Processes[i][2];
                                json.C = response.data.data.Processes[i][3];
                                json.STIME = response.data.data.Processes[i][4];
                                json.TTY = response.data.data.Processes[i][5];
                                json.TIME = response.data.data.Processes[i][6];
                                json.CMD = response.data.data.Processes[i][7];
                                this.jsonmessage.push(json);
                            }
                        }
                    }).catch(function (err) {
                    console.log(err)
                })
            },

            //获取容器网络信息
            getContainerNetworkList(){
                this.$axios.get("/network/container/"+this.containerId)
                    .then((res)=>{

                        if (res.data.code === 0){

                            this.networkList = res.data.data;
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            projectTabSwitch:function () {
                this.jsonmessage=[];
                if(this.activeName === 'second'){

                    this.$axios.get('/container/top/'+this.containerId)
                        .then(respone=>{
                            if (this.status ===1){
                                for (let i=0 ; i<respone.data.data.Processes.length; i++){
                                    let json = {};
                                    json.UID = respone.data.data.Processes[i][0];
                                    json.PID = respone.data.data.Processes[i][1];
                                    json.PPID = respone.data.data.Processes[i][2];
                                    json.C = respone.data.data.Processes[i][3];
                                    json.STIME = respone.data.data.Processes[i][4];
                                    json.TTY = respone.data.data.Processes[i][5];
                                    json.TIME = respone.data.data.Processes[i][6];
                                    json.CMD = respone.data.data.Processes[i][7];
                                    this.jsonmessage.push(json);
                                }
                            }
                        }).catch(function (err) {
                        console.log(err);
                    });
                    this.refresh();
                } else{

                    clearInterval(this.time)
                }
            },

            refresh:function () {
                let that=this;
                this.time = setInterval(()=>{
                    if (!that.containerId) {
                        clearInterval(that.time)
                    }
                    that.jsonmessage=[];
                    that.$axios.get('/container/top/'+that.containerId)
                        .then(response=>{
                            if (this.status ===1){
                                for (let i=0 ; i<response.data.data.Processes.length; i++){
                                    let json = {};
                                    json.UID = response.data.data.Processes[i][0];
                                    json.PID = response.data.data.Processes[i][1];
                                    json.PPID = response.data.data.Processes[i][2];
                                    json.C = response.data.data.Processes[i][3];
                                    json.STIME = response.data.data.Processes[i][4];
                                    json.TTY = response.data.data.Processes[i][5];
                                    json.TIME = response.data.data.Processes[i][6];
                                    json.CMD = response.data.data.Processes[i][7];
                                    this.jsonmessage.push(json);
                                }
                            }
                        }).catch(function (err) {
                        console.log(err)
                    })
                },10000);
            },

            //上传文件到数据卷
            uploadFiles(index,row){
                this.volumeId = row.id;
                this.dialogVisible=true;
            },
            getVolumeInfo(){
                this.$axios.get("/volumes/list/obj?objId="+this.containerId+"&current="+this.currentPage)
                    .then((res)=>{
                        this.total = res.data.data.total;
                        this.volumeInfo = res.data.data.records;
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            },



        },

        mounted() {
        },

        computed:{
            ...mapGetters({
                containerId : 'getContainerId',
                hostaddr :'gethostaddr'
            })
        },

        created(){
            this.activeName = 'first';
            this.getContainerNetworkList();
            this.$axios.get('/container/'+this.containerId)
                .then(respone=>{
                    this.name = respone.data.data.name;
                    this.projectId = respone.data.data.projectId;
                    this.projectName = respone.data.data.projectName;
                    if (respone.data.data.command) {
                        this.command = respone.data.data.command.replace("[","").replace("]","");
                    }
                    this.port = formatPort1(respone.data.data.port);
                    this.image = respone.data.data.image;
                    if (respone.data.data.env) {
                        this.env = respone.data.data.env.replace("[","").replace("]","");
                    }
                    this.status = respone.data.data.status;
                    this.createDate = respone.data.data.createDate;
                    this.updateDate = respone.data.data.updateDate;
                    this.statusName = respone.data.data.statusName;
                    if (this.status===1){
                        this.tabbool=false;
                    }
                }).catch(function (err) {
                console.log(err);
            });

            this.getVolumeInfo();

        },
        beforeDestroy(){
            clearInterval(this.time)
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #1c0ebf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .demo-table-expand .el-form-item__label{
        color:#99a9bf;
    }
</style>
