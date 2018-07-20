<template>
  <div id="main" >
    <el-tabs v-model="activeName">
      <el-tab-pane label="容器列表" name="first" class="pane">

        <el-button-group>
          <el-button type="success" :loading="loading[0]" :disabled="freeze[0]" icon="el-icon-success" @click="getStart()">start</el-button>
          <el-button type="info" :loading="loading[1]" :disabled="freeze[1]" icon="el-icon-question" @click="pauseContainer()">pause</el-button>
          <el-button type="info" :loading="loading[2]" :disabled="freeze[2]" icon="el-icon-question" @click="recoverContainer()">recover</el-button>
          <el-button type="warning" :loading="loading[3]" :disabled="freeze[3]" icon="el-icon-error" @click="stopContainer()">stop</el-button>
          <el-button type="warning" :loading="loading[4]" :disabled="freeze[4]" icon="el-icon-warning" @click="killContainer()">kill</el-button>
          <el-button type="primary" :loading="loading[6]" :disabled="freeze[5]" icon="el-icon-success" @click="restartContainer()">restart</el-button>
        </el-button-group>

        <el-button @click="addContainer">添加容器</el-button>
          <el-table ref="singleTable" :data="containerList" tooltip-effect="dark" style="width: 100%" highlight-current-row @current-change="getCurrentContainerRow">
              <el-table-column label="项目名" prop="projectName" show-overflow-tooltip></el-table-column>
              <el-table-column label="容器名称" prop="name" show-overflow-tooltip></el-table-column>
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

      </el-tab-pane>

      <el-tab-pane label="服务列表" name="second" class="pane">

        <el-button @click="addService">添加服务</el-button>
        <el-table
          ref="singleTable"
          :data="serviceList"
          tooltip-effect="light"
          style="width: 100%"
          highlight-current-row
          @current-change="getCurrentServiceRow">
          <el-table-column
            label="项目名"
            width="200"
            prop="projectName"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="服务名称"
            width="200"
            prop="name"
            show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="replicas"
            label="横向扩展"
            show-overflow-tooltip
            width="200" >
              //计数器
              <template slot-scope="scope">
                  <el-input-number size="mini" v-model="num" @change="numChange(scope.row)" :min="1" :max="5" label="横向扩展"></el-input-number>
              </template>
          </el-table-column>

          <el-table-column
            prop="image"
            label="镜像"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="port"
            label="端口"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteService(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

        <el-tab-pane label="项目信息" name="third" class="pane">
            <el-form  label-width="80px" :model="projectInfo">
                <el-form-item label="名称:" prop="name">{{projectInfo.name}}</el-form-item>
                <el-form-item label="描述:">{{projectInfo.description}}</el-form-item>
                <el-form-item label="创建日期:">{{projectInfo.createDate}}</el-form-item>
            </el-form>
            <el-button type="danger" @click="deleteProject">删除项目</el-button>
        </el-tab-pane>

        <el-tab-pane label="项目日志" name="forth" class="pane">
            <el-table :data="logdata" style="width: 100%">
                <el-table-column prop="createDate" label="时间"></el-table-column>
                <el-table-column prop="containerName" label="容器名称"></el-table-column>
                <el-table-column prop="description" label="事件"></el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
      data() {
      return {
          activeName:'first',
          containerList:[],
          serviceList:[],
          currentPage:1,
          pageSize:10,
          totalCount:0,
          loading:[false,false,false,false,false,false],
          freeze:[true,true,true,true,true,true],
          targetRow:'',
          clickStatus:'',
          userId:'',
          enconsole:true,

          serviceId:'',
          num:1,

          projectInfo:{},

          logdata:[{createDate:'',containerName:'',description:'',}],
      }
    },
      computed:{
          ...mapGetters({
              projectId:'getProjectId',
              userInfo:'getUserInfo',
              hostaddr:'gethostaddr',
          })
      },
    methods:{
        numChange(value){

        },
          // 分页函数
        handleCurrentChange:function (val) {
            this.currentPage = val;
            this.logInfo();
        },
        //分页大小
        handleSizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;
            this.logInfo();
        },
        //查看日志信息   有bug
        logInfo(){
            this.$axios.get('/project/log/?projectId='+this.projectId + '&current=' + this.currentPage + '&size+' + this.pageSize)
                .then(response => {
                    this.logdata = response.data.data.records;
                    this.totalCount = response.data.data.total;
                }).catch(function (err) {
                console.log(err)
            })
        },

        getprojectinfo(){
            this.$axios.get('/project/'+this.projectId)
                .then(response=>{
                    // console.log(response.data.data);
                    this.projectInfo = response.data.data;
                    console.log(this.projectInfo)
                }).catch(function (err) {
                console.log(err)
            });
        },

        deleteProject(){
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(()=>{
                    this.$axios.delete('/project/delete/'+this.projectId)
                        .then(response=>{
                            this.$message(response.data.message);
                            this.$router.push('/projectPage')
                        }).catch(function (err) {
                        console.log(err)
                    })
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

        //日志分页   有bug
        logPage:function(val){
            this.$axios.get('/project/log/?projectId='+this.projectId+'&?current=' + val + '&size=10')
                .then(response => {
                    this.logdata = response.data.data.records;
                }).catch(function (err) {
                console.log(err)
            })
        },

      //获取指定项目的容器列表
      getContainerList(currentPage, pageSize, projectId){
        let url = "/container/project/" + projectId + "/list?current="+currentPage + "&size="+pageSize;
        // console.log(url);
        this.$axios.get(url)
          .then((res)=>{

            if (res.data.code == 0) {

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
        //添加容器
      addContainer(){
          this.$store.dispatch('setProjectId',this.projectId);
          this.$router.push('/addContainer')
      },
        //切换添加服务界面
      addService(){
          this.$router.push("/addService")
      },

        //删除容器
        deleteContainer(id){
            this.$confirm('此操作将永久删除该容器 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$axios.delete("/container/delete/"+id)
                        .then(res =>{
                            if (res.data.code == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                // this.getProjectList(this.currentPage,this.pageSize);
                            }
                        })
                        .catch( err =>{
                            console.log(err)
                        })
                })
                .catch(() => {
                });
            this.getContainerList(1,this.pageSize, this.projectId);
        },

        //删除服务
        deleteService(id){
        this.$confirm('此操作将永久删除该服务 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$axios.delete("/service/delete/"+id)
              .then(res =>{
                if (res.data.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  // this.getProjectList(this.currentPage,this.pageSize);
                }
              })
              .catch( err =>{
                console.log(err)
              })
          })
          .catch(() => {
          });
        this.getServiceInfo();
      },

        //获取容器列表信息
        getServiceInfo(){
            this.$axios.get('/service/'+this.projectId+'/list')
                .then(response=>{
                    this.serviceList = response.data.data.records;
                    // console.log(this.serviceList);
                }).catch(function (err) {
                console.log(err);
            })
        },

        //获取容器当前id
      getCurrentContainerRow(row){
          // console.log(row);
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
        getCurrentServiceRow(row){
            this.serviceId = row.id;
        },

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
                } else {
                    this.$message.error(response.data.data);
                }

            })
            .catch(function (err) {
                console.log(err)
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
    mounted(){
      this.getContainerList(1,this.pageSize, this.projectId);
    },

      created(){
          this.initWebSocket();
          this.getServiceInfo();
          this.logInfo(1,5);
          this.getprojectinfo();
      },


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
</style>
