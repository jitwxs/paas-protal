<template>
    <div id="mirror">

      <!--上传镜像和拉取镜像-->
      <div class="upAndDown">
        <el-button style="display: inline" @click="dialogVisible3 = true">导入镜像</el-button>
        <el-button type="primary" style="display: inline;margin-left: 20px;" @click="dialogVisible = true">拉取镜像</el-button>
      </div>

      <!--导入镜像模态框-->
      <el-dialog title="导入镜像" :visible.sync="dialogVisible3" width="30%">
        <el-form :model="mirrorForm">
          <el-form-item label="选择镜像" :label-width="formLabelWidth">
            <input id="imageInput" @change="importImage($event)" type="file">
          </el-form-item>
          <el-form-item label="名字" :label-width="formLabelWidth">
            <el-input v-model="mirrorForm.name"></el-input>
          </el-form-item>
          <el-form-item label="标签" :label-width="formLabelWidth">
            <el-input v-model="mirrorForm.tag"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="importMirror">确 定</el-button>
        </span>
      </el-dialog>


      <!--拉取镜像的弹出框-->
      <el-dialog
        title="请输入镜像名称"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-input v-model="mirrorName" placeholder="请输入镜像名称"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="pullMirror">确 定</el-button>
        </span>
      </el-dialog>

      <!--上传镜像时输入密码-->
      <el-dialog
        title="请输入信息"
        :visible.sync="dialogVisible2"
        width="40%"
      >
        <el-form ref="form" :model="dockerHub" label-width="180px">
          <el-form-item label="Docker Hub用户名" style="margin-left: -30px">
            <el-input v-model="dockerHub.username"></el-input>
          </el-form-item>
          <el-form-item label="Docker Hub密码" style="margin-left: -30px">
            <el-input v-model="dockerHub.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="upMirror">确 定</el-button>
        </span>
      </el-dialog>

      <!--个人镜像列表-->
      <el-table
        :data="mirrors"
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="镜像名称">
        <template slot-scope="scope">
         <span @click="handleView(scope.$index, scope.row)" style="cursor:pointer;">{{scope.row.name}}</span>
        </template>
          >
        </el-table-column>
        <el-table-column
          label="镜像大小"
          prop="size">
        </el-table-column>
        <el-table-column
          label="镜像类型"
          prop="type">
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              v-if=scope.row.hasOpen
              size="mini"
              @click="handleUnOpen(scope.$index, scope.row)">已公开</el-button>
            <el-button
              v-else
              size="mini"
              @click="handleOpen(scope.$index, scope.row)" >私有</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">上传</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleExport(scope.$index, scope.row)">导出</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="block" style="text-align: center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

