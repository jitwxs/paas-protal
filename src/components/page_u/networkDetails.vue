<template>
    <div id="networkDetail">
        <el-form :label-position="labelPosition" label-width="80px" :model="networkInfo">
            <el-form-item label="名称">
                <p>{{networkInfo.name}}</p>
            </el-form-item>
            <el-form-item label="网络范围">
                <span >{{networkInfo.scope}}</span>
            </el-form-item>
            <el-form-item label="网络驱动">
                <p>{{networkInfo.driver}}</p>
            </el-form-item>
            <el-form-item label="是否内部">
                <p >{{networkInfo.hasInternal}}</p>
            </el-form-item>
            <el-form-item label="标签">
                <p >{{networkInfo.labels}}</p>
            </el-form-item>
            <el-form-item label="是否公开">
                <p >{{networkInfo.hasPublic}}</p>
            </el-form-item>
            <el-form-item label="创建时间">
                <p>{{networkInfo.createDate}}</p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "networkDetails",
        data(){
            return{
                labelPosition:'left',
                networkInfo:"",

            }
        },
        methods:{
            getNetworkInfo(){
                this.$axios.get('/network/'+this.networkId)
                    .then(response=>{
                        this.networkInfo = response.data.data;
                    }).catch(function (err) {
                    console.log(err);
                })
            }
        },
        computed:{
            ...mapGetters({
                networkId : 'getNetworkId',
            })
        },
        created(){
            this.getNetworkInfo();
        }
    }
</script>

<style scoped>
    #networkDetail{
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 670px;
    }
</style>
