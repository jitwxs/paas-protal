<template>
        <div id="network">
            <el-tabs v-model="activeName">
                <el-tab-pane label="公共网络" name="first" style="min-height: 530px">
                    <el-table
                        :data="publicNetWorkInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column label="网络名称" >
                            <template slot-scope="scope">
                                <span  style="cursor:pointer;" @click="handlepubView(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="scope" label="覆盖范围" >
                        </el-table-column>
                        <el-table-column prop="hasIpv6" label="是否开启ipv6" >
                        </el-table-column>
                        <el-table-column prop="hasPublic" label="网络性质" >
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                            <ul style="float: left;list-style-type: none" >
                                <li style="float: left;color: #409EFF;cursor: pointer" @click="handlepubView(scope.row)">详情</li>
                            </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页区域-->
                    <el-pagination
                        style="float: right;bottom: 30px;right: 50px;position: absolute;"
                        @current-change="pubhandleCurrentChange"
                        :current-page.sync="pubcurrentPage"
                        @size-change="pubhandleSizeChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pubpageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pubtotalCount">
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="个人网络" name="second" style="min-height: 530px">
                    <div class="handle-box">
                        <el-button icon="el-icon-circle-plus-outline"  @click="handleCreate">创建</el-button>
                    </div>
                    <el-table
                        :data="privateNetWorkInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column  label="网络名称" >
                            <template slot-scope="scope">
                                <span style="cursor:pointer;" @click="handlepubView(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="scope" label="覆盖范围" >
                        </el-table-column>
                        <el-table-column prop="hasIpv6" label="是否开启ipv6" >
                        </el-table-column>
                        <el-table-column prop="hasPublic" label="网络性质" >
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <li style="float: left;color: #409EFF;cursor: pointer;margin-left: 10px" @click="handlepubView(scope.row)">详情</li>
                                    <li style="float: left;color: #409EFF;cursor: pointer;margin-left: 10px" @click="priDelete(scope.row.id)">删除</li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页区域-->
                    <el-pagination
                        style="float: right;bottom: 30px;right: 50px;position: absolute;"
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
            formatNetworkData(data) {
                for(let i=0; i< data.length; i++){
                    data[i].hasPublic = data[i].hasPublic ? '公共网络' : '个人网络';
                    data[i].hasIpv6 = data[i].hasIpv6 ? '是' : '否';
                }
                return data;
            },
            // 获取网络列表信息
            getPublicNetworkInfo:function(){
                this.$axios.get('/network/list' + "?current="+this.pubcurrentPage+" &size="+this.pubpageSize+"&type=1")
                    .then(response=>{
                        if(response.data.code === 0){
                            this.publicNetWorkInfo = this.formatNetworkData(response.data.data.records);
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
                        if(response.data.code === 0){
                            this.privateNetWorkInfo = this.formatNetworkData(response.data.data.records);
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
            // 点击名称跳转
            handlepubView(row){
                this.$store.commit('SET_NETWORKID',row.id);
                this.$router.push('/networkDetails')
            },
            handlepriView(index,row){
                this.$store.commit('SET_NETWORKID',row.id);
                this.$router.push('/networkDetails')
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
        position: relative;
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
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

