<template>
<div class="app-container calendar-list-container">
  <div class="filter-container"> 
    <template  v-if="Status=='list'"> 
      <el-autocomplete style="width: 200px;" class="filter-item"
              v-model="listQuery.u9Coding" 
              :fetch-suggestions="selectValue"
              placeholder="U9产品编码"
              @select="handleSelect"> 
      </el-autocomplete> 
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户" v-model="listQuery.customer"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50">
          </el-table-column>
           <el-table-column align="center" label="U9产品编码" min-width="20%" > <template scope="scope" >
                <span  @click="info(scope.row)" style="cursor:pointer;">{{scope.row.u9Coding}}</span>
              </template> </el-table-column>
          <el-table-column  align="center" label="产品型号" min-width="20%"> <template scope="scope">
              <span>{{scope.row.productModel}}</span>
            </template> </el-table-column>
          <el-table-column  align="center" label="客户" min-width="15%"> <template scope="scope">
                  <span>{{scope.row.customer}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="版本" min-width="15%"> <template scope="scope">
                  <span>{{scope.row.version}}</span>
                </template> </el-table-column> 
          <el-table-column  align="center" label="文件编码" min-width="20%"> <template scope="scope">
                  <span>{{scope.row.fileCoding}}</span>
                </template> </el-table-column> 
        <el-table-column align="center" min-width="15%" label="操作" fixed="right"> <template scope="scope"> 
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
            <el-form-item label="移印/喷印" prop="region" >
                  <span v-html="form.moveSeal"></span>      
            </el-form-item> 
            <el-form-item label="包装袋" prop="region" >
                  <span v-html="form.bubbleWith"></span>       
            </el-form-item> 
            <el-form-item label="产品POF过塑" prop="region" >
                <span v-html="form.pofPlasticProducts"></span>       
            </el-form-item>
            </el-row> 
            
            <el-row> 
            <el-form-item label="纸筒" prop="region" >
                <span v-html="form.paperTube"></span>       
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
              <el-form-item label="盒标签3" >
                  <span v-html="form.box3Label"></span>  
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.box3Num"></span>   
              </el-form-item>
              <el-form-item label="盒标签4" >
                  <span v-html="form.box4Label"></span>    
              </el-form-item>
              <el-form-item label="数量" >
                  <span v-html="form.box4Num"></span>    
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
            <el-form-item label="配方" > 
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
            
            <el-row>
              <el-form-item label="子件料号" >
                  <span class="maxspan" v-html="form.childThingNumber"></span>    
              </el-form-item>
            </el-row>  
            
            <el-row >
              <el-form-item label="隔板" >  
                  <span class="maxspan" v-html="form.clapboard"></span>  
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="备注" > 
                  <span class="maxspan" v-html="form.remark"></span>   
              </el-form-item>
            </el-row>

            <template v-if="Status=='info' && maintainManager_uploadView">
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
                      <a :href="form.process1PictureHref" target="_blank">
                        <img :src="form.process1PictureName_src">
                      </a>
                    </el-form-item> 
                </el-col>  
                 <el-col :span="12">  
                    <el-form-item label="衬片钻小孔" > 
                      <a :href="form.process2PictureHref" target="_blank">
                        <img :src="form.process2PictureName_src"> 
                      </a>
                    </el-form-item> 
                </el-col>  
             </el-row> 
             <el-row> 
                 <el-col :span="12">  
                    <el-form-item label="移印喷码" > 
                      <a :href="form.process3PictureHref" target="_blank">
                        <img :src="form.process3PictureName_src"> 
                       </a>
                    </el-form-item> 
                </el-col>  
                 <el-col :span="12">  
                    <el-form-item label="包装" > 
                      <a :href="form.process4PictureHref" target="_blank">
                        <img :src="form.process4PictureName_src">  
                      </a>
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
                <el-input   placeholder="点击按钮开始上传" v-model="form.process1PicturePath" readonly ></el-input>
                <el-button  size="small" type="info" @click="upload('1')">开始上传</el-button> 
                <el-button  v-if="form.process1PicturePath!='' && form.process1PicturePath!=null"  size="small" type="danger" @click="deleteUpload(form.id,'1')">删除</el-button> 
              </el-form-item> 
              <el-form-item  label="钻小孔" class="max_list">
                <el-input   placeholder="点击按钮开始上传" v-model="form.process2PicturePath" readonly ></el-input>
                <el-button  size="small" type="info"  @click="upload('2')">开始上传</el-button> 
                <el-button  v-if="form.process2PicturePath!='' && form.process2PicturePath!=null"  size="small" type="danger" @click="deleteUpload(form.id,'2')">删除</el-button> 
              </el-form-item>
              <el-form-item label="移印喷码" class="max_list">
                <el-input  placeholder="点击按钮开始上传"  v-model="form.process3PicturePath" readonly></el-input>
                <el-button  size="small" type="info"   @click="upload('3')">开始上传</el-button> 
                <el-button  v-if="form.process3PicturePath!='' && form.process3PicturePath!=null"  size="small" type="danger" @click="deleteUpload(form.id,'3')">删除</el-button> 
              </el-form-item>
              <el-form-item label="包装" class="max_list">
                <el-input  placeholder="点击按钮开始上传"   v-model="form.process4PicturePath" readonly ></el-input>
                <el-button  size="small" type="info" @click="upload('4')">开始上传</el-button> 
                <el-button  v-if="form.process4PicturePath!='' && form.process4PicturePath!=null" size="small" type="danger" @click="deleteUpload(form.id,'4')">删除</el-button> 
              </el-form-item> 
            </el-form>
        </el-tab-pane> 
    </el-tabs> 
    
    <!--工艺图纸上传弹出框-->
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible_upload">  
        <el-upload
            class="upload-demo" drag
            :show-file-list="false"
            :action="baseUrl+'/api/product/process/ftpUploadImg/'+form.id+'/'+form.type"
            :on-success	= "uploadSubcess"
            :on-error = "uploadError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
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
  deluploadObj,
  pic
} from "api/process/view/index";
import defaultImg from "assets/images/defaultImg.png";
import { mapGetters } from "vuex";
export default {
  name: "user",
  data() {
    return {
      activeName: "first",
      activeName1: "first",
      staticOptions: [
        {
          value: "1",
          label: "有效"
        },
        {
          value: "0",
          label: "作废"
        }
      ],
      Items: undefined,
      form: {
        username: undefined,
        name: undefined,
        sex: "男",
        password: undefined,
        description: undefined
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
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 1,
        u9Coding: ""
      },
      u9listQuery: {
        u9Coding: "",
        page: 1,
        limit: 30
      },
      dialogFormVisible: false,
      dialogFormVisible_upload: false,
      dialogStatus: false,
      Status: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      maintainManager_uploadView: null,
      baseUrl: null
    };
  },
  created() {
    this.getList();
    if (this.elements != undefined) {
      this.maintainManager_uploadView = this.elements["uploadManager"];
    }
    // 获取配置里面的公共api 用来做图片的显示。
    this.baseUrl = ApiUrl;
  },
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    getList() {
      this.Status = "list";
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    info(row) {
      this.Status = "info";
      getObj(row.id).then(response => {
        this.form = response.data;

        for (var i = 1; i < 5; i++) {
          this.form["process" + i + "PictureHref"] =
            this.baseUrl +
            "/api/product/process/photo/" +
            this.form.id +
            "/" +
            i;
        }
        pic(row.id).then(response => {
          this.form.process1PictureName_src = response.tupian1;
          this.form.process2PictureName_src = response.tupian2;
          this.form.process3PictureName_src = response.tupian3;
          this.form.process4PictureName_src = response.tupian4;
          if (this.form.remark == null) {
            this.form.remark = " ";
          } else {
            this.form.remark = this.form.remark + " ";
          }
        });
      });
    },
    // 上传按钮事件
    handupload(row) {
      this.info(row);
      this.Status = "upload";
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
    // selectValue(value) {
    //     this.Items = [];
    //     this.u9listQuery.page = 1;  //重置页数
    //     this.u9listQuery.u9Coding = value;
    //     query(this.u9listQuery).then(response => {
    //       this.Items = response.data.rows;
    //     });
    // },
    // selectValue0() {
    //     this.u9listQuery.page++;
    //     query(this.u9listQuery).then(response => {
    //       this.Items = this.Items.concat(response.data.rows);
    //     });
    // },
    //  u9coding的模糊查询
    selectValue(queryString, cb) {
      this.u9listQuery.page = 1; //重置页数
      this.u9listQuery.u9Coding = queryString;
      query(this.u9listQuery).then(response => {
        var data = response.data.rows;
        for (var i = 0; i < data.length; i++) {
          data[i].value = data[i].u9Coding + "(" + data[i].productModel + ")";
        }
        cb(data);
      });
    },
    // 选中重新赋值
    handleSelect(item) {
      this.listQuery.u9Coding = item.u9Coding;
    },
    // 图片上传的弹出框
    upload(type) {
      this.dialogStatus = "upload";
      this.dialogFormVisible_upload = true;
      // 把类型划分为1,2,3,4
      this.form.type = type;
    },
    // 输出上传结果 上传成功。
    uploadSubcess(response) {
      var data = response.data;
      var type = this.form.type;

      pic(data.id).then(response => {
        this.form["process" + type + "PictureName_src"] =
          response["tupian" + type];
        this.form["process" + type + "PicturePath"] =
          data["process" + type + "PicturePath"];
      });

      this.$notify({
        title: "成功",
        message: response.message,
        type: "success",
        duration: 2000
      });
    },
      // 上传失败的方H法
    uploadError() {
      this.$notify({
        title: "上传失败",
        message: "非法操作，上传失败", 
        type: "warning",
        duration: 2000
      });
    },
    deleteUpload(processId, type) {
      this.$confirm("此操作将永久删除此图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deluploadObj(processId, type).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        });
        if (type == "1") {
          this.form.process1PictureName_src = defaultImg;
          this.form.process1PicturePath = null;
        } else if (type == "2") {
          this.form.process2PictureName_src = defaultImg;
          this.form.process2PicturePath = null;
        } else if (type == "3") {
          this.form.process3PictureName_src = defaultImg;
          this.form.process3PicturePath = null;
        } else {
          this.form.process4PictureName_src = defaultImg;
          this.form.process4PicturePath = null;
        }
      });
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.list {
  position: absolute;
  right: 20px;
  z-index: 1;
}

.info {
  padding-top: 20px;
}
.info span {
  display: inline-block;
  width: 260px;
  height: 38px;
  text-align: center;
  border: 1px solid;
}
.info .min_span span {
  width: 170px;
}
.info .max_span span {
  width: 450px;
  min-height: 38px;
  height: auto;
}
.info .maxspan {
  display: inline-block;
  width: 1015px;
  // width: 635px;
  // width: 985px;
  text-align: center;
}
.info img {
  width: 300px;
  height: 170px;
  margin: 0 100px;
}

.el-tabs {
  .el-input,
  .el-select {
    width: 400px !important;
  }
}
.upload .el-button {
  min-width: 200px;
  height: 38px;
}
</style>