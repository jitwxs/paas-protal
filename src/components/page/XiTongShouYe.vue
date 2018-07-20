<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <!--管理员的角色信息-->
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="../../../static/img/rabbit.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>{{hostInfo.time}}</span></div>
                        </el-card>

                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <h4>宿主机详情</h4>
                            </div>
                            <ul style="list-style-type: none;">
                                <li style="margin-bottom: 15px">宿主机名称：{{hostInfo.hostName}}</li>
                                <li style="margin-bottom: 15px">系统类型：{{hostInfo.architecture}}</li>
                                <li style="margin-bottom: 15px">内核名称：{{hostInfo.osName}}</li>
                                <li style="margin-bottom: 15px">docker版本：{{hostInfo.dockerVersion}}</li>
                                <li style="margin-bottom: 15px">内存大小：{{hostInfo.memorySize}}G</li>
                            </ul>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>

            <!--系统的总体信息-->
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{hostInfo.cupNum}}</div>
                                    <div>cup数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{hostInfo.imageNum}}</div>
                                    <div>镜像数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{hostInfo.containerNum}}</div>
                                    <div>容器数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>容器数据</span>
                    </div>
                    <div id="main" style="width: 700px;height: 300px;margin-left: 30px">
                    </div>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'xitongshouye',
        data() {
            return {
                // 当前用户名称
                name: sessionStorage.getItem('userName'),
                roleId: sessionStorage.getItem('currentRole'),
                // 宿主机的信息
                hostInfo: {
                    // "hostName": "bogon",
                    // "architecture": "x86_64",
                    // "osName": "CentOS Linux 7 (Core)",
                    // "cupNum": 1,
                    // "memorySize": '0.95',
                    // "dockerVersion": "17.09.0-ce",
                    // "imageNum": 8,
                    // "containerNum": 3,
                    // "containerRunningNum": 3,
                    // "containerPauseNum": 0,
                    // "containerStopNum": 0,
                    // "time": "2018-07-09 14:39:43"
                },
                containerNum:7,
                runningNum:7,
                pauseNum:0,
                stopNum:0,
            }
        },
        methods:{
            //获取宿主机信息
            getHostInfo:function () {
                this.$axios.get('/monitor/host')
                    .then(response=>{
                        if(response.data.code === 0){
                            this.hostInfo = response.data.data;

                            let myChart = this.$echarts.init(document.getElementById('main'));
                            myChart.setOption({
                                // title: {
                                //     text: '容器状态',
                                //     left: 'center',
                                //     top: 20,
                                //     textStyle: {
                                //         color: '#ccc'
                                //     }
                                // },

                                tooltip : {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },

                                legend: {
                                    orient: 'vertical',
                                    x: 'right',
                                    data:['运行的容器','暂停的容器','停止的容器']
                                },
                                series : [
                                    {
                                        name:'访问来源',
                                        type:'pie',
                                        radius : '55%',
                                        center: ['50%', '50%'],
                                        data:[
                                            {value:this.hostInfo.containerRunningNum, name:'运行的容器', selected:true},
                                            {value:this.hostInfo.containerPauseNum, name:'暂停的容器'},
                                            {value:this.hostInfo.containerStopNum, name:'停止的容器'},
                                        ],
                                        label: {
                                            normal: {
                                                position: 'inner',
                                                textStyle: {
                                                    color: 'rgba(255, 255, 255, 0.3)'
                                                }
                                            }
                                        },
                                        labelLine: {
                                            normal: {
                                                lineStyle: {
                                                    color: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                smooth: 0.2,
                                                length: 10,
                                                length2: 20
                                            }
                                        },
                                        itemStyle: {
                                            normal: {
                                                // color: '#c23531',
                                                // shadowBlur: 200,
                                                // shadowColor: 'rgba(0, 0, 0, 0.5)'
                                            }
                                        },

                                        animationType: 'scale',
                                        animationEasing: 'elasticOut',
                                        animationDelay: function (idx) {
                                            return Math.random() * 200;
                                        }
                                    }
                                ]
                            });
                        }else{
                            this.$message.error({
                                message:"获取宿主机信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 绘制关于容器数据的echarts
            createEcharts:function () {
                let myChart = this.$echarts.init(document.getElementById('main'));
                myChart.setOption(this.option);
            },
        },
        created(){
            this.getHostInfo();
        },
        mounted(){
            this.createEcharts();
        },
        computed: {
            role() {
                return this.roleId === '1' ? '普通用户' : '超级管理员';
            }
        }
    }


</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(100, 213, 114);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }
</style>
