/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record','N/runtime'], (serverWidget,url,search,record,runtime) => {

const onRequest = (context) => {

var form = serverWidget.createForm({ title:' ' });

var request = context.request;
var from = request.parameters.from || '';
var isFromHome = (from === 'home');
  var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
         var dynamicTitle = context.request.parameters.title || 'Projects';
var pageParam = request.parameters.page;
var page = parseInt(pageParam, 10) || 0;
var filterType = context.request.parameters.filter;
log.debug("Filter Type", filterType);
if (isNaN(page) || page < 0) page = 0;
var pageSize = 10;


 var loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

});
var homeUrl = url.resolveScript({
                    scriptId:'customscript2874',
                    deploymentId:'customdeploy3',
                    returnExternalUrl:true,
                    params:{
        empid: empId,
        email: email
    }
                });

var viewProjectUrl = url.resolveScript({
scriptId: 'customscript2892',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});
var filters = [];

if(filterType === 'open'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'noneof',
        '5'
    ]);
}
else if(filterType === 'close'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '5'
    ]);
}
else if(filterType === 'inprogress'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '2'
    ]);
}
else if(filterType === 'kickof'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '6'
    ]);
}
else if(filterType === 'bussinessrequirement'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '7'
    ]);
}
else if(filterType === 'training'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '8'
    ]);
}

else if(filterType === 'golive'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '9'
    ]);
}
else if(filterType === 'coc'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '10'
    ]);
}
else if(filterType === 'support'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '11'
    ]);
}
else if(filterType === 'uat'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '3'
    ]);
}
else if(filterType === 'myprojects' && empId){

    filters.push([
        'custrecord1513.custrecord_rw_portal_projectmanager',
        'anyof',
        empId
    ]);
}
// total → no filter
var projectSearch = search.create({
    type: 'customrecord_rw_portal_access2',
     filters:filters,
    columns: [
    search.createColumn({
        name: 'internalid',
        sort: search.Sort.DESC 
    }),

    // 🔥 ADD THESE 2 LINES
    search.createColumn({
        name: 'custrecord_rw_portal_customername',
        join: 'custrecord1513'
    }),
    search.createColumn({
        name: 'custrecord_rw_portal_status',
        join: 'custrecord1513'
    }),

    search.createColumn({
        name: 'custrecord_rw_portal_status',
        join: 'custrecord1513'
    }),
    search.createColumn({
    name: 'custrecord_rw_portal_start_date',
    join: 'custrecord1513'
}),
search.createColumn({
    name: 'custrecord_rw_portal_end_date',
    join: 'custrecord1513'
}),
search.createColumn({
    name: 'custrecord_rw_portal_updatedenddate',
    join: 'custrecord1513'
}),
search.createColumn({
    name: 'custrecord_rw_portal_duration',
    join: 'custrecord1513'
}),
search.createColumn({
    name: 'custrecord_rw_portal_projectmanager',
    join: 'custrecord1513'
}),
search.createColumn({
    name: 'custrecord_rw_portal_pmocommnts',
    join: 'custrecord1513'
}),
    'custrecord_rw_portal_rwproduct', 
    'custrecord_rw_portal_additionalcomments',
    'custrecord1513',
    'custrecord_rw_portal_projstat',
    'custrecord_rw_portal_startdateline', 
'custrecord_rw_portal_enddateline' ,
'custrecord_rw_portal_updateddeadline',
'custrecord_rw_portal_durationline',
]
});

var tableRows = '';
var projectCounts = {};
var projectMap = {};
var start = page * pageSize;
var end = start + pageSize;

// var searchResult = projectSearch.run();  // RUN ONLY ONCE

// var results = [];
// if (!pageParam) page = 0;
// if (page < 0) page = 0;
// var pagedData = projectSearch.runPaged({ pageSize: 1000 });

// pagedData.pageRanges.forEach(function(pageRange){
//     var page = pagedData.fetch({ index: pageRange.index });
//     page.data.forEach(function(result){
//         results.push(result);
//     });
// });
// var totalCount = pagedData.count;

//  FETCH ONLY REQUIRED DATA (BUT KEEP LOGIC SAME)
var pagedData = projectSearch.runPaged({ pageSize: 1000 });

var totalCount = pagedData.count;

