<template>
<el-row>
  <el-col :span="24">
    <el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input> 
          <el-tree class="filter-tree"
            :data="treeData" 
            show-checkbox 
            highlight-current
            ref="menuTree"
            :node-key="getTreeNodeKey"
            node-key="id"
            :props="defaultProps" 
            :filter-node-method="filterNode" 
            @check-change="getNodeDataCS"
            @node-click="getNodeData"
            check-strictly
          default-expand-all>
          <!--   -->
    </el-tree>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
      <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%">
      <!-- <el-table :key='tableKey' :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange"> -->
        <el-table-column v-if="groupManager_element" type="selection" width="55"></el-table-column>
        
        <el-table-column width="200px" align="center" label="资源编码">
          <template scope="scope"><span>{{scope.row.code}}</span></template>
        </el-table-column>
        
        <el-table-column width="200px" align="center" label="资源类型">
          <template scope="scope"><span>{{scope.row.type}}</span></template>
        </el-table-column>
        
        <el-table-column width="200px" align="center" label="资源名称"><template scope="scope">
            <span>{{scope.row.name}}</span></template>
        </el-table-column>

        <el-table-column width="200px" align="center" label="资源地址">
              <template scope="scope"><span>{{scope.row.uri}}</span></template>
        </el-table-column>

        <el-table-column width="200px" align="center" label="资源请求类型">
          <template scope="scope"><span>{{scope.row.method}}</span></template> 
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
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      groupManager_menu: false,
      groupManager_element: false,
      tableKey:1
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val); 
    }
  },
  created() {
    this.getList();
    this.groupManager_menu = this.elements['groupManager:menu'];
    this.groupManager_element = this.elements['groupManager:element'];
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
        this.treeData = data;
        this.initAuthoritys();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 根据权限读出对一的节点
    getNodeData(data) {
      this.listQuery.menuId = data.id;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        // console.log('list');
        // console.log(this.list);
        getElementAuthority(this.groupId).then(data => {
          // console.log('用戶权限');
          // console.log(data);
          const obj = {};
          for (let i = 0; i < this.list.length; i++) {
            obj[this.list[i].id] = this.list[i];
          }
          // console.log('obj');
          // console.log(obj);
          const toggle = {};
          for (let i = 0; i < data.data.length; i++) {
            const id = data.data[i]
            if (obj[id] !== undefined && toggle[id] === undefined) {
              this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
               toggle[id] = true;
            } 
          }
          // console.log('toggle');
          // console.log(toggle);
        });
      });
      this.currentId = data.id;
      this.showElement = true;
    },
    getNodeDataCS(data, checked) { 
      if(checked && this.$refs.menuTree.store.nodesMap[data.id].level == '3')
      {
        // console.log("选中")
        // console.log(data.title); 
        this.currentId = data.id; 
        // 根据id查出 查出对应下按钮  用 this.listQuery 的话，全局导致只查最后一个。 
        var menuId = {};
        menuId["menuId"] = data.id
        page(menuId).then(response => { 
          // console.log('查出对应下按钮'); 
          var list =  response.data.rows 
          // this.list =  response.data.rows  这里应为是查询多个， 所有不用 this. 不然只会查最后一个。
          // 查出這個用戶对应的权限，用来做判断，如果空的话添加，不空的话，单击添加权限
          getElementAuthority(this.groupId).then(data => { 
            // console.log('data指对应的权限');
            // console.log(data);
            const obj = {};
            for (let i = 0; i < list.length; i++) {
              obj[list[i].id] = list[i];
            } 
            // console.log('obj');
            // console.log(obj);
            const toggle = {};
            for (let i = 0; i < data.data.length; i++) {
              const id = data.data[i]
              if (obj[id] !== undefined && toggle[id] === undefined) {
                this.$refs.elementTable.toggleRowSelection(obj[data.data[i]]);
                toggle[id] = true;
              } 
            }
            // console.log('查询成功');
            // console.log(toggle);
            // console.log(menuId["menuId"]);  
            // console.log(list);
            // 当按钮权限为空的时候，执行添加。
           if(JSON.stringify(toggle) == '{}')
            {
                console.log("按钮权限为空 ---  进行添加");
                for (let i = 0; i < list.length; i++) {
                  addElementAuthority(this.groupId, {
                    menuId: menuId["menuId"],
                    elementId: list[i].id
                  });
                }
            }
            
          });  
        }); 
        // console.log("执行查看");
        // console.log(data);
        // this.getNodeData(data); 
      } 
      if( checked == false && this.$refs.menuTree.store.nodesMap[data.id].level == '3'){
        // console.log("取消选中"); 
        // console.log(checked);
        this.listQuery.menuId = data.id;
        this.currentId = data.id;
        page(this.listQuery).then(response => {
              this.list = response.data.rows;
            if(this.list != null){
              for (let i = 0; i < this.list.length; i++) {
                removeElementAuthority(this.groupId, {
                  menuId: this.currentId,
                  elementId: this.list[i].id
                });  
              }
            } 
        }); 
        console.log('按钮删除成功');
      } 
    },
    getTreeNodeKey(node) { 
      return node.id;
    }, 
    handleSelectionChange(val, row) {
      // console.log('菜单选中'); 
      // console.log(val);
      // console.log('单个'); 
      // console.log(row); 
      let flag = true;
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          addElementAuthority(this.groupId, {
            menuId: this.currentId,
            elementId: row.id
          });
          flag = false;
          break;
        }
      }
      if (flag) {
        removeElementAuthority(this.groupId, {
          menuId: this.currentId,
          elementId: row.id
        });
      }
    },
    update() {
      this.$emit('closeAuthorityDialog');
      const nodes = this.$refs.menuTree.getCheckedNodes();
      const ids = [];
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      // console.log('ids');
      // console.log(ids);
      modifyMenuAuthority(this.groupId, {
        menuTrees: ids.join()
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
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
         }
        // result.shift(); 
        // console.log('init');
        // console.log(result);
        this.$refs.menuTree.setCheckedKeys(result);
      });
    }
  }
}
</script>
