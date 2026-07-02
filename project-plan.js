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
    var creatorEmpId =
    body.empId ||
    context.request.parameters.empid ||
    '';
    
log.debug('CREATOR EMP ID', creatorEmpId);

}catch(e){

    log.error(
        'INVALID JSON',
        context.request.body
    );

    body = context.request.parameters || {};
    var params = context.request.parameters || {};
}

        if (body.action === 'createProjectPlan') {
var duplicatePlan = search.create({
    type: 'customrecord_rw_project_plan_template',
    filters: [
        ['name', 'is', body.planName],
        'AND',
        ['isinactive', 'is', 'F']
    ],
    columns: ['internalid']
});

var exists = false;

duplicatePlan.run().each(function () {
    exists = true;
    return false;
});

if (exists) {

    context.response.write(JSON.stringify({
        success: false,
        duplicate: true,
        message: 'Project Plan already exists.'
    }));

    return;
}
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

       createNotification(
    creatorEmpId,
    'New Project Plan Created : ' + body.planName,
    'PROJECT_PLAN_CREATED',
    id
);
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


            context.response.write(
                JSON.stringify({
                    success: true,
                    id: id
                })
            );

            return;
        }
   if(body.action === 'createProduct'){

    try{
var duplicateProduct = search.create({
    type: 'customrecord_rw_extend_products',
    filters: [
        ['name', 'is', body.productName],
        'AND',
        ['isinactive', 'is', 'F']
    ],
    columns: ['internalid']
});

var exists = false;

duplicateProduct.run().each(function () {
    exists = true;
    return false;
});

if (exists) {

    context.response.write(JSON.stringify({
        success: false,
        duplicate: true,
        message: 'Product already exists.'
    }));

    return;
}
        var productRec = record.create({
            type:'customrecord_rw_extend_products'
        });

        productRec.setValue({
            fieldId:'name',
            value:body.productName
        });

        if(body.revenue){
            productRec.setValue({
                fieldId:'custrecord_rw_ext_prod_rev_stream',
                value:Number(body.revenue)
            });
            
        }

      if(body.template){

    productRec.setValue({
    fieldId:'custrecord_rw_ext_proj_plan_template',
    value: parseInt(body.template, 10)
});


 }
        var productId = productRec.save();
createNotification(
    creatorEmpId,
    'New Product Created : ' + body.productName,
    'PRODUCT_CREATED',
    productId
);
        context.response.write(
            JSON.stringify({
                success:true,
                id:productId
            })
        );

    }catch(e){

        log.error('PRODUCT ERROR', e);

        context.response.write(
            JSON.stringify({
                success:false,
                message:e.message,
                stack:e.stack
            })
        );
    }

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

    if(body.action === 'getTemplates'){

    var templates = [];

    search.create({
        type:'customrecord_rw_project_plan_template',
        filters:[
            ['isinactive','is','F'],
            'and',
            ['custrecord_rw_project_plan_rev_stream','anyof',body.revenue]
        ],
        columns:[
            'internalid',
            'name'
        ]
    })
    .run()
    .each(function(r){

        templates.push({
            id:r.getValue('internalid'),
            name:r.getValue('name')
        });

        return true;
    });

    context.response.write(
        JSON.stringify({
            success:true,
            templates:templates
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
var suiteletUrl = url.resolveScript({
    scriptId: runtime.getCurrentScript().id,
    deploymentId: runtime.getCurrentScript().deploymentId,
    returnExternalUrl: false
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
        var revenueOptions =
    '<option value="">--Select--</option>';

search.create({
    type:'customrecord_rw_proj_rev_stream',
    filters:[
        ['isinactive','is','F']
    ],
    columns:['internalid','name']
})
.run()
.each(function(r){

   revenueOptions +=
'<option value="' +
r.getValue({name:'internalid'}) +
'">' +
r.getValue({name:'name'}) +
'</option>';

    return true;
});
var templateOptions =
    '<option value="">--Select--</option>';

search.create({
    type:'customrecord_rw_project_plan_template',
    filters:[
        ['isinactive','is','F']
    ],
    columns:[
        search.createColumn({name:'internalid'}),
        search.createColumn({name:'name'})
    ]
})
.run()
.each(function(r){

    log.debug({
        title:'TEMPLATE OPTION',
        details:{
            id:r.getValue('internalid'),
            name:r.getValue('name')
        }
    });

    templateOptions +=
        '<option value="' +
        r.getValue('internalid') +
        '">' +
        r.getValue('name') +
        '</option>';

    return true;
});
function createNotification(empId, message, type, refId){

    if(!empId) return;

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
    height:100vh;
    background:rgba(0,0,0,0.5);
    z-index:99999;

    overflow-y:auto;
    padding:20px 0;
}

.create-modal-content{
    background:white;
    width:850px;
    max-width:95%;
    margin:20px auto;
    border-radius:12px;

    max-height:90vh;
    overflow-y:auto;
    overflow-x:hidden;
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
.create-modal-body{
    padding:20px;
    max-height:70vh;
    overflow-y:auto;
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
    .success-overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    display:none;
    justify-content:center;
    align-items:center;
    z-index:999999;
}

.success-dialog{
    width:420px;
    background:#fff;
    border-radius:18px;
    text-align:center;
    padding:35px;
    box-shadow:0 20px 50px rgba(0,0,0,.25);
    animation:popup .25s ease;
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

.success-icon{
    width:90px;
    height:90px;
    border-radius:50%;
    background:#22c55e;
    color:#fff;
    font-size:55px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0 auto 20px;
}

.success-dialog h2{
    margin:0;
    font-size:26px;
    color:#111827;
}

.success-dialog p{
    margin:18px 0 28px;
    color:#6b7280;
    font-size:15px;
}

.success-btn{
    background:linear-gradient(135deg,#002855,#5b2d8e,#8f50df);
    color:#fff;
    border:none;
    padding:12px 30px;
    border-radius:8px;
    cursor:pointer;
    font-size:15px;
}
 
   html,
body,
#main_form,
#main_form_div,
#div__body,
.uir-page,
.uir-page-body,
#custpage_html_fs,
#custpage_html_val{
    scrollbar-width:none !important;      /* Firefox */
    -ms-overflow-style:none !important;   /* IE/Edge */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar,
#main_form::-webkit-scrollbar,
#main_form_div::-webkit-scrollbar,
#div__body::-webkit-scrollbar,
.uir-page::-webkit-scrollbar,
.uir-page-body::-webkit-scrollbar,
#custpage_html_fs::-webkit-scrollbar,
#custpage_html_val::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
    display:none !important;
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
<button class="new-plan-btn"
        type="button"
        onclick="openCreateProductModal()">

    <i class="fa fa-plus"></i>
    New Product

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
                style="margin-bottom:15px;font-size:14px;">

                + 

            </button>

            <table
                width="100%"
                border="1"
                style="border-collapse:collapse;">

                <thead>

                    <tr>
                        <th width="30%">S.No</th>
                        <th width="60%">Milestone</th>
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
<div id="createProductModal" class="create-modal">

    <div class="create-modal-content" style="width:700px;">

        <div class="create-modal-header">

            Create Product

            <span
                style="float:right;cursor:pointer;"
                onclick="closeCreateProductModal()">
                ×
            </span>

        </div>

        <div class="create-modal-body">

            <div class="form-group">

                <label>Product Name</label>

                <input
                    type="text"
                    id="productName">

            </div>

            <div class="form-group">

                <label>Revenue Stream</label>

                <select id="productRevenue"
        onchange="loadTemplatesByRevenue()">

                    ${dpOptions}

                </select>

            </div>

            <div class="form-group">

                <label>Project Plan Template</label>

                <select id="productTemplate">

    <option value="">
        --Select Revenue Stream First--
    </option>

</select>

            </div>

        </div>

        <div class="modal-footer">

            <button
                class="cancel-btn"
                onclick="closeCreateProductModal()">

                Cancel

            </button>

            <button
                class="save-btn"
                onclick="saveProduct()">

                Save

            </button>

        </div>

    </div>

</div>
<div id="successDialog" class="success-overlay" style="display:none;">
    <div class="success-dialog">

        <div class="success-icon">
            ✔
        </div>

        <h2 id="successTitle">Success</h2>

        <p id="successMessage">
            Operation completed successfully.
        </p>

        <button class="success-btn" type="button" onclick="closeSuccessDialog()">
            OK
        </button>

    </div>
</div>
<script>
var empId = '${empId}';
var suiteletUrl = '${suiteletUrl}';
var reloadAfterDialog = false;

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
                    milestones,
                    empId:empId
            })
        }
    )
    .then(r => r.text())
.then(function(res){

    console.log('SERVER RESPONSE', res);

    var data = JSON.parse(res);

    if(data.success){
 localStorage.setItem(
        'notification_refresh',
        Date.now()
    );
   showSuccessDialog(
    'Project Plan Created',
    'The project plan has been created successfully.',
    'success',
    true
);
location.reload();

    }else{

     showSuccessDialog(
    'Duplicate Project Plan',
    data.message,
    'warning',
    false
);
location.reload();
    }
});
}
    function addMilestoneRow(){

    var row =

        '<tr>' +

            '<td>' +

                '<select class="snoSelect" style="width:100%;">' +

                    '${snoOptions}' +

                '</select>' +

            '</td>' +

            '<td>' +

                '<select class="mileSelect" style="width:100%;">' +

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
   function saveProduct(){

    var productName =
        document.getElementById('productName').value;

    var revenue =
        document.getElementById('productRevenue').value;

    var template =
        document.getElementById('productTemplate').value;

    fetch(window.location.href,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            action:'createProduct',
            productName:productName,
            revenue:revenue,
            template:template,
            empId:empId
        })
    })
    .then(function(response){

        return response.text();

    })
    .then(function(text){

        console.log('SERVER RESPONSE', text);

        try{

            var data = JSON.parse(text);

            if(data.success){
  localStorage.setItem(
        'notification-refresh',
        Date.now()
    );
        showSuccessDialog(
    'Product Created',
    'The product has been created successfully.',
    'success',
    true
);
location.reload();
                

            }else{

      showSuccessDialog(
    'Duplicate Product',
    data.message,
    'warning',
    false
);
location.reload();
            }

        }catch(e){

            console.log('NON JSON RESPONSE');
            console.log(text);

            alert('Server returned HTML instead of JSON. Check Suitelet logs.');
        }

    })
    .catch(function(err){

        console.log(err);
        alert(err);

    });
}
    function openCreateProductModal(){

    document.getElementById(
        'createProductModal'
    ).style.display = 'block';
}

function closeCreateProductModal(){

    document.getElementById(
        'createProductModal'
    ).style.display = 'none';
}
    function loadTemplatesByRevenue(){

    var revenue =
        document.getElementById(
            'productRevenue'
        ).value;

    fetch(window.location.href,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            action:'getTemplates',
            revenue:revenue
        })
    })
    .then(r => r.json())
    .then(function(data){

        var html =
            '<option value="">--Select--</option>';

        data.templates.forEach(function(t){

            html +=
                '<option value="' +
                t.id +
                '">' +
                t.name +
                '</option>';
        });

        document.getElementById(
            'productTemplate'
        ).innerHTML = html;
    });
}
   function showSuccessDialog(title, message, type, reload){

    reloadAfterDialog = reload || false;

    document.getElementById('successTitle').innerHTML = title;
    document.getElementById('successMessage').innerHTML = message;

    var icon = document.querySelector('.success-icon');

    if(type === 'success'){
        icon.innerHTML = '✔';
        icon.style.background = '#22c55e';
    }
    else if(type === 'warning'){
        icon.innerHTML = '⚠';
        icon.style.background = '#f59e0b';
    }
    else{
        icon.innerHTML = '✖';
        icon.style.background = '#ef4444';
    }

    document.getElementById('successDialog').style.display = 'flex';
}

function closeSuccessDialog(){

    document.getElementById('successDialog').style.display = 'none';

    if(reloadAfterDialog){
        location.reload();
    }
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