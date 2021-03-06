<template>
  <div class="vue-sku">
    <!-- 规格设置 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>产品规格设置</span>
      </div>
      <section>
        <div v-for="(item, index) in specification" :key="index" class="spec-line">
          <div>
            <span v-if="!cacheSpecification[index].status">{{ item.name }}</span>
            <el-input
              size="small"
              style="width:200px;"
              v-if="cacheSpecification[index].status"
              v-model="cacheSpecification[index].name"
              placeholder="输入产品规格"
              @keyup.native.enter="saveSpec(index)"
            >
              <el-button slot="append" icon="el-icon-check" type="primary" @click="saveSpec(index)"></el-button>
            </el-input>
            <i
              class="icon el-icon-edit"
              style="font-size:20px;margin-left:15px;cursor: pointer;"
              v-if="!cacheSpecification[index].status"
              @click="updateSpec(index)"
            ></i>
            <i class="icon el-icon-circle-close spec-deleted" @click="delSpec(index)"></i>
          </div>
          <div style="margin-top:20px;">
            <el-tag
              style="margin-right:15px;"
              v-for="(tag, j) in item.value"
              :key="j"
              closable
              @close="delSpecTag(index, j)"
            >{{ tag }}</el-tag>
            <el-input
              size="small"
              style="width:200px;"
              v-model="addValues[index]"
              placeholder="多个产品属性以空格隔开"
              @keyup.native.enter="addSpecTag(index)"
            >
              <el-button
                slot="append"
                icon="el-icon-check"
                type="primary"
                @click="addSpecTag(index)"
              ></el-button>
            </el-input>
          </div>
          <el-divider></el-divider>
        </div>
        <div class="add-spec">
          <el-button
            style="margin-top:20px;"
            size="small"
            type="primary"
            :disabled="specification.length >= 5"
            @click="addSpec"
          >添加规格项目</el-button>
        </div>
      </section>
    </el-card>

    <!-- 实战DEMO -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>规格表格</span>
      </div>
      <table class="el-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th style="width: 100px;" v-for="(item, index) in specification" :key="index">{{item.name}}</th>
            <th style="width: 180px;">成本价（元）</th>
            <th style="width: 180px;">库存</th>
            <th style="width: 180px;">销售价（元）</th>
            <!-- <th>是否启用</th> -->
          </tr>
        </thead>
        <tbody v-if="specification[0] && specification[0].value.length">
          <tr :key="index" v-for="(item, index) in countSum(0)">
            <template v-for="(n, specIndex) in specification.length">
              <td
                v-if="showTd(specIndex, index)"
                :key="n"
                :rowspan="countSum(n)"
              >{{getSpecAttr(specIndex, index)}}</td>
            </template>
            <td>
              <el-input
                style="width:100px"
                size="small"
                type="text"
                v-model.number="productArray[index].minPrice"
                placeholder="输入成本价"
              ></el-input>
            </td>
            <td>
              <el-input
                style="width:100px"
                size="small"
                type="text"
                v-model.number="productArray[index].stock"
                placeholder="输入库存"
              ></el-input>
            </td>
            <td>
              <el-input
                style="width:100px"
                size="small"
                type="text"
                v-model.number="productArray[index].price"
                placeholder="输入销售价"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td colspan="8" class="wh-foot">
              <span class="label">批量设置：</span>
              <template v-if="isSetListShow">
                <el-button @click="openBatch('minPrice')" size="mini">成本价</el-button>
                <el-button @click="openBatch('stock')" size="mini">库存</el-button>
                <el-button @click="openBatch('price')" size="mini">销售价</el-button>
              </template>
              <template v-else>
                <el-input
                  size="mini"
                  style="width:200px;"
                  v-model.number="batchValue"
                  placeholder="输入要设置的数量"
                ></el-input>
                <el-button type="primary" size="mini" @click="setBatch">
                  <i class="set-btn blue el-icon-check"></i>
                </el-button>
                <el-button type="danger" size="mini" @click="cancelBatch">
                  <i class="set-btn blue el-icon-close"></i>
                </el-button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>

    <!-- 数据格式 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据格式</span>
      </div>
      <section>
        <div v-for="(item, index) in productArray" :key="index">
          {{ item }}
          <el-divider></el-divider>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script>
