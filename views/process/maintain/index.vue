<template>
<div class="app-container calendar-list-container"> 
       <!-- 两个操作- -->
       <div v-if="Status=='list' || Status=='version'">   
        <div v-if="Status=='list'" class="filter-container"> 
            <!-- <el-select v-model="listQuery.u9Coding" v-sroll='selectValue0'  clearable filterable  remote :remote-method="selectValue"  placeholder="U9产品编码" style="width: 200px;" class="filter-item"> 
              <el-option
                v-for="item in Items"
                :key="item.u9Coding"
                :label="item.u9Coding+'('+item.productModel+')'"
                :value="item.u9Coding">
              </el-option>
            </el-select>   -->
            <el-autocomplete style="width: 200px;" class="filter-item"
              v-model="listQuery.u9Coding" 
              :fetch-suggestions="selectValue"
              placeholder="U9产品编码"
              @select="handleSelect"> 
            </el-autocomplete>  
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户" v-model="listQuery.customer"> </el-input>
            <el-select @keyup.enter.native="handleFilter" clearable class="filter-item" style="width: 200px;"  v-model="listQuery.status" placeholder="状态">
                <el-option v-for="item in staticOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>  
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      </div>
      <div class="filter-container" v-if=" Status=='list'">     
            <el-button class="filter-item"    style="margin-left: 10px;"  @click="handleCreate"   type="primary" icon="plus">新增</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary" icon="minus" @click="batchDelete">批量作废</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary"  @click="handleImport" >导入Excel</el-button>
             <el-button class="filter-item"    style="margin-left: 10px;"  type="primary" @click="handleExport">导出Excel</el-button>
            <el-button class="filter-item"    style="margin-left: 10px;"  type="primary" @click="download">Excel模板下载</el-button>
      </div> 
      <!-- 历史记录的返回 -->
      <div v-if=" Status=='version'" class="filter-container"> 
        <el-button class="filter-item"  v-if=" Status=='version'"    style="margin-left: 10px;float:right;" @click="getListPage()" type="primary" >返回列表</el-button> 
      </div>
      <!-- 数据表格 -->
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row  style="width: 100%"  @selection-change="handleSelectionChange">   
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column align="center" label="U9产品编码" width="200" > <template scope="scope" >
                <span  @click="info(scope.row)" style="cursor:pointer;">{{scope.row.u9Coding}}</span>
              </template> </el-table-column>
          <el-table-column  align="center" label="产品型号" width="200"> <template scope="scope">
              <span>{{scope.row.productModel}}</span>
            </template> </el-table-column>
          <el-table-column  align="center" label="客户" width="150"> <template scope="scope">
                  <span>{{scope.row.customer}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="版本" width="150"> <template scope="scope">
                  <span>{{scope.row.version}}</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="状态" width="150"> <template scope="scope">
                  <span v-if="scope.row.status==0">作废</span>
                  <span v-if="scope.row.status==1">有效</span>
                </template> </el-table-column>
          <el-table-column  align="center" label="文件编码" width="210"> <template scope="scope">
                  <span>{{scope.row.fileCoding}}</span>
                </template> </el-table-column>
          </el-table-column> 
          <el-table-column  align="center" label="操作" :width=this.width fixed="right"> 
            <template scope="scope" >
                <el-button v-if=" maintainManager_uploadView && scope.row.status==1 && Status!='version'" size="small" type="info" @click="handupload(scope.row)">上传
                </el-button> 
                <el-button v-if=" scope.row.status==1 && Status!='version'"  size="small" type="success" @click="handleUpdate(scope.row)">编辑
                </el-button>
                <el-button v-if=" scope.row.status==1 " size="small" type="warning" @click="handleDelete(scope.row)">作废
                </el-button>
                <el-button v-if=" scope.row.status==0 " size="small" type="warning" @click="handleDelete(scope.row)">启用
                </el-button>
                <el-button v-if=" scope.row.status==1 && Status!='version'"  size="small" type="info"  @click="restore(scope.row)">恢复版本
                </el-button>
                <el-button   size="small" type="info"   @click="info(scope.row)">明细
                </el-button>
                <el-button  v-if=" Status!='version'" size="small" type="info"  @click="queryVersion(scope.row)" >历史版本
                </el-button> 
              </template> 
          </el-table-column>  
      </el-table>
      <!-- 分页 -->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
</div>

    <!-- 导入弹出框    :http-request="importFile" -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible_import">   
        <el-form  label-width="100px">
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"  drag
            :action="this.baseUrl+'/api/product/process/excelInport'" 
            :show-file-list="false"
            :headers="myHeaders"
            :on-success	= "importSubcess"
            :on-error = "importError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div> 
            <div class="el-upload__tip" slot="tip">只能导入xlsx/xls文件</div>
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
        
        <!-- 新增或者修改 -->
        <el-form :model="form" :rules="rules" ref="form" v-if="Status == 'create' || Status=='update'"   label-width="100px"  :inline="true" class="add">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="u9产品编号" class="max_lable" prop="u9Coding">  
                    <!-- <el-select v-if="Status=='create'" v-model="form.u9Coding" filterable @change="handleInfo()" placeholder="请输入u9产品编号"> 
                        <el-option
                        v-for="item in ItemsOption"
                        :key="item.u9Coding"
                        :label="item.u9Coding"
                        :value="item.u9Coding">
                        </el-option>
                    </el-select>  --> 
                    <!-- <el-select v-if="Status=='create'" v-model="form.u9Coding"  clearable filterable  remote :remote-method="selectValue1"  placeholder="U9产品编码" style="width: 200px;" class="filter-item"> 
                      <el-option
                        v-for="item in ItemsOption"
                        :key="item.code"
                        :label="item.code"
                        :value="item.code">
                      </el-option>
                    </el-select>   -->
                     <el-select v-if="Status=='create'" v-sroll='selectValue2' v-model="form.u9Coding"  clearable filterable  remote :remote-method="selectValue1"  placeholder="U9产品编码" > 
                      <el-option
                        v-for="item in ItemsOption"
                        :key="item.code"
                        :label="item.code"
                        :value="item.code">
                      </el-option>
                    </el-select>  

                    <el-input  v-if="Status=='update'"  placeholder="" v-model="form.u9Coding" readonly></el-input>
                  </el-form-item> 
                </el-col> 
                <el-col :span="12">
                  <el-form-item label="产品编号" prop="productModel">
                    <el-input   placeholder="请输入产品编号" v-model="form.productModel"></el-input> 
                  </el-form-item>
                </el-col>
             </el-row>
              
             <el-row>
                <el-col :span="12">
                  <el-form-item  label="客户" prop="customer">
                    <el-input   placeholder="请输入客户名称" v-model="form.customer"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item  label="备注" >
                    <el-input   placeholder="请输入备注" v-model="form.remark"></el-input> 
                  </el-form-item>
                </el-col>
             </el-row> 
      
            <el-row>
                <el-col :span="12"> 
                    <el-form-item label="文件编号">
                      <el-input  placeholder="请输入文件编码" v-model="form.fileCoding" ></el-input>
                    </el-form-item> 
                </el-col> 
                <el-col :span="12"> 
                  <el-form-item label="版本">
                    <el-input  type="number" placeholder="请输入版本" v-model="form.version"></el-input>
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
                <el-col :span="12"> 
                      <el-form-item label="钢印"  >
                        <el-select v-model="form.steelSeal" placeholder="请选择 ">
                          <el-option label="有" value="有"></el-option>
                          <el-option label="无" value="无"></el-option>
                        </el-select>
                        </el-form-item>
                </el-col>
                <el-col :span="12">
                        <el-form-item label="涂喷颜色">
                          <el-input  placeholder="请输入涂喷颜色" v-model="form.sprayingColor"></el-input>
                        </el-form-item>
                </el-col>
             </el-row>

             <el-row>
                 <el-col :span="12"> 
                        <el-form-item label="移印/喷印">
                          <el-input  placeholder="移印/喷印" v-model="form.moveSeal"></el-input>
                        </el-form-item> 
                </el-col>
                <el-col :span="12"> 
                    <el-form-item label="包装袋" >
                      <el-select v-model="form.bubbleWith" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                     </el-form-item>
                </el-col>
             </el-row>
             <el-row>
              <el-col :span="12"> 
                    <el-form-item label="产品POF过塑" >
                        <el-select v-model="form.pofPlasticProducts" placeholder="请选择 ">
                          <el-option label="透明" value="透明"></el-option>
                          <el-option label="专用" value="专用"></el-option>
                          <el-option label="无" value="无"></el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
                  <el-col :span="12"> 
                      <el-form-item label="纸筒" >
                        <el-select v-model="form.paperTube" placeholder="请选择 ">
                          <el-option label="有" value="有"></el-option>
                          <el-option label="无" value="无"></el-option>
                        </el-select>
                      </el-form-item>
                  </el-col> 
             </el-row>

             <el-row> 
                <el-col :span="12"> 
                    <el-form-item label="箱过塑"  >
                      <el-select v-model="form.casePlastic" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                     </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="盒过塑"  >
                      <el-select v-model="form.boxPlastic" placeholder="请选择 ">
                        <el-option label="透明" value="透明"></el-option>
                        <el-option label="专用" value="专用"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
             </el-row>
 
             <el-row> 
                <el-col :span="12"> 
                  <el-form-item label="配方">
                    <el-input disabled  placeholder="配方"  v-model="form.bedCharge"></el-input>
                  </el-form-item> 
                </el-col> 
                <el-col :span="12"> 
                  <el-form-item label="子件料号">
                    <el-input disabled  placeholder="子件料号"  v-model="form.childThingNumber"></el-input> 
                  </el-form-item> 
                </el-col> 
             </el-row>
             <el-row> 
                <el-col :span="12"> 
                      <el-form-item label="盒号">
                    <el-input disabled  placeholder="盒号" v-model="form.boxNumber"></el-input>
                  </el-form-item> 
                </el-col>
                <el-col :span="12">
                       <el-form-item label="箱号">
                    <el-input disabled  placeholder="箱号" v-model="form.caseNumber"></el-input>
                  </el-form-item> 
                </el-col>
             </el-row>
             <!-- <el-row> 
                <el-col :span="24"> 
                      <el-form-item label="子件料号">
                    <el-input disabled type="textarea"  class="maxspan" placeholder="请输入子件料号" v-model="form.childThingNumber"></el-input>
                  </el-form-item> 
                </el-col> 
             </el-row> -->
                
             <el-row>
                <el-col :span="12"> 
                    <el-form-item label="盒标签1">
                      <el-input  placeholder="请输入盒标签1" v-model="form.box1Label" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                    <el-form-item label="数量">
                      <el-input type="number"  placeholder="请输入数量" v-model="form.box1Num" ></el-input>
                    </el-form-item>
                </el-col>  
             </el-row>

             <el-row>  
                <el-col :span="12"> 
                     <el-form-item label="盒标签2">
                      <el-input  placeholder="请输入盒标签2" v-model="form.box2Label"></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                    <el-form-item label="数量">
                      <el-input  type="number" placeholder="请输入数量" v-model="form.box2Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>

             <el-row>  
                <el-col :span="12"> 
                     <el-form-item label="盒标签3">
                      <el-input  placeholder="请输入盒标签3" v-model="form.box3Label"></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                    <el-form-item label="数量">
                      <el-input  type="number" placeholder="请输入数量" v-model="form.box3Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>

             <el-row>  
                <el-col :span="12"> 
                     <el-form-item label="盒标签4">
                      <el-input  placeholder="请输入盒标签4" v-model="form.box4Label"></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                    <el-form-item label="数量">
                      <el-input type="number"  placeholder="请输入数量" v-model="form.box4Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>
              
             <el-row>
                <el-col :span="12"> 
                     <el-form-item label="箱标签1">
                      <el-input  placeholder="请输入箱标签1" v-model="form.case1Label" ></el-input>
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                     <el-form-item label="数量">
                      <el-input type="number"  placeholder="请输入数量" v-model="form.case1Num" ></el-input>
                    </el-form-item>
                </el-col>  
             </el-row>
             <el-row> 
                <el-col :span="12"> 
                      <el-form-item label="箱标签2">
                        <el-input  placeholder="请输入箱标签2" v-model="form.case2Label"></el-input>
                      </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                    <el-form-item label="数量">
                      <el-input type="number"  placeholder="请输入数量" v-model="form.case2Num" ></el-input>
                    </el-form-item>
                </el-col> 
             </el-row>
            
             <el-row>
                <el-col :span="12"> 
                    <el-form-item label="说明书"> 
                            <el-input  placeholder="请输入说明书" v-model="form.instructions" ></el-input>   
                    </el-form-item>
                </el-col> 
                <el-col :span="12"> 
                      <el-form-item label="合格证" > 
                              <el-input  placeholder="请输入合格证" v-model="form.qualifiedCertificate" ></el-input>    
                      </el-form-item>
                </el-col>  
             </el-row>
             <el-row> 
                <el-col :span="12"> 
                      <el-form-item label="封口贴"> 
                              <el-input  placeholder="请输入封口贴" v-model="form.sealingPaste" ></el-input>  
                      </el-form-item> 
                </el-col> 
                <el-col :span="12"> 
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
                        <el-input type="number"  placeholder="请输入数量" v-model="form.packagingTapeNumber" ></el-input>
                      </el-form-item>
                </el-col> 
              </el-row>
              <el-row>  
                <el-col :span="24"> 
                     <el-form-item label="隔板" >
                        <el-input placeholder="请输入隔板"   v-model="form.clapboard"></el-input>
                     </el-form-item>
                </el-col> 
              </el-row>
              <el-form-item size="large" class="footer">
                    <el-button v-if="Status=='create'" type="primary"  @click="create('form')">保存</el-button> 
                    <el-button v-if="Status=='update'" type="primary"  @click="update('form')">保存</el-button>  
                    <el-button  @click="getListPage()">取消</el-button>
              </el-form-item>
        </el-form>  
        <!-- 明细 和 上传 -->
        <el-form :model="form" v-if="Status == 'info' || Status=='upload'" label-width="100px"  :inline="true" class="info">
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
                  <span  v-html="form.version"></span>   
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
            <el-form-item label="移印/喷印"  >
                  <span v-html="form.moveSeal"></span>      
            </el-form-item> 
            <el-form-item label="包装袋"   >
                  <span v-html="form.bubbleWith"></span>       
            </el-form-item> 
            <el-form-item label="产品POF过塑"   >
                <span v-html="form.pofPlasticProducts"></span>       
            </el-form-item>
            </el-row> 
            
            <el-row> 
            <el-form-item label="纸筒"  >
                <span v-html="form.paperTube"></span>       
            </el-form-item>
            <el-form-item label="箱过塑"   >
                <span v-html="form.casePlastic"></span>        
            </el-form-item>
            <el-form-item label="盒过塑"   >
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
            
            <el-row>
            <el-form-item label="配方"> 
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
                   <!-- <el-input type="textarea" class="maxspan" v-model="form.childThingNumber" readonly></el-input> -->
                   <span class="maxspan" v-html="form.childThingNumber"></span>  
              </el-form-item>
            </el-row>  
            
            <el-row >
              <el-form-item label="隔板" > 
                   <!-- <el-input type="textarea" class="maxspan" v-model="form.remark" readonly></el-input> -->
                  <span class="maxspan" v-html="form.clapboard"></span>  
              </el-form-item>
            </el-row>

            <el-row >
              <el-form-item label="备注" > 
                   <!-- <el-input type="textarea" class="maxspan" v-model="form.remark" readonly></el-input> -->
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

    <!--工艺图纸上传-->
    <el-tabs v-model="activeName1" v-if="Status=='upload'"> 
          <el-tab-pane  label="工艺图纸上传" name="first" >   
            <el-form :model="form"  label-width="100px"  class="upload" > 
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
            :on-error	= "uploadError">
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
  deleteObj,
  putObj,
  query,
  u9query,
  restore,
  getVersion,
  importObj,
  exportObj,
  downloadObj,
  saveQuery,
  selectViewForU9Conding,
  info,
  uploadObj,
  deluploadObj,
  pic
} from "api/process/maintain/index";
import { mapGetters } from "vuex";
import defaultImg from "assets/images/defaultImg.png";
export default {
  name: "user",
  data() {
    return {
      options: {
        data: [
          { id: 0, text: "enhancement" },
          { id: 1, text: "bug" },
          { id: 2, text: "duplicate" },
          { id: 3, text: "invalid" },
          { id: 4, text: "wontfix" }
        ]
      },
      width: 450,
      myHeaders: {},
      activeName: "first",
      activeName1: "first",
      staticOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "有效"
        },
        {
          value: "0",
          label: "作废"
        }
      ],
      del: {
        list: []
      },
      delpro: {
        id: "",
        status: ""
      },
      export: "",
      Items: undefined,
      ItemsOption: undefined,
      form: {
        status: undefined,
        u9Coding: undefined,
        productModel: undefined,
        customer: undefined,
        remark: undefined,
        version: undefined,
        fileCoding: undefined,
        issueCoding: undefined,
        issueDate: undefined,
        updateDate: undefined,
        steelSeal: undefined,
        moveSeal: undefined,
        bubbleWith: undefined,
        pofPlasticProducts: undefined,
        paperTube: undefined,
        boxPlastic: undefined,
        casePlastic: undefined,
        box1Label: undefined,
        box1Num: undefined,
        box2Label: undefined,
        box2Num: undefined,
        box3Label: undefined,
        box3Num: undefined,
        box4Label: undefined,
        box4Num: undefined,
        case1Label: undefined,
        case1Num: undefined,
        case2Label: undefined,
        case2Num: undefined,
        qualifiedCertificate: undefined,
        sealingPaste: undefined,
        packagingTape: undefined,
        packagingTapeNumber: undefined,
        sealingGummedPaper: undefined,
        shellFabric: undefined,
        bedCharge: undefined,
        boxNumber: undefined,
        caseNumber: undefined,
        childThingNumber: undefined,
        crtName: undefined,
        crtTime: undefined,
        updName: undefined,
        updTime: undefined,
        clapboard: undefined,
        process1PicturePath: undefined,
        process2PicturePath: undefined,
        process3PicturePath: undefined,
        process4PicturePath: undefined
      },
      rules: {
        u9Coding: [
          {
            required: true,
            message: "请选择产品编号",
            trigger: "blur"
          }
        ],
        productModel: [
          {
            required: true,
            message: "请输入产品编号",
            trigger: "blur"
          }
        ],
        customer: [
          {
            required: true,
            message: "请输入客户",
            trigger: "blur"
          }
        ]
      },
      list: null,
      total: null,
      listtotal: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        u9Coding: "",
        customer: "",
        status: "1"
      },
      listVersion: {
        page: 1,
        limit: 10
      },
      u9listQuery: {
        u9Coding: "",
        page: 1,
        limit: 30
      },
      importValue: "",
      dialogFormVisible_import: false,
      dialogFormVisible_upload: false,
      Status: "list",
      dialogStatus: "",
      maintainManager_uploadView: false,
      textMap: {
        update: "编辑产品",
        create: "新增产品",
        info: "工艺信息",
        import: "工艺信息导入",
        upload: "工艺信息上传"
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
    // 导入加入token.
    this.myHeaders.Authorization = this.token;
    // 获取配置里面的公共api 用来做图片的显示。
    this.baseUrl = ApiUrl; 
  },
  computed: {
    ...mapGetters(["elements", "token"])
  },
  methods: { 
    // 列表查询
    getList() {
      this.listLoading = true; 
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    // 刷新列表和赋值状态
    handleFilter() {
      this.getList();
      this.Status = "list";
    },

    // 改每页显示的数量
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    // 改页数
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    // 跳到新增界面，根据Status做判断
    handleCreate(row) { 
      this.ItemsOption = "";
      this.Status = "create";
    },

    // 跳到修改界面，根据Status做判断
    handleUpdate(row) {
      this.Status = "update";
      info(row.id).then(response => {
        this.form = response.data;
      });
    },

    // 跳到明细界面，根据Status做判断  -- 路径得重新配置
    info(row) {
      this.Status = "info";
      info(row.id).then(response => {
        this.form = response.data;

        // 赋值4个路径进去.
        for (var i = 1; i < 5; i++) { 
          this.form['process'+i+'PictureHref'] = this.baseUrl + "/api/product/process/photo/" + this.form.id + "/"+i;
        } 
        // console.log(this.form); 
        // http请求图片地址，返回base图片结果，赋值在src上。
          pic(row.id).then(response => {
            this.form.process1PictureName_src = response.tupian1;
            this.form.process2PictureName_src = response.tupian2;
            this.form.process3PictureName_src = response.tupian3;
            this.form.process4PictureName_src = response.tupian4; 
            if(this.form.remark == null){
              this.form.remark = ' ';
            }else{ 
              this.form.remark =this.form.remark+' ';
            }
            // console.log(this.form.process1PicturePath);
          });
      });
    },

    // 上传按钮事件  进入上传界面(数据跟明细一样)。 Status判断
    handupload(row) {
      this.info(row);
      this.Status = "upload";
    },

    // 作废  单个
    handleDelete(row) {
      if (row.status == 1) {
        this.delpro.status = 0;
        var msg = "作废";
      } else {
        this.delpro.status = 1;
        var msg = "启用";
      }
      this.delpro.id = row.id;
      this.del.list.push(this.delpro);
      // console.log(this.delpro);
      // console.log(this.del);
      this.$confirm("此操作将对产品" + msg + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(this.del).then(() => {
          this.$notify({
            title: "成功",
            message: msg + "成功",
            type: "success",
            duration: 2000
          });
          this.getListPage();
          this.del.list = [];
          // console.log('重新清空参数');
          // const index = this.list.indexOf(row);
          // this.list.splice(index, 1);
        });
      });
    },

    // 批量作废
    batchDelete() {
      var list = this.del.list;
      list.forEach(row => {
        row.status = 0;
      });
      if (this.del.list.length == 0) {
        this.$notify({
          title: "操作失败",
          message: "请选择数据",
          type: "warning",
          duration: 2000
        });
      } else {
        this.$confirm("此操作将对选中的产品进行批量作废, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delObj(this.del).then(() => {
            this.$notify({
              title: "成功",
              message: "作废成功",
              type: "success",
              duration: 2000
            });
            this.del.list = [];
            this.getList();
          });
        });
      }
    },

    // 用在新增和修改上的时间格式装换
    time(value) {
      var date = new Date(value);
      var Y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var H = date.getHours();
      var i = date.getMinutes();
      var s = date.getSeconds();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (H < 10) {
        H = "0" + H;
      }
      if (i < 10) {
        i = "0" + i;
      }
      var t = Y + "-" + m + "-" + d + " " + H + ":" + i + ":" + s;
      return t;
    },

    // 新增的方法
    create(formName) {
      // 转化时间的格式。
      if (this.form.updateDate != null) {
        this.form.updateDate = this.time(this.form.updateDate);
      }
      if (this.form.issueDate != null) {
        this.form.issueDate = this.time(this.form.issueDate);
      }
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
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
        } else {
          return false;
        }
      });
    },

    // 修改的方法
    update(formName) {
      // 转化时间的格式。
      if (this.form.updateDate != null) {
        this.form.updateDate = this.time(this.form.updateDate);
      }
      if (this.form.issueDate != null) {
        this.form.issueDate = this.time(this.form.issueDate);
      }
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
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
        } else {
          return false;
        }
      });
    },

    // 图片上传的弹出框 获取相应按钮对应的是第几张图片。让其出现弹出框
    upload(type) {
      this.dialogStatus = "upload";
      this.dialogFormVisible_upload = true;
      // 把类型划分为1,2,3,4
      this.form.type = type;
    },

    // 输出上传结果 ------------ 上传成功
    uploadSubcess(response) { 
      // console.log('上传成功--图片4个接口');
     
      var data = response.data;
      var type = this.form.type;  

      pic(data.id).then(response => { 
          this.form["process" + type + "PictureName_src"] = response["tupian"+type];
          this.form["process" + type + "PicturePath"] = data["process" + type + "PicturePath"] 
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

    //  上传图片删除的方法
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
    },

    //  上传或者导入弹出框关闭的方法。
    cancel(formName) {
      this.dialogFormVisible_import = false;
      this.dialogFormVisible_upload = false;
      this.$refs[formName].resetFields();
    },

    // 批量作废 复选框选中的值， 用 this.del 来存值
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 批量删除
      var proList = [];
      val.forEach((row, index) => {
        var pro = {};
        pro.id = row.id;
        pro.status = row.status;
        proList.push(pro);
      });
      this.del.list = proList;
    },

    // 恢复版本
    restore(row) {
      this.$confirm("是否恢复到上一版本，是的话则把当前版本作废", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        restore(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "恢复成功",
            type: "success",
            duration: 2000
          });
          this.del.list = [];
          this.getList();
        });
      });
    },

    // 历史版本
    queryVersion(row) {
      this.listVersion.u9Coding = row.u9Coding;
      getVersion(this.listVersion).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
        this.Status = "version";
        this.width = 200;
      });
    },

    // 下载模板
    download() {
      downloadObj().then(response => {
        window.location.href =
          this.baseUrl + "/api/product/process/ftpDownload";
        //     this.$notify({
        //       title: '成功',
        //       message:'下载成功',
        //       type: 'success',
        //       duration: 2000
        //     });
      });
    },

    // 导入弹出框
    handleImport() {
      // 清空数据
      this.importValue = "";
      this.dialogStatus = "import";
      this.dialogFormVisible_import = true;
    },

    // 输出导入结果
    importSubcess(response) {
      // console.log(response);
      var rows = response.data;
      rows.forEach(row => {
        this.importValue += row + "\n";
      });
      this.handleFilter();
      this.$notify({
        title: "导入成功",
        message: "数据导入成功",
        type: "success",
        duration: 2000
      });
    },

    // 导入失败的方法
    importError() {
      this.$notify({
        title: "导入失败",
        message: "非法操作，导入失败",
        type: "warning",
        duration: 2000
      });
    },

    // 导出export
    handleExport() {
      var u9Coding = this.listQuery.u9Coding;
      if (u9Coding == null) {
        u9Coding = "";
      }
      var customer = this.listQuery.customer;
      var status = this.listQuery.status;
      this.$confirm(
        "此操作将对列表中的所有产品进行批量导出, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        exportObj(u9Coding, customer, status).then(() => {
          window.location.href =
            this.baseUrl +
            "/api/product/process/photo/export?u9Coding=" +
            u9Coding +
            "&customer=" +
            customer +
            "&status=" +
            status;
          this.$notify({
            title: "成功",
            message: "导出成功",
            type: "success",
            duration: 2000
          });
          this.del.list = [];
          this.getList();
        });
      });
    },

    // 历史记录操作 后的返回,清空参数
    getListPage() {
      this.Status = "list";
      // 去掉历史版本视图 和 参数
      // this.dialogStatus = undefined;
      // this.listQuery.u9Coding = null;
      // 清空this.form
      this.resetTemp();
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total; 
        this.width = 450;
      });
    },

    //  u9coding的模糊查询
    // selectValue(value) {
    //   this.Items = [];
    //   this.u9listQuery.page = 1; //重置页数
    //   this.u9listQuery.u9Coding = value;
    //   query(this.u9listQuery).then(response => {
    //     this.Items = response.data.rows;
    //     // console.log(response);
    //   });
    // },
    //  u9coding的模糊查询
    selectValue(queryString, cb) {
      this.u9listQuery.page = 1; //重置页数
      if (queryString != null) {
        this.u9listQuery.u9Coding = queryString;
      }
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
    // selectValue0() {
    //   this.u9listQuery.page++;
    //   query(this.u9listQuery).then(response => {
    //     var data = response.data.rows;
    //     for (var i = 0; i < data.length; i++) {
    //       data[i].value = data[i].u9Coding + "(" + data[i].productModel + ")";
    //     }
    //     cb(data);
    //   });
    // },
    //  u9coding新增的模糊查询
    selectValue1(value) {
      this.ItemsOption = [];
      this.u9listQuery.page = 1; //重置页数
      this.u9listQuery.u9Coding = value;
      u9query(this.u9listQuery).then(response => {
        this.ItemsOption = response.data.rows;
        // 以下处理是为了带出
        var rows = response.data.rows;
        var idList = [];
        for (var i = 0; i < rows.length; i++) {
          idList.push(rows[i].code);
        }
        var indexOf = idList.indexOf(value);
        var data = response.data.rows[indexOf];
        if (data != undefined) {
          if (data.value2_30 != undefined) {
            this.form.bedCharge = data.value2_30;
          } else {
            this.form.bedCharge = null;
          }
          if (data.value3_52 != undefined) {
            this.form.boxNumber = data.value3_53;
          } else {
            this.form.boxNumber = null;
          }
          if (data.value3_53 != undefined) {
            this.form.caseNumber = data.value3_52;
          } else {
            this.form.caseNumber = null;
          }
          if (data.value_else != undefined) {
            this.form.childThingNumber = data.value_else;
          } else {
            this.form.childThingNumber = null;
          }
        }
      });
      // info(value).then(response => {
      //   // this.form = response.data;
      //   console.log(response);
      // });
    },

    selectValue2() {
      this.u9listQuery.page++;
      u9query(this.u9listQuery).then(response => {
        this.ItemsOption = this.ItemsOption.concat(response.data.rows);
      });
    },

    // 重置参数
    resetTemp() {
      this.form = {
        status: undefined,
        u9Coding: undefined,
        productModel: undefined,
        customer: undefined,
        remark: undefined,
        version: undefined,
        fileCoding: undefined,
        issueCoding: undefined,
        issueDate: undefined,
        updateDate: undefined,
        steelSeal: undefined,
        moveSeal: undefined,
        bubbleWith: undefined,
        pofPlasticProducts: undefined,
        paperTube: undefined,
        boxPlastic: undefined,
        casePlastic: undefined,
        box1Label: undefined,
        box1Num: undefined,
        box2Label: undefined,
        box2Num: undefined,
        box3Label: undefined,
        box3Num: undefined,
        box4Label: undefined,
        box4Num: undefined,
        case1Label: undefined,
        case1Num: undefined,
        case2Label: undefined,
        case2Num: undefined,
        qualifiedCertificate: undefined,
        sealingPaste: undefined,
        packagingTape: undefined,
        packagingTapeNumber: undefined,
        sealingGummedPaper: undefined,
        shellFabric: undefined,
        bedCharge: undefined,
        boxNumber: undefined,
        caseNumber: undefined,
        childThingNumber: undefined,
        crtName: undefined,
        crtTime: undefined,
        updName: undefined,
        updTime: undefined,
        clapboard: undefined,
        process1PicturePath: undefined,
        process2PicturePath: undefined,
        process3PicturePath: undefined,
        process4PicturePath: undefined
      };
    }
  }
};
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
.el-tabs {
  .el-input,
  .el-select {
    width: 400px !important;
  }
  .footer {
    width: 92%;
    text-align: center;
  }
  .el-button {
    min-width: 200px;
  }
}
.list {
  position: absolute;
  right: 20px;
  z-index: 1;
}
.add .maxspan {
  display: inline-block;
  width: 1050px !important;
  // width: 981px !important;
  // width: 635px;
  // width: 985px;
  text-align: center;
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

.upload .el-button {
  min-width: 200px;
  height: 38px;
}
</style>
