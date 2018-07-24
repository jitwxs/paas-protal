<template>
    <div class="publiclocalimage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>本地公共镜像</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName2">
                <el-tab-pane label="镜像详情" name="first">
                    <div id="editor" class="json-editor"></div>
                    <pre id="json"></pre>
                </el-tab-pane>

                <el-tab-pane label="镜像历史" name="second">
                    <el-table :data="historyInfo" >
                        <el-table-column label="id" show-overflow-tooltip >
                            <template slot-scope="scope">
                                <p>{{ scope.row.Id }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="Tags"
                            label="标签"
                            width="180"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="Size"
                            label="大小"
                            width="180">
                        </el-table-column>
                        <el-table-column label="创建时间">
                            <template slot-scope="scope">
                                <span> {{ scope.row.Created }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="Comment"
                            label="说明"
                            width="180">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="暴露端口" name="third">
                    <div class="container">
                        <el-tag v-for="(item, index) in portInfo" key="index" style="margin-left: 10px;">{{item}}</el-tag>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import '../../../static/tree/jsoneditor'

    export default {
        name: "PublicLocalImage",
        data() {
            return {
                // tab页相关属性
                activeName2: 'first',
                // 每条镜像信息的id
                imageId: '',
                // 详情信息
                xiangQingInfo: {},
                // 历史信息
                historyInfo: [],
                // 端口信息
                portInfo: [],
                labelpos: 'left'
            }
        },
        methods: {
            // 获取详情信息
            getXiangQingInfo: function () {
                this.$axios.get('/image/inspect/' + this.imageId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.xiangQingInfo = response.data.data;

                            let json = response.data.data;
                            $('#editor').jsonEditor(json, {
                                change: function () {
                                    $('#json').html(JSON.stringify(json));
                                }
                            });
                        } else {
                            this.$message.error(response.data.message);
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取历史信息
            getHistoryInfo: function () {
                this.$axios.get('/image/history/' + this.imageId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.historyInfo = response.data.data;

                            this.historyInfo.forEach((item, index) => {
                                this.historyInfo[index].Size = bitConvert(item.Size);
                                this.historyInfo[index].Created = getLocalTime(item.Created);
                                console.log(this.historyInfo[index].Created)
                            })
                        } else {
                            this.$message.error(response.data.message);
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取镜像接口信息
            getPortInfo: function () {
                this.$axios.get('/image/' + this.imageId + '/exportPort')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.portInfo = response.data.data;
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
            this.imageId = this.$route.query.id;
            this.getXiangQingInfo();
            this.getHistoryInfo();
            this.getPortInfo();
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
        top: 18px;
        left: -5px;
    }
</style>
