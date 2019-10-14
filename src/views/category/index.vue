<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>分类列表</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入分类名称"
          class="width1"
          v-model="name"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addTab"
          >添加</el-button
        >
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="warning"
              @click="editTable(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button type="warning" @click="romoveItem(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-size="rows"
        :current-page="page"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      ></el-pagination>
    </el-card>
    <el-dialog title="分类管理" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  addCategory,
  removeCategory,
  editCategory
} from '@/api/category'
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      name: '',
      page: 1,
      rows: 10,
      total: 0,
      rowss: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: '',
      options: [
        { label: '全部', value: '' },
        { label: '上线中', value: 1 },
        { label: '下线中', value: 2 }
      ],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSize(val) {
      ;(this.rows = val), this.getList()
    },
    handlePage(val) {
      ;(this.page = val), this.getList()
    },
    getList() {
      getList({
        page: this.page,
        rows: this.rows,
        name: this.name
      }).then(res => {
        this.tableData = res.rows
        this.total = res.count
      })
    },
    // 查找
    searchTab() {
      this.page = 1
      this.getList()
    },
    // add
    addTab() {
      this.formData = {}
      this.diaIsShow = true
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.editType = 'update'
      this.diaIsShow = true
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
      this.rowIndex = index
    },
    //删除
    romoveItem(id) {
      this.$confirm('确定删除该分类?', '提示').then(res => {
        removeCategory({ id: id }).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            editCategory({
              id: this.formData.id,
              name: this.formData.name
            }).then(res => {
              this.$message.success('修改成功')
              this.getList()
            })
          } else {
            addCategory({
              name: this.formData.name
            }).then(res => {
              this.$message.success('新增成功')
              this.getList()
            })
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
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: '';
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^='el-icon'] {
  color: #fff;
}
</style>
