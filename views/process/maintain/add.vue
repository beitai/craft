<template>

<div class="app-container calendar-list-container">
  <div class="filter-container">
    <!-- 明细和上传  -->
    <el-button v-if="Status=='info' || Status=='upload' " class="filter-item list"  type="primary"  @click="list()">返回列表</el-button>
    <el-tabs v-model="activeName">
        <el-tab-pane  :label="textMap[Status]" name="first">   
        <!-- 新增和编辑 -->
        <el-form :model="form" v-if="Status=='create' ||  Status=='update'"  :rules="rules" ref="form" label-width="100px"  :inline="true" >
          <el-form-item label="u9产品编号"> 
            <el-select v-if="Status=='create'" v-model="form.u9Coding" filterable placeholder="请输入u9产品编号"> 
                <el-option
                v-for="item in Items"
                :key="item.u9Coding"
                :label="item.u9Coding"
                :value="item.u9Coding">
                </el-option>
            </el-select> 
            <el-input  v-if="Status=='update'"  placeholder="" v-model="form.u9Coding" readonly></el-input>
          </el-form-item> 
          <el-form-item label="产品编号">
            <el-input   placeholder="请输入产品编号" v-model="form.productModel"></el-input>
          </el-form-item> 
          <el-form-item  label="客户">
            <el-input class="maxinput"  placeholder="请输入客户名称" v-model="form.customer"></el-input>
          </el-form-item>
          <el-form-item label="文件编号">
            <el-input  placeholder="请输入文件编码" v-model="form.fileCoding" ></el-input>
          </el-form-item>
          <el-form-item label="版本">
            <el-input  placeholder="请输入版本" v-model="form.version"></el-input>
          </el-form-item> 
          <el-form-item label="发放日期">
                <el-date-picker type="datetime" placeholder="选择日期"  v-model="form.issueDate" value-format="yyyy-MM-DD hh:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item> 
          <el-form-item label="更改日期" > 
                <el-date-picker type="datetime" placeholder="选择日期"  v-model="form.updateDate" value-format="yyyy-MM-DD hh:mm:ss" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="刚印"  >
            <el-select v-model="form.steelSeal" placeholder="请选择 ">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="涂喷颜色">
            <el-input  placeholder="请输入涂喷颜色" v-model="form.sprayingColor"></el-input>
          </el-form-item>
          <el-form-item label="移印" prop="region">
            <el-select v-model="form.moveSeal" placeholder="请选择 ">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品POF过塑" prop="region">
            <el-select v-model="form.pofPlasticProducts" placeholder="请选择 ">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="箱过塑" prop="region">
            <el-select v-model="form.casePlastic" placeholder="请选择 ">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="盒过塑" prop="region">
            <el-select v-model="form.boxPlastic" placeholder="请选择 ">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="盒标签1">
            <el-input  placeholder="请输入盒标签1" v-model="form.box1Label" ></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input  placeholder="请输入数量" v-model="form.box1Num" ></el-input>
          </el-form-item>
          <el-form-item label="盒标签2">
            <el-input  placeholder="请输入盒标签2" v-model="form.box2Label"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input  placeholder="请输入数量" v-model="form.box2Num" ></el-input>
          </el-form-item>
          <el-form-item label="箱标签1">
            <el-input  placeholder="请输入箱标签1" v-model="form.case1Label" ></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input  placeholder="请输入数量" v-model="form.case1Num" ></el-input>
          </el-form-item>
          <el-form-item label="箱标签2">
            <el-input  placeholder="请输入箱标签2" v-model="form.case2Label"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input  placeholder="请输入数量" v-model="form.case2Num" ></el-input>
          </el-form-item>
          <el-form-item label="说明书">
            <el-select v-model="form.instructions" placeholder="请选择">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合格证" >
            <el-select v-model="form.qualifiedCertificate" placeholder="请选择">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封口条">
            <el-select v-model="form.sealingPaste" placeholder="请选择">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打包带" >
            <el-select v-model="form.packagingTape" placeholder="请选择">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量(条)">
            <el-input  placeholder="请输入数量" v-model="form.packagingTapeNumber" ></el-input>
          </el-form-item>
          <el-form-item label="封箱胶纸">
            <el-select v-model="form.sealingGummedPaper" placeholder="请选择">
              <el-option label="有" value="有"></el-option>
              <el-option label="无" value="无"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item size="large" class="footer">
                <el-button v-if="Status=='create'" type="primary"  @click="create">保存</el-button> 
                <el-button v-if="Status=='update'" type="primary"  @click="update">保存</el-button>  
                <el-button>取消</el-button>
          </el-form-item>
        </el-form>  
        <el-form :model="form" v-if="Status=='info' || Status=='upload'"  :rules="rules" ref="form" label-width="100px"  :inline="true" class="info">
          <el-form-item  label="U9产品编号">
            <span  v-html="form.u9Coding"></span>
          </el-form-item>
          <el-form-item label="产品编号">
                <span v-html="form.productModel"></span> 
          </el-form-item> 
          <el-form-item  label="客户">
                <span  class="maxspan" v-html="form.customer"></span>  
          </el-form-item>
          <el-form-item label="文件编号">
                <span v-html="form.fileCoding"></span>  
          </el-form-item>
          <el-form-item label="版本">
                <span v-html="form.version"></span>   
          </el-form-item> 
          <el-form-item label="发放日期">
                <span v-html="form.issueDate"></span>   
          </el-form-item> 
          <el-form-item label="更改日期" > 
                <span v-html="form.updateDate"></span>   
          </el-form-item>
          <el-form-item label="刚印"  >
                <span v-html="form.steelSeal"></span>    
          </el-form-item>
          <el-form-item label="涂喷颜色">
                <span v-html="form.sprayingColor"></span>     
          </el-form-item>
          <el-form-item label="移印" prop="region">
                <span v-html="form.moveSeal"></span>      
          </el-form-item>
          <el-form-item label="产品POF过塑" prop="region">
              <span v-html="form.pofPlasticProducts"></span>       
          </el-form-item>
          <el-form-item label="箱过塑" prop="region">
              <span v-html="form.casePlastic"></span>        
          </el-form-item>
          <el-form-item label="盒过塑" prop="region">
              <span v-html="form.boxPlastic"></span> 
          </el-form-item>
          <el-form-item label="盒标签1">
              <span v-html="form.box1Label"></span>  
          </el-form-item>
          <el-form-item label="数量">
              <span v-html="form.box1Num"></span>   
          </el-form-item>
          <el-form-item label="盒标签2">
              <span v-html="form.box2Label"></span>    
          </el-form-item>
          <el-form-item label="数量">
              <span v-html="form.box2Num"></span>    
          </el-form-item>
          <el-form-item label="箱标签1">
              <span v-html="form.case1Label"></span>   
          </el-form-item>
          <el-form-item label="数量">
              <span v-html="form.case1Num"></span>    
          </el-form-item>
          <el-form-item label="箱标签2">
              <span v-html="form.case2Label"></span>     
          </el-form-item>
          <el-form-item label="数量">
              <span v-html="form.case2Num"></span>  
          </el-form-item>
          <el-form-item label="说明书">
              <span v-html="form.instructions"></span>    
          </el-form-item>
          <el-form-item label="合格证" >
              <span v-html="form.qualifiedCertificate"></span>    
          </el-form-item>
          <el-form-item label="封口条">
              <span v-html="form.sealingPaste"></span>
          </el-form-item>
          <el-form-item label="打包带" >
              <span v-html="form.packagingTape"></span>  
          </el-form-item>
          <el-form-item label="数量(条)">
              <span v-html="form.packagingTapeNumber"></span>  
          </el-form-item>
         <el-form-item label="封箱胶纸">
              <span v-html="form.sealingGummedPaper"></span>   
          </el-form-item>   
          <el-form-item label="面料/底料">
              <!-- <span class="maxspan" v-html="form.shellFabric+'/'+form.bedCharge"></span>   -->
              <span class="maxspan" v-html="form.bedCharge"></span>  
          </el-form-item>
          <el-form-item label="盒号">
              <span v-html="form.boxNumber"></span>   
          </el-form-item> 
          <el-form-item label="箱号">
              <span v-html="form.caseNumber"></span>  
          </el-form-item>
          <el-form-item label="子件料号">
              <span class="maxspan" v-html="form.childThingNumber"></span>   
          </el-form-item>
          <template v-if="Status=='info'">
              <el-form-item label="创建人">
                  <span v-html="form.crtName"></span>   
              </el-form-item> 
              <el-form-item label="创建时间">
                  <span v-html="form.crtTime"></span>  
              </el-form-item>
                <el-form-item label="最后更新人">
                  <span v-html="form.updName"></span>   
              </el-form-item> 
              <el-form-item label="最后更新时间">
                  <span v-html="form.updTime"></span>  
            </el-form-item> 
          </template>
          <el-form-item label="打商标">  
              <img :src="form.process1PictureName">
          </el-form-item> 
          <el-form-item label="钻小口"> 
              <img :src="form.process2PictureName"> 
          </el-form-item> 
          <el-form-item label="移动喷码"> 
              <img :src="form.process3PictureName"> 
          </el-form-item> 
          <el-form-item label="包装"> 
              <img :src="form.process4PictureName">  
          </el-form-item> 
         </el-form> 

        </el-tab-pane> 
    </el-tabs>
    <!--工艺图纸上传-->
    <el-tabs v-model="activeName1" v-if="Status=='upload'">
        <el-tab-pane  label="工艺图纸上传" name="first" >   
          <el-form :model="form"  :rules="rules" ref="form" label-width="100px"  class="upload" > 
           <el-form-item label="打商标">
              <el-input   placeholder="点击按钮开始上传" v-model="form.process1PictureName" readonly ></el-input>
              <el-button  size="small" type="info" @click="upload">开始上传</el-button> 
            </el-form-item> 
            <el-form-item  label="钻小孔">
              <el-input   placeholder="点击按钮开始上传" v-model="form.process2PictureName" readonly ></el-input>
              <el-button  size="small" type="info"  @click="upload">开始上传</el-button> 
            </el-form-item>
            <el-form-item label="移印喷码">
              <el-input  placeholder="点击按钮开始上传"  v-model="form.process3PictureName" readonly></el-input>
              <el-button  size="small" type="info"   @click="upload">开始上传</el-button> 
            </el-form-item>
            <el-form-item label="包装">
              <el-input  placeholder="点击按钮开始上传"   v-model="form.process4PictureName" readonly ></el-input>
              <el-button  size="small" type="info" @click="upload">开始上传</el-button> 
            </el-form-item> 
          </el-form>
      </el-tab-pane> 
    </el-tabs>
    <!-- 开始上传 -->
    <el-dialog :title="textMap[Status]"  :visible.sync="dialogFormVisible"> 
      <el-upload
          class="upload-demo"
          drag
          action="http://192.168.249.211:8765/api/product/process/ftpUploadImg"
          :http-request="uploadFile"
          ref="upload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>  
    </el-dialog> 

    </div>
