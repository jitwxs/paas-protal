<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <!--用户的角色信息-->
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="../../../static/img/docker2.png" class="user-avator" alt="">
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
                                <span>使用详情</span>
                            </div>
                            容器运行
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="containerRunPer" color="#42b983"></el-progress>
                            <br>容器暂停
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="containerPausePer" color="#f1e05a"></el-progress>
                            <br>容器停止
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="containerStopPer" color="#f56c6c"></el-progress>
                            <br>上传镜像
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="this.selfInfo.uploadImageNum" color="#f1e05a"></el-progress>
                        </el-card>

                    </el-col>
                </el-row>
            </el-col>
            <!--系统的总体信息-->
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <router-link to="/containerAllList">
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
                            <router-link to="/service">
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
                            <router-link to="/projectPage">
                            <div class="grid-content grid-con-2">
                                <div class="DivIcons" style="background-color: #00d1b2">
                                    <img src="../../../static/img/icon_docker-image.svg" class="DivIcon">
                                </div>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{hostInfo.projectNum}}</div>
                                    <div>项目数量</div>
                                </div>
                            </div>
                            </router-link>
                        </el-card>
                    </el-col>
                </el-row>


                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>常用功能</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
                    </div>

                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            项目管理
                        </el-card>
                    </el-col>

                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            容器管理
                        </el-card>
                    </el-col>
                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            镜像管理
                        </el-card>
                    </el-col>
                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            服务管理
                        </el-card>
                    </el-col>
                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            网络管理
                        </el-card>
                    </el-col>
                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            监控管理
                        </el-card>
                    </el-col>

                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                name: sessionStorage.getItem('userName'),
                roleId: sessionStorage.getItem('currentRole'),
                containerRunPer: 0,
                containerPausePer: 0,
                containerStopPer: 0,
                noticeUnreadNum: 0,
                selfInfo: {},
                hostInfo:'',
            }
        },
        computed: {
            role() {
                return this.roleId === "1" ? '普通用户' : '系统管理员';
            }
        },
        methods:{
            formatPer(fenZi, fenMu) {
                if(fenZi === 0) {
                    return 0;
                } else {
                    let per = fenZi / fenMu;
                    return per.toFixed(4) * 100;
                }
            },
            //获取个人信息
            getSelfInfo:function () {
                this.$axios.get('/monitor/self/info')
                    .then(response=>{
                        if(response.data.code === 0){
                            this.selfInfo = response.data.data;

                            this.containerRunPer = this.formatPer(this.selfInfo.containerRunningNum, this.selfInfo.containerNum);
                            this.containerPausePer = this.formatPer(this.selfInfo.containerPauseNum, this.selfInfo.containerNum);
                            this.containerStopPer = this.formatPer(this.selfInfo.containerStopNum, this.selfInfo.containerNum);
                        }else{
                            this.$message.error({
                                message:"获取个人信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            getHostInfo:function () {
                this.$axios.get('/monitor/self/info')
                    .then(response=> {
                        if (response.data.code === 0) {
                            this.hostInfo = response.data.data;
                        }
                    }).catch(function (err) {
                    console.log(err);
                })
            },

            countUnReadNum() {
                this.$axios.get('/notice/countUnRead')
                    .then(response=>{
                        if(response.data.code === 0){
                            this.noticeUnreadNum = response.data.data.toFixed(2);
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getSelfInfo();
            this.countUnReadNum();
            this.getHostInfo();
        }
    }

</script>


<style scoped>
    .DivIcons{
        width: 100px;
        height: 100px;
        background-color: #d1d1d1;
        text-align:center;
        margin:0 auto;

    }
    .DivIcon{
        width: 60px;
        height: 60px;
        display: table-cell;
        vertical-align:middle;
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
