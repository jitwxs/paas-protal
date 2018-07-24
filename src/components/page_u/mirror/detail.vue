<template>
    <div id="detail">
        <label v-if="interface != ''" style="margin-left: 30px">镜像的暴露接口为:<el-tag>{{interface}}</el-tag></label>
        <label v-else style="margin-left: 30px">该镜像暂时没有任何暴露接口</label>
        <div id="editor" class="json-editor"></div>
        <pre id="json"></pre>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import '../../../../static/tree/jsoneditor'

    export default {
        name: 'detail',
        data() {
            return {
                interface: ''
            }
        },
        methods: {
            //    获取镜像暴露接口
            getMirrorInterface: function () {
                this.$axios.get("/image/" + this.mirrorId + "/exportPort")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.interface = response.data.data.join(",")
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
//    获取镜像详情
            getMirrorDetail: function () {
                this.$axios.get("/image/inspect/" + this.mirrorId)
                    .then(response => {
                        if (response.data.code === 0) {
                            var json = response.data.data;
                            $('#editor').jsonEditor(json, {
                                change: function () {
                                    $('#json').html(JSON.stringify(json));
                                }
                            });
                        } else {
                            this.$message.error({
                                message: response.data.message,
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        created() {
            console.log(1);
            this.getMirrorDetail();
            this.getMirrorInterface();
        },
        mounted() {

        },
        computed: {
            ...mapGetters({
                mirrorId: 'getCurrentMirrorId'
            }),
        }
    }
</script>

<style scoped>

</style>
