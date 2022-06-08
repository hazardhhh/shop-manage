<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="pageClose"
    :destroy-on-close="true"
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
      <el-form-item label="描述" prop="des">
        <el-input v-model="dataForm.des" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址" prop="checkUrl">
        <el-input v-model="dataForm.checkUrl" placeholder="跳转地址"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <!-- <el-input v-model="dataForm.status" placeholder="状态"></el-input> -->
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="索引" prop="inde">
        <el-input v-model="dataForm.inde" placeholder="索引"></el-input>
      </el-form-item>
      <el-form-item label="展示时间" prop="showDate">
        <el-date-picker
          v-model="dataForm.showDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-input
          v-model="dataForm.createTime"
          placeholder="创建时间"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="图片地址" prop="pngUrl">
        <el-upload
          ref="uploadRef"
          :action="uploadAction"
          list-type="picture-card"
          :auto-upload="true"
          :on-success="fileSuccess"
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      uploadAction: window.SITE_CONFIG.baseUrl + "upload/file",
      visible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      dataForm: {
        id: 0,
        name: "",
        des: "",
        checkUrl: "",
        status: "",
        inde: "",
        createTime: "",
        pngUrl: "",
        showDate: ""
      },
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        des: [{ required: true, message: "描述不能为空", trigger: "blur" }],
        checkUrl: [
          { required: true, message: "跳转地址不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        inde: [{ required: true, message: "索引不能为空", trigger: "blur" }],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ]
        // pngUrl: [
        //   { required: true, message: "图片地址不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  methods: {
    pageClose() {
      //dialog关闭后清空本次上传的文件列表
      console.log("dialog关闭");
      this.$refs.uploadRef.clearFiles();
    },
    fileSuccess(response, file, fileList) {
      //文件上传成功后的回调函数
      this.dataForm.pngUrl = response.path;
      console.log("resp", response);
      console.log("file", file);
      console.log("fileList", fileList);
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/recommend/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.recommend.name;
              this.dataForm.des = data.recommend.des;
              this.dataForm.checkUrl = data.recommend.checkUrl;
              this.dataForm.status = data.recommend.status;
              this.dataForm.inde = data.recommend.inde;
              this.dataForm.createTime = data.recommend.createTime;
              this.dataForm.pngUrl = data.recommend.pngUrl;
              this.dataForm.showDate = data.recommend.showDate;
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
              `/recommend/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              des: this.dataForm.des,
              checkUrl: this.dataForm.checkUrl,
              status: this.dataForm.status,
              inde: this.dataForm.inde,
              createTime: this.dataForm.createTime,
              pngUrl: this.dataForm.pngUrl,
              showDate: this.dataForm.showDate
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
