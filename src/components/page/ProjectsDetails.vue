<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>容器详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="projectTabSwitch">
                <el-tab-pane  label="项目详情" name="first">
                    <el-form :label-position='labelpos' label-width="80px" >

                        <el-form-item label="项目名称">
                            <p>{{projectname}}</p>
                        </el-form-item>
                        <el-form-item label="用户名">
                            <p>{{projectuserName}}</p>
                        </el-form-item>
                        <el-form-item label="项目描述">
                            <p>{{projectdescription}}</p>
                        </el-form-item>
                        <el-form-item label="创建日期">
                            <p>{{projectcreateDate}}</p>
                        </el-form-item>
                        <el-form-item label="修改日期">
                            <p>{{projectupdateDate}}</p>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="项目日志" name="second">
                    <el-table
                        :data="logdata"
                        style="width: 100%">
                        <el-table-column
                            prop="createDate"
                            label="时间">
                        </el-table-column>
                        <el-table-column
                            prop="objName"
                            label="对象名">
                        </el-table-column>
                        <el-table-column
                            prop="description"
                            label="事件">
                        </el-table-column>
                    </el-table>

                    <div class="pagination">
                        <el-pagination
                            @current-change="logPage"
                            :current-page.sync="logPageContent"
                            :page-size="10"
                            layout="prev, pager, next, jumper"
                            :total="logTotal">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProjectDetails",
        data(){
            return{
                id:'',
                rowid:'',
                projectid:'',
                projectuserId:'',
                projectname:'',
                projectuserName:'',
                projectdescription:'',
                projectcreateDate:'',
                projectupdateDate:'',
                activeName: 'first',
                projectTab:[],
                logTotal:0,
                logPageContent:0,
                logdata:[{createDate:'',containerName:'',description:'',}],
                labelpos:'left',
            }
        },
        methods:{
            projectTabSwitch(tab, event) {
                if(this.activeName==='second'){
                    this.$axios.get('/project/log/?projectId='+this.rowid)
                        .then(response => {
                            this.logdata = response.data.data.records;
                            this.logTotal = response.data.data.total;
                        }).catch(function (err) {
                        console.log(err)
                    })
                }
            },
            logPage:function(val){
                console.log(this.rowid);
                this.$axios.get('/project/log/?projectId='+this.rowid+'&?current=' + val + '&size=10')
                    .then(response => {
                        this.logdata = response.data.data.records;
                    }).catch(function (err) {
                    console.log(err)
                })
            },
        },
        created(){
            this.id = this.$route.query.id;
            this.activeName = 'first';
            this.logdata = [{createDate:'',containerName:'',description:'',}];
            this.$axios.get('/project/'+this.id)
                .then(response => {
                    this.projectid =response.data.data.id;
                    this.projectuserName = response.data.data.username;
                    this.projectname = response.data.data.name;
                    this.projectdescription =response.data.data.description;
                    this.projectcreateDate = response.data.data.createDate;
                    this.projectupdateDate = response.data.data.updateDate;
                    this.rowid = this.id;
                }).catch(function (err) {
                console.log(err);
            })
        }
    }
</script>

<style scoped>

</style>
