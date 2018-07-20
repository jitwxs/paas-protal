<template>
    <div class="container">
    <el-tabs v-model="activeName">
        <el-tab-pane label="服务详情" name="first">
            <div>
                <pre id="Service">
                </pre>
            </div>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "serviceDetails",
        data(){
            return{
                activeName:'first',
            }
        },
        methods:{
            getServiceInfo(){
                this.$axios.get('/service/inspect/'+ this.serviceId)
                    .then(response=>{
                        // console.log(response.data.data);
                        $("#Service").html(JSON.stringify(response.data.data, null, 4));
                    }).catch(function (err) {
                    console.log(err)
                })
            },



        },
        computed:{
            ...mapGetters({
                serviceId:'getServiceId'
            })
        },
        created(){
            this.getServiceInfo();
        }
    }
</script>

<style scoped>

</style>
