/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define([
    'N/ui/serverWidget',
    'N/search',
    'N/runtime',
    'N/url'
], (serverWidget, search, runtime,url) => {

    const onRequest = (context) => {

        var request = context.request;

        var form = serverWidget.createForm({
            title: ' '
        });
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
                background:
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
                color:white;
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
                background:linear-gradient(135deg, #8E2DE2, #C471ED);
                color:white;
                display:inline-block;
                border-radius:8px;
                font-weight:bold;
            }

            .clickable{
    color:#8f50df;
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
linear-gradient(
    135deg,
    #8E2DE2,
    #C471ED
);
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

    color:#8f50df;

    margin:0;
    margin-top:10px;

    white-space:nowrap;
}

/* TOTAL COUNT */

.count-box{

    padding:10px 18px;

    background:
    linear-gradient(
        135deg,
        #8E2DE2,
        #C471ED
    );

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
        </style>
<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <div class="container">

            <div class="header-row">

    <div class="title">
        Project Plan Template
    </div>

    <div class="count-box">
        <i class="fa-solid fa-database"></i>
        Total Records : ${data.length}
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
</script>
        `;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    };

    return {
        onRequest
    };
});