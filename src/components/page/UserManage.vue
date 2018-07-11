<template>
    <div class="usermanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="hasFreeze" placeholder="冻结状态" class="handle-select mr10">
                    <el-option key="1" label="已冻结" value="冻结"></el-option>
                    <el-option key="2" label="未冻结" value="未冻结"></el-option>
                </el-select>
                <el-input v-model="select_username" placeholder="输入用户名" class="handle-input mr10"></el-input>
                <el-input v-model="select_email" placeholder="输入用户邮箱" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search" >搜索</el-button>
            </div>
            <el-table :data="peopleInfo" border style="width: 100%" ref="peopleInfo">
                <el-table-column prop="createDate" label="注册日期"  width="180">
                </el-table-column>
                <el-table-column prop="id" label="用户id" width="165">
                </el-table-column>
                <el-table-column prop="roleId" label="角色id" width="165">
                </el-table-column>
                <el-table-column prop="username" label="用户账号" width="165">
                </el-table-column>
                <el-table-column prop="email" label="用户邮箱" width="180">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <router-link style=" text-decoration: none;" :to="{path:'/usertoproject', query:{id:scope.row.id}} ">
                        <el-button
                            size="small"
                            type="primary"
                            style=";font-family: 微软雅黑;font-size: 14px;color: white "
                           >项目</el-button>
                        </router-link>
                        <el-button
                            v-show="scope.row.hasFreeze"
                            size="small"
                            type="danger"
                            style=";font-family: 微软雅黑;font-size: 14px;color: white "
                            @click="freeze(scope.$index, scope.row)">冻结</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>

            <div>
                <h2>产品列表</h2>
                <ul>
                    <li v-for="product in saleProducts">
                        <span>{{product.name}}</span>
                        <span>{{product.price}}</span>
                    </li>
                </ul>
                <el-button @click="reducePrice(4)"></el-button>
            </div>



        </div>

    </div>
</template>

<script>
    export default {
        computed:{
            products(){
                return this.$store.state.products;
            },
            saleProducts(){
                return this.$store.getters.saleProducts;
            }
        },
        name: 'UserManage',
        data() {
            return {
                // 分页当前页码
                currentPage:1,
                // 分页总条数
                totalCount:0,
                // 搜索用户输入的筛选信息
                hasFreeze: '',
                select_username: '',
                select_email:'',
                // 用户信息展示区域
                peopleInfo: [],
                // 用户id
                userId:''
            }
        },

        methods: {
            reducePrice:function(amount){
              // this.$store.commit('reducePrice');
              this.$store.dispatch('reducePrice', amount);
            },
            // 获取用户信息列表
            getPeopleInfo:function () {
                this.$axios.get('/user/list'+ '?current=1' + "&size=5")
                    .then(response=>{
                        console.log(response)

                        if (response.data.code == 0){
                            this.peopleInfo = response.data.data.records;
                            this.totalCount = response.data.data.total;
                            console.log(this.totalCount)
                        }else {
                            this.$message.error({
                                message:"获取用户信息失败！",
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 根据用户选择获取用户信息
            search:function(){
                this.$axios.get('/user/list'+ "?username=" +  this.select_username + "&email=" + this.select_email  + "&hasFreeze=" + this.hasFreeze + "&current=" + this.currentPage + "&size=5")
                    .then(response=>{
                        this.peopleInfo = response.data.data.records;
                        this.totalCount = response.data.data.total;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },

            // 实现冻结功能
            freeze:function (index,row) {
                this.$axios.post('/user/freeze',{
                    "ids": row.id
                })
                    .then(response=>{
                        console.log(response)
                        if(response.data.code == 0){
                            row.hasFreeze = !row.hasFreeze;
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },

            // 实现分页功能
            handleCurrentChange:function (val) {
                console.log(val);
                this.$axios.get('/user/list' + '?current=' + val + "&size=5")
                    .then(response=>{
                        console.log(response)
                        this.peopleInfo = response.data.data.records;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created(){
            this.getPeopleInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

</style>
