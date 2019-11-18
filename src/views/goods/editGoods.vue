<template>
  <div class="editGoods">
    <y-form
      :labelWidth="140"
      ref="iforms"
      :formData="formData"
      :formModel="inLine_FormModel"
      formName="inLine"
    ></y-form>
    <v-sku ref="sku"></v-sku>
    <el-button style="margin-left:50px;" type="primary" @click="changeTab('iforms')">确认</el-button>
    <el-button @click="callBack">返回</el-button>
  </div>
</template>
<script>
import { getCategoryAllName } from "@/api/category";
import { addGoods, editGoods, getGoodsDetail } from "@/api/goods";
import sku from "@/components/sku/sku";
export default {
  components: {
    "v-sku": sku
  },
  data() {
    return {
      formData: {
        url: []
      },
      inLine_FormModel: [
        {
          elemType: "input",
          placeholder: "请输入商品名称",
          maxlength: 30,
          label: "商品名称：",
          prop: "name",
          rules: ["required"],
          width: 250
        },
        {
          elemType: "select",
          label: "商品分类：",
          placeholder: "请选择商品分类",
          defaultValue: "",
          width: 250,
          rules: ["required"],
          prop: "category_type",
          col: "name",
          colVal: "id",
          options: []
        },
        {
          label: "上传图片：",
          prop: "url",
          elemType: "upload",
          rules: ["required"],
          ref: "upload",
          width: 60,
          height: 60,
          sizeWidth: 750,
          sizeHeight: 750,
          num: 1,
          maxNum: 1,
          uploadUrl: "/v1/upload",
          imgList: []
        }
        // {
        //   elemType: "input",
        //   placeholder: "请输入商品价格",
        //   maxlength: 30,
        //   label: "商品价格：",
        //   prop: "price",
        //   rules: ["required", "bNumber"],
        //   width: 250
        // },
        // {
        //   elemType: "input",
        //   placeholder: "请输入商品规格",
        //   maxlength: 30,
        //   label: "商品规格：",
        //   prop: "rule",
        //   rules: ["required"],
        //   width: 250
        // }
      ]
    };
  },
  created() {
    if (this.$route.params.goodsInfo) {
      this.loadDetail();
    }
    this.getCategoryAllName();
  },
  methods: {
    loadDetail() {
      this.formData = JSON.parse(this.$route.params.goodsInfo);
      this.inLine_FormModel[2].imgList = this.formData.url;
      getGoodsDetail({
        id:this.$route.params.id
      }).then(res=>{

      })
    },
    getCategoryAllName() {
      getCategoryAllName().then(res => {
        res.shift();
        this.inLine_FormModel[1].options = res;
      });
    },
    callBack() {
      this.$router.go(-1);
    },
    changeTab(form) {
      let result = this.$refs["iforms"].getFormData();
      let rule = this.$refs.sku.getRule();
      let productSpec = this.$refs.sku.getSku();
      if (!rule) {
        this.$message.error("请输入规格信息");
        return;
      }
      if (!productSpec) {
        this.$message.error("sku没有生成,请重新输入规格信息");
        return;
      }
      if (result) {
        if (this.$route.params.goodsInfo) {
          editGoods({
            id: result.id,
            name: result.name,
            category_type: result.category_type,
            url: result.url[0].imgPath,
            rule: rule,
            productSpec: productSpec
          }).then(res => {
            this.$message.success("修改成功");
            this.$router.push({
              path: "/goods",
              meta: {
                noCache: true
              }
            });
          });
        } else {
          addGoods({
            name: result.name,
            category_type: result.category_type,
            url: result.url[0].imgPath,
            rule: rule,
            productSpec: productSpec
          }).then(res => {
            this.$message.success("新增成功");
            this.$router.push({
              path: "/goods",
              meta: {
                noCache: true
              }
            });
          });
        }
        this.diaIsShow = false;
      } else {
        return;
      }
    }
  }
};
</script>