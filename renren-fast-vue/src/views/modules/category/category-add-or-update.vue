<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
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
      <el-form-item label="父id" prop="pid">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            :data="categoryZtreeData"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="CurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          >
          </el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.pname"
          v-popover:menuListPopover
          placeholder="父id"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="图标"></el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="orderNum">
        <el-input v-model="dataForm.orderNum" placeholder="顺序"></el-input>
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
      categoryZtreeData: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      visible: false,
      dataForm: {
        id: 0,
        name: "",
        pid: "",
        icon: "",
        orderNum: "",
        pname: ""
      },
      dataRule: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        // pid: [{ required: true, message: "父id不能为空", trigger: "blur" }],
        icon: [{ required: true, message: "图标不能为空", trigger: "blur" }],
        orderNum: [{ required: true, message: "顺序不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    CurrentChangeHandle(data) {
      console.log("data", data);
      this.dataForm.pid = data.id;
      this.dataForm.pname = data.name;
    },
    getCategoryZtreeData() {
      this.$http({
        url: this.$http.adornUrl("/category/getZtreeData"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.categoryZtreeData = data.data;
        }
      });
    },
    init(id) {
      this.getCategoryZtreeData();
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/category/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.category.name;
              this.dataForm.pid = data.category.pid;
              this.dataForm.icon = data.category.icon;
              this.dataForm.orderNum = data.category.orderNum;
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
              `/category/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              pid: this.dataForm.pid,
              icon: this.dataForm.icon,
              orderNum: this.dataForm.orderNum
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
