<template>
  <div id="container">
      <!--echarts图表展示区域-->
      <div id="sideMenuContainer" class="conta" v-show="true"
           style="z-index: 2;position: absolute;background-color: white;width: 1000px;height: 850px;top:-90px;left: 1800px;box-shadow:0 0 10px #dddddd;border-radius: 15px;padding-left: 50px;">
          <h4 style="font-family: 微软雅黑;margin-bottom: 2%">容器实时监控</h4>
          <p style="font-family: 微软雅黑;font-size: 14px;color: #409EFF;margin-bottom: 2%;margin-left: 1%;cursor: pointer"
             @click="closelc">返回</p>

          <el-radio-group v-model="radio" @change="changeExcel($event)" size="medium" style="position:absolute;float: right" >
              <el-radio-button label="实时" ></el-radio-button>
              <el-radio-button label="24小时"></el-radio-button>
              <el-radio-button label="每周"></el-radio-button>
          </el-radio-group>

          <div style="margin-top: 70px;">
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

      </div>

      <el-dialog title="打包容器" width="30%" :visible.sync="packVisible" :before-close="handleClose">
          <el-form :model="form" label-width="80px">
              <el-form-item label="镜像名称">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="标签">
                  <el-input v-model="form.tag"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="submitpack">确 定</el-button>
          </span>
      </el-dialog>
      <!--按钮组-->
      <el-button-group>
          <el-button type="success" :loading="loading[0]" :disabled="freeze[0]" icon="el-icon-success" @click="getStart()">start</el-button>
          <el-button type="info" :loading="loading[1]" :disabled="freeze[1]" icon="el-icon-question" @click="pauseContainer()">pause</el-button>
          <el-button type="info" :loading="loading[2]" :disabled="freeze[2]" icon="el-icon-question" @click="recoverContainer()">recover</el-button>
          <el-button type="warning" :loading="loading[3]" :disabled="freeze[3]" icon="el-icon-error" @click="stopContainer()">stop</el-button>
          <el-button type="warning" :loading="loading[4]" :disabled="freeze[4]" icon="el-icon-warning" @click="killContainer()">kill</el-button>
          <el-button type="primary" :loading="loading[6]" :disabled="freeze[5]" icon="el-icon-success" @click="restartContainer()">restart</el-button>

      </el-button-group>
      <el-button type="success" style="float:right;margin-right: 100px" round @click="pack" :disabled="packable">容器打包</el-button>
      <!--列表-->
      <el-table ref="singleTable" :data="containerList" tooltip-effect="dark" style="width: 100%" highlight-current-row @current-change="getCurrentContainerRow" >

          <el-table-column label="容器名称" show-overflow-tooltip>
              <template slot-scope="scope">
                  <!--跳tab-->
                  <ul style="float: left;list-style-type: none" >
                      <router-link :to="{path:'/containerDetails', query:{id:scope.row.id}}">
                          <li style="float: left;cursor:pointer">{{scope.row.name}}</li>
                      </router-link>
                  </ul>
              </template>
          </el-table-column>
          <el-table-column label="项目" prop="projectName" show-overflow-tooltip>
              <template slot-scope="scope">
                  <el-select v-model="containerList[scope.$index].projectName" style="width: 80%;" placeholder="请选择" @change="changeProject(scope.row,scope.$index)">
                      <el-option
                          v-for="item in projectInfo"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                      </el-option>
                  </el-select>
              </template>
          </el-table-column>
          <el-table-column
              label="容器状态"
              width="200">
              <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper" style="float: left">
                      <el-tag v-if="scope.row.statusName === '容器关闭'" type="danger">{{ scope.row.statusName }}</el-tag>
                      <el-tag v-else-if="scope.row.statusName === '容器暂停'" type="warning">{{ scope.row.statusName }}</el-tag>
                      <el-tag v-else-if="scope.row.statusName === '容器运行'" type="success">{{ scope.row.statusName }}</el-tag>
                      <el-tag v-else type="info">{{ scope.row.statusName }}</el-tag>
                  </div>
              </template>
          </el-table-column>
          <el-table-column  label="监控" show-overflow-tooltip>
              <template slot-scope="scope">
                  <ul style="float: left;list-style-type: none" >
                      <i class="el-icon-view" style="margin-left: 5px;cursor: pointer" @click="getrow(scope.row)"></i>
                  </ul>
              </template>
          </el-table-column>
          <el-table-column prop="image" label="镜像" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ip" label="IP地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="port" label="端口映射" show-overflow-tooltip></el-table-column>
          <el-table-column label="终端" >
              <template slot-scope="scope">
                  <ul style="float: left;list-style-type: none" >
                      <li style="float: left;color: #409EFF;cursor: pointer" @click="consoleopen(scope.row)">打开终端</li>
                  </ul>
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <ul style="float: left;list-style-type: none" >
                      <li style="float: left;color: #409EFF;cursor: pointer" @click="todetail(scope.row)">详情</li>
                      <li style="float: left;color: #409EFF;cursor: pointer;margin-left: 10px" @click="deleteContainer(scope.row.id)">删除</li>
                  </ul>
              </template>
          </el-table-column>
      </el-table>

      <el-pagination
          style="float: right;bottom: 30px;right: 50px;position: absolute;"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>

      <br/><br/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
          packVisible:false,
          form:{
              name:'',
              tag:'',
          },
          packable:true,
          // test:'123',
          projectInfo:[],
          projectNum:0,
          value:[],

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
                  text: '网络入带宽 Mbps'
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
                  formatter:'{c1}Mbps'
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
                      type: 'line',
                      showSymbol: false,
                      // showAllSymbol:true,
                      connectNulls: true,
                      hoverAnimation: false,
                      itemStyle : {
                          normal : {
                              lineStyle:{
                                  color:'#015dda',
                                  width:'1'
                              }
                          }
                      },
                      data: this.data
                  }
              ]
          },
          option2: {
              title: {
                  text: '网络出带宽 Mbps'
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
                  formatter:'{c1}Mbps'
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
                      itemStyle : {
                          normal : {
                              lineStyle:{
                                  color:'#015dda',
                                  width:'1'
                              }
                          }
                      },
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
                  text: '网络入包量 个/s'
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
                  formatter:'{c0} <br/>{c1}个/秒'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
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
                  text: '网络出包量 个/秒'
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
                  formatter:'{c1}个/秒'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
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
                  text: 'CPU利用率'
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
                  formatter:'{c1}%'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
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
                  text: '内存使用量 Mb'
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
                  formatter:'{c1}Mb'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
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
                  text: '内存使用率'
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
                  formatter:'{c1}%'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
                  type: 'line',
                  showSymbol: false,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data7
              }]
          },
          option8: {
              title: {
                  text: '本地读流量 MB'
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
                  formatter:'{c1}MB'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
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
                  text: '本地写流量 MB'
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
                  formatter:'{c1}MB'
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
                  itemStyle : {
                      normal : {
                          lineStyle:{
                              color:'#015dda',
                              width:'1'
                          }
                      }
                  },
                  type: 'line',
                  showSymbol: false,
                  // showAllSymbol:true,
                  connectNulls: true,
                  hoverAnimation: false,
                  data: this.data9
              }]
          },
          radio:'实时',

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
            this.timeout();
            this.$axios.get('/container/start/' + this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
            this.timeout();
            this.$axios.get('/container/pause/' + this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
            this.timeout();
            this.$axios.get('/container/continue/' + this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
            this.timeout();
            this.$axios.get('/container/stop/' + this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
            this.timeout();
            this.$axios.get('/container/kill/' + this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
            this.timeout();
            this.$axios.get('/container/restart/' +this.targetRow)
                .then(response=>{
                    this.wsflag=0;
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
        deleteContainer: function (clickId) {
            this.$confirm('此操作将永久删除该容器, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.wsflag=0;
                this.$axios.delete('/container/delete/' + clickId)
                .then(response => {
                    if (response.data.code === 0) {
                        this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(response.data.message);
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
            });
        },

        // 打包操作
        pack(){
            console.log(this.targetRow);
            this.packVisible=true;
        },

        handleClose(){
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.packVisible=false;
                })
                .catch(_ => {});
        },

        submitpack(){
            if (this.form.name==""){
                this.$message.error("请填写镜像名称");
                return;
            }
            this.$axios.post('/container/commit',{
                "containerId":this.targetRow,
                "name":this.form.name,
                "tag":this.form.tag
            })
                .then(response=>{
                    if (response.data.code===0){
                        this.$message.success(response.data.data);
                        this.packVisible=false;
                    }
                }).catch(function (err) {
                console.log(err);
            })
        },

        todetail(row){
            this.$router.push({
                path: '/containerDetails',
                query: {
                    id: row.id,
                }
            })
        },
        judge(){
            if (this.wsflag===0){
                this.$notify.error({
                    title:'超时',
                    message:'请重新操作',
                });
                this.loading=[false,false,false,false,false,false];
                this.getContainerList();
            }
        },
        timeout(){
            this.wsflag=0;
            setTimeout(this.judge,10000)
        },

        //获取容器当前id
        getCurrentContainerRow(row){
            if (row === null) {
                return ;
            }
            this.packable=false;
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

        // 分页函数
        handleCurrentChange:function (val) {
            if (val == null) {
                return;
            }
            this.currentPage = val;
            this.getContainerList();
        },
        //分页大小
        handleSizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;
            this.getContainerList();
        },
        //获取容器列表
        getContainerList(){
            let url = "/container/list/?current="+this.currentPage + "&size="+this.pageSize;
            this.$axios.get(url)
                .then((res)=>{
                    if (res.data.code === 0) {
                        this.containerList = res.data.data.records;
                        this.totalCount = res.data.data.total;
                        for(let i=0;i<this.containerList.length; i++){
                            this.containerList[i].port = formatPort1(this.containerList[i].port);
                        }
                    } else {
                        this.$message.error("获取列表失败")
                    }
                })
                .catch( (err) =>{
                    console.log(err)
                })
        },

        changeExcel(val) {
            switch (val){
                case "实时":
                    this.flag = 0;
                    window.clearInterval(this.time);
                    this.timeout=10000;
                    this.handleView(this.row,this.timeout,"actual");
                    break;
                case "24小时":
                    this.flag = 0;
                    window.clearInterval(this.time);
                    this.timeout=60000;
                    this.handleView(this.row,this.timeout,"today");
                    break;
                case "每周":
                    this.flag = 0;
                    window.clearInterval(this.time);
                    this.timeout=360000;
                    this.handleView(this.row,this.timeout,"week");
                    break;
            }
        },

        closelc() {
            $('#sideMenuContainer').animate({left:'1700px'},1000);
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
            if (this.row.status===0){
                this.$message("请先开启容器");
            } else {
                this.handleView(this.row,10000,"actual");
            }

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

            $('#sideMenuContainer').animate({left:'593px'},1000);

            this.$axios.get('/monitor/container/'+str+'/' + row.id)
                .then(response => {
                    if (response.data.code === 0) {
                        this.content = response.data.data;
                        this.content = this.content.toString().replace("\\", "");
                        this.content = eval('[' + this.content + ']');

                        if (this.flag === 0) {
                            for (let i = 0; i < this.content.length; i++) {
                                let date1 = new Date(this.content[i].timestamp);
                                let timestamp1 = date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
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

        changeProject(row,val){
            this.$axios.post('/container/changeProject',{
                "containerId":row.id,
                "projectId":this.containerList[val].projectName,
            })
                .then(response=>{
                    this.$message(response.data.message);
                    this.getContainerList();
                }).catch(function (err) {
                console.log(err);
            })
        },

        // 打开终端
        consoleopen(row){
            if (row.status===1){
                this.$axios.post('/container/terminal/' ,{
                    "containerId": row.id,
                    "cursorBlink": false,
                    "rows": 50,
                    "cols": 200,
                    "width": document.documentElement.clientWidth,
                    "height": document.documentElement.clientHeight,
                })
                    .then(response=>{
                       if(response.data.code === 0) {
                           sessionStorage.setItem('terminalCursorBlink', response.data.data.cursorBlink);
                           sessionStorage.setItem('terminalRows',response.data.data.rows);
                           sessionStorage.setItem('terminalCols',response.data.data.cols);
                           sessionStorage.setItem('terminalUrl',response.data.data.url);
                           window.open('../../../static/term.html');
                       } else {
                           this.$message(response.data.message);
                       }
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
            var that= this;
            e = eval('('+e.data+')');
            if (e.code === 0){
                //容器相关
                if (e.data.type===0){
                    that.wsflag=1;
                    this.$axios.get('/container/status/'+this.targetRow)
                        .then(respone=>{
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
                            this.getContainerList();

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
      this.getContainerList();
      this.initWebSocket();
      this.getProjectInfo();
    },
      mounted() {
          this.createEcharts();
      }
  }
</script>

<style scoped>
  #container{
    padding: 50px;
    margin: 20px;
    box-shadow: 3px 3px 10px #dddddd;
    background-color: white;
    border-radius: 15px;
    min-height: 670px;
      position: relative;
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
