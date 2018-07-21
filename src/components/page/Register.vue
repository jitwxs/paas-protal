<template>
    <div class="bbb">

        <el-container>
            <el-header>

                <div class="ui large secondary inverted pointing menu">
                    <!--<a class="item">Home</a>-->
                    <!--<a class="item">Work</a>-->
                    <!--<a class="item">Company</a>-->
                    <!--<a class="item">Careers</a>-->
                    <div class="right item" style="padding: auto">
                        <!--< to="/" class="ui button">Log in</>-->
                        <router-link to="Login" class="ui inverted button">Log in</router-link>
                        <!--<router-link to="Register" class="ui inverted button">Sign Up</router-link>-->
                    </div>
                </div>
            </el-header>
        </el-container>

        <div class="ms-login" >
            <el-form label-position="left" :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2"  class="demo-ruleForm" >
                <h3 data-v-2c8a1058="" class="title">用户注册</h3>
                <el-form-item  prop="username">
                    <el-input v-model="ruleForm2.username" placeholder="请输入用户名">aaa</el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item  prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item  prop="email">
                    <el-input type="email" v-model="ruleForm2.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click.native="register">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Register",

        data() {

            var checkUsername =(rule,value,callback)=>{
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {
                    callback();
                }
            };

            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm2.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            var checkEmail =(rule,value,callback)=>{
                // if (value === '') {
                //     callback(new Error('请输入邮箱'));
                // } else {
                //     callback();
                // }
                if (value === '') {
                    callback(new Error('请正确填写邮箱'));
                } else {
                    if (value !== '') {
                        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                        if(!reg.test(value)){
                            callback(new Error('请输入有效的邮箱'));
                        }
                    }
                    callback();
                }
            };

            return {
                ruleForm2: {
                    password: '',
                    checkPass: '',
                    username: '',
                    email:''
                },
                rules2: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    username: [
                        { validator: checkUsername, trigger: 'blur' }
                    ],
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            register:function () {
                if (this.ruleForm2.username === ""){

                    this.$message.error("未填写用户名")
                    return ;
                }
                if (this.ruleForm2.password === ""  || this.ruleForm2.checkPass === "" || (this.ruleForm2.password !== this.ruleForm2.checkPass)) {

                    this.$message.error("密码不一致!")
                    return;
                }
                if (this.ruleForm2.email === ""){

                    this.$message.error("未填写邮箱")
                    return ;
                }


                this.$axios.post("/auth/register/check", {
                    "username": this.ruleForm2.username,
                    "email":this.ruleForm2.email
                })
                    .then( res => {
                    if(res.data.code === 0) {

                        this.zhuce();
                    } else {
                        // alert(res.data.message)
                    }
                }).catch( res => {
                    console.log(res)
                })


            },
            zhuce(){

                this.$axios.post("/auth/register",{
                    username:this.ruleForm2.username,
                    password:this.ruleForm2.password,
                    email:this.ruleForm2.email
                })
                    .then((res)=>{

                        if (res.data.code === 0){

                            this.$message.success("注册成功");
                            this.$router.push("/")
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            }
        }
    }
</script>

<style scoped>

    .ui.menu:not(.vertical) .item>.button {
        position: relative;
        top: 0;
        margin: -.5em 5px;
        padding-bottom: .78571429em;
        padding-top: .78571429em;
        font-size: 1em;
    }

    .bbb {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: inline-block;
        background: url("../../../static/img/index/background.jpg")no-repeat;
        background-size: 100% 100%;
    }

    .ms-login{
        position: absolute;
        left:47%;
        top:50%;
        width:30%;
        height:58%;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }

    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

</style>
