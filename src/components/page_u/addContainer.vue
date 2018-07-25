<template>
    <div id="main">
        <el-button type="info" icon="el-icon-back" style="margin-left: 50px;margin-top: 20px;" @click="cancel">返回
        </el-button>
        <h4 style="text-align: center;margin-bottom: 30px;font-size: 22px;">
            创&nbsp;&nbsp;建&nbsp;&nbsp;容&nbsp;&nbsp;器</h4>
        <el-form :label-position="labelPosition" label-width="100px" :model="container" class="containerForm">
            <el-form-item label="名称">
                <el-input v-model="container.containerName"></el-input>
            </el-form-item>
            <el-form-item label="镜像">
                <el-col :span="11">
                    <el-input v-model="container.imageName" :disabled="true" placeholder="请选择镜像来源"></el-input>
                </el-col>
                <el-col :span="3"><span style="margin-right: 20px;float: right">Registry</span></el-col>
                <el-col :span="10">
                    <el-select placeholder="请选择image来源" style="width: 100%" @change="changeValue" v-model="label">
                        <el-option v-for="item in Registry" :key="item.id" :label="item.label"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="镜像名称" v-show="showSearchName">
                <el-col :span="11">
                    <el-input v-model="searchName"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-button @click="searchFromDocker"> 搜索</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="镜像列表" v-if="label">
                <el-col>
                    <div id="imageDiv" v-if="showTable">

                        <!--本地-->
                        <el-table
                            :data="imageList"
                            height="300"
                            style="width: 100%"
                            v-if="showLocal"
                            @row-dblclick="getImageId($event)"
                            v-loading="loading">
                            <el-table-column
                                prop="name"
                                label="名称"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="tag"
                                label="tag"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                label="大小">
                            </el-table-column>
                        </el-table>

                        <!--展示从dockerhun上拉取的信息-->
                        <el-table
                            :data="imageList"
                            height="300"
                            style="width: 100%"
                            v-if="label == '/image/list/hub?name='"
                            @row-dblclick="getDockerImageId($event)"
                            v-loading="loading">
                            <el-table-column
                                prop="name"
                                label="名称"
                                width="240"
                                show-overflow-tooltip
                            >
                            </el-table-column>
                            <el-table-column
                                prop="description"
                                label="描述"
                                show-overflow-tooltip
                                width="520"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="is_official"
                                label="官方镜像"
                                width="150"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="star_count"
                                label="star"
                                width="150">
                            </el-table-column>

                            <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        @click="downloadImage('docker', scope.row.name,scope.row.name)" type="success">
                                        下载
                                    </el-button>
                                </template>
                            </el-table-column>

                        </el-table>

                        <!--展示从passHub上拉取的信息-->

                        <el-table
                            :data="imageList"
                            height="300"
                            style="width: 100%"
                            v-if="label == '/hub/list'"
                            @row-dblclick="getpasshubImageId($event)"
                            v-loading="loading">
                            <el-table-column
                                prop="name"
                                label="名称"
                                width="220"
                            >
                            </el-table-column>

                            <el-table-column
                                prop="tag"
                                label="tag"
                                width="150"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="authName"
                                label="上传者"
                                width="150"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="repo"
                                label="repo"
                                width="200"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="digest"
                                label="digest"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="120">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        @click="downloadImage('pass',scope.row.id,scope.row.name)" type="success">下载
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-pagination
                            background
                            layout="total, prev, pager, next,jumper"
                            :total="total"
                            :current-page.sync="currentPage"
                            @current-change="handleCurrentChange"
                            v-if="this.total>10 &&  showLocal ==true"
                            id="pagination"
                        >
                        </el-pagination>
                    </div>
                </el-col>
            </el-form-item>
            <el-form-item label="环境配置">
                <el-button @click="add('env')">添加</el-button>
                <el-tooltip class="item" effect="dark" content="环境变量信息，一行填写一个" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item
                v-for="(envItem, index) in container.env"
                :label="'环境' + index"
                :key="envItem.key"
                :prop="'env.' + index + '.value'"
            >
                <el-col :span="11">
                    <el-input v-model="envItem.value"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-button @click.prevent="del('env',envItem)">删除</el-button>
                </el-col>
            </el-form-item>

            <el-form-item label="命令">
                <el-button @click="add('cmd')">添加</el-button>
                <el-tooltip class="item" effect="dark" content="容器启动命令，一行填写一个" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item
                v-for="(cmdItem, index) in container.cmd"
                :label="'命令' + index"
                :key="cmdItem.key"
                :prop="'cmd.' + index + '.value'"
            >
                <el-col :span="11">
                    <el-input v-model="cmdItem.value"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-button @click.prevent="del('cmd',cmdItem)">删除</el-button>
                </el-col>
            </el-form-item>

            <el-form-item label="挂载目录">
                <el-button @click="add('destination')">添加</el-button>
                <el-tooltip class="item" effect="dark" content="容器挂载目录，一行填写一个" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item
                v-for="(destinationItem, index) in container.destination"
                :label="'目录' + index"
                :key="destinationItem.key"
                :prop="'destination.' + index + '.value'"
            >
                <el-col :span="11">
                    <el-input v-model="destinationItem.value"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-button @click.prevent="del('destination',destinationItem)">删除</el-button>
                </el-col>
            </el-form-item>

            <el-form-item label="端口配置">
                <el-button @click="add('port')">添加</el-button>
                <el-tooltip class="item" effect="dark" content="端口映射信息" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item
                v-for="(portItem, index) in container.port"
                :label="'端口' + index"
                :key="portItem.key"
                :prop="'port.' + index + '.value'"
            >
                <el-col :span="6">
                    <div>
                        <span style="float: left">内部：</span>
                        <el-input v-model="portItem.in" style="width:200px;" :disabled="index <initPortLength">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <span style="float: left">外部：</span>
                        <el-input v-model="portItem.out" style="width:200px;">
                        </el-input>
                    </div>
                </el-col>

                <el-col :span="3">
                    <el-button @click.prevent="del('port',portItem)" v-if="index >=initPortLength">删除</el-button>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-col :offset="12">
                    <el-button type="primary" @click="onSubmit" :disabled="container.imageId==''">立即创建</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-col>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import qs from 'qs'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                labelPosition: 'left',
                container: {
                    containerName: '',
                    cmd: [{value: ''}],
                    env: [{value: ''}],
                    imageId: '',
                    projectId: '',
                    destination: [{value: ''}],
                    imageName: '',
                    port: [{in: '', out: ''}],
                },
                Registry: [
                    {label: "本地公共镜像", id: "/image/list/local?type=1"},
                    {label: "本地个人镜像", id: "/image/list/local?type=2"},
                    {label: "DockerHub", id: "/image/list/hub?name="},
                    {label: "PasSHub", id: "/hub/list"}
                ],
                showTable: false,
                imageList: [],
                tablePage: 1,
                imageType: 1,
                showSearchName: false,
                searchName: '',
                label: '',
                loading: false,
                nameList: [],
                showLocal: false,
                initPortLength: 0,
                time: '',
                time1: '',
                total: 0,
                submitLoading: true,
                passhubId: '',
                currentPage: 1,
                url: ''
            }
        },
        computed: {
            ...mapGetters({
                projectId: 'getProjectId',
                userInfo: 'getUserInfo',
                hostaddr: 'gethostaddr',
            })
        },
        methods: {
            //下拉菜单栏改变的时候触发
            changeValue(val) {
                this.showLocal = false;
                this.showSearchName = false;
                this.showTable = true;
                this.imageList = [];
                this.searchName = ''
                this.container.imageId = ''
                this.container.port = [{in: '', out: ''}]
                this.container.imageName = ''
                //dockerHub
                if (val == "/image/list/hub?name=") {

                    this.showSearchName = true;
                    return;
                }
                this.showSearchName = false;
                //passhub列表
                if (val == "/hub/list") {
                    this.loading = true;
                    this.getFromPassHub(val);
                    return;
                }

                let obj = {};
                obj = this.Registry.find((item) => {
                    return item.id == val;
                });
                this.label = obj.label
                this.url = obj.id;
                this.showLocal = true;
                //获取本地镜像列表
                this.$axios.get(obj.id + "&current=" + this.tablePage)
                    .then((res) => {
                        if (res.data.code == 0) {

                            this.total = res.data.data.total
                            this.imageList = res.data.data.records;
                            for (var i = 0; i < this.imageList.length; i++) {
                                this.imageList[i].size = bitConvert(this.imageList[i].size)
                            }
                            this.loading = false;
                        } else {

                            console.log(res.data.message)
                        }
                    })
            },
            //从dockerhub上搜索
            searchFromDocker() {
                if (this.searchName == '')
                    return
                this.loading = true;
                this.$axios.get("/image/list/hub?name=" + this.searchName)
                    .then((res) => {
                        if (res.data.code == 0) {

                            this.imageList = res.data.data;
                            for (let i = 0; i < this.imageList.length; i++) {
                                if (this.imageList[i].is_official) {
                                    this.imageList[i].is_official = "是"
                                } else {
                                    this.imageList[i].is_official = "否"
                                }
                            }
                            this.loading = false;
                        } else {
                            this.$message.error("get from dockerhub error")
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            //从passHub获取name
            getFromPassHub(val) {
                this.loading = true;
                this.imageList = [];
                this.$axios.get(val)
                    .then((res) => {
                        this.nameList = res.data.data;
                        this.getTagFromPass();
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                this.loading = false;
                return;
            },
            //从passHub获取tag
            getTagFromPass() {
                if (this.nameList.length == 0) {
                    this.loading = false;
                    return;
                }

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
                this.loading = false;
            },
            //双击行选则镜像id
            getImageId(column) {
                this.container.imageId = column.id;
                this.container.imageName = column.fullName;
                this.container.port = [{in: '', out: ''}];

                console.log(this.container.imageId)
                //本地镜像获取镜像的外暴端口
                this.$axios.get("/image/" + column.id + "/exportPort")
                    .then((res) => {
                        if (res.data.code == 0) {
                            let port = res.data.data;
                            console.log(res.data.data)
                            this.initPortLength = port.length;
                            if (port.length != 0) {
                                this.container.port = []
                                for (let i = 0; i < port.length; i++) {
                                    this.container.port.push({in: port[i], out: ''})
                                    // this.container.port[i].in = port[i];
                                    // this.container.port.out = '';
                                }
                            }

                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },
            //获取dockerHub的镜像id
            getDockerImageId(column) {
                this.container.imageId = ''
                this.container.imageName = column.name;
            },
            //获取passhub镜像的id
            getpasshubImageId(column) {

                this.container.imageId = ''
                this.passhubId = column.id;
                this.container.imageName = column.name;
            },
            //添加
            add(val) {
                if (val == "env") {
                    this.container.env.push({
                            value: '',
                            key: Date.now()
                        }
                    );
                } else if (val == "cmd") {
                    this.container.cmd.push({
                            value: '',
                            key: Date.now()
                        }
                    );
                } else if (val == "port") {
                    this.container.port.push({in: '', out: ''});
                }
                else {
                    this.container.destination.push({
                            value: '',
                            key: Date.now()
                        }
                    );
                }
            },
            //删除某个
            del(val, item) {
                if (val == "env") {
                    let index = this.container.env.indexOf(item)
                    if (index !== -1) {
                        this.container.env.splice(index, 1)
                    }
                } else if (val == "cmd") {

                    let index = this.container.cmd.indexOf(item)
                    if (index !== -1) {
                        this.container.cmd.splice(index, 1)
                    }
                } else if (val == "destination") {

                    let index = this.container.destination.indexOf(item)
                    if (index !== -1) {
                        this.container.destination.splice(index, 1)
                    }
                } else {
                    let index = this.container.port.indexOf(item)
                    if (index !== -1) {
                        this.container.port.splice(index, 1)
                    }
                }
            },
            //提交
            onSubmit() {
                //判断必填的端口号是否已经填写
                if (this.container.containerName.indexOf(';')!=-1){
                    this.$message.error("请确认输入不包含分号‘；’");
                    return;
                }
                if (this.container.env.length>0) {
                    for (var i = 0; i < this.container.env.length; i++) {
                        if (this.container.env[i].value.indexOf(";") != -1) {
                            this.$message.error("请确认输入不包含分号‘；’");
                            return;
                        }
                    }
                }
                if (this.container.cmd.length>0){
                    for(var i = 0; i < this.container.cmd.length; i++){
                            if (this.container.cmd[i].value.indexOf(";")!=-1){
                                this.$message.error("请确认输入不包含分号‘；’");
                                return;
                            }
                        }
                }

                if (this.container.destination.length>0){
                    for(var i = 0; i < this.container.destination.length; i++){
                            if (this.container.destination[i].value.indexOf(";")!=-1){
                                this.$message.error("请确认输入不包含分号‘；’");
                                return;
                            }
                        }
                }


                if (this.container.port.length > 0) {


                    for (var i = 0; i < this.container.port.length; i++) {
                        if (this.container.port[i].out == "" || this.container.port[i].in == "") {

                            this.$message.error("端口号" + i + "未填写");
                            return;
                        }
                        if (this.container.port[i].out < 10000 || this.container.port[i].out > 65535) {
                            this.$message.error("外部端口范围为10000~65535");
                            return;
                        }
                        if (this.container.port[i].in < 1 || this.container.port[i].in > 65535) {
                            this.$message.error("内部端口范围为1~65535");
                            return;
                        }
                        if (this.container.port[i].in.indexOf(";")!=-1||this.container.port[i].out.indexOf(";")!=-1){
                            this.$message.error("请确认输入不包含分号‘；’");
                            return;
                        }
                    }

                }
                this.container.projectId = this.projectId;
                //判断容器名称是否填写
                if (this.container.containerName == '') {

                    this.$message.warning("请填写容器名称");
                    return;
                }
                let cmd = new Array();
                let env = new Array();
                let destination = new Array();
                for (let i = 0; i < this.container.cmd.length; i++) {
                    cmd[i] = this.container.cmd[i].value;
                }
                for (let i = 0; i < this.container.env.length; i++) {
                    env[i] = this.container.env[i].value;
                }
                for (let i = 0; i < this.container.destination.length; i++) {
                    destination[i] = this.container.destination[i].value;
                }
                let cmdStr = cmd.join(";")
                let envStr = env.join(";")
                let destinationStr = destination.join(";")
                let portMap = {}
                this.container.port.forEach((item, index) => {
                    let key = item.in.toString();
                    portMap[key] = item.out;
                });


                console.log(portMap);
                this.$axios.post("/container/create", {
                    imageId: this.container.imageId,
                    containerName: this.container.containerName,
                    projectId: this.projectId,
                    cmdStr: cmdStr,
                    envStr: envStr,
                    destinationStr: destinationStr,
                    portMapStr: JSON.stringify(portMap)
                })
                    .then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success("正在创建容器");
                            this.$router.push('/projectContainer');
                        } else {
                            this.$message.error("配置错误")
                        }
                    })

            },
            cancel() {
                this.$router.go(-1);
            },
            //下载镜像
            downloadImage(type, data, imageName) {
                console.log(imageName)

                this.container.imageId = ''
                this.container.port = [{in: '', out: ''}]
                this.container.imageName = imageName

                if (type == "docker") {

                    this.$axios.post("/image/pull", {
                        imageName: data
                    })
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success(res.data.data)
                            }
                            if (res.data.code == 45) {
                                this.$message.error(res.data.message)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {

                    this.$axios.post("/hub/pull", {
                        id: data
                    })
                        .then((res) => {
                            console.log(res.data)
                            if (res.data.code == 0) {
                                this.$message.success(res.data.data)
                            }
                            if (res.data.code == 45) {
                                this.$message.error(res.data.message)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            },
            //初始化websocket
            initWebSocket() {

                this.websock = new WebSocket("ws://" + this.hostaddr + "/ws/" + this.userInfo.userId);
                this.websock.onopen = this.websocketonopen;

                this.websock.onerror = this.websocketonerror;

                this.websock.onmessage = this.websocketonmessage;

                this.websock.onclose = this.websocketclose;

            },
            //打开websocket
            websocketonopen: function () {
                console.log("WebSocket连接成功");
            },
            //打开错误
            websocketonerror: function (e) { //错误
                this.websock = new WebSocket("ws://" + this.hostaddr + "/ws/" + this.userInfo.userId);
                this.time1 = setInterval(this.start, 5000);

            },
            //数据接收
            websocketonmessage: function (e) {
                var data = eval('(' + e.data + ')');
                if (data.info == null) {
                    console.log(data);
                    if (data.code == 0) {
                        this.$notify({
                            type: 'success',
                            message: data.message,
                            duration: 3000
                        });
                        this.container.imageId = data.data.imageId;
                        this.container.port = [];
                        this.initPortLength = data.data.exportPort.length;
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
            //关闭
            websocketclose: function (e) {
                console.log("connection closed (" + e.code + ")");
                this.websock = new WebSocket("ws://" + this.hostaddr + "/ws/" + this.userInfo.userId);
            },
            start: function () {
                this.websock.send("HeartBeat");
                // if( this.websock.readyState != 1) {
                //   this.websocketclose()
                // }
            },
            handleCurrentChange(val) {
                this.loading = true;
                this.currentPage = val;
                console.log(this.currentPage)
                //获取本地镜像列表
                this.$axios.get(this.url + "&current=" + this.currentPage)
                    .then((res) => {
                        if (res.data.code == 0) {

                            this.total = res.data.data.total
                            this.imageList = res.data.data.records;
                            console.log(this.imageList)
                            this.loading = false;
                        } else {
                            console.log(res.data.message)
                        }
                    })
            }
        },
        created() {

            this.initWebSocket()
            this.time = setInterval(() => {
                this.start();
            }, 5000);
        },
        beforeDestroy() {
            clearInterval(this.time)
            clearInterval(this.time1)
        }
    }
</script>

<style scoped>
    #main {

        margin: 30px;
        border-radius: 15px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        padding-bottom: 50px;
    }

    .containerForm {
        margin-right: 70px;
        margin-left: 70px;
        margin-top: 60px;
    }

    #imageDiv {
        box-shadow: 0px 0px 5px #d1d1d1;
        min-height: 300px;
    }

    #pagination {
        margin-left: 750px;
        margin-top: 20px;
    }

    .box {
        width: 400px;

    .top {
        text-align: center;
    }

    .left {
        float: left;
        width: 60px;
    }

    .right {
        float: right;
        width: 60px;
    }

    .bottom {
        clear: both;
        text-align: center;
    }

    .item {
        margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
        padding: 8px 10px;
    }

    }
</style>
