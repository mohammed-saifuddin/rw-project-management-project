/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record','N/runtime'], (serverWidget,url,search,record,runtime) => {

const onRequest = (context) => {

var form = serverWidget.createForm({ title:' ' });

var request = context.request;
var from = request.parameters.from || '';
var fromDashboard =
    context.request.parameters.fromdashboard || '';
var isFromHome = (from === 'home');
  var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
         var dynamicTitle = context.request.parameters.title || 'Projects';
var pageParam = request.parameters.page;
var page = parseInt(pageParam, 6) || 0;
var filterType = context.request.parameters.filter;
log.debug("Filter Type", filterType);
if (isNaN(page) || page < 0) page = 0;
var pageSize = 6;
// total → no filter
// ---------------- FILTER VALUES ----------------

var customerFilter = request.parameters.customer || '';
var statusFilter   = request.parameters.projectstatus || '';
var customerOptions = '<option value="">All Customers</option>';

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
    ${customerFilter == customer.id ? 'selected' : ''}>
    ${customer.name}
</option>`;
});

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
const ticketUrl = url.resolveScript({
scriptId: 'customscript2894',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

});
var filters = [];

if(filterType === 'open'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'noneof',
        ['6','7','8']
    ]);
}
else if(filterType == 'done'){

    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        ['6','7','8']
    ]);

    filters.push('AND');

    filters.push([
        'isinactive',
        'is',
        'F'
    ]);
}
else if(filterType == 'close'){

    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        ['6','7','8']
    ]);

    filters.push('AND');

    filters.push([
        'custrecord1513.isinactive',
        'is',
        'F'
    ]);

    // ONLY LOGGED-IN PM PROJECTS
    if(empId){

        filters.push('AND');

        filters.push([
            'custrecord1513.custrecord_rw_portal_projectmanager',
            'anyof',
            empId
        ]);
    }
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
        '1'
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
        '5'
    ]);
}
else if(filterType === 'coc'){
    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        '6'
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
        '4'
    ]);
}
else if(filterType === 'myprojects' && empId){

    filters.push([
        [
            'custrecord1513.custrecord_rw_portal_projectmanager',
            'anyof',
            empId
        ],
        'OR',
        [
                    'custrecord1513.custrecord_rw_portal_technical','anyof',empId
                ],
                'OR',
                [
                    'custrecord1513.custrecord_rw_portal_functional_consulta','anyof',empId
                ],
        'OR',
                [
                    'custrecord1513.custrecord_rw_portal_accountmanager','anyof',empId
                ]
    ]);
}


// ---------------- APPLY FILTERS ----------------

// CUSTOMER FILTER
if(customerFilter){
    
    if(filters.length > 0){
        filters.push('AND');
    }

    filters.push([
        'custrecord1513.custrecord_rw_portal_customername',
        'anyof',
        customerFilter
    ]);
}

// PROJECT STATUS FILTER
if(statusFilter){

    if(filters.length > 0){
        filters.push('AND');
    }

    filters.push([
        'custrecord1513.custrecord_rw_portal_status',
        'anyof',
        statusFilter
    ]);
}
if(filters.length > 0){
    filters.push('AND');
}

filters.push([
    'isinactive',
    'is',
    'F'
]);


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
    name: 'custrecord_rw_portal_scheduledgolivedate',
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
'custrecord_rw_portal_funcconsultant',
'custrecord_rw_portal_techconsultant'

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
var lineStartDate = result.getValue('custrecord_rw_portal_startdateline') || 'NIL';
var lineEndDate = result.getValue('custrecord_rw_portal_enddateline') || 'NIL';
var lineUpdatedDate = result.getValue('custrecord_rw_portal_updateddeadline') || 'NIL';
var lineDuration =result.getValue('custrecord_rw_portal_durationline');
var functionalConsultant = result.getText({ name: 'custrecord_rw_portal_funcconsultant' }) || '';
var technicalConsultant = result.getText({ name: 'custrecord_rw_portal_techconsultant' }) || '';
log.debug(additionalComments)
    var status = result.getText('custrecord_rw_portal_projstat');
    log.debug(status) 
    if(!parentId) return;

 if (!projectMap[parentId]) {
    projectMap[parentId] = {
        customer: result.getText({ name: 'custrecord_rw_portal_customername', join: 'custrecord1513' }) || '',
        status: result.getText({ name: 'custrecord_rw_portal_status', join: 'custrecord1513' }) || '',
        customerId: result.getValue({ name: 'custrecord_rw_portal_customername', join: 'custrecord1513' }),
         golive:result.getValue({name:'custrecord_rw_portal_scheduledgolivedate',join:'custrecord1513'}),
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
    duration: lineDuration,
    functionalConsultant:functionalConsultant,
    technicalConsultant:technicalConsultant
        
    };
}



projectMap[parentId].products[product].count++;
});
var projectIds = Object.keys(projectMap);

//  IMPORTANT: sort before pagination
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
            ['custrecord_rw_ticket_rwsuiteapp','anyof',[productId]] 
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
function getStatusClass(status){

    status = (status || '')
        .toLowerCase()
        .replace(/\s/g,'');

    // TO DO
    if(status.includes('todo')){
        return 'todo';
    }

    // IN PROGRESS
    if(status.includes('inprogress')){
        return 'inprogress';
    }

    // UAT
    if(status.includes('uat')){
        return 'uat';
    }

    // KICK OFF
    if(status.includes('kickoff')){
        return 'kickoff';
    }

    // BUSINESS REQUIREMENT
    if(status.includes('businessrequirement')){
        return 'business';
    }

    // TRAINING
    if(status.includes('training')){
        return 'training';
    }

    // GO LIVE
    if(status.includes('golive')){
        return 'golive';
    }

    // COC
    if(status.includes('coc')){
        return 'coc';
    }

    // SUPPORT
    if(status.includes('support')){
        return 'support';
    }

    // CODE REVIEW
    if(status.includes('review')){
        return 'codereview';
    }

    // DONE / CLOSED
    if(
        status.includes('done') ||
        status.includes('closed') ||
        status.includes('completed')
    ){
        return 'done';
    }

    return 'todo';
}
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
function getProductTicketDetails(projectId, productId){

    var total = 0;
    var open = 0;
    var closed = 0;
if(!projectId || !productId){
        return { total:0, open:0, closed:0 };
    }
    var ticketSearch = search.create({
        type: 'customrecord_rw_ticket',
        filters: [
            ['custrecord_rw_ticket_projectname','anyof', projectId],
            'AND',
            ['custrecord_rw_ticket_rwsuiteapp','anyof', productId]
        ],
        columns: ['custrecord_rw_ticket_ticketstatus']
    });

    ticketSearch.run().each(function(result){

        total++;

        var status = result.getValue('custrecord_rw_ticket_ticketstatus');

        if(status == '5') closed++;
        else open++;

        return true;
    });

    return { total, open, closed };
}
log.debug("DMS ROLE", dmsRole);
log.debug("ROLE TYPE", roleType);

if(roleType === 'PM'){   
    ticketCols = `
        <td style="">${ticketData.total}</td>
        <td style="">${ticketData.open}</td>
        <td style="">${ticketData.closed}</td>
    `;
}
    //var products = data.products.join(", ");
var productList = `
<table  style="width:100%; border-collapse:collapse; margin-top:10px;border-radius:8px;background:#ccc;">

    <tr style="background:#eee;">
        <th style="font-family:Arial, sans-serif;font-size:10px;">Project Status</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">Product</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">Product Status</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">PMO Comments</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">Start Date</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">End Date</th>
       
        <th style="font-family:Arial, sans-serif;font-size:10px;">Updated End Date</th>
        <th style="font-family:Arial, sans-serif;font-size:10px;">Duration</th>
      
${roleType === 'PM' ? `
 <th style="font-family:Arial, sans-serif;font-size:10px;" class="ticket-total">Total Tickets</th>
<th style="font-family:Arial, sans-serif;font-size:10px;" class="ticket-open">Open</th>
<th style="font-family:Arial, sans-serif;font-size:10px;" class="ticket-close">Closed</th>
<th style="font-family:Arial, sans-serif;font-size:10px;">Functional Consultant</th>
<th style="font-family:Arial, sans-serif;font-size:10px;">Technical Consultant</th>
` : ``}
    </tr>

    ${Object.entries(data.products).map(([name, obj]) => {
  var ticketDetails = getProductTicketDetails(data.customerId, obj.productId)
        return `
        <tr>
            <td style="">

<span class="status ${getStatusClass(data.status)}">
    ${data.status}
</span>

</td>
            <td style=" font-family:Arial, sans-serif;">${name}</td>
            <td style=" font-family:Arial, sans-serif;">

<span class="status ${getStatusClass(obj.status)}">
    ${obj.status || ''}
</span>

</td>
            <td style=" font-family:Arial, sans-serif;">${obj.comments || ''}</td>
            <td style=" font-family:Arial, sans-serif;">${obj.startDate || ''}</td>
            <td style=" font-family:Arial, sans-serif;">${obj.endDate || ''}</td>
        
            <td style=" font-family:Arial, sans-serif;">${obj.updatedEndDate || ''}</td>
            <td style=" font-family:Arial, sans-serif;">
${obj.duration ? obj.duration + '' : ''}
</td>

        ${roleType === 'PM' ? `
<td 
style="cursor:pointer;color:blue;"
onclick="openTicketDetails('${data.customerId}','${obj.productId}','total')" class="ticket-total">

${ticketDetails.total}

</td>

<td 
style="cursor:pointer;color:green;"
onclick="openTicketDetails('${data.customerId}','${obj.productId}','open')" class="ticket-open">

${ticketDetails.open}

</td>

<td 
style="cursor:pointer;color:red;"
onclick="openTicketDetails('${data.customerId}','${obj.productId}','closed')" class="ticket-close">

${ticketDetails.closed}

</td>

        <td style="">${obj.functionalConsultant || ''}</td>
        <td style="">${obj.technicalConsultant || ''}</td>
` : ``}
        </tr>
        `;
    }).join("")}

</table>
`;
    tableRows += `
<tr class="project-row" >

    <td style="font-family:Arial, sans-serif;" title="project Id">
        
        <span class="arrow" id="arrow-${projectId}" onclick="toggleProducts('${projectId}')" >▶</span>
        ${projectId}
    </td>

    <td style="" onclick="openProject('${projectId}')" class="cust" title="customer"><u>${data.customer}</u></td>
    ${!isFromHome ? `<td style="font-family:Arial, sans-serif;">
        <span class="status ${getStatusClass(data.status)}">
    ${data.status}
</span>
</td>` : ``}
   
   <td style=" font-family:Arial, sans-serif;" title="start date">${data.startDate}</td>
<td style=" font-family:Arial, sans-serif;" title="end date">${data.endDate}</td>
<td style=" font-family:Arial, sans-serif;" >${data.duration + ' days'}</td>
<td style=" font-family:Arial, sans-serif;">${data.golive}</td>

<td style=" font-family:Arial, sans-serif;white-space:nowrap;">${data.pm}</td>
<td style=" font-family:Arial, sans-serif;">${data.pmocomments}</td>


<td style=" font-family:Arial, sans-serif;">${Object.keys(data.products).length}</td>
    ${ticketCols}
</tr>

<tr id="products-${projectId}" style="display:none; background:#f9f9f9; font-family:Arial, sans-serif;">
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
        <button type="button" onclick="goToPage(${prevPage})" style="padding:8px 15px;   background:linear-gradient(
        135deg,
        #5b2d8e 0%,
        #8f50df 100%
    ); color:white; border:none; border-radius:5px; cursor:pointer;">Previous</button>
    ` : ''}

    <span style="margin:0 15px; font-weight:bold;">
        Page ${page + 1} of ${totalPages}
    </span>

    ${page < totalPages - 1 ? `
        
        <button type="button" onclick="goToPage(${nextPage})" style="padding:8px 15px;   background:linear-gradient(
        135deg,
        #5b2d8e 0%,
        #8f50df 100%
    ); color:white; border:none; border-radius:5px; cursor:pointer;">Next</button>
    ` : ''}

</div>
`;
var ticketHeaderCols = '';

