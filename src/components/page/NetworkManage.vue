<template>
    <div class="networkmanage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-phone-outline"></i>网络管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--输入关键词搜索部分-->
            <div class="handle-box">
                <el-select v-model="select_hasPublic" placeholder="选择网络性质" class="handle-select mr10" >
                    <el-option key="0" label="所有网络" value=""></el-option>
                    <el-option key="1" label="公共网络" value=true></el-option>
                    <el-option key="2" label="非公共网络" value=false></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" style="float: right" @click="syncNetwork">同步
                </el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" style="float: right" @click="handleCreate">
                    创建
                </el-button>
            </div>

            <!--用户信息展示部分-->
            <el-table
                :data="netWorkInfo"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column prop="name" label="网络名称">
                </el-table-column>
                <el-table-column prop="scope" label="覆盖范围">
                </el-table-column>
                <el-table-column prop="driver" label="驱动">
                </el-table-column>
                <el-table-column prop="hasPublic" label="网络性质">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <p style="float: left;margin-left: 5px;cursor: pointer"><i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i> </p>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>

            <!--创建网络信息的模态框-->
            <div class="networkForm">
                <el-dialog title="创建网络" :visible.sync="networkFormVisible">
                    <el-form :model="networkForm">
                        <el-form-item label="网络名称" :label-width="formLabelWidth" :rules="{
                             required: true, message: '网络名称不能为空', trigger: 'blur' }">
                            <el-input v-model="networkForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网络驱动" :label-width="formLabelWidth" :rules="{
                             required: true, message: '网络驱动不能为空', trigger: 'blur' }">
                            <el-input v-model="networkForm.driver" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网络标签"  :label-width="formLabelWidth">
                            <el-button @click="add()">添加</el-button>
                        </el-form-item>
                        <el-form-item
                            v-for="(labelsItem, index) in networkForm.labels"
                            :label="'标签' + index"
                            :key="labelsItem.key"
                            :prop="'labels.' + index + '.value'"
                            :label-width="formLabelWidth"
                        >
                            <el-col :span="6">
                                <div>
                                    <span style="float: left">key：</span>
                                    <el-input v-model="labelsItem.aa" style="width:150px;" >
                                    </el-input>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <span style="float: left">value：</span>
                                    <el-input v-model="labelsItem.bb" style="width:150px;">
                                    </el-input>
                                </div>
                            </el-col>

                            <el-col :span="3" > <el-button @click.prevent="del(labelsItem)" >删除</el-button></el-col>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="createNetwork">确 定</el-button>
                    </div>
                </el-dialog>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "NetworkManage",
        data() {
            return {
                // 搜索网络输入的名称
                select_hasPublic: '',
                // 网络列表信息
                netWorkInfo: [],
                // 分页属性
                currentPage: 1,
                totalCount: 0,
                // 创建网络发送的信息
                networkForm: {
                    name: '',
                    driver: '',
                    hasIpv6: '',
                    labels:[{aa:'',bb:''}]
                },
                networkFormVisible: false,
                formLabelWidth: '120px'
            }
        },
        methods: {
            //增加标签
            add(){

                this.networkForm.labels.push({aa:'',bb:''});
            },
            //删除标签
            del(item){
                let index = this.networkForm.labels.indexOf(item);
                if (index !== -1) {
                    this.networkForm.labels.splice(index, 1)
                }
            },
            formatNetworkData: function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].hasPublic) {
                        data[i].hasPublic = '公共网络'
                    } else {
                        data[i].hasPublic = '非公共网络'
                    }
                    if (data[i].hasIpv6) {
                        data[i].hasIpv6 = '是'
                    } else {
                        data[i].hasIpv6 = '否'
                    }
                }
                return data;
            },
            // 获取网络列表信息
            getNetworkInfo: function () {
                this.$axios.get('/network/listAll' + "?current=" + this.currentPage + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.netWorkInfo = this.formatNetworkData(response.data.data.records);
                            this.totalCount = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "获取网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 搜索网络名称
            search: function f() {
                this.$axios.get('/network/listAll' + "?hasPublic=" + this.select_hasPublic + "&current=" + this.currentPage + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.netWorkInfo = this.formatNetworkData(response.data.data.records);
                            this.totalCount = response.data.data.total;
                        } else {
                            this.$message.error({
                                message: "获取网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 同步网络信息
            syncNetwork: function () {
                this.$axios.get('/network/sync')
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "同步网络信息成功！",
                                showClose: true
                            })
                        } else {
                            this.$message.error({
                                message: "同步网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 点击创建按钮
            handleCreate: function () {
                this.networkFormVisible = true;
            },
            // 创建网络信息
            createNetwork: function () {
                this.networkFormVisible = false;

                this.networkForm.labels.forEach((item,index)=>{

                    if (item.aa ==="" ||item.bb === "") {
                        this.$message.warning("标签"+index+"未填写完成");
                        this.networkFormVisible = true;
                    }
                });
                let labelsMap = {};
                this.networkForm.labels.forEach((item, index) => {
                    let key = item.aa.toString();
                    labelsMap[key] = item.bb
                });
                this.$axios.post('/network/public/create', {
                    name: this.networkForm.name,
                    driver: this.networkForm.driver,
                    labelsStr: JSON.stringify(labelsMap)
                })
                    .then(response => {
                        if (response.data.code === 0) {
                            this.$message.success({
                                message: "创建网络信息成功！",
                                showClose: true
                            });
                            this.getNetworkInfo();
                        } else {
                            this.$message.error({
                                message: "创建网络信息失败！",
                                showClose: true
                            })
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            },
            // 删除网络信息
            handleDelete: function (index, row) {
                this.$confirm('确定要删除该网络?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/network/delete/' + row.id)
                        .then(response => {
                            if (response.data.code === 0) {
                                this.$message.success("删除网络信息成功！")
                            } else {
                                this.$message.error(response.data.message)
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }).catch(() => {

                });


            },
            // 分页
            handleCurrentChange: function (val) {
                this.$axios.get('/network/listAll' + "?current=" + val + "&size=5")
                    .then(response => {
                        if (response.data.code === 0) {
                            this.netWorkInfo = this.formatNetworkData(response.data.data.records);
                        } else {
                            this.$message.error({
                                message: "获取网络信息失败！",
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
            this.getNetworkInfo();
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 150px;
    }

    .handle-input {
        width: 150px;
        display: inline-block;
    }

</style>
