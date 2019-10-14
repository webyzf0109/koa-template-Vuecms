<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>预约列表</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="请输入预约人名字" class="width1" v-model="name"></el-input>
        <el-select v-model="currentCategory" placeholder="请选择商品分类" class="width1">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>  
        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTab">添加</el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="time" label="预约时间" width="160">
          <template slot-scope="scope">{{ scope.row.time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="预约商品">
          <template slot-scope="scope">
            <img style="width:80px;" :src="scope.row.Good.goodsUrl" alt />
            <div>
              <p>{{ scope.row.Good.goodsName }}</p>
              <p>￥{{ scope.row.Good.goodsPrice }} x {{ scope.row.count }}</p>
              <p>总计：￥{{ scope.row.Good.goodsPrice * scope.row.count }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="付款状态">
          <template slot-scope="scope">
            <div class="flex-column">
              <el-tag>
                {{
                scope.row.payState == 0 ? '待付款' : '已付款'
                }}
              </el-tag>
              <span
                v-if="scope.row.payState == 0"
                class="click-color"
                @click="onEditPayState(scope.row.id)"
              >修改为已付款</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单备注">
          <template slot-scope="scope">
            <p>{{ scope.row.remark }}</p>
            <span class="click-color" @click="editTable(scope.$index, scope.row)">修改订单备注</span>
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
    <el-dialog title="预约管理" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaForm" :model="formData" :rules="rules" label-width="140px">
        <el-form-item label="订单备注" prop="remark">
          <el-input type="text" v-model="formData.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm')">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getList, editOrderRemark, editPayState } from "@/api/yuyue";
import { getCategoryAllName } from "@/api/category"
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      name: "",
      page: 1,
      rows: 10,
      total: 0,
      rowss: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      options: [
        { label: "全部", value: "" },
        { label: "上线中", value: 1 },
        { label: "下线中", value: 2 }
      ],
      categoryList:[],
      rowIndex: 0,
      rules: {
        remark: [
          { required: true, message: "请输入订单备注", trigger: "change" }
        ]
      },
      currentCategory:'',
    };
  },
  created() {
    this.getList();
    this.getCategoryAllName();
  },
  methods: {
    getCategoryAllName(){
      getCategoryAllName().then(res=>{
        this.categoryList=res;
      })
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
    // add
    addTab() {
      this.formData = {};
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row);
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
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
      this.$refs[form].validate(valid => {
        if (valid) {
          editOrderRemark({
            id: this.formData.id,
            remark: this.formData.remark
          }).then(res => {
            this.$message.success("修改成功");
            this.getList();
          });
          this.diaIsShow = false;
        } else {
          return;
        }
      });
    },
    onEditPayState(id) {
      this.$confirm("确定该用户已经付款?", "提示").then(res => {
        editPayState({
          id: id,
          payState: 1
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
