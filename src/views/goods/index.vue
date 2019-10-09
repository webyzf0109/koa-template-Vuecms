<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>商品列表</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="请输入商品名称" class="width1" v-model="name"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTab">添加</el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="商品类型">
          <template slot-scope="scope">
            <el-tag>{{scope.row.Category.category_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="name" label="商品图片">
          <template slot-scope="scope">
            <img width="80" :src="scope.row.url" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="rule" label="规格"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="warning" @click="editTable(scope.$index, scope.row)">修改</el-button>
            <el-button type="warning" @click="romoveItem(scope.row.id)">删除</el-button>
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
    <el-dialog title="商品管理" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaForm" :model="formData" :rules="rules" label-width="140px">
        <el-form-item label="商品名称" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="category_type">
          <el-select v-model="formData.category_type" placeholder="请选择商品分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图片" prop="url" ref="url">
          <v-upload :dataList="formData.url" @uploadChildSay="uploadChildSay"></v-upload>
          <el-input
            style="display:none;"
            v-if="formData.url.length>0"
            v-model="formData.url[0].imgPath"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" label="价格"></el-input-number>
        </el-form-item>
        <el-form-item label="商品规格" prop="rule">
          <el-input type="text" v-model="formData.rule"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import upload from "@/components/Upload/index.vue";
import {
  getList,
  getCategoryList,
  addGoods,
  removeGoods,
  editGoods
} from "@/api/goods";
export default {
  components: {
    "v-upload": upload
  },
  data() {
    const validatordataList = (rule, value, callback) => {
      if (value.length > 0) {
        callback();
      } else {
        callback(new Error("请选择图片"));
      }
    };
    return {
      tableData: [],
      name: "",
      page: 1,
      rows: 10,
      total: 0,
      rowss: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {
        url:[]
      },
      editType: "",
      categoryList: [
        
      ],
      rowIndex: 0,
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "change" }],
        category_type:[{required: true, message: "请选择商品类别", trigger: "change"}],
        price: [{ required: true, message: "请输入商品价格", trigger: "change" }],
        rule: [{ required: true, message: "请输入商品规格", trigger: "change" }],
        url: [{ required: true, validator: validatordataList }]
      }
    };
  },
  created() {
    this.getCategoryList();
    this.getList();
  },
  methods: {
    getCategoryList(){
      getCategoryList({
        page:1,
        rows:20,
      }).then(res=>{
        this.categoryList=res.rows;
      })
    },
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
    // add
    addTab() {
      this.formData = {
        url:[]
      };
      this.diaIsShow = true;
      this.editType = "add";
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row);
      this.editType = "update";
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
    },
    //删除
    romoveItem(id) {
      this.$confirm("确定删除该商品?", "提示").then(res => {
        removeGoods({ id: id }).then(res => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    //上传图片callback
    uploadChildSay(img) {
      this.formData.url = img;
      if (this.formData.url.length > 0) {
        this.$refs["url"].clearValidate();
      }
    },
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === "update") {
            editGoods({
              id: this.formData.id,
              name: this.formData.name,
              category_type:this.formData.category_type,
              price:this.formData.price,
              rule:this.formData.rule
            }).then(res => {
              this.$message.success("修改成功");
              this.getList();
            });
          } else {
            console.log(this.formData.url)
            addGoods({
              name: this.formData.name,
              category_type:this.formData.category_type,
              url:this.formData.url[0].imgPath,
              price:this.formData.price,
              rule:this.formData.rule
            }).then(res => {
              this.$message.success("新增成功");
              this.getList();
            });
          }
          this.diaIsShow = false;
        } else {
          return;
        }
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
