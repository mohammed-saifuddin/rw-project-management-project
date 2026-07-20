/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/url',
'N/runtime',
    'N/record'
], (serverWidget, search,url,runtime,record) => {

    const onRequest = (context) => {

        var request = context.request;

       var templateId =
    request.parameters.templateid ||
    request.parameters.id ||
    '';
    var empId =
    request.parameters.empid || '';

log.debug(
    'EMPLOYEE ID',
    empId
);
        var templateName = request.parameters.templatename || '';

        var product = request.parameters.product || '';

        var revenue = request.parameters.revenue || '';

        var form = serverWidget.createForm({
            title: 'Project Plan Detail'
        });

        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });

        var rows = '';
        var milestoneOptions = '';

var addedMilestones = {};

var milestoneSearch = search.create({

    type:'customrecord_rw_project_mile_stone_types',

    filters:[
        ['isinactive','is','F']
    ],

    columns:[
        'internalid',
        'name'
    ]
});

milestoneSearch.run().each(function(r){

    var id =
        r.getValue('internalid');

    var name =
        r.getValue('name');

    if(!addedMilestones[name]){

        milestoneOptions +=

            '<option value="' +
            id +
            '">' +
            name +
            '</option>';

        addedMilestones[name] = true;
    }

    return true;
});
var action = request.parameters.action || '';
function getOrCreateSNO(sno, search, record){

    var snoId = '';

    var snoSearch = search.create({

        type:
        'customlist_rw_serial_no',

        filters:[
            ['name','is',sno]
        ],

        columns:[
            'internalid'
        ]
    });

    snoSearch.run().each(function(r){

        snoId =
            r.getValue('internalid');

        return false;
    });

    if(snoId){
        return snoId;
    }

    var snoRec =
        record.create({

            type:
            'customrecord_rw_sno'
        });

    snoRec.setValue({

        fieldId:'name',

        value:sno.toString()
    });

    return snoRec.save();
}
function getOrCreateSNO(sno){

    return sno.toString();
}
var suiteletUrl = url.resolveScript({
    scriptId: runtime.getCurrentScript().id,
    deploymentId: runtime.getCurrentScript().deploymentId,
    returnExternalUrl: true
});
function getSNOInternalId(sno){

    var snoId = '';

    var snoSearch = search.create({

        type:'customlist_rw_serial_no',

        filters:[
            ['name','is',sno.toString()]
        ],

        columns:[
            'internalid'
        ]
    });

    snoSearch.run().each(function(r){

        snoId =
            r.getValue('internalid');

        return false;
    });

    if(snoId){

        return snoId;
    }

    var snoRec =
        record.create({

            type:'customlist_rw_serial_no'
        });

    snoRec.setValue({

        fieldId:'name',

        value:sno.toString()
    });

    snoId =
        snoRec.save();

    return snoId;
}
function isDuplicateMilestone(
    templateId,
    milestoneId
){

    var duplicate = false;

    var childSearch = search.create({

        type:
        'customrecord_rw_project_plan_temp_child',

        columns:[
            'internalid',
            'custrecord_rw_proj_plan_temp_child_link',
            'custrecord_rw_project_temp_child_miles'
        ]
    });

    childSearch.run().each(function(r){

        var existingTemplate =
            r.getValue(
                'custrecord_rw_proj_plan_temp_child_link'
            );

        var existingMilestone =
            r.getValue(
                'custrecord_rw_project_temp_child_miles'
            );

        if(
            existingTemplate == templateId &&
            existingMilestone == milestoneId
        ){

            duplicate = true;

            return false;
        }

        return true;
    });

    return duplicate;
}

