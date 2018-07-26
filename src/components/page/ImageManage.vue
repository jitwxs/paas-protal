<template>
    <div class="imagemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i>镜像管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-tabs v-model="activeName1">
                <el-tab-pane label="本地公共镜像" name="first">
                    <!--搜索本地公共镜像-->
                    <div class="handle-box">
                        <el-input v-model="select_publicImage" placeholder="输入镜像名称"
                                  class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchPublicImage">搜索</el-button>
                        <el-button type="warning" icon="el-icon-delete" style="float: right" @click="cleanImage()">清理</el-button>
                        <el-button type="primary" icon="el-icon-refresh" style="float: right" @click="syncImage(1)">同步</el-button>
                    </div>
                    <el-table
                        :data="publicLocalImage"
                        style="width: 100%">
                        <el-table-column
                            label="镜像名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="镜像标签">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="容量大小"
                            prop="size">
                        </el-table-column>
                        <el-table-column
                            label="镜像仓库"
                            prop="repo">
                        </el-table-column>
                        <el-table-column
                            label="入库时间"
                            prop="createDate">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none">
                                    <li style="float: left;margin-right: 10px;color: #409EFF;cursor: pointer"
                                        @click="handleExport(scope.$index, scope.row)">导出
                                    </li>
                                    <router-link style=" text-decoration: none;"
                                                 :to="{path:'/publiclocalimage', query:{id:scope.row.id}}">
                                        <li style="float: left;margin-right: 10px;color: #409EFF;cursor: pointer">详情
                                        </li>
                                    </router-link>
                                    <li style="float: left;margin-left: 10px;cursor: pointer">
                                        <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
                                    </li>

                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_Public"
                            :current-page.sync="currentPage_Public"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_Public">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="本地用户镜像" name="second">
                    <!--搜索本地用户镜像-->
                    <div class="handle-box">
                        <el-input v-model="select_userImage" placeholder="输入镜像名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchUserImage">搜索</el-button>
                        <el-button type="primary" @click="handleImport">导入</el-button>
                        <el-button type="warning" icon="el-icon-delete" style="float: right" @click="cleanImage()">清理</el-button>
                        <el-button type="primary" icon="el-icon-refresh" style="float: right" @click="syncImage(2)">同步
                        </el-button>
                    </div>
                    <el-table
                        :data="userLocalImage"
                        style="width: 100%">
                        <el-table-column
                            label="镜像名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="镜像标签">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="镜像大小"
                            prop="size">
                        </el-table-column>
                        <el-table-column
                            label="所属用户"
                            prop="username">
                        </el-table-column>
                        <el-table-column
                            label="是否公开"
                            prop="hasOpen">
                        </el-table-column>
                        <el-table-column
                            label="上传时间"
                            prop="createDate">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none">
                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer"
                                        @click="handleExport(scope.$index, scope.row)">导出
                                    </li>
                                    <router-link style=" text-decoration: none;"
                                                 :to="{path:'/userlocalimage', query:{id:scope.row.id}}">
                                        <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">详情</li>
                                    </router-link>
                                    <li style="float: left;margin-left: 5px;cursor: pointer">
                                        <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
                                    </li>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_User"
                            :current-page.sync="currentPage_User"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_User">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <!--hub镜像管理-->
                <el-tab-pane label="Hub镜像" name="third">
                    <el-button type="primary" icon="el-icon-refresh" style="margin-bottom: 20px" @click="syncPassHubImgage">同步
                    </el-button>

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
                                <el-button size="mini"
                                           @click="deleteHubImage(scope.row.id,scope.row.name)" type="danger">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>

                <!--导入镜像的模态框-->
                <el-dialog title="上传镜像" :visible.sync="dialogVisible" width="30%">
                    <!--<el-form>-->
                        <!--<el-form-item label="选择文件">-->
                            <!--<input id="imageInput" @change="importImages($event)" type="file">-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="镜像名称">-->
                            <!--<el-input v-model="imageNameUpload"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="标签">-->
                            <!--<el-input v-model="tagToUpload"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
                    <!--<span slot="footer" class="dialog-footer">-->
                  <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
                  <!--<el-button type="primary" @click="submitUploadImages">确 定</el-button>-->
                <!--</span>-->
                    <el-form :model="mirrorForm">
                        <el-form-item label="名字（必填，不能包含大写字符）" :label-width="formLabelWidth">
                            <el-input v-model="mirrorForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="标签（选填，默认为latest）" :label-width="formLabelWidth">
                            <el-input v-model="mirrorForm.tag"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-upload
                        class="upload-demo"
                        drag
                        ref="upload"
                        action="/api/image/import"
                        :headers="usertoken"
                        :data="formdata"
                        accept=".gz"
                        :before-upload="beforeupload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                        <div slot="tip" class="el-upload__tip">只能上传tar.gz文件</div>
                    </el-upload>
                    <el-button style="margin-left: 10px;margin-top: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                </el-dialog>

                <!--删除镜像的确认弹框-->
                <div class="deleteImage">
                    <el-dialog
                        :visible.sync="deleteDialogVisible"
                        width="30%">
                        <span><i class="el-icon-warning" style="margin-right: 10px"></i>确定要删除这个镜像吗？</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="confirmDelete">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "ImageManage",
        data() {
            return {
                usertoken:{'Authorization':sessionStorage.userToken},
                fileList:[],
                formdata:{},

                // tab页的相关属性
                activeName1: 'first',
                // 搜索镜像名称
                select_publicImage: '',
                select_userImage: '',
                select_hubImage: '',

                // 公共镜像信息
                publicLocalImage: [{name: 'hhv'}],
                mirrorForm:[],
                // 公共分页当前页码
                currentPage_Public: 1,
                // 公共分页总条数
                totalCount_Public: 0,

                // 用户镜像信息
                userLocalImage: [],
                // 用户分页当前页码
                currentPage_User: 1,
                // 用户分页总条数
                totalCount_User: 0,

                // hub镜像信息
                hubImage: [],
                // hub分页当前页码
                currentPage_Hub: 1,
                // hub分页总条数
                totalCount_Hub: 0,

                // 删除镜像的属性
                deleteDialogVisible: false,
                // 当前行镜像的id
                imageId: '',

                // 导入镜像模态框的相关属性
                importImageVisible: false,
                importImageInfo: {
                    file: '',
                    name: '',
                    tag: '',
                },
                formLabelWidth: '120px',

                // 上传文件相关属性
                fileList: [],
                imageList: [],
                nameList: [],
                volumeFile: '',
                fileName: '',
                imageNameUpload: '',
                tagToUpload: '',
                dialogVisible: false
            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                hostaddr: 'gethostaddr'
            })
        },
        methods: {
            beforeupload(file){
                if (this.mirrorForm.name==""){
                    this.$message.error("请填写镜像名称");
                    return;
                }
                this.formdata.imageName = this.imageNameUpload;
                this.formdata.tag = this.tagToUpload;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            // 清理镜像
            cleanImage() {
                this.$axios.get("/image/clean")
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$message.success("清理成功，成功：" + res.data.data.success + "个，失败：" + res.data.data.error + "个");
                            this.getPublicLocalImage();
                            this.getUserLocalImage();
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            //同步passHub
            syncPassHubImgage() {
                this.$axios.get("/hub/sync")
                    .then((res) => {
                        if (res.data.code === 0) {
                            let message = "新增记录数" + res.data.data.add + "," + "错误记录数" + res.data.data.error + "," + "删除记录数" + res.data.data.delete + ".";
                            this.$notify({
                                message: message,
                                type: 'success'
                            });
                            this.getFromPassHub();
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
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
            //删除hub镜像
            deleteHubImage(id, index) {
                this.$axios.delete("/hub/delete/" + id)
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$message.success("删除成功");
                            this.getFromPassHub();
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            //获取passhub镜像的id
            getpasshubImageId(column) {
                this.service.imageId = '';
                this.passhubId = column.id;
                this.service.imageName = column.name;
            },
            // 格式化镜像数据
            formatImageData: function (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i].size = bitConvert(data[i].size);
                    if (data[i].hasOpen) {
                        data[i].hasOpen = "已公开";
                    } else {
                        data[i].hasOpen = "未公开";
                    }
                    switch (data[i].type) {
                        case 1:
                            data[i].type = "公共镜像";
                            break;
                        case 2:
                            data[i].type = "用户镜像";
                            break;
                        default:
                            break;
                    }
                }
                return data;
            },
            // 获取本地公共镜像
            getPublicLocalImage: function () {
                this.$axios.get('/image/list/local' + "?type=1" + "&current=1" + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.publicLocalImage = this.formatImageData(response.data.data.records);
                            this.totalCount_Public = response.data.total;
                        } else {
                            this.$message.error({
                                message: "获取本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 本地公用镜像的分页操作
            handleCurrentChange_Public: function (val) {
                this.$axios.get('/image/list/local' + "?type=1" + "&current=" + val + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.publicLocalImage = this.formatImageData(response.data.data.records);
                        } else {
                            this.$message.error({
                                message: "获取本地公共镜像失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索本地公共镜像
            searchPublicImage: function () {
                this.$axios.get('/image/list/local' + "?type=1" + "&name=" + this.select_publicImage + "&current=" + this.currentPage_Public + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "搜索本地公用信息成功！",
                                showClose: true
                            });
                            this.publicLocalImage = this.formatImageData(response.data.data.records);
                            this.totalCount_Public = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "搜索本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 获取本地用户镜像
            getUserLocalImage: function () {
                this.$axios.get('/image/list/local' + "?type=2" + "&current=" + this.currentPage_User + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.userLocalImage = this.formatImageData(response.data.data.records);
                            this.totalCount_User = response.data.total;
                        } else {
                            this.$message.error({
                                message: "获取本地用户镜像信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 本地用户镜像信息分页操作
            handleCurrentChange_User: function (val) {
                this.$axios.get('/image/list/local' + "?type=2" + "&current=" + val + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.userLocalImage = this.formatImageData(response.data.data.records);
                        } else {
                            this.$message.error({
                                message: "获取本地用户信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索本地用户镜像
            searchUserImage: function () {
                this.$axios.get('/image/list/local' + "?type=2" + "&name=" + this.select_userImage + "&current=" + this.currentPage_User + "&size=10")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.userLocalImage = this.formatImageData(response.data.data.records);
                            this.totalCount_User = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "搜索本地用户信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击导入显示模态框
            handleImport: function () {
                this.dialogVisible = true;
            },
            // 导入镜像
            importImage: function () {
                let CancelToken = this.$axios.CancelToken;
                CancelToken.source();

                this.importImageVisible = false;
                this.$axios.post('/image/import',
                    {
                        "file": this.importImageInfo.file,
                        "name": this.importImageInfo.name,
                        "tag": this.importImageInfo.tag,
                    }, {
                        header: {
                            'Content-Type': 'multipart/form-data',
                        }
                    })
                    .then(response => {
                        if (response.data.code === 0) {
                            this.getUserLocalImage();
                        } else {
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
            // 本地镜像和远程镜像同步操作
            syncImage: function (type) {
                this.$axios.get('/image/sync')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("镜像同步成功！");
                            switch(type) {
                                case 1: this.getPublicLocalImage(); break;
                                case 2: this.getUserLocalImage(); break;
                                default: break;
                            }
                        } else {
                            this.$message.error(response.data.message)
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },

            // 点击导出标签
            handleExport: function (index, row) {
                this.$axios.get('/image/export/' + row.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            window.open(response.data.data);
                        } else {
                            this.$message.error({
                                message: "导出镜像信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 删除镜像操作
            handleDelete: function (index, row) {
                this.deleteDialogVisible = true;
                this.imageId = row.id;
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
            confirmDelete: function () {
                this.deleteDialogVisible = false;
                this.$axios.delete('/image/delete/' + this.imageId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("镜像删除成功！");
                            this.getPublicLocalImage();
                            this.getUserLocalImage();
                        } else {
                            this.$message.error(response.data.message)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
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

        },
        created() {
            this.getPublicLocalImage();
            this.getUserLocalImage();
            this.getFromPassHub();
            this.initWebSocket();
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
        width: 300px;
        display: inline-block;
    }

    /*纵向时间轴*/
    .time-vertical {
        list-style-type: none;
        border-left: 1px solid #707070;
        padding: 0px;
        height: 70px;
    }

    .time-vertical li {
        height: 100px;
        position: relative;
    }

    .time-vertical li a {
        display: inline-block;
        margin-left: 20px;
        margin-top: 15px;
        text-decoration: none;
        color: #000;
    }

    .time-vertical li b:before {
        content: '';
        position: absolute;
        top: 15px;
        left: -12px;
        width: 18px;
        height: 18px;
        border: 2px solid #409EFF;
        border-radius: 10px;
        background: #409EFF;
    }

    .time-vertical li span {
        position: absolute;
        color: #fff;
        top: 15px;
        left: -6px;
    }
</style>
