/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record','N/runtime'], (serverWidget,url,search,record,runtime) => {

const onRequest = (context) => {
 if ((context.request.parameters.action || '').trim() === 'getProducts') {

    try {

        var customerId = context.request.parameters.customerId;

    if (!customerId) {
        context.response.write(JSON.stringify([]));
        return;
    }

    var productList = [];
    var uniqueProducts = {};
log.debug("CUSTOMER ID", customerId);

var testSearch = search.create({
    type: 'customrecord_rw_support_',
    columns: [
        'internalid',
        'custrecord_rw_project_summary',
        'custrecord_rw_support_product'
    ]
});

testSearch.run().each(function(r){

    log.debug("SUPPORT RECORD", {
        id: r.getValue('internalid'),
        customer: r.getValue('custrecord_rw_project_summary'),
        product: r.getText('custrecord_rw_support_product')
    });

    return true;
});
    var mappingSearch = search.create({
    type: 'customrecord_rw_crm_support_hierarhy_map',
    filters: [
        ['isinactive', 'is', 'F'],
        'AND',
        ['custrecord_rw_crm_support_hier_parent', 'anyof', customerId]
    ],
    columns: [
        'custrecord_rw_support_producr'
    ]
});
    log.debug("PRODUCT LIST", productList);
mappingSearch.run().each(function(result) {

    var productId =
        result.getValue('custrecord_rw_support_producr');

    var productName =
        result.getText('custrecord_rw_support_producr');

    log.debug("PRODUCT ID", productId);
    log.debug("PRODUCT NAME", productName);

    if (productId && !uniqueProducts[productId]) {

        uniqueProducts[productId] = true;

        productList.push({
            id: productId,
            name: productName
        });
    }

    return true;
});

        //  ADD THIS (CRITICAL)
        context.response.setHeader({
            name: 'Content-Type',
            value: 'application/json'
        });

        context.response.write(JSON.stringify(productList));

    } catch (e) {

        log.error("GET PRODUCTS ERROR", e);

        context.response.setHeader({
            name: 'Content-Type',
            value: 'application/json'
        });

        context.response.write(JSON.stringify([])); // safe fallback
    }

    return;
}
var form = serverWidget.createForm({ title:' ' });
var request = context.request;
var clientName = request.parameters.clientName;
var rwProduct = request.parameters.rwProduct;
var status = request.parameters.status;
var requesterName = request.parameters.requesterName;
var fromDate = request.parameters.fromdate;
var toDate = request.parameters.todate;
var pageParam = request.parameters.page;
var empId = context.request.parameters.empid;
var dynamicTitle = context.request.parameters.title || 'Tickets';
var email = context.request.parameters.email;
var pageIndex = 0;   // default
var fromProject =
    request.parameters.fromproject || '';
if (request.parameters.page) {
    pageIndex = parseInt(request.parameters.page, 10);
}

if (isNaN(pageIndex) || pageIndex < 0) {
    pageIndex = 0;
}

function getStatusClass(status){

    status = (status || '')
        .toLowerCase()
        .replace(/\s/g,'');

    if(status.includes('todo')){
        return 'todo';
    }

    if(status.includes('progress')){
        return 'inprogress';
    }

    if(status.includes('review')){
        return 'codereview';
    }

    if(status.includes('uat')){
        return 'uat';
    }

    if(status.includes('done') ||
       status.includes('closed')){
        return 'done';
    }

    return 'todo';
}
var filterType = context.request.parameters.filter;
var mode = request.parameters.mode;

var pageSize = 5;
var baseUrl = url.resolveScript({
    scriptId: runtime.getCurrentScript().id,
    deploymentId: runtime.getCurrentScript().deploymentId,
    returnExternalUrl: true
});
var customerOptions = '<option value="">--SELECT--</option>';
var empOptions = '<option value="">--SELECT--</option>';

var uniqueEmployees = {};
var employeeData = [];

var empSearch = search.create({
    type: 'employee',
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'firstname',
        'lastname'
    ]
});

empSearch.run().each(function(result){

    var id = result.getValue('internalid');

    var firstname = result.getValue('firstname') || '';
    var lastname = result.getValue('lastname') || '';

    var fullName = (firstname + ' ' + lastname)
        .replace(/\s+/g,' ')
        .trim();

    // avoid duplicate names
    var uniqueKey = fullName.toLowerCase();

    if(uniqueEmployees[uniqueKey]){
        return true;
    }

    uniqueEmployees[uniqueKey] = true;

    employeeData.push({
        id: id,
        name: fullName
    });

    return true;
});

