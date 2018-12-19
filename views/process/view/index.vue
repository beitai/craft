<template>
<div class="app-container calendar-list-container">
  <div class="filter-container"> 
    <template  v-if="Status=='list'">  
      <el-select v-model="listQuery.u9Coding"  clearable filterable  remote :remote-method="selevtValue"  placeholder="U9产品编码" style="width: 200px;" class="filter-item"> 
              <el-option
                v-for="item in Items"
                :key="item.u9Coding"
                :label="item.u9Coding+'('+item.productModel+')'"
                :value="item.u9Coding">
              </el-option>
      </el-select>  
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户" v-model="listQuery.customer"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column align="center" label="U9产品编码" width="200" > <template scope="scope" >
                <span  @click="info(scope.row)" style="cursor:pointer;">{{scope.row.u9Coding}}</span>
              </template> </el-table-column>
          <el-table-column  align="center" label="产品型号" width="150"> <template scope="scope">
              <span>{{scope.row.productModel}}</span>
            </template> </el-table-column>
          <el-table-column  align="center" label="客户" width="80"> <template scope="scope">
                  <span>{{scope.row.customer}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="版本" width="80"> <template scope="scope">
                  <span>{{scope.row.version}}</span>
                </template> </el-table-column> 
          <el-table-column  align="center" label="文件编码" width="200"> <template scope="scope">
                  <span>{{scope.row.fileCoding}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="盒号" width="200"> <template scope="scope">
                <span>{{scope.row.boxNumber}}</span>
              </template> </el-table-column>
          <el-table-column  align="center" label="箱号" width="200"> <template scope="scope">
                  <span>{{scope.row.caseNumber}}</span>
                </template> </el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right"> <template scope="scope"> 
            <el-button v-if=" maintainManager_uploadView" size="small" type="info" @click="handupload(scope.row)">上传
            </el-button> 
            <el-button size="small" type="info" @click="info(scope.row)">明细
            </el-button>  
        </template></el-table-column> 
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </template>


   <el-button v-if="Status!='list'" class="filter-item list"  type="primary"  @click="handleFilter">返回列表</el-button>
   <el-tabs v-model="activeName" :model="form" v-if="Status!='list'">
      <el-tab-pane  label="工艺信息" name="first"> 
          <el-form   :rules="rules" ref="form" label-width="100px"  :inline="true" class="info">
          <el-row> 
              <el-form-item  label="U9产品编号" >
                <span  v-html="form.u9Coding"></span>
              </el-form-item>
              <el-form-item label="产品编号" >
                    <span v-html="form.productModel"></span> 
              </el-form-item> 
              <el-form-item  label="客户">
                    <span v-html="form.customer"></span>  
              </el-form-item>
            </el-row> 

            <el-row> 
            <el-form-item label="文件编号" >
                  <span v-html="form.fileCoding"></span>  
            </el-form-item>
            <el-form-item label="版本" >
                  <span v-html="form.version"></span>   
            </el-form-item> 
            <el-form-item label="发放日期" >
                  <span v-html="form.issueDate"></span>   
            </el-form-item> 
            </el-row>
             
            <el-row> 
            <el-form-item label="更改日期" >  
                  <span v-html="form.updateDate"></span>   
            </el-form-item>
            <el-form-item label="钢印"  >
                  <span v-html="form.steelSeal"></span>    
            </el-form-item> 
            <el-form-item label="涂喷颜色" >
                    <span v-html="form.sprayingColor"></span>     
            </el-form-item>
            </el-row> 
            
            <el-row> 
            <el-form-item label="移印" prop="region" >
                  <span v-html="form.moveSeal"></span>      
            </el-form-item> 
            <el-form-item label="汽泡带" prop="region" >
                  <span v-html="form.bubbleWith"></span>       
            </el-form-item> 
            <el-form-item label="产品POF过塑" prop="region" >
                <span v-html="form.pofPlasticProducts"></span>       
            </el-form-item>
            </el-row> 
            
            <el-row> 
            <el-form-item label="纸筒" prop="region" >
                <span v-html="form.PaperTube"></span>       
            </el-form-item>
            <el-form-item label="箱过塑" prop="region" >
                <span v-html="form.casePlastic"></span>        
            </el-form-item>
            <el-form-item label="盒过塑" prop="region" >
                <span v-html="form.boxPlastic"></span> 
            </el-form-item>
            </el-row> 
            
            <el-row class="min_span">  
              <el-form-item label="盒标签1" >
                  <span v-html="form.box1Label"></span>  
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.box1Num"></span>   
              </el-form-item>
              <el-form-item label="盒标签2" >
                  <span v-html="form.box2Label"></span>    
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.box2Num"></span>    
              </el-form-item>
            </el-row> 
            
            <el-row class="min_span">  
              <el-form-item label="箱标签1" >
                  <span v-html="form.case1Label"></span>   
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.case1Num"></span>    
              </el-form-item>
              <el-form-item label="箱标签2" >
                  <span v-html="form.case2Label"></span>     
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.case2Num"></span>  
              </el-form-item>
            </el-row> 
            
            <el-row class="min_span">  
              <el-form-item label="说明书" >
                  <span v-html="form.instructions"></span>    
              </el-form-item>
              <el-form-item label="合格证" >
                  <span v-html="form.qualifiedCertificate"></span>    
              </el-form-item>
              <el-form-item label="封口贴" >
                  <span v-html="form.sealingPaste"></span>
              </el-form-item>
            <el-form-item label="封箱胶纸" >
                  <span v-html="form.sealingGummedPaper"></span>   
              </el-form-item>   
            </el-row>  
            
            <el-row class="max_span"> 
            <el-form-item label="打包带" >
                <span v-html="form.packagingTape"></span>  
            </el-form-item>
            <el-form-item label="数量(条)" >
                <span v-html="form.packagingTapeNumber"></span>  
            </el-form-item>
            </el-row>  
            
            <el-row class="max_list">
            <el-form-item label="面料/底料" >
                <!-- <span class="maxspan" v-html="form.shellFabric+'/'+form.bedCharge"></span>   -->
                <span class="maxspan" v-html="form.bedCharge"></span>  
            </el-form-item>
            </el-row>  
            
            <el-row class="max_span"> 
            <el-form-item label="盒号" >
                <span v-html="form.boxNumber"></span>   
            </el-form-item> 
            <el-form-item label="箱号" >
                <span v-html="form.caseNumber"></span>  
            </el-form-item>
            </el-row>  
            
            <el-row class="max_span">
              <el-form-item label="子件料号" >
                  <span  v-html="form.childThingNumber"></span>   
              </el-form-item>
              <el-form-item label="备注" >
                  <span v-html="form.remark"></span>  
              </el-form-item>
            </el-row>  

            <template v-if="Status=='info' ">
              <el-row class="max_span"> 
                <el-form-item label="创建人" >
                    <span v-html="form.crtName"></span>   
                </el-form-item> 
                <el-form-item label="创建时间" >
                    <span v-html="form.crtTime"></span>  
                </el-form-item>
              </el-row>  
              <el-row class="max_span"> 
                <el-form-item label="最后更新人" >
                    <span v-html="form.updName"></span>   
                </el-form-item> 
                <el-form-item label="最后更新时间" >
                    <span v-html="form.updTime"></span>  
              </el-form-item> 
             </el-row> 
            </template>
            
             <el-row> 
                 <el-col :span="12">  
                    <el-form-item label="打商标" >  
                        <img :src="form.process1PictureName_src">
                    </el-form-item> 
                </el-col>  
                 <el-col :span="12">  
                    <el-form-item label="衬片钻小孔" > 
                        <img :src="form.process2PictureName_src"> 
                    </el-form-item> 
                </el-col>  
             </el-row> 
             <el-row> 
                 <el-col :span="12">  
                    <el-form-item label="移印喷码" > 
                        <img :src="form.process3PictureName_src"> 
                    </el-form-item> 
                </el-col>  
                 <el-col :span="12">  
                    <el-form-item label="包装" > 
                        <img :src="form.process4PictureName_src">  
                    </el-form-item> 
                </el-col>  
             </el-row> 
        </el-form> 
      </el-tab-pane> 
    </el-tabs>
      
   </div> 

     <el-tabs v-model="activeName1" v-if="Status=='upload'"> 
          <el-tab-pane  label="工艺图纸上传" name="first" >   
            <el-form :model="form"  :rules="rules" ref="form" label-width="100px"  class="upload" > 
            <el-form-item label="打商标" class="max_list">
                <el-input   placeholder="点击按钮开始上传" v-model="form.process1PictureName" readonly ></el-input>
                <el-button  size="small" type="info" @click="upload('1')">开始上传</el-button> 
                <el-button  v-if="form.process1PictureName!=null"  size="small" type="danger" @click="deleteUpload(form.process1PictureId,'1')">删除</el-button> 
              </el-form-item> 
              <el-form-item  label="钻小孔" class="max_list">
                <el-input   placeholder="点击按钮开始上传" v-model="form.process2PictureName" readonly ></el-input>
                <el-button  size="small" type="info"  @click="upload('2')">开始上传</el-button> 
                <el-button  v-if="form.process2PictureName!=null"  size="small" type="danger" @click="deleteUpload(form.process2PictureId,'2')">删除</el-button> 
              </el-form-item>
              <el-form-item label="移印喷码" class="max_list">
                <el-input  placeholder="点击按钮开始上传"  v-model="form.process3PictureName" readonly></el-input>
                <el-button  size="small" type="info"   @click="upload('3')">开始上传</el-button> 
                <el-button  v-if="form.process3PictureName!=null"  size="small" type="danger" @click="deleteUpload(form.process3PictureId,'3')">删除</el-button> 
              </el-form-item>
              <el-form-item label="包装" class="max_list">
                <el-input  placeholder="点击按钮开始上传"   v-model="form.process4PictureName" readonly ></el-input>
                <el-button  size="small" type="info" @click="upload('4')">开始上传</el-button> 
                <el-button  v-if="form.process4PictureName!=null" size="small" type="danger" @click="deleteUpload(form.process4PictureId,'4')">删除</el-button> 
              </el-form-item> 
            </el-form>
        </el-tab-pane> 
    </el-tabs> 
    
    <!--工艺图纸上传弹出框-->
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible_upload">  
        <el-upload
            class="upload-demo" drag
            :show-file-list="false"
            :action="'/api/product/process/ftpUploadImg/'+form.id+'/'+form.type"
            :on-success	= "uploadSubcess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>  
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
  query,  
  deluploadObj
} from 'api/process/view/index';
import defaultImg from 'assets/images/defaultImg.png';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {  
      activeName:'first',
      activeName1: "first",  
      staticOptions: [{
        value:'1',
        label:'有效'
      },{
        value:'0',
        label:'作废'
      }],
      Items:undefined,
      form: {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
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
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 1,
        u9Coding:''
      },
      dialogFormVisible: false,
      dialogFormVisible_upload:false,
      dialogStatus:false,
      Status: '', 
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList(); 

    this.maintainManager_uploadView  = this.elements['uploadManager'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.Status = 'list';
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          // console.log(response);
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      query().then(response => {
          this.Items = response.data.dataList; 
        });
    },
    info(row) {
          this.Status = 'info';
      getObj(row.id)
        .then(response => { 
          this.form = response.data;
          
           if(this.form.process1PictureName == null){
              this.form.process1PictureName_src = defaultImg
            }else{
              this.form.process1PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/1/'+this.form.version; 
            }
            if(this.form.process2PictureName == null){
              this.form.process2PictureName_src = defaultImg
            }else{
              this.form.process2PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/2/'+this.form.version; 
            }
            if(this.form.process3PictureName == null){
              this.form.process3PictureName_src = defaultImg
            }else{
            this.form.process3PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/3/'+this.form.version; 
            }
            if(this.form.process4PictureName == null){
              this.form.process4PictureName_src = defaultImg
            }else{              
            this.form.process4PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/4/'+this.form.version;
            }       
        })
    },
    // 上传按钮事件
    handupload(row){  
       this.info(row);
       this.Status = 'upload';
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
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    selevtValue(value){
      if(value != ''){ 
       query(value).then(response => {  
          this.Items = response.data.dataList; 
        }); 
      }
    },
     // 图片上传的弹出框
    upload(type){ 
      this.dialogStatus = 'upload';
      this.dialogFormVisible_upload = true;
      // 把类型划分为1,2,3,4
      this.form.type = type; 
    }, 
    // 输出上传结果
    uploadSubcess(response){ 
      // console.log('上传成功--图片4个接口');
      // console.log(response);
      // 时间戳 用来实时更新图片
      var  data = new Date().getTime();

      var type = response.type  
      if(type=='1'){
        this.form.process1PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/1/'+this.form.version+"?time="+data; 
        this.form.process1PictureName = response.path
      }else if(type=='2'){
        this.form.process2PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/2/'+this.form.version+"?time="+data; 
        this.form.process2PictureName = response.path
      }else if(type=='3'){
        this.form.process3PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/3/'+this.form.version+"?time="+data; 
        this.form.process3PictureName = response.path
      }else{
        this.form.process4PictureName_src = 'http://123.56.2.28:8765/api/product/process/photo/'+this.form.id+'/4/'+this.form.version+"?time="+data;
        this.form.process4PictureName = response.path
      }
      // console.log('添加成功');
      // console.log(this.form); 
      this.$notify({
          title: "成功",
          message: "上传成功",
          type: "success",
          duration: 2000
        });  
   },
    deleteUpload(id,type) {
      console.log(id);
      this.$confirm("此操作将永久删除此图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deluploadObj(id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          }); 
        });
        if(type=='1'){
          this.form.process1PictureName_src = defaultImg; 
          this.form.process1PictureName = null
        }else if(type=='2'){
          this.form.process2PictureName_src = defaultImg; 
          this.form.process2PictureName = null
        }else if(type=='3'){
          this.form.process3PictureName_src = defaultImg; 
          this.form.process3PictureName = null
        }else{
          this.form.process4PictureName_src = defaultImg;
          this.form.process4PictureName = null
        }
      });
    }, 
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
// .el-tabs{
//     .el-form-item{
//       width:45%;
//     }
//     .max_list{ 
//       width: 97%;
//     } 
//     .el-input,.el-select { 
//       width: 400px !important;
//     }
// }
.list{
  position: absolute;
  right:20px;
  z-index: 1;
}

.info{
  padding-top:20px;  
}  
.info span{
  display: inline-block;
  width: 260px;
  height: 38px;
  text-align: center;  
  border:1px solid;
}
.info .min_span span{
  width: 170px;
}
.info .max_span span{
  width: 450px;
}
.info .maxspan{
  display: inline-block;
  width: 1015px;
  // width: 635px;
  // width: 985px;
  text-align: center; 
}
.info img{
  width: 300px;
  height: 170px;
  margin: 0 100px;
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