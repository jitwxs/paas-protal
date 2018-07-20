<template>
    <div class="usermanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-news"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="hasFreeze" placeholder="选择范围" class="handle-select mr10">
                    <el-option key="1" label="已冻结" value="true"></el-option>
                    <el-option key="2" label="未冻结" value="false"></el-option>
                    <el-option key="3" label="全部用户" value=""></el-option>
                </el-select>
                <el-input v-model="select_username" placeholder="输入用户名" class="handle-input mr10"></el-input>
                <el-input v-model="select_email" placeholder="输入用户邮箱" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <!--整条用户信息冻结相关的操作按钮-->
            <div style="margin-top: -10px;margin-bottom: 10px">
                <el-button type="warning" @click="freeze">冻结</el-button>
                <el-button type="primary" style="margin-left: -1px;" @click="cancelFreeze">解除冻结</el-button>
            </div>
            <!--用户信息展示部分-->
            <el-table
                ref="multipleTable"
                :data="peopleInfo"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"

               >
                <el-table-column
                    type="selection"
                    label="选择"
                    width="65">
                </el-table-column>
                <el-table-column prop="username" label="用户账号" >
                </el-table-column>
                <el-table-column prop="email" label="用户邮箱" >
                </el-table-column>
                <el-table-column prop="roleId" label="角色" >
                </el-table-column>
                <el-table-column prop="hasFreeze" label="冻结状态" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="getXinXiInfo(scope.$index, scope.row)">信息</li>
                            <li style="float: left;color: #409EFF;cursor: pointer" @click="getXiangQingInfo(scope.$index, scope.row)">详情</li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>

           <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="10">
                </el-pagination>
            </div>

            <!--用户信息模态框-->
            <el-dialog title="用户信息" :visible.sync="xinXiVisible">
                <el-form :label-position='labelpos' label-width="120px" >
                    <el-form-item label="用户ID">
                        <p>{{xinXiInfo.id}}</p>
                    </el-form-item>
                    <el-form-item label="用户名称">
                        <p>{{xinXiInfo.username}}</p>
                    </el-form-item>
                    <el-form-item label="用户邮箱">
                        <p>{{xinXiInfo.email}}</p>
                    </el-form-item>
                    <el-form-item label="是否冻结">
                        <p>{{xinXiInfo.hasFreeze}}</p>
                    </el-form-item>
                    <el-form-item label="角色">
                        <p>{{xinXiInfo.roleId}}</p>
                    </el-form-item>
                    <el-form-item label="注册日期">
                        <p>{{xinXiInfo.createDate}}</p>
                    </el-form-item>
                </el-form>
            </el-dialog>


            <!--用户详情按钮的模态框-->
            <el-dialog title="用户详情" :visible.sync="xiangQingVisible">
                <el-form :label-position='labelpos' label-width="120px" >
                    <el-form-item label="上次登录时间">
                        <p>{{xiangQingInfo.lastLogin}}</p>
                    </el-form-item>
                    <el-form-item label="项目数量">
                        <p>{{xiangQingInfo.projectNum}}</p>
                    </el-form-item>
                    <el-form-item label="容器数量">
                        <p>{{xiangQingInfo.containerNum}}</p>
                    </el-form-item>
                    <el-form-item label="容器启动数量">
                        <p>{{xiangQingInfo.containerRunningNum}}</p>
                    </el-form-item>
                    <el-form-item label="容器暂停数量">
                        <p>{{xiangQingInfo.containerPauseNum}}</p>
                    </el-form-item>
                    <el-form-item label="容器停止数量">
                        <p>{{xiangQingInfo.containerStopNum}}</p>
                    </el-form-item>
                    <el-form-item label="上传镜像数量">
                        <p>{{xiangQingInfo.uploadImageNum}}</p>
                    </el-form-item>
                    <el-form-item label="hub镜像数量">
                        <p>{{xiangQingInfo.hubImageNum}}</p>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserManage',
        data() {
            return {
                // 用户信息展示区域
                peopleInfo: [],
                // 搜索用户输入的筛选信息
                hasFreeze:'',
                select_username: '',
                select_email:'',
                // 冻结操作的id组
                ids:[],
                // 分页当前页码
                currentPage:1,
                // 分页总条数
                totalCount:0,
                // 选中的项的信息数组
                multipleSelection:[],

                // 信息模态框属性
                xinXiVisible:false,
                xinXiInfo:{},
                labelpos:'left',
                // 详情模态框属性
                xiangQingVisible:false,
                xiangQingInfo:{},
                pageSize:10
            }
        },
        methods: {
            // 获取用户信息列表
            getPeopleInfo:function () {
                this.$axios.get('/user/list'+ '?current='+this.currentPage + "&size="+this.pageSize)
                    .then(response=>{
                        // console.log(response)
                        if (response.data.code == 0){
                            // this.$message.success({
                            //     message:"获取用户信息成功！",
                            //     showClose:true
                            // })
                            this.peopleInfo = response.data.data.records;
                            for(var i=0; i<response.data.data.records.length; i++){
                                if(response.data.data.records[i].roleId == 2) {
                                    this.peopleInfo[i].roleId = "管理员";
                                }else if (response.data.data.records[i].roleId == 1) {
                                    this.peopleInfo[i].roleId = "普通用户";
                                }
                                if(response.data.data.records[i].email == null){
                                    this.peopleInfo[i].email = "无";
                                }
                                if(response.data.data.records[i].hasFreeze){
                                    this.peopleInfo[i].hasFreeze = "已冻结";
                                }else {
                                    this.peopleInfo[i].hasFreeze = "未冻结";
                                }
                            }
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索用户信息
            search:function(){
                // 冻结状态为true
                if(this.hasFreeze == "true") {
                    this.$axios.get('/user/list' + "?hasFreeze=true" + "&current=" + this.currentPage + "&size=5" + "&username=" + this.select_username + "&email=" + this.select_email)
                        .then(response=>{
                            if (response.data.code == 0){
                                // this.$message.success({
                                //     message:"搜索用户信息成功！",
                                //     showClose:true
                                // })
                                this.peopleInfo = response.data.data.records;
                                for(var i=0; i<response.data.data.records.length; i++){
                                    if(response.data.data.records[i].roleId == 2) {
                                        this.peopleInfo[i].roleId = "管理员";
                                    }else if (response.data.data.records[i].roleId == 1) {
                                        this.peopleInfo[i].roleId = "普通用户";
                                    }
                                    if(response.data.data.records[i].email == null){
                                        this.peopleInfo[i].email = "无";
                                    }
                                    if(response.data.data.records[i].hasFreeze){
                                        this.peopleInfo[i].hasFreeze = "已冻结";
                                    }else {
                                        this.peopleInfo[i].hasFreeze = "未冻结";
                                    }
                                }
                                this.totalCount = response.data.data.total;
                            }else{
                                this.$message.error({
                                    message:"搜索用户信息失败！",
                                    showClose:true
                                })
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                   // 冻结状态为false
                }else if(this.hasFreeze == "false"){
                    this.$axios.get('/user/list' + "?hasFreeze=false" + "&current=" + this.currentPage + "&size=5" + "&username=" + this.select_username + "&email=" + this.select_email)
                        .then(response=>{
                            // console.log(response)
                            if (response.data.code == 0){
                                this.peopleInfo = response.data.data.records;
                                for(var i=0; i<response.data.data.records.length; i++){
                                    if(response.data.data.records[i].roleId == 2) {
                                        this.peopleInfo[i].roleId = "管理员";
                                    }else if (response.data.data.records[i].roleId == 1) {
                                        this.peopleInfo[i].roleId = "普通用户";
                                    }
                                    if(response.data.data.records[i].email == null){
                                        this.peopleInfo[i].email = "无";
                                    }
                                    if(response.data.data.records[i].hasFreeze){
                                        this.peopleInfo[i].hasFreeze = "已冻结";
                                    }else {
                                        this.peopleInfo[i].hasFreeze = "未冻结";
                                    }
                                }
                                this.totalCount = response.data.data.total;
                            }else{
                                this.$message.error({
                                    message:"获取用户信息失败！",
                                    showClose:true
                                })
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                    // 状态为全部用户
                }else if(this.hasFreeze === ""){
                    this.$axios.get('/user/list' + "?hasFreeze=" + "&current=" + this.currentPage + "&size=5" + "&username=" + this.select_username + "&email=" + this.select_email)
                        .then(response=>{
                            // console.log(response)
                            if (response.data.code == 0){
                                this.peopleInfo = response.data.data.records;
                                for(var i=0; i<response.data.data.records.length; i++){
                                    if(response.data.data.records[i].roleId == 2) {
                                        this.peopleInfo[i].roleId = "管理员";
                                    }else if (response.data.data.records[i].roleId == 1) {
                                        this.peopleInfo[i].roleId = "普通用户";
                                    }
                                    if(response.data.data.records[i].email == null){
                                        this.peopleInfo[i].email = "无";
                                    }
                                    if(response.data.data.records[i].hasFreeze){
                                        this.peopleInfo[i].hasFreeze = "已冻结";
                                    }else {
                                        this.peopleInfo[i].hasFreeze = "未冻结";
                                    }
                                }
                                this.totalCount = response.data.data.total;
                            }else{
                                this.$message.error({
                                    message:"获取用户信息失败！",
                                    showClose:true
                                })
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }
            },
            // 实现冻结功能
            freeze:function () {
                this.$axios.post('/user/freeze',{
                    ids:this.ids.toString(),
                })
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"冻结用户信息成功！",
                                showClose:true
                            })
                            this.getPeopleInfo();
                        }else {
                            this.$message.error({
                                message:"冻结用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 实现解除冻结的功能
            cancelFreeze:function(){
                this.$axios.post('/user/cancelFreeze',{
                    "ids":this.ids.toString(),
                })
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"解除冻结用户信息成功！",
                                showClose:true
                            })
                            this.getPeopleInfo();
                        }else {
                            this.$message.error({
                                message:"解除冻结用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 实现分页功能
            handleCurrentChange:function (val) {

                this.currentPage = val;
                this.getPeopleInfo();
                // console.log(val);
                // this.$axios.get('/user/list' + '?current=' + val + "&size=5")
                //     .then(response=>{
                //         // console.log(response)
                //         if (response.data.code == 0){
                //             this.peopleInfo = response.data.data.records;
                //             for(var i=0; i<response.data.data.records.length; i++){
                //                 if(response.data.data.records[i].roleId == 2) {
                //                     this.peopleInfo[i].roleId = "管理员";
                //                 }else if (response.data.data.records[i].roleId == 1) {
                //                     this.peopleInfo[i].roleId = "普通用户";
                //                 }
                //                 if(response.data.data.records[i].email == null){
                //                     this.peopleInfo[i].email = "无";
                //                 }
                //                 if(response.data.data.records[i].hasFreeze){
                //                     this.peopleInfo[i].hasFreeze = "已冻结";
                //                 }else {
                //                     this.peopleInfo[i].hasFreeze = "未冻结";
                //                 }
                //             }
                //         }else {
                //             this.$message.error({
                //                 message:"获取用户信息失败！",
                //                 showClose:true
                //             })
                //         }
                //         this.peopleInfo = response.data.data.records;
                //     })
                //     .catch(function (err) {
                //         console.log(err)
                //     })
            },
            // 获取选中用户信息的id信息
            handleSelectionChange:function (val) {

                this.ids=[]
                this.multipleSelection = val;
                for(var i=0; i<this.multipleSelection.length; i++){
                    this.ids.push(this.multipleSelection[i].id);
                }
                console.log(this.ids)
            },
            // 根据id获取用户信息
            getXinXiInfo:function (index,row) {
                // console.log(row.id)
                this.xinXiVisible = true;
                this.$axios.get('/user/list' + "?id=" + row.id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.xinXiInfo = response.data.data.records[0];
                                if(this.xinXiInfo.roleId == 2) {
                                    this.xinXiInfo.roleId = "管理员";
                                }else if (this.xinXiInfo.roleId == 1) {
                                    this.xinXiInfo.roleId = "普通用户";
                                }
                                if(this.xinXiInfo.email == null){
                                    this.xinXiInfo.email = "无";
                                }
                                if(this.xinXiInfo.hasFreeze){
                                    this.xinXiInfo.hasFreeze = "是";
                                }else {
                                    this.xinXiInfo.hasFreeze = "否";
                                }
                            // var obj = new Object();
                            // obj = response.data.data.records[0];
                            //
                            // var arr = new Array();
                            // for(var key in obj){
                            //     var value = obj[key];
                            //     arr.push( key + ":" + value);
                            // }
                            // this.xinXiInfo = arr;
                        }else {
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 根据id获取用户详情信息
            getXiangQingInfo:function (index,row) {
                this.xiangQingVisible = true;
                this.$axios.get('/monitor/' + row.id + '/info')
                    .then(response=>{
                        if(response.data.code == 0){
                            this.xiangQingInfo = response.data.data;

                        }else {
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },

            //获取分页的size
            handleSizeChange(val){

                this.pageSize = val;

                this.getPeopleInfo();
            }
        },
        created(){
            this.getPeopleInfo();
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
        width: 150px;
        display: inline-block;
    }

</style>
