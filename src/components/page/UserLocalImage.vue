<template>
    <div class="userlocalimage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>本地用户镜像</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName2" >
                <el-tab-pane label="镜像详情" name="first">
                    <pre id="showjson"></pre>
                </el-tab-pane>

                <el-tab-pane label="镜像历史" name="second">
                    <div class="container">
                            <ul class="time-vertical" v-for="(item,index) in historyInfo">
                                <li><b></b><span>{{index+1}}</span><a>{{item.Created}}创建了id为{{item.Id}}，标签是{{item.Tags}},容量是{{item.Size}}的容器 </a></li>
                            </ul>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="暴露端口" name="third">
                    <div class="container">
                            <ul v-for="(item, index) in portInfo" style="list-style-type: none">
                                <li>暴露端口{{index+1}}--{{item}}</li>
                            </ul>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserLocalImage",
        data(){
            return{
                // tab页相关属性
                activeName2:'first',
                // 每条镜像信息的id
                imageId:'',
                // 详情信息
                xiangQingInfo:{},
                // 历史信息
                historyInfo:[],
                // 端口信息
                portInfo:[],
            }
        },
        methods:{
            // 获取详情信息
            getXiangQingInfo:function(){
                this.$axios.get('/image/inspect/' + this.imageId)
                    .then(response=>{
                        if(response.data.code == 0){
                            $("#showjson").html(JSON.stringify(response.data.data, null, 4));
                            // var obj = new Object();
                            // obj = response.data.data;
                            // var arr = new Array();
                            // for(var key in obj){
                            //     var value = obj[key];
                            //     arr.push( key + ":" + value);
                            // }
                            // this.xiangQingInfo = arr;
                            // this.xiangQingInfo = JSON.stringify(obj,undefined,2);
                            // console.log(this.xiangQingInfo);
                        }else {
                            this.$message.error({
                                message: "获取镜像详情信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取历史信息
            getHistoryInfo:function(){
                this.$axios.get('/image/history/' + this.imageId)
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.historyInfo = response.data.data;
                        }else{
                            this.$message.error({
                                message: "获取镜像历史信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取镜像接口信息
            getPortInfo:function(){
                this.$axios.get('/image/' + this.imageId + '/exportPort')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.portInfo = response.data.data;
                        }else {
                            this.$message.error({
                                message: "获取镜像接口信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

        },
        created(){
            this.imageId = this.$route.query.id;
            this.getXiangQingInfo();
            this.getHistoryInfo();
            this.getPortInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 100px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    /*纵向时间轴*/
    .time-vertical {
        list-style-type: none;
        border-left: 1px solid #707070;
        padding: 0px;
        height: 70px;
    }

    .time-vertical li {
        height: 100px;
        position: relative;
    }

    .time-vertical li a {
        display: inline-block;
        margin-left: 20px;
        margin-top: 15px;
        text-decoration: none;
        color: #000;
    }

    .time-vertical li b:before {
        content: '';
        position: absolute;
        top: 15px;
        left: -12px;
        width: 18px;
        height: 18px;
        border: 2px solid #409EFF;
        border-radius: 10px;
        background: #409EFF;
    }

    .time-vertical li span {
        position: absolute;
        color: #fff;
        top: 18px;
        left: -5px;
    }
</style>
