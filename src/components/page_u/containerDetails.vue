<template>
    <div id="containerdetails">
        <!--数据卷模态框-->
        <el-dialog title="上传文件" :visible.sync="dialogVisible" width="30%">
            <!--<el-form >-->
            <!--<el-form-item label="选择文件">-->
            <!--<input id="imageInput" @change="importVolume($event)" type="file">-->
            <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="submitvolume">确 定</el-button>-->
            <!--</span>-->
            <el-upload
                class="upload-demo"
                drag
                ref="upload"
                action="/api/volumes/upload"
                :headers="usertoken"
                :data="formdata"
                :before-upload="beforeupload"
                :on-success="successupload"
                :file-list="fileList"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

            </el-upload>
            <el-button style="margin-left: 10px;margin-top: 10px" size="small" type="success" @click="submitUpload">
                上传到服务器
            </el-button>
        </el-dialog>

        <el-tabs v-model="activeName" @tab-click="projectTabSwitch">
            <el-tab-pane label="容器信息" name="first">
                <el-form :label-position='labelpos' label-width="80px">
                    <el-form-item label="容器名称">
                        <span>{{name}}</span>
                    </el-form-item>
                    <el-form-item label="项目Id">
                        <span>{{projectId}}</span>
                    </el-form-item>
                    <el-form-item label="项目名称">
                        <span>{{projectName}}</span>
                    </el-form-item>
                    <el-form-item label="默认指令">
                        <span>{{command}}</span>
                    </el-form-item>
                    <el-form-item label="默认端口">
                        <span>{{port}}</span>
                    </el-form-item>
                    <el-form-item label="镜像名称">
                        <span>{{image}}</span>
                    </el-form-item>
                    <el-form-item label="环境参数">
                        <span>{{env}}</span>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <span>{{createDate}}</span>
                    </el-form-item>
                    <el-form-item label="修改时间">
                        <span>{{updateDate}}</span>
                    </el-form-item>
                    <el-form-item label="运行状态">
                        <template slot-scope="scope">
                            <el-tag>{{statusName}}</el-tag>
                        </template>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :disabled="tabbool" label="容器进程" name="second">

                <el-select v-model="value" placeholder="请选择刷新间隔" style="margin-bottom: 20px">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button icon="el-icon-refresh" circle @click="refreshNow"></el-button>

                <el-table :data="jsonmessage" style="width: 100%">
                    <el-table-column prop="UID" label="UID"></el-table-column>
                    <el-table-column prop="PID" label="PID"></el-table-column>
                    <el-table-column prop="PPID" label="PPID"></el-table-column>
                    <el-table-column prop="C" label="C"></el-table-column>
                    <el-table-column prop="STIME" label="STIME"></el-table-column>
                    <el-table-column prop="TTY" label="TTY"></el-table-column>
                    <el-table-column prop="TIME" label="TIME"></el-table-column>
                    <el-table-column prop="CMD" label="CMD"></el-table-column>
                </el-table>
            </el-tab-pane>
            <!--//数据卷-->
            <el-tab-pane label="数据卷" name="third">

                <el-table
                    :data="volumeInfo"
                    style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="Driver:">
                                    <span>{{ props.row.volume.Driver }}</span>
                                </el-form-item>
                                <el-form-item label="Options:">
                                    <span>{{ props.row.volume.Options }}</span>
                                </el-form-item>
                                <el-form-item label="labels:">
                                    <span>{{ props.row.volume.Labels }}</span>
                                </el-form-item>
                                <el-form-item label="Mountpoint:">
                                    <span>{{ props.row.volume.Mountpoint }}</span>
                                </el-form-item>
                                <el-form-item label="Scope:">
                                    <span>{{ props.row.volume.Scope }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="名称"
                        prop="name">
                    </el-table-column>
                    <el-table-column
                        label="destination"
                        prop="destination" width="300">
                    </el-table-column>
                    <el-table-column
                        label="source"
                        prop="source">
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                        prop="createDate">
                    </el-table-column>

                    <el-table-column label="操作" width="100px">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="success"
                                @click="uploadFiles(scope.$index, scope.row)">上传文件
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="网络" name="forth">
                <div class="handle-box">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createLink">连接网络</el-button>
                    <el-button type="success" icon="el-icon-refresh" @click="syncNetwork">同步网络</el-button>
                </div>

                <el-dialog title="选择要连接的网络" :visible.sync="linkVisiable">
                    <el-table :data="linkableNetwork" @row-dblclick="linkNet($event)">
                        <el-table-column property="name" label="名称" width="150"></el-table-column>
                        <el-table-column property="scope" label="类型" width="200"></el-table-column>
                        <el-table-column property="hasPublic" label="是否公开"></el-table-column>
                    </el-table>
                </el-dialog>


                <el-table
                    :data="privateNetWorkInfo"
                    tooltip-effect="dark"
                    style="width: 100%">
                    <el-table-column prop="name" label="网络名称">
                    </el-table-column>
                    <el-table-column prop="scope" label="覆盖范围">
                    </el-table-column>
                    <el-table-column prop="hasIpv6" label="是否开启ipv6">
                    </el-table-column>
                    <el-table-column prop="hasPublic" label="网络性质">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <ul style="float: left;list-style-type: none">
                                <li style="float: left;color: #409EFF;cursor: pointer" @click="priDelete(scope.row.id)">
                                    取消连接
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "ContainerDetails",
        data() {
            return {
                usertoken: {'Authorization': sessionStorage.userToken},
                fileList: [],
                formdata: {},

                options: [{
                    value: 10000,
                    label: '10秒'
                }, {
                    value: 60000,
                    label: '1分钟'
                }, {
                    value: 300000,
                    label: '5分钟'
                }, {
                    value: 1800000,
                    label: '半小时'
                }, {
                    value: 3600000,
                    label: '一小时'
                }],
                dialogVisible: false,
                time: '',
                value: 10000,


                activeName: 'first',
                labelpos: 'left',
                id: '',
                name: '',
                projectId: '',
                projectName: '',
                status: '',
                command: '',
                port: '',
                image: '',
                env: '',
                createDate: '',
                updateDate: '',
                statusName: '',

                jsonmessage: [],
                tabbool: true,

                volumeInfo: [],
                currentPage: 1,
                totalCount: 0,
                pageSize: 10,
                volumeFile: '',
                fileName: '',
                volumeName: '',
                volumeId: '',

                privateNetWorkInfo: [],
                linkableNetwork: [],
                linkVisiable: false,
            }
        },
        methods: {
            beforeupload() {
                this.formdata.id = this.volumeId;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            successupload() {
                this.$message.success('文件上传成功');
            },

            refreshNow: function () {
                let that = this;
                this.jsonmessage = [];
                if (!that.id) {
                    clearInterval(that.time);
                }
                this.$axios.get('/container/top/' + that.id)
                    .then(response => {
                        if (this.status === 1) {
                            for (let i = 0; i < response.data.data.Processes.length; i++) {
                                let json = {};
                                json.UID = response.data.data.Processes[i][0];
                                json.PID = response.data.data.Processes[i][1];
                                json.PPID = response.data.data.Processes[i][2];
                                json.C = response.data.data.Processes[i][3];
                                json.STIME = response.data.data.Processes[i][4];
                                json.TTY = response.data.data.Processes[i][5];
                                json.TIME = response.data.data.Processes[i][6];
                                json.CMD = response.data.data.Processes[i][7];
                                this.jsonmessage.push(json);
                            }
                        }
                    }).catch(function (err) {
                    console.log(err)
                })
            },

            projectTabSwitch: function () {
                this.jsonmessage = [];
                if (this.activeName === 'second') {
                    this.$axios.get('/container/top/' + this.id)
                        .then(respone => {
                            if (this.status === 1) {
                                for (let i = 0; i < respone.data.data.Processes.length; i++) {
                                    let json = {};
                                    json.UID = respone.data.data.Processes[i][0];
                                    json.PID = respone.data.data.Processes[i][1];
                                    json.PPID = respone.data.data.Processes[i][2];
                                    json.C = respone.data.data.Processes[i][3];
                                    json.STIME = respone.data.data.Processes[i][4];
                                    json.TTY = respone.data.data.Processes[i][5];
                                    json.TIME = respone.data.data.Processes[i][6];
                                    json.CMD = respone.data.data.Processes[i][7];
                                    this.jsonmessage.push(json);
                                }
                            }
                        }).catch(function (err) {
                        console.log(err);
                    })
                } else {
                    clearInterval(this.time);
                }
            },

            refresh: function () {
                var that = this;
                this.time = setInterval(function () {
                    that.jsonmessage = [];
                    that.$axios.get('/container/top/' + that.id)
                        .then(response => {
                            for (let i = 0; i < response.data.data.Processes.length; i++) {
                                let json = {};
                                json.UID = response.data.data.Processes[i][0];
                                json.PID = response.data.data.Processes[i][1];
                                json.PPID = response.data.data.Processes[i][2];
                                json.C = response.data.data.Processes[i][3];
                                json.STIME = response.data.data.Processes[i][4];
                                json.TTY = response.data.data.Processes[i][5];
                                json.TIME = response.data.data.Processes[i][6];
                                json.CMD = response.data.data.Processes[i][7];
                                console.log(json);
                                that.jsonmessage.push(json);
                            }
                        }).catch(function (err) {
                        console.log(err)
                    })
                }, this.value);
            },

            getVolumeInfo() {
                this.$axios.get("/volumes/list/obj?objId=" + this.id + "&current=" + this.currentPage)
                    .then((res) => {
                        this.total = res.data.data.total;
                        this.volumeInfo = res.data.data.records;
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            },

            uploadFiles(index, row) {
                this.volumeId = row.id;
                this.dialogVisible = true;
            },

            importVolume(event) {
                event.preventDefault();//取消默认行为
                this.volumeFile = event.target.files[0];
                this.fileName = event.target.files[0].name;
            },
            submitvolume() {
                let that = this;
                console.log(sessionStorage.userToken);
                let formdata = new FormData();
                formdata.append('id', this.volumeId);
                formdata.append('file', this.volumeFile);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "/api/volumes/upload",
                    dataType: 'json',
                    headers: {
                        'Authorization': sessionStorage.userToken
                    },
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    data: formdata,
                    success: function (res) {
                        that.getVolumeInfo();
                        that.volumeFile = '';
                        that.fileName = '';
                        console.log(res.data);
                        that.$message('数据卷上传成功');
                        that.dialogVisible = false;

                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            getContainerNetworkInfo() {
                this.$axios.get('/network/container/' + this.id)
                    .then(response => {
                        console.log(response.data.code);
                        if (response.data.code === 0) {
                            if(response.data.data !== null) {
                                this.privateNetWorkInfo = [];
                                for (let i = 0; i < response.data.data.length; i++) {
                                    let json = {};
                                    json.id = response.data.data[i].network.id;
                                    json.name = response.data.data[i].network.name;
                                    json.scope = response.data.data[i].network.scope;
                                    json.hasIpv6 = response.data.data[i].network.hasIpv6;
                                    json.hasPublic = response.data.data[i].network.hasPublic;
                                    this.privateNetWorkInfo.push(json)
                                }
                                for (let i = 0; i < this.privateNetWorkInfo.length; i++) {
                                    if (this.privateNetWorkInfo[i].hasPublic) {
                                        this.privateNetWorkInfo[i].hasPublic = '公共网络'
                                    } else {
                                        this.privateNetWorkInfo[i].hasPublic = '个人网络'
                                    }
                                    if (this.privateNetWorkInfo[i].hasIpv6) {
                                        this.privateNetWorkInfo[i].hasIpv6 = '是'
                                    } else {
                                        this.privateNetWorkInfo[i].hasIpv6 = '否'
                                    }
                                }
                            }
                        } else {
                            this.$message.error(response.data.message)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            getPriNetworkInfo() {
                this.$axios.get('/network/list')
                    .then(response => {
                        this.linkableNetwork = response.data.data.records;
                        for (let i = 0; i < this.linkableNetwork.length; i++) {
                            if (this.linkableNetwork[i].hasPublic) {
                                this.linkableNetwork[i].hasPublic = '公共网络'
                            } else {
                                this.linkableNetwork[i].hasPublic = '个人网络'
                            }
                        }
                    }).catch(function (err) {
                    console.log(err);
                })
            },

            linkNet(row) {
                this.$axios.post('/network/connect', {
                    "containerId": this.id,
                    "networkId": row.id,
                })
                    .then(response => {
                        this.$message(response.data.message);
                        this.linkVisiable = false;
                        this.$axios.get('/network/sync/container/' + this.id)
                            .then(response => {
                                if (response.data.code === 0) {
                                    this.getContainerNetworkInfo();
                                } else {
                                    this.$message.error(response.data.message);
                                }
                            });
                    }).catch(function (err) {
                    console.log(err);
                })
            },
            createLink() {
                this.linkVisiable = true;
            },
            syncNetwork() {
                this.$axios.get('/network/sync/container/' + this.id)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success("网络同步成功");
                            this.getContainerNetworkInfo();
                        } else {
                            this.$message.error(response.data.message);
                        }
                    }).catch(function (err) {
                    console.log(err);
                })
            },
            priDelete(id) {
                this.$confirm('确认删除网络连接吗 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                            this.$axios.post('/network/disConnect', {
                                "containerId": this.id,
                                "networkId": id,
                            })
                                .then(response => {
                                    this.$message(response.data.message);
                                    this.getContainerNetworkInfo();
                                }).catch(function (err) {
                                console.log(err);
                            })
                        }
                    ).catch(() => {

                })
            }

        },

        mounted() {
            this.refresh();
            this.getContainerNetworkInfo();
            this.getPriNetworkInfo();
        },

        computed: {
            ...mapGetters({
                Token: 'getToken'
            })
        },

        beforeDestroy() {
            clearInterval(this.time)
        },
        created() {
            this.activeName = 'first';
            this.id = this.$route.query.id;
            console.log(this.id);
            this.$axios.get('/container/' + this.id)
                .then(respone => {
                    this.name = respone.data.data.name;
                    this.projectId = respone.data.data.projectId;
                    this.projectName = respone.data.data.projectName;
                    if (respone.data.data.command) {
                        this.command = respone.data.data.command.replace("[", "").replace("]", "");
                    }
                    this.port = respone.data.data.port;
                    this.image = respone.data.data.image;
                    if (respone.data.data.env) {
                        this.env = respone.data.data.env.replace("[", "").replace("]", "");
                    }
                    this.status = respone.data.data.status;
                    this.createDate = respone.data.data.createDate;
                    this.updateDate = respone.data.data.updateDate;
                    this.statusName = respone.data.data.statusName;
                    this.port = formatPort1(this.port);

                    if (this.status === 1) {
                        this.tabbool = false;
                    }
                }).catch(function (err) {
                console.log(err);
            });

            this.getVolumeInfo();
        }
    }
</script>

<style scoped>
    #containerdetails {
        position: relative;
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }
</style>
