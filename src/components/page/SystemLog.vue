<template>
    <div class="systemlog">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>系统日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="hasException" placeholder="是否异常" class="handle-select mr10">
                    <el-option key="1" label="有异常" value="true"></el-option>
                    <el-option key="2" label="无异常" value="false"></el-option>
                </el-select>
                <!--<el-input v-model="select_id" placeholder="输入日志id" class="handle-input mr10"></el-input>-->
                <el-input v-model="select_type" placeholder="输入日志类型" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

            <!--系统日志信息展示区域-->
            <el-table
                :data="logInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="id" label="日志id" >
                </el-table-column>
                <el-table-column prop="type" label="日志类型" >
                </el-table-column>
                <el-table-column prop="hasException" label="有无异常" >
                </el-table-column>
                <el-table-column prop="description" label="日志描述" >
                </el-table-column>

            </el-table>

            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SystemLog",
        data(){
            return{
                // 搜索输入的变量
                hasException:'',
                select_id:'',
                select_type:'',
                // 系统日志信息
                logInfo:[],
                // 分页
                currentPage:1,
                totalCount:0,
            }
        },
        methods:{
            // 获取日志信息
            getLogInfo:function(){
              this.$axios.get('/monitor/log' + "?current=1" + "&size=5")
                  .then(response=>{
                      // console.log(response)
                      if(response.data.code == 0){
                          this.logInfo = response.data.data.records;
                          for(var i=0; i< this.logInfo.length; i++){
                              if(this.logInfo[i].hasException ){
                                  this.logInfo[i].hasException = '有异常';
                              }else {
                                  this.logInfo[i].hasException = '无异常';
                              }
                          }
                          this.totalCount = response.data.total;
                      }else {
                          this.$message.error({
                              message:"获取系统日志信息失败！",
                              showClose:true
                          })
                      }
                  })
                  .catch(function (err) {
                      console.log(err)
                  })
            },
            // 搜索系统日志
            search:function () {
                this.$axios.get('/monitor/log' + "?hasException=" + this.hasException + "&type=" + this.select_type + "&current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.logInfo = response.data.data.records;
                            for(var i=0; i< this.logInfo.length; i++){
                                if(this.logInfo[i].hasException ){
                                    this.logInfo[i].hasException = '有异常';
                                }else {
                                    this.logInfo[i].hasException = '无异常';
                                }
                            }
                        }else{
                            this.$message.error({
                                message:"获取系统日志信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页
            handleCurrentChange:function (val) {
                this.$axios.get('/monitor/log' + "?current=" + val + "&size=5")
                    .then(response=>{
                        // console.log(val)
                        if(response.data.code == 0){
                            this.logInfo = response.data.data.records;
                            for(var i=0; i< this.logInfo.length; i++){
                                if(this.logInfo[i].hasException ){
                                    this.logInfo[i].hasException = '有异常';
                                }else {
                                    this.logInfo[i].hasException = '无异常';
                                }
                            }
                        }else {
                            this.$message.error({
                                message:"获取系统日志信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getLogInfo();
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
        width: 150px;
        display: inline-block;
    }

</style>
