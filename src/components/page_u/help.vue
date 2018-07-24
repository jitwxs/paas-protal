<template>
    <div id="main">
        <div style="background-color: #ffffff;padding:50px;">
            <h3>为帮助用户更好的使用容器/集群服务，在此列出一些常用镜像配置，仅供参考</h3>
            <el-collapse v-model="activeName" style="padding-top: 10px;">
                <el-collapse-item name="1">
                    <template slot="title">
                        <i class="header-icon iconfont jitwxs-tomcat"></i>&nbsp;Tomcat
                    </template>
                    <el-table :data="tomcatData" style="width: 100%">
                        <el-table-column prop="type" label="类型" width="180"></el-table-column>
                        <el-table-column prop="name" label="名称" width="180"></el-table-column>
                        <el-table-column label="参数">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <b>{{ scope.row.value }}</b>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <i class="header-icon iconfont jitwxs-mysql"></i>&nbsp;MySQL
                    </template>
                    <el-table :data="mysqlData" style="width: 100%">
                        <el-table-column prop="type" label="类型" width="180"></el-table-column>
                        <el-table-column prop="name" label="名称" width="180"></el-table-column>
                        <el-table-column label="参数">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <b>{{ scope.row.value }}</b>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        <i class="header-icon iconfont jitwxs-nginx"></i>&nbsp;Nginx
                    </template>
                    <el-table :data="nginxData" style="width: 100%">
                        <el-table-column prop="type" label="类型" width="180"></el-table-column>
                        <el-table-column prop="name" label="名称" width="180"></el-table-column>
                        <el-table-column label="参数">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <b>{{ scope.row.value }}</b>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                        <i class="header-icon iconfont jitwxs-java"></i>&nbsp;Java
                    </template>
                    <el-table :data="javaData" style="width: 100%">
                        <el-table-column prop="type" label="类型" width="180"></el-table-column>
                        <el-table-column prop="name" label="名称" width="180"></el-table-column>
                        <el-table-column label="参数">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <b>{{ scope.row.value }}</b>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "help",
        data() {
            return {
                activeName: '1',
                tomcatData: [{
                    type: '挂载目录',
                    name: 'web项目存储路径',
                    value: '/usr/local/tomcat/webapps/'
                }],
                mysqlData: [
                    {
                        type: '环境变量',
                        name: '设置Root用户密码',
                        value: 'MYSQL_ROOT_PASSWORD=123456'
                    },
                    {
                        type: '挂载目录',
                        name: 'MySQL数据文件',
                        value: '/var/lib/mysql'
                    },
                    {
                        type: '挂载目录',
                        name: 'MySQL配置文件',
                        value: '/etc/mysql/conf.d'
                    }],
                nginxData: [{
                    type: '挂载目录',
                    name: 'web项目存储路径',
                    value: '/usr/share/nginx/html'
                }, {
                    type: '挂载目录',
                    name: 'Nginx配置文件',
                    value: '/etc/nginx/conf.d'
                }],
                javaData: [{
                    type: '启动命令',
                    name: '保证JAVA持续运行',
                    value: '/bin/bash'
                }]
            };
        }
    }

</script>

<style scoped>
</style>
