<template>
    <div class="programmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>程序管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--整条用户信息冻结相关的操作按钮-->
            <div style="margin-top: -10px;margin-bottom: 2%">
                <el-button type="danger" icon="el-icon-delete"  @click="handleDelete">删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-left: -1px;" @click="handleCreate">创建</el-button>
            </div>

            <!--展示程序列表信息-->
            <el-table
                ref="multipleTable"
                :data="programInfo"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    label="选择"
                    width="65">
                </el-table-column>
                <el-table-column prop="name" label="程序名称" >
                </el-table-column>
                <el-table-column prop="ip" label="程序ip" >
                </el-table-column>
                <el-table-column prop="port" label="程序端口" >
                </el-table-column>
                <el-table-column prop="remark" label="程序标注" >
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <p style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-refresh" @click="handleUpdate(scope.$index, scope.row)"></i></p>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>

            <!--创建或者更新程序的模态框-->
            <div class="creatProgram">
                <el-dialog title="创建程序" :visible.sync="programFormVisible" >
                    <el-form :model="programForm" >
                        <el-form-item label="程序名称" :label-width="formLabelWidth" >
                            <el-input v-model="programForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="程序备注" :label-width="formLabelWidth" >
                            <el-input v-model="programForm.remark" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址" :label-width="formLabelWidth">
                            <el-input v-model="programForm.ip" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="端口号" :label-width="formLabelWidth">
                            <el-input v-model="programForm.port" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="createOrUpdate()">确 定</el-button>
                    </div>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ProgramManage",
        data(){
            return{
                // 程序信息
                programInfo:[],
                // 创建或更新程序的相关属性
                programId:'',
                programFormVisible:false,
                createStatus:false,
                formLabelWidth:'120px',
                programForm:{
                    name:'',
                    remark:'',
                    ip:'',
                    port:''
                },
                // 选中的项的信息数组
                multipleSelection:[],
                ids:[],

                // 分页信息
                currentPage:1,
                totalCount:0,
            }
        },
        methods:{
            // 获取程序信息
            getProgramInfo:function(){
                this.$axios.get('/program/list' + "?current=1" + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "获取程序信息成功！",
                                showClose: true
                            })
                            this.programInfo = response.data.data.records;
                            for(var i=0; i<this.programInfo.length; i++){
                                if(this.programInfo[i].remark == null){
                                    this.programInfo[i].remark = '无';
                                }
                            }
                            this.totalCount = response.data.data.total;
                        }else{
                            this.$message.error({
                                message: "获取程序信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击创建按钮
            handleCreate:function(){
                this.programFormVisible = true;
                this.createStatus = true;
            },
            // 发送创建程序请求
            createProgram:function(){
                this.$axios.post('/program/create',{
                    name:this.programForm.name,
                    remark:this.programForm.remark,
                    ip:this.programForm.ip,
                    port:this.programForm.port,
                })
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"创建程序成功！",
                                showClose: true
                            })
                            this.getProgramInfo();
                        }else{
                            this.$message.error({
                                message:"创建程序失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击更新按钮
            handleUpdate:function(index, row){
                this.programFormVisible = true;
                this.createStatus = false;
                this.programId = row.id;
            },
            // 发送更新程序请求
            updateProgram:function(){
                // console.log(this.programId)
                this.$axios.put('/program/update',{
                    id:this.programId,
                    name:this.programForm.name,
                    remark:this.programForm.remark,
                    ip:this.programForm.ip,
                    port:this.programForm.port,
                })
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"更新程序信息成功！",
                                showClose:true
                            })
                        }else {
                            this.$message.error({
                                message:"更新程序信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击确认按钮执行创建程序或者更新操作
            createOrUpdate:function(){
                this.programFormVisible = false;
                if(this.createStatus){
                    this.createProgram();
                    this.programForm = '';
                }else{
                    this.updateProgram();
                }
            },

            // 获取选中条数的id
            handleSelectionChange:function(val){
                // console.log(val);
                this.multipleSelection = val;
                for(var i=0; i<this.multipleSelection.length; i++){
                    this.ids.push(this.multipleSelection[i].id.toString());
                }
            },
            // 删除程序
            handleDelete:function(){
                this.$axios.post('/program/delete',{
                    ids:this.ids.join(",")
                })
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"删除程序信息成功！",
                                showClose:true
                            })
                            this.getProgramInfo();
                        }else {
                            this.$message.error({
                                message:"删除程序信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 分页
            handleCurrentChange:function (val) {
                this.$axios.get('/program/list' + "?current=" + val + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.programInfo = response.data.data.records;
                            for(var i=0; i<this.programInfo.length; i++){
                                if(this.programInfo[i].remark == null){
                                    this.programInfo[i].remark = '无';
                                }
                            }
                        }else{
                            this.$message.error({
                                message: "获取程序信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getProgramInfo();
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
