<template>
    <div class="noticepage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>我的通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane label="系统通知" name="first">
                    <el-table :data="systemNotice" :show-header="false" @row-dblclick="showNotice" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="senderName">
                        </el-table-column>
                        <el-table-column prop="createDate">
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index, scope.row)" v-if="hasRead">标为已读
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead(1)">全部标为已读</el-button>
                    </div>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_system"
                            :current-page.sync="currentPage_system"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_system">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="容器通知" name="second">
                    <el-table :data="containerNotice" :show-header="false" @row-dblclick="showNotice"
                              style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" width="150"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button @click="handleRead(scope.$index, scope.row)" v-if="hasRead">标为已读
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead(2)">全部标为已读</el-button>
                    </div>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_container"
                            :current-page.sync="currentPage_container"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_container">
                        </el-pagination>
                    </div>
                </el-tab-pane>


                <el-tab-pane label="服务通知" name="third">
                    <el-table :data="serviceNotice" :show-header="false" @row-dblclick="showNotice" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" width="150"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button @click="handleRead(scope.$index, scope.row)" v-if="hasRead">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead(3)">全部标为已读</el-button>
                    </div>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_service"
                            :current-page.sync="currentPage_service"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_service">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="其他通知" name="fourth">
                    <el-table :data="otherNotice" :show-header="false" @row-dblclick="showNotice" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="senderName" width="150"></el-table-column>
                        <el-table-column prop="createDate" width="150"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button @click="handleRead(scope.$index, scope.row)" v-if="hasRead">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead(4)">全部标为已读</el-button>
                    </div>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_other"
                            :current-page.sync="currentPage_other"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_other">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NoticePage",
        data() {
            return {
                // tab页的属性
                message: 'first',
                // 系统通知
                systemNotice: [],
                currentPage_system: 1,
                totalCount_system: 0,
                // 容器通知
                containerNotice: [],
                currentPage_container: 1,
                totalCount_container: 0,

                // 服务通知
                serviceNotice: [],
                currentPage_service: 1,
                totalCount_service: 0,
                // 其他通知
                otherNotice: [],
                currentPage_other: 1,
                totalCount_other: 0,
            }
        },
        methods: {
            updateTableByType(type) {
                switch (type) {
                    case 1:
                        this.getSystemNotice();
                        break;
                    case 2:
                        this.getContainerNotice();
                        break;
                    case 3:
                        this.getServiceNotice();
                        break;
                    case 4:
                        this.getOtherNotice();
                        break;
                    default:
                        break;
                }
            },
            // 获取系统通知信息
            getSystemNotice: function () {
                this.$axios.get('/notice/list' + "?type=1" + "&current=1" + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.systemNotice = response.data.data.records;
                            this.totalCount_system = response.data.data.total;
                        } else {
                            this.$message.error("获取系统通知失败！");
                        }
                    })
            },
            // 系统通知分页
            handleCurrentChange_system: function (val) {
                this.$axios.get('/notice/list' + "?type=1" + "&current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.systemNotice = response.data.data.records;
                        } else {
                            this.$message.error("获取系统通知失败！");
                        }
                    })
            },
            // 获取容器通知信息
            getContainerNotice: function () {
                this.$axios.get('/notice/list' + "?type=2" + "&current=1" + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.containerNotice = response.data.data.records;
                            this.totalCount_container = response.data.data.total;
                        } else {
                            this.$message.error("获取容器通知失败！");
                        }
                    })
            },
            // 容器通知的分页
            handleCurrentChange_container: function (val) {
                this.$axios.get('/notice/list' + "?type=2" + "&current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.containerNotice = response.data.data.records;
                        } else {
                            this.$message.error("获取容器通知失败！");
                        }
                    })
            },
            // 获取服务通知信息
            getServiceNotice: function () {
                this.$axios.get('/notice/list' + "?type=3" + "&current=1" + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.serviceNotice = response.data.data.records;
                            this.totalCount_service = response.data.data.total;
                        } else {
                            this.$message.error("获取服务通知失败！");
                        }
                    })
            },
            // 服务通知分页
            handleCurrentChange_service: function (val) {
                this.$axios.get('/notice/list' + "?type=3" + "&current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.serviceNotice = response.data.data.records;
                        } else {
                            this.$message.error("获取服务通知失败！");
                        }
                    })
            },
            // 获取其他通知信息
            getOtherNotice: function () {
                this.$axios.get('/notice/list' + "?type=4" + "&current=1" + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.otherNotice = response.data.data.records;
                            this.totalCount_other = response.data.data.total;
                        } else {
                            this.$message.error("获取其他通知失败！");
                        }
                    })
            },
            // 其他信息分页
            handleCurrentChange_other: function (val) {
                this.$axios.get('/notice/list' + "?type=4" + "&current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("获取其他通知成功！");
                            this.otherNotice = response.data.data.records;
                        } else {
                            this.$message.error("获取其他通知失败！");
                        }
                    })
            },
            // 标为已读
            handleRead: function (index, row) {
                this.$axios.post('/notice/read', {
                    ids: row.id
                })
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("标记已读通知成功！");
                            this.updateTableByType(row.type);
                        } else {
                            this.$message.error("标记已读通知失败！")
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 全部标为已读
            handleAllRead(type) {
                let url = "/notice/read";
                if (type !== null) {
                    url += "?type=" + type;
                }
                this.$axios.post(url)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("已读通知成功！")
                        } else {
                            this.$message.error("已读通知失败！")
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            showNotice(row, event) {
                this.$alert(row.content, '通知', {
                    dangerouslyUseHTMLString: true
                });
            }
        },
        created() {
            this.getSystemNotice();
            this.getContainerNotice();
            this.getServiceNotice();
            this.getOtherNotice()
        }
    }
</script>

<style scoped>
    .message-title {
        cursor: pointer;
    }

    .handle-row {
        margin-top: 30px;
    }
</style>
