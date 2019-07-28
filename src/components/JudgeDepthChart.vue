<template>
    <div :id="id" :style="style"></div>
</template>
<script>
export default {
    name: "",
    data() {
        return {
            //echarts实例
            chart: "",
            initOption:{
                            title: {
                                text: '深度—时间变化图',
                                textStyle:{
                                    fontFamily:'Microsoft YaHei',
                                    fontWeight:'normal',
                                    fontSize:16,
                                    color:"rgba(255,255,255,0.8)"
                                },
                                left: 'center',
                                top:'4%'
                            },
                            tooltip: {
                                trigger: 'axis',
                                padding:[5,10],
                                axisPointer: {
                                    lineStyle: {
                                        color: '#57617B'
                                    }
                                },
                                formatter: '{b}</br>depth:{c}m',
                                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
                                
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                color:'rgba(255,255,255,0.8)',
                                axisLine: {
                                    lineStyle: {
                                        color: 'rgba(255,255,255,0.8)'
                                    }
                                },
                                axisLabel:{
                                    interval:10,
                                    formatter:function(value,index){
                                        return value.split('.')[0]
                                    }
                                },
                                data:[]
                            },
                            yAxis: [{
                                type: 'value',
                                axisTick: {
                                    show: false
                                },
                                color: 'rgba(255,255,255,0.8)',
                                axisLine: {
                                    lineStyle: {
                                        color: 'rgba(255,255,255,0.8)'
                                    }
                                },
                                axisLabel: {
                                    margin: 10,
                                    textStyle: {
                                        fontSize: 14
                                    }
                                },
                                lineStyle: {
                                    color: '#57617B'
                                },
                                splitLine:{
                                    show:false
                                }
                            }],
                            series: [{
                                name: 'depth',
                                type: 'line',
                                smooth: true,
                                symbol: 'circle',
                                symbolSize: 5,
                                showSymbol: false,
                                lineStyle: {
                                    normal: {
                                        width: 2
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: 'rgba(0, 136, 212, 0.8)'
                                        }, {
                                            offset: 0.8,
                                            color: 'rgba(0, 136, 212, 0.2)'
                                        }], false),
                                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                                        shadowBlur: 10
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'rgb(0,136,212)',
                                        borderColor: 'rgba(0,136,212,0.2)',
                                        borderWidth: 12

                                    }
                                },
                                data:[]
                            },]
                        }
                };
    },
    props: {
    //父组件需要传递的参数：id，width，height，option
        id: {
            type: String
        },
        width: {
            type: String,
            default: "300px"
        },
        height: {
            type: String,
            default: "300px"
        },
        option: {
            type: Object
            //Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的
        }
    },
    computed: {
        style() {
            return {
                height: this.height,
                width: this.width
            };
        }
    },
    watch:{
        option:function(newOption,oldOption){
            if(this.chart){
                console.log(newOption);
                this.chart.setOption(newOption);
            }else{
                this.init();
                this.chart.setOption(newOption);
            }
        },
        deep: true //对象内部属性的监听，关键。
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.chart = this.$echarts.init(document.getElementById(this.id));
            //设置option基本设置（比如样式）
            this.chart.setOption(this.initOption);
            //设置option数据（来自父组件）
            this.chart.setOption(this.option);
            //图表随窗口大小自适应
            window.addEventListener("resize", this.chart.resize);
        }
    }
};
</script>
<style lang='scss'>
</style>