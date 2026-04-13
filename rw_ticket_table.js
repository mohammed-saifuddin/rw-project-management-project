/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record','N/runtime'], (serverWidget,url,search,record,runtime) => {

const onRequest = (context) => {

var form = serverWidget.createForm({ title:' ' });
var request = context.request;

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
returnExternalUrl: true
});
var projectSearch = search.create({
    type: 'customrecord_rw_ticket',
    filters: [],
    columns: [
        search.createColumn({
            name: 'internalid',
            sort: search.Sort.DESC   // ✅ THIS LINE
        }),
        'internalid',
        'custrecord_rw_ticket_requesttype',
        'custrecord_rw_ticket_name',
        'custrecord_rw_ticket_date',
        'custrecord_rw_ticket_ticketno',
        'custrecord_rw_ticket_projectname',
        'custrecord_rw_ticket_rwsuiteapp',
        'custrecord_rw_ticket_ticketstatus',
        'custrecord_rw_ticket_deadline',
        'custrecord_rw_ticket_issuedetails'
    ]
});

projectSearch.run().each(function(result){

    var id = result.getValue('internalid');
    var requestType=result.getText('custrecord_rw_ticket_requesttype')
    var name = result.getText('custrecord_rw_ticket_name');
    var date=result.getText('custrecord_rw_ticket_date');
    var status = result.getText('custrecord_rw_ticket_ticketstatus');
    var ticketNo = result.getText('custrecord_rw_ticket_ticketno');
    var projectName=result.getText('custrecord_rw_ticket_projectname');
    var rwApp=result.getText('custrecord_rw_ticket_rwsuiteapp');
    var deadline =result.getText('custrecord_rw_ticket_deadline');
    var issueDetails=result.getValue('custrecord_rw_ticket_issuedetails')

    log.debug("Project", id + " " + requestType + " " + status);

    return true;
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

    var pageIndex = parseInt(request.parameters.page) || 0;

var pagedData = projectSearch.runPaged({ pageSize: 10 });

if (pageIndex < 0) pageIndex = 0;
if (pageIndex >= pagedData.pageRanges.length) pageIndex = 0;

var currentPage = pagedData.fetch({ index: pageIndex });

var tableRows = '';

currentPage.data.forEach(function(result){

    tableRows += `
        <tr  class="ho">
            <td style="border:1px solid black;">${result.getText('custrecord_rw_ticket_requesttype') || ''}</td>
            <td style="border:1px solid black;">${result.getValue('custrecord_rw_ticket_name') || ''}</td>
            <td style="border:1px solid black;">${result.getValue('custrecord_rw_ticket_date') || ''}</td>
            <td style="border:1px solid black;">${result.getValue('custrecord_rw_ticket_ticketno') || ''}</td>
            <td style="border:1px solid black;">${result.getText('custrecord_rw_ticket_projectname') || ''}</td>
            <td style="border:1px solid black;">${result.getText('custrecord_rw_ticket_rwsuiteapp')  || ''}</td>
            <td style="border:1px solid black;">${result.getText('custrecord_rw_ticket_ticketstatus') || ''}</td>
            <td style="border:1px solid black;"> ${result.getValue('custrecord_rw_ticket_deadline') || ''}</td>
        </tr>
    `;
});

var totalPages = pagedData.pageRanges.length;

    
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
.ho:hover{
background:#6f3ba2;
color:white;
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
    background:#6f3ba2;
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
<th style="border:1px solid black;">Request Type</th>
<th style="border:1px solid black;">Requester Name</th>
<th style="border:1px solid black;">Date</th>
<th style="border:1px solid black;">Ticket ID</th>
<th style="border:1px solid black;">Client Name</th>
<th style="border:1px solid black;">RW Product</th>
<th style="border:1px solid black;">RW Product</th>
<th style="border:1px solid black;">Deadline</th>
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