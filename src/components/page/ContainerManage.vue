<template>
    <div class="containermanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>容器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="overflow: hidden">
            <!--echarts图表展示区域-->
            <div id="sideMenuContainer" class="conta" v-show="true"
                 style="z-index: 2;position: absolute;background-color: white;width: 1000px;height: 850px;top:0px;left: 1800px;box-shadow:0 0 10px #dddddd;border-radius: 15px;padding-left: 50px;">
                <h4 style="font-family: 微软雅黑;margin-bottom: 2%">容器实时监控</h4>
                <p style="font-family: 微软雅黑;font-size: 14px;color: #409EFF;margin-bottom: 2%;margin-left: 1%;cursor: pointer"
                   @click="closelc">返回</p>

                <el-radio-group v-model="radio" @change="changeExcel($event)" size="medium" style="position:absolute;float: right" >
                    <el-radio-button label="实时" ></el-radio-button>
                    <el-radio-button label="24小时"></el-radio-button>
                    <el-radio-button label="每周"></el-radio-button>
                </el-radio-group>

                <div style="margin-top: 50px;position: fixed">
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

            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="selectStatus" placeholder="请选择">
                    <el-option
                        v-for="item in selectOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="select_containerName" placeholder="输入容器名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <!--容器信息展示区域-->

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

            <el-button-group>
                <el-button type="success" :loading="loadbutton1" :disabled="enbutton1" icon="el-icon-success"
                           @click="getStart(clickId)">start
                </el-button>
                <el-button type="info" :loading="loadbutton2" :disabled="enbutton2" icon="el-icon-question"
                           @click="pauseContainer(clickId)">pause
                </el-button>
                <el-button type="info" :loading="loadbutton3" :disabled="enbutton3" icon="el-icon-question"
                           @click="recoverContainer(clickId)">recover
                </el-button>
                <el-button type="warning" :loading="loadbutton4" :disabled="enbutton4" icon="el-icon-error"
                           @click="stopContainer(clickId)">stop
                </el-button>
                <el-button type="warning" :loading="loadbutton5" :disabled="enbutton5" icon="el-icon-warning"
                           @click="killContainer(clickId)">kill
                </el-button>
                <el-button type="primary" :loading="loadbutton6" :disabled="enbutton6" icon="el-icon-success"
                           @click="restartContainer(clickId)">restart
                </el-button>
                <el-button type="danger" :loading="loadbutton7" :disabled="enbutton7" icon="el-icon-success"
                           @click="deleteContainer(clickId)">delete
                </el-button>

            </el-button-group>
            <el-button type="success" style="float:right;margin-right: 100px" round @click="pack" :disabled="packable">容器打包</el-button>

            <el-tooltip class="item" effect="dark" content="刷新容器状态" placement="right-end">
                <el-button type="primary" icon="el-icon-refresh" circle @click="refresh"></el-button>
            </el-tooltip>

            <el-table
                :data="containerInfo"
                highlight-current-row
                style="width: 100%"
                @current-change="handleSelectionChange">
                <el-table-column
                    width="30">
                </el-table-column>
                <el-table-column
                    label="容器名称"
                    width="200"
                    prop="name"
                >
                </el-table-column>
                <el-table-column label="监控" width="80">
                    <template slot-scope="scope">
                        <i class="el-icon-view" style="float: left;margin-left: 10px;margin-top: 8px;cursor: pointer"
                           @click="getrow(scope.row)"></i>
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
                <el-table-column
                    prop="username"
                    label="用户"
                    width="200"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="image"
                    label="镜像名称"
                    width="200"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="ip"
                    label="IP地址"
                    width="200"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="port"
                    label="端口映射"
                    width="200"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none">
                                <li style="float: left;margin-left: 5px;color: #409EFF;cursor:pointer" @click="todetail(scope.row.id)">详情</li>
                            <li style="float: left;color: #409EFF;cursor: pointer;margin-left: 10px"
                                @click="consoleopen(scope.row)">打开终端
                            </li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
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
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "ContainerManage",
        data() {
            return {
                packVisible:false,
                form:{
                    name:'',
                    tag:'',
                },
                packable:true,


                str:'',
                row:'',
                timeout:10000,
                radio:'实时',
                currentPage: 1,
                pageSize: 10,
                chartid: '',
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

                selectName: '',
                selectStatus: '',
                selectOptions: [
                    {label: "所有状态", id: ""},
                    {label: "容器关闭", id: "0"},
                    {label: "容器运行", id: "1"},
                    {label: "容器暂停", id: "2"}
                ],
                content: [],
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

                // echarts图表是否显示的状态
                isShow: false,
                activeName: 'first',
                container: {
                    id: '',
                    name: '',
                },

                containerdialog: false,
                // 搜索特定条件的容器
                select_projectName: '',
                select_containerName: '',
                // 容器信息列表
                containerInfo: [],

                portInfo: [],
                // 分页总条数
                totalCount: 0,

                clickId: '',
                clickStatus: '',
                singleSelection: [],
                websock: null,

                enbutton1: true,
                enbutton2: true,
                enbutton3: true,
                enbutton4: true,
                enbutton5: true,
                enbutton6: true,
                enbutton7: true,

                loadbutton1: false,
                loadbutton2: false,
                loadbutton3: false,
                loadbutton4: false,
                loadbutton5: false,
                loadbutton6: false,
                loadbutton7: false,

                openmessage: '',
                hassendmonitor: false,
                wsflag:0,
            }
        },
        computed: {
            ...mapGetters({
                userInfo:'getUserInfo',
                hostaddr: 'gethostaddr'
            })
        },
        methods: {
            // 打包操作
            pack(){
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
                    "containerId":this.singleSelection.id,
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

            todetail(id){
                this.$store.dispatch("setContainerId",id);
              this.$router.push("/ContainerDetails")
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
                if (row.status===0){
                    this.$message('请先运行容器');
                }else {
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

                $('#sideMenuContainer').animate({left:'700px'},1000);

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
            // 同步
            refresh: function () {
                this.$axios.get('/container/sync')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$notify({
                                title: '同步成功',
                                message: '',
                                type: 'success'
                            });
                        }
                    }).catch(function (err) {
                    this.$notify.error({
                        title: '错误',
                        message: '同步失败'
                    });
                    console.log(err);
                })
            },

            // 打开终端
            consoleopen: function (row) {
                if (row.status === 1) {
                    this.$axios.post('/container/terminal/', {
                        "containerId": row.id,
                        "curs": 50,
                        "cols": 200,
                        "colsorBlink": false,
                        "rows": 100,
                        "width": document.documentElement.clientWidth,
                        "height": document.documentElement.clientHeight,
                    })
                        .then(response => {
                            if(response.data.code === 0) {
                                sessionStorage.setItem('terminalCursorBlink', response.data.data.cursorBlink);
                                sessionStorage.setItem('terminalRows', response.data.data.rows);
                                sessionStorage.setItem('terminalCols', response.data.data.cols);
                                sessionStorage.setItem('terminalUrl', response.data.data.url);
                                window.open('../../../static/term.html');
                            } else {
                                this.$message(response.data.message);
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                } else {
                    this.$message("请先开启容器");
                }
            },
            //获取分页的table信息
            getPaginationInfo() {
                let url = '/container/list/' + '?current=' + this.currentPage + '&size=' + this.pageSize + '&status=' + this.selectStatus;
                if (this.select_containerName !== '') {
                    url += "&name=" + this.select_containerName;
                }

                this.$axios.get(url)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.containerInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                            for (let i = 0; i < this.containerInfo.length; i++) {
                                this.containerInfo[i].port = formatPort1(this.containerInfo[i].port);
                            }
                        } else {
                            this.$message.error({
                                message: "获取容器信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },
            // 分页函数
            handleCurrentChange: function (val) {
                if (val == null) {
                    return;
                }
                this.packable=false;
                this.currentPage = val;
                this.getPaginationInfo();
            },
            //分页大小
            handleSizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.getPaginationInfo();
            },
            // 选中操作
            handleSelectionChange(val) {
                if (val == null){
                    return ;
                }
                this.packable=false;
                this.singleSelection = val;
                this.clickId = val.id;
                this.clickStatus = val.status;
                switch (this.clickStatus) {
                    case 0:
                        this.enbutton1 = false;
                        this.enbutton2 = true;
                        this.enbutton3 = true;
                        this.enbutton4 = true;
                        this.enbutton5 = true;
                        this.enbutton7 = false;
                        this.enbutton6 = false;
                        break;
                    case 1:
                        this.enbutton1 = true;
                        this.enbutton2 = false;
                        this.enbutton3 = true;
                        this.enbutton4 = false;
                        this.enbutton5 = false;
                        this.enbutton6 = false;
                        this.enbutton7 = true;
                        break;
                    case 2:
                        this.enbutton1 = true;
                        this.enbutton2 = true;
                        this.enbutton3 = false;
                        this.enbutton4 = false;
                        this.enbutton5 = false;
                        this.enbutton6 = false;
                        this.enbutton7 = true;
                        break;
                }
            },
            //搜索容器
            search(){

                this.getPaginationInfo();
            },
            // 容器操作
            getStart: function (clickId) {
                this.loadbutton1 = true;
                this.Timeout();
                this.$axios.get('/container/start/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
            pauseContainer: function (clickId) {
                this.loadbutton2 = true;
                this.Timeout();
                this.$axios.get('/container/pause/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
            recoverContainer: function (clickId) {
                this.loadbutton3 = true;
                this.Timeout();
                this.$axios.get('/container/continue/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
            stopContainer: function (clickId) {
                this.loadbutton4 = true;
                this.Timeout();
                this.$axios.get('/container/stop/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
            killContainer: function (clickId) {
                this.loadbutton5 = true;
                this.Timeout();
                this.$axios.get('/container/kill/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
            restartContainer: function (clickId) {
                this.loadbutton6 = true;
                this.Timeout();
                this.$axios.get('/container/restart/' + clickId)
                    .then(response => {
                        if (response.data.code === 0) {
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
                this.loadbutton7 = true;
                this.Timeout();
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
            },

            judge(){
                if (this.wsflag==0){
                    this.$notify.error({
                        title:'超时',
                        message:'请重新操作',
                    });
                    this.loading=[false,false,false,false,false,false];
                    this.getPaginationInfo();
                }
            },
            Timeout(){
                this.wsflag=0;
                setTimeout(this.judge,10000)
            },

            initWebSocket: function () { //初始化weosocket
                this.websock = new WebSocket("ws://"+this.hostaddr+"/ws/" + this.userInfo.userId);

                this.websock.onopen = this.websocketonopen;

                this.websock.onerror = this.websocketonerror;

                this.websock.onmessage = this.websocketonmessage;

                this.websock.onclose = this.websocketclose;
            },

            websocketonopen: function () {
                console.log("WebSocket连接成功");
            },

            websocketonerror: function (e) { //错误
                console.log("WebSocket连接发生错误");
            },

            websocketonmessage: function (e) { //数据接收
                // const redata = JSON.parse(e.data);
                //注意：长连接我们是后台直接1秒推送一条数据，
                //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
                //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
                e = eval('(' + e.data + ')');
                this.openmessage = e.data.message;
                if (e.code === 0) {
                    this.wsflag=1;
                    this.$axios.get('/container/status/' + this.clickId)
                        .then(response => {
                            switch (response.data.data) {
                                case 0:
                                    this.enbutton1 = false;
                                    this.enbutton2 = true;
                                    this.enbutton3 = true;
                                    this.enbutton4 = true;
                                    this.enbutton5 = true;
                                    this.enbutton7 = false;
                                    this.enbutton6 = false;

                                    break;
                                case 1:
                                    this.enbutton1 = true;
                                    this.enbutton2 = false;
                                    this.enbutton3 = true;
                                    this.enbutton4 = false;
                                    this.enbutton5 = false;
                                    this.enbutton6 = false;
                                    this.enbutton7 = true;

                                    break;
                                case 2:
                                    this.enbutton1 = true;
                                    this.enbutton2 = true;
                                    this.enbutton3 = false;
                                    this.enbutton4 = false;
                                    this.enbutton5 = false;
                                    this.enbutton6 = false;
                                    this.enbutton7 = true;

                                    break;
                            }
                            this.getPaginationInfo();

                        }).catch(function (err) {
                        console.log(err);
                    });
                    this.$notify({
                        title: e.message,
                        message: this.openmessage,
                        type: 'success'
                    });
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '容器开启失败'
                    });
                }
                this.loadbutton1 = false;
                this.loadbutton2 = false;
                this.loadbutton3 = false;
                this.loadbutton4 = false;
                this.loadbutton5 = false;
                this.loadbutton6 = false;
                this.loadbutton7 = false;
            },

            websocketsend: function (agentData) {//数据发送
                this.websock.send(agentData);
            },

            websocketclose: function (e) { //关闭
                console.log("connection closed (" + e.code + ")");
            },
        },
        created() {
            this.getPaginationInfo();
            this.initWebSocket();
        },
        mounted() {
            this.createEcharts();
        }
    }
</script>

<style scoped>
    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 180px;
        display: inline-block;
    }
    .conta{

        width: 500px;
        height: 500px;
    }
</style>
