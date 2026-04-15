/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url','N/search','N/format','N/file'], (serverWidget, record, url, search,format,file) => {

const onRequest = (context) => {

    var form = serverWidget.createForm({ title: ' ' });

    var request = context.request;
    var projectId = request.parameters.projectId;

    var customer = '';
    var status = '';
    var projectType = '';
    var directProject ='';
    var projectManager ='';
    var accountManager ='';
    var erp ='';
    var scheduledUatDate= '';
    var goliveDate ='';
    var performa='';
      var fileUrl = '';
var fileName = '';



const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true
});

    if(projectId){

        var projectRec = record.load({
            type: 'customrecord_rw_portal_access',
            id: projectId,
            isDynamic: false
        });

        customer = projectRec.getText('custrecord_rw_portal_customername') || '';
        status = projectRec.getText('custrecord_rw_portal_status') || '';
        projectType = projectRec.getText('custrecord_rw_portal_projecttype') || '';
        directProject = projectRec.getText('custrecord_rw_portal_directproject') || '';
        projectManager = projectRec.getText('custrecord_rw_portal_projectmanager') || '';
        accountManager = projectRec.getText('custrecord_rw_portal_accountmanager') || '';
        erp = projectRec.getText('custrecord_rw_portal_erp') || '';
        scheduledUatDate = projectRec.getValue('custrecord_rw_portal_scheduleduatdate') || '';
        goliveDate = projectRec.getValue('custrecord_rw_portal_scheduledgolivedate') || '';
        performa=projectRec.getValue('custrecord_rw_portal_proformainvoice')
    if (performa) {
    try {
        var fileObj = file.load({
            id: performa
        });

        fileUrl = fileObj.url;
        fileName = fileObj.name;

    } catch (e) {
        log.error("File Load Error", e);
    }
}
         var scheduled='';
         var golive='';
        if(scheduledUatDate){
    scheduled = format.format({
        value: scheduledUatDate,
        type: format.Type.DATE
    });
}
if(goliveDate){
    golive = format.format({
        value: goliveDate,
        type: format.Type.DATE
    });
}


   


var lineItemsHtml = '';

var lineSearch = search.create({
    type: 'customrecord_rw_portal_access2',
    filters: [
        ['custrecord1513','anyof', projectId]
    ],
    columns: [
        'custrecord_rw_portal_rwproduct',
        'custrecord_rw_portal_additionalcomments',
        'custrecord_rw_rwprojectmanager',
        'custrecord_rw_portal_funcconsultant',
        'custrecord_rw_portal_techconsultant',
        'custrecord_rw_portal_lineexpecteduatdate',
        'custrecord_rw_portal_lineexptgolivedate',
        'custrecord_rw_portal_projstat'
    ]
});
function formatDate(date){
    if(!date) return '';
    var d = new Date(date);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
}
lineSearch.run().each(function(result){

    var product = result.getText('custrecord_rw_portal_rwproduct') || '';
    var comments = result.getValue('custrecord_rw_portal_additionalcomments') || '';
    var pm = result.getText('custrecord_rw_rwprojectmanager') || '';
    var functional = result.getText('custrecord_rw_portal_funcconsultant') || '';
    var technical = result.getText('custrecord_rw_portal_techconsultant') || '';
   var uatRaw = result.getValue('custrecord_rw_portal_lineexpecteduatdate');
var goliveRaw = result.getValue('custrecord_rw_portal_lineexptgolivedate');
var linestatus = result.getText('custrecord_rw_portal_projstat');

var uat = '';
var golive = '';

if(uatRaw){
    uat = format.format({
        value: uatRaw,
        type: format.Type.DATE
    });
}

if(goliveRaw){
    golive = format.format({
        value: goliveRaw,
        type: format.Type.DATE
    });
}

    lineItemsHtml += `
        <tr>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${product}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${comments}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${pm}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${functional}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${technical}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${uat}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${golive}</td>
            <td style="border:1px solid #ddd;font-size:12px;padding:8px;">${linestatus}</td>
            
        
        </tr>
    `;

    return true;
});
    }

    var htmlField = form.addField({
        id: 'custpage_html',
        type: serverWidget.FieldType.INLINEHTML,
        label: 'HTML'
    });

    htmlField.defaultValue = `
    <style>
        body{
            font-family: Arial;
            margin:0;
            padding:20px;
            
        }
.form-grid {
    display: grid;
    grid-template-columns: 180px 1fr 180px 1fr;
    gap: 12px 20px;
    align-items: center;
}

.label {
    font-weight: bold;
}

.value {
    background: #f9f9f9;
    padding: 8px;
    border-radius: 5px;
}
        // .container{
        //     max-width:1000px;
            
        //     height:fit-content;
        //     margin:auto;
        //     background:white;
        //     padding:20px;
        //     border-radius:10px;
        //     box-shadow:0 0 10px rgba(0,0,0,0.1);
        // }

        .title{
            font-size:20px;
            font-weight:bold;
            margin-bottom:20px;
            text-align:center;
        }

        .row{
            display:flex;
            margin-bottom:15px;
        }

        .label{
            width:50%;
            font-weight:bold;
        }

        .value{
            width:100%;
            background:#f9f9f9;
            border:1px solid #f1f1;
            padding:8px;
            border-radius:5px;
        }

        .backBtn{
            margin-top:20px;
            padding:10px 15px;
            background:#6f3ba2;
            color:white;
            border:none;
            border-radius:5px;
            cursor:pointer;
        }
#loader{
    display:none;
    position:fixed;
    inset:0;
    background:rgba(255,255,255,0.8);
    z-index:9999;
    text-align:center;
}

.spinner{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    border:6px solid #f3f3f3;
    border-top:6px solid #6f3ba2;
    border-radius:50%;
    width:50px;
    height:50px;
    animation:spin 1s linear infinite;
}

@keyframes spin{
    0%{transform:translate(-50%,-50%) rotate(0deg);}
    100%{transform:translate(-50%,-50%) rotate(360deg);}
}

#loader p{
    position:absolute;
    top:60%;
    left:50%;
    transform:translateX(-50%);
    font-weight:bold;
    color:#6f3ba2;
}
        .backBtn:hover{
            background:#5a2d87;
        }
    </style>

    <div class="container">
    <div class="title">Project Details</div>

    <div class="form-grid">

        <div class="label">Project ID</div>
        <div class="value">${projectId || ''}</div>

        <div class="label">Project Type</div>
        <div class="value">${projectType}</div>

        <div class="label">Customer</div>
        <div class="value">${customer}</div>
        <div class="label">Performa Invoice</div>
        <div class="value">
    ${fileUrl ? `<a href="${fileUrl}" target="_blank">${fileName}</a>` : 'No Attachment'}
</div>
        <div class="label">Status</div>
        <div class="value">${status}</div>

        <div class="label">Direct Project</div>
        <div class="value">${directProject}</div>
        <div class="label">Project Manager</div>
        <div class="value">${projectManager}</div>
        <div class="label">Account Manager</div>
        <div class="value">${accountManager}</div>
        <div class="label">ERP</div>
        <div class="value">${erp}</div>
        <div class="label">Scheduled UAT Date</div>
        <div class="value">${scheduled}</div>
        <div class="label">Go-Live Date</div>
        <div class="value">${golive}</div>

    </div>


<table style="width:100%; border-collapse:collapse; margin-top:14px;">
    <thead>
        <tr style="background:#6f3ba2; color:white;">
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">RW Product</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Comments</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Project Manager</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Functional</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Technical</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Expected UAT</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Expected Go Live</th>
            <th style="border:1px solid #ddd;font-size:12px;padding:8px;">Status</th>
        </tr>
    </thead>
    <tbody>
        ${lineItemsHtml || '<tr><td colspan="7">No data found</td></tr>'}
    </tbody>
</table>
    <button class="backBtn" type="button" onclick="goBack()">⬅ Back</button>
</div>
<div id="loader">
    <div class="spinner"></div>
    <p>Loading projects...</p>
</div>
    <script>
   document.title="project details";
    var projectUrl = '${projectUrl}';
     function goBack(){

    var loader = document.getElementById("loader");
    loader.style.display = "block";   // ✅ show loader

    setTimeout(function(){
        window.parent.location.href = projectUrl;
    }, 300); // small delay for smooth UX
}
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});