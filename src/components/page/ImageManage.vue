<template>
    <div class="imagemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i>镜像管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-tabs v-model="activeName1" >
                <el-tab-pane label="本地公共镜像" name="first">
                    <!--搜索本地公共镜像-->
                    <div class="handle-box">
                        <el-input v-model="select_publicImage" placeholder="输入镜像名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchPublicImage">搜索</el-button>
                        <el-button type="primary"  @click="handleImport">导入</el-button>
                        <el-button type="primary" icon="el-icon-refresh" style="float: right" @click="syncImage">同步</el-button>
                    </div>
                    <el-table
                        :data="publicLocalImage"
                        style="width: 100%">
                        <el-table-column
                            label="镜像名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="镜像标签">
                            <template slot-scope="scope">
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                                    </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="容量大小"
                            prop="size">
                        </el-table-column>
                        <el-table-column
                            label="镜像类型"
                            prop="type">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <router-link style=" text-decoration: none;" :to="{path:'/imagedetails', query:{id:scope.row.id}}">
                                        <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">更多</li>
                                        <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="handleExport">导出</li>
                                    </router-link>
                                </ul>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_Public"
                            :current-page.sync="currentPage_Public"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_Public">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="本地用户镜像" name="second">
                    <!--搜索本地用户镜像-->
                    <div class="handle-box">
                        <el-input v-model="select_userImage" placeholder="输入镜像名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchUserImage">搜索</el-button>
                        <el-button type="primary"  @click="importImage">导入</el-button>
                    </div>
                    <el-table
                        :data="userLocalImage"
                        style="width: 100%">
                        <el-table-column
                            label="镜像名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="镜像标签">
                            <template slot-scope="scope">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="容量大小"
                            prop="size">
                        </el-table-column>
                        <el-table-column
                            label="镜像类型"
                            prop="type">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="handleXiangQing(scope.$index, scope.row)">详情</li>
                                    <li style="float: left;color: #409EFF;cursor: pointer" @click="handleExport(scope.$index, scope.row)">导出</li>
                                </ul>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    style="margin-left: 20px"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_User"
                            :current-page.sync="currentPage_User"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_User">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="Hub镜像" name="third">
                    <!--搜索Hub镜像-->
                    <div class="handle-box">
                        <el-input v-model="select_hubImage" placeholder="输入镜像名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="searchHubImage">搜索</el-button>
                        <el-button type="primary"  @click="uploadImage">上传</el-button>
                    </div>
                    <el-table
                        :data="hubImage"
                        style="width: 100%">
                        <el-table-column
                            label="镜像名称"
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            label="镜像标签">
                            <template slot-scope="scope">
                                <!--<el-popover trigger="hover" placement="top">-->
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.tag }}</el-tag>
                                </div>
                                <!--</el-popover>-->
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="容量大小"
                            prop="size">
                        </el-table-column>
                        <el-table-column
                            label="镜像类型"
                            prop="type">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="handleXiangQing(scope.$index, scope.row)">详情</li>
                                    <li style="float: left;color: #409EFF;cursor: pointer" @click="handleExport(scope.$index, scope.row)">导出</li>
                                </ul>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    style="margin-left: 20px"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!--分页区域-->
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange_Hub"
                            :current-page.sync="currentPage_Hub"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalCount_Hub">
                        </el-pagination>
                    </div>
                </el-tab-pane>

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
                // tab页的相关属性
                activeName1:'first',
                // 搜索镜像名称
                select_publicImage:'',
                select_userImage:'',
                select_hubImage:'',

                // 公共镜像信息
                publicLocalImage:[{
                    name:'dsgdg',
                }],
                // 公共分页当前页码
                currentPage_Public: 1,
                // 公共分页总条数
                totalCount_Public:0,

                // 用户镜像信息
                userLocalImage:[{
                    name:'dsgdg',
                }],
                // 用户分页当前页码
                currentPage_User: 1,
                // 用户分页总条数
                totalCount_User:0,

                // hub镜像信息
                hubImage:[],
                // hub分页当前页码
                currentPage_Hub: 1,
                // hub分页总条数
                totalCount_Hub:0,

                // 导入镜像模态框的相关属性
                importImageVisible:false,
                importImageInfo: {
                    file:'',
                    name:'',
                    tag:'',
                },
                formLabelWidth:'120px',

                // 上传文件相关属性
                url:'http://192.168.100.142:8080/image/import',
                name:'a.tar.gz',
                fileList:[],
                // headers: {
                //     Authorization: 'Bearer ' + sessionStorage.getItem('userToken')
                // },


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
            // 获取本地公共镜像
            getPublicLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=1"  +"&current=" +this.currentPage_Public + "&size=5")
                    .then(response=>{
                        console.log(response)
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
                this.$axios.get('/image/list/local' + "?type=1"  +"&current=" + val + "&size=5")
                    .then(response=>{
                        // console.log(val)
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
            // 搜索本地公共镜像
            searchPublicImage:function(){
                this.$axios.get('/image/list/local' + "?type=1" + "&name=" + this.select_publicImage + "&current=" + this.currentPage_Public + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.publicLocalImage = response.data.data.records;
                            this.totalCount_Public = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: "搜索本地公用信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            handleImport:function(){
                this.importImageVisible = true
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

            // 点击导出标签
            handleExport:function(index,row){
                this.$axios.get('/image/export/' + row.id)
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
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

            // 获取本地用户镜像
            getUserLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=2" +"&current=" +this.currentPage_User + "&size=5")
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
            // 搜索本地用户镜像
            searchUserImage:function(){

            },
            // 上传镜像
            uploadImage:function(){

            },

            // 获取hub镜像信息
            getHubImage:function(){

            },
            // 搜索hub镜像
            searchHubImage:function(){

            },
            // hub分页
            handleCurrentChange_Hub:function(){

            },


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
            this.getHubImage();
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
        top: 15px;
        left: -6px;
    }
</style>
