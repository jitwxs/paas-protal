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
                        <el-table-column
                            label="镜像仓库"
                            prop="repo">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <router-link style=" text-decoration: none;" :to="{path:'/publiclocalimage', query:{id:scope.row.id}}">
                                        <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">更多</li>
                                    </router-link>
                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="handleExport(scope.$index, scope.row)">导出</li>
                                    <li style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i></li>
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
                        <el-button type="primary"  @click="handleImport">导入</el-button>
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
                        <el-table-column
                            label="是否公开"
                            prop="hasOpen">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <ul style="float: left;list-style-type: none" >
                                    <router-link style=" text-decoration: none;" :to="{path:'/userlocalimage', query:{id:scope.row.id}}">
                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer">详情</li>
                                    </router-link>

                                    <li style="float: left;margin-right: 5px;color: #409EFF;cursor: pointer" @click="handleExport(scope.$index, scope.row)">导出</li>
                                    <li style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i></li>
                                </ul>

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

                <!--删除镜像的确认弹框-->
                <div class="deleteImage">
                    <el-dialog
                        :visible.sync="deleteDialogVisible"
                        width="30%">
                        <span><i class="el-icon-warning" style="margin-right: 10px"></i>确定要删除这个镜像吗？</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="deleteDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="confirmDelete">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    export default {
        name: "ImageManage",
        data() {
            return {
                // tab页的相关属性
                activeName1: 'first',
                // 搜索镜像名称
                select_publicImage: '',
                select_userImage: '',
                select_hubImage: '',

                // 公共镜像信息
                publicLocalImage: [{name: 'hhv'}],
                // 公共分页当前页码
                currentPage_Public: 1,
                // 公共分页总条数
                totalCount_Public: 0,

                // 用户镜像信息
                userLocalImage: [],
                // 用户分页当前页码
                currentPage_User: 1,
                // 用户分页总条数
                totalCount_User: 0,

                // hub镜像信息
                hubImage: [],
                // hub分页当前页码
                currentPage_Hub: 1,
                // hub分页总条数
                totalCount_Hub: 0,

                // 删除镜像的属性
                deleteDialogVisible: false,
                // 当前行镜像的id
                imageId: '',


                // 导入镜像模态框的相关属性
                importImageVisible: false,
                importImageInfo: {
                    file: '',
                    name: '',
                    tag: '',
                },
                formLabelWidth: '120px',

                // 上传文件相关属性
                url: 'http://192.168.100.142:8080/image/import',
                name: 'a.tar.gz',
                fileList: [],
                // headers: {
                //     Authorization: 'Bearer ' + sessionStorage.getItem('userToken')
                // },
            }
        },
        methods: {
            // 获取本地公共镜像
            getPublicLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=1"  +"&current=1"+ "&size=5" )
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "获取本地公用信息成功！",
                                showClose: true
                            })
                            this.publicLocalImage = response.data.data.records;
                            for(var i=0; i< this.publicLocalImage.length ; i++){
                                if(this.publicLocalImage[i].type = 1){
                                    this.publicLocalImage[i].type = "公共镜像";
                                }else if(this.publicLocalImage[i].type = 2){
                                    this.publicLocalImage[i].type = "用户镜像";
                                }
                            }
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
                console.log(val)
                this.$axios.get('/image/list/local' + "?type=1"  +"&current=" + val + "&size=5" )
                    .then(response=>{
                        if(response.data.code == 0){
                            this.publicLocalImage = response.data.data.records;
                            for(var i=0; i< this.publicLocalImage.length ; i++){
                                if(this.publicLocalImage[i].type = 1){
                                    this.publicLocalImage[i].type = "公共镜像";
                                }else if(this.publicLocalImage[i].type = 2){
                                    this.publicLocalImage[i].type = "用户镜像";
                                }
                            }
                        }else {
                            this.$message.error({
                                message: "获取本地公共镜像失败！",
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
                            this.$message.success({
                                message: "搜索本地公用信息成功！",
                                showClose: true
                            })
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

            // 获取本地用户镜像
            getUserLocalImage:function(){
                this.$axios.get('/image/list/local' + "?type=2" +"&current=" +this.currentPage_User + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "获取本地用户镜像信息成功！",
                                showClose: true
                            })
                            this.userLocalImage = response.data.data.records;
                            for(var i=0; i< this.userLocalImage.length ; i++){
                                if(this.userLocalImage[i].type = 1){
                                    this.userLocalImage[i].type = "公共镜像";
                                }else if(this.userLocalImage[i].type = 2){
                                    this.userLocalImage[i].type = "用户镜像";
                                }
                            }

                            for(var i=0; i<this.userLocalImage.length; i++){
                                if(this.userLocalImage[i].hasOpen){
                                    this.userLocalImage[i].hasOpen = "已公开";
                                }else {
                                    this.userLocalImage[i].hasOpen = "未公开";
                                }
                            }
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
                this.$axios.get('/image/list/local' + "?type=2"  +"&current=" + val + "&size=5" )
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
                this.$axios.get('/image/list/local' + "?type=2" + "&name=" + this.select_userImage + "&current=" + this.currentPage_User + "&size=5")
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            this.$message.success({
                                message: "搜索本地用户信息成功！",
                                showClose: true
                            })
                            this.userLocalImage = response.data.data.records;
                            this.totalCount_User = response.data.data.total;
                        }else {
                            this.$message.error({
                                message: "搜索本地用户信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 上传镜像
            uploadImage:function(){

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

            // 点击导入显示模态框
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
                        if(response.data.code == 0) {
                            this.$message.success({
                                message: "导入镜像信息成功！",
                                showClose: true
                            })
                            this.getUserLocalImage();
                        }else {
                            this.$message.error({
                                message: "导入镜像信息失败！",
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
                     if(response.data.code == 0){
                         this.$message.success({
                             message:"镜像同步成功！",
                             showClose:true
                         })
                     }else {
                         this.$message.error({
                             message:"镜像同步失败！",
                             showClose:true
                         })
                     }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },

            // 点击导出标签
            handleExport:function(index,row){
                this.$axios.get('/image/export/' + row.id)
                    .then(response=>{
                        if(response.data.code == 0){
                            this.$message.success({
                                message:"导出镜像成功！",
                                showClose:true
                            })
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
                this.deleteDialogVisible = true;
                this.imageId = row.id;
            },
            confirmDelete:function(){
                this.deleteDialogVisible = false;
                this.$axios.delete('/image/delete/' + this.imageId)
                    .then(response=>{
                     if(response.data.code == 0){
                         this.$message.success({
                             message: "导出镜像信息成功！",
                             showClose: true
                         })
                         this.getPublicLocalImage();
                         this.getUserLocalImage();
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



            // 初始化websocket
            initWebSocket:function(){ //初始化weosocket
                this.websock = new WebSocket("ws://192.168.100.142:9999/ws/1231451941131");

                this.websock.onopen = this.websocketonopen;

                // this.websock.onerror = this.websocketonerror;

                this.websock.onmessage = this.websocketonmessage;

                this.websock.onclose = this.websocketclose;
            },

            websocketonopen:function() {
                console.log("WebSocket连接成功");
            },

            websocketonerror:function(e) { //错误
                console.log("WebSocket连接发生错误");
            },

            websocketonmessage:function(e){ //数据接收
                // const redata = JSON.parse(e.data);
                //注意：长连接我们是后台直接1秒推送一条数据，
                //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
                //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
                // console.log(redata.value);
                console.log(e)
            },

            websocketsend:function(agentData){//数据发送
                this.websock.send(agentData);
            },

            websocketclose:function(e){ //关闭
                console.log("connection closed (" + e.code + ")");
            },

        },

        created(){
            this.getPublicLocalImage();
            this.getUserLocalImage()
            // this.getHubImage();
            this.initWebSocket();
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
