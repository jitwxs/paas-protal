<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 镜像详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`详情信息`" name="first">
                    <el-table :data="detail" :show-header="false" style="width: 100%">
                        <el-col :span="24" v-for="(item,index) in detail" :key="index">
                            <el-card shadow="hover">
                                <ul>
                                    <li v-for="(v,k) in item">
                                        {{k}} : {{v}}
                                    </li>
                                </ul>
                            </el-card>
                        </el-col>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane :label="`历史信息`" name="second" >
                    <template v-if="message === 'second'">
                        <el-table :data="history" :show-header="false" style="width: 100%">
                            <el-col :span="24" v-for="(item,index) in history" :key="index">
                                <el-card shadow="hover">
                                    <ul>
                                        <li v-for="(v,k) in item">
                                            {{k}} : {{v}}
                                        </li>
                                    </ul>
                                </el-card>
                            </el-col>
                        </el-table>

                    </template>
                </el-tab-pane>

                <el-tab-pane :label="`接口信息`" name="third" >
                    <template v-if="message === 'third'">
                        <el-table :data="portInfo" :show-header="false" style="width: 100%">
                            <el-col :span="24" v-for="(item,index) in portInfo" :key="index">
                                <el-card shadow="hover">
                                    <ul>
                                        <li v-for="(v,k) in item">
                                            {{k}} : {{v}}
                                        </li>
                                    </ul>
                                </el-card>
                            </el-col>
                        </el-table>
                    </template>
                </el-tab-pane>

                <el-tab-pane :label="`其他信息`" name="fourth">
                    <template v-if="message === 'fourth'">
                        <el-table :data="other" :show-header="false" style="width: 100%">
                            <el-col :span="24" v-for="(item,index) in other" :key="index">
                                <el-card shadow="hover">
                                    <ul>
                                        <li v-for="(v,k) in item">
                                            {{k}} : {{v}}
                                        </li>
                                    </ul>
                                </el-card>
                            </el-col>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImageDetails",
        data(){
            return{
                message: 'first',
                // 镜像id
                imageId:'',
                // 详情信息
                detail:[],
                // 历史信息
                history:[],
                // 接口信息
                portInfo:[],
                // 其他信息
                other:[],
            }
        },
        methods:{
            // 获取镜像详情信息
            getDetails:function () {
                this.$axios.get('/image/inspect/' + this.imageId)
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0) {
                            // 将对象转化成数组
                            this.detail.push(response.data.data);
                            console.log(this.detail);
                        }else {
                            this.$message.error({
                                message: "获取本地镜像详情信息失败！",
                                showClose: true
                            })
                        }
                    })
            },
            // 获取镜像历史
            getHistory:function () {
              this.$axios.get('/image/history/' + this.imageId)
                  .then(response=>{
                      console.log(response)
                      if(response.data.code == 0){
                          this.history = response.data.data;
                      }else {
                          this.$message.error({
                              message: "获取本地镜像历史信息失败！",
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
                      console.log(response)
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
            // 获取镜像其他详细信息
            getOther:function () {
                this.$axios.get('/image/list/local' + "?type=1" + "&name=nginx" +"&current=" +this.currentPage_Public + "&size=5")
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.other = response.data.data.records;
                        }else {
                            this.$message.error({
                                message: "获取本地公用信息失败！",
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
            this.imageId = this.$route.query.id;
            this.getDetails();
            this.getHistory();
            this.getOther();
        }
    }
</script>

<style scoped>

</style>
