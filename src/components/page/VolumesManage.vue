<template>
    <div class="vvolumesmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-printer"></i>数据卷管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="select_volumesType" placeholder="选择数据卷类型" class="handle-select mr10">
                    <el-option key="1" label="容器数据卷" value="1"></el-option>
                    <el-option key="2" label="服务数据卷" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search">查看</el-button>
                <el-button type="danger" style="float: right" @click="clean_container">清理容器</el-button>
                <el-button type="danger" style="float: right" @click="clean_service">清理服务</el-button>
            </div>

            <!--用户信息展示部分-->
            <el-table
                :data="volumesInfo"
                tooltip-effect="light"
                style="width: 100%"
                height="600">
                <el-table-column prop="Name" label="数据卷名称" width="500px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Scope" label="覆盖范围"></el-table-column>
                <el-table-column prop="Driver" label="驱动"></el-table-column>
                <el-table-column prop="Mountpoint" label="挂载点" width="500px"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none">
                            <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer"
                                @click="getXiangQingInfo(scope.$index, scope.row)">详情
                            </li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>

            <!--详情的模态框-->
            <div class="xiangQing">
                <el-dialog
                    title="数据卷详情"
                    :visible.sync="xiangQingVisible"
                    width="50%">
                    <el-form :label-position='labelpos' label-width="80px" :model="xiangQingInfo">
                        <el-form-item label="类型">
                            <p class="infoP">{{xiangQingInfo.typeName}}</p>
                        </el-form-item>
                        <el-form-item label="容器/服务">
                            <p class="infoP">{{xiangQingInfo.objName}}</p>
                        </el-form-item>
                        <el-form-item label="内部目录">
                            <p class="infoP">{{xiangQingInfo.destination}}</p>
                        </el-form-item>
                        <el-form-item label="挂载点">
                            <p class="infoP">{{xiangQingInfo.source}}</p>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "VolumesManage",
        data() {
            return {
                // 搜索输入的关键词
                select_volumesType: '',
                // 数据卷信息
                volumesInfo: [],
                // 详情信息
                xiangQingInfo: {},
                xiangQingVisible: false,
                name: 'request',
                labelpos: 'left'
            }
        },
        methods: {
            // 获取容器数据卷信息
            getContainerVolumesInfo: function () {
                this.$axios.get('/volumes/list/1')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.volumesInfo = response.data.data.Volumes;
                            for (let i = 0; i < this.volumesInfo.length; i++) {
                                if (this.volumesInfo[i].Scope === 'local') {
                                    this.volumesInfo[i].Scope = '本地'
                                }
                                if (this.volumesInfo[i].Status === null) {
                                    this.volumesInfo[i].Status = '无'
                                }
                            }
                        } else {
                            this.$message.error({
                                message: "获取数据卷信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取容器数据卷信息
            getServiceVolumesInfo: function () {
                this.$axios.get('/volumes/list/2')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.volumesInfo = response.data.data.Volumes;
                            for (let i = 0; i < this.volumesInfo.length; i++) {
                                if (this.volumesInfo[i].Scope === 'local') {
                                    this.volumesInfo[i].Scope = '本地'
                                }
                                if (this.volumesInfo[i].Status == null) {
                                    this.volumesInfo[i].Status = '无'
                                }
                            }
                        } else {
                            this.$message.error({
                                message: "获取数据卷信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 搜索数据卷
            search: function () {
                if (this.select_volumesType === "1") {
                    this.getContainerVolumesInfo();
                } else if (this.select_volumesType === "2") {
                    this.getServiceVolumesInfo();
                }
            },
            // 清理容器数据卷
            clean_container: function () {
                this.$axios.delete('/volumes/clean/1')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "清理容器数据卷成功！",
                                showClose: true
                            });
                            this.getContainerVolumesInfo();

                        } else {
                            this.$message.error({
                                message: "清理容器数据卷失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 清理服务数据卷
            clean_service: function () {
                this.$axios.delete('/volumes/clean/2')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "清理服务数据卷成功！",
                                showClose: true
                            });
                            this.getServiceVolumesInfo();
                        } else {
                            this.$message.error({
                                message: "清理服务数据卷失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取数据卷详情
            getXiangQingInfo: function (index, row) {
                this.$axios.get('/volumes/inspect/name/' + row.Name)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.xiangQingInfo = response.data.data;
                            this.xiangQingVisible = true;
                        } else {
                            this.$message.error(response.data.message);
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
        },
        created() {
            this.getContainerVolumesInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 200px;
    }

    .handle-input {
        width: 150px;
        display: inline-block;
    }

    .infoP {

        color: rgba(76, 0, 0, 0.55);
    }
</style>
