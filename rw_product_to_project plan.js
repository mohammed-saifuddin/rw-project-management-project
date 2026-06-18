/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
    'N/ui/serverWidget','N/record','N/search'
], (serverWidget,record,search) => {

   const onRequest = (context) => {

    if(context.request.method === 'POST'){

    var params = context.request.parameters;

    log.debug('PARAMS', params);
log.debug('ACTION', params.action);
log.debug('PRODNAME', params.prodname);
log.debug('REVENUE', params.revenueid);
log.debug('TEMPLATE', params.templateid);
    if(params.action === 'saveProduct'){

        var rec = record.create({
            type:'customrecord_rw_extend_products'
        });

        rec.setValue({
            fieldId:'name',
            value:params.prodname
        });

        rec.setValue({
            fieldId:'custrecord_rw_ext_prod_rev_stream',
            value:params.revenueid
        });
// var templateText = '';

// search.create({
//     type:'customrecord_rw_project_plan_template',
//     filters:[
//         ['internalid','anyof',params.templateid]
//     ],
//     columns:['name']
// })
// .run()
// .each(function(r){
//     templateText = r.getValue('name');
//     return false;
// });

// log.debug('Template Text', templateText);

// rec.setText({
//     fieldId:'custrecord_rw_ext_proj_plan_template',
//     text:templateText
// });

log.debug('Template ID', params.templateid);
var fieldObj = rec.getField({
    fieldId:'custrecord_rw_ext_proj_plan_template'
});

log.debug('FIELD TYPE', fieldObj.type);
log.debug('field is ',fieldObj)
var lookup = search.lookupFields({
    type:'customrecord_rw_project_plan_template',
    id:30,
    columns:['name']
});

log.debug('LOOKUP RESULT', lookup);
rec.setValue({
    fieldId:'custrecord_rw_ext_proj_plan_template',
    value: parseInt(params.templateid, 10)
});
        // rec.setValue({
        //     fieldId:'custrecord_rw_ext_proj_plan_template',
        //     value:params.templateid
        // });

        var id = rec.save();

        

        return;
    }
}
    // GET code below
        var form = serverWidget.createForm({
            title: ' '
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

        var html = `
<style>

body{
    font-family:Arial,sans-serif;
    background:#f5f6fa;
    margin:0;
    padding:20px;
}

.card{
    width:700px;
    margin:auto;
    background:white;
    border-radius:12px;
    box-shadow:0 4px 15px rgba(0,0,0,.1);
    overflow:hidden;
}

.card-header{
    padding:15px 20px;
    color:white;
    font-size:20px;
    font-weight:bold;

    background:linear-gradient(
        135deg,
        #002855,
        #5b2d8e,
        #8f50df
    );
}

.card-body{
    padding:25px;
}

.form-group{
    margin-bottom:18px;
}

.form-group label{
    display:block;
    margin-bottom:6px;
    font-weight:bold;
    color:#333;
}

.form-group input,
.form-group select{
    width:100%;
    height:42px;
    border:1px solid #ccc;
    border-radius:8px;
    padding:0 10px;
    font-size:14px;
}

.checkbox-row{
    display:flex;
    align-items:center;
    gap:10px;
}

.checkbox-row input{
    width:18px;
    height:18px;
}

.footer{
    text-align:right;
    padding:20px;
    border-top:1px solid #eee;
}

.save-btn{
    border:none;
    color:white;
    cursor:pointer;
    padding:10px 25px;
    border-radius:8px;
    font-weight:bold;

    background:linear-gradient(
        135deg,
        #002855,
        #5b2d8e,
        #8f50df
    );
}

.save-btn:hover{
    opacity:.9;
}
</style>
<input type="hidden" id="action" name="action">
<input type="hidden" id="prodname" name="prodname">
<input type="hidden" id="revenueid" name="revenueid">
<input type="hidden" id="templateid" name="templateid">
<div class="card">

    <div class="card-header">
        RW Extend Products
    </div>

    <div class="card-body">

        <div class="form-group">
            <label>Product Name</label>

            <input
                type="text"
                id="productName"
                placeholder="Enter Product Name">
        </div>

        <div class="form-group">
            <label>Revenue Stream</label>

            <select id="revenueStream">
                ${revenueOptions}
            </select>
        </div>

        <div class="form-group">
            <label>Project Plan Template</label>

            <select id="projectTemplate">
                ${templateOptions}
            </select>
        </div>

       

    </div>

    <div class="footer">

        <button
            class="save-btn"
            type="button"
            onclick="saveProduct();">

            Save

        </button>

    </div>

</div>

<script>

function saveProduct(){

    document.getElementById('action').value = 'saveProduct';
    document.getElementById('prodname').value =
        document.getElementById('productName').value;

    document.getElementById('revenueid').value =
        document.getElementById('revenueStream').value;

    document.getElementById('templateid').value =
        document.getElementById('projectTemplate').value;
console.log(
    document.getElementById('revenueStream').value
);

console.log(
    document.getElementById('projectTemplate').value
);
    document.forms[0].submit();
}

</script>
`;

        htmlField.defaultValue = html;

        context.response.writePage(form);
    };

    return {
        onRequest: onRequest
    };

});