// 为Object添加一个原型方法，判断两个对象是否相等
function objEquals(object1, object2) {
  // For the first loop, we only check for types
  for (let propName in object1) {
    // Check for inherited methods and properties - like .equals itself
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    // Return false if the return value is different
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false;
      // Check instance type
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      // Different types => not equal
      return false;
    }
  }
  // Now a deeper check using other objects property names
  for (let propName in object2) {
    // We must check instances anyway, there may be a property that only exists in object2
    // I wonder, if remembering the checked values from the first loop would be faster or not
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false;
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      return false;
    }
    // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
    if (!object1.hasOwnProperty(propName)) {
      continue;
    }
    // Now the detail check and recursion
    // This returns the script back to the array comparing
    /** REQUIRES Array.equals**/
    if (
      object1[propName] instanceof Array &&
      object2[propName] instanceof Array
    ) {
      // recurse into the nested arrays
      if (objEquals(!object1[propName], object2[propName])) {
        return false;
      }
    } else if (
      object1[propName] instanceof Object &&
      object2[propName] instanceof Object
    ) {
      // recurse into another objects
      // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (objEquals(!object1[propName], object2[propName])) {
        return false;
      }
      // Normal value comparison for strings and numbers
    } else if (object1[propName] !== object2[propName]) {
      return false;
    }
  }
  // If everything passed, let's say YES
  return true;
}