// load ALL but WITHOUT nested loops
var results = [];
for (var i = 0; i < pagedData.pageRanges.length; i++) {
    var pageData = pagedData.fetch({ index: i });
    results = results.concat(pageData.data);
}
results.forEach(function(result){

    var parentId = result.getValue('custrecord1513');
    var product = result.getText('custrecord_rw_portal_rwproduct');
    var productId = result.getValue('custrecord_rw_portal_rwproduct');
var additionalComments=result.getValue('custrecord_rw_portal_additionalcomments') || '';
var lineStartDate = result.getValue('custrecord_rw_portal_startdateline') || '';
var lineEndDate = result.getValue('custrecord_rw_portal_enddateline') || '';
var lineUpdatedDate = result.getValue('custrecord_rw_portal_updateddeadline') || '';
var lineDuration =result.getValue('custrecord_rw_portal_durationline');
log.debug(additionalComments)
    var status = result.getText('custrecord_rw_portal_projstat');
    log.debug(status) // ✅ ADD THIS
    if(!parentId) return;

 if (!projectMap[parentId]) {
    projectMap[parentId] = {
        customer: result.getText({ name: 'custrecord_rw_portal_customername', join: 'custrecord1513' }) || '',
        status: result.getText({ name: 'custrecord_rw_portal_status', join: 'custrecord1513' }) || '',
        customerId: result.getValue({ name: 'custrecord_rw_portal_customername', join: 'custrecord1513' }),

        startDate: result.getValue({ name: 'custrecord_rw_portal_start_date', join: 'custrecord1513' }) || '',
        endDate: result.getValue({ name: 'custrecord_rw_portal_end_date', join: 'custrecord1513' }) || '',
        updatedEndDate: result.getValue({ name: 'custrecord_rw_portal_updatedenddate', join: 'custrecord1513' }) || '',
        duration: result.getValue({ name: 'custrecord_rw_portal_duration', join: 'custrecord1513' }) || '',
        pm: result.getText({ name: 'custrecord_rw_portal_projectmanager', join: 'custrecord1513' }) || '',
        pmocomments: result.getValue({ name: 'custrecord_rw_portal_pmocommnts', join: 'custrecord1513' }) || '',
        additionalComments: result.getValue('custrecord_rw_portal_additionalcomments') || '',
        durationline: result.getValue('custrecord_rw_portal_durationline') || '',
        products: {}
    };
}

if(!projectMap[parentId].products[product]){
    projectMap[parentId].products[product] = {
        count: 0,
        status: status || 'NA',
        productId: productId,
        comments: additionalComments,
        startDate: lineStartDate,
    endDate: lineEndDate,
    updatedEndDate: lineUpdatedDate,
    duration: lineDuration
        
    };
}



projectMap[parentId].products[product].count++;
});
var projectIds = Object.keys(projectMap);

// 🔥 IMPORTANT: sort before pagination
projectIds.sort(function(a, b){
    return Number(b) - Number(a); // DESC order
});

var totalCount = projectIds.length;
var totalPages = Math.ceil(totalCount / pageSize);

// Fix invalid page
if (page >= totalPages) page = 0;

var start = page * pageSize;
var end = start + pageSize;

var paginatedProjectIds = projectIds.slice(start, end);

log.debug("Page", page);
log.debug("Paginated IDs", paginatedProjectIds);

var paginatedProjectIds = projectIds.slice(start, end);
    log.debug("page", page);
log.debug("start", page * pageSize);