if(roleType === 'PM'){
    ticketHeaderCols = `
        <th style="">Total Tickets</th>
        <th style="">Open</th>
        <th style="">Closed</th>
    `;
}



var addButton = '';

if(roleType === 'PMO' || roleType === 'PM'){
    addButton = `<button class="addBtn" type="button" title="Create a new project" onclick="listProjects()">+</button>`;
} else {
    
    addButton = `<div style="height:55px;width:35px;"></div>`;
}

function getCustomerOptions(selectedValue){

    var options = '<option value="">All Customers</option>';

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

    customerSearch.run().each(function(res){

        var id = res.getValue('internalid');

        var name = res.getValue('altname');

        options += `
            <option value="${id}"
                ${selectedValue == id ? 'selected' : ''}>
                ${name}
            </option>
        `;

        return true;
    });

    return options;
}
var statOptions1 ='<option value="">All Status</option>';
var statSearch1 = search.create({
    type: 'customlist_rw_portal_statuslist_header',
    filters:[
        ['isinactive','is','F']
    ],
    columns: ['internalid','name']
});

statSearch1.run().each(function(result){

    var id = result.getValue('internalid');
    var name = result.getValue('name');

     var isSelected = (name === 'Not Started') ? 'selected' : '';
var isDisabled = (name !== 'Not Started') ? 'disabled' : '';

var selected = (statusFilter == id) ? 'selected' : '';

statOptions1 +=
    '<option value="' + id + '" ' + selected + '>' +
    name +
    '</option>';

    return true;
});

