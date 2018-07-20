<template>
    <!--<div>-->
        <iframe frameborder=0 width="100%" height="750px" :src="frameUrl"></iframe>
    <!--</div>-->
</template>

<script>
    export default {
        name: "Potainer",
        data() {
          return {
              frameUrl:""
          }
        },
        methods: {
            getUrl() {
                this.$axios.get('/monitor/portainer')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.frameUrl = response.data.data;
                        } else {
                            this.$message.error({
                                message: "读取数据失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }
        },
        mounted() {
            this.getUrl();
        }
    }
</script>

<style scoped>

</style>
