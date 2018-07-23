<template>
    <div class="container">
        <el-form :label-position="labelPosition" label-width="160px" :model="network">
            <el-form-item label="网络名">
                <el-input v-model="network.name" style="width: 50%"></el-input>
            </el-form-item>
            <el-form-item label="网络驱动">
                <el-input v-model="network.driver" style="width: 50%"></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <el-button @click="add">添加</el-button>
            </el-form-item>
            <el-form-item
                v-for="(labelsItem, index) in network.labels"
                :label="'标签' + index"
                :key="labelsItem.key"
                :prop="'labels.' + index + '.value'"
            >
                <el-col :span="6">
                    <div>
                        <span style="float: left">key：</span>
                        <el-input v-model="labelsItem.aa" style="width:200px;" >
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div>
                        <span style="float: left">value：</span>
                        <el-input v-model="labelsItem.bb" style="width:200px;">
                        </el-input>
                    </div>
                </el-col>

                <el-col :span="3" > <el-button @click.prevent="del(labelsItem)" >删除</el-button></el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createNetwork">立即创建</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "createService",
        data() {
            return {
                labelPosition: 'left',
                network: {
                    name: '',
                    driver: '',
                    label: '',
                    labels: [{aa: '', bb: ''}],
                },
            }
        },
        methods: {
            //添加
            add() {
                this.network.labels.push({aa: '', bb: ''})
            },
            //删除某个
            del(item) {
                let index = this.network.labels.indexOf(item)
                if (index !== -1) {
                    this.network.labels.splice(index, 1)
                }
            },

            back(){
                this.$router.push('/netWork');
            },

            createNetwork() {
                if (this.network.name == "" || this.network.driver == "") {
                    this.$message.error("请检查网络名称和驱动是否填写")
                } else {

                    // 判断填写
                    if (this.network.labels.length>0){
                        for (var i=0;i<this.network.labels.length;i++) {
                            if (this.network.labels[i].aa == "" || this.network.labels[i].bb == "") {
                                this.$message.error("标签"+i +"未填写");
                                return;
                            }
                        }
                    }
                    let labelsMap={};
                    this.network.labels.forEach((item, index) => {
                        let key = item.aa.toString();
                        labelsMap[key] = item.bb
                    });

                    console.log(labelsMap);

                    this.$axios.post('/network/self/create', {
                        name: this.network.name,
                        driver: this.network.driver,
                        labels: JSON.stringify(labelsMap),
                    })
                        .then(response => {
                            console.log(response);
                            if (response.data.code == 0) {
                                this.$message.success({
                                    message: response.data.message,
                                    showClose: true
                                });
                                this.$router.push('/netWork');
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
            }
        }
    }
</script>

<style scoped>

</style>
