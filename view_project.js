/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/url'], (serverWidget, record, url) => {

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
const projectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true
});
    if(projectId){

        var projectRec = record.load({
            type: 'customrecord_rw_portal_access',
            id: projectId
        });

        customer = projectRec.getValue('custrecord_rw_portal_customername') || '';
        status = projectRec.getText('custrecord_rw_portal_status') || '';
        projectType = projectRec.getText('custrecord_rw_portal_projecttype') || '';
        directProject = projectRec.getText('custrecord_rw_portal_directproject') || '';
        projectManager = projectRec.getText('custrecord_rw_portal_projectmanager') || '';
        accountManager = projectRec.getText('custrecord_rw_portal_accountmanager') || '';
        erp = projectRec.getText('custrecord_rw_portal_erp') || '';
        scheduledUatDate = projectRec.getValue('custrecord_rw_portal_scheduleduatdate') || '';
        goliveDate = projectRec.getValue('custrecord_rw_portal_scheduledgolivedate') || '';

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
        .container{
            max-width:1000px;
            
            height:fit-content;
            margin:auto;
            background:white;
            padding:20px;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.1);
        }

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
            width:90%;
            background:#f9f9f9;
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
        <div class="value">${scheduledUatDate}</div>
        <div class="label">Go-Live Date</div>
        <div class="value">${goliveDate}</div>

    </div>

    <button class="backBtn" onclick="goBack()">⬅ Back</button>
</div>
    <script>
    var projectUrl = '${projectUrl}';
        function goBack(){
            window.location.href = window.projectUrl;
        }
    </script>
    `;

    context.response.writePage(form);
};

return { onRequest };

});