// sort alphabetically
employeeData.sort(function(a,b){
    return a.name.localeCompare(b.name);
});

// build dropdown
employeeData.forEach(function(emp){

    empOptions += `
        <option value="${emp.id}"
            ${request.parameters.requesterName == emp.id ? 'selected' : ''}>
            ${emp.name}
        </option>
    `;
});
// var customerSearch = search.create({
//     type: search.Type.CUSTOMER,
//     filters: [
//         ['isinactive','is','F'],
//       'AND',
//     ['custentity_is_rw_customer','is','T']
//     ],
//     columns: ['internalid','altname']
// });
// customerSearch.run().each(function(result){
//     var id = result.getValue('internalid');
//     var name = result.getValue('altname');

//     customerOptions += `<option value="${id}" ${
//         request.parameters.clientName == id ? 'selected' : ''
//     }>${name}</option>`;
    
//      return true;
// });
var customerOptions = '<option value="">--SELECT--</option>';

var customerData = [];

var customerSearch = search.create({

    type: search.Type.CUSTOMER,

    filters: [
        ['isinactive','is','F'],
        'AND',
        ['custentity_is_rw_customer','is','T']
    ],

    columns: [
        'internalid',
        'altname'
    ]
});

customerSearch.run().each(function(result){

    customerData.push({

        id:
            result.getValue('internalid'),

        name:
            result.getValue('altname') || ''
    });

    return true;
});

// SORT ALPHABETICALLY
customerData.sort(function(a,b){

    return a.name.localeCompare(b.name);
});

// BUILD DROPDOWN
customerData.forEach(function(customer){

    customerOptions += `

        <option value="${customer.id}"

            ${
                request.parameters.clientName ==
                customer.id

                ? 'selected'
                : ''
            }>

            ${customer.name}

        </option>
    `;
});
var productOptions = '<option value="">--SELECT--</option>';
if (clientName) {

    var mappingSearch = search.create({
        type: 'customrecord_rw_crm_support_hierarhy_map',
        filters: [
            ['isinactive', 'is', 'F'],
            'AND',
            ['custrecord_rw_crm_support_hier_parent', 'anyof', clientName]
        ],
        columns: [
            'custrecord_rw_support_producr'
        ]
    });

    var unique = {};

    mappingSearch.run().each(function(result){

        var id = result.getValue('custrecord_rw_support_producr');
        var name = result.getText('custrecord_rw_support_producr');

        if (!unique[id]) {

            unique[id] = true;

            productOptions +=
                '<option value="' + id + '"' +
                (rwProduct == id ? ' selected' : '') +
                '>' + name + '</option>';
        }

        return true;
    });
}
// var productSearch = search.create({
//     type: 'customrecord_rw_support_', 
//     columns:['internalid','custrecord_rw_support_product','name']
// });

// productSearch.run().each(function(result){

//     var id = result.getValue('internalid');
//     var name = result.getValue('custrecord_rw_support_product');

//     productOptions += `<option value="${id}" ${
//         request.parameters.rwProduct == id ? 'selected' : ''
//     }>${name}</option>`;

//     return true;
// });

   
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
returnExternalUrl: true
});
var viewTicketUrl = url.resolveScript({
    scriptId: 'customscript2895',  
    deploymentId: 'customdeploy1',
    returnExternalUrl: true
});
var pageIndex = parseInt(request.parameters.page) || 0;
if (!pageParam) pageIndex = 0;
if (pageIndex < 0) pageIndex = 0;
//var pagedData = projectSearch.runPaged({ pageSize: 1000 });
var tableRows = '';
var projectCounts = {};
var projectMap = {};
var start = pageIndex * pageSize;
var end = start + pageSize;

// var searchResult = projectSearch.run();  // RUN ONLY ONCE

var results = [];
    
var filters = [];
function formatDate(dateStr){
    if (!dateStr) return null;

    var parts = dateStr.split('-'); // YYYY-MM-DD
    return parts[1] + '/' + parts[2] + '/' + parts[0]; // MM/DD/YYYY
}
fromDate = formatDate(fromDate);
toDate = formatDate(toDate);
// Ticket ID


