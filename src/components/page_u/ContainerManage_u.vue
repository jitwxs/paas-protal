<template>
    <div class="projectmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>容器管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-table :data="containerInfo"  style="width: 100%">
                <el-table-column prop="name" label="容器名称">
                </el-table-column>
                <el-table-column prop="statusName" label="状态名称">
                </el-table-column>
                <el-table-column prop="image" label="容器镜像">
                </el-table-column>
                <el-table-column prop="port" label="容器端口">

                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="small" type="success"
                                   @click="handleOpen">启动</el-button>
                        <el-button size="small" type="warning"
                                   @click="handlestop">停止</el-button>
                        <el-button size="small" type="danger"
                                   @click="handleDelete">删除</el-button>
                        <el-button size="small" type="success"
                                   style=" text-decoration: none;"
                                   @click="handleEnter(scope.$index, scope.row)"
                                   ><a href="../../../static/term.html" target="_blank" style="color: white">进入</a></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ContainerManage_u",
        data(){
            return{
                // 所有容器列表信息
                containerInfo:[{
                    createDate:'dbshdhsah',
                }],
            }
        },
        methods:{
            // 获取所有容器列表信息
            getContainerInfo:function(){
                this.$axios.get('/container/list/')
                    .then(response=>{
                        // console.log(response)
                        this.containerInfo = response.data.data.records;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            handleOpen:function () {

            },
            handlestop:function () {

            },
            handleDelete:function () {

            },
            handleEnter:function (index,row) {
                this.$axios.post('/container/terminal/' ,{
                    "containerId": row.id,
                    "cursorBlink": false,
                    "rows": 50,
                    "cols": 100,
                    "width": 100,
                    "height": 50,
                    })
                    .then(response=>{
                        sessionStorage.setItem('terminalCursorBlink',response.data.data.cursorBlink);
                        sessionStorage.setItem('terminalRows',response.data.data.rows);
                        sessionStorage.setItem('terminalCols',response.data.data.cols);
                        sessionStorage.setItem('terminalUrl',response.data.data.url);

                        // this.$store.state.terminalInfo.cursorBlink = response.data.data.cursorBlink;
                        // this.$store.state.terminalInfo.rows = response.data.data.rows;
                        // this.$store.state.terminalInfo.cols = response.data.data.cols;
                        // this.$store.state.terminalInfo.url = response.data.data.url;

                        console.log(this.$store.state.terminalInfo.url)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getContainerInfo();
        }
    }
</script>

<style scoped>

</style>
