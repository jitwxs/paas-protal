<template>
  <div id="mai">

    <!--项目列表-->
    <el-table
      :data="containerList"
      style="width: 85%;margin: 10px auto;"
    >
      <el-table-column
        label="项目名称"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.projectName }}</p>
        </template>
      </el-table-column>

      <el-table-column
        label="项目描述"
      >
        <template slot-scope="scope">

          <span> {{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="updateProject(scope.row.id, scope.row.name,scope.row.description)">更新</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteProject(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        containerList:[],
        currentPage:1,
        pageSize:10,
        total:0
      }
    },
    methods:{

      getContainerList(){

        this.$axios.get("/container/list/")
          .then((res) =>{
            if (res.data.ceode ==0) {
              this.total = res.data.data.total;
              this.containerList = res.data.data.records;
            }
          })
          .catch((err) =>{
            console.log(err);
          })
      }
    },
    created(){

      this.getContainerList();
    }
  }
</script>

<style scoped>
  #main{
    padding: 30px;
    box-shadow: 0 0 5px #f1f1f1;
  }
</style>
