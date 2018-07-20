<template>
    <div class="servicemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-service"></i>服务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <!--服务信息展示部分-->
            <el-table
                :data="serviceInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="name" label="服务名称" >
                </el-table-column>
                <el-table-column prop="projectName" label="所属项目" >
                </el-table-column>
                <el-table-column prop="image" label="服务镜像" >
                </el-table-column>
                <el-table-column prop="replicas" label="横向扩展" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <router-link :to="{path:'/servicedetails', query:{id:scope.row.id}}">
                                <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">更多</li>
                            </router-link>
                            <li style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i></li>
                        </ul>
                    </template>
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
        name: "ServiceManage",
        data() {
            return {
                // 服务信息列表
                serviceInfo: [],

                // 分页信息
                currentPage: 1,
                totalCount: 0,
            }
        },
        methods: {
            // 获取服务信息
            getServiceInfo: function () {
                this.$axios.get('/service/list' + "?current=1" + "&size=5")
                    .then(response => {
                        // console.log(response)
                        if (response.data.code === 0) {
                            this.serviceInfo = response.data.data.records;
                            for (var i = 0; i < this.serviceInfo.length; i++) {
                                if (this.serviceInfo[i].statusName == null) {
                                    this.serviceInfo[i].statusName = '无'
                                }
                            }
                            this.totalCount = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "获取服务信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 删除服务信息
            handleDelete: function (index, row) {
                this.$axios.delete('/service/delete/' + row.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "删除服务信息成功！",
                                showClose: true
                            })
                        } else {
                            this.$message.error({
                                message: "删除服务信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 分页信息
            handleCurrentChange: function (val) {
                this.$axios.get('/service/list' + "?current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "获取服务信息成功！",
                                showClose: true
                            });
                            this.serviceInfo = response.data.data.records;
                            for (let i = 0; i < this.serviceInfo.length; i++) {
                                if (this.serviceInfo.statusName == null) {
                                    this.serviceInfo.statusName = '无'
                                }
                            }
                        } else {
                            this.$message.error({
                                message: "获取服务信息失败！",
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
            this.getServiceInfo();
        }
    }
</script>

<style scoped>

</style>