function getTotalTicketCount(){
    var ticketSearch =search.create({
        type:'customrecord_rw_ticket',
        filters:[],
        columns:[],
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total tickets",count);
    return count;
}
var totalTickets=getTotalTicketCount();
function getOpenTicketCount(){
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_ticketstatus','noneof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total open tickets",count);
    return count;
}
function getTicketCounts(customerId){

    var total = 0;
    var open = 0;
    var closed = 0;

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        columns: [
            'custrecord_rw_ticket_projectname',
            'custrecord_rw_ticket_ticketstatus'
        ]
    });

    ticketSearch.run().each(function(result){

        var ticketCustomer = result.getValue('custrecord_rw_ticket_projectname');

        
        if(ticketCustomer == customerId){

            total++;

            var status = result.getValue('custrecord_rw_ticket_ticketstatus');

            if (status == '5') closed++;
            else open++;
        }

        return true;
    });

    return { total, open, closed };
}
function getProductTicketCount(projectId, productId){

    if (!projectId || !productId) return 0;

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_projectname','anyof',[projectId]],
            'AND',
            ['custrecord_rw_ticket_rwsuiteapp','anyof',[productId]] // ✅ FIX
        ],
        columns: ['internalid']
    });

    return ticketSearch.runPaged().count;
}
var totalOpenTickets=getOpenTicketCount();
function getClosedTicketCount(){
    var ticketSearch=search.create({
        type:'customrecord_rw_ticket',
        filters:[
            ['custrecord_rw_ticket_ticketstatus','anyof','5']
        ]
    })
    var count=ticketSearch.runPaged().count;
    log.debug("Total open tickets",count);
    return count;
}
var totalClosedTickets=getClosedTicketCount();
    
 function buildTicketMap(){

    var ticketMap = {};

    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        columns: [
            'custrecord_rw_ticket_projectname',
            'custrecord_rw_ticket_rwsuiteapp'
        ]
    });

    ticketSearch.run().each(function(result){

        var customerId = result.getValue('custrecord_rw_ticket_projectname');
        var productName = result.getText('custrecord_rw_ticket_rwsuiteapp');

        productName = productName ? productName.trim().toLowerCase() : '';

        if(!ticketMap[customerId]){
            ticketMap[customerId] = {};
        }

        if(!ticketMap[customerId][productName]){
            ticketMap[customerId][productName] = 0;
        }

        ticketMap[customerId][productName]++;

        return true;
    });

    return ticketMap;
}
function getEmployeeRole(empId){
    if(!empId) return '';

    var empSearch = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['role']
    });

    if (empSearch.role && empSearch.role.length > 0) {
        return empSearch.role[0].text || '';
    }

    return '';
}


function getRoleType(roleName){
    if (!roleName) return 'OTHER';

    roleName = roleName.toLowerCase().trim();

    if(roleName.includes('pmo')) return 'PMO';

    if(roleName.includes('project manager') || roleName.includes('pm')){
        return 'PM';
    }

    if(roleName.includes('developer') || roleName.includes('dev')){
        return 'DEV';
    }

    return 'OTHER';
}
var empRole = getEmployeeRole(empId);
// var roleType = getRoleType(empRole);


var ticketMap = buildTicketMap();
function getEmployeeInternalId(email){

    var empSearch = search.create({
        type: search.Type.EMPLOYEE,
        filters: email ? [['email','is', email]] : [],
        columns: ['internalid']
    });

    var res = empSearch.run().getRange({ start: 0, end: 1 });

    return res.length > 0 ? res[0].getValue('internalid') : null;
}

function getEmployeeDMSRole(empId){

    if(!empId) return '';

    var emp = search.lookupFields({
        type: search.Type.EMPLOYEE,
        id: empId,
        columns: ['custentityrw_dms_role']
    });

    if(emp.custentityrw_dms_role && emp.custentityrw_dms_role.length > 0){
        return emp.custentityrw_dms_role[0].text;
    }

    return '';
}

function getRoleTypeFromDMS(roleName){

    if(!roleName) return 'OTHER';

    roleName = roleName.toLowerCase().trim();

    if(roleName.includes('pmo')) return 'PMO';
    if(roleName.includes('pm') || roleName.includes('pm')) return 'PM';
    if(roleName.includes('developer') || roleName.includes('dev')) return 'DEV';

    return 'OTHER';
}

// 🔥 FINAL GLOBAL ROLE
var empInternalId = getEmployeeInternalId(email);
var dmsRole = getEmployeeDMSRole(empInternalId);
var roleType = getRoleTypeFromDMS(dmsRole);

