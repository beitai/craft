<template> 
    <el-menu mode="vertical" theme="dark" :default-openeds="menusName" :default-active="$route.path" :collapse="isCollapse">
      <sidebar-item :routes='permissionMenus'></sidebar-item>
    </el-menu>
</template>


<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'sidebar',
        'permissionMenus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    data(){
      return{
        menusName:[]
      }
    },
    created(){ 
      // 根据路由 获取菜单 有子集的菜单名称，用来默认展开。 default-openeds
      console.log(this.permissionMenus);
      const menus = [];
      menus.push(this.permissionMenus[0].title) 
      for (let i = 0; i < this.permissionMenus[0].children.length; i++) { 
          menus.push(this.permissionMenus[0].children[i].title)
      }
      this.menusName = menus
      // console.log(this.menusName); 
		},

  }
</script>
