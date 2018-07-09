<template>
    <div class="projectmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i>项目管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-table :data="containerInfo"  style="width: 100%">
                <el-table-column prop="createDate" label="创建日期">
                </el-table-column>
                <el-table-column prop="name" label="容器名称">
                </el-table-column>
                <el-table-column prop="status" label="状态编号">
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
                                   @click="handleEnter(scope.$index, scope.row)">进入</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <template>
            <el-button type="text" @click="handleEnter">点击打开 Message Box</el-button>
        </template>

<iframe src="ws://localhost:9999/ws/container/exec?width=100&height=50&ip=192.168.30.177&port=2375&containerId=f868226b2584c93b4ce1b34aef310b5a2125d7564a977b2c8835362ed28e0d9a"></iframe>

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
                src:''
            }
        },
        methods:{
            // 获取所有容器列表信息
            getContainerInfo:function(){
                // this.$axios.get
            },
            handleOpen:function () {

            },
            handlestop:function () {

            },
            handleDelete:function () {

            },
            handleEnter:function (index,row) {
                this.$axios.post('/container/terminal/' ,{
                    "containerId": "f868226b2584c93b4ce1b34aef310b5a2125d7564a977b2c8835362ed28e0d9a",
                    "cursorBlink": false,
                    "rows": 50,
                    "cols": 100,
                    "width": 100,
                    "height": 50,
                    })
                    .then(response=>{
                        console.log(response)
                        this.src = response.data.data.url;


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
