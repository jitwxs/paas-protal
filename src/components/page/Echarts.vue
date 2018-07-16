<template>
    <div class="echarts">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>echarts图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div id="main" style="width: 300px;height:200px;"></div>
            <div id="main2" style="width: 300px;height:200px;"></div>
            <div id="main3" style="width: 300px;height:200px;"></div>
            <div id="main4" style="width: 300px;height:200px;"></div>
            <div id="main5" style="width: 300px;height:200px;"></div>
            <div id="main6" style="width: 300px;height:200px;"></div>
            <div id="main7" style="width: 300px;height:200px;"></div>
            <div id="main8" style="width: 300px;height:200px;"></div>
            <div id="main9" style="width: 300px;height:200px;"></div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "LogManage",
        data(){
            return{
                flag :0,
                data:[],
                data2:[],
                data3:[],
                data4:[],
                data5:[],
                data6:[],
                data7:[],
                data8:[],
                data9:[],

                content:[],
                option:{
                    title: {
                        text: 'rxbyte'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }
                    ],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [
                        {
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data
                        }
                    ]
                },
                option2:{
                    title: {
                        text: 'txbyte'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }
                    ],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [
                        {
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data2
                    }]
                },
                option3 : {
                    title: {
                        text: 'rxPackets'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data3
                    }]
                },
                option4 :{
                    title: {
                        text: 'txPackets'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data4
                    }]
                },
                option5:{
                    title: {
                        text: 'cpuUtilization'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data5
                    }]
                },
                option6 : {
                    title: {
                        text: 'memoryUsage'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data6
                    }]
                },
                option7 : {
                    title: {
                        text: 'memoryUtilization'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data7
                    }]
                },
                option8 :{
                    title: {
                        text: 'blockRead'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data8
                    }]
                },
                option9 :{
                    title: {
                        text: 'blockWrite'
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: false,
                            yAxisIndex: [0],
                            left: '96%',
                            bottom: '5%',
                            start: 0,
                            end: 100
                        }],
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: true
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        // showAllSymbol:true,
                        connectNulls: true,
                        hoverAnimation: false,
                        data: this.data9
                    }]
                },
            }
        },
        methods:{
            createEcharts:function () {
                // var echarts = require('echarts');
                let myChart = this.$echarts.init(document.getElementById('main'));
                let chart2 = this.$echarts.init(document.getElementById('main2'));
                let chart3 = this.$echarts.init(document.getElementById('main3'));
                let chart4 = this.$echarts.init(document.getElementById('main4'));
                let chart5 = this.$echarts.init(document.getElementById('main5'));
                let chart6 = this.$echarts.init(document.getElementById('main6'));
                let chart7 = this.$echarts.init(document.getElementById('main7'));
                let chart8 = this.$echarts.init(document.getElementById('main8'));
                let chart9 = this.$echarts.init(document.getElementById('main9'));

                this.$axios.get('/monitor/container/actual/fba35fda5b0f274ef5132a5ace51406871d18e4111a7755cb1d78c8c9a4fd6f2')
                    .then(response=>{
                        // console.log(response);
                        if(response.data.code == 0) {
                            this.content = response.data.data;
                            this.content = this.content.toString().replace("\\", "");
                            this.content = eval('[' + this.content + ']');

                            if (this.flag == 0) {
                                // console.log(this.content.length);
                                for (let i = 0; i < this.content.length; i++) {
                                    let date1 = new Date(this.content[i].timestamp);
                                    let timestamp1 = date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
                                    let rxbyte = this.content[i].rxBytes.toString();
                                    let txbyte = this.content[i].txBytes.toString();
                                    let rxPackets = this.content[i].rxPackets.toString();
                                    let txPackets = this.content[i].txPackets.toString();
                                    let cpuUtilization = this.content[i].cpuUtilization.toString();
                                    let memoryUsage = this.content[i].memoryUsage.toString();
                                    let memoryUtilization = this.content[i].memoryUtilization.toString();
                                    let blockRead = this.content[i].blockRead.toString();
                                    let blockWrite = this.content[i].blockWrite.toString();
                                    this.data.push(timestamp1, [timestamp1, rxbyte]);
                                    this.data2.push(timestamp1, [timestamp1, txbyte]);
                                    this.data3.push(timestamp1, [timestamp1, rxPackets]);
                                    this.data4.push(timestamp1, [timestamp1, txPackets]);
                                    this.data5.push(timestamp1, [timestamp1, cpuUtilization]);
                                    this.data6.push(timestamp1, [timestamp1, memoryUsage]);
                                    this.data7.push(timestamp1, [timestamp1, memoryUtilization]);
                                    this.data8.push(timestamp1, [timestamp1, blockRead]);
                                    this.data9.push(timestamp1, [timestamp1, blockWrite]);
                                }
                            } else {
                                let date2 = new Date(this.content[this.content.length - 1].timestamp);
                                let timestamp2 = date2.toLocaleDateString().replace(/\//g, "-") + " " + date2.toTimeString().substr(0, 8);
                                let rxbyte2 = this.content[this.content.length - 1].rxBytes.toString();
                                let txbyte2 = this.content[this.content.length - 1].txBytes.toString();
                                let rxPackets2 = this.content[this.content.length - 1].rxPackets.toString();
                                let txPackets2 = this.content[this.content.length - 1].txPackets.toString();
                                let cpuUtilization2 = this.content[this.content.length - 1].cpuUtilization.toString();
                                let memoryUsage2 = this.content[this.content.length - 1].memoryUsage.toString();
                                let memoryUtilization2 = this.content[this.content.length - 1].memoryUtilization.toString();
                                let blockRead2 = this.content[this.content.length - 1].blockRead.toString();
                                let blockWrite2 = this.content[this.content.length - 1].blockWrite.toString();
                                // data.shift();
                                // data2.shift();
                                // data3.shift();
                                // data4.shift();
                                // data5.shift();
                                // data6.shift();
                                // data7.shift();
                                // data8.shift();
                                // data9.shift();
                                this.data.push(timestamp2, [timestamp2, rxbyte2]);
                                this.data2.push(timestamp2, [timestamp2, txbyte2]);
                                this.data3.push(timestamp2, [timestamp2, rxPackets2]);
                                this.data4.push(timestamp2, [timestamp2, txPackets2]);
                                this.data5.push(timestamp2, [timestamp2, cpuUtilization2]);
                                this.data6.push(timestamp2, [timestamp2, memoryUsage2]);
                                this.data7.push(timestamp2, [timestamp2, memoryUtilization2]);
                                this.data8.push(timestamp2, [timestamp2, blockRead2]);
                                this.data9.push(timestamp2, [timestamp2, blockWrite2]);
                            }
                            this.flag++;

                            myChart.setOption({
                                series: [{
                                    data: this.data
                                }]
                            });
                            chart2.setOption({
                                series: [{
                                    data: this.data2
                                }]
                            });
                            chart3.setOption({
                                series: [{
                                    data: this.data3
                                }]
                            });
                            chart4.setOption({
                                series: [{
                                    data: this.data4
                                }]
                            });
                            chart5.setOption({
                                series: [{
                                    data: this.data5
                                }]
                            });
                            chart6.setOption({
                                series: [{
                                    data: this.data6
                                }]
                            });
                            chart7.setOption({
                                series: [{
                                    data: this.data7
                                }]
                            });
                            chart8.setOption({
                                series: [{
                                    data: this.data8
                                }]
                            });
                            chart9.setOption({
                                series: [{
                                    data: this.data9
                                }]
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

                var that = this;
                setInterval(function () {
                    that.$axios.get('/monitor/container/actual/fba35fda5b0f274ef5132a5ace51406871d18e4111a7755cb1d78c8c9a4fd6f2')
                        .then(response=>{
                            // console.log(response);
                            if(response.data.code == 0){
                                that.content = response.data.data;
                                that.content = that.content.toString().replace("\\", "");
                                that.content = eval('[' + that.content + ']');

                                if(that.flag == 0){
                                    // console.log(that.content.length);
                                    for (let i = 0; i < that.content.length; i++) {
                                        let date1 = new Date(that.content[i].timestamp);
                                        let timestamp1 = date1.toLocaleDateString().replace(/\//g, "-") + " " + date1.toTimeString().substr(0, 8);
                                        let rxbyte = that.content[i].rxBytes.toString();
                                        let txbyte = that.content[i].txBytes.toString();
                                        let rxPackets = that.content[i].rxPackets.toString();
                                        let txPackets = that.content[i].txPackets.toString();
                                        let cpuUtilization = that.content[i].cpuUtilization.toString();
                                        let memoryUsage = that.content[i].memoryUsage.toString();
                                        let memoryUtilization = that.content[i].memoryUtilization.toString();
                                        let blockRead = that.content[i].blockRead.toString();
                                        let blockWrite = that.content[i].blockWrite.toString();
                                        that.data.push(timestamp1,[timestamp1, rxbyte]);
                                        that.data2.push(timestamp1,[timestamp1, txbyte]);
                                        that.data3.push(timestamp1,[timestamp1, rxPackets]);
                                        that.data4.push(timestamp1,[timestamp1, txPackets]);
                                        that.data5.push(timestamp1,[timestamp1, cpuUtilization]);
                                        that.data6.push(timestamp1,[timestamp1, memoryUsage]);
                                        that.data7.push(timestamp1,[timestamp1, memoryUtilization]);
                                        that.data8.push(timestamp1,[timestamp1, blockRead]);
                                        that.data9.push(timestamp1,[timestamp1, blockWrite]);
                                    }
                                }else {
                                    let date2 = new Date(that.content[that.content.length-1].timestamp);
                                    let timestamp2 = date2.toLocaleDateString().replace(/\//g, "-") + " " + date2.toTimeString().substr(0, 8);
                                    let rxbyte2 = that.content[that.content.length-1].rxBytes.toString();
                                    let txbyte2 = that.content[that.content.length-1].txBytes.toString();
                                    let rxPackets2 = that.content[that.content.length-1].rxPackets.toString();
                                    let txPackets2= that.content[that.content.length-1].txPackets.toString();
                                    let cpuUtilization2 = that.content[that.content.length-1].cpuUtilization.toString();
                                    let memoryUsage2 = that.content[that.content.length-1].memoryUsage.toString();
                                    let memoryUtilization2 = that.content[that.content.length-1].memoryUtilization.toString();
                                    let blockRead2 = that.content[that.content.length-1].blockRead.toString();
                                    let blockWrite2 = that.content[that.content.length-1].blockWrite.toString();
                                    // data.shift();
                                    // data2.shift();
                                    // data3.shift();
                                    // data4.shift();
                                    // data5.shift();
                                    // data6.shift();
                                    // data7.shift();
                                    // data8.shift();
                                    // data9.shift();
                                    that.data.push(timestamp2, [timestamp2, rxbyte2]);
                                    that.data2.push(timestamp2, [timestamp2, txbyte2]);
                                    that.data3.push(timestamp2, [timestamp2, rxPackets2]);
                                    that.data4.push(timestamp2, [timestamp2, txPackets2]);
                                    that.data5.push(timestamp2, [timestamp2, cpuUtilization2]);
                                    that.data6.push(timestamp2, [timestamp2, memoryUsage2]);
                                    that.data7.push(timestamp2, [timestamp2, memoryUtilization2]);
                                    that.data8.push(timestamp2, [timestamp2, blockRead2]);
                                    that.data9.push(timestamp2, [timestamp2, blockWrite2]);
                                }
                                that.flag++;
                                myChart.setOption({
                                    series: [{
                                        data: that.data
                                    }]
                                });
                                chart2.setOption({
                                    series: [{
                                        data: that.data2
                                    }]
                                });
                                chart3.setOption({
                                    series: [{
                                        data: that.data3
                                    }]
                                });
                                chart4.setOption({
                                    series: [{
                                        data: that.data4
                                    }]
                                });
                                chart5.setOption({
                                    series: [{
                                        data: that.data5
                                    }]
                                });
                                chart6.setOption({
                                    series: [{
                                        data: that.data6
                                    }]
                                });
                                chart7.setOption({
                                    series: [{
                                        data: that.data7
                                    }]
                                });
                                chart8.setOption({
                                    series: [{
                                        data: that.data8
                                    }]
                                });
                                chart9.setOption({
                                    series: [{
                                        data: that.data9
                                    }]
                                });
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                },10000);
                myChart.setOption(this.option);
                chart2.setOption(this.option2);
                chart3.setOption(this.option3);
                chart4.setOption(this.option4);
                chart5.setOption(this.option5);
                chart6.setOption(this.option6);
                chart7.setOption(this.option7);
                chart8.setOption(this.option8);
                chart9.setOption(this.option9);
            },
        },
        mounted(){
            // this.createEcharts();
        }
    }
</script>

<style scoped>

</style>