const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

});

var projectId = request.parameters.projectId || '';
var productId = request.parameters.productId || '';
var ticketFilter = request.parameters.ticketFilter || '';

var filters = [];

if(projectId){

    filters.push([
        'custrecord_rw_ticket_projectname',
        'anyof',
        projectId
    ]);
}

if(productId){

    if(filters.length > 0){
        filters.push('AND');
    }

    filters.push([
        'custrecord_rw_ticket_rwsuiteapp',
        'anyof',
        productId
    ]);
}

if(ticketFilter === 'open'){

    if(filters.length > 0){
        filters.push('AND');
    }

    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'noneof',
        '5'
    ]);
}

else if(ticketFilter === 'closed'){

    if(filters.length > 0){
        filters.push('AND');
    }

    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'anyof',
        '5'
    ]);
}
/* total = no status filter */
// Ticket ID


// Client
if (clientName && clientName !== '') {
    if (filters.length > 0) filters.push('AND');
    filters.push([
        'custrecord_rw_ticket_projectname',
        'anyof',
        clientName
    ]);
}

// Product
if (rwProduct && rwProduct !== '') {
    if (filters.length > 0) filters.push('AND');
    filters.push([
        'custrecord_rw_ticket_rwsuiteapp',
        'anyof',
        rwProduct
    ]);
}

// Status
if (status && status !== '') {
    if (filters.length > 0) filters.push('AND');
    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'anyof',
        status
    ]);
}

// Requester Name
if (requesterName && requesterName !== '') {
    if (filters.length > 0) filters.push('AND');
    filters.push([
        'custrecord_rw_ticket_name',
        'anyof',
        requesterName
    ]);
}

// Assigned tickets
if (filterType === 'assigned' && empId) {

    if (filters.length > 0) filters.push('AND');

    filters.push([
        'custrecord_rw_ticket_assignedto',
        'anyof',
        empId
    ]);
}
//  OPEN TICKETS FILTER
//  MY OPEN TICKETS (IMPORTANT)
if (filterType === 'open' && empId) {

    if (filters.length > 0) filters.push('AND');

    // Assigned to logged-in user
    filters.push([
        'custrecord_rw_ticket_assignedto',
        'anyof',
        empId
    ]);

    filters.push('AND');

    // Exclude Done (closed)
    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'noneof',
        '5'   // Done
    ]);
}
if (filterType === 'allopen') {

    if (filters.length > 0) filters.push('AND');


    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'noneof',
        '5'   // Done
    ]);
}
// Total tickets → no filter (show all)
//  CLOSED TICKETS (FIX)
if (filterType === 'closed' && empId) {

    if (filters.length > 0) filters.push('AND');

    filters.push([
        'custrecord_rw_ticket_assignedto',
        'anyof',
        empId
    ]);

    filters.push('AND');

    filters.push([
        'custrecord_rw_ticket_ticketstatus',
        'anyof',
        '5'   // Done = Closed
    ]);
}
var projectSearch = search.create({
    type: 'customrecord_rw_ticket',
    filters: filters,
    columns: [
        search.createColumn({
            name: 'internalid',
            sort: search.Sort.DESC
        }),
        'custrecord_rw_ticket_requesttype',
        'custrecord_rw_ticket_name',
        'custrecord_rw_ticket_assignedto',
        'custrecord_rw_ticket_date',
        'custrecord_rw_ticket_ticketno',
        'custrecord_rw_ticket_projectname',
        'custrecord_rw_ticket_rwsuiteapp',
        'custrecord_rw_ticket_ticketstatus',
        'custrecord_rw_ticket_deadline',
        
    ]
});
var pagedData = projectSearch.runPaged({ pageSize: 10 });

var pageIndex = parseInt(request.parameters.page) || 0;

var currentPage = { data: [] };
var totalCount = pagedData.count;
//  SAFE PAGINATION
if (pagedData.pageRanges && pagedData.pageRanges.length > 0) {

    if (pageIndex < 0) pageIndex = 0;

    if (pageIndex >= pagedData.pageRanges.length) {
        pageIndex = pagedData.pageRanges.length - 1;
    }

    try {
        currentPage = pagedData.fetch({ index: pageIndex });
    } catch (e) {
        log.error("FETCH ERROR", e);
        currentPage = { data: [] };
    }
}
// projectSearch.run().each(function(result){

