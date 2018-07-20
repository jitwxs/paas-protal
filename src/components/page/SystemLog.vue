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
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>

            <!--系统日志信息展示区域-->

            <el-table
                :data="logInfo"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="日志描述">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="操作 URL">
                                <span>{{ props.row.action }}</span>
                            </el-form-item>
                            <el-form-item label="请求方式">
                                <span>{{ props.row.method }}</span>
                            </el-form-item>
                            <el-form-item label="请求 IP">
                                <span>{{ props.row.ip }}</span>
                            </el-form-item>
                            <el-form-item label="用户代理">
                                <span>{{ props.row.userAgent }}</span>
                            </el-form-item>
                            <el-form-item label="请求参数">
                                <span>{{ props.row.param }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="日志id">
                </el-table-column>
                <el-table-column prop="typeName" label="日志类型">
                </el-table-column>
                <el-table-column prop="hasException" label="有无异常">
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total,prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SystemLog",
        data() {
            return {
                // 搜索输入的变量
                hasException: '',
                select_id: '',
                // 系统日志信息
                logInfo: [],
                // 分页
                currentPage: 1,
                totalCount: 0,
                pageSize:10
            }
        },
        methods: {
            //分页大小改变
            handleSizeChange(val){
                this.pageSize = val;
                this.currentPage = 1;
                this.getSysInfo();

            },
            //获取sysinfo信息
            getSysInfo(){
                this.$axios.get('/monitor/log' + "?current=" + this.currentPage + "&size=" +this.pageSize)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.totalCount = response.data.data.total;
                            this.logInfo = this.formatSysLogData(response.data.data.records);
                        } else {
                            this.$message.error({
                                message: "获取系统日志信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },
            formatSysLogData(data){
                for (let i = 0; i < data.length; i++) {
                    if (data[i].hasException) {
                        data[i].hasException = '有异常';
                    } else {
                        data[i].hasException = '无异常';
                    }
                }
                return data;
            },
            // 获取日志信息
            getLogInfo: function () {
                this.$axios.get('/monitor/log' + "?current=1" + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.logInfo = this.formatSysLogData(response.data.data.records);
                            this.totalCount = response.data.total;
                        } else {
                            this.$message.error({
                                message: "获取系统日志信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索系统日志
            search: function () {
                this.$axios.get('/monitor/log' + "?hasException=" + this.hasException  + "&current=" + this.currentPage + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.logInfo = this.formatSysLogData(response.data.data.records);
                        } else {
                            this.$message.error({
                                message: "获取系统日志信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.getSysInfo();
            }
        },
        created() {
            this.getSysInfo();
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

    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
