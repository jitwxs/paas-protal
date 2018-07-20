<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>容器详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--数据卷模态框-->
            <el-dialog title="导入数据卷" :visible.sync="dialogVisible" width="30%">
                <el-form >
                    <el-form-item label="选择文件">
                        <input id="imageInput" @change="importVolume($event)" type="file">
                    </el-form-item>
                    <el-form-item label="名字" >
                        <el-input v-model="volumeName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible3 = false">取 消</el-button>
                  <el-button type="primary" @click="submitvolume">确 定</el-button>
                </span>
            </el-dialog>

            <el-tabs v-model="activeName" @tab-click="projectTabSwitch">
                <el-tab-pane  label="容器信息" name="first">
                    <el-form :label-position='labelpos' label-width="80px" >
                        <el-form-item label="容器Id">
                            <p>{{id}}</p>
                        </el-form-item>
                        <el-form-item label="容器名称">
                            <p>{{name}}</p>
                        </el-form-item>
                        <el-form-item label="项目Id">
                            <p>{{projectId}}</p>
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
                            <p>{{statusName}}</p>
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
                <!--//数据卷-->
                <el-tab-pane   label="数据卷" name="third"  >

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
                            label="destination"
                            prop="destination" width="300">
                        </el-table-column>
                        <el-table-column
                            label="source"
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
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "ContainerDetails",
        data(){
            return{
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
                dialogVisible :false,
                time:'',
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
                volumeFile:'',
                fileName:'',
                volumeName:'',
                volumeId:'',
            }
        },
        methods:{
            refreshNow:function(){
                let that=this;
                this.jsonmessage=[];
                if (!that.id) {
                    clearInterval(that.time);
                }
                this.$axios.get('/container/top/'+that.id)
                    .then(response=>{
                        if (this.status ===1){
                            // $("#showjson").html(JSON.strsingify(respone.data.data, null, 4));
                            for (var i=0 ; i<response.data.data.Processes.length; i++){
                                var json = {};
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

            projectTabSwitch:function () {
                this.jsonmessage=[];
                if(this.activeName === 'second'){
                    this.$axios.get('/container/top/'+this.id)
                        .then(respone=>{
                            if (this.status ===1){
                                for (var i=0 ; i<respone.data.data.Processes.length; i++){
                                    var json = {};
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
                    })
                }else {
                    clearInterval(this.time);
                }
            },

            refresh:function () {
                var that=this;
                this.time = setInterval(function () {
                    that.jsonmessage=[];
                    that.$axios.get('/container/top/'+that.id)
                        .then(response=>{
                                // $("#showjson").html(JSON.strsingify(respone.data.data, null, 4));
                                for (var i=0 ; i<response.data.data.Processes.length; i++){
                                    var json = {};
                                    json.UID = response.data.data.Processes[i][0];
                                    json.PID = response.data.data.Processes[i][1];
                                    json.PPID = response.data.data.Processes[i][2];
                                    json.C = response.data.data.Processes[i][3];
                                    json.STIME = response.data.data.Processes[i][4];
                                    json.TTY = response.data.data.Processes[i][5];
                                    json.TIME = response.data.data.Processes[i][6];
                                    json.CMD = response.data.data.Processes[i][7];
                                    console.log(json);
                                    that.jsonmessage.push(json);
                                }
                        }).catch(function (err) {
                        console.log(err)
                    })
                },this.value);
            },

            getVolumeInfo(){
                this.$axios.get("/volumes/list/obj?objId="+this.id+"&current="+this.currentPage)
                    .then((res)=>{

                        console.log(res.data.data)
                        this.total = res.data.data.total;
                        this.volumeInfo = res.data.data.records;
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            },

            uploadFiles(index,row){
                this.volumeId = row.id;
                this.dialogVisible=true;
            },

            importVolume(event){
                    event.preventDefault();//取消默认行为
                    this.volumeFile = event.target.files[0];
                    this.fileName = event.target.files[0].name;
            },
            submitvolume(){
                let that = this;
                console.log(sessionStorage.userToken);
                let formdata = new FormData();
                formdata.append('id',this.volumeId);
                formdata.append('file',this.volumeFile);
                // formdata.append('name',this.volumeName);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "http://192.168.100.151:9999/volumes/upload",
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
                        that.getVolumeInfo();
                        this.volumeFile = '';
                        this.fileName='';
                        this.volumeName='';
                        console.log(res);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
        },

        mounted() {
            this.refresh();
        },

        computed:{
            ...mapGetters({
                Token:'getToken'
            })
        },

        beforeDestroy(){
            clearInterval(this.time)
        },
        created(){
            this.activeName = 'first';
            this.id = this.$route.query.id;
            console.log(this.id);
            this.$axios.get('/container/'+this.id)
                .then(respone=>{
                    this.name = respone.data.data.name;
                    this.projectId = respone.data.data.projectId;
                    this.projectName = respone.data.data.projectName;
                    if (respone.data.data.command) {
                        this.command = respone.data.data.command.replace("[","").replace("]","");
                    }
                    this.port = respone.data.data.port;
                    this.image = respone.data.data.image;
                    if (respone.data.data.env) {
                        this.env = respone.data.data.env.replace("[","").replace("]","");
                    }
                    this.status = respone.data.data.status;
                    this.createDate = respone.data.data.createDate;
                    this.updateDate = respone.data.data.updateDate;
                    this.statusName = respone.data.data.statusName;

                    var port = this.port;
                    // 去除引号
                    port = port.toString().replace("\\", "");
                    port = eval('(' + port + ')');

                    this.port = "";
                    for (var key in port) {
                        var value = port[key];
                        var valArray = new Array();
                        for (var j = 0; j < value.length; j++) {
                            valArray.push(value[j].HostPort);
                        }
                        this.port = this.port + key + ":" + valArray.join(",");
                    }

                    if (this.status===1){
                        this.tabbool=false;
                        // console.log(this.tabbool);
                    }
                }).catch(function (err) {
                console.log(err);
            });

            this.getVolumeInfo();
// 获取数据卷信息
        }
    }
</script>

<style scoped>

</style>