export default {
  name: "app",

  data() {
    return {
      // 规格
      specification: [
        // {
        //   name:"颜色",
        //   value:["黑色 白色 蓝色"],
        // },
        // {
        //   name:"尺码",
        //   value:["l m x"],
        // },
        // {name:'蓝色'},
        // {name:'花色'},
      ],
      // 子规格
      productArray: [
       
      ],
      // 用来存储要添加的规格属性
      addValues: [],
      // 批量设置相关
      isSetListShow: true,
      batchValue: "", // 批量设置所绑定的值
      currentType: "", // 要批量设置的类型
      cacheSpecification: [] // 缓存规格名称
    };
  },

  computed: {
    // 所有sku的id
    stockSpecArr() {
      return this.productArray.map(item => item.productSpec);
    }
  },
  created() {
    // this.handleSpecChange();
    this.createData();
  },
  methods: {
    // 创建模拟数据
    createData() {
      const arr = ["颜色", "尺寸"];
      const arr2 = ["黑色 白色 蓝色", "s m xl"];
      for (let i = 0; i < 2; i++) {
        // 添加数据
        this.cacheSpecification.push({
          status: true,
          name: ""
        });
        this.specification.push({
          value:[],
          name:''
        })
        // 数据
        this.specification[i].name = arr[i];
        this.addValues[i] = arr2[i];
        // 缓存按钮键值
        this.cacheSpecification[i].status = false;
        this.cacheSpecification[i].name = arr[i];
        // 构建
        this.addSpecTag(i);
      }

      // for (let i = 0; i < this.specification.length; i++) {
      //   // 添加数据
      //   this.cacheSpecification.push({
      //     status: true,
      //     name: ""
      //   });
      //   // 缓存按钮键值
      //   this.cacheSpecification[i].status = false;
      //   this.addValues[i] = this.specification[i].value.toString();
      //   this.cacheSpecification[i].name = this.specification[i].name;
      //   // 构建
      //   this.addSpecTag(i);
      // }
    },
    // 添加规格项目
    addSpec() {
      if (this.specification.length < 5) {
        this.specification.push({
          name: "",
          value: []
        });
        this.cacheSpecification.push({
          status: true,
          name: ""
        });
      }
    },
    // 修改状态
    updateSpec(index) {
      this.cacheSpecification[index].status = true;
      this.cacheSpecification[index].name = this.specification[index].name;
    },
    // 保存规格名
    saveSpec(index) {
      if (!this.cacheSpecification[index].name.trim()) {
        this.$message.error("名称不能为空，请注意修改");
        return;
      }
      // 保存需要验证名称是否重复
      if (
        this.specification[index].name === this.cacheSpecification[index].name
      ) {
        this.cacheSpecification[index].status = false;
      } else {
        if (this.verifyRepeat(index)) {
          // 如果有重复的，禁止修改
          this.$message.error("名称重复，请注意修改");
        } else {
          this.specification[index].name = this.cacheSpecification[index].name;
          this.cacheSpecification[index].status = false;
        }
      }
    },
    // 删除规格项目
    delSpec(index) {
      this.specification.splice(index, 1);

      this.handleSpecChange("del");
    },
    verifyRepeat(index) {
      let flag = false;
      this.specification.forEach((value, j) => {
        // 检查除了当前选项以外的值是否和新的值想等，如果相等，则禁止修改
        if (index !== j) {
          if (
            this.specification[j].name === this.cacheSpecification[index].name
          ) {
            flag = true;
          }
        }
      });
      return flag;
    },
    // 添加规格属性
    addSpecTag(index) {
      let str = this.addValues[index] || "";
      if (!str.trim() || !this.cacheSpecification[index].name.trim()) {
        this.$message.error("名称不能为空，请注意修改");
        return;
      } // 判空
      str = str.trim();
      let arr = str.split(/\s+/); // 使用空格分割成数组
      let newArr = this.specification[index].value.concat(arr);
      newArr = Array.from(new Set(newArr)); // 去重
      this.$set(this.specification[index], "value", newArr);

      this.clearAddValues(index);

      this.handleSpecChange("add");
      this.specification[index].name = this.cacheSpecification[index].name;
      this.cacheSpecification[index].status = false;
    },

    /**获取商品规格 */
    getRule(){
      return JSON.stringify(this.specification);
    },

    /**获取所有的sku */
    getSku(){
      return JSON.stringify(this.productArray);
    },


    // 删除规格属性
    delSpecTag(index, num) {
      this.specification[index].value.splice(num, 1);

      this.handleSpecChange("del");
    },

    // 清空 addValues
    clearAddValues(index) {
      this.$set(this.addValues, index, "");
    },

    /*
        根据传入的属性值，拿到相应规格的属性
        @params
          specIndex 规格项目在 advancedSpecification 中的序号
          index 所有属性在遍历时的序号
      */
    getSpecAttr(specIndex, index) {
      // 获取当前规格项目下的属性值
      const currentValues = this.specification[specIndex].value;
      let indexCopy;

      // 判断是否是最后一个规格项目
      if (
        this.specification[specIndex + 1] &&
        this.specification[specIndex + 1].value.length
      ) {
        indexCopy = index / this.countSum(specIndex + 1);
      } else {
        indexCopy = index;
      }

      const i = Math.floor(indexCopy % currentValues.length);

      if (i.toString() !== "NaN") {
        return currentValues[i];
      } else {
        return "";
      }
    },

    /*
        计算属性的乘积
        @params
          specIndex 规格项目在 advancedSpecification 中的序号
      */
    countSum(specIndex) {
      let num = 1;
      this.specification.forEach((item, index) => {
        if (index >= specIndex && item.value.length) {
          num *= item.value.length;
        }
      });
      return num;
    },

    // 根据传入的条件，来判断是否显示该td
    showTd(specIndex, index) {
      // 如果当前项目下没有属性，则不显示
      if (!this.specification[specIndex]) {
        return false;

        // 自己悟一下吧
      } else if (index % this.countSum(specIndex + 1) === 0) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
     * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
     * @return {[type]}        [description]
     */
    handleSpecChange(option) {
      const stockCopy = JSON.parse(JSON.stringify(this.productArray));
      if (option === "del") {
        this.productArray = [];
      }
      for (let i = 0; i < this.countSum(0); i++) {
        this.changeStock(option, i, stockCopy);
      }
    },

    /**
     * [根据规格，动态改变库存相关信息]
     * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
     * @param  {[array]} stockCopy [库存信息的拷贝]
     * @return {[type]}           [description]
     */
    changeStock(option, index, stockCopy) {
      let product = {
        productId: 0,
        productSpec: this.getproductSpec(index),
        stock: 0,
        price: 0,
        minPrice: 0
      };
      const spec = product.productSpec;
      if (option === "add") {
        // 如果此id不存在，说明为新增属性，则向 productArray 中添加一条数据
        if (this.stockSpecArr.findIndex(item => objEquals(spec, item)) === -1) {
          this.$set(this.productArray, index, product);
        }
      } else if (option === "del") {
        // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
        let origin = "";
        stockCopy.forEach(item => {
          if (objEquals(spec, item.productSpec)) {
            origin = item;
            return false;
          }
        });
        this.productArray.push(origin || product);
        
      }
    },

    // 获取productArray的productSpec属性
    getproductSpec(index) {
      let obj = {};
      this.specification.forEach((item, specIndex) => {
        obj[item.name] = this.getSpecAttr(specIndex, index);
      });
      return obj;
    },




    // 打开设置框
    openBatch(type) {
      this.currentType = type;
      this.isSetListShow = false;
    },

    // 批量设置
    setBatch() {
      if (typeof this.batchValue === "string") {
        this.$message({
          type: "warning",
          message: "请输入正确的值"
        });
        return;
      }
      this.productArray.forEach(item => {
        item[this.currentType] = this.batchValue;
      });
      this.cancelBatch();
    },

    // 取消批量设置
    cancelBatch() {
      this.batchValue = "";
      this.currentType = "";
      this.isSetListShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-sku {
  .spec-line {
    position: relative;
    .spec-deleted {
      font-size: 20px;
      margin-left: 15px;
      cursor: pointer;
      cursor: pointer;
    }
  }
}
</style>