log.debug("FINAL ROLE TYPE (GLOBAL)", roleType);
paginatedProjectIds.forEach(function(projectId){

    var data = projectMap[projectId];

    if(!data) return;
var ticketData = getTicketCounts(data.customerId);

var ticketCols = '';
function getEmployeeInternalId(email){

    var empSearch = search.create({
        type: search.Type.EMPLOYEE,
       
            filters: email ? [['email','is', email]] : []
            
        ,
        columns: ['internalid']
    });

    var res = empSearch.run().getRange({ start: 0, end: 1 });

    if(res.length > 0){
        return res[0].getValue('internalid');
    }

    return null;
}

function calculateDuration(stdate, eddate){

    if(!stdate || !eddate) return '';

    var startDate = new Date(stdate);
    var endDate = new Date(eddate);

    if(isNaN(startDate) || isNaN(endDate)) return '';

    var diffTime = endDate - startDate;

    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + " days";
}

log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);
if(roleType !== 'PMO' && !isFromHome){   // ✅ correct condition
    ticketCols = `
        <td style="border:1px solid black;">${ticketData.total}</td>
        <td style="border:1px solid black;">${ticketData.open}</td>
        <td style="border:1px solid black;">${ticketData.closed}</td>
    `;
}
    //var products = data.products.join(", ");
var productList = `
<table style="width:100%; border-collapse:collapse; margin-top:10px;">

    <tr style="background:#eee;">
        <th style="border:1px solid black;">Project Status</th>
        <th style="border:1px solid black;">Product</th>
        <th style="border:1px solid black;">Product Status</th>
        <th style="border:1px solid black;">Comments</th>
        <th style="border:1px solid black;">Start Date</th>
        <th style="border:1px solid black;">End Date</th>
        <th style="border:1px solid black;">Updated End Date</th>
        <th style="border:1px solid black;">Duration</th>
    </tr>

    ${Object.entries(data.products).map(([name, obj]) => {

        return `
        <tr>
            <td style="border:1px solid black;">${data.status || ''}</td>
            <td style="border:1px solid black;">${name}</td>
            <td style="border:1px solid black;">${obj.status || ''}</td>
            <td style="border:1px solid black;">${obj.comments || ''}</td>
            <td style="border:1px solid black;">${obj.startDate || ''}</td>
            <td style="border:1px solid black;">${obj.endDate || ''}</td>
            <td style="border:1px solid black;">${obj.updatedEndDate || ''}</td>
            <td style="border:1px solid black;">
${obj.duration ? obj.duration + ' days' : ''}
</td>
        </tr>
        `;
    }).join("")}

</table>
`;
    tableRows += `
<tr class="project-row" >

    <td style="border:1px solid black">
        
        <span class="arrow" id="arrow-${projectId}" onclick="toggleProducts('${projectId}')">▶</span>
        ${projectId}
    </td>

    <td style="border:1px solid black;" onclick="openProject('${projectId}')"><u>${data.customer}</u></td>
    ${!isFromHome ? `<td style="border:1px solid black;">${data.status}</td>` : ``}
   
   <td style="border:1px solid black;">${data.startDate}</td>
<td style="border:1px solid black;">${data.endDate}</td>
<td style="border:1px solid black;">${data.updatedEndDate}</td>

<td style="border:1px solid black;">${data.pm}</td>
<td style="border:1px solid black;">${data.pmocomments}</td>
<td style="border:1px solid black;">${data.duration + ' days'}</td>

<td style="border:1px solid black;">${Object.keys(data.products).length}</td>
    ${ticketCols}
</tr>

<tr id="products-${projectId}" style="display:none; background:#f9f9f9;border:1px solid black;">
    <td colspan="100" style="padding:0;">
        <div style="padding:10px;">
            ${productList}
        </div>
    </td>
</tr>
`;
});
    
// log.debug("Customer", customer);
// log.debug("PM", projectId);
// log.debug("Status", status);
// log.debug(rwProduct)
// log.debug("Parent Data FULL", JSON.stringify(parentData));
// log.debug("parent id is ",parentId);
    




var htmlField = form.addField({
    id:'custpage_html',
    type:serverWidget.FieldType.INLINEHTML,
    label:'HTML'
});
// var totalCount = projectSearch.runPaged().count;
// var totalPages = Math.ceil(totalCount / pageSize);
const projectUrl = url.resolveScript({
scriptId: 'customscript2877',
deploymentId: 'customdeploy1',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});

var nextPage = page + 1;
var prevPage = page - 1;
log.debug("current page is ",page)


var nextPage = page + 1;
var prevPage = page - 1;

if (page < 0) page = 0;
if (page >= totalPages) page = totalPages - 1;
var projectId = context.request.parameters.projectId;


var paginationHtml = `
<div style="text-align:center; margin-top:20px;">

    ${page > 0 ? `
        <button onclick="goToPage(${prevPage})" style="padding:8px 15px; background:#6f3ba2; color:white; border:none; border-radius:5px; cursor:pointer;">Previous</button>
    ` : ''}

    <span style="margin:0 15px; font-weight:bold;">
        Page ${page + 1} of ${totalPages}
    </span>

    ${page < totalPages - 1 ? `
        
        <button type="button" onclick="goToPage(${nextPage})" style="padding:8px 15px; background:#6f3ba2; color:white; border:none; border-radius:5px; cursor:pointer;">Next</button>
    ` : ''}

</div>
`;
var ticketHeaderCols = '';

