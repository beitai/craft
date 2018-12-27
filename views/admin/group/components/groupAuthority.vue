<template>
<el-row>
  <el-col :span="24"> 
    <el-button type="primary"  @click="update">保存</el-button>
  </el-col> 
  <el-col :span="24" style='margin-top:15px;'> 
      <!-- <span>选择的值为: {{ result }}</span> -->
      <el-table ref="elementTable" :data="list" border fit    style="width: 100%">
      <!-- <el-table :key='tableKey' :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange"> -->
         <!-- <el-checkbox  v-model="result" :value="scope.row.id" @change="handleCheckAllChange(1,scope.row.id)"></el-checkbox> -->
        <!-- <el-table-column   align="center" label="系统">
          <template scope="scope"><span>
            <input type="checkbox"  :value="scope.row.id" v-model="result"  @change="handleCheckAllChange(1,scope.row.id)">
            {{scope.row.title}}</span>
          </template>
        </el-table-column> -->
        
        <el-table-column   align="center" label="模块">
          <template scope="scope">
            <span class="list0" v-for="item in scope.row.children"> 
                <!-- <el-checkbox v-model="result" :value="item.id" @change="handleCheckAllChange(item.id)"></el-checkbox> -->
                <input type="checkbox" @change="handleCheckAllChange(item,item.id)" :value="item.id" v-model="result">{{item.title}}
            </span>    
          </template>
        </el-table-column>

        <el-table-column   align="center" label="操作">
          <template scope="scope">
            <span class="list" v-for="rows in scope.row.children"> 
              <span class="list_content" v-for="item in rows.children"> 
                  <!-- <el-checkbox v-model="result" :value="item.id"  @change="handleCheckAllChange(item.id)"></el-checkbox> -->
                  <input type="checkbox" @change="handleCheckAllChange(item,item.id)"  :value="item.id" v-model="result">{{item.title}}
              </span>
            </span> 
          </template>
        </el-table-column>

      </el-table> 
  </el-col>
 
</el-row>

</template>
<script>
import {
  fetchTree
} from 'api/admin/menu/index';
import {
  page
} from 'api/admin/element/index';
import {
  removeElementAuthority,
  addElementAuthority,
  getElementAuthority,
  modifyMenuAuthority,
  getMenuAuthority
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
export default {
  name: 'menu',
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      list1: null,
      total: null,
      result:null,    
      data: [],
      checkAllBig:[],
      checkAll:[],
      checkOne:[],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }, 
      tableKey:1
      //   currentId: -1
    }
  }, 
  created() {
    this.getList(); 
    // 这个用户对应的权限
    // console.log('elements');
    // console.log(this.elements);
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.list = data;
        // console.log("表单的数据");
        // console.log(this.list);

        // this.data=res.data;
        //           for(var i=0;i<this.data.length;i++){//遍历选择的内容
        // //            if(this.data[i].ischecked==1){
        //                  this.checkAllBig.push(this.data[i].id)
        // //               }
        //              for(var j=0;j<this.data[i].children.length;j++){
        //     //            if(this.data[i].children[j].ischecked==1){
        //                    this.checkAll.push(this.data[i].echildren[j].id)
        // //               }
        //               for(var k=0;k<this.data[i].echildren[j].echildren.length;k++){
        // //                    if(this.data[i].eventtype[j].operation[k].ischecked==1){
        //                     this.checkOne.push(this.data[i].echildren[j].echildren[k].id);}
        // //                    }
        //                }
        //            }
        //         console.log(checkAllBig);
        //         console.log(checkAll);
        //         console.log(checkOne);
        this.initAuthoritys();
      });
    }, 
    // 初始化权限
    initAuthoritys() {
      getMenuAuthority(this.groupId).then(data => {
        // console.log('init');
        // console.log(data);
        const result = [];
        for (let i = 0; i < data.data.length; i++) {
          result.push(data.data[i].id); 
         } ;
         this.result = result; 
        // console.log('init');
        // console.log(result);
        // this.$refs.menuTree.setCheckedKeys(result);
      });
    },
    handleCheckAllChange(row,id){  
      if(row.children != null){
        // console.log("这个是二级菜单") 
        if(this.result.indexOf(id) != '-1'){
              //  选择没有的进行添加
              // console.log(id);
              // console.log("选择状态");  
              for(var j=0; j<row.children.length; j++){       
                   if(this.result.indexOf(row.children[j].id) == '-1'){
                      this.result.push(row.children[j].id)
                  }
              }
        }else{
            // 没选中，全部取消掉
            // console.log(id);
            // console.log('没选中状态');
          for(var j=0; j<row.children.length; j++){       
               if(this.result.indexOf(row.children[j].id) != '-1'){
                 var index = this.result.indexOf(row.children[j].id)
                 // console.log(index);
                this.result.splice(index,1);
              }
          }
        }
      }else{
       console.log("这个是三级菜单");
        //  当里面没的时候进行添加。并且选择第三层时进行第二层添加。 
        // console.log(row); 
        if(this.result.indexOf(row.parentId) == '-1'){
            this.result.push(row.parentId); 
        } 
      }   
    },
    update(){
      this.$emit('closeAuthorityDialog');
      // const nodes = this.$refs.menuTree.getCheckedNodes(); 
      // const ids = [];
      // for (let i = 0; i < this.result.length; i++) { 
      //   ids.push(this.result[i]);
      // } 

      // 当里面没有 第一个id时添加 console.log(this.result.indexOf(this.list[0].id) != '-1');
      if(this.list[0].parentId == "-1" && this.result.indexOf(this.list[0].id) == '-1'){
          this.result.push(this.list[0].id); 
      } 
      modifyMenuAuthority(this.groupId, {
        menuTrees: this.result.join()
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
        setTimeout(location.reload(),2000);
      });
    }
    
  }
}
</script>


<style scoped>
/* .el-table .cell{
  padding:0px!important;
} */
.list0{
    /* height: 100px;
    line-height: 100px; */
    display: block;
    border-bottom: 1px solid #dfe6ec;
    padding-bottom:60px;
    padding-top:60px;
    min-height:175px;
}
.list{
    /* height: 100px;
    line-height: 100px; */
    display: block;
    border-bottom: 1px solid #dfe6ec;
    padding-bottom:20px;
    padding-top:20px;
    min-height:175px;
}
.list:last-child, .list0:last-child
{ 
    border-bottom:none;
}
.list_content{
  /* height:30px;
  line-height: 30px; */
  display: block;
  padding-bottom:10px;
}
.list_content:last-child
{ 
    border-bottom:none;
}
</style>
