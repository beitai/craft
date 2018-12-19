<template>
<div class="app-container calendar-list-container">
       <!-- 列表 -->
       <div v-if="Status=='list' || Status=='version'">   
        <div v-if="Status=='list'" class="filter-container"> 
            <el-select v-model="listQuery.u9Coding"  clearable filterable  remote :remote-method="selevtValue"  placeholder="U9产品编码" style="width: 200px;" class="filter-item"> 
              <el-option
                v-for="item in Items"
                :key="item.u9Coding"
                :label="item.u9Coding+'('+item.productModel+')'"
                :value="item.u9Coding">
              </el-option>
            </el-select>  
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户" v-model="listQuery.customer"> </el-input>
            <el-select @keyup.enter.native="handleFilter" clearable class="filter-item" style="width: 200px;"  v-model="listQuery.status" placeholder="状态">
                <el-option v-for="item in staticOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>  
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      </div>
      <div class="filter-container" v-if=" Status=='list' ">     
            <el-button class="filter-item"    style="margin-left: 10px;"  @click="handleCreate"   type="primary" icon="plus">新增</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary" icon="minus" @click="batchDelete">批量作废</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary"  @click="handleImport" >导入Excel</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary" @click="download">Excel模板下载</el-button>
       </div> 
      <div v-if=" Status=='version'" class="filter-container"> 
        <el-button class="filter-item"  v-if=" Status=='version'"    style="margin-left: 10px;float:right;" @click="getListPage()" type="primary" >返回列表</el-button> 
      </div>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row  style="width: 100%"  @selection-change="handleSelectionChange">   
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column align="center" label="U9产品编码" width="200" > <template scope="scope" >
                <span  @click="info(scope.row)" style="cursor:pointer;">{{scope.row.u9Coding}}</span>
              </template> </el-table-column>
          <el-table-column  align="center" label="产品型号" width="120"> <template scope="scope">
              <span>{{scope.row.productModel}}</span>
            </template> </el-table-column>
          <el-table-column  align="center" label="客户" width="80"> <template scope="scope">
                  <span>{{scope.row.customer}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="版本" width="80"> <template scope="scope">
                  <span>{{scope.row.version}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="状态" width="80"> <template scope="scope">
                  <span v-if="scope.row.status==0">作废</span>
                  <span v-if="scope.row.status==1">有效</span>
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
         
          <el-table-column v-if=" Status!='version'"   align="center" label="操作" width="450" fixed="right"> 
            <template scope="scope" >
                <el-button v-if=" maintainManager_uploadView && scope.row.status==1 && Status!='version'" size="small" type="info" @click="handupload(scope.row)">上传
                </el-button> 
                <el-button v-if=" scope.row.status==1"  size="small" type="success" @click="handleUpdate(scope.row)">编辑
                </el-button>
                <el-button v-if=" scope.row.status==1" size="small" type="warning" @click="handleDelete(scope.row)">作废
                </el-button>
                <el-button v-if=" scope.row.status==0" size="small" type="warning" @click="handleDelete(scope.row)">启用
                </el-button>
                <el-button v-if=" scope.row.status==1"  size="small" type="info"  @click="restore(scope.row)">恢复版本
                </el-button>
                <el-button  size="small" type="info"   @click="info(scope.row)">明细
                </el-button>
                <el-button  size="small" type="info"  @click="queryVersion(scope.row)" >历史版本
                </el-button> 
              </template> 
          </el-table-column>
          <!-- <el-table-column  v-else    align="center" label="操作" width="200" fixed="right"> 
              <template scope="scope"  >
                {{Status}}
                <el-button v-if=" scope.row.status==1" size="small" type="warning" @click="handleDelete(scope.row)">作废
                </el-button>
                <el-button v-if=" scope.row.status==0" size="small" type="warning" @click="handleDelete(scope.row)">启用
                </el-button> 
                <el-button  size="small" type="info"   @click="info(scope.row)">明细
                </el-button> 
              </template> 
          </el-table-column>  -->
       
        </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>

    <!-- 导入弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible_import">   
        <el-form ref="form"  label-width="100px">
        <!-- :http-request="importFile" -->
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"  drag
            action="/api/product/process/excelInport"
            :show-file-list="false"
            :headers="myHeaders"
            :on-success	= "importSubcess"
            :on-error = "importError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div> 
            <div class="el-upload__tip" slot="tip">只能导入xlsx,csv文件</div>
          </el-upload>  
        </el-form-item>
            <el-form-item label="导入结果">
              <el-input type="textarea" :rows="5" v-model="importValue"></el-input>
            </el-form-item>
          </el-form>
    </el-dialog> 

    <!-- 新增，修改，明细，上传 --> 
    <el-button v-if="Status != 'list' && Status != 'version'"  class="filter-item list"  type="primary"  @click="getListPage">返回列表</el-button>
    <el-tabs  v-if="Status != 'list' && Status != 'version'" v-model="activeName">
      <el-tab-pane  :label="textMap[Status]" name="first">   
          
        <el-form :model="form" v-if="Status == 'create' || Status=='update'"  :rules="rules" ref="form" label-width="80px"  :inline="true" >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="u9产品编号" class="max_lable">  
                    <el-select v-if="Status=='create'" v-model="form.u9Coding" filterable placeholder="请输入u9产品编号"> 
                        <el-option
                        v-for="item in ItemsOption"
                        :key="item.u9Coding"
                        :label="item.u9Coding"
                        :value="item.u9Coding">
                        </el-option>
                    </el-select> 
                    <el-input  v-if="Status=='update'"  placeholder="" v-model="form.u9Coding" readonly></el-input>
                  </el-form-item> 
                </el-col> 
                <el-col :span="12">
                  <el-form-item label="产品编号" >
                    <el-input   placeholder="请输入产品编号" v-model="form.productModel"></el-input>
                  </el-form-item>
                </el-col>
             </el-row>
              
              <el-row> 
                <el-col :span="12">
                  <el-form-item label="发放日期">
                    <el-date-picker type="datetime" placeholder="选择日期"  v-model="form.issueDate" value-format="yyyy-MM-DD hh:mm:ss" style="width: 100%;"></el-date-picker>
                  </el-form-item> 
                </el-col>
                <el-col :span="12"> 
                     <el-form-item label="更改日期" > 
                          <el-date-picker type="datetime" placeholder="选择日期"  v-model="form.updateDate" value-format="yyyy-MM-DD hh:mm:ss" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col> 
             </el-row>

             <el-row>
                <el-col :span="8">
                  <el-form-item  label="客户" >
                    <el-input   placeholder="请输入客户名称" v-model="form.customer"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8"> 
                    <el-form-item label="文件编号">
                      <el-input  placeholder="请输入文件编码" v-model="form.fileCoding" ></el-input>
                    </el-form-item> 
                </el-col> 
                <el-col :span="8"> 
                  <el-form-item label="版本">
                    <el-input  placeholder="请输入版本" v-model="form.version"></el-input>
                  </el-form-item> 
                </el-col>
             </el-row> 
             
          

             <el-row>
                <el-col :span="8"> 
                      <el-form-item label="钢印"  >
                        <el-select v-model="form.steelSeal" placeholder="请选择 ">
                          <el-option label="有" value="有"></el-option>
                          <el-option label="无" value="无"></el-option>
                        </el-select>
                        </el-form-item>
                </el-col>
                <el-col :span="8">
                        <el-form-item label="涂喷颜色">
                          <el-input  placeholder="请输入涂喷颜色" v-model="form.sprayingColor"></el-input>
                        </el-form-item>
                </el-col>
                 <el-col :span="8"> 
                        <el-form-item label="移印" prop="region">
                          <el-select v-model="form.moveSeal" placeholder="请选择 ">
                            <el-option label="有" value="有"></el-option>
                            <el-option label="无" value="无"></el-option>
                          </el-select>
                        </el-form-item>
                </el-col>
             </el-row>

             <el-row>
                <el-col :span="8"> 
                    <el-form-item label="汽泡带" prop="region">
                      <el-select v-model="form.pofPlasticProducts" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                     </el-form-item>
                </el-col>
                <el-col :span="8"> 
                  <el-form-item label="产品POF过塑" prop="region">
                      <el-select v-model="form.pofPlasticProducts" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col> 
                <el-col :span="8"> 
                    <el-form-item label="纸筒" prop="region">
                      <el-select v-model="form.pofPlasticProducts" placeholder="请选择 ">
                        <el-option label="有" value="有"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                     </el-form-item>
                </el-col>
             </el-row>
             <el-row> 
                <el-col :span="8"> 
                    <el-form-item label="箱过塑" prop="region">
                      <el-select v-model="form.casePlastic" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                     </el-form-item>
                </el-col>
                <el-col :span="8">
                     <el-form-item label="盒过塑" prop="region">
                      <el-select v-model="form.boxPlastic" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
             </el-row>
             
             <el-row>
                <el-col :span="6"> 
                    <el-form-item label="盒标签1">
                      <el-input  placeholder="请输入盒标签1" v-model="form.box1Label" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                    <el-form-item label="数量">
                      <el-input  placeholder="请输入数量" v-model="form.box1Num" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                     <el-form-item label="盒标签2">
                      <el-input  placeholder="请输入盒标签2" v-model="form.box2Label"></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                    <el-form-item label="数量">
                      <el-input  placeholder="请输入数量" v-model="form.box2Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>
              
             <el-row>
                <el-col :span="6"> 
                     <el-form-item label="箱标签1">
                      <el-input  placeholder="请输入箱标签1" v-model="form.case1Label" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                     <el-form-item label="数量">
                      <el-input  placeholder="请输入数量" v-model="form.case1Num" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                      <el-form-item label="箱标签2">
                        <el-input  placeholder="请输入箱标签2" v-model="form.case2Label"></el-input>
                      </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                    <el-form-item label="数量">
                      <el-input  placeholder="请输入数量" v-model="form.case2Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>
            
             <el-row>
                <el-col :span="6"> 
                    <el-form-item label="说明书"> 
                            <el-input  placeholder="请输入说明书" v-model="form.instructions" ></el-input>   
                    </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                      <el-form-item label="合格证" > 
                              <el-input  placeholder="请输入合格证" v-model="form.qualifiedCertificate" ></el-input>    
                      </el-form-item>
                </el-col> 
                <el-col :span="6"> 
                      <el-form-item label="封口贴"> 
                              <el-input  placeholder="请输入封口贴" v-model="form.sealingPaste" ></el-input>  
                      </el-form-item> 
                </el-col> 
                <el-col :span="6"> 
                      <el-form-item label="封箱胶纸">
                        <el-select v-model="form.sealingGummedPaper" placeholder="请选择"> 
                          <el-option label="透明" value="透明"></el-option>
                          <el-option label="专用" value="专用"></el-option>
                          <el-option label="无" value="无"></el-option>
                        </el-select>
                      </el-form-item> 
                </el-col> 
             </el-row>
              
             <el-row> 
                <el-col :span="12">
                   <el-form-item label="打包带" >
                    <el-select v-model="form.packagingTape" placeholder="请选择">
                      <el-option label="黄色" value="黄色"></el-option>
                      <el-option label="白色" value="白色"></el-option>
                      <el-option label="绿色" value="绿色"></el-option>
                      <el-option label="专用" value="专用"></el-option>
                      <el-option label="无" value="无"></el-option> 
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                      <el-form-item label="数量(条)">
                        <el-input  placeholder="请输入数量" v-model="form.packagingTapeNumber" ></el-input>
                      </el-form-item>
                </el-col> 
              </el-row>

              <el-form-item size="large" class="footer">
                    <el-button v-if="Status=='create'" type="primary"  @click="create">保存</el-button> 
                    <el-button v-if="Status=='update'" type="primary"  @click="update">保存</el-button>  
                    <el-button  @click="getListPage()">取消</el-button>
              </el-form-item>
        </el-form>  
            
        <el-form :model="form" v-if="Status == 'info' || Status=='upload'"  :rules="rules" ref="form" label-width="100px"  :inline="true" class="info">
            <el-form-item  label="U9产品编号" >
              <span  v-html="form.u9Coding"></span>
            </el-form-item>
            <el-form-item label="产品编号" >
                  <span v-html="form.productModel"></span> 
            </el-form-item> 
            <el-form-item  label="客户">
                  <span v-html="form.customer"></span>  
            </el-form-item>
            <el-form-item label="文件编号" >
                  <span v-html="form.fileCoding"></span>  
            </el-form-item>
            <el-form-item label="版本" >
                  <span v-html="form.version"></span>   
            </el-form-item> 
            <el-form-item label="发放日期" >
                  <span v-html="form.issueDate"></span>   
            </el-form-item> 
            <el-form-item label="更改日期" >  
                  <span v-html="form.updateDate"></span>   
            </el-form-item>
            <el-form-item label="钢印"  >
                  <span v-html="form.steelSeal"></span>    
            </el-form-item>
            <el-form-item label="涂喷颜色" >
                  <span v-html="form.sprayingColor"></span>     
            </el-form-item>
            <el-form-item label="移印" prop="region" >
                  <span v-html="form.moveSeal"></span>      
            </el-form-item>
            <el-form-item label="产品POF过塑" prop="region" >
                <span v-html="form.pofPlasticProducts"></span>       
            </el-form-item>
            <el-form-item label="箱过塑" prop="region" >
                <span v-html="form.casePlastic"></span>        
            </el-form-item>
            <el-form-item label="盒过塑" prop="region" >
                <span v-html="form.boxPlastic"></span> 
            </el-form-item>
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
            <el-form-item label="说明书" >
                <span v-html="form.instructions"></span>    
            </el-form-item>
            <el-form-item label="合格证" >
                <span v-html="form.qualifiedCertificate"></span>    
            </el-form-item>
            <el-form-item label="封口贴" >
                <span v-html="form.sealingPaste"></span>
            </el-form-item>
            <el-form-item label="打包带" >
                <span v-html="form.packagingTape"></span>  
            </el-form-item>
            <el-form-item label="数量(条)" >
                <span v-html="form.packagingTapeNumber"></span>  
            </el-form-item>
          <el-form-item label="封箱胶纸" >
                <span v-html="form.sealingGummedPaper"></span>   
            </el-form-item>   
            <el-form-item label="面料/底料" class="max_list">
                <!-- <span class="maxspan" v-html="form.shellFabric+'/'+form.bedCharge"></span>   -->
                <span class="maxspan" v-html="form.bedCharge"></span>  
            </el-form-item>
            <el-form-item label="盒号" >
                <span v-html="form.boxNumber"></span>   
            </el-form-item> 
            <el-form-item label="箱号" >
                <span v-html="form.caseNumber"></span>  
            </el-form-item>
            <el-form-item label="子件料号" class="max_list">
                <span class="maxspan" v-html="form.childThingNumber"></span>   
            </el-form-item>
            <template v-if="Status=='info' && maintainManager_uploadView">
                <el-form-item label="创建人" >
                    <span v-html="form.crtName"></span>   
                </el-form-item> 
                <el-form-item label="创建时间" >
                    <span v-html="form.crtTime"></span>  
                </el-form-item>
                  <el-form-item label="最后更新人" >
                    <span v-html="form.updName"></span>   
                </el-form-item> 
                <el-form-item label="最后更新时间" >
                    <span v-html="form.updTime"></span>  
              </el-form-item> 
            </template>
            <el-form-item label="打商标" >  
                <img :src="form.process1PictureName_src">
            </el-form-item> 
            <el-form-item label="衬片钻小孔" > 
                <img :src="form.process2PictureName_src"> 
            </el-form-item> 
            <el-form-item label="移印喷码" > 
                <img :src="form.process3PictureName_src"> 
            </el-form-item> 
            <el-form-item label="包装" > 
                <img :src="form.process4PictureName_src">  
            </el-form-item> 
        </el-form> 

      </el-tab-pane>  
    </el-tabs> 

    <!--工艺图纸上传-->
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
  deleteObj,
  putObj,
  query,
  restore,
  getVersion,
  importObj,
  downloadObj,
  saveQuery,
  info,
  uploadObj,
  deluploadObj
} from 'api/process/maintain/index';
import { mapGetters } from 'vuex';
import defaultImg from 'assets/images/defaultImg.png';
export default {
  name: 'user',
  data() {
    return {   
    myHeaders : {},
    activeName: "first",
    activeName1: "first",  
    staticOptions: [{
        value:'',
        label:'全部'
      },{
        value:'1',
        label:'有效'
      },{
        value:'0',
        label:'作废'
      }], 
      del:{
        list:[]
      }, 
      delpro:{
        id:'',
        status:''
      },
      Items:undefined,
      ItemsOption:undefined,
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
        u9Coding: '',
        value: '',
        status: '1'
      }, 
      listVersion: {
        page: 1,
        limit: 10, 
        u9Coding:undefined
      },
      sexOptions: ['男', '女'],
      importValue:'',
      dialogFormVisible_import: false,
      dialogFormVisible_upload : false,
      Status: 'list',
      dialogStatus: '', 
      maintainManager_uploadView: false,
      textMap: {
        update: "编辑产品",
        create: "新增产品",
        info: "工艺信息",
        import:"工艺信息导入",
        upload: "工艺信息上传"
      },
      tableKey: 0
    }
  },
  created() {
    this.getList(); 
    this.getListPage();
    this.maintainManager_uploadView  = this.elements['uploadManager'];
    // 导入加入token.
    this.myHeaders.Authorization = this.token; 
 
  },
  computed: {
    ...mapGetters([
      'elements',
      'token'
    ])
  },
  methods: { 
    getList() {
      this.listLoading = true;
      if(this.Status == 'version'){
        this.listQuery = this.listVersion; 
      } 
      page(this.listQuery)
        .then(response => { 
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;  
        });
    },
    handleFilter() {
      this.getList();
      this.Status = "list";
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    // 新增
    handleCreate(row) { 
      saveQuery().then(response => {
            this.ItemsOption = response.data.dataList;  
      }); 
      this.Status = 'create';  
    },
    // 修改
    handleUpdate(row) {
      //  window.location.href="/#/processManager/maintain?pro=update&id="+row.id;
      this.Status = 'update';   
      info(row.id).then(response => {
        this.form = response.data; 
      });  
    },
    // 明细
    info(row){   
      this.Status = 'info';   
      info(row.id).then(response => {
            this.form = response.data;  
            console.log(this.form);
            // console.log(this.form);      
            // console.log('图片4个接口');
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
      });    
      
    },
    // 上传按钮事件
    handupload(row){  
       this.info(row);   
       this.Status = 'upload';
    },
    // 删除。 
    handleDelete1(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              // const index = this.list.indexOf(row);
              // this.list.splice(index, 1);
              this.handleFilter();
            });
        });
    },
    // 作废
    handleDelete(row) { 
      if(row.status == 1)
      {
        this.delpro.status = 0 
        var msg = '作废';
      }else{
        this.delpro.status = 1
        var msg = '启用';
      }
      this.delpro.id = row.id; 
      this.del.list.push(this.delpro);
      // console.log(this.delpro);
      // console.log(this.del);
      this.$confirm('此操作将对产品'+msg+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(this.del)
            .then(() => {
              this.$notify({
                title: '成功',
                message: msg+'成功',
                type: 'success',
                duration: 2000
              });
              this.getListPage();
              this.del.list = [];
              // console.log('重新清空'); 
              // const index = this.list.indexOf(row);
              // this.list.splice(index, 1);
            });
        });
    },
    // 批量作废
    batchDelete() {    
      var list = this.del.list
      list.forEach(row => {
        row.status = 0;
      });
      if(this.del.list.length == 0){
              this.$notify({
                title: '操作失败',
                message:'请选择数据',
                type: 'warning',
                duration: 2000
              });
      }else{
          this.$confirm('此操作将对选中的产品进行批量作废, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                delObj(this.del)
                  .then(() => {
                    this.$notify({
                      title: '成功',
                      message:'作废成功',
                      type: 'success',
                      duration: 2000
                    });
                    this.del.list = []; 
                    this.getList(); 
                  });
              });
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
        if(this.form.updateDate!=null){
          this.form.updateDate = this.time(this.form.updateDate); 
        }
        if(this.form.issueDate!=null){
          this.form.issueDate = this.time(this.form.issueDate);
        }
        addObj(this.form).then(() => { 
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });  
            this.resetTemp();
            this.handleFilter();
        }); 
    }, 
    update(formName) {
       // 转化时间的格式。
      if(this.form.updateDate!=null){
        this.form.updateDate = this.time(this.form.updateDate); 
      }
      if(this.form.issueDate!=null){
        this.form.issueDate = this.time(this.form.issueDate);
      }
      // const set = this.$refs;
      // set[formName].validate(valid => {
      //  if (valid) {
          putObj(this.form.id, this.form).then(() => { 
             this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });  
            this.resetTemp();
            this.handleFilter(); 
          });
        // } else {
        //   return false;
        // }
      // });
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

      var  data = new Date().getTime();
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
    cancel(formName) {
      this.dialogFormVisible_import = false;
      this.dialogFormVisible_upload = false;
      this.$refs[formName].resetFields();
    }, 
    handleSelectionChange(val) {
        this.multipleSelection = val;
        var proList = [];
        val.forEach(row => {
          var pro = {};
          pro.id = row.id
          pro.status =  row.status 
          proList.push(pro); 
        });
        this.del.list = proList;
    },
    // 恢复版本
    restore(row){
      this.$confirm('是否恢复到上一版本，是的话则把当前版本作废', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          restore(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message:'恢复成功',
                type: 'success',
                duration: 2000
              });
              this.del.list = []; 
              this.getList();   
            });
        });
    },
    // 历史版本
    queryVersion(row){ 
      this.listVersion.u9Coding = row.u9Coding;
      getVersion(this.listVersion)
            .then(response => {
              console.log('历史版本');
              // console.log(response);
              this.list = response.data.rows;
              this.total = response.data.total;
              this.listLoading = false;
              this.Status = 'version';
            });
    },
    // 下载模板
    download(){
         downloadObj().then(response =>{ 
          // window.location.href = "/api/product/process/ftpDownload";
          //     this.$notify({
          //       title: '成功',
          //       message:'下载成功',
          //       type: 'success',
          //       duration: 2000
          //     });    
          }); 
    },
    // 导入弹出框
    handleImport(){
      // 清空数据
      this.importValue = '';
      this.dialogStatus = 'import';
      this.dialogFormVisible_import = true;
    },  
    // 输出导入结果
    importSubcess(response){ 
      // console.log(response);
      var rows = response.data;
      rows.forEach(row => { 
            this.importValue += row+"\n";
      }); 
      this.handleFilter();
      this.$notify({
          title: "导入成功",
          message: "数据导入成功",
          type: "success",
          duration: 2000
        });  
    },
    // 上传失败的方法
    importError(){
      this.$notify({
          title: "导入失败",
          message: "只能上传xlsx,csv文件,",
          type: "warning",
          duration: 2000
        });  
    },
    // 历史记录操作 后的返回,清空参数
    getListPage(){
      this.Status = "list";
      // 去掉历史版本视图 和 参数
      this.dialogStatus = undefined; 
      this.listQuery.u9Coding = null;
      // 清空this.form 
      this.resetTemp();
      page(this.listQuery)
        .then(response => { 
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;  
        });
    },
    //  u9coding的模糊查询
    selevtValue(value){   
      if(value != ''){ 
        query(value).then(response => {  
            this.Items = response.data.dataList; 
          });
      } 
    },
    // 重置参数
     resetTemp() {
      this.form = {
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
      } 
    }
  }
}
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
.el-tabs{
    // .el-col{
    //   text-align: center;
    // }
    // .el-form-item{
    //   width:45%;
    // }
    // .max_list{
    //   // width: 92%;
    //   width: 97%;
    // }
    // .el-form-item{
    //   .el-form-item__label{
    //     width: 100px!important;
    //   }
    // }
    .el-input,.el-select { 
      width: 250px !important;
    }
    // .maxinput { 
    //   width: 922px !important;
    //   // width: 985px !important;
    // }
    .footer {
      width: 92%;
      text-align: center;
    }
    .el-button{
      min-width: 200px;
  }
}
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
  width: 400px;
  height: 38px;
  text-align: center;  
  border:1px solid;
}
.info .maxspan{
  display: inline-block;
  width: 922px;
  // width: 985px;
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
