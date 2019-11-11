<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>预约列表</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="请输入预约人名字" class="width1" v-model="name"></el-input>
        <el-select v-model="currentYuyueState" placeholder="请选择预约状态" class="width1">
          <el-option v-for="item in yuyueList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
      </div>

      <y-table :tableData="tableData" :tableModel="tableModel">
        <template slot="operation1" slot-scope="scope">{{scope.scope.row.time | dateFormat}}</template>
        <template slot="operation2" slot-scope="scope">
          <img style="width:80px;" :src="scope.scope.row.Good.goodsUrl" alt />
          <div>
            <p>{{ scope.scope.row.Good.goodsName }}</p>
            <p>￥{{ scope.scope.row.Good.goodsPrice }} x {{ scope.scope.row.count }}</p>
            <p>总计：￥{{ scope.scope.row.Good.goodsPrice * scope.scope.row.count }}</p>
          </div>
        </template>
        <template slot="operation3" slot-scope="scope">
          <div class="flex-column">
            <el-tag v-if="scope.scope.row.payState == 0" type="info">待付款</el-tag>
            <el-tag v-if="scope.scope.row.payState == 1" type="danger">已付款,待取货</el-tag>
            <el-tag v-if="scope.scope.row.payState == 2">已完成</el-tag>
            <span
              v-if="scope.scope.row.payState == 0"
              class="click-color"
              @click="onEditPayState(scope.scope.row.id,1)"
            >修改为已付款</span>
            <span
              v-if="scope.scope.row.payState == 1"
              class="click-color"
              @click="onEditPayState(scope.scope.row.id,2)"
            >修改为已完成</span>
          </div>
        </template>
      </y-table>

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
    <el-dialog title="预约管理" :visible.sync="diaIsShow" class="diaForm">
      <y-form
        :labelWidth="130"
        ref="iforms"
        :formData="formData"
        :formModel="formModel"
        v-if="isReady"
      >
        <div slot="iform-btns">
          <el-button type="primary" size="small" @click="changeTab('iforms')">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </div>
      </y-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList, editOrderRemark, editPayState } from "@/api/yuyue";
import { getCategoryAllName } from "@/api/category";
export default {
  data() {
    return {
      formData: {},
      formModel: [
        {
          elemType: "input",
          label: "订单备注",
          placeholder: "请输入订单备注",
          prop: "remark",
          width: 250,
          maxlength: "100",
          rules: ["required"]
        }
      ],
      tableData: [],
      tableModel: [
        {
          type: "index",
          label: "序号",
          width: 50
        },
        {
          prop: "name",
          label: "姓名",
          minWidth: 100
        },
        {
          label: "电话",
          prop: "phone",
          minWidth: 100
        },
        {
          slot: "operation1",
          label: "预约时间",
          minWidth: 100
        },
        {
          label: "预约商品",
          slot: "operation2",
          minWidth: 120
        },
        {
          label: "付款状态",
          slot: "operation3",
          minWidth: 100
        },
        {
          label: "操作",
          minWidth: 150,
          render: (h, params) => {
            return [
              h("div", params.row.remark),
              h(
                "a",
                {
                  class: {
                    "link-type": true
                  },
                  attrs: {
                    href: "javascript:;"
                  },
                  on: {
                    click: () => {
                      this.editTable(params.row);
                    }
                  }
                },
                "修改订单备注"
              )
            ];
          }
        }
      ],
      name: "",
      page: 1,
      rows: 10,
      total: 0,
      rowss: [10, 20, 30, 40],
      diaIsShow: false,
      yuyueList: [
        { id: "", name: "全部状态" },
        { id: 0, name: "待付款" },
        { id: 1, name: "已付款,待取货" },
        { id: 2, name: "已完成" }
      ],
      currentYuyueState: "",
      isReady: false
    };
  },
  watch: {
    diaIsShow: function(newValue, oldValue) {
      this.isReady = newValue;
    }
  },
  created() {
    this.getList();
    this.getCategoryAllName();
  },
  methods: {
    getCategoryAllName() {
      getCategoryAllName().then(res => {
        this.categoryList = res;
      });
    },
    handleSize(val) {
      (this.rows = val), this.getList();
    },
    handlePage(val) {
      this.page = val;
      window.scroll(0, 0);
      this.getList();
    },
    getList() {
      getList({
        page: this.page,
        rows: this.rows,
        name: this.name,
        type: 1,
        payState: this.currentYuyueState
      }).then(res => {
        this.tableData = res.rows;
        this.total = res.count;
      });
    },
    // 查找
    searchTab() {
      this.page = 1;
      this.getList();
    },
    // 编辑
    editTable(row) {
      this.formData = Object.assign({}, row);
      this.diaIsShow = true;
    },
    //删除
    romoveItem(id) {
      this.$confirm("确定删除该分类?", "提示").then(res => {
        removeCategory({ id: id }).then(res => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    changeTab(form) {
      let result = this.$refs["iforms"].getFormData();
      if (result) {
        editOrderRemark({
          id: result.id,
          remark: result.remark
        }).then(res => {
          this.$message.success("修改成功");
          this.getList();
        });
        this.diaIsShow = false;
      } else {
        return;
      }
    },
    onEditPayState(id, state) {
      this.$confirm(
        state == 1 ? "确定该用户已经付款?" : "确定该用户已经取货",
        "提示"
      ).then(res => {
        editPayState({
          id: id,
          payState: state
        }).then(res => {
          this.$message.success("修改成功");
          this.getList();
        });
      });
    }
  }
};
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
    content: "";
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
.searchDiv [class^="el-icon"] {
  color: #fff;
}
</style>
