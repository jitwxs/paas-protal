<template>
    <div id="history">
      <div id="editor" class="json-editor"></div>
      <pre id="json"></pre>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import '../../../../static/tree/jsoneditor'
export default {
    name: 'history',
    data(){
        return {}
    },
  methods:{
      getMirrorHistory:function () {
        this.$axios.get('/image/history/' + this.mirrorId)
          .then(response => {
            if (response.data.code === 0){
              var json = response.data.data;
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
      },
  },
  mounted(){
    this.getMirrorHistory();
  },
  computed:{
    ...mapGetters({
      mirrorId: 'getCurrentMirrorId'
    }),
  }
}
</script>

<style>

</style>