if(roleType !== 'PMO' && !isFromHome){
    ticketHeaderCols = `
        <th style="border:1px solid black;">Total Tickets</th>
        <th style="border:1px solid black;">Open</th>
        <th style="border:1px solid black;">Closed</th>
    `;
}



var addButton = '';

if(roleType !== 'PM' && roleType !=='DEV'){
    addButton = `<button class="addBtn" type="button" onclick="listProjects()">+</button>`;
} else {
    
    addButton = `<div style="height:55px;width:35px;"></div>`;
}


htmlField.defaultValue = `

<style>
html, body{
margin:0 !important;
padding:0 !important;
width:100%;
height:100%;
overflow-y:auto;
}
.arrow{
    display:inline-block;
    cursor:pointer;
    transition: transform 0.3s ease;
    font-size:14px;
    margin-right:6px;
}
.product-row{
    display:none;
}
.table-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    position:relative;
    margin:10px 5px;
}

/* LEFT */
.header-left{
    flex:1;
}

/* CENTER TITLE */
.header-title{
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    font-weight:bold;
    font-size:18px;
}
.backBtn{
            margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            display:flex;
            align-item:left;
            cursor:pointer;
        }
/* RIGHT COUNT */
.header-right{
    flex:1;
    font-size:16px;
    text-align:right;
    font-weight:bold;
    color:#6f3ba2;
}
.product-card{
    background:#ffffff;
    margin:10px;
    padding:15px;
    border-radius:10px;
    box-shadow:0 5px 15px rgba(0,0,0,0.1);
    animation: fadeIn 0.3s ease;
}
    .product-container{
    display:flex;
    flex-direction:column;
    gap:10px;
}

.product-item{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 15px;
    background:#f9f9fb;
    border-radius:10px;
    box-shadow:0 2px 8px rgba(0,0,0,0.08);
    transition:0.2s;
}

.product-item:hover{
    transform:translateY(-2px);
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
}

.product-name{
    font-weight:600;
    color:#333;
}

.product-meta{
    display:flex;
    gap:10px;
    align-items:center;
}

.count{
    font-size:12px;
    color:#555;
}

/* STATUS BADGES */
.status{
    padding:5px 10px;
    border-radius:15px;
    font-size:11px;
    color:white;
}

/* dynamic colors */
.status.todo{ background:#999; }
.status.inprogress{ background:#f39c12; }
.status.uat{ background:#3498db; }
.status.codereview{ background:#9b59b6; }
.status.done{ background:#2ecc71; }
.arrow.rotate{
    transform: rotate(90deg);
}
/* remove netsuite borders */

#custpage_html_fs,
#custpage_html_fs_lbl,
#custpage_html_fs_val,
#custpage_html,
.uir-field-wrapper,
.uir-field,
.uir-page-body-content,
#main_form{
border:none !important;
box-shadow:none !important;
background:transparent !important;
padding:0 !important;
margin:0 !important;
}

#custpage_html_fs legend{
display:none !important;
}

/* layout */

body{
font-family:Arial;
margin:0;
}

.content{
padding:0px;
margin-top:-28px;


}

/* table */

table{
width:100%;
border-collapse:collapse;
}
.project-row:hover{
background:blue;
color:white;}
th{
background:#6f2da8;
color:white;
padding:10px;
border:0px solid #ccc;
}

td{
padding:10px;

text-align:center;
}
#loader {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background: rgba(255,255,255,0.7); /* light overlay */
  z-index: 9999;     /* above everything */
  text-align: center;
  padding-top: 200px;

 
}
  .product-row{
    display:none;
    animation: slideDown 0.3s ease;
}
table{

    overflow:hidden;
}

th{
    background:#6f3ba2;
    color:white;
    font-size:13px;
}

td{
    background:transparent;
}

.project-row{
    transition:0.2s;
}

.project-row:hover{
    background:#E6E6FA;
color:black;
    font-weight:bold;
}
@keyframes slideDown{
    from{
        opacity:0;
        transform:translateY(-10px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
.spinner {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);


  border: 6px solid #f3f3f3;
  border-top: 6px solid #6b3fa0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
//   margin: auto;
}

@keyframes spin {
  0% { transform: translate(-50%,-50%) rotate(0deg); }
  100% { transform: translate(-50%,-50%) rotate(360deg); }
}
 
/* plus button */

.addBtn{
font-size:35px;
cursor:pointer;
color:#3c5c8a;
margin-bottom:10px;
background:none;
border:none;
display:flex;
align-item:left;
padding:0;
}
.addBtn:hover{
color:#6f3ba2;
text-shadow:0 0 5px #6f3ba2;
text-decoration: none;

}
.project-row {
    cursor: pointer;
}


</style>
<form method="GET">
<input type="hidden" id="pageInput" name="page" value="${page}">

<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${email}">
<input type="hidden" name="from" value="${from}">
<div class="content">

<iframe id="mainFrame"
        style="
        width:100%;
        height:100%;
        border:none;
        display:none;
        position:absolute;
        top:0;
        left:0;
        background:white;
        overflow-y:hidden;
        
        "
        onload="hideLoader()">
</iframe>
<div id="homeContent">


<div class="table-header">
    
    <div class="header-left">
        ${addButton}
    </div>

    <div class="header-title">
       ${dynamicTitle}
    </div>

    <div class="header-right">
        Total: ${totalCount}
    </div>

</div>
<table>

<tr>
<th style="border:1px solid black;">Project ID</th>
<th style="border:1px solid black;">Customer</th>
${!isFromHome ? `<th style="border:1px solid black;">Status</th>` : ``}
<th style="border:1px solid black;">Start Date</th>
<th style="border:1px solid black;">End Date</th>
<th style="border:1px solid black;">Updated End Date</th>

<th style="border:1px solid black;">PM</th>
<th style="border:1px solid black;">PMO Comments</th>

<th style="border:1px solid black;">Duration</th>
<th style="border:1px solid black;">Total Products</th>
${ticketHeaderCols}
</tr>



${tableRows}

</table>
<button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
${paginationHtml}
</div>
</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Opening........</p>
</div>
</form>
<script>
document.title="Projects"
var projectUrl = '${projectUrl}';
var viewProjectUrl='${viewProjectUrl}';
// function listProjects(){
// /*alert("list of projects");*/
// document.getElementById("homeContent").style.display = "none";

// document.getElementById("mainFrame").style.display = "block";

// document.getElementById("mainFrame").src = projectUrl;

// }
function toggleProducts(projectId){

    var row = document.getElementById("products-" + projectId);
    var arrow = document.getElementById("arrow-" + projectId);

    var isOpen = row.style.display === "table-row";

    //  First close all
    document.querySelectorAll("[id^='products-']").forEach(r => {
        r.style.display = "none";
    });

    document.querySelectorAll(".arrow").forEach(a => {
        a.classList.remove("rotate");
    });

    //  If already open → just close (DO NOTHING MORE)
    if(isOpen){
        return;
    }

    // Else open selected
    row.style.display = "table-row";
    arrow.classList.add("rotate");
}
    
function listProjects(){
    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";   // spinner
    document.getElementById("homeContent").style.display = "none";
    frame.style.display = "block";    // overlay iframe
    frame.src = projectUrl;
}
// function hideLoader(){
//     document.getElementById("loader").style.display = "none";
//      document.getElementById("mainFrame").style.display = "block";
// }
function hideLoader(){
    var loader = document.getElementById("loader");
    loader.style.display = "none";
}
  function openProject(projectId){
    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";

    // 🔥 hide table content
    document.getElementById("homeContent").style.display = "none";

    // show iframe
    frame.style.display = "block";

    var urlWithParam = viewProjectUrl + '&projectId=' + projectId;
    frame.src = urlWithParam;
}
function goToPage(page){
    var loader = document.getElementById("loader");
    loader.style.display = "block";

    document.getElementById("pageInput").value = page;

    document.forms[0].submit();
}
    window.addEventListener('storage', function(event) {

    if (event.key === 'logout-event') {

        // Clear everything again (safety)
        localStorage.clear();

        // Redirect to login
        window.location.replace('${loginUrl}');
    }

});
var homeUrl = '${homeUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = homeUrl;
    }, 300); // small delay for smooth UX
}
</script>
`;

context.response.writePage(form);

};

return { onRequest };

});