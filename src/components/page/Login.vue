<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="login"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click.native="login">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {router,asyncRouterMap} from '../../router/index.js'
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
                }
            }
        },
        methods:{
            login:function () {
                let vm = this;
                let routerMap = new Array();
                //发送请求之前判断输入是否为空
                if (this.ruleForm.username == "" || this.ruleForm.password == ""){
                    this.$message.warning({
                        message:"用户名/密码不能为空",
                        showClose:true
                    })
                } else{
                    // 向后台发送用户名和密码获取token
                    this.$axios.post('/login', this.ruleForm)
                        .then(response => {
                            if (response.data.code == 0){ //登录成功
                                sessionStorage.setItem('userToken',response.headers.authorization);
                                this.token = response.headers.authorization
                                this.postToken();
                                // 根据角色id加载路由表
                                if(sessionStorage.getItem('currentRole') === asyncRouterMap[0].meta.roles){
                                    routerMap.push(asyncRouterMap[0]);
                                    vm.$router.addRoutes(routerMap);
                                    vm.$router.push({path:'/xitongshouye'});
                                }else if(sessionStorage.getItem('currentRole') === asyncRouterMap[1].meta.roles){
                                    routerMap.push(asyncRouterMap[1]);
                                    vm.$router.addRoutes(routerMap);
                                    vm.$router.push({path:'/xitongshouye_u'});
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
                               // for (let i=0; i<asyncRouterMap.length; i++) {
                               //     if (sessionStorage.getItem('currentRole') === asyncRouterMap[i].meta.roles){
                               //         routerMap.push(asyncRouterMap[i]);
                               //     }
                               // }
                               // vm.$router.addRoutes(routerMap);
                               // console.log(routerMap)
                               // vm.$router.push({path:'/dashboard'});
            },

            postToken:function () {
                // 向后台发送token获取用户角色、ID等信息
                this.$axios.post('/token',
                    {
                        headers:{
                            'Authorization': 'Bearer ' + this.token,
                        }
                    })
                    .then(response=>{
                        // console.log(response)
                        if(response.data.code == 0){
                            // 把用户信息存入sessionStorage
                            sessionStorage.setItem('userName',response.data.data.username);
                            // 根据响应的rolrId判断用户角色
                            if(response.data.data.roleId == 2) {
                                sessionStorage.setItem("currentRole", 2)
                            }else if(response.data.data.roleId == 1){
                                sessionStorage.setItem("currentRole", 1)
                            }
                        }
                    })
            }
        },
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
