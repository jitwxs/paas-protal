<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <!--管理员的角色信息-->
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="../../../static/img/docker.png" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name" style="margin-bottom: 10px;">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>{{selfInfo.lastLogin}}</span></div>
                            <div class="user-info-list">上次登录地点：<span>{{selfInfo.ip}}</span></div>
                        </el-card>

                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <h4>宿主机详情</h4>
                            </div>
                            <el-form :label-position='labelpos' label-width="100px">
                                <el-form-item label="宿主机名称">
                                    {{hostInfo.hostName}}
                                </el-form-item>
                                <el-form-item label="系统类型">
                                    {{hostInfo.architecture}}
                                </el-form-item>
                                <el-form-item label="内核名称">
                                    {{hostInfo.osName}}
                                </el-form-item>
                                <el-form-item label="Docker版本">
                                    {{hostInfo.dockerVersion}}
                                </el-form-item>
                                <el-form-item label="内存大小">
                                    {{hostInfo.memorySize}} G
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>

            <!--系统的总体信息-->
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <router-link to="/containermanage">
                                <div class="grid-content grid-con-3">
                                    <div class="DivIcons">
                                        <img src="../../../static/img/icon_docker.svg" class="DivIcon">
                                    </div>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{hostInfo.containerNum}}</div>
                                        <div>容器数量</div>
                                    </div>
                                </div>
                            </router-link>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <router-link to="/servicemanage">
                                <div class="grid-content grid-con-1">
                                    <div class="grid-content grid-con-2">
                                        <div class="DivIcons" style="background-color: #68c2d7">
                                            <img src="../../../static/img/swarm.svg" class="DivIcon">
                                        </div>
                                    </div>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{hostInfo.serviceNum}}</div>
                                        <div>服务数量</div>
                                    </div>
                                </div>
                            </router-link>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <router-link to="/imagemanage">
                                <div class="grid-content grid-con-2">
                                    <div class="DivIcons" style="background-color: #00d1b2">
                                        <img src="../../../static/img/icon_docker-image.svg" class="DivIcon">
                                    </div>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{hostInfo.imageNum}}</div>
                                        <div>镜像数量</div>
                                    </div>
                                </div>
                            </router-link>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <h4>集群节点</h4>
                    </div>
                    <el-collapse accordion>
                        <el-collapse-item v-for="item in hostInfo.nodes"  >
                            <template slot="title">
                                <el-tag v-if="item.hasLeader" type="danger">Leader</el-tag>
                                <el-tag  v-else>Worker</el-tag>
                                &nbsp;&nbsp;&nbsp;&nbsp;{{item.ip}}
                            </template>
                            <el-form :label-position='labelpos' label-width="100px">
                                <el-form-item label="主机名称">
                                    {{item.hostName}}
                                </el-form-item>
                                <el-form-item label="系统架构">
                                    {{item.architecture}}
                                </el-form-item>
                                <el-form-item label="Docker版本">
                                    {{item.dockerVersion}}
                                </el-form-item>
                                <el-form-item label="状态">
                                    <el-tag v-if="item.state === 'ready'" type="success">Ready</el-tag>
                                    <el-tag v-else type="danger">{{item.state}}</el-tag>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <h4>容器数据</h4>
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
                hostInfo: {},
                containerNum: 0,
                runningNum: 0,
                pauseNum: 0,
                stopNum: 0,
                selfInfo: {},
                labelpos: 'left',
            }
        },
        methods: {
            getSelfInfo: function () {
                this.$axios.get('/monitor/self/info')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.selfInfo = response.data.data;
                        } else {
                            this.$message.error("获取个人信息失败！");
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            //获取宿主机信息
            getHostInfo: function () {
                this.$axios.get('/monitor/host')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.hostInfo = response.data.data;

                            let myChart = this.$echarts.init(document.getElementById('main'));
                            myChart.setOption({
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },

                                legend: {
                                    orient: 'vertical',
                                    x: 'right',
                                    data: ['运行的容器', '暂停的容器', '停止的容器']
                                },
                                series: [
                                    {
                                        name: '访问来源',
                                        type: 'pie',
                                        radius: '55%',
                                        center: ['50%', '50%'],
                                        data: [
                                            {value: this.hostInfo.containerRunningNum, name: '运行的容器', selected: true},
                                            {value: this.hostInfo.containerPauseNum, name: '暂停的容器'},
                                            {value: this.hostInfo.containerStopNum, name: '停止的容器'},
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
                                            normal: {}
                                        },

                                        animationType: 'scale',
                                        animationEasing: 'elasticOut',
                                        animationDelay: function (idx) {
                                            return Math.random() * 200;
                                        }
                                    }
                                ]
                            });
                        } else {
                            this.$message.error({
                                message: "获取宿主机信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 绘制关于容器数据的echarts
        },
        created() {
            this.getHostInfo();
            this.getSelfInfo();
        },
        computed: {
            role() {
                return this.roleId === '1' ? '普通用户' : '超级管理员';
            }
        }
    }


</script>


<style scoped>
    .DivIcons {
        width: 100px;
        height: 100px;
        background-color: #d1d1d1;
        text-align: center;
        margin: 0 auto;

    }

    .DivIcon {
        width: 60px;
        height: 60px;
        display: table-cell;
        vertical-align: middle;
        margin-top: 15px;
    }

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
