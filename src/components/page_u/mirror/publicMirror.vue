<template>
    <div id="mirror">
        <!--公共镜像列表-->
        <el-tabs v-model="activeName">
            <el-tab-pane label="公共镜像" name="first">
                <el-table
                    :data="mirrors"
                    style="width: 100%;margin-top: 20px;">
                    <el-table-column
                        label="名称">
                        <template slot-scope="scope">
                            <span style="cursor:pointer;" @click="handleView(scope.row)">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="标签">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="镜像大小"
                        prop="size">h
                    </el-table-column>

                    <el-table-column label="操作" width="350">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                style="margin-left: 10px"
                                @click="handleView(scope.row)">详情
                            </el-button>
                            <el-button
                                size="mini"
                                type="success"
                                style="margin-left: 10px"
                                @click="handleExport(scope.$index, scope.row)">导出
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="block"
                     style="text-align: center;float: right;margin-right: 40px;margin-top: 30px;margin-bottom: 15px">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        @size-change="handleSizeChange"
                        :page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        layout="total,sizes,prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>

            </el-tab-pane>
            <el-tab-pane label="用户上传镜像" name="second">
                <el-table
                    :data="usermirrors"
                    style="width: 100%;margin-top: 20px;">
                    <el-table-column
                        label="名称">
                        <template slot-scope="scope">
                            <span style="cursor:pointer;" @click="handleView(scope.row)">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="标签">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="镜像大小"
                        prop="size">h
                    </el-table-column>

                    <el-table-column label="操作" width="350">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="primary"
                                style="margin-left: 10px"
                                @click="handleView(scope.row)">详情
                            </el-button>
                            <el-button
                                size="mini"
                                type="success"
                                style="margin-left: 10px"
                                @click="handleExport(scope.$index, scope.row)">导出
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="PasSHub" name="third">

                <el-table :data="imageList" height="300" style="width: 100%"
                          @row-dblclick="getpasshubImageId($event)">
                    <el-table-column prop="name" label="镜像名称" width="220"></el-table-column>
                    <el-table-column label="镜像标签" width="150">
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="authName" label="上传者" width="150"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repo" label="镜像仓库" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="digest" label="Digest" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       @click="pullloadHubImage(scope.row.id,scope.row.name)" type="primary">拉取
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "publicMirror",
        data() {
            return {
                activeName: 'first',
                usermirrors: [],
                mirrors: [],
                currentPage: 1,
                pageSize: 10,
                totalCount: 0,
                imageList:[],
                passhubId:'',
                service:{
                    imageName:''
                }
            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                hostaddr: 'gethostaddr'
            })
        },
        methods: {
            //获取passhub镜像的id
            getpasshubImageId(column) {
                this.service.imageId = '';
                this.passhubId = column.id;
                this.service.imageName = column.name;
            },
            //拉取hub镜像
            pullloadHubImage(id, index) {
                this.$axios.post("/hub/pull", {
                    id: id
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$message.success(res.data.data)
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            getLocalImage() {
                this.$axios.get('/image/list/local?type=1&current=' + this.currentPage + '&size=' + this.pageSize)
                    .then(response => {
                        this.mirrors = response.data.data.records;
                        for (let i = 0; i < this.mirrors.length; i++) {
                            this.mirrors[i].size = bitConvert(this.mirrors[i].size)
                        }
                        this.totalCount = response.data.data.total;
                    }).catch(function (err) {
                    console.log(err);
                })
            },

            //从passHub获取name
            getFromPassHub() {
                this.loading = true;
                this.imageList = [];
                this.$axios.get("/hub/list")
                    .then((res) => {
                        this.nameList = res.data.data;
                        this.getTagFromPass();
                    })
                    .catch((err) => {
                        console.log(err)
                    });

                this.loading = false;
            },
            //从passHub获取tag
            getTagFromPass() {
                for (let i = 0; i < this.nameList.length; i++) {
                    let item = this.nameList[i];
                    this.$axios.get("/hub/list/name?name=" + item.name)
                        .then((res) => {
                            let tags = res.data.data;
                            for (let j = 0; j < tags.length; j++) {

                                this.imageList.push({
                                    id: tags[j].id,
                                    name: item.showName,
                                    tag: tags[j].tag,
                                    repo: item.repo,
                                    authName: item.username,
                                    digest: tags[j].digest,
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            // 初始化websocket
            initWebSocket: function () { //初始化weosocket
                this.websock = new WebSocket("ws://" + this.hostaddr + "/ws/" + this.userInfo.userId);

                this.websock.onopen = this.websocketonopen;

                // this.websock.onerror = this.websocketonerror;

                this.websock.onmessage = this.websocketonmessage;

                this.websock.onclose = this.websocketclose;
            },

            websocketonopen: function () {
                console.log("WebSocket连接成功");
            },

            websocketonerror: function (e) { //错误
                console.log("WebSocket连接发生错误");
            },

            websocketonmessage: function (e) { //数据接收
                let data = eval('(' + e.data + ')');
                if (data.info == null) {
                    if (data.code === 0) {
                        this.$notify({
                            type: 'success',
                            message: data.message,
                            duration: 3000
                        });

                    } else {
                        this.$notify({
                            type: 'error',
                            message: data.message,
                            duration: 3000
                        });
                    }
                }
                else {
                    console.log(data.info)
                }
            },

            websocketsend: function (agentData) {//数据发送
                this.websock.send(agentData);
            },

            websocketclose: function (e) { //关闭
                console.log("connection closed (" + e.code + ")");
            },
            getusermirror() {
                this.$axios.get('/image/list/local?type=2&current=' + this.currentPage + '&size=' + this.pageSize)
                    .then(response => {
                        this.usermirrors = response.data.data.records;
                        for (let i = 0; i < this.usermirrors.length; i++) {
                            this.usermirrors[i].size = bitConvert(this.usermirrors[i].size)
                        }
                        this.totalCount = response.data.data.total;
                    }).catch(function (err) {
                    console.log(err);
                })
            },

            // 分页函数
            handleCurrentChange: function (val) {
                if (val == null) {
                    return;
                }
                this.currentPage = val;
                this.getLocalImage();
            },
            //分页大小
            handleSizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.getLocalImage();
            },

            //    查看详情
            handleView: function (row) {
                //      id放入vuex
                this.$store.commit('SET_CURRENTMIRROR_ID', row.id);
                this.$router.push({path: '/mirrorDetail/detail'})
            },

            //    导出镜像
            handleExport: function (index, row) {
                this.$axios.get("/image/export/" + row.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            window.open(response.data.data);
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },
        },
        created() {
            this.getLocalImage();
            this.getusermirror();
            this.getFromPassHub();
            this.initWebSocket();
        }
    }
</script>

<style scoped>
    #mirror {
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }
</style>
