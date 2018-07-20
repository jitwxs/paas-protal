<template>
    <div class="servicedetails">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>服务详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName">
                <el-tab-pane label="服务信息" name="first">
                    <pre id="showjson"></pre>
                </el-tab-pane>
                <el-tab-pane label="服务日志" name="second">

                </el-tab-pane>
                <el-tab-pane label="数据卷信息" name="third">
                    <el-table
                        :data="volumesInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column prop="createDate" label="创建日期">
                        </el-table-column>
                        <el-table-column prop="name" label="数据卷名称">
                        </el-table-column>
                        <el-table-column prop="destination" label="数据卷命令">
                        </el-table-column>
                        <el-table-column prop="source" label="数据卷资源">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ServiceDetails",
        data() {
            return {
                // 该条服务信息的id
                serviceId: '',
                activeName: 'first',
                // 服务详情信息
                serviceInfo: {},
                // 服务日志信息
                logInfo: [],
                // 服务数据卷信息
                volumesInfo: [],
            }
        },
        methods: {
            // 获取服务详情信息
            getServiceInfo: function () {
                this.$axios.get('/service/inspect/' + this.serviceId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.serviceInfo = response.data.data;
                            $("#showjson").html(JSON.stringify(response.data.data, null, 4));
                        } else {
                            this.$message.error({
                                message: "获取服务详情信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取服务日志信息
            getLogInfo: function () {
                this.$axios.get('/service/log/' + this.serviceId)
                    .then(response => {
                        if (response.data.code === 0) {
                        } else {
                            this.$message.error({
                                message: "获取服务日志失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取服务数据卷信息
            getVolumesInfo: function () {
                this.$axios.get('/volumes/list/obj' + "?objId=" + this.serviceId)
                    .then(response => {
                        if (response.data.code == 0) {
                            this.volumesInfo = response.data.data.records;
                        } else {
                            this.$message.error({
                                message: "获取服务数据卷信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created() {
            this.serviceId = this.$route.query.id;
            this.getServiceInfo();
            this.getLogInfo();
            this.getVolumesInfo();
        }
    }
</script>

<style scoped>

</style>
