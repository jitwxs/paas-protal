<template>
    <div class="containermanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-goods"></i>容器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-input v-model="select_projectId" placeholder="输入容器id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search" >搜索</el-button>
            </div>
            <!--容器信息展示区域-->

                <el-button-group>
                    <el-button type="success" icon="el-icon-success" @click="getStart(clickId)">start</el-button>
                    <el-button type="info" icon="el-icon-question">pause</el-button>
                    <el-button type="info" icon="el-icon-question">recover</el-button>
                    <el-button type="warning" icon="el-icon-error">stop</el-button>
                    <el-button type="warning" icon="el-icon-warning">kill</el-button>
                    <el-button type="primary" icon="el-icon-success" >restart</el-button>
                    <el-button type="danger" icon="el-icon-success" >delete</el-button>



                </el-button-group>
            <el-button type="primary">更新</el-button>

            <el-table
                ref="singleTable"
                :data="containerInfo"
                highlight-current-row
                style="width: 100%"
                @current-change="handleSelectionChange">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="容器名称"
                    width="150">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                    label="容器状态"
                    width="150">
                    <template slot-scope="scope">
                        <!--<el-popover trigger="hover" placement="top">-->
                            <div slot="reference" class="name-wrapper" style="float: left">
                                <el-tag size="medium">{{ scope.row.statusName }}</el-tag>
                            </div>
                            <i class="el-icon-view" style="float: left;margin-left: 10px;margin-top: 8px"></i>
                        <!--</el-popover>-->
                    </template>
                </el-table-column>

                <el-table-column
                    prop="image"
                    label="镜像名称"
                    width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="port"
                    label="端口组"
                    show-overflow-tooltip >
                </el-table-column>
                    <el-table-column width="100" label="操作">
                        <template slot-scope="scope">
                            <!--<router-link style=" text-decoration: none;" :to="{path:'/containerdetails', query:{id:scope.row.id}}">-->
                            <i class="el-icon-document"></i>
                            <i class="el-icon-edit-outline"></i>
                            <a>登录</a>
                            <!--</router-link>-->
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
        </div>

    </div>
</template>

<script>
    export default {
        name: "ContainerManage",
        data(){
            return{
                // 搜索特定条件的容器
                select_projectId:'',
                // 容器信息列表
                containerInfo:[],

                portInfo:[],
                // 分页当前页码
                currentPage: 1,
                // 分页总条数
                totalCount:0,

                clickId:'',
                singleSelection:[],
                websock: null,
            }
        },
        methods:{
            // 获取容器信息
            getContainerInfo:function(){
                this.$axios.get('/container/list/' + '?current=' + this.currentPage + '&size=5')
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.containerInfo = response.data.data.records;
                            this.totalCount = response.data.total;
                            for(var i=0;i<this.containerInfo.length; i++){
                                var port = this.containerInfo[i].port;
                                // 去除引号
                                port = port.toString().replace("\\","");
                                port = eval('(' + port + ')');

                                this.containerInfo[i].port = "";
                                for(var key in port){
                                    var value = port[key];
                                    var valArray = new Array();
                                    for(var j=0;j<value.length; j++) {
                                        valArray.push(value[j].HostPort);
                                    }
                                    this.containerInfo[i].port  = this.containerInfo[i].port+ key + ":[" + valArray.join(",") + "]";
                                }
                                console.log( this.containerInfo[i].port +"------");
                            }
                        } else {
                            this.$message.error({
                                message:"获取容器信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            search:function () {

            },
            // 分页函数
            handleCurrentChange:function (val) {
                this.$axios.get('/container/list/' + '?current=' + val  + '&size=5')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.containerInfo = response.data.data.records;
                        } else {
                            this.$message.error({
                                message:"获取容器信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 选中操作
            handleSelectionChange(val) {
                this.singleSelection = val;
                this.clickId = val.id;
                // console.log(this.clickId);
            },

            // 实现容器启动
            getStart:function(clickId){
                this.$axios.get('/container/start/' + clickId)
                    .then(response=>{
                        // console.log(response)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取表格每行选中的状态
            handleSelect:function(index,row){
            },

            initWebSocket:function(){ //初始化weosocket
                this.websock = new WebSocket("ws://192.168.100.142:9999/ws/1231451941131");

                this.websock.onopen = this.websocketonopen;

                // this.websock.onerror = this.websocketonerror;

                this.websock.onmessage = this.websocketonmessage;

                this.websock.onclose = this.websocketclose;
            },

            websocketonopen:function() {
                console.log("WebSocket连接成功");
            },

            websocketonerror:function(e) { //错误
                console.log("WebSocket连接发生错误");
            },

            websocketonmessage:function(e){ //数据接收
                // const redata = JSON.parse(e.data);
                //注意：长连接我们是后台直接1秒推送一条数据，
                //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
                //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
                // console.log(redata.value);
                console.log(e)
            },

            websocketsend:function(agentData){//数据发送
                this.websock.send(agentData);
            },

            websocketclose:function(e){ //关闭
                console.log("connection closed (" + e.code + ")");
            },
        },
        created(){
            this.getContainerInfo();
            // this.readyChat();
            this.initWebSocket();
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
        width: 300px;
        display: inline-block;
    }
</style>
