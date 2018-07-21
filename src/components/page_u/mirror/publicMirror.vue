<template>
    <div id="mirror">
        <!--公共镜像列表-->
        <el-table
            :data="mirrors"
            style="width: 100%;margin-top: 20px;">
            <el-table-column
                label="名称">
                <template slot-scope="scope">
                    <span @click="handleView(scope.$index, scope.row)" style="cursor:pointer;">{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="标签"
                prop="tag">
            </el-table-column>

            <el-table-column
                label="镜像大小"
                prop="size">
            </el-table-column>

            <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleExport(scope.$index, scope.row)">导出</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="text-align: center;float: right;margin-right: 40px;margin-top: 30px;margin-bottom: 15px">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                @size-change="handleSizeChange"
                :page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total,sizes,prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <br/><br/>
    </div>
</template>

<script>
    export default {
        name: "publicMirror",
        data(){
            return{
                mirrors:[],
                currentPage:1,
                pageSize:10,
                totalCount:0,
            }
        },
        methods:{
            getLocalImage(){
                this.$axios.get('/image/list/local?type=1&current='+this.currentPage+'&size='+this.pageSize)
                    .then(response=>{
                        this.mirrors = response.data.data.records;

                        for (var i=0;i<this.mirrors.length;i++){
                            this.mirrors[i].size = bitConvert(this.mirrors[i].size)
                        }
                        this.totalCount = response.data.data.total;
                    }).catch(function (err) {
                    console.log(err);
                })
            },

            // 分页函数
            handleCurrentChange:function (val) {
                if (val == null) {
                    return;
                }
                this.currentPage = val;
                this.getLocalImage();
            },
            //分页大小
            handleSizeChange(val){
                this.currentPage = 1;
                this.pageSize = val;
                this.getLocalImage();
            },

            //    导出镜像
            handleExport:function (index, row) {
                this.$axios.get("/image/export/" + row.id)
                    .then(response => {
                        if (response.data.code == 0) {
                            this.$message.success({
                                message: response.data.message,
                                showClose: true
                            });
                            window.open(response.data.data);
                        }else {
                            this.$message.error({
                                message:response.data.message,
                                showClose:true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            },
        },
        created(){
            this.getLocalImage();
        }
    }
</script>

<style scoped>
    #mirror{
        padding: 50px;
        margin: 20px;
        box-shadow: 3px 3px 10px #dddddd;
        background-color: white;
        border-radius: 15px;
        min-height: 400px;
    }
</style>
