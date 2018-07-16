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
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ContainerDetails",
        data(){
            return{
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
            }
        },
        methods:{
            projectTabSwitch:function () {
                if(this.activeName === 'second'){
                    this.$axios.get('/container/top/'+this.id)
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
                }
            }
        },

        // beforeRouteEnter (){
        //     console.log("destory");
        // },

        created(){
            this.activeName = 'first';
            this.id = this.$route.query.id;
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
                        console.log(this.tabbool);
                    }
                }).catch(function (err) {
                console.log(err);
            });

        }
    }
</script>

<style scoped>

</style>