if(action === 'createmilestone'){

    try{

        var milestoneName = request.parameters.milestonename;

        log.debug("Milestone Name", milestoneName);

        var existingId = '';

        var mileSearch = search.create({
            type:'customrecord_rw_project_mile_stone_types',
            filters:[
                ['name','is',milestoneName]
            ],
            columns:['internalid']
        });

        mileSearch.run().each(function(r){
            existingId = r.getValue('internalid');
            return false;
        });

        if(!existingId){

            var mileRec = record.create({
                type:'customrecord_rw_project_mile_stone_types'
            });

            mileRec.setValue({
                fieldId:'name',
                value:milestoneName
            });

            existingId = mileRec.save();

            log.debug("Created Milestone", existingId);
        }

        context.response.write(existingId);

    }catch(e){

    log.error({
        title: 'CREATE ERROR',
        details: e
    });

    context.response.write(
        e.name + " : " + e.message + "\n" + e.stack
    );

    return;
}

    return;
}
log.debug(
    'EMP ID BEFORE NOTIFICATION',
    empId
);
function createNotification(empId, message, type, refId){

    if(!empId) return;
log.debug(
    'EMP ID RECEIVED',
    empId
);
    var notifRec = record.create({
        type:'customrecord2517'
    });

    // REQUIRED NAME FIELD
    notifRec.setValue({
        fieldId:'name',
        value: message
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_employee',
        value:empId
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_message',
        value:message
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_type',
        value:type
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_refid',
        value:refId || ''
    });

    notifRec.setValue({
        fieldId:'custrecord_rw_notif_read',
        value:false
    });

    notifRec.save();
}


