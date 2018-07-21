<template>
  <div id="projectContainer" >
      <div id="sideMenuContainer" class="conta" v-show="true"
           style="z-index: 2;position: absolute;background-color: white;width: 1000px;height: 850px;top:0px;left: 1800px;box-shadow:0 0 10px #dddddd;border-radius: 15px;padding-left: 50px;">
          <h4 style="font-family: 微软雅黑;margin-bottom: 2%">容器实时监控</h4>
          <p style="font-family: 微软雅黑;font-size: 14px;color: #409EFF;margin-bottom: 2%;margin-left: 1%;cursor: pointer"
             @click="closelc">返回</p>

          <el-radio-group v-model="radio" @change="changeExcel($event)" size="medium">
              <el-radio-button label="实时" ></el-radio-button>
              <el-radio-button label="24小时"></el-radio-button>
              <el-radio-button label="每周"></el-radio-button>
          </el-radio-group>
          <div id="main" style="width: 300px;height:200px;float: left"></div>
          <div id="main2" style="width: 300px;height:200px;float: left"></div>
          <div id="main3" style="width: 300px;height:200px;float: left"></div>
          <div id="main4" style="width: 300px;height:200px;float: left"></div>
          <div id="main5" style="width: 300px;height:200px;float: left"></div>
          <div id="main6" style="width: 300px;height:200px;float: left"></div>
          <div id="main7" style="width: 300px;height:200px;float: left"></div>
          <div id="main8" style="width: 300px;height:200px;float: left"></div>
          <div id="main9" style="width: 300px;height:200px;float: left"></div>
      </div>
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
                        <li style="float: left;color: #409EFF;cursor: pointer" @click="consoleopen(scope.row)">打开终端</li>
                        <i class="el-icon-view" @click="getrow(scope.row)"></i>
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
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-input-number v-model="serviceList[scope.$index].replicas" @change="replicasChange(scope.row,scope.$index)" :min="1" :max="10" label="描述文字"></el-input-number>
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
          projectList:[],
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

          row:'',
          str:'',
          time: '',
          flag: 0,
          data: [],
          data2: [],
          data3: [],
          data4: [],
          data5: [],
          data6: [],
          data7: [],
          data8: [],
          data9: [],
          option: {
              title: {
                  text: 'rxbyte'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }
              ],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [
                  {
                      name: '模拟数据',
                      type: 'line',
                      showSymbol: false,
                      // showAllSymbol:true,
                      connectNulls: true,
                      hoverAnimation: false,
                      data: this.data
                  }
              ]
          },
          option2: {
              title: {
                  text: 'txbyte'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }
              ],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [
                  {
                      name: '模拟数据',
                      type: 'line',
                      showSymbol: false,
                      // showAllSymbol:true,
                      connectNulls: true,
                      hoverAnimation: false,
                      data: this.data2
                  }]
          },
          option3: {
              title: {
                  text: 'rxPackets'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data3
              }]
          },
          option4: {
              title: {
                  text: 'txPackets'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data4
              }]
          },
          option5: {
              title: {
                  text: 'cpuUtilization'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data5
              }]
          },
          option6: {
              title: {
                  text: 'memoryUsage'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data6
              }]
          },
          option7: {
              title: {
                  text: 'memoryUtilization'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data7
              }]
          },
          option8: {
              title: {
                  text: 'blockRead'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data8
              }]
          },
          option9: {
              title: {
                  text: 'blockWrite'
              },
              dataZoom: [
                  {
                      type: 'slider',
                      show: false,
                      yAxisIndex: [0],
                      left: '96%',
                      bottom: '5%',
                      start: 0,
                      end: 100
                  }],
              tooltip: {
                  trigger: 'axis',
              },
              xAxis: {
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: true
                  }
              },
              series: [{
                  name: '模拟数据',
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data9
              }]
          },
          radio:'实时',
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
        // 获得项目列表
        getProjectList(){
            this.$axios.get('/project/self/list')
                .then(response=>{
                    this.projectList = response.data.data.records;
                }).catch(function (err) {
                console.log(err);
            })
        },

        // 修改横向扩展
        replicasChange(row,index){
            console.log("her");
            this.$axios.post('/service/scale',{
                'id':row.id,
                'num':this.serviceList[index].replicas,
            })
                .then(response=>{
                    this.$message(response.data.message);
                    this.getServiceInfo();
                }).catch(function (err) {
                console.log(err);
            })
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

        closelc() {
            $('#sideMenuContainer').animate({left:'1800px'},1000);
            // this.isShow = false;
            clearInterval(this.time);
        },
        createEcharts: function () {
            let myChart = this.$echarts.init(document.getElementById('main'));
            let chart2 = this.$echarts.init(document.getElementById('main2'));
            let chart3 = this.$echarts.init(document.getElementById('main3'));
            let chart4 = this.$echarts.init(document.getElementById('main4'));
            let chart5 = this.$echarts.init(document.getElementById('main5'));
            let chart6 = this.$echarts.init(document.getElementById('main6'));
            let chart7 = this.$echarts.init(document.getElementById('main7'));
            let chart8 = this.$echarts.init(document.getElementById('main8'));
            let chart9 = this.$echarts.init(document.getElementById('main9'));


            myChart.setOption(this.option);
            chart2.setOption(this.option2);
            chart3.setOption(this.option3);
            chart4.setOption(this.option4);
            chart5.setOption(this.option5);
            chart6.setOption(this.option6);
            chart7.setOption(this.option7);
            chart8.setOption(this.option8);
            chart9.setOption(this.option9);
        },
        // 查看echarts图表
        getrow(row){
            this.radio = '实时';
            this.flag=0;
            this.row = row;
            this.handleView(this.row,10000,"actual");
        },
        handleView: function (row,val,str) {
            this.hassendmonitor = true;

            this.data=[];
            this.data2=[];
            this.data3=[];
            this.data4=[];
            this.data5=[];
            this.data6=[];
            this.data7=[];
            this.data8=[];
            this.data9=[];

            let myChart = this.$echarts.init(document.getElementById('main'));
            let chart2 = this.$echarts.init(document.getElementById('main2'));
            let chart3 = this.$echarts.init(document.getElementById('main3'));
            let chart4 = this.$echarts.init(document.getElementById('main4'));
            let chart5 = this.$echarts.init(document.getElementById('main5'));
            let chart6 = this.$echarts.init(document.getElementById('main6'));
            let chart7 = this.$echarts.init(document.getElementById('main7'));
            let chart8 = this.$echarts.init(document.getElementById('main8'));
            let chart9 = this.$echarts.init(document.getElementById('main9'));

            $('#sideMenuContainer').animate({left:'700px'},1000);

            this.$axios.get('/monitor/container/'+str+'/' + row.id)
                .then(response => {
                    if (response.data.code === 0) {
                        this.content = response.data.data;
                        // console.log(this.content);
                        this.content = this.content.toString().replace("\\", "");
                        this.content = eval('[' + this.content + ']');

                        if (this.flag === 0) {
                            for (let i = 0; i < this.content.length; i++) {
                                let date1 = new Date(this.content[i].timestamp);
                                let timestamp1 = date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
                                // console.log(timestamp1);
                                let rxbyte = this.content[i].rxBytes.toString();
                                let txbyte = this.content[i].txBytes.toString();
                                let rxPackets = this.content[i].rxPackets.toString();
                                let txPackets = this.content[i].txPackets.toString();
                                let cpuUtilization = this.content[i].cpuUtilization.toString();
                                let memoryUsage = this.content[i].memoryUsage.toString();
                                let memoryUtilization = this.content[i].memoryUtilization.toString();
                                let blockRead = this.content[i].blockRead.toString();
                                let blockWrite = this.content[i].blockWrite.toString();
                                this.data.push(timestamp1, [timestamp1, rxbyte]);
                                this.data2.push(timestamp1, [timestamp1, txbyte]);
                                this.data3.push(timestamp1, [timestamp1, rxPackets]);
                                this.data4.push(timestamp1, [timestamp1, txPackets]);
                                this.data5.push(timestamp1, [timestamp1, cpuUtilization]);
                                this.data6.push(timestamp1, [timestamp1, memoryUsage]);
                                this.data7.push(timestamp1, [timestamp1, memoryUtilization]);
                                this.data8.push(timestamp1, [timestamp1, blockRead]);
                                this.data9.push(timestamp1, [timestamp1, blockWrite]);
                            }
                        } else {
                            let date2 = new Date(this.content[this.content.length - 1].timestamp);
                            let timestamp2 = date2.toLocaleDateString().replace(/\//g, "-") + " " + date2.toTimeString().substr(0, 8);
                            let rxbyte2 = this.content[this.content.length - 1].rxBytes.toString();
                            let txbyte2 = this.content[this.content.length - 1].txBytes.toString();
                            let rxPackets2 = this.content[this.content.length - 1].rxPackets.toString();
                            let txPackets2 = this.content[this.content.length - 1].txPackets.toString();
                            let cpuUtilization2 = this.content[this.content.length - 1].cpuUtilization.toString();
                            let memoryUsage2 = this.content[this.content.length - 1].memoryUsage.toString();
                            let memoryUtilization2 = this.content[this.content.length - 1].memoryUtilization.toString();
                            let blockRead2 = this.content[this.content.length - 1].blockRead.toString();
                            let blockWrite2 = this.content[this.content.length - 1].blockWrite.toString();
                            this.data.push(timestamp2, [timestamp2, rxbyte2]);
                            this.data2.push(timestamp2, [timestamp2, txbyte2]);
                            this.data3.push(timestamp2, [timestamp2, rxPackets2]);
                            this.data4.push(timestamp2, [timestamp2, txPackets2]);
                            this.data5.push(timestamp2, [timestamp2, cpuUtilization2]);
                            this.data6.push(timestamp2, [timestamp2, memoryUsage2]);
                            this.data7.push(timestamp2, [timestamp2, memoryUtilization2]);
                            this.data8.push(timestamp2, [timestamp2, blockRead2]);
                            this.data9.push(timestamp2, [timestamp2, blockWrite2]);
                        }
                        this.flag++;

                        myChart.setOption({
                            series: [{
                                data: this.data
                            }]
                        });
                        chart2.setOption({
                            series: [{
                                data: this.data2
                            }]
                        });
                        chart3.setOption({
                            series: [{
                                data: this.data3
                            }]
                        });
                        chart4.setOption({
                            series: [{
                                data: this.data4
                            }]
                        });
                        chart5.setOption({
                            series: [{
                                data: this.data5
                            }]
                        });
                        chart6.setOption({
                            series: [{
                                data: this.data6
                            }]
                        });
                        chart7.setOption({
                            series: [{
                                data: this.data7
                            }]
                        });
                        chart8.setOption({
                            series: [{
                                data: this.data8
                            }]
                        });
                        chart9.setOption({
                            series: [{
                                data: this.data9
                            }]
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err)
                });

            var that = this;
            this.time = setInterval(() => {
                that.$axios.get('/monitor/container/'+str+'/' + row.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            that.content = response.data.data;
                            that.content = that.content.toString().replace("\\", "");
                            that.content = eval('[' + that.content + ']');

                            if (that.flag === 0) {
                                for (let i = 0; i < that.content.length; i++) {
                                    let date1 = new Date(that.content[i].timestamp);
                                    let timestamp1 = date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
                                    let rxbyte = that.content[i].rxBytes.toString();
                                    let txbyte = that.content[i].txBytes.toString();
                                    let rxPackets = that.content[i].rxPackets.toString();
                                    let txPackets = that.content[i].txPackets.toString();
                                    let cpuUtilization = that.content[i].cpuUtilization.toString();
                                    let memoryUsage = that.content[i].memoryUsage.toString();
                                    let memoryUtilization = that.content[i].memoryUtilization.toString();
                                    let blockRead = that.content[i].blockRead.toString();
                                    let blockWrite = that.content[i].blockWrite.toString();
                                    that.data.push(timestamp1, [timestamp1, rxbyte]);
                                    that.data2.push(timestamp1, [timestamp1, txbyte]);
                                    that.data3.push(timestamp1, [timestamp1, rxPackets]);
                                    that.data4.push(timestamp1, [timestamp1, txPackets]);
                                    that.data5.push(timestamp1, [timestamp1, cpuUtilization]);
                                    that.data6.push(timestamp1, [timestamp1, memoryUsage]);
                                    that.data7.push(timestamp1, [timestamp1, memoryUtilization]);
                                    that.data8.push(timestamp1, [timestamp1, blockRead]);
                                    that.data9.push(timestamp1, [timestamp1, blockWrite]);
                                }
                            } else {
                                let date2 = new Date(that.content[that.content.length - 1].timestamp);
                                let timestamp2 = date2.toLocaleDateString().replace(/\//g, "-") + " " + date2.toTimeString().substr(0, 8);
                                let rxbyte2 = that.content[that.content.length - 1].rxBytes.toString();
                                let txbyte2 = that.content[that.content.length - 1].txBytes.toString();
                                let rxPackets2 = that.content[that.content.length - 1].rxPackets.toString();
                                let txPackets2 = that.content[that.content.length - 1].txPackets.toString();
                                let cpuUtilization2 = that.content[that.content.length - 1].cpuUtilization.toString();
                                let memoryUsage2 = that.content[that.content.length - 1].memoryUsage.toString();
                                let memoryUtilization2 = that.content[that.content.length - 1].memoryUtilization.toString();
                                let blockRead2 = that.content[that.content.length - 1].blockRead.toString();
                                let blockWrite2 = that.content[that.content.length - 1].blockWrite.toString();
                                that.data.push(timestamp2, [timestamp2, rxbyte2]);
                                that.data2.push(timestamp2, [timestamp2, txbyte2]);
                                that.data3.push(timestamp2, [timestamp2, rxPackets2]);
                                that.data4.push(timestamp2, [timestamp2, txPackets2]);
                                that.data5.push(timestamp2, [timestamp2, cpuUtilization2]);
                                that.data6.push(timestamp2, [timestamp2, memoryUsage2]);
                                that.data7.push(timestamp2, [timestamp2, memoryUtilization2]);
                                that.data8.push(timestamp2, [timestamp2, blockRead2]);
                                that.data9.push(timestamp2, [timestamp2, blockWrite2]);
                            }
                            that.flag++;
                            myChart.setOption({
                                series: [{
                                    data: that.data
                                }]
                            });
                            chart2.setOption({
                                series: [{
                                    data: that.data2
                                }]
                            });
                            chart3.setOption({
                                series: [{
                                    data: that.data3
                                }]
                            });
                            chart4.setOption({
                                series: [{
                                    data: that.data4
                                }]
                            });
                            chart5.setOption({
                                series: [{
                                    data: that.data5
                                }]
                            });
                            chart6.setOption({
                                series: [{
                                    data: that.data6
                                }]
                            });
                            chart7.setOption({
                                series: [{
                                    data: that.data7
                                }]
                            });
                            chart8.setOption({
                                series: [{
                                    data: that.data8
                                }]
                            });
                            chart9.setOption({
                                series: [{
                                    data: that.data9
                                }]
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }, val);
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
      this.createEcharts();
    },

      created(){
          this.initWebSocket();
          this.getServiceInfo();
          this.logInfo(1,5);
          this.getprojectinfo();
          this.getProjectList();
      },


  }
</script>

<style scoped>
  #projectContainer{
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
