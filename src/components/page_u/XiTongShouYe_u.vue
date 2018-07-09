<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <!--管理员的角色信息-->
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div>
                            <div class="user-info-list">上次登录地点：<span>东莞</span></div>
                        </el-card>

                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>使用详情</span>
                            </div>
                            用户使用量
                            <el-progress :percentage="57.2" color="#42b983"></el-progress>
                            项目创建量
                            <el-progress :percentage="29.8" color="#f1e05a"></el-progress>
                            镜像数量
                            <el-progress :percentage="11.9"></el-progress>
                            容器数量
                            <el-progress :percentage="1.1" color="#f56c6c"></el-progress>
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
                                    <div class="grid-num">1234</div>
                                    <div>用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>项目数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>镜像数量</div>
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
                            用户管理
                        </el-card>
                    </el-col>
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
                            仓储管理
                        </el-card>
                    </el-col>

                    <el-col :span="8" style="margin-top: 20px;margin-bottom: 20px">
                        <el-card shadow="hover" style="text-align: center;font-family: 微软雅黑;font-size: 16px">
                            日志管理
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

            }
        },
        computed: {
            role() {
                return this.name === 'admin' ? '普通用户' : '超级管理员';
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
