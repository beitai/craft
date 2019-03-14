<template>
<div class="login-container">
  <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
    <h3 class="title">格莱利工艺信息管理系统</h3>
    <el-form-item prop="username">
      <span class="svg-container"><icon-svg icon-class="jiedianyoujian"></icon-svg></span>
      <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账户"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <span class="svg-container"><icon-svg icon-class="mima"></icon-svg></span>
      <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
    </el-form-item>
     <el-form-item prop="picLyanzhengma">
      <span class="svg-container"><icon-svg icon-class="mima"></icon-svg></span>
      <!-- <el-input name="code" type="text" @keyup.enter.native="handleLogin"  v-model="loginForm.code"   autoComplete="on" placeholder="验证码" style="width:200px;"></el-input>
      <img class="yzm" :src="yzm" @click="yzmRefresh">  -->
      <!-- @blur="checkLpicma" -->
      <el-input  type="text" placeholder="验证码" style="width:200px;"   v-model="loginForm.picLyanzhengma"></el-input>
      <input class="yzm" type="button"  @click="createCode"  v-model="checkCode" />
      {{this.picLyanzhengma}}   
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form-item>
  </el-form>

  <el-dialog title="第三方验证" :visible.sync="showDialog">
    邮箱登录成功,请选择第三方验证
    <social-sign></social-sign>
  </el-dialog>

</div>
</template>

<script>
import socialSign from './socialsignin'; 
export default {
  // components: {
  //   socialSign, 
  // },
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
     const validateyzm = (rule, value, callback) => {  
       value =   value.toUpperCase();
       if (value.length == 0) {
        callback(new Error('验证码不能为空'));
       } else if (value != this.checkCode) {
          callback(new Error('验证码错误'));
       } else {
          callback();
       }
      //  console.log(value);
      //  console.log(this.checkCode);
      }; 
    return {
      loginForm: {
        username: '',
        password: '',
        picLyanzhengma: ''
      },
      picLyanzhengma:'',
      checkCode:'',
      yzm:'',
      loginRules: {
        username: [{
          required: true,
          message: '账户不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        picLyanzhengma: [{
          // required: true,
          // message: '验证码不能为空',
          // trigger: 'blur'
          required: true,
          trigger: 'blur',
          validator: validateyzm
        }],
      },
      loading: false,
      showDialog: false
    }
  },created() {
    // window.addEventListener('hashchange', this.afterQRScan);  

    // 获取配置里面的公共api 用来做图片的显示。 
    // this.baseUrl = process.env.BASE_API;       
    // this.baseUrl = ApiUrl;
    // this.yzm = this.baseUrl+'/api/auth/jwt/getcode';
    // apiUrl 是全局定义的 ip和端口 路径。在index.html引用然后可以在任何地方使用
    // console.log('測試 測試');
    // console.log(ApiUrl);

    this.createCode();
  }, 
  methods: { 
    // 图片验证码
    createCode(){
      var code = ""; 
      var codeLength = 4;//验证码的长度 
      var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 
         'S','T','U','V','W','X','Y','Z');
      for(var i = 0; i < codeLength; i++) {
       var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35） 
       code += random[index];//根据索引取得随机数加到code上 
      } 
      this.checkCode = code;//把code值赋给验证码 
    }, 
    // checkLpicma(){   
    //   this.checkCode.toUpperCase();
    // },
    // yzmRefresh() {  
    //   this.yzm  = this.baseUrl+'/api/auth/jwt/getcode?t='+new Date().getTime(); 
    // },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true; 
          this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({
              path: '/'
            });
            // this.showDialog = true;
          }).catch(() => {
            this.loading = false;
          });
          // this.$http.post('/oauth/token', {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // }, {
          //   headers: {
          //     Authorization: 'Basic enV1bDp6dXVs'
          //   },
          //   emulateJSON: true,
          //   emulateHTTP: true
          // }).then(function(response) {
          //   if (response.status === 200) {
          //     this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
          //       this.loading = false;
          //       this.$router.push({
          //         path: '/'
          //       });
          //       // this.showDialog = true;
          //     }).catch(() => {
          //       this.loading = false;
          //     });
          //   } else {
          //     this.loading = false;
          //     return false;
          //   }
          // }, function(error) {
          //   console.log('server error!!');
          //   this.loading = false;
          //   return false;
          // });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, '', originUrl);
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert('第三方登录失败');
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' });
      //   });
      // }
    }
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
}

.login-container {
    @include relative;
    height: 100vh;
    background-color: #2d3a4b;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: #eeeeee;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        box-sizing:content-box;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: #889aa4;
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: #eeeeee;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: bold;
    }
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px;
        margin: 120px auto;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .forget-pwd {
        color: #fff;
    }
    .yzm{
      position:absolute;
      top:4px;
      right:4px;
      width: 100px;
      height: 40px;
      background: #f2f2f5;
      color: #053d87;
      font-size: 18px;
      letter-spacing: 5px;
      outline:none;
    }
}
</style>
