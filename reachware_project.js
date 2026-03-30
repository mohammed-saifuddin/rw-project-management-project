/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/url','N/search','N/record'], (serverWidget,url,search,record) => {

const onRequest = (context) => {

var form = serverWidget.createForm({ title:' ' });

var projectSearch = search.create({
    type: 'customrecord_rw_portal_access2',
     filters: [
        ['custrecord1513','noneof','@NONE@'] 
    ],
    columns: [
        'custrecord_rw_portal_rwproduct', 
        'custrecord_rw_portal_additionalcomments',
        'custrecord1513'

        
    
    ]
});


var tableRows = '';
var projectCounts = {};
projectSearch.run().each(function(result){

    var parentId = result.getValue('custrecord1513');

    if(parentId){
        if(!projectCounts[parentId]){
            projectCounts[parentId] = 0;
        }
        projectCounts[parentId]++;
    }

    return true;
});
projectSearch.run().each(function(result){

   var parentId = result.getValue('custrecord1513');

var customer = '';
var projectId = '';
var status = '';
var total=0;
if(parentId){

    var parentData = record.load({
    type: 'customrecord_rw_portal_access',
    id: parentId
});

customer = parentData.getValue('custrecord_rw_portal_customername') || '';
projectId = parentData.id;
status = parentData.getText('custrecord_rw_portal_status') || '';
total = projectCounts[parentId] || 0;
    
}

 
    
    var rwProduct = result.getText('custrecord_rw_portal_rwproduct');

    var comments = result.getValue('custrecord_rw_portal_additionalcomments');

    tableRows += `
    <tr>
    
    <td  style="border:1px solid black;">${projectId}</td>
        <td style="border:1px solid black;">${customer}</td>
        
        <td style="border:1px solid black;">${rwProduct}</td>
        <td style="border:1px solid black;">${status}</td>
        <td style="border:1px solid black;">${total}</td>
        <td style="border:1px solid black;">${total}</td>
        <td style="border:1px solid black;">${total}</td>
    </tr>
    `;
log.debug("Customer", customer);
log.debug("PM", projectId);
log.debug("Status", status);
log.debug(rwProduct)
log.debug("Parent Data FULL", JSON.stringify(parentData));
log.debug("parent id is ",parentId);
    return true;
});
    




var htmlField = form.addField({
    id:'custpage_html',
    type:serverWidget.FieldType.INLINEHTML,
    label:'HTML'
});

const projectUrl = url.resolveScript({
scriptId: 'customscript2877',
deploymentId: 'customdeploy1',
returnExternalUrl: true
});

htmlField.defaultValue = `

<style>
html, body{
margin:0 !important;
padding:0 !important;
width:100%;
height:100%;
overflow-y:hidden !important;
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

th{
background:#6f2da8;
color:white;
padding:10px;
border:0px solid #ccc;
}

td{
padding:10px;
border:0px solid #ccc;
text-align:center;
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

</style>

<div class="content">

<iframe id="mainFrame" style="width:100%;height:1000px;border:none;display:none;"></iframe>

<div id="homeContent">

<button class="addBtn" type="button" onclick="listProjects()">+</button>

<table>

<tr>
<th style="border:1px solid #ccc;">Project ID</th>
<th style="border:1px solid #ccc;">Customer</th>
<th style="border:1px solid #ccc;">RW Product</th>
<th style="border:1px solid #ccc;">Status</th>
<th style="border:1px solid #ccc;">Total Tickets</th>
<th style="border:1px solid #ccc;">Open</th>
<th style="border:1px solid #ccc;">Closed</th>
</tr>



${tableRows}
</table>

</div>
</div>

<script>
document.title="Projects"
var projectUrl = '${projectUrl}';

function listProjects(){
/*alert("list of projects");*/
document.getElementById("homeContent").style.display = "none";

document.getElementById("mainFrame").style.display = "block";

document.getElementById("mainFrame").src = projectUrl;

}

</script>
`;

context.response.writePage(form);

};

return { onRequest };

});