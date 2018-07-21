<template>
    <div id="serviceDetail">
    <el-tabs v-model="activeName">
        <el-tab-pane label="服务详情" name="first">
            <div>
                <div id="editor" class="json-editor"></div>
                <pre id="json"></pre>
            </div>
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
                activeName:'first',
            }
        },
        methods:{
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
    #serviceDetail{
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 400px;
    }
</style>
