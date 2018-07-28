<template>
    <div class="login-wrap" style="background-color: #373a4b;">
        <el-row>
            <el-col :span="10" :offset="4">
                <div style="height: 700px;margin-top: 70px; margin-right: 25%;">
                    <div class="iconUp">
                        <img src="../../../static/img/cloud.png" class="cloudImg"/>
                        <span class="char">无道容器云</span>
                        <div class="line"></div>
                    </div>
                    <div class="disc">
                        <el-row>
                            <el-col :span="4"  >
                                <img src="../../../static/img/people.svg"/>

                            </el-col>
                            <el-col :span="12">
                                <div style="margin-top: 20px;height: 300px;">
                                    <span style="color: #FFFFFF;font-size: 28px;margin-top: 20px;">云产品免费体验中...</span>
                                    <div class="desvDiv">
                                        <img src="../../../static/img/gou.svg" class="descGou">
                                        <span class="descChar"> 容器服务</span>
                                    </div>
                                    <div class="desvDiv">
                                        <img src="../../../static/img/gou.svg" class="descGou">
                                        <span class="descChar"> 集群服务</span>
                                    </div>
                                    <div class="desvDiv">
                                        <img src="../../../static/img/gou.svg" class="descGou">
                                        <span class="descChar"> 镜像服务</span>
                                    </div>
                                    <button class="enjoy"> 立即体验</button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div style="width: 100%;margin-top: 200px">
                    <div class="loginDiv">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" >
                            <el-form-item prop="username" label="用户名">
                                <el-input v-model="ruleForm.username" ></el-input>
                            </el-form-item>
                            <el-form-item prop="password" label="密码" style="margin-top: 40px">
                                <el-input type="password" v-model="ruleForm.password" @keyup.enter.native="login"></el-input>
                            </el-form-item>
                            <div class="login-btn">
                                <el-button type="primary" @click.native="login">登录</el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {router,asyncRouterMap} from '../../router/index.js'
    import {mapGetters} from 'vuex'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username:'',
                    password:''
                },
                // hasToken:false,
                token:"",
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                containerStatus:[{labels:'',values:''},{labels:'',values:''},{labels:'',values:''},{labels:'',values:''}]
            }
        },
        methods:{
            login:function () {
                let vm = this;
                let routerMap = new Array();
                //发送请求之前判断输入是否为空
                if (this.ruleForm.username === "" || this.ruleForm.password === ""){
                    this.$message.warning({
                        message:"用户名/密码不能为空",
                        showClose:true
                    })
                } else{
                    // 向后台发送用户名和密码获取token
                    this.$axios.post('/login', this.ruleForm)
                        .then(response => {
                            if (response.data.code === 0){ //登录成功
                                sessionStorage.setItem('currentRole',response.data.data.roleId);
                                sessionStorage.setItem('userName',response.data.data.username);
                                sessionStorage.setItem('userToken',response.headers.authorization);

                                this.$store.dispatch('changeUserInfo',response.data.data);
                                // this.token = response.headers.authorization
                                // 根据角色id加载路由表
                                console.log(sessionStorage.getItem('currentRole'));
                                if(sessionStorage.getItem('currentRole') == asyncRouterMap[0].meta.roles){
                                    routerMap.push(asyncRouterMap[0]);
                                    vm.$router.addRoutes(routerMap.concat([{
                                        path: '*',
                                        redirect: '/404'
                                    }]));
                                    console.log(routerMap);
                                    vm.$router.push('/xitongshouye');
                                }else if(sessionStorage.getItem('currentRole') == asyncRouterMap[1].meta.roles){
                                    routerMap.push(asyncRouterMap[1]);
                                    console.log(routerMap);
                                    vm.$router.addRoutes(routerMap.concat([{
                                        path: '*',
                                        redirect: '/404'
                                    }]));
                                    vm.$router.push('/xitongshouye_u');
                                }
                            } else {
                                this.$message.error({
                                    message:"登录失败！",
                                    showClose:true
                                });
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                    }
            }
            // postToken:function () {
            //     // 向后台发送token获取用户角色、ID等信息
            //     this.$axios.post('/token',
            //         {
            //             headers:{
            //                 'Authorization': 'Bearer ' + this.token,
            //             }
            //         })
            //         .then(response=>{
            //             if(response.data.code == 0){
            //                 // 把用户信息存入sessionStorage
            //                 sessionStorage.setItem('userName',response.data.data.username);
            //                 // 根据响应的rolrId判断用户角色
            //                 if(response.data.data.roleId == 2) {
            //                     sessionStorage.setItem("currentRole", 2)
            //                 }else if(response.data.data.roleId == 1){
            //                     sessionStorage.setItem("currentRole", 1)
            //                 }
            //             }
            //         })
            // }
        },
    }
</script>

<style scoped >
    .loginDiv{
        padding-top: 100px;
        text-align: center;
        /*border: none;*/
        /*box-shadow: 0 0 3px #dddddd;*/
        width: 100%;
        height: 400px;
        border-radius: 15px;
        background-color: ghostwhite;
        padding-right: 40px;
        padding-left: 30px;

    }
    .iconUp{
        width: 100%;
        display:table;
        _position:relative;
        overflow:hidden;

    }
    .line{
        width: 100%;
        height: 1px;
        background: linear-gradient(to right,rgba(255,255,255,.15),rgba(255,255,255,0))
    }
    .cloudImg{
        vertical-align:middle;
        display:table-cell;
        _position:absolute;
        _top:50%;
        width: 100px;
        height: 100px;
        text-align: center;
    }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .char{
        _position:relative;
        _top:-50%;
        font-size: 30px;
        color: #FFFFFF;

    }
    .disc{
        width: 100%;
        height: 400px;
        margin-top: 30px;
    }
    .desvDiv{

        margin-top: 20px;
        /*margin-bottom: 30px;*/
        width: 100%;
        display:table;
        _position:relative;
        overflow:hidden;
    }
    .descGou{

        vertical-align:middle;
        display:table-cell;
        _position:absolute;
        _top:50%;
        text-align: center;
    }
    .descChar{
        _position:relative;
        _top:-50%;
        font-size: 20px;
        color: #FFFFFF;

    }
    .enjoy{

        margin-top: 50px;
        background-color: #373a4b;
        border: 1px solid whitesmoke;
        width: 300px;
        height: 50px;
        /*font-size: 22px;*/
        color: whitesmoke;
        cursor: pointer;
    }
    .enjoy:hover{

        background-color: whitesmoke;
        color: black;
    }
    .el-input__inner{

        height: 50px;
        line-height: 50px;
        width: 100%;
    }
    .login-btn{
        width: 300px;
        text-align: center;
        margin:  10px  auto;
    }
    .login-btn button{
        margin-top: 50px;
        width:100%;
        height:36px;
    }
</style>
