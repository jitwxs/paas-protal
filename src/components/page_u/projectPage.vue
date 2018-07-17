<template>
  <div id="main">
    <!--创建项目-->
    <el-button type="primary" icon="el-icon-plus"  @click="createProjectDialog = true" id="createProjectbtn">创建项目</el-button>
    <!--创建项目模态框-->
    <el-dialog title="创建项目" :visible.sync="createProjectDialog" center>
      <el-form :model="project">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="project.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth">
          <el-input v-model="project.description" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreate">取 消</el-button>
        <el-button type="primary" @click="submitCreateProject">确 定</el-button>
      </div>
    </el-dialog>

    <!--项目列表-->
    <el-table
      :data="projectList"
      style="width: 85%;margin: 10px auto;"
    >
      <el-table-column
        label="项目名称"
        >
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
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
            type="success"
            @click="inertDetail(scope.row.id)">进入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--更新项目模态框-->
    <el-dialog title="更新项目" :visible.sync="updateProjectDiolog" center>
      <el-form :model="updateProjectForm">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="updateProjectForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth">
          <el-input v-model="updateProjectForm.description" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateProjectDiolog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateProject">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      background
      layout="total, prev, pager, next,jumper"
      :total="total"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      v-if="this.total>10"
      id="pagination"
    >
    </el-pagination>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        projectList:[],
        createProjectDialog:false,
        project:{
          name:'',
          description:''
        },
        updateProjectDiolog:false,
        formLabelWidth:'120px',
        updateProjectForm:{
          name:'',
          description:'',
          id:''
        },
        currentPage:1,
        pageSize:10,
        total:0
      }
    },

    computed:{
      ...mapGetters({
        userInfo:'getUserInfo'
      }),
    },
    methods:{
      //取消创建
      cancelCreate(){
        this.createProjectDialog = false;
        this.project.name=''
        this.project.description=''
      },
      //创建项目
      submitCreateProject(){

        if (this.project.name ==''){

          this.$message.warning("请输入项目名称")
          return;
        }
        if (this.project.description == '') {
          this.$message.warning("请输入项目描述")
          return;
        }

        this.$axios.post('/project/create',{
          "name":this.project.name,
          "description":this.project.description
        })
          .then(res =>{
            if (res.data.code == 0) {
              this.$message.success("创建成功");

              this.project.name = '';
              this.project.description = '';
              this.createProjectDialog = false;
              this.getProjectList(this.currentPage,this.pageSize);
            } else {
              this.$message.error("创建失败，请重新尝试");
            }
          })
          .catch(err =>{
            console.log(err)
          })
        this.createProjectDialog = false;
      },
      //获取项目列表
      getProjectList(current,size){
        //获取项目信息列表
        this.$axios.get("/project/self/list?current="+current + "&size="+size)
          .then(res=>{
            if (res.data.code == 0) {
              this.projectList = res.data.data.records;
              this.total = res.data.data.total;
              // console.log(this.projectList)
            }
          })
          .catch(err =>{
            console.log(err)
          })
      },
      updateProject(id,name,disc){
        this.updateProjectForm.name = name;
        this.updateProjectForm.id = id;
        this.updateProjectForm.description = disc;
        this.updateProjectDiolog = true;


      },
      submitUpdateProject(){
        this.$axios.put("/project/update",{
          id:this.updateProjectForm.id,
          name:this.updateProjectForm.name,
          description:this.updateProjectForm.description
        })
          .then(res=>{
            if (res.data.code == 0) {
              this.$message.success("更新成功");
              this.getProjectList(this.currentPage,this.pageSize);
            }
            this.project.id = this.project.name = this.project.description = '';
            this.updateProjectDiolog = false;
          })
          .catch(err =>{
            console.log(err)
          })
      },
      deleteProject(id) {

        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$axios.delete("/project/delete/"+id)
              .then(res =>{
                if (res.data.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getProjectList(this.currentPage,this.pageSize);
                }
              })
              .catch( err =>{
                console.log(err)
              })
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val ;
        this.getProjectList(this.currentPage,this.pageSize)
      },
      //进入项目
      inertDetail(id) {

          console.log("project"+id)
        this.$store.dispatch('setProjectId',id);
        this.$router.push('/projectContainer')
      }
    },
    created(){
      this.getProjectList(1,10);
    }
  }
</script>

<style scoped>
#main{
  padding: 30px;
  box-shadow: 0 0 5px #f1f1f1;
}
  #createProjectbtn{
    margin-left: 100px;
    margin-bottom: 30px;
  }
  #pagination{
    margin-top: 30px;
    float: right;
    margin-right: 150px;
  }
</style>
