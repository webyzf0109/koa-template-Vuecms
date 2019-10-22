<template>
  <div class="table-box">
    <h1>表格</h1>
    <ul class="ul-info">
      <li>通过声明tableData(数据)和tableModel(表头),迅速构建出基于 "el-table" 的表格</li>
      <li>模型的构建支持 render</li>
      <li>对于复杂的横列信息,我们提供了slot属性,可以自定义自己想要的内容（不超过5个）</li>
    </ul>
    <h3>示例代码</h3>
    <pre v-highlightA>
    <code>{{code}}</code>
    <h3>表格属性</h3>
    <y-table :tableData="tableData" :tableModel="tableModel" :border="false">
    </y-table>
</pre>
  </div>
</template>
<script>
import demoCode from "./demo";
export default {
  data() {
    return {
      code: demoCode.demoDefault(),
      tableData: demoCode.demoTableData,
      tableModel: demoCode.demoTableModel,
    };
  }
};
</script>
<style lang="less">
.table-box {
  width: calc(100%-60px);
}
</style>