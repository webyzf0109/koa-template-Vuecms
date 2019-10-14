<template>
  <el-dialog :title="title" :visible.sync="diaIsShow" class="diaForm">
    <el-form ref="diaForm" :model="formData" :rules="rules" label-width="140px">
      <el-form-item label="活动名称" prop="name">
        <el-input type="text" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeTab('diaForm')">确认</el-button>
        <el-button @click="diaIsShow = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      title: '添加标题',
      diaIsShow: true,
      formData: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }]
      }
    }
  },
  methods: {
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            )
            this.$notify({
              title: '成功',
              message: '订单已修改成功',
              type: 'success'
            })
          } else {
            this.tableData.unshift(Object.assign({}, this.formData))
            this.allList.push(Object.assign({}, this.formData))
          }
          this.diaIsShow = false
        } else {
          return
        }
      })
    }
  }
}
</script>
<style lang="less"></style>