</div>
</template>

<script>
import {
  // page,
  addObj,
  // getObj,
  // delObj,
  putObj, 
  // query,
  // restore,
  saveQuery,
  info,
  uploadObj
} from "api/process/maintain/index";
import { mapGetters } from "vuex";
export default {
  name: "user",
  data() {
    return {
      activeName: "first",
      activeName1: "first", 
      Items:undefined,
      form: {
        status:undefined,
        u9Coding: undefined,
        productModel: undefined,
        customer: undefined,
        version: undefined,
        fileCoding: undefined, 
        issueCoding:undefined,
        issueDate: undefined,
        updateDate: undefined,
        steelSeal: undefined,
        moveSeal: undefined,
        pofPlasticProducts: undefined, 
        boxPlastic: undefined,
        casePlastic: undefined,
        box1Label: undefined,
        box1Num: undefined, 
        box2Label: undefined,
        box2Num: undefined,
        case1Label: undefined,
        case1Num: undefined, 
        case2Label: undefined, 
        case2Num: undefined,
        qualifiedCertificate: undefined,
        sealingPaste: undefined,
        packagingTape: undefined, 
        packagingTapeNumber: undefined,
        sealingGummedPaper: undefined, 
        shellFabric:undefined,
        bedCharge:undefined,
        boxNumber:undefined,
        caseNumber:undefined,
        childThingNumber:undefined,
        crtName:undefined,
        crtTime:undefined,
        updName:undefined,
        updTime:undefined, 
        process1PictureName:undefined,
        process2PictureName:undefined,
        process3PictureName:undefined,
        process4PictureName:undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ]
      },
      // list: null,
      // total: null,
      // listLoading: true,
      // listQuery: {
      //   page: 1,
      //   limit: 10,
      //   name: undefined
      // }, 
      dialogFormVisible: false,
      Status: "",
      // userManager_btn_edit: false,
      // userManager_btn_del: false,
      // userManager_btn_add: false,
      textMap: {
        update: "编辑工艺品",
        create: "新增工艺品",
        info: "工艺信息",
        upload: "工艺信息"
      },
      tableKey: 0
    };
  },
  created() {
    this.getList();
    // this.userManager_btn_edit = this.elements["userManager:btn_edit"];
    // this.userManager_btn_del = this.elements["userManager:btn_del"];
    // this.userManager_btn_add = this.elements["userManager:btn_add"];
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: { 
      getList() {  
        if(this.$route.query.pro=='create'){  
            saveQuery().then(response => {
              console.log(response);
              this.Items = response.data.dataList; 
              this.Status = 'create'; 
            }); 
        }else if(this.$route.query.pro=='update'){ 
            info(this.$route.query.id).then(response => {
              this.form = response.data; 
              this.Status = 'update';
           });    
        }else if(this.$route.query.pro=='info'){ 
            info(this.$route.query.id).then(response => {
              console.log(response);
              this.form = response.data; 
              this.Status = 'info';
           });    
        }else if(this.$route.query.pro=='upload'){ 
            info(this.$route.query.id).then(response => {
              console.log(response);
              this.form = response.data; 
              this.Status = 'upload';
           });    
        }else{
          window.location.href="/#/processManager/maintainManager";   
        }
    }, 
    time(value){ 
        var date = new Date(value);
        var   Y = date.getFullYear()
        var   m = date.getMonth() + 1
        var   d = date.getDate()
        var   H = date.getHours()
        var   i = date.getMinutes();
        var   s = date.getSeconds();
        if (m < 10) {m = '0' + m;}
        if (d < 10) {d = '0' + d;}
        if (H < 10) {H = '0' + H;}
        if (i < 10) {i = '0' + i;} 
        var t = Y+'-'+m+'-'+d+' '+H+':'+i+":"+s;
        return t;
    }, 
    create() {
         // 转化时间的格式。
        if(this.form.updateDate!=null)
        {this.form.updateDate = this.time(this.form.updateDate); 
        }else if(this.form.issueDate!=null){
          this.form.issueDate = this.time(this.form.issueDate);
        }
          addObj(this.form).then(() => { 
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            window.location.href="/#/processManager/maintainManager"; 
          }); 
    }, 
    update(formName) {
       // 转化时间的格式。
          if(this.form.updateDate!=null)
          {this.form.updateDate = this.time(this.form.updateDate); 
          }else if(this.form.issueDate!=null){
            this.form.issueDate = this.time(this.form.issueDate);
          }
      // const set = this.$refs;
      // set[formName].validate(valid => {
      //  if (valid) {
          putObj(this.form.id, this.form).then(() => { 
      // this.dialogFormVisible = false; 
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            }); 
            window.location.href="/#/processManager/maintainManager"; 
          });
        // } else {
        //   return false;
        // }
      // });
    },
    // 上传
    upload(){ 
      this.Status = 'upload';
      this.dialogFormVisible = true;
    },
    uploadFile(file){
        console.log("上传");
        console.log(file);
        // this.formDate.append('file', file.file);
        uploadObj(file.file)
                  .then(response =>{
                    console.log("成功");
                    console.log(response);
              })
    },list(){ 
       window.location.href="/#/processManager/maintainManager";   
    }   
  } 
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.el-input,
.el-select { 
  width: 500px !important;
}
.maxinput { 
  width: 1115px !important;
}
.footer {
  width: 100%;
  text-align: center;
}
.list{
  position: absolute;
  right:20px;
  z-index: 1;
}
.info{
  padding-top:20px; 
  border:1px solid;
} 
.info .el-button{
    min-width: 200px;
}
.info span{
  display: inline-block;
  width: 500px;
  height: 38px;
  text-align: center;  
  border:1px solid;
}
.info .maxspan{
  display: inline-block;
  width: 1115px;
  text-align: center; 
}
.info img{
  width: 300px;
  height: 170px;
  margin: 0 100px;
}
.upload .el-button{
    min-width: 200px; 
    height:38px;
}
</style>
