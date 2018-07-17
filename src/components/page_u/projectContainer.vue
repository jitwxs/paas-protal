<template>
  <div id="main" >
    <el-tabs v-model="activeName">
      <el-tab-pane label="容器列表" name="first" class="pane">

        <el-button-group>
          <el-button type="success" :loading="loading[0]" :disabled="freeze[0]" icon="el-icon-success" @click="getStart(clickId)">start</el-button>
          <el-button type="info" :loading="loading[1]" :disabled="freeze[1]" icon="el-icon-question" @click="pauseContainer(clickId)">pause</el-button>
          <el-button type="info" :loading="loading[2]" :disabled="freeze[2]" icon="el-icon-question" @click="recoverContainer(clickId)">recover</el-button>
          <el-button type="warning" :loading="loading[3]" :disabled="freeze[3]" icon="el-icon-error" @click="stopContainer(clickId)">stop</el-button>
          <el-button type="warning" :loading="loading[4]" :disabled="freeze[4]" icon="el-icon-warning" @click="killContainer(clickId)">kill</el-button>
          <el-button type="primary" :loading="loading[6]" :disabled="freeze[5]" icon="el-icon-success" @click="restartContainer(clickId)">restart</el-button>

        </el-button-group>
        <el-button @click="addContainer">添加容器</el-button>

        <el-table
          ref="singleTable"
          :data="containerList"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
          @current-change="getCurrentRow">
          <el-table-column
            label="项目名"
            width="200"
            prop="projectName"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="容器名称"
            width="200"
            prop="name"
            show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="statusName"
            label="状态"
            show-overflow-tooltip
            width="200">
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
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteContainer(scope.row.id)"></el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="服务列表" name="second" class="pane">

        <el-button-group>
          <el-button type="success" :loading="loading[0]" :disabled="freeze[0]" icon="el-icon-success" @click="getStart(clickId)">start</el-button>
          <el-button type="warning" :loading="loading[3]" :disabled="freeze[3]" icon="el-icon-error" @click="stopContainer(clickId)">stop</el-button>
          <el-button type="warning" :loading="loading[4]" :disabled="freeze[4]" icon="el-icon-warning" @click="killContainer(clickId)">kill</el-button>

        </el-button-group>
        <el-button @click="addService">添加服务</el-button>
        <el-table
          ref="singleTable"
          :data="containerList"
          tooltip-effect="light"
          style="width: 100%"
          highlight-current-row
          @current-change="getCurrentRow">
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
            prop="statusName"
            label="状态"
            show-overflow-tooltip
            width="200">
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
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteContainer(scope.row.id)"></el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="项目日志" name="third" class="pane">

      </el-tab-pane>

      <el-tab-pane label="项目详情" name="fourth" class="pane" >配置管理</el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
      data() {
      return {
        activeName:'first',
        containerList:[
        ],
        currentPage:1,
        pageSize:8,
        total:0,
        loading:[false,false,false,false,false,false],
        freeze:[false,false,false,false,false,false],
        targetRow:''

      }
    },
      computed:{
          ...mapGetters({
              projectId:'getProjectId'
          })
      },
    methods:{
      //获取指定项目的容列表
      getContainerList(currentPage, pageSize, projectId){

        let url = "/container/project/" + projectId + "/list?current="+currentPage + "&size="+pageSize
        console.log(url)
        this.$axios.get(url)
          .then((res)=>{

            if (res.data.code == 0) {

              console.log(res.data)
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
      addContainer(){
          this.$store.dispatch('setProjectId',this.projectId);
          this.$router.push('/addContainer')
      },
      addService(){

        this.$router.push("/addService")
      },
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
                  this.getProjectList(this.currentPage,this.pageSize);
                }
              })
              .catch( err =>{
                console.log(err)
              })
          })
          .catch(() => {
          });
      },
      getCurrentRow(row){
        this.targetRow = row.id
      },

      // 容器操作
      getStart:function(targetRow){
        this.loading[0] = true;
        this.$axios.get('/container/start/' + targetRow)
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
      pauseContainer:function(targetRow){
        this.loading[1] = true;
        this.$axios.get('/container/pause/' + targetRow)

      },
      recoverContainer:function(targetRow){
        this.loading[2] = true;
        this.$axios.get('/container/continue/' + targetRow)
      },
      stopContainer:function(targetRow){
        this.loading[3] = true;
        this.$axios.get('/container/stop/' + targetRow)
      },
      killContainer:function(targetRow){
        this.loading[4]= true;
        this.$axios.get('/container/kill/' + targetRow)
      },
      restartContainer:function(targetRow){
        this.loading[5] = true;
        this.$axios.get('/container/restart/' +targetRow
        )
      },

    },
    mounted(){
      this.getContainerList(1,this.pageSize, this.projectId);
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
</style>
