<template>
    <div id="mirrorDetail">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="镜像详情" name="first"></el-tab-pane>
        <el-tab-pane label="查看History" name="second"></el-tab-pane>
      </el-tabs>

      <div>
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
export default {
  name: 'mirrorDetail',
  data(){
    return {
      activeName:'first',
    }
  },
  methods:{
    handleClick(tab, event) {
      if (tab.index === '0'){
        this.$router.push({path:'/mirrorDetail/detail'})
      } else if (tab.index === '1'){
        this.$router.push({path:'/mirrorDetail/history'})
      }  else if (tab.index === '2'){
        this.$router.push({path:'/mirrorDetail/interface'})
      }
    }
  },
  created(){

  }
}
</script>

<style>

</style>
