<template>
    <div class="noticemanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i>通知管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-tabs v-model="activeName" >
            <el-tab-pane label="发送通知" name="first">
                <div class="form-box">
                    <el-form ref="sendForm" :model="sendForm" label-width="120px" style="margin-top: 10px">
                        <el-form-item label="通知标题">
                            <el-input v-model="sendForm.title" placeholder="输入通知标题"></el-input>
                        </el-form-item>
                        <el-form-item label="选择器">
                            <el-select v-model="sendForm.type" placeholder="选择发送通知的类型">
                                <el-option key="1" label="系统通知" value="1"></el-option>
                                <el-option key="2" label="容器通知" value="2"></el-option>
                                <el-option key="3" label="服务通知" value="3"></el-option>
                                <el-option key="4" label="其他通知" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否全部发送">
                            <el-radio-group v-model="sendForm.sendAll">
                                <el-radio label="是" value="true"></el-radio>
                                <el-radio label="否" value="false"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发送对象" v-show="!sendForm.sendAll">
                            <el-input v-model="sendForm.receivers" placeholder="输入要发送通知的用户名"></el-input>
                        </el-form-item>
                    </el-form>

                </div>
                <quill-editor ref="myTextEditor" v-model="sendForm.content" :options="editorOption" style="width: 100%"></quill-editor>
                <el-button class="editor-btn" type="primary" @click="sendNotice">发送</el-button>
                <el-button class="editor-btn" type="primary" @click="cancelSend">取消</el-button>
            </el-tab-pane>
                <el-tab-pane label="发送记录" name="second">
                    <el-table :data="sendRecord" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" width="180"></el-table-column>
                        <!--<el-table-column width="120">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button size="small">标为已读</el-button>-->
                                <!--<el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                    <!--<div class="handle-row">-->
                        <!--<el-button type="primary">全部标为已读</el-button>-->
                    <!--</div>-->

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

                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: "NoticeManage",
        data(){
            return{
                // tab页相关属性
                activeName: 'first',
                // 编辑器相关属性
                content: '',
                editorOption: {
                    placeholder: '你想通知什么？'
                },
                // 输入的标题
                input_title:'',
                // 发送通知的表单
                sendForm:{
                    title:'',
                    type:'',
                    sendAll:'',
                    receivers:'',
                    content:'',
                },
                // 发送通知的历史记录
                sendRecord: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
                },{
                    date: '2018-04-19 21:00:00',
                    title: '今晚12点整发大红包，先到先得',
                }],
                // 分页相关信息
                currentPage:1,
                totalCount:0,

            }
        },
        methods:{
            // 发送通知的请求
            sendNotice:function(){
                // console.log(this.sendForm)
                this.$axios.post('/notice/send',this.sendForm)
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            this.$message.success("发送通知成功！");
                        }else{
                            this.$message,error("发送通知失败！")
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 取消发送通知的请求
            cancelSend:function(){
                this.sendForm = {};
            },
            // 获取发送记录的信息
            getSendRecordInfo:function(){
              this.$axios.get('/notice/send/list' + "?current=1" + "&size=5")
                  .then(response=>{
                      console.log(response);
                      if(response.data.code == 0){
                          this.$message.success("获取发送通知记录成功！")
                          this.sendRecord = response.data.data.records;
                          this.totalCount = response.data.data.total;
                      }else {
                          this.$message.error("获取发送通知记录失败！")
                      }
                  })
                  .catch(function (err) {
                      console.log(err)
                  })
            },
            // 分页
            handleCurrentChange:function(val){
                this.$axios.get('/notice/send/list' + "?current=" + val + "&size=5")
                    .then(response=>{
                        if(response.data.code == 0){
                            this.sendRecord = response.data.data.records;
                            this.totalCount = response.data.data.total;
                        }else {
                            this.$message.error("获取发送通知记录失败！")
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            }
        },
        components: {
            quillEditor
        },
        created(){
            this.getSendRecordInfo();
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
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
</style>
