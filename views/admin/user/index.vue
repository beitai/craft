<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="登录账户" v-model="listQuery.userName"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="联系电话" v-model="listQuery.phone"> </el-input>
    <el-select class="filter-item" style="width: 200px;"  v-model="listQuery.status" placeholder="请选择状态">
          <el-option v-for="item in  staticOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="puls">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column  align="center" label="姓名" min-width="15%"> <template scope="scope">
        <span>{{scope.row.name}}</span>
      </template> </el-table-column>
    <el-table-column  align="center" label="登录账户" min-width="15%"> <template scope="scope">
            <span>{{scope.row.userName}}</span>
          </template> </el-table-column>
    <el-table-column  align="center" label="角色" min-width="15%"> <template scope="scope">
            <span>{{scope.row.groupName}}</span>
          </template> </el-table-column>
    <el-table-column  align="center" label="联系电话" min-width="15%"> <template scope="scope">
            <span>{{scope.row.phone}}</span>
          </template> </el-table-column>
    <el-table-column  align="center" label="状态" min-width="15%"> <template scope="scope"> 
          <span v-if="scope.row.status==0">停用</span>
          <span v-if="scope.row.status==1">启用</span>
          
        </template> </el-table-column> 
        <!-- fixed="right" -->
    <el-table-column align="center" label="操作" min-width="25%"  fixed="right"> <template scope="scope">
        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button size="small" type="info" @click="handleReset(scope.row)">修改密码
        </el-button>
        <el-button v-if="scope.row.status==0  " size="small" type="warning" @click="handlestop(scope.row)">启用
        </el-button>
        <el-button v-if="scope.row.status==1" size="small" type="warning" @click="handlestop(scope.row)">停用
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="登录账户" prop="username">
        <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入登录账户"></el-input>
        <el-input v-else v-model="form.username" placeholder="请输入登录账户" readonly></el-input>
      </el-form-item>
      <el-form-item v-if="dialogStatus == 'create'" label="密码"  prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input type="text"  placeholder="请输入联系电话" v-model="form.telPhone"> </el-input>
      </el-form-item>  
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible1">
    <el-form :model="form1"   :rules="rules" ref="form1" label-width="100px"> 
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input  type="password"  v-model="form1.oldPassword" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item  label="新密码"  prop="newPassword">
        <el-input type="password" v-model="form1.newPassword" placeholder="请输入新密码" ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword"> 
        <el-input  type="password"  v-model="form1.confirmPassword" placeholder="请输入确认密码" ></el-input>
      </el-form-item> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form1')">取 消</el-button>
      <el-button  type="primary" @click="reset('form1')">确 定</el-button> 
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  resetObj,
  statusObj,
} from 'api/admin/user/index';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
     const validatePass = (rule, value, callback) => {
        // if (value === '') {
        //   callback(new Error('请再次输入密码'));
        // } else if (value.length < 5) {
        //   callback(new Error('密码不能小于5位'));
        // } else 
        if (value !== this.form1.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }; 
    return {
      staticOptions: [{
        value:'',
        label:'全部'
      },{
        value:'1',
        label:'已启用'
      },{
        value:'0',
        label:'已停用'
      }],
      form: {
        username: undefined,
        name: undefined, 
        password: undefined,
        telPhone: undefined,
        status: undefined
      },
      form1:{
        	newPassword: undefined,
          confirmPassword: undefined,
          oldPassword: undefined,
          userId: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
        ,
        oldPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ],newPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符', 
            trigger: 'blur'
          }
        ],confirmPassword: [
           {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
          },
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        status:''
      },
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '', 
      textMap: {
        update: '编辑',
        create: '创建',
        reset: '修改密码'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList(); 
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          // console.log(reponse);
          // this.print(response);
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
    },
    handleFilter() {
      this.print(this.listQuery);
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
     handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleReset(row) {
      this.resetTemp();
       getObj(row.id)
        .then(response => { 
          this.form = response.data; 
          this.dialogStatus = 'reset';
          this.dialogFormVisible1 = true;
        });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs; 
      set[formName].validate(valid => {
        if (valid) { 
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
        username: undefined,
        name: undefined, 
        password: undefined,
        telPhone: undefined,
        status: undefined
      }, 
      this.form1 = {
        newPassword: undefined,
        confirmPassword: undefined,
        oldPassword: undefined,
        userId: undefined
      };
    },
    reset(formName) {
      const set = this.$refs;
      this.form1.userId = this.form.id;      
      set[formName].validate(valid => {
        if (valid) { 
          this.form.password = undefined;
          resetObj(this.form1).then(() => {
            this.dialogFormVisible1 = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        } 
      });
    },
     handlestop(row) {  
      if(row.status == 0){ 
        var status = '启用';
      }else{ 
        var status = '停用';
      } 
      var data = {};
      data.status = row.status; 
      this.$confirm('此操作将'+status+'此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          statusObj(row.id, data).then(() => {
              this.getList();
              this.$notify({
                title: '成功',
                message: '停用成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
    },
  }
}
</script>
