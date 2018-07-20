<template>
  <div id="main">
    <el-tabs  v-model="activeName">

    <el-tab-pane label="容器列表" name="first" class="pane">

      <el-button type="primary" icon="el-icon-edit" class="toolbar" @click="editeContainer">编辑</el-button>

    <div id="tabelDiv">
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

        <!--<el-table-column-->
        <!--label="操作"-->
        <!--width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button type="danger" icon="el-icon-delete" circle @click="deleteContainer(scope.row.id)"></el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->

      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next,jumper"
        :total="total"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        v-if="this.total>10"
        id="pagination"
      >
      </el-pagination>


    </div>

    </el-tab-pane>

    <el-tab-pane label="都是非法" name="fourth" class="pane" >配置管理</el-tab-pane>

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
        currentPage:1,
        pageSize:10,
        total:0,
        containerInfo:''
      }
    },
    methods:{

      //获取分页的每一页的数据
      getContainerList(page,size){

        this.$axios.get("/container/list/?current="+page+"&size="+size)
          .then((res)=>{

            if (res.data.code == 0) {
              this.total = res.data.data.total;
              this.containerList = res.data.data.records;

              // console.log(this.total)
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

              this.$message.error(res.data.message)
            }
          })
          .catch((err)=>{
            console.log(err)
          })
      },
      getCurrentRow(value){
        this.containerInfo = value;
      },
      // 修改容器信息
      editeContainer(){
        console.log(this.containerInfo.id)
        this.$store.dispatch("setEditeContainerProjectId",this.containerInfo.id)
        this.$router.push("/editeContainerProject")
      },
      handleCurrentChange(val){

        this.currentPage = val ;
        this.getContainerList(this.currentPage,this.pageSize)
      }
    },
    created(){
      this.getContainerList(1,this.pageSize);
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
