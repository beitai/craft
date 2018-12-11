<template>
<div class="app-container calendar-list-container">
   <template v-if="displayState=='list'">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <!--   -->
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="角色名称" min-width="23%"  > <template scope="scope"     >
          <span>{{scope.row.name}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="角色备注" min-width="23%"> <template scope="scope">
              <span>{{scope.row.description}}</span>
            </template> </el-table-column>
      <el-table-column  align="center" label="创建时间" min-width="24%"> <template scope="scope">
              <span>{{scope.row.crtTime}}</span>
            </template> </el-table-column> 
      <el-table-column align="center" label="操作"   min-width="30%" fixed="right"><template scope="scope">
        <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button  size="small" type="info"  @click="handlerUser(scope.row)">关联用户
        </el-button>
        <el-button  size="small" type="info" @click="handlerAuthority(scope.row)">分配权限
        </el-button> 
        <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px"> 
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item label="角色备注" prop="description">
        <el-input v-model="form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- <el-dialog :title="dialogUserName" size="large" :visible.sync="dialogUserVisible">
    <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
  </el-dialog> -->
  <el-dialog :title="dialogAuthorityName"  :visible.sync="dialogAuthorityVisible">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>


   <div v-if="displayState=='user'">
    <h2 style="border-bottom: 1px dotted;padding-bottom: 20px;">角色：{{groupName}}</h2> 
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate1" type="primary" icon="pull">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="batchDelete" type="danger" icon="minus">批量删除</el-button>
      <el-button class="filter-item" style="margin-left: 10px;float:right" @click="getList" type="primary" icon="puls">返回列表</el-button>
    </div> 
    <el-table :key='tableKey' :data="lItems" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" >
      </el-table-column>
      <el-table-column  align="center" label="用户账号"> <template scope="scope"> 
          <span>{{scope.row.username}}</span>
        </template> </el-table-column>
      <el-table-column  align="center" label="用户名"> <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template> </el-table-column>
      <el-table-column  align="center" label="联系电话"> <template scope="scope">
              <span>{{scope.row.telPhone}}</span>
            </template> </el-table-column> 
      <el-table-column align="center" label="操作" width="350"  fixed="right"><template scope="scope"> 
        <el-button  size="small" type="danger" @click="handleDeleteUser(scope.row)">删除 
        </el-button>
      </template>
      </el-table-column>
    </el-table>
     <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page.sync="listQuery1.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery1.limit" layout="total, sizes, prev, pager, next, jumper" :total="total1"> </el-pagination>
    </div>

    <el-dialog title="分配用户" :visible.sync="dialogFormVisible1">   
      <el-form :model="form1"   :rules="rules" ref="form1" label-width="100px"> 
        <el-form-item label="姓名" prop="leaders">
            <el-select v-model="form1.leaders"  clearable filterable  remote  placeholder="用户名" style="width: 100%;" class="filter-item"> 
                      <el-option
                        v-for="item in Items"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
            </el-select>  
         </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUser('form1')">取 消</el-button>
          <el-button type="primary" @click="createUser('form1')">确 定</el-button>
        </div>
    </el-dialog> 
  </div>


</div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from "api/admin/group/index"; 
import { mapGetters } from "vuex"; 
import {
  getUsers,
  modifyUsers,
  addUsers,
  delUsers,
  getAllUsers
} from 'api/admin/group/index';
export default {
  name: "group",
   components: {
    'group-user': () => import('./components/groupUser'),
    'group-authority': () => import('./components/groupAuthority')
  },
  data() {
     const validate = (rule, value, callback) => {
        if (value == null) {
          callback(new Error('请选择授权的用户'));
        } else {
          callback();
        }
      }; 
    return {
      dialogUserVisible: false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '权限分配',
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: 1,
        parentId:-1
      }, 
      currentId: -1,
      rules: { 
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        leaders: [
          {
            // required: true,
            // message: "请选择用户",
            trigger: "blur",
            validator: validate
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10, 
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "", 
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,

      groupName:'',
      lItems: [],
      mItems: [],
      leaders: [],
      members: [], 
      loading: false, 
      dialogFormVisible1: false,  
      Items:null,
      form1: {
        leaders:'', 
      },
       listQuery1: {
        page: 1,
        limit: 10,
      },
      total1: null,
      displayState:'list',
      del:{
        list:[]
      }, 
      delpro:{
        id:''
      },
      total1: null,
    };
  },
  created() {
    this.getList(); 
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total; 
        // console.log(response);
        this.listLoading = false;
      });

      this.displayState = "list"; 
    },
    handleFilter() {
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
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    create(formName) {
      console.log("测试");
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
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
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
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
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: 1,
        parentId:-1
      };
    },
    handlerAuthority(row) {
      this.dialogAuthorityVisible = true;
      this.dialogAuthorityName = "权限分配";
      this.dialogAuthorityName += "(角色:"+row.name+")";
      this.currentId = row.id;
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId;
        // this.$refs.groupUser.groupId = row.id;
        this.$refs.groupAuthority.initAuthoritys();
      }
    },
    handlerUser(row) { 
      // this.dialogUserVisible = true;
      // this.dialogUserName = "关联用户";
      // this.dialogUserName += "(角色:"+row.name+")";
      // this.currentId = row.id;
      // if (this.$refs.groupUser !== undefined) {
      //   this.$refs.groupUser.groupId = this.currentId;
      //   // this.$refs.groupUser.groupId = row.id;
      //   this.$refs.groupUser.initUsers();
      // }

      this.displayState = 'user'
      // this.groupId = this.currentId;
      this.groupId = row.id;
      this.groupName = row.name
      this.initUsers();
      this.getAllUsers()
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    },
    initUsers() {
      getUsers(this.groupId,this.listQuery1).then(response => {
        this.lItems = response.data.rows;
        this.total1 = response.data.total; 
        const mems = [];
        for (let i = 0; i < response.data.total; i++) {
          mems.push(response.data.rows[i].id);
        }
        
        // this.mItems = response.data.rows;
        // const leas = [];
        // for (let i = 0; i < response.data.total; i++) {
        //   leas.push(response.data.rows[i].id);
        // }
        this.members = mems;
        // this.leaders = leas;
        this.listLoading = false;
        
        console.log("获取已有的用户。");
        console.log(this.lItems);
        // console.log(this.mItems);
      });
    },
     getAllUsers(){  
      getAllUsers(this.listQuery)
        .then(response => { 
          this.Items = response.data.rows; 
        }) 
    }, 
    handleCreate1(){ 
      this.dialogFormVisible1 = true;
      this.form1.leaders = null;
    },
    cancelUser(formName) { 
      this.dialogFormVisible1 = false; 
    },
    createUser(formName) {
      console.log('添加')
      console.log(this.groupId);
      console.log(this.form1); 
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          modifyUsers(this.groupId,this.form1).then(() => {
            this.dialogFormVisible1 = false;
            this.initUsers();
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    handleDeleteUser(row){
      this.delpro.id = row.id 
      this.del.list.push(this.delpro);
      console.log('删除。。');
      console.log(this.del);
      this.$confirm("此操作将删除该用户授权, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delUsers(this.groupId,this.del).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          this.initUsers(); 
        });
      });
    },
    handleSelectionChange(val){
        this.multipleSelection = val;
        var aa = [];
        val.forEach(row => {
          var bb = {};
          bb.id = row.id;  
          aa.push(bb); 
        });
        this.del.list = aa; 
        // console.log(this.del); 
    },
    batchDelete(row){
        // console.log('批量删除');
        // console.log(this.del);
        var list = this.del.list
        this.$confirm('此操作将删除选中的用户授权, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delUsers(this.groupId,this.del)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message:'删除成功',
                  type: 'success',
                  duration: 2000
                });
              this.initUsers();
              });
          });
    },
    handleSizeChange1(val) {
      this.listQuery1.limit = val;
      this.initUsers();
    },
    handleCurrentChange1(val) {
      this.listQuery1.page = val;
      this.initUsers();
    },
    
  }
};
</script>


