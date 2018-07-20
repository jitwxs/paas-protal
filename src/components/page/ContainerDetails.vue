<template>
    <div>
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
    import {mapGetters} from "vuex";
    export default {
        name: "ContainerDetails",
        data(){
            return{
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
                }
            }
        },
        methods:{

            refreshNow:function(){
                this.jsonmessage=[];
                this.$axios.get('/container/top/'+this.containerId)
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

                    this.$axios.get('/container/top/'+this.containerId)
                        .then(respone=>{
                            if (this.status ===1){
                                // $("#showjson").html(JSON.stringify(respone.data.data, null, 4));
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
                    console.log(that.containerId);
                    that.jsonmessage=[];
                    that.$axios.get('/container/top/'+that.containerId)
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
                },10000);
            },

            //上传文件到数据卷
            uploadFiles(index,data){

                this.uploadForm.id = data.id;

            }

        },

        mounted() {

            // this.$axios.get('')
        },

        computed:{
            ...mapGetters({
                containerId : 'getContainerId'
            })
        },

        created(){
            this.activeName = 'first';
            // this.id = this.$route.query.id;
            this.$axios.get('/container/'+this.containerId)
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

            this.$axios.get("/volumes/list/obj?objId="+this.containerId+"&current="+this.currentPage)
                .then((res)=>{

                    console.log(res.data.data)
                    this.total = res.data.data.total;
                    this.volumeInfo = res.data.data.records;
                })
                .catch((err)=>{
                    console.log(err)
                })
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
