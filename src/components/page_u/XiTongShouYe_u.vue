<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <!--用户的角色信息-->
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="../../../static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
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
                            容器运行数量
                            <el-progress :percentage="containerRunPer" color="#42b983"></el-progress>
                            上传镜像数量
                            <el-progress :percentage="this.selfInfo.uploadImageNum" color="#f1e05a"></el-progress>
                            HUB镜像数量
                            <el-progress :percentage="this.selfInfo.hubImageNum" color="#f56c6c"></el-progress>
                            未读消息数量
                            <el-progress :percentage="this.noticeUnreadNum" color="#f56c6c"></el-progress>
                        </el-card>

                    </el-col>
                </el-row>
            </el-col>
            <!--系统的总体信息-->
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{selfInfo.projectNum}}</div>
                                    <div>项目数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{selfInfo.containerNum}}</div>
                                    <div>容器数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{selfInfo.serviceNum}}</div>
                                    <div>服务数量</div>
                                </div>
                            </div>
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
                noticeUnreadNum: 0,
                selfInfo: {}
            }
        },
        computed: {
            role() {
                return this.roleId === "1" ? '普通用户' : '系统管理员';
            }
        },
        methods:{
            //获取个人信息
            getSelfInfo:function () {
                this.$axios.get('/monitor/self/info')
                    .then(response=>{
                        if(response.data.code === 0){
                            this.selfInfo = response.data.data;

                            if(this.selfInfo.containerRunningNum === 0) {
                                this.containerRunPer = 0;
                            } else {
                                let per = this.selfInfo.containerRunningNum / this.selfInfo.containerNum;
                                this.containerRunPer = per * 100;
                            }
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
            countUnReadNum() {
                this.$axios.get('/notice/countUnRead')
                    .then(response=>{
                        if(response.data.code === 0){
                            console.log(response.data.data)
                            this.noticeUnreadNum = response.data.data;
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
        color: rgb(45, 140, 240);
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
