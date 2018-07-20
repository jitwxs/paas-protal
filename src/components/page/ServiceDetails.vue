<template>
    <div class="servicedetails">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>服务详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="c">
                <el-tab-pane label="服务信息" name="first">

                    <el-form :label-position='labelpos' label-width="80px" v-model="serviceBasicInfo" >
                        <el-form-item label="服务名称">
                            <p>{{serviceBasicInfo.name}}</p>
                        </el-form-item>
                        <el-form-item label="项目名称">
                            <p>{{serviceBasicInfo.projectName}}</p>
                        </el-form-item>
                        <el-form-item label="横向扩展">
                            <p>{{serviceBasicInfo.replicas}}</p>
                        </el-form-item>
                        <el-form-item label="命令">
                            <p>{{serviceBasicInfo.command}}</p>
                        </el-form-item>
                        <el-form-item label="端口">
                            <p>{{serviceBasicInfo.port}}</p>
                        </el-form-item>
                        <el-form-item label="镜像">
                            <p>{{serviceBasicInfo.image}}</p>
                        </el-form-item>
                        <el-form-item label="环境变量">
                            <p>{{serviceBasicInfo.env}}</p>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <p>{{serviceBasicInfo.createDate}}</p>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="服务详情" name="second">
                    <pre id="showjson"></pre>
                </el-tab-pane>
                <el-tab-pane label="数据卷信息" name="third">
                    <el-table
                        :data="volumesInfo"
                        tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column prop="createDate" label="创建日期">
                        </el-table-column>
                        <el-table-column prop="name" label="数据卷名称">
                        </el-table-column>
                        <el-table-column prop="destination" label="数据卷命令">
                        </el-table-column>
                        <el-table-column prop="source" label="数据卷资源">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ServiceDetails",
        data() {
            return {
                // 该条服务信息的id
                serviceId: '',
                activeName: 'first',
                // 服务详情信息
                serviceInfo: {},
                // 服务日志信息
                logInfo: [],
                // 服务数据卷信息
                volumesInfo: [],
                //服务基本信息
                serviceBasicInfo:{},
                labelpos:'left',
                c:'first',
            }
        },
        methods: {
            //获取服务基本信息
            getServiceBasicInfo(){
                this.$axios.get("/service/" + this.serviceId)
                    .then((res)=>{
                        if (res.data.code === 0) {
                            this.serviceBasicInfo = res.data.data;
                        } else {
                            console.log(res.data.message);
                        }

                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            // 获取服务详情信息
            getServiceInfo: function () {
                this.$axios.get('/service/inspect/' + this.serviceId)
                    .then(response => {
                        if (response.data.code === 0) {
                            this.serviceInfo = response.data.data;

                            $("#showjson").html(syntaxHighlight(response.data.data));
                        } else {
                            this.$message.error( "获取服务详情信息失败！");
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 获取服务数据卷信息
            getVolumesInfo: function () {
                this.$axios.get('/volumes/list/obj' + "?objId=" + this.serviceId)
                    .then(response => {
                        if (response.data.code == 0) {
                            this.volumesInfo = response.data.data.records;
                        } else {
                            this.$message.error("获取服务数据卷信息失败！");
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created() {
            this.serviceId = this.$route.query.id;
            this.getServiceBasicInfo();
            this.getServiceInfo();
            this.getVolumesInfo();
        }
    }
</script>

<style >
    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
    .string { color: green; }
    .number { color: darkorange; }
    .boolean { color: blue; }
    .null { color: magenta; }
    .key { color: red; }
</style>
