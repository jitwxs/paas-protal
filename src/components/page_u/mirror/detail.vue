<template>
    <div id="detail">
      <label v-if="interface != ''" style="margin-left: 30px">镜像的暴露接口为:{{interface}}</label>
      <label v-else style="margin-left: 30px">该镜像暂时没有任何暴露接口</label>
      <div id="editor" class="json-editor"></div>
      <pre id="json"></pre>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
export default {
    name: 'detail',
    data(){
      return {
        interface:''
      }
    },
  methods:{
    //    获取镜像暴露接口
    getMirrorInterface:function () {
        this.$axios.get("/image/" + this.mirrorId  + "/exportPort")
        .then(response => {
          console.log(response)
          if (response.data.code == 0){
            this.$message.success({
              message:response.data.message,
              showClose:true
            });
            this.interface = response.data.data.join(",")
          } else {
            this.$message.error({
              message:response.data.message,
              showClose:true
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
//    获取镜像详情
      getMirrorDetail:function () {
        this.$axios.get("/image/inspect/" + this.mirrorId)
          .then(response => {
            console.log(response)
            if (response.data.code == 0){
              this.$message.success({
                message:response.data.message,
                showClose:true
              });
              var json = response.data.data;
              // var json = this.$jsonEditor(json, { change: function() {
              //         $('#json').html(JSON.stringify(json))}});
              //   $('#editor').html(json)
                $('#editor').jsonEditor(json, { change: function() {
                $('#json').html(JSON.stringify(json));
              } });
            } else {
              this.$message.error({
                message:response.data.message,
                showClose:true
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
  },
  created(){
      console.log(1);
      this.getMirrorDetail();
      this.getMirrorInterface();
      // const s = document.createElement('script');
      // s.type = 'text/javascript';
      // s.src = '/static/tree/jsoneditor.js';
      // document.body.appendChild(s);
  },
  mounted(){

  },
  computed:{
    ...mapGetters({
      mirrorId: 'getCurrentMirrorId'
    }),
  }
}
</script>

<style scoped>

</style>