if(action === 'create'){

    try{

       var templateId =
    request.parameters.templateid ||
    request.parameters.template;

        var milestoneId =
            request.parameters.milestone;
     

       
if(
    isDuplicateMilestone(
        templateId,
        milestoneId
    )
){

    context.response.write(
        'duplicate'
    );

    return;
}
        var rec =
            record.create({

                type:
                'customrecord_rw_project_plan_temp_child'
            });

        rec.setValue({

            fieldId:
            'custrecord_rw_proj_plan_temp_child_link',

            value:
            templateId
        });
var snoInternalId =
    getSNOInternalId(
        request.parameters.tempsno
    );

rec.setValue({

    fieldId:
    'custrecord_rw_proj_plan_temp_child_sno',

    value:
    snoInternalId
});
        rec.setValue({

            fieldId:
            'custrecord_rw_project_temp_child_miles',

            value:
            milestoneId
        });
log.debug({
    title:'LINKING TEMPLATE',
    details:{
        templateId: templateId,
        milestoneId: milestoneId
    }
});
        var recId = rec.save();
        
    var milestoneNameText =
    search.lookupFields({

        type:
        'customrecord_rw_project_mile_stone_types',

        id: milestoneId,

        columns:['name']
    }).name || '';

createNotification(
    empId,
    'Milestone Created : ' + milestoneNameText,
    'MILESTONE_CREATED',
    milestoneId
);
        context.response.write(
            'success'
        );

    }catch(e){

    log.error({
        title: 'CREATE ERROR',
        details: e
    });

    context.response.write(
        e.name + "\n" +
        e.message + "\n" +
        e.stack
    );
}
log.debug(
    'MILESTONE CREATED',
    recId
);
    return;
}
if(action === 'delete'){

    var recId =
        request.parameters.recid;

    var childRec =
        record.load({

            type:
            'customrecord_rw_project_plan_temp_child',

            id: recId
        });

    var milestoneId =
        childRec.getValue(
            'custrecord_rw_project_temp_child_miles'
        );

    var milestoneNameText =
        childRec.getText(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    record.delete({

        type:
        'customrecord_rw_project_plan_temp_child',

        id: recId
    });

    createNotification(

        empId,

        'Milestone Deleted : ' +
        milestoneNameText,

        'MILESTONE_DELETED',

        milestoneId
    );

    context.response.write(
        'deleted'
    );

    return;
}
if(action === 'update'){

    var recId =
        request.parameters.recid;

    var childRec =
        record.load({

            type:
            'customrecord_rw_project_plan_temp_child',

            id: recId
        });

    childRec.setValue({

        fieldId:
        'custrecord_rw_project_temp_child_miles',

        value:
        request.parameters.milestone
    });

    childRec.setValue({

        fieldId:
        'custrecord_rw_proj_plan_temp_child_sno',

        value:
        request.parameters.tempsno
    });

    childRec.save();
var milestoneNameText =
    search.lookupFields({

        type:
        'customrecord_rw_project_mile_stone_types',

        id: milestoneId,

        columns:['name']
    }).name || '';

createNotification(
    empId,
    'Milestone Created : ' + milestoneNameText,
    'MILESTONE_CREATED',
    milestoneId
);
    context.response.write(
        'success'
    );

    return;
}
        var childSearch = search.create({

            type: 'customrecord_rw_project_plan_temp_child',

            filters: [
                
            ],

            columns: [
                'internalid',

                'custrecord_rw_proj_plan_temp_child_sno',

                'custrecord_rw_project_temp_child_miles',
                'custrecord_rw_proj_plan_temp_child_link'

            ]
        });

        if(templateId){

    childSearch.filters.push(
        search.createFilter({
            name:
            'custrecord_rw_proj_plan_temp_child_link',

            operator: search.Operator.ANYOF,

            values: [templateId]
        })
    );
}

        var i = 1;

       var renderedMilestones = {};

childSearch.run().each(function(res){

    var recId =
        res.getValue('internalid');

    var sno = i;

    var milestone =
        res.getText(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

    var milestoneId =
        res.getValue(
            'custrecord_rw_project_temp_child_miles'
        ) || '';

     if(renderedMilestones[milestoneId]){

        return true;
    }

 renderedMilestones[milestoneId] = true;

    rows += `

<tr>

    <td style="">

        <span id="sno_text_${recId}" class="data">
            ${sno}
        </span>

        <input type="text"
               value="${sno}"
               id="sno_${recId}"
               class="input"
               style="display:none;"/>

    </td>

    <td style="">

        <span id="mile_text_${recId}" class="data">
            ${milestone}
        </span>

       </td>

    <td style=";
text-align:center;">

<button
type="button"
class="delete-btn"
title="Remove the milestone"
onclick="deleteMilestone('${recId}')">

<i class="fa-solid fa-xmark"></i>

</button>

</tr>

<script>

window.addEventListener(
    'load',
    function(){

        var sel =
            document.getElementById(
                'mile_${recId}'
            );

        if(sel){

            sel.value =
                '${milestoneId}';
        }
    }
);

</script>
`;

    i++;

    return true;
});

        var html = `

        <style>

       


body{
    padding:0 !important;
}


#main_form{
    border:none !important;
    box-shadow:none !important;
    background:transparent !important;
    padding:0 !important;
}

.uir-page-title{
    display:none !important;
}

.uir-outside-fields-table{
    border:none !important;
}

.uir-outside-fields-table td{
    border:none !important;
}

.uir-page-body{
    margin:0 !important;
    padding:0 !important;
    border:none !important;
}

      #main_form_div,
#custpage_html_fs,
#custpage_html_val{

    overflow:visible !important;
    height:auto !important;
    max-height:none !important;
}

.card{

    overflow:visible !important;
}

            .title{
                font-size:24px;
                color:#8f50df;
                font-weight:bold;
                margin-bottom:20px;
            }

            .info{
                margin-bottom:10px;
                font-size:14px;
            }

            table{
                width:100%;
                border-collapse:collapse;
                
            }

            th{
      background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
                color:darkblue;
                padding:14px;
                font-size:14px;
                text-transform:uppercase;
            }

            td{
                padding:14px;
                font-size:16px;
                color: black;

                
            }
.input{
    width:100%;
    padding:8px;
    border:1px solid #ccc;
    border-radius:6px;
}
.delete-btn{

    

    color:red;
    background:white;

    border:none;

    padding:0;

    border-radius:8px;

    cursor:pointer;

    font-size:16px;

    font-weight:600;

    transition:0.3s ease;
}

.delete-btn:hover{

    transform:translateY(-2px);

    box-shadow:
        0 8px 18px rgba(239,68,68,0.25);
}
button{
     background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
}
    .data{
    font-size:12px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#333;
    }
    .dialog-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:999999;
    animation:fadeIn .25s;
}

.dialog-box{
    width:420px;
    background:#fff;
    border-radius:18px;
    padding:30px;
    text-align:center;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
    animation:popup .3s ease;
}

.dialog-icon{
    width:80px;
    height:80px;
    border-radius:50%;
    margin:auto;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:38px;
    color:#fff;
    margin-bottom:18px;
}

.dialog-success{
    background:#22c55e;
}

.dialog-danger{
    background:#ef4444;
}

.dialog-warning{
    background:#f59e0b;
}

.dialog-info{
    background:#3b82f6;
}

#dialogTitle{
    margin:0;
    color:#1f2937;
    font-size:24px;
}

#dialogMessage{
    margin-top:15px;
    color:#666;
    line-height:1.6;
    font-size:15px;
}

.dialog-buttons{
    display:flex;
    justify-content:center;
    gap:15px;
    margin-top:28px;
}

.dialog-btn{
    min-width:110px;
    border:none;
    padding:12px 20px;
    border-radius:8px;
    cursor:pointer;
    font-size:15px;
    font-weight:600;
}

.dialog-btn.ok{
    background:linear-gradient(135deg,#002855,#8f50df);
    color:#fff;
}

.dialog-btn.cancel{
    background:#ececec;
    color:#444;
}

@keyframes popup{
    from{
        transform:scale(.8);
        opacity:0;
    }
    to{
        transform:scale(1);
        opacity:1;
    }
}

@keyframes fadeIn{
    from{
        opacity:0;
    }
    to{
        opacity:1;
    }
}
    .heading{
    display:flex;
    justify-content:center;
    align-item:center;
    }
    .tab{
    display:flex;
    margin-left:60px;
    margin-right:60px;
    border-radius:18px;

    

    box-shadow:0 12px 35px rgba(0,0,0,.08);
    }
    #topEditBtn{
    width:42px;
    height:42px;
    border:none;
    
    border-radius:50%;
    background:#5b21b6;
    color:#fff;
    cursor:pointer;
    font-size:18px;
    transition:.3s;
    box-shadow:0 5px 15px rgba(0,0,0,.15);

    }
    .modern-table{

    width:100%;

    border-collapse:separate;

    border-spacing:0;
    border-radius:10px;

    min-width:800px;

}
    .modern-table thead th{

    position:sticky;

    top:0;

    background:#E6E6E6;

    color:darkblue;

    font-size:13px;

    font-weight:600;

    letter-spacing:.5px;

    text-transform:uppercase;
    

    padding:16px;

    border:none;

    white-space:nowrap;

}
    .modern-table tbody td{

    padding:14px 18px;

    border-bottom:1px solid #edf2f7;

    background:#fff;

    color:#374151;

    font-size:16px;

    transition:.25s;

}
    .modern-table tbody tr:nth-child(odd) td{

    background:#ffffff;

}

.modern-table tbody tr:nth-child(even) td{

    background:#f8fafc;

}
    .modern-table thead th:first-child{

    border-top-left-radius:18px;

}

.modern-table thead th:last-child{

    border-top-right-radius:18px;

}
        </style>
            <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<input type="hidden"
       id="templateId"
       value="${templateId}">
       <input type="hidden"
       id="empId"
       value="${empId}">
       <input type="hidden"
       id="templateName"
       value="${templateName}">

<input type="hidden"
       id="productName"
       value="${product}">
<input
    type="hidden"
    id="suiteletUrl"
    value="${suiteletUrl}">
<input type="hidden"
       id="revenueName"
       value="${revenue}">
        <div class="card">

           

            
<div class="heading">
<h1>Create New Milestone</h1>
</div>
           


  <div style="
    margin-bottom:15px;
    display:flex;
    margin-left:60px;
    display:flex;
    
    
    
    gap:10px;
">


    <button
    type="button"
    id="topEditBtn"
    title="Create a new milestone"
    onclick="openMilestoneDialog()">

    <i class="fa fa-plus"  aria-hidden="true"></i>

</button>

    

<button
    type="button"
    id="topSaveBtn"
    title="save milestone"
    style="display:none;"
    onclick="saveAllRows()">

    Save

</button>

</div>
<div id="mileDialog"
     style="
        display:none;
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.5);
        z-index:99999;
     ">

    <div style="
        background:#fff;
        width:400px;
        margin:120px auto;
        padding:20px;
        border-radius:12px;
        box-shadow:0 4px 12px rgba(0,0,0,0.2);
    ">

        <h3 style="
            margin-top:0;
            color:#8f50df;
            font-size:14px;
            font-weight:bold;
        ">
            Add New Milestone
        </h3>

        <div style="margin-bottom:15px;">

            <label style="font-size:13px;font-weight:bold;">
                Milestone
            </label>

           <input
    type="text"
    id="dialog_mile"
    class="input"
    placeholder="Enter Milestone Name"
    style="margin-top:8px;padding:8px;" />

        </div>

        <div style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
        ">

            <button
                type="button"
                title="cancel"
                onclick="closeMilestoneDialog()"
                style="
                    background:#999;
                ">

                Cancel

            </button>

            <button
                type="button"
                title="save the milestone"
                onclick="saveNewMilestone()">

                Save

            </button>

        </div>

    </div>

</div>
  
<div class="tab">
            <table class="modern-table">

                <thead>

                   <tr>

    <th style="">
        S.NO
    </th>

    <th style="">
        Milestone
    </th>
<th style=";font-family:Arial, sans-serif;font-size:12px;
background:#E6E6E6; width:120px;">
    Action
</th>
    

</tr>

                </thead>

                <tbody id="mileBody">

                    ${rows}

                </tbody>

            </table>
</div>
        </div>
        <div id="customDialog" class="dialog-overlay">
    <div class="dialog-box">

        <div id="dialogIcon" class="dialog-icon">
            <i class="fa-solid fa-circle-check"></i>
        </div>

        <h2 id="dialogTitle">Success</h2>

        <p id="dialogMessage">
            Operation completed successfully.
        </p>

        <div id="dialogButtons" class="dialog-buttons">
            <button id="dialogCancel"
                class="dialog-btn cancel"
                title="Cancel"
                style="display:none;">
                Cancel
            </button>

            <button id="dialogOk" title="ok"
                class="dialog-btn ok">
                OK
            </button>
        </div>

    </div>
</div>
<script>
var milestoneDropdownOptions =
    ${JSON.stringify(milestoneOptions)};
function openMilestoneDialog(){

    document.getElementById(
        'mileDialog'
    ).style.display = 'block';
}

function closeMilestoneDialog(){

    document.getElementById(
        'mileDialog'
    ).style.display = 'none';
}
function addNewRow(){

    var tbody =
        document.getElementById(
            'mileBody'
        );

    var row =
        document.createElement('tr');

    var nextSno =
        document.querySelectorAll(
            '#mileBody tr'
        ).length + 1;

    row.innerHTML =

        '<td style=";display:flex;justify-content:center;">' +

            nextSno +

        '</td>' +

        '<td style="">' +

            '<select id="new_mile"' +
                    ' class="input">' +

                milestoneDropdownOptions +

            '</select>' +

        '</td>' +

        '<td style="">' +

            '<button type="button"' +
                    ' onclick="saveNewMilestone()">' +

                'Save' +

            '</button>' +

        '</td>';

    tbody.appendChild(row);

    row.scrollIntoView({
        behavior:'smooth',
        block:'end'
    });
}

function showToast(message){

    var oldToast =
        document.getElementById(
            'customToast'
        );

    if(oldToast){

        oldToast.remove();
    }

    var toast =
        document.createElement('div');

    toast.id = 'customToast';

    toast.innerHTML = message;

    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.background = '#8f50df';
    toast.style.color = '#fff';
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '999999';
    toast.style.fontSize = '14px';
    toast.style.boxShadow =
        '0 4px 10px rgba(0,0,0,0.2)';

    document.body.appendChild(toast);

    setTimeout(function(){

        toast.remove();

    },3000);
}
window.addEventListener(
    'load',
    function(){

        document.body.style.overflow =
            'hidden';

        document.documentElement.style.overflow =
            'hidden';

        setTimeout(function(){

            var height =
                document.body.scrollHeight;

            if(window.parent){

                var iframe =
                    window.parent.document
                    .querySelector('iframe');

                if(iframe){

                    iframe.style.height =
                        height + 'px';
                }
            }

        },500);
    }
);
function showDialog(options){

    return new Promise(function(resolve){

        document.getElementById("customDialog").style.display="flex";

        document.getElementById("dialogTitle").innerHTML=options.title;
        document.getElementById("dialogMessage").innerHTML=options.message;

        var icon=document.getElementById("dialogIcon");

        icon.className="dialog-icon dialog-"+options.type;

        if(options.type==="success"){
            icon.innerHTML='<i class="fa-solid fa-circle-check"></i>';
        }

        if(options.type==="danger"){
            icon.innerHTML='<i class="fa-solid fa-trash"></i>';
        }

        if(options.type==="warning"){
            icon.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i>';
        }

        if(options.type==="info"){
            icon.innerHTML='<i class="fa-solid fa-circle-info"></i>';
        }

        var ok=document.getElementById("dialogOk");
        var cancel=document.getElementById("dialogCancel");

        if(options.confirm){

            cancel.style.display="inline-block";

        }else{

            cancel.style.display="none";

        }

        ok.onclick=function(){

            document.getElementById("customDialog").style.display="none";

            resolve(true);

        };

        cancel.onclick=function(){

            document.getElementById("customDialog").style.display="none";

            resolve(false);

        };

    });

}
    function refreshSuitelet() {

    const url = new URL(document.getElementById("suiteletUrl").value);

    url.searchParams.set("templateid",
        document.getElementById("templateId").value);

    url.searchParams.set("templatename",
        document.getElementById("templateName").value);

    url.searchParams.set("product",
        document.getElementById("productName").value);

    url.searchParams.set("revenue",
        document.getElementById("revenueName").value);

    url.searchParams.set("empid",
        document.getElementById("empId").value);

    // Prevent browser cache
    url.searchParams.set("_ts", new Date().getTime());

    window.location.replace(url.toString());
}
    async function loadMilestoneTable(){

    const url = new URL(document.getElementById("suiteletUrl").value);

    url.searchParams.set("action","getrows");
    url.searchParams.set("templateid",
        document.getElementById("templateId").value);

    const html = await (await fetch(url)).text();

    document.getElementById("mileBody").innerHTML = html;
}
async function saveNewMilestone(){

    var milestoneName =
    document.getElementById(
        'dialog_mile'
    ).value.trim();

if(!milestoneName){

    alert(
        'Please enter milestone name'
    );

    return;
}
var duplicateFound = false;

document.querySelectorAll(
    '#mileBody span[id^="mile_text_"]'
).forEach(function(span){

    if(
        span.innerText.trim().toLowerCase() ==
        milestoneName.toLowerCase()
    ){

        duplicateFound = true;
    }
});

if(duplicateFound){

     await showDialog({

    type:"warning",

    title:"Milestone already exists",

    message:"The milestone already exists"

});

    document.getElementById(
        'dialog_mile'
    ).value = '';

    return;
}
    var templateId =
        document.getElementById(
            'templateId'
        ).value;

    var templateName =
        document.getElementById(
            'templateName'
        ).value;

    var product =
        document.getElementById(
            'productName'
        ).value;

    var revenue =
        document.getElementById(
            'revenueName'
        ).value;

    var sno =
        document.querySelectorAll(
            '#mileBody tr'
        ).length + 1;

    // var alreadyExists = false;

    // document.querySelectorAll(
    //     'select[id^="mile_"]'
    // ).forEach(function(sel){

    //     if(sel.value == milestone){

    //         alreadyExists = true;
    //     }
    // });
var createUrl = new URL(
    document.getElementById("suiteletUrl").value
);



createUrl.searchParams.set(
    'action',
    'createmilestone'
);

createUrl.searchParams.set(
    'milestonename',
    milestoneName
);

var milestone =
    await fetch(
        createUrl.toString()
    );

milestone =
    await milestone.text();
    // if(alreadyExists){

    //     // showToast(
    //     //     'Milestone already exists'
    //     // );
    //      alert('Milestone already exists');
    //     setTimeout(function(){

    //         location.reload();

    //     },1000);

    //     return;
    // }

    // showToast(
    //     'Adding milestone...'
    // );
    var response = await fetch(createUrl.toString());
var result = (await response.text()).trim();

if (result === "success") {

    closeMilestoneDialog();

    await showDialog({
        type: "success",
        title: "Milestone Created",
        message: "The milestone has been added successfully."
    });

    refreshSuitelet();
}


    var url = new URL(
    document.getElementById("suiteletUrl").value
);

    url.searchParams.set(
        'action',
        'create'
    );

    url.searchParams.set(
        'tempsno',
        sno
    );

   
    

    url.searchParams.set(
        'templateid',
        templateId
    );

    url.searchParams.set(
        'templatename',
        templateName
    );

    url.searchParams.set(
        'product',
        product
    );

    url.searchParams.set(
        'revenue',
        revenue
    );

    url.searchParams.set(
        'milestone',
        milestone
    );
url.searchParams.set(
    'empid',
    document.getElementById(
        'empId'
    ).value
);
    var response =
    await fetch(
        url.toString()
    );


var result = (await response.text()).trim();

console.log("RESULT:", result);
//alert(result);
if(result == 'duplicate'){

    await showDialog({

    type:"warning",

    title:"Milestone already exists",

    message:"The milestone already exists"

});
 refreshMilestones();
    return;
}

    // showToast(
    //     'Milestone added successfully'
    // );
    if(result === 'success'){

    await showDialog({

    type:"success",

    title:"Milestone Created",

    message:"The milestone has been added successfully."

});

 
 setTimeout(function () {
        refreshSuitelet();
    }, 2000);
    return;



}else if(result == 'invalidsno'){

    alert(
        'SNO value not found in RW SNO list'
    );

    return;
}
    else{
        alert(
            'Error adding milestone'
        );}
    setTimeout(function(){

        location.reload();

    },1000);
    closeMilestoneDialog();
    location.reload();
}
function refreshMilestones() {
    var url = new URL(document.getElementById("suiteletUrl").value);

    url.searchParams.set("templateid",
        document.getElementById("templateId").value);

    url.searchParams.set("templatename",
        document.getElementById("templateName").value);

    url.searchParams.set("product",
        document.getElementById("productName").value);

    url.searchParams.set("revenue",
        document.getElementById("revenueName").value);

    url.searchParams.set("empid",
        document.getElementById("empId").value);

    window.location.href = url.toString();
}
function cancelEditMode(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    rows.forEach(function(row){

        var spanSno =
            row.querySelector(
                'span[id^="sno_text_"]'
            );

        var spanMile =
            row.querySelector(
                'span[id^="mile_text_"]'
            );

        var inputSno =
            row.querySelector(
                'input[id^="sno_"]'
            );

        var selectMile =
            row.querySelector(
                'select[id^="mile_"]'
            );

        if(spanSno)
            spanSno.style.display='block';

        if(spanMile)
            spanMile.style.display='block';

        if(inputSno)
            inputSno.style.display='none';

        if(selectMile){

            selectMile.style.display='none';

            selectMile.style.border =
                '1px solid #ccc';

            selectMile.value =
                selectMile.getAttribute(
                    'data-selected'
                );
        }
    });

    document.getElementById(
        'topEditBtn'
    ).style.display='inline-block';

    document.getElementById(
        'topSaveBtn'
    ).style.display='none';

    document.getElementById(
        'topSaveBtn'
    ).disabled = false;

    document.getElementById(
        'topSaveBtn'
    ).innerHTML = 'Save';
}
async function saveAllRows(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    var selectedMilestones = [];

    var duplicateFound = false;

    var finalSelections = {};

rows.forEach(function(row){

    var select =
        row.querySelector(
            'select[id^="mile_"]'
        );

    if(select){

        var value = select.value;

        if(finalSelections[value]){

            duplicateFound = true;

            select.style.border =
                '2px solid red';

        }else{

            finalSelections[value] = true;

            select.style.border =
                '1px solid #ccc';
        }
    }
});
    if(duplicateFound){

        // showToast(
        //     'Milestone already exists'
        // );
             await showDialog({

    type:"warning",

    title:"Milestone already exists",

    message:"The milestone already exists"

});
        setTimeout(function(){

            cancelEditMode();

        },1000);

        return false;
    }

    document.getElementById(
        'topSaveBtn'
    ).innerHTML = 'Saving...';

    document.getElementById(
        'topSaveBtn'
    ).disabled = true;

    for(const row of rows){

        var select =
            row.querySelector(
                'select[id^="mile_"]'
            );

        var snoInput =
            row.querySelector(
                'input[id^="sno_"]'
            );

        if(select && snoInput){

            var recId =
                select.id.replace(
                    'mile_',
                    ''
                );

            var oldValue =
                select.getAttribute(
                    'data-selected'
                );

            if(oldValue != select.value){

                var response =
                    await updateMilestone(recId);

                var text =
                    await response.text();

                if(text.includes(
                    'Milestone already exists'
                )){

                    // showToast(
                    //     'Milestone already exists'
                    // );
                    alert('Milestone already exists');

                    setTimeout(function(){

                        cancelEditMode();

                    },1000);

                    return false;
                }

                select.setAttribute(
                    'data-selected',
                    select.value
                );
            }
        }
    }

    // showToast(
    //     'Milestones updated successfully'
    // );
     await showDialog({

    type:"success",

    title:"Milestone updated successfully",

    message:"The milestone updated successfully"

});

    setTimeout(function(){

        location.reload();

    },1000);
}

function editAllRows(){

    var rows =
        document.querySelectorAll(
            '#mileBody tr'
        );

    rows.forEach(function(row){

        var spanSno =
            row.querySelector(
                'span[id^="sno_text_"]'
            );

        var spanMile =
            row.querySelector(
                'span[id^="mile_text_"]'
            );

        var inputSno =
            row.querySelector(
                'input[id^="sno_"]'
            );

        var selectMile =
            row.querySelector(
                'select[id^="mile_"]'
            );

        if(spanSno)
            spanSno.style.display='none';

        if(spanMile)
            spanMile.style.display='none';

        if(inputSno)
            inputSno.style.display='block';

        if(selectMile){

            selectMile.style.display='block';

            selectMile.value =
                selectMile.getAttribute(
                    'data-selected'
                );
        }
    });

    document.getElementById(
        'topEditBtn'
    ).style.display='none';

    document.getElementById(
        'topSaveBtn'
    ).style.display='inline-block';
}
async function updateMilestone(recId){

    var sno =
        document.getElementById(
            'sno_' + recId
        ).value;

    var milestone =
        document.getElementById(
            'mile_' + recId
        ).value;

    var templateId =
        document.getElementById(
            'templateId'
        ).value;

    var product =
        document.getElementById(
            'productName'
        ).value;

    var revenue =
        document.getElementById(
            'revenueName'
        ).value;

    var templateName =
        document.getElementById(
            'templateName'
        ).value;

    var url = new URL(
    document.getElementById("suiteletUrl").value
);
    url.searchParams.set(
        'templateid',
        templateId
    );

    url.searchParams.set(
        'templatename',
        templateName
    );

    url.searchParams.set(
        'product',
        product
    );

    url.searchParams.set(
        'revenue',
        revenue
    );

    url.searchParams.set(
        'action',
        'update'
    );

    url.searchParams.set(
        'recid',
        recId
    );

    url.searchParams.set(
        'tempsno',
        sno
    );

    url.searchParams.set(
        'milestone',
        milestone
    );
url.searchParams.set(
    'empid',
    document.getElementById(
        'empId'
    ).value
);
    return fetch(
        url.toString()
    );
}
    async function deleteMilestone(recId){

   var confirmDelete=await showDialog({

    type:"warning",

    title:"Delete Milestone",

    message:"Are you sure you want to remove this milestone? This action cannot be undone.",

    confirm:true

});
refreshMilestones();
if(!confirmDelete){
    return;
}

    var url = new URL(
    document.getElementById("suiteletUrl").value
);

    url.searchParams.set(
        'action',
        'delete'
    );

    url.searchParams.set(
        'recid',
        recId
    );

    await fetch(
        url.toString()
    );

    await showDialog({

    type:"danger",

    title:"Milestone Removed",

    message:"The selected milestone has been removed successfully."

});


}
function editRow(recId){

    document.getElementById(
        'sno_text_' + recId
    ).style.display = 'none';

    document.getElementById(
        'mile_text_' + recId
    ).style.display = 'none';

    document.getElementById(
        'sno_' + recId
    ).style.display = 'block';

    document.getElementById(
        'mile_' + recId
    ).style.display = 'block';

    document.getElementById(
        'edit_' + recId
    ).style.display = 'none';

    document.getElementById(
        'save_' + recId
    ).style.display = 'inline-block';
    var sel =
    document.getElementById(
        'mile_' + recId
    );

if(sel){

    sel.value =
        sel.getAttribute(
            'data-selected'
        );
}
}
document.title="Create MileStone"
 
</script>
        `;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    };

    return { onRequest };
});