//     var id = result.getValue('internalid');
//     var requestType=result.getText('custrecord_rw_ticket_requesttype')
//     var name = result.getText('custrecord_rw_ticket_name');
//     var date=result.getText('custrecord_rw_ticket_date');
//     var status = result.getText('custrecord_rw_ticket_ticketstatus');
//     var ticketNo = result.getText('custrecord_rw_ticket_ticketno');
//     var projectName=result.getText('custrecord_rw_ticket_projectname');
//     var rwApp=result.getText('custrecord_rw_ticket_rwsuiteapp');
//     var deadline =result.getText('custrecord_rw_ticket_deadline');
//     var issueDetails=result.getValue('custrecord_rw_ticket_issuedetails')

//     log.debug("Project", id + " " + requestType + " " + status);

//     return true;
// });



var tableRows = '';

var data = (currentPage && currentPage.data) ? currentPage.data : [];

if (!data || data.length === 0) {

    tableRows = `
        <tr>
            <td colspan="8" style="text-align:center;">
                No records found
            </td>
        </tr>
    `;

} else {

    for (var i = 0; i < data.length; i++) {

        var result = data[i];

        tableRows += `
            <tr class="ho" onclick="openTicket('${result.getValue('internalid')}')">
            <td style="" class="ticket-id">${result.getValue('custrecord_rw_ticket_ticketno') || ''}</td>
                <td style="">${result.getText('custrecord_rw_ticket_projectname') || ''}</td>
                <td style="">${result.getText('custrecord_rw_ticket_rwsuiteapp') || ''}</td>
                <td style="">${result.getText('custrecord_rw_ticket_requesttype') || ''}</td>
                <td style="">${result.getText('custrecord_rw_ticket_name') || ''}</td>
                <td style="">${result.getValue('custrecord_rw_ticket_date') || ''}</td>
                
                
                <td style="">${result.getValue('custrecord_rw_ticket_deadline') || ''}</td>
                <td style="">

<span class="status ${getStatusClass(
    result.getText('custrecord_rw_ticket_ticketstatus')
)}">

${result.getText('custrecord_rw_ticket_ticketstatus') || ''}

</span>

</td>
            </tr>
        `;
    }
}
var totalPages = pagedData.pageRanges.length || 1;
// var tableRows = '';

// currentPage.data.forEach(function(result){

//     tableRows += `
//         <tr  class="ho">
//             <td style="">${result.getText('custrecord_rw_ticket_requesttype') || ''}</td>
//             <td style="">${result.getValue('custrecord_rw_ticket_name') || ''}</td>
//             <td style="">${result.getValue('custrecord_rw_ticket_date') || ''}</td>
//             <td style="">${result.getValue('custrecord_rw_ticket_ticketno') || ''}</td>
//             <td style="">${result.getText('custrecord_rw_ticket_projectname') || ''}</td>
//             <td style="">${result.getText('custrecord_rw_ticket_rwsuiteapp')  || ''}</td>
//             <td style="">${result.getText('custrecord_rw_ticket_ticketstatus') || ''}</td>
//             <td style=""> ${result.getValue('custrecord_rw_ticket_deadline') || ''}</td>
//         </tr>
//     `;
// });

// var totalPages = pagedData.pageRanges.length | 1;

    
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
scriptId: 'customscript2889',
deploymentId: 'customdeploy6',
returnExternalUrl: true,
params: {
        empid: empId,
        email: email
    }
});

var nextPage = pageIndex + 1;
var prevPage = pageIndex - 1;
log.debug("current page is ",pageIndex)

var statOptions ='<option value="">--Select--</option>';

var statSearch1 = search.create({
    type: 'customlist_rw_ticket_ticketstatuslist',
    columns: ['internalid','name']
});

statSearch1.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

   




statOptions += '<option value="'+id+'">'+name+'</option>';

    

    return true;
});


if (pageIndex < 0) pageIndex = 0;
if (pageIndex >= totalPages) pageIndex = totalPages - 1;
var projectId = context.request.parameters.projectId;


