<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>token管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tokenInfo" >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item >
                                <span>{{ props.row.token }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名" ></el-table-column>
                <el-table-column prop="createDate" label="申请时间" ></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <ul style="float: left;list-style-type: none" >
                            <li style="float: left;color: #409EFF;cursor: pointer" @click="deleteToken(scope.row)">删除</li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TokenManage",
        data(){
            return{
                tokenInfo:[],
                token:'',
            }
        },
        methods:{
            //获取token表格
            getToken(){
                this.tokenInfo = [];
                this.$axios.get('/token/list')
                    .then(response=>{
                        var json = response.data.data;
                        for (var i in json){
                            var obj = {};
                            obj.userName = i;
                            obj.token = json[i].token;
                            obj.createDate = json[i].createDate;
                            this.tokenInfo.push(obj);
                        }
                    }).catch(function (err) {
                    console.log(err)
                })
            },
            deleteToken:function (row) {
                this.$axios.delete('/token/delete/'+row.userName)
                    .then(response=>{
                        if (response.data.code===0){
                            this.$message(response.data.message);
                            this.getToken();
                        }

                    }).catch(function (err) {
                    console.log(err);
                })
            }
        },
        created(){

            this.getToken();
        }
    }
</script>

<style scoped>

</style>
