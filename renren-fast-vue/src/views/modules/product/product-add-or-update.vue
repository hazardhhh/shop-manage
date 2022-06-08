<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="pageClose"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" placeholder="价格"></el-input>
      </el-form-item>
      <el-form-item label="父类型" prop="type1">
        <el-cascader
          :options="categoryData"
          clearable
          @change="handleChange"
          :props="{ label: 'name', value: 'id' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          ref="uploadRef"
          :action="uploadAction"
          list-type="picture-card"
          :auto-upload="true"
          :on-success="fileScucess"
          :headers="headerObj"
          :multiple="true"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      uploadAction: window.SITE_CONFIG.baseUrl + "/upload/file",
      headerObj: {
        token: Vue.cookie.get("token")
      },
      visible: false,
      categoryData: [],
      dataForm: {
        id: 0,
        name: "1",
        price: "1",
        type1: "",
        type2: "",
        pictureList: []
      },
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
        type1: [{ required: true, message: "父类型不能为空", trigger: "blur" }],
        type2: [{ required: true, message: "子类型不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    pageClose() {
      this.dataForm.pictureList = [];
      this.$refs.uploadRef.clearFiles();
    },
    fileScucess(response, file, fileList) {
      let obj = new Object();
      obj.pic = response.path;
      this.dataForm.pictureList.push(obj);
    },
    handleChange(value) {
      this.dataForm.type1 = value[0];
      this.dataForm.type2 = value[1];
    },
    getCategoryData() {
      this.$http({
        url: this.$http.adornUrl("/category/getZtreeData"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.categoryData = data.data;
        }
      });
    },
    init(id) {
      this.getCategoryData();
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/product/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.product.name;
              this.dataForm.price = data.product.price;
              this.dataForm.type1 = data.product.type1;
              this.dataForm.type2 = data.product.type2;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              price: this.dataForm.price,
              type1: this.dataForm.type1,
              type2: this.dataForm.type2,
              productPicList: this.dataForm.pictureList
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
