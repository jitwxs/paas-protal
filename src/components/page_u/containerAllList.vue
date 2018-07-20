<template>
  <div id="main">
      <!--按钮组-->
      <el-button-group>
          <el-button type="success" :loading="loading[0]" :disabled="freeze[0]" icon="el-icon-success" @click="getStart()">start</el-button>
          <el-button type="info" :loading="loading[1]" :disabled="freeze[1]" icon="el-icon-question" @click="pauseContainer()">pause</el-button>
          <el-button type="info" :loading="loading[2]" :disabled="freeze[2]" icon="el-icon-question" @click="recoverContainer()">recover</el-button>
          <el-button type="warning" :loading="loading[3]" :disabled="freeze[3]" icon="el-icon-error" @click="stopContainer()">stop</el-button>
          <el-button type="warning" :loading="loading[4]" :disabled="freeze[4]" icon="el-icon-warning" @click="killContainer()">kill</el-button>
          <el-button type="primary" :loading="loading[6]" :disabled="freeze[5]" icon="el-icon-success" @click="restartContainer()">restart</el-button>
      </el-button-group>
      <!--列表-->
      <el-table ref="singleTable" :data="containerList" tooltip-effect="dark" style="width: 100%" highlight-current-row @current-change="getCurrentContainerRow">

          <el-table-column label="容器名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="项目名" prop="projectName" show-overflow-tooltip>
              <template slot-scope="scope">
                  <el-select v-model="containerList[scope.$index].projectName"  placeholder="请选择" @change="changeProject(scope.row,scope.$index)">
                      <el-option
                          v-for="item in projectInfo"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                      </el-option>
                      <!--<el-option :selected='true' :label="test" :key="test" :value="test"></el-option>-->
                  </el-select>
              </template>
          </el-table-column>
          <el-table-column prop="statusName" label="状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="image" label="镜像" show-overflow-tooltip></el-table-column>
          <el-table-column prop="port" label="端口" show-overflow-tooltip></el-table-column>
          <el-table-column label="终端" >
              <template slot-scope="scope">
                  <ul style="float: left;list-style-type: none" >
                      <li style="float: left;color: #409EFF;cursor: pointer" @click="consoleopen(scope.row)"><i class="el-icon-view"></i> 打开终端</li>
                  </ul>
              </template>
          </el-table-column>
          <el-table-column label="删除">
              <template slot-scope="scope">
                  <!--跳tab-->
                  <ul style="float: left;list-style-type: none" >
                      <router-link :to="{path:'/containerDetails', query:{id:scope.row.id}}">
                          <li style="float: left;color: #409EFF;cursor:pointer">详情</li>
                      </router-link>
                      <li style="float: left;color: #409EFF;cursor: pointer;margin-left: 10px" @click="deleteContainer(scope.row.id)">删除</li>
                  </ul>
              </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
          // test:'123',
          projectInfo:[],
          projectNum:0,
          value:[],

          activeName:'first',
          loading:[false,false,false,false,false,false],
          freeze:[true,true,true,true,true,true],
          containerList:[],
          projectName:"project",
          targetRow:'',
          clickStatus:'',

          currentPage:1,
          pageSize:10,
          totalCount:0,

          wsflag:0,
      }
    },
    methods:{
        // 容器操作
        getStart:function(){
            this.loading[0] = true;
            this.$axios.get('/container/start/' + this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        pauseContainer:function(){
            this.loading[1] = true;
            this.$axios.get('/container/pause/' + this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })

        },
        recoverContainer:function(){
            this.loading[2] = true;
            this.$axios.get('/container/continue/' + this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        stopContainer:function(){
            this.loading[3] = true;
            this.$axios.get('/container/stop/' + this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        killContainer:function(){
            this.loading[4]= true;
            this.$axios.get('/container/kill/' + this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        restartContainer:function(){
            this.loading[5] = true;
            this.$axios.get('/container/restart/' +this.targetRow)
                .then(response=>{
                    if (response.data.code===0){
                        this.$message({
                            message: response.data.data,
                            type: 'success'
                        });
                        this.timeout();
                    } else {
                        this.$message.error(response.data.data);
                    }

                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        timeout(){
            setTimeout(function () {
                if (this.wsflag===0){
                    this.$notify.error({
                        title:'超时',
                        message:'请重新操作',
                    });
                    this.getContainerList(1,this.pageSize);
                    this.loading=[false,false,false,false,false,false];
                    this.wsflag=0;
                }
            },30000)
        },

        //获取容器当前id
        getCurrentContainerRow(row){
            // console.log(row.id);
            this.targetRow = row.id;
            this.clickStatus = row.status;
            switch (this.clickStatus){
                case 0:
                    this.freeze=[false,true,true,true,true,false];
                    break;
                case 1:
                    this.freeze=[true,false,true,false,false,false];
                    break;
                case 2:
                    this.freeze=[true,true,false,false,false,false];
                    break;
            }

        },

        //获取容器列表
        getContainerList(currentPage, pageSize){
            let url = "/container/list/?current="+currentPage + "&size="+pageSize;
            this.$axios.get(url)
                .then((res)=>{
                    if (res.data.code == 0) {
                        console.log(res.data.data);
                        // console.log(res.data)
                        this.containerList = res.data.data.records;
                        this.total = res.data.data.total;

                        for(var i=0;i<this.containerList.length; i++){
                            var port = this.containerList[i].port;
                            // 去除引号
                            port = port.toString().replace("\\","");
                            port = eval('(' + port + ')');

                            this.containerList[i].port = "";
                            for(var key in port){
                                var value = port[key];
                                var valArray = new Array();
                                for(var j=0;j<value.length; j++) {
                                    valArray.push(value[j].HostPort);
                                }
                                this.containerList[i].port  = this.containerList[i].port+ key + ":" + valArray.join(",") ;
                            }
                        }

                    } else {

                        this.$message.error("获取列表失败")
                    }
                })
                .catch( (err) =>{
                    console.log(err)
                })
        },

        changeProject(row,val){
            console.log(row.id+this.value[val]);
            this.$axios.post('/container/changeProject',{
                "containerId":row.id,
                "projectId":this.value[val],
            })
                .then(response=>{
                    this.$message(response.data.message);
                    this.getContainerList(1,this.pageSize);
                }).catch(function (err) {
                console.log(err);
            })
        },

        // 打开终端
        consoleopen(row){
            if (row.status==1){
                window.open('../../../static/term.html');
                this.$axios.post('/container/terminal/' ,{
                    "containerId": row.id,
                    "cursorBlink": false,
                    "rows": 50,
                    "cols": 100,
                    "width": document.documentElement.clientWidth,
                    "height": document.documentElement.clientHeight,
                })
                    .then(response=>{
                        sessionStorage.setItem('terminalCursorBlink',response.data.data.cursorBlink);
                        sessionStorage.setItem('terminalRows',response.data.data.rows);
                        sessionStorage.setItem('terminalCols',response.data.data.cols);
                        sessionStorage.setItem('terminalUrl',response.data.data.url);
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            } else{
                this.$message("请先开启容器");
            }
        },

        getProjectInfo(){
            this.$axios.get('/project/self/list')
                .then(response=>{
                    this.projectInfo = response.data.data.records;
                    this.projectNum = response.data.data.total;
                }).catch(function (err) {
                console.log(err);
            })
        },

        //websocket
        initWebSocket:function(){ //初始化weosocket
            this.$axios.post('/token')
                .then(response=>{
                    this.userId = response.data.data.userId;
                    this.websock = new WebSocket("ws://"+this.hostaddr+"/ws/"+this.userId);

                    this.websock.onopen = this.websocketonopen;

                    // this.websock.onerror = this.websocketonerror;

                    this.websock.onmessage = this.websocketonmessage;

                    this.websock.onclose = this.websocketclose;
                })
                .catch(function (err) {
                    console.log(err)
                });
        },

        websocketonopen:function() {
            console.log("WebSocket连接成功");
        },

        websocketonerror:function(e) { //错误
            console.log("WebSocket连接发生错误");
        },

        websocketonmessage:function(e){ //数据接收
            e = eval('('+e.data+')');
            if (e.code === 0){
                //容器相关
                if (e.data.type===0){
                    this.wsflag=1;
                    this.$axios.get('/container/status/'+this.targetRow)
                        .then(respone=>{
                            console.log(respone.data);
                            switch (respone.data.data){
                                case 0:
                                    this.freeze=[false,true,true,true,true,false];
                                    break;
                                case 1:
                                    this.freeze=[true,false,true,false,false,false];
                                    break;
                                case 2:
                                    this.freeze=[true,true,false,false,false,false];
                                    break;
                            }
                            this.getContainerList(1,this.pageSize, this.projectId);

                        }).catch(function (err) {
                        console.log(err);
                    });
                    this.loading=[false,false,false,false,false,false];
                }

                this.$notify({
                    title: e.message,
                    message: e.data.message,
                    type: 'success'
                });
            }else {
                this.$notify.error({
                    title: '错误',
                    message: e.data.message,
                });
            }

        },

        websocketsend:function(agentData){//数据发送
            this.websock.send(agentData);
        },

        websocketclose:function(e){ //关闭
            console.log("connection closed (" + e.code + ")");
        },
    },

      computed:{
          ...mapGetters({
              projectId:'getProjectId',
              userInfo:'getUserInfo',
              hostaddr:'gethostaddr',
          })
      },
    created(){
      this.getContainerList(1,this.pageSize);
      this.initWebSocket();
      this.getProjectInfo();
    }
  }
</script>

<style scoped>
  #main{
    padding: 50px;
    margin: 20px;
    box-shadow: 3px 3px 10px #dddddd;
    background-color: white;
    border-radius: 15px;
    min-height: 400px;
  }
  .pane{
    margin:20px;
  }
  .toolbar{
    margin-left: 10px;
    margin-bottom: 40px;
  }
  #tabelDiv{
    border: 1px #f1f1f1 solid;
    border-radius: 5px;
  }
</style>
