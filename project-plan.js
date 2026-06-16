/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/runtime',
    'N/record',
    'N/url'
], (serverWidget, search, runtime,record,url) => {

    const onRequest = (context) => {

        var request = context.request;

        var form = serverWidget.createForm({
            title: ' '
        });
        if (context.request.method === 'POST') {

    try {

       var body = {};

try{

    body = JSON.parse(
        context.request.body || '{}'
    );

}catch(e){

    log.error(
        'INVALID JSON',
        context.request.body
    );

    body = context.request.parameters || {};
}

        if (body.action === 'createProjectPlan') {

            var rec = record.create({
                type: 'customrecord_rw_project_plan_template'
            });

            rec.setValue({
                fieldId: 'name',
                value: body.planName
            });

            if(body.product){

    rec.setValue({
        fieldId: 'custrecord_rw_product_service_mapping',
        value: parseInt(body.product, 10)
    });

}

            if(body.revenue){

    rec.setValue({
        fieldId: 'custrecord_rw_project_plan_rev_stream',
        value: parseInt(body.revenue, 10)
    });

}
log.debug('PLAN NAME', body.planName);
log.debug('PRODUCT', body.product);
log.debug('REVENUE', body.revenue);
            var id = rec.save();
            log.debug('Parent Created', id);

log.debug(
    'MILESTONES RECEIVED',
    JSON.stringify(body.milestones)
);

(body.milestones || []).forEach(function(m){

    try{

        log.debug('ROW', {
            sno: m.sno,
            milestone: m.milestone
        });

        var childRec = record.create({
            type:'customrecord_rw_project_plan_temp_child'
        });

        childRec.setValue({
            fieldId:'custrecord_rw_proj_plan_temp_child_link',
            value:id
        });

        childRec.setValue({
            fieldId:'custrecord_rw_proj_plan_temp_child_sno',
            value: parseInt(m.sno,10)
        });

        childRec.setValue({
            fieldId:'custrecord_rw_project_temp_child_miles',
            value: parseInt(m.milestone,10)
        });

        var childId = childRec.save({
            enableSourcing:true,
            ignoreMandatoryFields:false
        });

        log.debug('CHILD CREATED', childId);

    }catch(ex){

        log.error('CHILD ERROR', ex);
        throw ex;
    }
});
// var milestoneSearch = search.create({
//     type: 'customrecord_rw_project_mile_stone_types', // replace with your actual milestone master record
//     filters: [
//         ['isinactive','is','F']
//     ],
//     columns: [
//         'internalid'
//     ]
// });

// var sno = 1;
// var uniqueMilestones = {};

// milestoneSearch.run().each(function(result){

//     var milestoneId = result.getValue('internalid');

//     if(uniqueMilestones[milestoneId]){
//         return true;
//     }

//     uniqueMilestones[milestoneId] = true;

//     var childRec = record.create({
//         type:'customrecord_rw_project_plan_temp_child'
//     });

//     childRec.setValue({
//         fieldId:'custrecord_rw_proj_plan_temp_child_link',
//         value:id
//     });

//     childRec.setValue({
//         fieldId:'custrecord_rw_proj_plan_temp_child_sno',
//         value:sno
//     });

//     childRec.setValue({
//         fieldId:'custrecord_rw_project_temp_child_miles',
//         value:milestoneId
//     });

//     childRec.save();

//     sno++;

//     return true;
// });
            context.response.write(
                JSON.stringify({
                    success: true,
                    id: id
                })
            );

            return;
        }

    } catch(e){

        log.error(
            'CREATE PROJECT PLAN ERROR',
            e
        );

        context.response.write(
            JSON.stringify({
                success:false,
                message:e.message
            })
        );

        return;
    }
}
var empId = context.request.parameters.empid 
         || context.request.parameters.empId 
         || context.request.parameters.employeeId 
         || '';

var email = context.request.parameters.email;
    const detailUrl = url.resolveScript({
    scriptId: 'customscript3142',
    deploymentId: 'customdeploy1',
    returnExternalUrl: true
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
        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });
var rwOptions ='<option value="">--Select--</option>';
    var rwSearch=search.create({
    type:'customrecord_rw_extend_products',
    columns:['internalid','name']
})
rwSearch.run().each(function(result){
    rwOptions +='<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
})
var dpOptions = '<option value="">--Select--</option>';
var dpSearch = search.create({
    type: 'customrecord_rw_proj_rev_stream',
    columns: ['internalid','name']
});

dpSearch.run().each(function(result){
    dpOptions += '<option value="'+result.getValue('internalid')+'">'+result.getValue('name')+'</option>';
    return true;
});
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
var snoOptions = '';

var snoSearch = search.create({
    type: 'customlist_rw_serial_no', // your S.NO custom record
    filters: [
        ['isinactive','is','F']
    ],
    columns: [
        'internalid',
        'name'
    ]
});

snoSearch.run().each(function(r){

    snoOptions +=
        '<option value="' +
        r.getValue('internalid') +
        '">' +
        r.getValue('name') +
        '</option>';

    return true;
});
        var data = [];

        var extendProductSearch = search.create({

            type: 'customrecord_rw_extend_products',

            filters: [
                ['isinactive', 'is', 'F']
            ],

            columns: [

                'name',

                'custrecord_rw_ext_prod_rev_stream',

                'custrecord_rw_ext_proj_plan_template'
            ]
        });

        extendProductSearch.run().each(function(result){

            var templateId = result.getValue(
    'custrecord_rw_ext_proj_plan_template'
);

var childs = getTemplateChilds(templateId);

data.push({

    id: result.getValue('internalid'),

    productName: result.getValue('name'),

    revenueStream: result.getText(
        'custrecord_rw_ext_prod_rev_stream'
    ),

    revenueStreamId: result.getValue(
        'custrecord_rw_ext_prod_rev_stream'
    ),

    projectPlanTemplate: result.getText(
        'custrecord_rw_ext_proj_plan_template'
    ),

    projectPlanTemplateId: templateId,

    milestones: childs
});

            return true;
        });

        log.debug("PROJECT PLAN DATA", data);

       function getTemplateChilds(templateId){

    var arr = [];

    if(!templateId){
        return arr;
    }

    var childSearch = search.create({

        type: 'customrecord_rw_project_plan_temp_child',

        filters: [
            ['custrecord_rw_proj_plan_temp_child_link',
             'anyof',
             templateId]
        ],

        columns: [

            'custrecord_rw_proj_plan_temp_child_sno',

            'custrecord_rw_project_temp_child_miles'
        ]
    });

    childSearch.run().each(function(res){

        arr.push({

            sno: res.getText(
                'custrecord_rw_proj_plan_temp_child_sno'
            ) || '',

            milestone: res.getText(
                'custrecord_rw_project_temp_child_miles'
            ) || ''
        });

        return true;
    });

    return arr;
}

        var rows = '';

        if(data.length > 0){

        rows = data.map(function(d, index){

    return `

        <tr>

            <td style="border:1px solid #ddd">${index + 1}</td>

            <td class="clickable" onclick="openDetail(
    '${d.projectPlanTemplateId}',
    '${d.projectPlanTemplate}',
    '${d.productName}',
    '${d.revenueStream}'
)" style="border:1px solid #ddd">

                ${d.projectPlanTemplate || '-'}

            </td>

            <td style="border:1px solid #ddd">
                ${d.productName || '-'}
            </td>

            <td style="border:1px solid #ddd">
                ${d.revenueStream || '-'}
            </td>

        </tr>

    `;

}).join('');

        } else {

            rows = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        No Records Found
                    </td>
                </tr>
            `;
        }

        

        var html = `

        <style>

            body{
                font-family:Arial;
                
                margin:0;
                padding:20px;
                
            }

            // .container{
            //     background:white;
            //     border-radius:10px;
            //     padding:20px;
            //     box-shadow:0 4px 10px rgba(0,0,0,0.1);
            //     overflow:hidden;
            // }

            .title{
                font-size:22px;
                font-weight:bold;
                margin-bottom:20px;
                color:#8f50df;
            }

            table{
                width:100%;
                border-collapse:collapse;
            }

            th{
                background:#E6E6FA;
                color:darkblue;
                padding:12px;
                text-align:left;
                font-size:14px;
            }

            td{
                padding:10px;
                border-bottom:1px solid #ddd;
                font-size:13px;
            }

           

            .count-box{
                margin-bottom:15px;
                padding:10px 15px;
                    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
                color:white;
                display:inline-block;
                border-radius:8px;
                font-weight:bold;
            }

            .clickable{
    color:darkblue;
    font-weight:bold;
    cursor:pointer;
}

.clickable:hover{
    text-decoration:underline;
}

.modal{
    display:none;

    position:fixed;

    top:0;
    left:0;

    width:100%;
    height:100%;

    background:rgba(0,0,0,0.5);

    z-index:9999;

    overflow-y:auto;

    padding:20px;
}

.modal-content{
    background:white;

    width:80%;
    max-width:900px;

    margin:40px auto;

    border-radius:12px;

    max-height:85vh;

    overflow-y:auto;

    overflow-x:hidden;

    padding-bottom:20px;
}

.modal-header{
    background:
    background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;
    color:white;
    padding:15px;
    font-size:18px;
    font-weight:bold;
}

.modal-body{
    padding:20px;
}

.close-btn{
    float:right;
    cursor:pointer;
    font-size:20px;
}
    #main_form_div,
#custpage_html_fs,
#custpage_html_val{

    overflow:visible !important;
    height:auto !important;
    max-height:none !important;
}
/* HEADER ROW */

.header-row{

    width:100%;

    display:flex;
    margin-top:-30px;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;
}

/* TITLE */

.title{

    font-size:20px;

    font-weight:700;

    color:darkblue;

    margin:0;
    margin-top:10px;

    white-space:nowrap;
}

/* TOTAL COUNT */

.count-box{

    padding:10px 18px;

        background:linear-gradient(
    135deg,
    #002855 0%,
    #5b2d8e 50%,
    #8f50df 100%
);;

    color:white;
    margin-top:14px;
    border-radius:12px;

    font-size:14px;

    font-weight:700;

    display:flex;

    align-items:center;

    gap:10px;

    box-shadow:
        0 8px 18px rgba(168,85,247,0.22);
}
.card{

    overflow:visible !important;
}
    .new-plan-btn{
    background:linear-gradient(
        135deg,
        #002855 0%,
        #5b2d8e 50%,
        #8f50df 100%
    );
    color:white;
    border:none;
    padding:10px 18px;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
}

.create-modal{
    display:none;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.5);
    z-index:99999;
}

.create-modal-content{
    background:white;
    width:600px;
    margin:80px auto;
    border-radius:12px;
    overflow:hidden;
}

.create-modal-header{
    background:linear-gradient(
        135deg,
        #002855 0%,
        #5b2d8e 50%,
        #8f50df 100%
    );
    color:white;
    padding:15px;
    font-size:18px;
    font-weight:bold;
}

.create-modal-body{
    padding:20px;
}

.form-group{
    margin-bottom:15px;
}

.form-group label{
    display:block;
    font-weight:bold;
    margin-bottom:5px;
}

.form-group input,
.form-group select{
    width:100%;
    height:40px;
    padding:8px;
    border:1px solid #ccc;
    border-radius:6px;
}

.modal-footer{
    padding:15px;
    text-align:right;
}

.save-btn{
    background:#28a745;
    color:white;
    border:none;
    padding:10px 20px;
    border-radius:6px;
    cursor:pointer;
}

.cancel-btn{
    background:#dc3545;
    color:white;
    border:none;
    padding:10px 20px;
    border-radius:6px;
    cursor:pointer;
}
        </style>
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <div class="container">

            <div class="header-row">

    <div class="title">
        Project Plan Template
    </div>

    <div style="display:flex;gap:10px;align-items:center;">

       <button class="new-plan-btn" type="button"
        onclick="openCreatePlanModal()">
    <i class="fa fa-plus"></i>
    New Project Plan
</button>

        <div class="count-box">
            <i class="fa-solid fa-database"></i>
            Total Records : ${data.length}
        </div>

    </div>

</div>

            <table>

                <thead>

                    <tr>

                        <th style="border:1px solid #ddd">S.NO</th>
<th style="border:1px solid #ddd">Project Plan Template</th>
                        <th style="border:1px solid #ddd">Products/Services</th>
                        <th style="border:1px solid #ddd">Revenue Stream</th>

                        

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>
        <div class="modal" id="productModal">

    <div class="modal-content">

        <div class="modal-header">

            Product Details

            <span class="close-btn"
                  onclick="closeModal()">
                  ×
            </span>

        </div>

        <div class="modal-body">

            <p>
                <b>Product :</b>
                <span id="prodName"></span>
            </p>

            <p>
                <b>Revenue Stream :</b>
                <span id="revStream"></span>
            </p>

            <p>
                <b>Project Plan Template :</b>
                <span id="planTemplate"></span>
            </p>
<hr>

<h3>Project Milestones</h3>

<table id="mileTable"
       width="100%"
       border="1"
       cellpadding="6"
       style="border-collapse:collapse;">

    <thead>

        <tr style="background:linear-gradient(135deg, #8E2DE2, #C471ED);color:white;">

            <th>S.NO</th>

            <th>Milestone</th>

        </tr>

    </thead>

    <tbody id="mileBody">

    </tbody>

</table>
        </div>

    </div>

</div>
<div id="createPlanModal" class="create-modal">

    <div class="create-modal-content" style="width:850px;">

        <div class="create-modal-header">
            Create Project Plan

            <span
                style="float:right;cursor:pointer;"
                onclick="closeCreatePlanModal()">
                ×
            </span>
        </div>

        <div class="create-modal-body">

            <div class="form-group">
                <label>Project Plan Name</label>
                <input
                    type="text"
                    id="planName">
            </div>

            <div class="form-group">
                <label>Revenue Stream</label>
                <select id="revenueStream">
                    ${dpOptions}
                </select>
            </div>

            <hr>

            <h3>Project Milestones</h3>

            <button
                type="button"
                class="save-btn"
                onclick="addMilestoneRow()"
                style="margin-bottom:15px;">

                + Add Milestone

            </button>

            <table
                width="100%"
                border="1"
                style="border-collapse:collapse;">

                <thead>

                    <tr>
                        <th width="20%">S.No</th>
                        <th width="70%">Milestone</th>
                        <th width="10%">Action</th>
                    </tr>

                </thead>

                <tbody id="milestoneBody">

                </tbody>

            </table>

        </div>

        <div class="modal-footer">

            <button
                class="cancel-btn"
                onclick="closeCreatePlanModal()">

                Cancel

            </button>

            <button
                class="save-btn"
                onclick="saveProjectPlan()">

                Save

            </button>

        </div>

    </div>

</div>
<script>




function openDetail(
    templateId,
    templateName,
    product,
    revenue
){

    var detailUrl =
        '${detailUrl}' +

        '&templateid=' + templateId +

        '&templatename=' +
        encodeURIComponent(templateName) +

        '&product=' +
        encodeURIComponent(product) +

        '&revenue=' +
        encodeURIComponent(revenue);

    window.location.href = detailUrl;
}

function closeModal(){

    document.getElementById('productModal')
        .style.display = 'none';
}
        
function openProduct(data){

    document.getElementById('productModal')
        .style.display = 'block';

    document.getElementById('prodName')
        .innerText = data.productName || '';

    document.getElementById('revStream')
        .innerText = data.revenueStream || '';

    document.getElementById('planTemplate')
        .innerText = data.projectPlanTemplate || '';

    var rows = '';

    if(data.milestones &&
       data.milestones.length > 0){

        data.milestones.forEach(function(m){

            rows +=
                '<tr>' +
                    '<td>' + (m.sno || '') + '</td>' +
                    '<td>' + (m.milestone || '') + '</td>' +
                '</tr>';

        });

    }else{

        rows =
            '<tr>' +
                '<td colspan="2" style="text-align:center;">' +
                    'No Milestones' +
                '</td>' +
            '</tr>';
    }

    document.getElementById('mileBody')
        .innerHTML = rows;
}
    

function closeCreatePlanModal(){

    document.getElementById(
        'createPlanModal'
    ).style.display='none';
}

function saveProjectPlan(){

    var planName =
        document.getElementById(
            'planName'
        ).value;

    var revenue =
        document.getElementById(
            'revenueStream'
        ).value;

    var milestones = [];

    document
        .querySelectorAll(
            '#milestoneBody tr'
        )
        .forEach(function(row){

            milestones.push({

                sno:
                    row.querySelector(
                        '.snoSelect'
                    ).value,

                milestone:
                    row.querySelector(
                        '.mileSelect'
                    ).value
            });
        });

    fetch(
        window.location.href,
        {
            method:'POST',

            headers:{
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                action:
                    'createProjectPlan',

                planName:
                    planName,

                revenue:
                    revenue,

                milestones:
                    milestones
            })
        }
    )
    .then(r => r.text())
.then(function(res){

    console.log('SERVER RESPONSE', res);

    var data = JSON.parse(res);

    if(data.success){

        alert('Project Plan Created');

        location.reload();
    }else{

        alert(data.message);
    }
});
}
    function addMilestoneRow(){

    var row =

        '<tr>' +

            '<td>' +

                '<select class="snoSelect">' +

                    '${snoOptions}' +

                '</select>' +

            '</td>' +

            '<td>' +

                '<select class="mileSelect">' +

                    '${milestoneOptions}' +

                '</select>' +

            '</td>' +

            '<td style="text-align:center;">' +

                '<button type="button" ' +
                'onclick="removeMilestoneRow(this)" ' +
                'style="background:red;color:white;border:none;padding:5px 10px;border-radius:4px;">' +

                'X' +

                '</button>' +

            '</td>' +

        '</tr>';

    document
        .getElementById('milestoneBody')
        .insertAdjacentHTML(
            'beforeend',
            row
        );
}
        function removeMilestoneRow(btn){

    btn.parentNode.parentNode.remove();
}
    function openCreatePlanModal(){

    document.getElementById(
        'createPlanModal'
    ).style.display = 'block';

    document.getElementById(
        'milestoneBody'
    ).innerHTML = '';

    addMilestoneRow();
}
</script>
        `;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    };

    return {
        onRequest
    };
});