<template>

<el-menu class="navbar" mode="horizontal">

  <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
  <levelbar></levelbar>
  <tabs-view></tabs-view>
  <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
  <screenfull class='screenfull'></screenfull>
  <span class="username">{{name}}</span>
  <el-dropdown class="avatar-container" trigger="click">
    
    <div class="avatar-wrapper"> <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> <i class="el-icon-caret-bottom"></i> </div>
    <el-dropdown-menu class="user-dropdown" slot="dropdown">
      <router-link class='inlineBlock' to="/">
        <el-dropdown-item> 首页 </el-dropdown-item>
      </router-link> 
      <el-dropdown-item ><span @click="handleReset" style="display:block;">修改密码 </span></el-dropdown-item>
      <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

  <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form"   :rules="rules" ref="form" label-width="100px"> 
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input  type="password"  v-model="form.oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item  label="新密码"  prop="newPassword">
          <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"> 
          <el-input  type="password"  v-model="form.confirmPassword" placeholder="请输入确认密码" ></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button  type="primary" @click="reset('form')">确 定</el-button> 
      </div>
  </el-dialog> 

</el-menu>
 
   


</template>

<script>
import {
  mapGetters
} from 'vuex';
import { 
  resetObj, 
} from 'api/admin/user/index';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Hamburger from 'components/Hamburger';
import Screenfull from 'components/Screenfull';
import ErrorLog from 'components/ErrLog';
import errLogStore from 'store/errLog';
export default {
  components: {
    Levelbar,
    TabsView,
    Hamburger,
    ErrorLog,
    Screenfull
  },
  data() {
      const validatePass = (rule, value, callback) => {
       if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }; 
    return {
      log: errLogStore.state.errLog,
      dialogFormVisible:false, 
      form: {
        newPassword: undefined,
        confirmPassword: undefined,
        oldPassword: undefined,
        userId: undefined
      },
       rules: {
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
    }
  },
  computed: { ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'id'
    ])
  }, 
  methods: { 
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut')
        .then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
    },
    handleReset() { 
        this.dialogFormVisible = true;
    },
    reset(formName) {
      const set = this.$refs;
      console.log('id输出？？'); 
      console.log(this.id);
      this.form.userId = this.id;      
      set[formName].validate(valid => {
        if (valid) { 
          this.form.password = undefined;
          resetObj(this.form).then(() => {
            this.dialogFormVisible = false; 
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        } 
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .errLog-container {
        display: inline-block;
        position: absolute;
        right: 150px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        // right: 150px; 
        top: 16px;
        color: red;
    }
    .username{
        position: absolute;
        right: 120px;
        top: 2px; 
    }
    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;
        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }
            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}
</style>