htmlField.defaultValue = `

<style>
html,
body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    overflow:hidden;
    
    /* Firefox */
    scrollbar-width:none;

    /* IE/Edge */
    -ms-overflow-style:none;
}

/* Chrome, Edge, Safari */
html::-webkit-scrollbar,
body::-webkit-scrollbar{
    width:0;
    height:0;
    display:none;
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
            background:linear-gradient(135deg, #8E2DE2, #C471ED);
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
    color:#8f50df;
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
   font-size:16px;
     white-space: nowrap;      /* Prevents text from wrapping */
    overflow: hidden;         /* Hides overflow text */
    text-overflow: ellipsis;
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
padding:20px;
margin-top:-28px;
overflow-y:hidden;

}

/* table */

table{
width:100%;
border-collapse:collapse;

}

th{
background:#6f2da8;
color:white;
padding:10px;
font-size:16px;
border:0px solid #ccc;
}

td{
padding:10px;
font-size:12px;
background:transparent;
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
    background:
linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);
    color:darkblue;
    font-size:16px;
}

td{
    background:transparent;
}

.project-row{
    transition:0.2s;
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


.status.todo{
    background:#7f8c8d;
}

.status.inprogress{
    background:#f39c12;
}

.status.uat{
    background:#3498db;
}

.status.codereview{
    background:#8e44ad;
}

.status.done{
    background:#27ae60;
}

.status.kickoff{
    background:#e67e22;
}

.status.business{
    background:#16a085;
}

.status.training{
    background:#d35400;
}

.status.golive{
    background:#2ecc71;
}

.status.coc{
    background:#c0392b;
}

.status.support{
    background:#34495e;
}
    /* ================= FILTER CARD ================= */

.filter-card{

    display:flex;
    align-items:flex-end;
    gap:18px;

    padding:10px 14px;
    margin:12px 5px 18px 5px;

   

    border-radius:14px;

    border:1px solid #ece6ff;

    box-shadow:
        0 4px 15px rgba(111,45,168,0.08);

    flex-wrap:wrap;
}

/* ================= GROUP ================= */

.filter-group{

    display:flex;
    flex-direction:column;
    gap:6px;
}

/* ================= LABEL ================= */

.filter-group label{

    font-size:12px;
    font-weight:600;

    color:#5b2d8e;

    padding-left:2px;
}

/* ================= SELECT ================= */

.filter-group select{

    min-width:220px;

    height:40px;

    padding:0 12px;

    border-radius:10px;

    border:1px solid #d7c8f5;

    background:white;

    font-size:13px;

    color:#333;

    outline:none;

    transition:all 0.25s ease;

    box-shadow:
        inset 0 1px 2px rgba(0,0,0,0.03);
}

/* ================= FOCUS ================= */

.filter-group select:focus{

    border-color:#8f50df;

    box-shadow:
        0 0 0 3px rgba(143,80,223,0.15);
}

/* ================= BUTTON AREA ================= */

.filter-actions{

    display:flex;
    align-items:flex-end;
}

/* ================= APPLY BUTTON ================= */

.btn-primary{

    height:40px;

    padding:0 22px;

    border:none;

    border-radius:10px;

    cursor:pointer;

    color:white;

    font-size:13px;

    font-weight:600;

    letter-spacing:0.3px;

    background:linear-gradient(
        135deg,
        #5b2d8e 0%,
        #8f50df 100%
    );

    transition:all 0.25s ease;

    box-shadow:
        0 4px 10px rgba(111,45,168,0.25);
}

/* ================= BUTTON HOVER ================= */

.btn-primary:hover{

    transform:translateY(-1px);

    box-shadow:
        0 6px 16px rgba(111,45,168,0.35);
}

/* ================= MOBILE ================= */

@media(max-width:768px){

    .filter-card{

        align-items:stretch;
    }

    .filter-group{

        width:100%;
    }

    .filter-group select{

        width:100%;
        min-width:100%;
    }

    .filter-actions{

        width:100%;
    }

    .btn-primary{

        width:100%;
    }
}

   
    .cust:hover{
    cursor:pointer;
    }
    /* Table should scroll ONLY if needed */
.table-container{
    flex:1;
    overflow-y:auto;   /*  only this scrolls */
    /*  REMOVE height:100% */
}
    .table-wrapper{
    width:100%;
    overflow:hidden;
    border-radius:12px;
    background:#fff;
    
    box-shadow:0 8px 30px rgba(0,0,0,.08);
    border:1px solid #ececec;
}

.modern-table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    
    min-width:1300px;
}
    .modern-table thead th{

    position:sticky;
    top:0;

    background:#5b2d8e;
    color:#fff;

    font-size:13px;
    font-weight:600;

    text-transform:uppercase;
    letter-spacing:.5px;

    

    border:none;
    white-space:nowrap;

    z-index:10;
}
    .modern-table tbody td{

    

    border-bottom:1px solid #f0f0f0;

    color:#444;

    font-size:13px;

    background:#fff;
}
    .modern-table tbody tr{

    transition:.25s;
}

.modern-table tbody tr:hover{

     background:linear-gradient(
    #61348b,
    #002855
    
    
);

    transform:scale(1.002);
}
    .modern-table tbody tr:nth-child(even){

    background:#fafafa;
}
    .modern-table thead th:first-child{

    border-top-left-radius:18px;
}

.modern-table thead th:last-child{

    border-top-right-radius:18px;
}
    .status{

    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:6px 14px;

    border-radius:30px;

    font-size:11px;
    font-weight:600;

    min-width:90px;
}
    .status.todo{
    background:#f4f4f4;
    color:#555;
}

.status.inprogress{
    background:#fff4db;
    color:#c77c00;
}

.status.uat{
    background:#dcefff;
    color:#0b66c3;
}

.status.golive{
    background:#dff8e6;
    color:#0f8d4d;
}

.status.done{
    background:#dff7df;
    color:#2e7d32;
}

.status.coc{
    background:#ffe1e1;
    color:#c62828;
}
    
    .ticket-chip{

    display:inline-block;

    padding:5px 10px;

    border-radius:20px;

    font-size:11px;

    font-weight:600;
}

.ticket-total{

    background:#eef2ff;
    color:#5b2d8e;
}

.ticket-open{

    background:#fff4d6;
    color:#cc8800;
}

.ticket-close{

    background:#e7f9ed;
    color:#198754;
}
    .product-detail{

    background:#fafbff;

    border-left:4px solid #5b2d8e;

    padding:20px;

    animation:fadeIn .3s;
}
    .arrow{

    width:28px;
    height:28px;

    display:inline-flex;
    align-items:center;
    justify-content:center;

    border-radius:50%;

    background:#f4f4f4;

    transition:.3s;
}

.arrow:hover{

    background:#5b2d8e;
    color:white;
}
    .cust{

    color:#5b2d8e;
    text-decoration:none;
    font-weight:600;
}

.cust:hover{

    color:#8f50df;
    text-decoration:underline;
}
    .project-row{
    transition:all .3s ease;
}

.project-row:hover td{
    background:#5b2d8e;
    color:#fff;
    font-weight:600;
    transition:all .3s ease;
}
    .filter-card{


    border:1px solid #e6e6e6;
    border-radius:14px;
    box-shadow:0 4px 16px rgba(0,0,0,.08);
    overflow:hidden;
    margin-bottom:18px;
}

.filter-header{

    display:flex;
    justify-content:space-between;
    align-items:center;

    padding:14px 18px;

    cursor:pointer;

    background:#fafafa;

    font-weight:600;
    color:#5b2d8e;
}

.filter-title{

    display:flex;
    align-items:center;
    gap:10px;
}

.filter-content{

    display:none;

    padding:18px;

    border-top:1px solid #eee;

    display:none;

    gap:20px;

    flex-wrap:wrap;
}

.filter-group{

    min-width:240px;
}

.filter-group select{

    width:100%;
    height:42px;

    border:1px solid #ddd;
    border-radius:10px;

    padding:0 12px;

    font-size:14px;
}
    .filter-header{

    display:flex;
    justify-content:flex-end;
    padding:8px 0;
}

.filter-btn-modern{

    display:flex;
    align-items:center;
    gap:12px;

    background:#ffffff;

    border:1px solid #E4E7EC;

    border-radius:14px;

    padding:10px 18px;

    cursor:pointer;

    font-size:14px;
    font-weight:600;

    color:#344054;

    transition:.25s;

    box-shadow:
        0 4px 18px rgba(0,0,0,.06);
}

.filter-btn-modern:hover{

    transform:translateY(-2px);

    border-color:#6F2DA8;

    color:#6F2DA8;

    box-shadow:
        0 10px 28px rgba(111,45,168,.18);
}

.filter-btn-modern.active{

    background:linear-gradient(
        135deg,
        #6F2DA8,
        #8F50DF
    );

    color:white;

    border-color:transparent;
}

.filter-icon{

    display:flex;
    align-items:center;
    justify-content:center;

    width:34px;
    height:34px;

    border-radius:10px;

    background:#F5F3FF;
}

.filter-btn-modern.active .filter-icon{

    background:rgba(255,255,255,.18);
}

.filter-text{

    letter-spacing:.4px;
}

.filter-count{

    min-width:24px;
    height:24px;

    border-radius:50%;

    display:flex;
    align-items:center;
    justify-content:center;

    background:#EEF2FF;

    color:#6F2DA8;

    font-size:12px;

    font-weight:700;
}

.filter-btn-modern.active .filter-count{

    background:white;

    color:#6F2DA8;
}

.filter-arrow{

    font-size:18px;

    transition:.3s;
}

.filter-arrow.rotate{

    transform:rotate(180deg);
}
    .filter-container{

    margin-bottom:10px;
    margin-top:10px;
}

.filter-toggle-btn{

    display:flex;
    align-items:center;
    gap:12px;

    padding:8px 8px;

    border:none;

    border-radius:14px;

    cursor:pointer;

    background:linear-gradient(
        135deg,
        #5B2D8E,
        #8F50DF
    );

    color:white;

    font-size:14px;

    font-weight:600;

    transition:.3s;

    box-shadow:0 10px 25px rgba(111,45,168,.25);
}

.filter-toggle-btn:hover{

    transform:translateY(-2px);

    box-shadow:0 15px 35px rgba(111,45,168,.35);
}

#filterArrow{

    margin-left:auto;

    font-size:22px;

    transition:.3s;
}

.filter-card{

    display:none;

    margin-top:16px;

    padding:22px;

    background:white;

    border-radius:18px;

    box-shadow:0 15px 40px rgba(0,0,0,.08);

    border:1px solid #ececec;

    animation:slideDown .3s ease;

    display:none;

    gap:20px;

    flex-wrap:wrap;
}
.filter-card-main{

    background:white;

    border:1px solid #e5e7eb;

    border-radius:16px;

    overflow:hidden;

    box-shadow:0 8px 25px rgba(0,0,0,.08);

    margin-bottom:20px;
    margin-top:8px;
}

.filter-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:16px 20px;

    cursor:pointer;

    background:#fafafa;

    font-size:15px;

    font-weight:600;

    color:#5B2D8E;
}

.filter-header:hover{

    background:#f4f0ff;
}

.filter-title{

    display:flex;

    align-items:center;

    gap:10px;
    font-size:20px;
}

#filterArrow{

    font-size:20px;

    transition:.3s;
}

.filter-body{

    display:none;

    padding:22px;

    border-top:1px solid #eee;
}

.filter-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:20px;
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

    height:42px;

    border-radius:10px;

    border:1px solid #ddd;

    padding:0 12px;
}

.filter-footer{

    margin-top:20px;

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
@keyframes slideDown{

    from{

        opacity:0;

        transform:translateY(-15px);
    }

    to{

        opacity:1;

        transform:translateY(0);
    }
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
    #loading{
    font-size:20px;
    }
</style>
<form method="GET" id="filterForm">
<input type="hidden" id="pageInput" name="page" value="${page}">

<input type="hidden" name="empid" value="${empId}">
<input type="hidden" name="email" value="${email}">
<input type="hidden" name="from" value="${from}">
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
        
        top:0;
        left:0;
        background:white;
        overflow:hidden;
        /* Firefox */
    scrollbar-width:none;

    /* IE/Edge */
    -ms-overflow-style:none;
        
        "
        onload="hideLoader()">
</iframe>
<div id="homeContent">

<div class="filter-card-main">

    <div class="filter-header" onclick="toggleFilters()">

        <div class="filter-title">
            🔍 <span>Project Filters</span>
        </div>

        <span id="filterArrow">▼</span>

    </div>

    <div class="filter-body" id="filterBody">

        <div class="filter-grid">

            <div class="filter-group">
                <label>Customer</label>
                <select name="customer" id="customerFilter">
                    ${customerOptions}
                </select>
            </div>

            <div class="filter-group">
                <label>Project Status</label>
                <select
                    name="projectstatus"
                    id="statusFilter">

                    ${statOptions1}

                </select>
            </div>

        </div>

        

    </div>

</div>


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
<div class="table-wrapper">
<table class="modern-table">

<tr>
<th style="">Project ID</th>
<th style="">Customer</th>
${!isFromHome ? `<th style="">Status</th>` : ``}
<th style="">Start Date</th>
<th style="">End Date</th>
<th style="">Duration</th>
<th style="">Golive Date</th>

<th style="">PM</th>
<th style="">PMO Comments</th>


<th style="">Total Products</th>
${ticketHeaderCols}
</tr>



${tableRows || `
<tr>
    <td colspan="${roleType === 'PM' ? '13' : '10'}"
        style="
            text-align:center;
            padding:40px;
            font-size:18px;
            color:#777;
            font-weight:bold;
            background:#fff;
        ">
        No Records Found
    </td>
</tr>
`}

</table>
</div>


${paginationHtml}
</div>
</div>
<div id="loader">
     
    <p id="loading">Loading........</p>
    <div class="dots-loader">
        <span></span>
        <span></span>
        <span></span>
    </div>
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
    function applyFilters(){

    var loader = document.getElementById("loader");

    loader.style.display = "block";

    document.getElementById("homeContent").style.display = "none";

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
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = homeUrl;
    }, 300); // small delay for smooth UX
}
    function openTicketDetails(projectId, productId, type){

    var loader = document.getElementById("loader");
    var frame = document.getElementById("mainFrame");

    loader.style.display = "block";

    document.getElementById("homeContent").style.display = "none";

    frame.style.display = "block";

    var ticketUrl = '${ticketUrl}';

    ticketUrl += "&projectId=" + projectId;
ticketUrl += "&productId=" + productId;
ticketUrl += "&ticketFilter=" + type;
ticketUrl += "&fromproject=T";
    
    frame.src = ticketUrl;
}
function applyFilters() {

    document.getElementById("loader").style.display = "block";
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("pageInput").value = 0;

    document.forms[0].submit();   // <-- Use this
}
    document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("customerFilter")
        .addEventListener("change", applyFilters);

    document.getElementById("statusFilter")
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