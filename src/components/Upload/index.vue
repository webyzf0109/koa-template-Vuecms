<template>
  <div class="uploadConfig">
    <div
      class="view"
      v-if="imgUrl.length>0"
      v-for="(item,index) in imgUrl"
      :key="index"
    >
      <img :src="item.imgPath" alt />
      <div class="pop">
        <i class="el-icon-zoom-in" @click="viewPhoto(index)"></i>
        <i class="el-icon-delete" @click="remove(index)"></i>
      </div>
    </div>
    <div class="upload"  v-if="imgUrl.length<=0">
      <i class="el-icon-plus"></i>
      <input type="file" @change="handle($event)" name="img" />
    </div>
    <div class="elDialog">
      <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true">
        <img width="100%" v-if="dataList[idx]" :src="imgUrl[idx].imgPath" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  upload
} from "@/api/goods";
export default {
  data() {
    return {
      imgUrl: [],
      dialogVisible: false,
      idx: 0
    };
  },
  props: ["dataList"],
  created() {
    this.imgUrl = [{imgPath:this.dataList}];
  },
  watch: {
    dataList: function(newValue, oldValue) {
      this.imgUrl = newValue;
    }
  },
  methods: {
    viewPhoto(index) {
      this.idx = index;
      this.dialogVisible = true;
    },
    remove(index){
      this.imgUrl.splice(index,1);
    },
    handle(e) {
      let files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        if (
          files[i].type !== "image/gif" &&
          files[i].type !== "image/png" &&
          files[i].type !== "image/jpeg" &&
          files[i].type !== "image/webp"
        ) {
          this.$message.error("上传文件格式不对");
          return;
        } else if (files[i].size >= 2048000) {
          this.$message.error("图片大小不得超过2M");
          return;
        }
        let formdata = new FormData();
        formdata.append("file", files[i]);
        upload(
          formdata
        )
          .then(res => {
            e.target.value = "";
            let obj = { type: 2, imgPath: res.imgurl ,coverType:0};
            this.imgUrl.push(obj);
            this.$emit("uploadChildSay", this.imgUrl);
            if (this.imgUrl.length == files.length) {
              this.$message.success("图片上传成功");
            }
          })
          .catch(err => {
            this.$store.state.isLogin = false;
          });
      }
    }
  }
};
</script>
<style lang="scss">
.uploadConfig {
  width: auto;
  height: 75px;
  display: flex;
  .view {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    .pop {
      width: 100%;
      height: 100%;
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      display: flex;
      justify-content: space-around;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      i {
        line-height: 60px;
        color: #fff;
      }
    }
    img {
      width: 60px;
      height: 60px;
    }
    span {
      position: absolute;
      bottom: -28px;
      color: #409eff;
      left: 0;
      display: block;
      font-size: 12px;
      width:60px;
      text-align:center;
    }
  }
  .pop:hover {
    opacity: 1;
  }
  .pop:focus {
    opacity: 1;
  }
  .upload {
    width: 60px;
    height: 60px;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    line-height: 60px;
    vertical-align: top;
    position: relative;
    text-align: center;
    input {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      opacity: 0;
      cursor: pointer;
    }
  }
  .upload:hover {
    border-color: #409eff;
    color: #409eff;
  }
}
</style>