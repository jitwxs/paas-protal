<template>
        <div id="network">
            <el-tabs v-model="activeName">
                <el-tab-pane label="公共网络" name="first">
                    <el-table
                        :data="publicNetWorkInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column prop="name" label="网络名称" >
                        </el-table-column>
                        <el-table-column prop="scope" label="覆盖范围" >
                        </el-table-column>
                        <el-table-column prop="hasIpv6" label="是否开启ipv6" >
                        </el-table-column>
                        <el-table-column prop="hasPublic" label="网络性质" >
                        </el-table-column>
                    </el-table>
                    <!--分页区域-->
                    <el-pagination
                        style="float: right;margin-top: 20px;margin-right: 30px"
                        @current-change="pubhandleCurrentChange"
                        :current-page.sync="pubcurrentPage"
                        @size-change="pubhandleSizeChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pubpageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pubtotalCount">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="个人网络" name="second">
                    <div class="handle-box">
                        <el-button type="primary" icon="el-icon-circle-plus-outline"  @click="handleCreate">创建</el-button>
                    </div>
                    <el-table
                        :data="privateNetWorkInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column prop="name" label="网络名称" >
                        </el-table-column>
                        <el-table-column prop="scope" label="覆盖范围" >
                        </el-table-column>
                        <el-table-column prop="hasIpv6" label="是否开启ipv6" >
                        </el-table-column>
                        <el-table-column prop="hasPublic" label="网络性质" >
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" circle @click="priDelete(scope.row.id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页区域-->
                    <el-pagination
                        @current-change="prihandleCurrentChange"
                        :current-page.sync="pricurrentPage"
                        @size-change="prihandleSizeChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pripageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pritotalCount">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
</template>

<script>
    export default {
        name: "netWork",
        data(){
            return{
                activeName:"first",
                // 搜索网络输入的名称
                select_hasPublic:'',
                // 网络列表信息
                publicNetWorkInfo:[],
                privateNetWorkInfo:[],
                // 分页属性
                pubcurrentPage:1,
                pubpageSize:10,
                pubtotalCount:0,
                pricurrentPage:1,
                pripageSize:10,
                pritotalCount:0,
                // 创建网络发送的信息
                networkForm:{
                    name: '',
                    driver: '',
                    labels: '',
                    hasIpv6: ''
                },
                networkFormVisible:false,
                formLabelWidth:'120px'
            }
        },
        methods:{
            // 获取网络列表信息
            getPublicNetworkInfo:function(){
                this.$axios.get('/network/list' + "?current="+this.pubcurrentPage+" &size="+this.pubpageSize+"&type=1")
                    .then(response=>{
                        // console.log(response.data);
                        if(response.data.code == 0){
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            });
                            this.publicNetWorkInfo = response.data.data.records;
                            for(var i=0; i< this.publicNetWorkInfo.length; i++){
                                if(this.publicNetWorkInfo[i].hasPublic){
                                    this.publicNetWorkInfo[i].hasPublic = '公共网络'
                                }else {
                                    this.publicNetWorkInfo[i].hasPublic = '个人网络'
                                }
                                if(this.publicNetWorkInfo[i].hasIpv6){
                                    this.publicNetWorkInfo[i].hasIpv6 = '是'
                                }else {
                                    this.publicNetWorkInfo[i].hasIpv6 = '否'
                                }
                            }
                            this.pubtotalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            getPrivateNetworkInfo(){
                this.$axios.get('/network/list' + "?current="+this.pricurrentPage+" &size="+this.pripageSize+"&type=2")
                    .then(response=>{
                        console.log(response.data);
                        if(response.data.code == 0){
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            });
                            this.privateNetWorkInfo = response.data.data.records;
                            for(var i=0; i< this.privateNetWorkInfo.length; i++){
                                if(this.privateNetWorkInfo[i].hasPublic){
                                    this.privateNetWorkInfo[i].hasPublic = '公共网络'
                                }else {
                                    this.privateNetWorkInfo[i].hasPublic = '个人网络'
                                }
                                if(this.privateNetWorkInfo[i].hasIpv6){
                                    this.privateNetWorkInfo[i].hasIpv6 = '是'
                                }else {
                                    this.privateNetWorkInfo[i].hasIpv6 = '否'
                                }
                            }
                            this.pritotalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页函数
            pubhandleCurrentChange:function (val) {
                if (val == null) {
                    return;
                }
                this.pubcurrentPage = val;
                this.getPublicNetworkInfo();
            },
            //分页大小
            pubhandleSizeChange(val){
                this.pubcurrentPage = 1;
                this.pubpageSize = val;
                this.getPublicNetworkInfo();
            },

            // 分页函数2
            prihandleCurrentChange:function (val) {
                if (val == null) {
                    return;
                }
                this.pricurrentPage = val;
                this.getPrivateNetworkInfo();
            },
            //分页大小
            prihandleSizeChange(val){
                this.pricurrentPage = 1;
                this.pripageSize = val;
                this.getPrivateNetworkInfo();
            },

            // 点击创建按钮
            handleCreate:function(){
                this.$router.push('/createNetwork');
            },
            // 创建网络信息
            // createNetwork:function(){
            //     this.networkFormVisible = false;
            //     this.$axios.post('/network/self/create',{
            //         name: this.networkForm.name,
            //         driver:this.networkForm.driver,
            //         labels: this.networkForm.labels,
            //         hasIpv6: this.networkForm.hasIpv6
            //     })
            //         .then(response=>{
            //             console.log(response)
            //             if(response.data.code == 0){
            //                 this.$message.success({
            //                     message: "创建网络信息成功！",
            //                     showClose: true
            //                 })
            //                 this.getNetworkInfo();
            //             }else {
            //                 this.$message.error({
            //                     message: "创建网络信息失败！",
            //                     showClose: true
            //                 })
            //             }
            //         })
            //         .catch(function (err) {
            //             console.log(err)
            //         })
            // },
            // 删除网络信息
            priDelete(id){
                this.$axios.delete('/network/delete/' + id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            })
                        }else{
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getPublicNetworkInfo();
            this.getPrivateNetworkInfo();
        }
    }
</script>

<style scoped>
    #network{
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 400px;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 100px;
    }

    .handle-input {
        width: 150px;
        display: inline-block;
    }

</style>

