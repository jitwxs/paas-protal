<template>
    <div class="imagemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>镜像管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-button type="primary"  @click="syncImage"  style="float: right;margin-right: 3%;margin-bottom: 2%;margin-top: 2%">同步</el-button>

        <!--导入镜像的模态框-->
        <div class="importImage">
            <el-dialog title="导入镜像" :visible.sync="importImageVisible" >
                <el-form :model="importImageInfo">
                    <el-form-item label="选择镜像文件" :label-width="formLabelWidth"></el-form-item>
                    <el-upload
                        class="upload-demo"
                        action=url
                        name=name
                        :on-change="handleChange"
                        :file-list="fileList"
                    style="margin-left: 20%;margin-top: -6%">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <el-form-item label="镜像名称" :label-width="formLabelWidth">
                        <el-input v-model="importImageInfo.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="镜像标签" :label-width="formLabelWidth">
                        <el-input v-model="importImageInfo.tag" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="importImage">确 定</el-button>
                </div>
            </el-dialog>
        </div>

        <div class="container">
            <el-tabs v-model="message">
                <!--展示本地公共镜像-->
                <el-tab-pane :label="imageType[0]" name="first">
                    <div class="container">
                        <el-table :data="publicLocalImage" border style="width: 100%" ref="publicLocalImage">
                            <el-table-column prop="createDate" label="注册日期"  width="160">
                            </el-table-column>
                            <el-table-column prop="type" label="镜像类型"  width="125">
                            </el-table-column>
                            <el-table-column
                                label="镜像名称"
                                width="120">
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>全称： {{ scope.row.fullName }}</p>
                                        <p>标签: {{ scope.row.tag }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="size" label="镜像容量" width="125">
                            </el-table-column>
                            <el-table-column prop="repo" label="镜像仓库" width="125">
                            </el-table-column>

                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="success"
                                        @click="handleExport(scope.$index, scope.row)">导出</el-button>
                                    <router-link style=" text-decoration: none;" :to="{path:'/imagedetails', query:{id:scope.row.id}}">
                                    <el-button
                                        size="mini"
                                        type="info"
                                       >详情</el-button>
                                    </router-link>

                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--本地公共镜像的分页-->
                        <div class="pagination">
                            <el-pagination
                                @current-change="handleCurrentChange_Public"
                                :current-page.sync="currentPage_Public"
                                :page-size="5"
                                layout="prev, pager, next, jumper"
                                :total="totalCount_Public">
                            </el-pagination>
                        </div>
                    </div>

                </el-tab-pane>

                <!--展示本地用户镜像-->
                <el-tab-pane :label="imageType[1]" name="second">
                    <!--展示本地用户镜像-->
                    <div class="container">

                        <el-table :data="userLocalImage" border style="width: 100%" ref="userLocalImage">
                            <el-table-column prop="createDate" label="注册日期"  width="160">
                            </el-table-column>
                            <el-table-column prop="type" label="镜像类型"  width="125">
                            </el-table-column>
                            <el-table-column
                                label="镜像名称"
                                width="120">
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>全称： {{ scope.row.fullName }}</p>
                                        <p>标签: {{ scope.row.tag }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="size" label="镜像容量" width="125">
                            </el-table-column>
                            <el-table-column prop="repo" label="镜像仓库" width="125">
                            </el-table-column>

                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="success"
                                        @click="handleExport(scope.$index, scope.row)">导出</el-button>
                                    <router-link style=" text-decoration: none;" :to="{path:'/imagedetails', query:{id:scope.row.id}}">
                                    <el-button
                                        size="mini"
                                        type="info"
                                        >详情</el-button>
                                    </router-link>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>

                        </el-table>
                        <div class="handle-row">
                            <el-button type="primary"  @click="importImageVisible = true" style="margin-top: 2%">导入</el-button>

                        </div>



                        <div class="pagination">
                            <el-pagination
                                @current-change="handleCurrentChange_User"
                                :current-page.sync="currentPage_User"
                                :page-size="5"
                                layout="prev, pager, next, jumper"
                                :total="totalCount_User">
                            </el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-table
            :data="compony"
            style="width: 100%;margin-top:80px"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @current-change="toggleRowExpansion">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="公司名称:">
                            <span>{{ props.row.com_name }}</span>
                        </el-form-item>
                        <el-form-item label="下属电厂ID:">
                            <span>{{ props.row.fct_id }}</span>
                        </el-form-item>
                        <el-form-item label="电厂名称:">
                            <span>{{ props.row.fct_name }}</span>
                        </el-form-item>
                        <el-form-item label="用户名:">
                            <span>{{ props.row.user_name }}</span>
                        </el-form-item>
                        <el-form-item label="密码:">
                            <span>{{ props.row.password }}</span>
                        </el-form-item>
                        <el-form-item label="加入时间:">
                            <span>{{ props.row.join_time }}</span>
                        </el-form-item>
                        <el-form-item label="离开时间:">
                            <span>{{ props.row.leave_time }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="公司 ID"
                prop="com_id">
            </el-table-column>
            <el-table-column
                label="公司名称"
                prop="com_name">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
        name: "ImageManage",
        data() {
            return {
                // 导入镜像模态框的相关属性
                importImageVisible:false,
                // 上传文件相关属性
                url:'http://192.168.100.142:8080/image/import',
                name:'a.tar.gz',
                fileList:[],
                // headers: {
                //     Authorization: 'Bearer ' + sessionStorage.getItem('userToken')
                // },
                importImageInfo: {
                    file:'',
                    name:'',
                    tag:'',
                },
                formLabelWidth:'120px',


                message: 'first',
                // 公共镜像信息
                publicLocalImage:[{
                    id:'dsgdg',
                }],
                // 公共分页当前页码
                currentPage_Public: 1,
                // 公共分页总条数
                totalCount_Public:0,

                // 用户镜像信息
                userLocalImage:[],
                // 用户分页当前页码
                currentPage_User: 1,
                // 用户分页总条数
                totalCount_User:0,

                // 镜像类型信息
                imageType:[{"0":"hhb"},{"1":"bhbh"}],

                compony:[{
                    com_name:'fddfsadd',
                    com_id:'nhjcbhsdbc',

                        leave_time:'dzd',
                        join_time:'dvdv',
                        password:'dad',
                        user_name:'avdsvds',
                        fct_name:'afds',
                        fct_id:'dsvfdv',
                }],
                // 获取row的key值
                getRowKeys(row) {
                    return row.id;
                },
                // 要展开的行，数值的元素是row的key值
                expands: [],
            }
        },
        methods: {
            // 上传之前判断输入格式
            beforeUpload:function(){
                if (this.importImageInfo.type == "" || this.importImageInfo.tag == "") {
                    this.$message.error({
                        message:"请完善镜像文件信息!",
                        showClose:true
                    })
                }
            },
            handleChange:function(file,fileList){
                this.fileList = fileList.slice(-3);
            },



            // 导入镜像
            importImage:function(){
                this.importImageVisible = false,
                this.$axios.post('/image/import',
                    {
                        "file":this.importImageInfo.file,
                        "name": this.importImageInfo.name,
                        "tag": this.importImageInfo.tag,
                    })
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0) {
                            this.getUserLocalImage();
                        }else {
                            this.$message.error({
                                message: "获取镜像信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 本地镜像和远程镜像同步操作
            syncImage:function(){
                this.$axios.get('/image/sync')
                    .then(response=>{
                        console.log(response)
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },
            // 获取镜像的类型
            getImageType:function(){
                this.$axios.get('/enums/image')
                    .then(response=>{
                        for(var key in response.data.data){
                            this.imageType.push(response.data.data[key])
                            // console.log(this.imageType)
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 获取本地公共镜像
            getPublicLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=1" + "&name=nginx" +"&current=" +this.currentPage_Public + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.publicLocalImage = response.data.data.records;
                            this.totalCount_Public = response.data.total;
                        }else {
                            this.$message.error({
                                message: "获取本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 本地公用镜像的分页操作
            handleCurrentChange_Public:function(val){
                this.$axios.get('/image/list/local' + "?type=1" + "&name=nginx" +"&current=" + val + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.publicLocalImage = response.data.data.records;
                        }else {
                            this.$message.error({
                                message: "获取本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 获取本地用户镜像
            getUserLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=2" + "&name=nginx" +"&current=" +this.currentPage_User + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.userLocalImage = response.data.data.records;
                            this.totalCount_User = response.data.total;
                        }else {
                            this.$message.error({
                                message: "获取本地用户镜像信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 本地用户镜像信息分页操作
            handleCurrentChange_User:function(val){
                this.$axios.get('/image/list/local' + "?type=2" + "&name=nginx" +"&current=" + val + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.publicLocalImage = response.data.data.records;
                        }else {
                            this.$message.error({
                                message: "获取本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 导出镜像操作
            handleExport:function(index,row){
                this.$axios.get('/image/export/' + row.id)
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            // console.log(response.data.data)
                            window.open(response.data.data)
                        }else {
                            this.$message.error({
                                message: "导出镜像信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 删除镜像操作
            handleDelete:function(index,row){
                this.$axios.delete('/image/delete/' + row.id)
                    .then(response=>{
                        console.log(response)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 点击切换tab页时触发的函数
            handleClick:function () {

            },
            toggleRowExpansion(row){
                this.expands = [];
                this.expands.push(row.id);
            },
        },

        created(){
            this.getPublicLocalImage();
            this.getUserLocalImage()
            this.getImageType();
        }
    }
</script>

<style scoped>

</style>
