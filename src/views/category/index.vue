<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>分类列表</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="请输入分类名称" class="width1" v-model="name"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTab">添加</el-button>
      </div>

      <y-table :tableData="tableData" :tableModel="tableModel">
        <template slot="operation1" slot-scope="scope">{{scope.scope.row.create_time | dateFormat}}</template>
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
    <el-dialog title="分类管理" :visible.sync="diaIsShow" class="diaForm">
      <y-form
        :labelWidth="140"
        ref="iforms"
        :formData="formData"
        :formModel="inLine_FormModel"
        formName="inLine"
        v-if="isReady"
      >
        <div slot="iform-btns">
          <el-button type="primary" @click="changeTab('iforms', editType)">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </div>
      </y-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  addCategory,
  removeCategory,
  editCategory
} from "@/api/category";
export default {
  data() {
    return {
      tableData: [],
      tableModel: [
        {
          label: "序号",
          type: "index",
          minWidth: 50
        },
        {
          label: "分类名称",
          prop: "name",
          minWidth: 200
        },
        {
          slot: "operation1",
          minWidth: 200,
          label: "创建时间"
        },
        {
          label: "操作",
          minWidth: 150,
          render: (h, params) => {
            return [
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
                "编辑"
              ),
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
                      this.romoveItem(params.row.id);
                    }
                  }
                },
                "删除"
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
      isReady:false,
      formData: {},
      inLine_FormModel: [
        {
          elemType: "input",
          placeholder: "请输入分类名称",
          maxlength: 10,
          label: "分类名称：",
          prop: "name",
          rules: ["required",],
          labelWidth: "130px",
          width: "250px",
        }
      ],
      editType: "",
      options: [
        { label: "全部", value: "" },
        { label: "上线中", value: 1 },
        { label: "下线中", value: 2 }
      ],
    };
  },
  created() {
    this.getList();
  },
  watch:{
    diaIsShow:function(newValue,oldValue){
      this.isReady=newValue;
    }
  },
  methods: {
    handleSize(val) {
      (this.rows = val), this.getList();
    },
    handlePage(val) {
      (this.page = val), this.getList();
    },
    getList() {
      getList({
        page: this.page,
        rows: this.rows,
        name: this.name
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
    _reset (name) {
      this.$refs[name].resetForm(name)
    },
    resetForm (name) {
      this.$refs[name].resetFields()
    },
    // add
    addTab() {
      this.formData={};
      this.diaIsShow = true;
      this.editType = "add";
    },
    // 编辑
    editTable(row) {
      this.formData = Object.assign({}, row);
      this.editType = "update";
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
    changeTab(form, type) {
      let result=this.$refs['iforms'].getFormData();
      console.log(result)
      if(result){
        if (type === "update") {
            editCategory({
              id: result.id,
              name: result.name
            }).then(res => {
              this.$message.success("修改成功");
              this.getList();
            });
          } else {
            addCategory({
              name: result.name
            }).then(res => {
              this.$message.success("新增成功");
              this.getList();
            });
          }
          this.diaIsShow = false;
      }else{
        return;
      }
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