var paginationHtml = `
<div style="text-align:center; margin-top:20px;">

    ${pageIndex > 0 ? `
        <button onclick="goToPage(${prevPage})" style="padding:8px 15px; background:linear-gradient(135deg, #8E2DE2, #C471ED); color:white; border:none; border-radius:5px; cursor:pointer;">Previous</button>
    ` : ''}

    <span style="margin:0 15px; font-weight:bold;">
        Page ${pageIndex + 1} of ${totalPages}
    </span>

    ${pageIndex < totalPages - 1 ? `
        
        <button type="button" onclick="goToPage(${nextPage})" style="padding:8px 15px; background:linear-gradient(135deg, #8E2DE2, #C471ED); color:white; border:none; border-radius:5px; cursor:pointer;">Next</button>
    ` : ''}

</div>
`;

var filterHtml = '';

if (!(mode === 'form' || request.parameters.hidefilters === 'true')){
    filterHtml = `
    <div class="filter-card-main">

    <div class="filter-header" onclick="toggleFilters()">

        <div class="filter-title">
            🔍 <span>Ticket Filters</span>
        </div>

        <span id="filterArrow">▼</span>

    </div>

    <div class="filter-body" id="filterBody">

    <div class="filter-grid">

        <div class="filter-group">
            <label>Client Name</label>
            <select name="clientName" id="projectName">
                ${customerOptions}
            </select>
        </div>

        <div class="filter-group">
            <label>RW Product</label>
            <select name="rwProduct" id="rwProduct">
                ${productOptions}
            </select>
        </div>

        <div class="filter-group">
            <label>Status</label>
            <select name="status" id="statusFilter">
                ${statOptions}
            </select>
        </div>

        <div class="filter-group">
            <label>Requester</label>
            <select name="requesterName" id="requesterFilter">
                ${empOptions}
            </select>
        </div>

        <div class="filter-group button-group">

            

            <button
                type="button"
                class="reset-btn"
                onclick="resetFilters()">
                Reset
            </button>

        </div>

    </div>



    </div>

</div>

    `;
}
htmlField.defaultValue = `

<style>
*{
    box-sizing:border-box;   /*  VERY IMPORTANT */
}
html, body{
    margin:0;
    padding:0;
    height:100%;
    
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
.ho:hover{
background:linear-gradient(
    #61348b,
    #002855
    
    
);
color:white;
cursor:pointer;
font-weight:bold;
}
.filter-card{
    flex-shrink: 0;   /* stays fixed */
}
 

.table-container::-webkit-scrollbar{
    display: none;
}
    .pagination{
    flex-shrink: 0;
    text-align: center;
    padding: 10px;
}
.main-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top:0;
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
      white-space: nowrap;      /* Prevents text from wrapping */
    overflow: hidden;         /* Hides overflow text */
    text-overflow: ellipsis;
}
    th{
   text-transform: uppercase;
   
   font-family:calibri;
     white-space: nowrap;      /* Prevents text from wrapping */
    overflow: hidden;         /* Hides overflow text */
    text-overflow: ellipsis;
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

/* RIGHT COUNT */
.header-right{
    flex:1;
    text-align:right;
    font-weight:bold;
    font-size:14px;
    color:#8f50df;
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


/* table */

table{
width:100%;
border-collapse:collapse;
}
.project-row:hover{
background:linear-gradient(
    #61348b,
    #002855
    
    
);
color:white;}
th{
background:#6f2da8;
color:white;
padding:10px;
font-size:16px;
border:0px solid #ccc;
}

td{
padding:10px;
font-size:14px;
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
    background:#E6E6FA;
    color:darkblue;
    font-size:13px;
    font-size:16px;
}

td{
    background:transparent;
}

.project-row{
    transition:0.2s;
}

.project-row:hover{
   background:linear-gradient(
    #61348b,
    #002855
    
    
);
    cursor:pointer;
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
color:#8f50df;
text-shadow:0 0 5px #8f50df;
text-decoration: none;

}
.project-row {
    cursor: pointer;
}

.filter-card{
    display:flex;
    gap:10px;
    align-items:flex-end;
    padding:8px 10px;
    margin:0;
    padding:8px;
    background:#ffffff;
    border-radius:12px;
    box-shadow:0 4px 12px rgba(0,0,0,0.1);
    flex-wrap:wrap;
}

.filter-group{
    display:flex;
    flex-direction:column;
    font-size:14px;
    border-radius:8px;

    gap:5px;
}

.filter-group label{
    font-size:14px;
    font-weight:600;
    color:#555;
}
.inp{
border-radius:8px;
padding:20px;
}
.filter-group input{
    padding:12px 14px;
    border:1px solid #ccc;
    border-radius:8px;
    height:30px;
    
    font-size:16px;
    outline:none;
    transition:0.2s;
}

.filter-group input:focus{
    border-color:#8f50df;
    box-shadow:0 0 5px rgba(111,59,162,0.3);
}

.filter-actions{
    display:flex;
    gap:10px;
}

.btn-primary{
   background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color:white;
    border:none;
    padding:8px 15px;
    border-radius:8px;
    cursor:pointer;
    transition:0.2s;
}

.btn-primary:hover{
    background:#5a2d8a;
}

.btn-clear{
    background:#eee;
    border:none;
    padding:8px 15px;
    border-radius:8px;
    cursor:pointer;
}

.btn-clear:hover{
    background:#ddd;
}
    /* Main layout */
.main-container{
    height:100%;
    display:flex;
    flex-direction:column;
}

/* Top filter stays fixed */
.filter-card{
    flex-shrink:0;
}

/* Content area */
.content{
    //flex:1;
     width:85%;
     min-width:95%;
     height:660px;
     margin-top:-20px;
     display:flex;
    position:absolute;
    flex-direction:column;
    overflow-y:hidden;
    overflow-x:hidden;
    
}

/* Table should scroll ONLY if needed */
.table-container{
    flex:1;
    overflow-y:auto;   /*  only this scrolls */
    /*  REMOVE height:100% */
}

/* Pagination fixed */
.pagination{
    flex-shrink:0;
}
.top-bar{
    flex-shrink:0;
}

    .backBtn{
            margin-top:20px;
            padding:10px 15px;
            background:
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
            color:white;
            border:none;
            border-radius:5px;
            display:flex;
            align-item:left;
            cursor:pointer;
        }
   
.table-header{
    display:flex;
    justify-content:space-between;  /* left + right */
    align-items:center;
    margin:10px 5px;
}

/* optional title */
.table-title{
    font-weight:bold;
    font-size:16px;
}


.table-count{
    font-weight:bold;
    font-size:14px;
    color:#8f50df;
}
    table tr:nth-child(even) td {
    background: #E6E6E6;
}

table tr:nth-child(odd) td {
    background: #ffffff;
}

table tr.ho:hover td {
    background:linear-gradient(
    #61348b,
    #002855
    
    
);
    color: #fff;
}
    .table-wrapper{
    width:100%;
    overflow:auto;
    background:#fff;
    border-radius:16px;
    border:1px solid #ececec;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.modern-table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    min-width:1200px;
}
    .modern-table tbody tr:nth-child(even) td{

    background:#fafafa;
    color:black;
}
    
    
    .ticket-id{

    color:#5b2d8e;

    font-weight:600;
}
    .filter-card-main{

    background:#fff;

    border:1px solid #e5e7eb;

    border-radius:16px;
    padding:10px;

    overflow:hidden;

    box-shadow:0 8px 25px rgba(0,0,0,.08);

    margin-bottom:10px;
}

.filter-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:10px 10px;

    cursor:pointer;

    

    font-size:14px;

    font-weight:600;

    color:#5B2D8E;
}

.filter-header:hover{

    background:#f4f0ff;
}

.filter-title{

    display:flex;

    align-items:center;

    gap:6px;
    font-size:20px;
}

#filterArrow{

    font-size:20px;

    transition:.3s;
}

.filter-body{

    display:none;

    padding:16px;

    border-top:1px solid #eee;
}

.filter-grid{

    display:grid;

    grid-template-columns:repeat(4, minmax(220px,1fr));

    gap:12px;

    align-items:end;
}

.filter-group{

    display:flex;

    flex-direction:column;
}

.filter-group label{

    margin-bottom:8px;

    font-size:13px;

    font-weight:600;
}

.filter-group select{

    height:30px;

    border-radius:10px;

    border:1px solid #ddd;

    padding:0 8px;
}

.filter-footer{

    margin-top:8px;

    text-align:right;
}

.apply-btn{

    background:linear-gradient(135deg,#6F2DA8,#8F50DF);

    color:white;

    border:none;

    border-radius:10px;

    padding:10px 20px;

    cursor:pointer;
}
    .dots-loader{
    display:flex;
    justify-content:center;
    gap:8px;
    padding:15px;
}

.dots-loader span{
    width:18px;
    height:18px;
    border-radius:50%;
    background:#6f3ba2;
    animation:bounce .6s infinite alternate;
}

.dots-loader span:nth-child(2){
    animation-delay:.2s;
}

.dots-loader span:nth-child(3){
    animation-delay:.4s;
}

@keyframes bounce{

    from{
        transform:translateY(0);
        opacity:.5;
    }

    to{
        transform:translateY(-10px);
        opacity:1;
    }
}
    .reset-btn{

    background:#f3f4f6;

    color:#374151;

    border:1px solid #d1d5db;

    border-radius:10px;

    padding:10px 20px;

    cursor:pointer;

    transition:.3s;
}

.reset-btn:hover{

    background:#e5e7eb;
}
    .filter-grid{

    display:flex;

    align-items:flex-end;

    gap:12px;

    flex-wrap:nowrap;

    width:100%;
}

.filter-group{

    display:flex;

    flex-direction:column;

    flex:1;

    min-width:180px;
}

.button-group{

    flex:none;

    display:flex;

    flex-direction:row;

    align-items:flex-end;

    gap:10px;

    min-width:auto;
}
    .apply-btn,
.reset-btn{

    height:38px;

    padding:0 18px;

    white-space:nowrap;
}

.apply-btn{

    background:linear-gradient(135deg,#6F2DA8,#8F50DF);

    color:#fff;

    border:none;

    border-radius:10px;
}

.reset-btn{

    background:#f3f4f6;

    color:#374151;

    border:1px solid #d1d5db;

    border-radius:10px;
}
    #opening{
    font-size:20px;
    }
</style>
<form method="GET">
<div class="main-container">





<input type="hidden" name="mode" value="${mode || ''}">

<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${email || ''}">
<input type="hidden" id="pageInput" name="page" value="${pageIndex}">
<input type="hidden" name="filter" value="${filterType || ''}">
<input type="hidden" name="title" value="${dynamicTitle}">

<div class="content">

<iframe id="mainFrame" scrolling="no"
        style="
        width:100%;
        height:100%;
        border:none;
        display:none;
        position:absolute;
        margin-top:20px;
        margin-left:14px;
        top:0;
        left:0;
        background-color:white;
        overflow-y:hidden;
        overflow-x:hidden;
        
        "
        onload="hideLoader()">
</iframe>
<div id="homeContent">
${filterHtml}


<div class="table-header">
    
    <div class="header-left">
        <div class="top-bar">
    <button class="addBtn" type="button" onclick="listProjects()" title="Create New Ticket">+</button>
</div>
    </div>

    <div class="header-title">
        ${dynamicTitle}
    </div>

    <div class="header-right">
        Total: ${totalCount}
    </div>

</div>
    
<div class="table-wrapper">

        <table class="modern-table">

<tr>
<th style="">Ticket ID</th>
<th style="">Client Name</th>
<th style="">RW Product</th>
<th style="">Request Type</th>
<th style="">Requester Name</th>
<th style="">Date</th>


<th style="">Deadline</th>
<th style="">Status</th>
</tr>



${tableRows}

</table>
</div>
    </div>

    <div class="pagination">
        ${paginationHtml}
    </div>
</div>
</div>

<div id="loader">
    
    <p id="opening">Opening........</p>
    <div class="dots-loader">
    <span></span>
    <span></span>
    <span></span>
    </div>
</div>
</form>
<script>
function resetFilters(){

    document.getElementById("projectName").value = "";
    document.getElementById("rwProduct").value = "";
    document.getElementById("statusFilter").value = "";
    document.getElementById("requesterFilter").value = "";

    document.getElementById("pageInput").value = 0;

    document.forms[0].submit();
}
function hideLoader(){

    var loader = document.getElementById("loader");

    if(loader){
        loader.style.display = "none";
    }
}
document.title="Tickets"
var projectUrl = '${projectUrl}';
var viewProjectUrl='${viewProjectUrl}';
var viewTicketUrl ='${viewTicketUrl}';
var ticketUrl = '${ticketUrl}';
// function listProjects(){
// /*alert("list of projects");*/
// document.getElementById("homeContent").style.display = "none";

// document.getElementById("mainFrame").style.display = "block";

// document.getElementById("mainFrame").src = projectUrl;

// }
function openTicket(ticketId){

    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";

    //  THIS LINE YOU MISSED
    document.getElementById("homeContent").style.display = "none";

    frame.style.display = "block";

    var urlWithParam = '${viewTicketUrl}' + '&ticketId=' + ticketId  +  '&empid=${empId}';

    frame.src = urlWithParam;
}
    var ticketUrl = '${ticketUrl}';
    function applyFilters(){

    var loader = document.getElementById("loader");

    loader.style.display = "block";

    document.getElementById("homeContent").style.display = "none";

    document.forms[0].submit();
}
document.getElementById('projectName').addEventListener('change', function () {

    var customerId = this.value;

    console.log("Selected Customer:", customerId);
    console.log("CHANGE EVENT FIRED");

    if (!customerId) {
        document.getElementById('rwProduct').innerHTML =
            '<option value="">Select Product</option>';
             
        return;
    }

    //  ALWAYS use clean Suitelet URL (script 2894)
    var apiUrl = ticketUrl +
        "&action=getProducts" +
        "&customerId=" + customerId;

    console.log("API URL:", apiUrl);

    fetch(apiUrl)
    .then(res => res.text())   // always read as text
    .then(text => {

        console.log("RAW RESPONSE:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Invalid JSON:", text);
            throw new Error("Not JSON");
        }

        var dropdown = document.getElementById('rwProduct');
        dropdown.innerHTML = '<option value="">Select Product</option>';

        data.forEach(function (prod) {

            const option = document.createElement("option");
            option.value = prod.id;
            option.textContent = prod.name;

            dropdown.appendChild(option);
        });

    })
    .catch(err => {
        console.error("FINAL ERROR:", err);

        document.getElementById('rwProduct').innerHTML =
            '<option value="">Error loading products</option>';
    });
    
});
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
    function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}
function listProjects(){
    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";   // spinner
    frame.style.display = "block";    // overlay iframe
     document.getElementById("homeContent").style.display = "none";
    frame.src = projectUrl + "&mode=form&hidefilters=true";
}
// function hideLoader(){
//     document.getElementById("loader").style.display = "none";
//      document.getElementById("mainFrame").style.display = "block";
// }
function hideLoader(){
    var loader = document.getElementById("loader");
    loader.style.display = "none";
}
    
    function clearFilters(){
    window.parent.location.href = projectUrl;
}
 function openProject(projectId){
    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";

    //  hide table content
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
function openHome(){
// setPageTitle("Home");
//document.getElementById("headerTitle").innerText = "Reachware Project Management Portal";
 //document.getElementById("projectContent").style.display = "none";

document.getElementById("loader").style.display = "none"; 
document.getElementById("homeContent").style.display = "block";
var frame = document.getElementById("mainFrame");
    frame.src = "";              // clear old page
    frame.style.display = "none";
    toggleChartVisibility();
    togglePieVisibility();
}
  history.pushState(null, null, location.href);

window.addEventListener('popstate', function () {

    // prevent browser back
    history.pushState(null, null, location.href);

    // redirect FULL WINDOW not iframe
    window.top.location.replace('${homeUrl}');

});  
var homeUrl = '${homeUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   //  show loader

    setTimeout(function(){
         window.parent.openHome();
        //window.parent.location.href = homeUrl;  // safer than function call
        loader.style.display = "none";  //  hide loader after returning
    }, 300); // small delay for smooth UX
}
    
    function applyFilters() {

    document.getElementById("loader").style.display = "block";
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("pageInput").value = 0;

    document.forms[0].submit();
}
    document.addEventListener("DOMContentLoaded", function () {

    // document.getElementById("projectName")
    //     .addEventListener("change", applyFilters);

    document.getElementById("rwProduct")
        .addEventListener("change", applyFilters);

    document.getElementById("statusFilter")
        .addEventListener("change", applyFilters);

    document.getElementById("requesterFilter")
        .addEventListener("change", applyFilters);

});
function toggleFilters(){

    var body = document.getElementById("filterBody");
    var arrow = document.getElementById("filterArrow");

    if(body.style.display === "block"){

        body.style.display = "none";
        arrow.innerHTML = "▼";

    }else{

        body.style.display = "block";
        arrow.innerHTML = "▲";
    }
}
</script>
`;

context.response.writePage(form);

};

return { onRequest };

});