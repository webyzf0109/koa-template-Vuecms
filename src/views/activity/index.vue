<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>活动列表</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入活动名称"
          class="width1"
          v-model="name"
        ></el-input>
        <el-select
          v-model="status"
          clearable
          class="width1"
          placeholde="请选择状态"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
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
        <el-table-column prop="id" label="序号" width="60"></el-table-column>
        <el-table-column
          prop="name"
          label="活动名称"
          width="100"
        ></el-table-column>
        <el-table-column label="图片" width="110">
          <template slot-scope="scope">
            <img width="100" :src="scope.row.url" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="活动描述"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="state" label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | tagClass">{{
              scope.row.state | statusText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="warning"
              @click="toConfirm(scope.row)"
              :disabled="scope.row.state === 1 ? false : true"
              >{{ scope.row.state == 1 ? '下架' : '上架' }}</el-button
            >
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/activity'
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      name: '',
      status: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      options: [
        { label: '全部', value: '' },
        { label: '上架中', value: 1 },
        { label: '下架中', value: 2 }
      ],
      rowIndex: 0
    }
  },
  created() {
    this.getList()
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '下架中'
      } else if (val === 1) {
        return '上架中'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else if (val === 1) {
        return 'info'
      } else if (val === 2) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  methods: {
    handleSize(val) {
      this.pageSize = val
      this.getPageData()
    },
    handlePage(val) {
      this.currentPage = val
      this.getPageData()
    },
    getList() {
      getList()
        .then(res => {
          this.tableData = res.rows
          this.total = res.count
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // 查找
    searchTab() {
      let arrList = []
      for (let item of this.allList) {
        if (this.name.trim() === '' && this.status === null) {
          arrList = this.allList
          break
        } else if (
          item.order.startsWith(this.name) &&
          (this.status !== null ? item.status === this.status : true)
        ) {
          let obj = Object.assign({}, item)
          arrList.push(obj)
        }
      }
      this.schArr = arrList
      this.total = arrList.length
      this.currentPage = 1
      this.pageSize = 10
      this.getPageData()
    },
    // add
    addTab() {
      this.formData = {}
      this.diaIsShow = true
      this.formData.order = (Math.random() * 10e18).toString()
      this.formData.id = this.allList.length + 1
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 审核
    toConfirm(row) {
      row.status = 2
      this.$notify({
        title: '成功',
        message: '审核提交成功',
        type: 'success'
      })
    },
    // 完成
    toSuccess(row) {
      row.status = 0
      this.$notify({
        title: '成功',
        message: '该订单已完成配送',
        type: 'success'
      })
    },
    // 取消
    toDelete(row) {
      row.status = 3
      this.$notify({
        title: '成功',
        message: '已取消该订单',
        type: 'success'
      })
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.diaIsShow = true
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
      this.rowIndex = index
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
