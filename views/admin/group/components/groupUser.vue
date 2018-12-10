<template>
<div>
  <el-form label-width="80px">
    <el-form-item label="姓名">
      <!-- :remote-method="remoteLeaderMethod"  -->
      <el-select v-model="leaders" style="width:100%;" multiple filterable  placeholder="请输入关键词"  :loading="loading">
        <el-option v-for="item in Items" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="组员|下属">
      <el-select v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading">
        <el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary"  @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
 

</div>
</template>

<script>
import {
  page
} from 'api/admin/user/index';
import {
  getUsers,
  modifyUsers
} from 'api/admin/group/index';
// import {
//   page,
//   addObj,
//   getObj,
//   delObj,
//   putObj,
//   resetObj,
//   statusObj,
// } from 'api/admin/user/index';
import { mapGetters } from 'vuex';
export default {
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      lItems: [],
      mItems: [],
      leaders: [],
      members: [],
      list: [],
      loading: false, 
      dialogFormVisible: false,
      dialogStatus: "",  
      tableKey: 0, 
      list: null,
      total: null,
      listLoading: true,
      Items:null,
      form: {
        name:''
      },
       listQuery: {
        page: 1,
        limit: 20,
      },
    }
  },
  created() {
    this.initUsers(); 
    this.getUsers();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    remoteMemberMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        page({
          name: query
        }).then(response => {
          this.mItems = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.mItems = [];
      }
    },
    remoteLeaderMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.loading = false;
        page({
          name: query
        }).then(response => {
          this.lItems = response.data.rows;
          console.log(lItems);
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.lItems = [];
      }
    },
    onSubmit() {
      const vals = {};
      if (this.members.length > 0) vals.members = this.members.join();
      if (this.leaders.length > 0) vals.leaders = this.leaders.join();
      modifyUsers(this.groupId, vals).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers() {
      getUsers(this.groupId).then(response => {
        this.lItems = response.data.leaders;
        this.mItems = response.data.members;
        const mems = [], leas = [];
        for (let i = 0; i < response.data.members.length; i++) {
          mems.push(response.data.members[i].id);
        }
        for (let i = 0; i < response.data.leaders.length; i++) {
          leas.push(response.data.leaders[i].id);
        }
        this.members = mems;
        this.leaders = leas;

        this.listLoading = false;
        console.log(this.lItems[0]);
        console.log(this.mItems);
      });
    },
    getUsers(){  
      page(this.listQuery)
        .then(response => {
          console.log(response);
          this.Items = response.data.rows;
          // this.total = response.data.total;
          // this.listLoading = false;
        }) 
    },
    handleSelectionChange(){

    },
    handleCreate(){
      this.dialogFormVisible = true;
    },
    create(){
        
    },
    handleDelete(){

    },
    batchDelete(){

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  // .el-button{
  //   min-width: 200px;
  // }
  // .el-select{
  //   .el-input__inner{
  //     height:100px!important;
  //   }
  // }
  // input{
  //     height:100px!important;
  // }
</style>
