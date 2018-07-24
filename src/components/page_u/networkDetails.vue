<template>
    <div id="networkDetail">
        <el-form :label-position="labelPosition" label-width="80px" :model="networkInfo">
            <el-form-item label="名称">
                <span>{{networkInfo.name}}</span>
            </el-form-item>
            <el-form-item label="网络范围">
                <span >{{networkInfo.scope}}</span>
            </el-form-item>
            <el-form-item label="网络驱动">
                <span>{{networkInfo.driver}}</span>
            </el-form-item>
            <el-form-item label="是否内部">
                <span>{{networkInfo.hasInternal}}</span>
            </el-form-item>
            <el-form-item label="标签">
                <span>{{networkInfo.labels}}</span>
            </el-form-item>
            <el-form-item label="是否公开">
                <span>{{networkInfo.hasPublic}}</span>
            </el-form-item>
            <el-form-item label="创建时间">
                <span>{{networkInfo.createDate}}</span>
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
