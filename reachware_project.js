/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record','N/runtime'], (serverWidget,url,search,record,runtime) => {

const onRequest = (context) => {

var form = serverWidget.createForm({ title:' ' });
var request = context.request;
  var email = context.request.parameters.email || '';
    var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';
var pageParam = request.parameters.page;
var page = parseInt(pageParam, 10) || 0;

if (isNaN(page) || page < 0) page = 0;
var pageSize = 10;
var baseUrl = url.resolveScript({
    scriptId: runtime.getCurrentScript().id,
    deploymentId: runtime.getCurrentScript().deploymentId,
    returnExternalUrl: true
});

 var loginUrl = url.resolveScript({
scriptId: 'customscript2872',
deploymentId: 'customdeploy1',
returnExternalUrl: true,

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
var projectSearch = search.create({
    type: 'customrecord_rw_portal_access2',
     filters: [
        ['custrecord1513','noneof','@NONE@'] 
    ],
    columns: [
      
search.createColumn({
    name: 'internalid',
    sort: search.Sort.DESC 
}),
       
        'custrecord_rw_portal_rwproduct', 
        'custrecord_rw_portal_additionalcomments',
        'custrecord1513',
        'custrecord_rw_portal_projstat'

        
    
    ]
});

var tableRows = '';
var projectCounts = {};
var projectMap = {};
var start = page * pageSize;
var end = start + pageSize;

var searchResult = projectSearch.run();  // RUN ONLY ONCE

var results = [];
if (!pageParam) page = 0;
if (page < 0) page = 0;
var pagedData = projectSearch.runPaged({ pageSize: 1000 });

pagedData.pageRanges.forEach(function(pageRange){
    var page = pagedData.fetch({ index: pageRange.index });
    page.data.forEach(function(result){
        results.push(result);
    });
});


results.forEach(function(result){

    var parentId = result.getValue('custrecord1513');
    var product = result.getText('custrecord_rw_portal_rwproduct');
    var productId = result.getValue('custrecord_rw_portal_rwproduct');

    var status = result.getText('custrecord_rw_portal_projstat');
    log.debug(status) // ✅ ADD THIS
    if(!parentId) return;

    if(!projectMap[parentId]){
        var parentData = record.load({
            type: 'customrecord_rw_portal_access',
            id: parentId
        });

        projectMap[parentId] = {
            customer: parentData.getText('custrecord_rw_portal_customername') || '',
            status: parentData.getText('custrecord_rw_portal_status') || '',
            customerId: parentData.getValue('custrecord_rw_portal_customername'),
            products: {},
            
        };
    }

if(!projectMap[parentId].products[product]){
    projectMap[parentId].products[product] = {
        count: 0,
        status: status || 'NA',
        productId: productId
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

        // ✅ manual match (NO filter issues)
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
    // var parentId = result.getValue('custrecord1513');

    // var customer = '';
    // var projectId = '';
    // var status = '';
    // var total = 0;

    // if(parentId){
    //     var parentData = record.load({
    //         type: 'customrecord_rw_portal_access',
    //         id: parentId
    //     });

    //     customer = parentData.getValue('custrecord_rw_portal_customername') || '';
    //     projectId = parentData.id;
    //     status = parentData.getText('custrecord_rw_portal_status') || '';
    //     total = projectCounts[parentId] || 0;
    // }

    // var rwProduct = result.getText('custrecord_rw_portal_rwproduct');
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
var ticketMap = buildTicketMap();
paginatedProjectIds.forEach(function(projectId){

    var data = projectMap[projectId];

    if(!data) return;
var ticketData = getTicketCounts(data.customerId);
    //var products = data.products.join(", ");
var productList = `
<div class="product-container">
${Object.entries(data.products)
   .map(([name, obj]) => {

    var customerId = data.customerId;

var ticketCount = 0;

var cleanName = name.trim().toLowerCase();
data.customerId = data.customerId.toString();
if(ticketMap[data.customerId] && ticketMap[data.customerId][cleanName]){
    ticketCount = ticketMap[data.customerId][cleanName];
}
    return `
    <div class="product-item">
        <div class="product-name">${name}</div>

        <div class="product-meta">
            <span class="count">Products: ${obj.count}</span>
            <span class="status ${obj.status.toLowerCase().replace(/\s/g,'')}">${obj.status}</span>
            <span class="count">Tickets: ${ticketCount}</span>
        </div>
    </div>
    `;
})
.join("")}
</div>
`;
    tableRows += `
<tr class="project-row" >

    <td style="border:1px solid black">
        
        <span class="arrow" id="arrow-${projectId}" onclick="toggleProducts('${projectId}')">▶</span>
        ${projectId}
    </td>

    <td style="border:1px solid black;" onclick="openProject('${projectId}')"><u>${data.customer}</u></td>
    <td style="border:1px solid black;">${data.status}</td>
   <td style="border:1px solid black;">${Object.keys(data.products).length}</td>
    <td style="border:1px solid black;">${ticketData.total}</td>
<td style="border:1px solid black;">${ticketData.open}</td>
<td style="border:1px solid black;">${ticketData.closed}</td>
</tr>

<tr id="products-${projectId}" style="display:none; background:#f9f9f9;border:1px solid black;">
    <td colspan="7" style="padding:0;">
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
returnExternalUrl: true
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
htmlField.defaultValue = `

<style>
html, body{
margin:0 !important;
padding:0 !important;
width:100%;
height:100%;
overflow-y:hidden !important;
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

.
</style>
<form method="GET">
<input type="hidden" id="pageInput" name="page" value="${page}">
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
        
        "
        onload="hideLoader()">
</iframe>
<div id="homeContent">

<button class="addBtn" type="button" onclick="listProjects()">+</button>

<table>

<tr>
<th style="border:1px solid black;">Project ID</th>
<th style="border:1px solid black;">Customer</th>
<th style="border:1px solid black;">Status</th>
<th style="border:1px solid black;">Total Products</th>
<th style="border:1px solid black;">Total Tickets</th>
<th style="border:1px solid black;">Open</th>
<th style="border:1px solid black;">Closed</th>
</tr>



${tableRows}

</table>
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
    frame.style.display = "block";

    // Pass projectId to Suitelet
    var urlWithParam = viewProjectUrl + '&projectId=' + projectId;

    frame.src = urlWithParam;
    console.log(urlWithParam);
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
</script>
`;

context.response.writePage(form);

};

return { onRequest };

});