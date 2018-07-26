<template>
    <div id="serviceDetail">
        <!--数据卷模态框-->
        <el-dialog title="上传文件" :visible.sync="dialogVisible" width="30%">
            <el-upload
                class="upload-demo"
                drag
                ref="upload"
                action="/api/volumes/upload"
                :headers="usertoken"
                :data="formdata"
                :before-upload="beforeupload"
                :on-success="successupload"
                :file-list="fileList"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

            </el-upload>
            <el-button style="margin-left: 10px;margin-top: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-dialog>

    <el-tabs v-model="activeName">
        <el-tab-pane label="服务详情" name="first">
            <div>
                <div id="editor" class="json-editor"></div>
                <pre id="json"></pre>
            </div>
        </el-tab-pane>
        <el-tab-pane label="数据卷" name="second">
            <el-table
                :data="volumeInfo"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="Driver:">
                                <span>{{ props.row.volume.Driver }}</span>
                            </el-form-item>
                            <el-form-item label="Options:">
                                <span>{{ props.row.volume.Options }}</span>
                            </el-form-item>
                            <el-form-item label="labels:">
                                <span>{{ props.row.volume.Labels }}</span>
                            </el-form-item>
                            <el-form-item label="Mountpoint:">
                                <span>{{ props.row.volume.Mountpoint }}</span>
                            </el-form-item>
                            <el-form-item label="Scope:">
                                <span>{{ props.row.volume.Scope }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="destination"
                    prop="destination" width="300">
                </el-table-column>
                <el-table-column
                    label="source"
                    prop="source">
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="createDate">
                </el-table-column>

                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click="uploadFiles(scope.$index, scope.row)">上传文件</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import '../../../static/tree/jsoneditor'
    export default {
        name: "serviceDetails",
        data(){
            return{
                usertoken:{'Authorization':sessionStorage.userToken},
                fileList:[],
                formdata:{},

                activeName:'first',
                volumeInfo:[],
                dialogVisible :false,
                volumeId:'',
            }
        },
        methods:{
            beforeupload(){
                this.formdata.id=this.volumeId;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            successupload(){
                this.$message.success('文件上传成功');
            },

            getServiceInfo(){
                this.$axios.get('/service/inspect/'+ this.serviceId)
                    .then(response=>{
                        // $("#Service").html(JSON.stringify(response.data.data, null, 4));
                        var json = response.data.data;
                        $('#editor').jsonEditor(json, { change: function() {
                                $('#json').html(JSON.stringify(json));
                            } });
                    }).catch(function (err) {
                    console.log(err)
                })
            },

            getVolumeInfo(){
                this.$axios.get("/volumes/list/obj?objId="+this.serviceId)
                    .then((res)=>{
                        console.log(res);
                        this.volumeInfo = res.data.data.records;
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            },

            uploadFiles(index,row){
                this.volumeId = row.id;
                this.dialogVisible=true;
            },

            importVolume(event){
                event.preventDefault();//取消默认行为
                this.volumeFile = event.target.files[0];
                this.fileName = event.target.files[0].name;
            },
            submitvolume(){
                let that = this;
                console.log(sessionStorage.userToken);
                let formdata = new FormData();
                formdata.append('id',this.volumeId);
                formdata.append('file',this.volumeFile);
                $.ajax({
                    type: "post",
                    async: true,
                    url: "/api/volumes/upload",
                    dataType: 'json',
                    headers:{
                        'Authorization': sessionStorage.userToken
                    },
                    // 告诉jQuery不要去处理发送的数据
                    processData : false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    data: formdata,
                    success: function (res) {
                        that.getVolumeInfo();
                        that.volumeFile = '';
                        that.fileName='';
                        console.log(res.data);
                        that.$message('数据卷上传成功');
                        that.dialogVisible=false;

                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },



        },
        computed:{
            ...mapGetters({
                serviceId:'getServiceId'
            })
        },
        created(){
            this.getServiceInfo();
            this.getVolumeInfo();
        }
    }
</script>

<style scoped>
    #serviceDetail{
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }

    /* 上传按钮 */
    .fileinput-button {
        position: relative;
        display: inline-block;
        overflow: hidden;
    }

    .fileinput-button input {
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: 'alpha(opacity=0)';
        font-size: 200px;
    }
</style>
