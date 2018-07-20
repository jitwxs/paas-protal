<template>
    <div class="containermanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>服务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--<el-button @click="addService">添加服务</el-button>-->
            <el-table
                ref="singleTable"
                :data="serviceList"
                tooltip-effect="light"
                style="width: 100%"
                highlight-current-row>
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
                    label="详情"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="toDetails(scope.row.id)">详情</li>
                        </ul>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteService(scope.row.id)"></el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "service",
        data(){
          return{
              serviceList:[],
          }
        },
        computed:{
            ...mapGetters({
                hostaddr:'gethostaddr'
            })
        },
        methods:{
            getServiceInfo(){
                this.$axios.get('/service/list')
                    .then(response=>{
                        this.serviceList = response.data.data.records;

                        for(var i=0;i<this.serviceList.length; i++){
                            var port = this.serviceList[i].port;
                            // 去除引号
                            this.serviceList[i].port = port.toString().replace("\\","").replace("{","").replace("}","");

                        }

                    }).catch(function (err) {
                    console.log(err);
                })
            },


            toDetails(id){
                this.$store.dispatch("saveServiceId",id);
                this.$router.push("/serviceDetails_u")
            },

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
                                    this.getServiceInfo();
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

            //websocket
            initWebSocket:function(){ //初始化weosocket
                this.$axios.post('/token')
                    .then(response=>{
                        this.userId = response.data.data.userId;

                        this.websock = new WebSocket("ws://" + this.hostaddr + "/ws/"+this.userId);

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
                // const redata = JSON.parse(e.data);
                //注意：长连接我们是后台直接1秒推送一条数据，
                //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
                //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
                e = eval('('+e.data+')');
                console.log(e);
                this.openmessage = e.data.message;
                if (e.code === 0){
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
                            this.getContainerInfo();

                        }).catch(function (err) {
                        console.log(err);
                    });
                    this.$notify({
                        title: e.message,
                        message: this.openmessage,
                        type: 'success'
                    });
                }else {
                    this.$notify.error({
                        title: '错误',
                        message: this.openmessage,
                    });
                }
                this.loading=[false,false,false,false,false,false];

            },

            websocketsend:function(agentData){//数据发送
                this.websock.send(agentData);
            },

            websocketclose:function(e){ //关闭
                console.log("connection closed (" + e.code + ")");
            },
        },
        created(){
            this.initWebSocket();
            this.getServiceInfo();
        },
    }
</script>

<style scoped>

</style>
