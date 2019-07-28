<template>
    <div class="JudgeDepth">
        <JudgeDepthChart :id='id' :width='width' :height='height' :option='option'></JudgeDepthChart>
    </div>
</template>
<script>
import JudgeDepthChart from './JudgeDepthChart' //引入child组件
export default {
    data() {
        return {
            id:"depthChart",
            width:"450px",
            height:"240px",
            option:{
                xAxis:{
                    data:[]
                },
                series: [{
                    type:'line',
                    data: []
                }]
            }
        };
    },
    components: {
      JudgeDepthChart
    },
    mounted(){
        this.initData();
        this.$mavlink.on("depth",this.updateDepth);
    },
    beforeDestroy() {
        this.$mavlink.removeListener("depth",this.updateDepth);
    },
    methods:{
        updateOption:function(){
            //更新option,使其能传到子组件使数据更新
            this.option={
                xAxis:{
                    data:this.option.xAxis.data
                },
                series: [{
                    type:'line',
                    data: this.option.series[0].data
                }]
            }
        },
        initData:function(){
                //设置初始情况是建立socket连接前10s，深度为0
                let date=new Date();
                let hour=date.getHours();
                let min=date.getMinutes();
                let sec=date.getSeconds();
                for(let i=0;i<10;i++){
                    for(let j=4;j>=0;j--){
                        this.option.xAxis.data.unshift(hour+":"+min+":"+sec+"."+j*2);
                        this.option.series[0].data.unshift(0);
                    }
                    if(sec>0){
                        sec-=1;
                    }else if(min>0){
                        sec=59;
                        min-=1;
                    }else if(hour>0){
                        sec=59;
                        min=59;
                        hour-=1;
                    }
                }
                this.updateOption();
        },
        //根据后端socket传来的depth信息（1s）五个值更新信息
        updateDepth:function(dat){
            let depth=dat.depth;
            let time=dat.time;
            //将最早的五个值移除，再新添加值
            this.option.xAxis.data.splice(0,5);
            this.option.series[0].data.splice(0,5);
            depth.map(function(value,index){
                this.option.series[0].data.push(value);
            });
            for(let i=0;i<5;i++)
            {
                this.option.xAxis.data.push(time+"."+i*2);
            }
            this.updateOption();
        }
    }

}
</script>
<style lang='scss'>
.JudgeDepth{
    width:450px;
    height:240px;
    background:rgba(25,30,64,0.8);
    border:2px solid transparent;
    border-radius: 20px;
    overflow:hidden;
    padding:5px;
}
</style>