export default {
  name: 'mirror',
  data(){
    return {
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      formLabelWidth:'180',
      time:'',
      time1:'',
//      密码
      password:'',
      //个人镜像列表
      mirrors:[
//        {
//          "id": "592838bf086d4f6cb6f412e0f859f337",
//          "imageId": "3065a4fb90cdd94f30ff575df3cd1f4d6f47261dd06128a5b6d6699d7fc1322d",
//          "fullName": "local/f4f4bb152cf54fec94eb0d2b22d25f71/my-busybox:latest",
//          "name": "my-busybox",
//          "tag": "latest",
//          "size": 1363351,
//          "type": 2,
//          "userId": "f4f4bb152cf54fec94eb0d2b22d25f71",
//          "hasOpen": false,
//          "virtualSize": 1363351,
//          "labels": "null",
//          "cmd": "null",
//          "repo": "local",
//          "parentId": "",
//          "createDate": "2018-07-12 14:21:50",
//          "updateDate": null
//        }
      ],
//      要拉取的镜像的名称
      mirrorName:"",
//      分页需要
      currentPage:1,
      total:0,
      //当前选择镜像的id
      imageId:'',
//      导入镜像表单
      mirrorForm:{
        "name":'',
        "tag":''
      },
//      当前导入镜像的文件信息
      image:'',
//      表格批量选择
      multipleSelection:[],
      fileName:'',
      dockerHub:{
        "username":'',
        "password":'',
      }
    }
  },
  methods:{
//    拉取个人镜像列表
    getMirrorList:function () {
      this.$axios.get("/image/self?current=1&size=10&orderByField=size&asc=false")
        .then(response => {
          console.log(response);
          if (response.data.code == 0){
            this.$message.success({
              message:response.data.message,
              showClose:true
            });
            this.total = response.data.data.total;
            this.mirrors = response.data.data.records;
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },

//    查看详情
    handleView:function (index, row) {
//      id放入vuex
      this.$store.commit('SET_CURRENTMIRROR_ID',row.id);
      this.$router.push({path:'/mirrorDetail/detail'})
    },

//    上传镜像
    handleEdit:function (index, row) {
      this.dialogVisible2 = true;
      this.imageId = row.id;
    },
    upMirror:function () {
      this.$axios.post('/image/push',{
        "imageId": this.imageId,
        "username": this.dockerHub.username,
        "password": this.dockerHub.password
      })
        .then(response => {
          console.log(response);
          if (response.data.code == 0){
            this.dialogVisible2 = false;
            this.$message.success({
              message:response.data.message,
              showClose:true
            });
          }  else {
            this.$message.error({
              message:response.data.message,
              showClose:true
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },

//    删除列表中的镜像
    handleDelete:function (index, row) {
      this.$axios.delete("/image/delete/" + row.id)
        .then(response => {
          if (response.data.code == 0){
            this.$message.success({
              message:response.data.message,
              showClose:true
            });
            this.getMirrorList();
          } else {
            this.$message.error({
              message:response.data.message,
              showClose:true
            })
          }
          console.log("删除一个镜像" + reponse)
        })
        .catch(function (err) {
          console.log(err)
        })
    },

//    导出镜像
    handleExport:function (index, row) {
        this.$axios.get("/image/export/" + row.id)
          .then(response => {
            if (response.data.code == 0) {
              this.dialogVisible = false;
              this.$message.success({
                message: response.data.message,
                showClose: true
              });
            }else {
              this.$message.error({
                message:response.data.message,
                showClose:true
              })
            }
          })
          .catch(function (err) {
            console.log(err);
          })
    },

//    拉取镜像
    pullMirror:function () {
      this.$axios.post("/image/pull",{
        "imageName": this.mirrorName
      })
        .then(response => {
          if (response.data.code == 0){
            this.dialogVisible = false;
            this.$message.success({
              message:response.data.message,
              showClose:true
            });
            this.getMirrorList();
            this.mirrorName = '';
          }  else {
            this.$message.error({
              message:response.data.message,
              showClose:true
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },

//    分页
    handleCurrentChange:function (val) {
      this.$axios.get("/image/self?current=" + val +"&size=10&orderByField=size&asc=false")
        .then(response => {
//          console.log(response)
        })
        .catch(function (err) {
          console.log(err)
        })
    },

//    本地选择镜像文件实时函数
    importImage:function (event) {
      event.preventDefault();//取消默认行为
      this.image = event.target.files[0];
      this.fileName = event.target.files[0].name;
    },

//    导入镜像
    importMirror:function () {
      let formdata = new FormData();
      formdata.append('file',this.image);
      formdata.append('name',this.mirrorForm.name);
      formdata.append('tag',this.mirrorForm.tag);
//      formData.append("file",file);
      $.ajax({
        type: "post",
        async: true,
        url: "http://192.168.100.151:9999/image/import",
        dataType: 'json',
        headers:{
          'Authorization': sessionStorage.token
        },
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        data: formdata,
        success: function (res) {
          this.getMirrorList();
          this.mirrorForm = {};
        },
        error: function (error) {
          console.log(error);
        }
      });
    },

//    表格批量选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

//    表格记录选中操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

//    设置为公开
    handleOpen:function (index, row) {
      this.$axios.get("/image/share/" + row.id)
        .then(res => {
          if (res.data.code == 0){
            this.getMirrorList();
          }
        })
        .catch(function (err) {
          console.log(err);
        })
    },

//   取消为公开
    handleUnOpen:function (index, row) {
      this.$axios.get("/image/disShare/" + row.id)
        .then(res => {
          if (res.data.code == 0){
            this.getMirrorList();
          }
        })
        .catch(function (err) {
          console.log(err);
        })

    },
    //初始化websocket
    initWebSocket(){
      console.log(this.userInfo.userId)
      this.websock = new WebSocket("ws://192.168.100.151:9999/ws/"+ this.userInfo.userId);
      this.websock.onopen = this.websocketonopen;

      this.websock.onerror = this.websocketonerror;

      this.websock.onmessage = this.websocketonmessage;

      this.websock.onclose = this.websocketclose;

    },

    //打开websocket
    websocketonopen:function() {
      console.log("WebSocket连接成功");
    },

    //打开错误
    websocketonerror:function(e) { //错误
      this.websock = new WebSocket("ws://192.168.100.151:9999/ws/"+ this.userInfo.userId);
      this.time1 = setInterval(this.start,5000);

    },

    //数据接收
    websocketonmessage:function(e){
      var data = eval('('+e.data+')');
      if (data.info == null) {
        console.log(data)
        if (data.code == 0){
          this.$notify({
            type: 'success',
            message: data.message,
            duration:3000
          });
          this.container.imageId = data.data.imageId;
          this.container.port = [];
          this.initPortLength = data.data.exportPort.length;

        } else {
          this.$notify({
            type: 'error',
            message: data.message,
            duration:3000
          });
        }
      }
      else {
        console.log(data.info)
      }

    },

    //关闭
    websocketclose:function(e){
      console.log("connection closed (" + e.code + ")");
      this.websock = new WebSocket("ws://192.168.100.151:9999/ws/"+this.userInfo.userId);
    },

    start: function(){
      this.websock.send("HeartBeat");
      // if( this.websock.readyState != 1) {
      //   this.websocketclose()
      // }
    },

  },
  created(){
    this.getMirrorList();
    this.initWebSocket();
    this.time = setInterval(()=>{
      this.start();
    },5000);
  },
  beforeDestroy () {
    clearInterval(this.time)
    clearInterval(this.time1)
  },
  computed:{
    ...mapGetters({
      userInfo:'getUserInfo'
    })
  }
}
</script>

<style scoped>
  /*列表*/
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  /*分页*/

  /*上传文件*/
  .upAndDown{
    width:100%;
    height:40px;
  }
  .file-box{
    clear: both;
    width:98px;
    height:40px;
    color: #606266;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    background-color: #ffffff;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .file-btn{
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    top: 0;
    left: 0;
    outline: none;
    background-color: transparent;
    filter:alpha(opacity=0);
    -moz-opacity:0;
    -khtml-opacity: 0;
    opacity: 0;
  }
</style>
