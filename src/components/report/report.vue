<template>
  <el-card>
    <div ref="ecartsArea" style="width: 800px; height: 500px;"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ]
      }
    }
  },
  methods: {
    loadCharts() {
      this.$http({
        method: 'get',
        url: 'reports/type/1'
      }).then(res =>{
        let {data ,meta} = res.data
        if(meta.status === 200) {
          this.option = _.merge(this.option, data)
          const myChart = echarts.init(this.$refs.ecartsArea);
          myChart.setOption(this.option);
        }
      })
    }
  },
  mounted() {
    this.loadCharts()
  }
}
</script>

<style>
</style>
