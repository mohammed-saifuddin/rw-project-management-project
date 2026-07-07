

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/record', 'N/search','N/url','N/runtime'],
(serverWidget, record, search,url,runtime) => {

    function onRequest(context) {

     var request = context.request;

    if (context.request.method === "POST") {

    const action = context.request.parameters.action;

    if (action === "create") {

        var duplicateSearch = search.create({

    type:"customrecord_rw_proj_rev_stream",

    filters:[
        ["name","is",request.parameters.name]
    ],

    columns:["internalid"]

});

var exists = duplicateSearch.run().getRange({
    start:0,
    end:1
});

if(exists.length){

    context.response.write("exists");
    return;

}
var rec = record.create({
    type: "customrecord_rw_proj_rev_stream"
});

        rec.setValue({
            fieldId: "name",
            value: context.request.parameters.name
        });

        var id = rec.save();

        context.response.setHeader({
            name: "Content-Type",
            value: "application/json"
        });

       var suiteletUrl = url.resolveScript({
    scriptId: runtime.getCurrentScript().id,
    deploymentId: runtime.getCurrentScript().deploymentId,
    params: {
        empid: request.parameters.empid,
        email: request.parameters.email
    }
});

context.response.write('success');

        return;
    }
    if (action === "delete") {

    record.delete({
        type: "customrecord_rw_proj_rev_stream",
        id: request.parameters.id
    });

    context.response.write("deleted");
    return;
}
}


        if (context.request.method === 'GET') {

            const form = serverWidget.createForm({
                title: ' '
            });

            const html = form.addField({
                id: 'custpage_html',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'HTML'
            });
let tableRows = '';

const revenueSearch = search.create({
    type: 'customrecord_rw_proj_rev_stream',
    columns: [
    'internalid',
    search.createColumn({
        name: 'name',
        sort: search.Sort.ASC
    })
]
});

let sno = 1;

revenueSearch.run().each(function(result){

    const id = result.getValue('internalid');

    tableRows += `
        <tr id="row_${id}">
            <td style="border:1px solid #ddd;text-align:center;">${sno++}</td>
            <td style="border:1px solid #ddd;">${result.getValue('name')}</td>
            <td style="border:1px solid #ddd;text-align:center;">
                <button
                    type="button"
                    class="deleteBtn"
                    onclick="deleteRevenue(${id})">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `;

    return true;
});
   html.defaultValue = `


<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<style>

body{
    font-family:Arial,Helvetica,sans-serif;
    background:#f5f7fb;
}

.toolbar{
    display:flex;
    justify-content:flex-end;
    margin-bottom:20px;
}

.add-btn{
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

.add-btn:hover{
    background:#6d28d9;
    transform:scale(1.08);
}

table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
    
    overflow:hidden;
}

th{
       background:linear-gradient(
    135deg,
    #E6E6FA,
    #E6E6FA
);;
    color:darkblue;
    padding:12px;
    font-size:14px;
    text-align:left;
}

td{
    padding:10px;
    font-size:14px;
    border-bottom:1px solid #eee;
}

tr:hover{
    background:#faf5ff;
}

/* Modal */

.modal{
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    z-index:9999;
}

.modal-content{

    width:420px;
    background:#fff;
    border-radius:12px;
    margin:8% auto;
    padding:25px;
    box-shadow:0 20px 50px rgba(0,0,0,.25);
    animation:popup .25s;
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

.modal-header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;

}

.modal-header h2{

margin:0;
font-size:20px;

}

.close{

font-size:24px;
cursor:pointer;
color:#888;

}

.close:hover{

color:red;

}

.form-group{

margin-bottom:18px;

}

label{

display:block;
font-weight:bold;
margin-bottom:8px;

}

input{

width:100%;
padding:11px;
border:1px solid #ccc;
border-radius:6px;
font-size:14px;
box-sizing:border-box;

}

.footer{

display:flex;
justify-content:flex-end;
gap:10px;

}

.cancel{

background:#ddd;
border:none;
padding:10px 18px;
border-radius:6px;
cursor:pointer;

}

.save{

background:#5b21b6;
color:#fff;
border:none;
padding:10px 22px;
border-radius:6px;
cursor:pointer;

}

.save:hover{

background:#6d28d9;

}
.deleteBtn{
    background:#ef4444;
    color:#fff;
    border:none;
    border-radius:5px;
    padding:7px 10px;
    cursor:pointer;
}

.deleteBtn:hover{
    background:#dc2626;
}
.heading{
display:flex;
justify-content:center;
align-item:center;
font-weight:bold;
font-size:24px;
font-family:calibri;
}
</style>


<div class="heading">New Revenue Stream</div>
<div class="toolbar">

<button class="add-btn" type="button" onclick="openModal()">
<i class="fa-solid fa-plus"></i>
</button>

</div>

<table>

<thead>

<tr>


<th style="border:1px solid #ddd;">S.NO</th>
<th style="border:1px solid #ddd;">Revenue Stream</th>
<th style="border:1px solid #ddd;">Action</th>
</tr>

</thead>

<tbody>

${tableRows}

</tbody>

</table>

<!-- Modal -->

<div class="modal" id="modal">

<div class="modal-content">

<div class="modal-header">

<h2>Create Revenue Stream</h2>

<span class="close" onclick="closeModal()">&times;</span>

</div>

<div class="form-group">

<label>Revenue Stream Name</label>

<input
type="text"
id="name"
placeholder="Enter Revenue Stream">

</div>

<div class="footer">

<button class="cancel" type="button"
onclick="closeModal()">

Cancel

</button>

<button
class="save"
type="button"
onclick="saveRecord()">

Create

</button>

</div>

</div>

</div>
<div id="customDialog" style="
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.45);
z-index:999999;
align-items:center;
justify-content:center;">

    <div style="
    width:380px;
    background:#fff;
    border-radius:12px;
    padding:25px;
    text-align:center;
    box-shadow:0 15px 40px rgba(0,0,0,.25);">

        <div id="dialogIcon" style="font-size:55px;color:#22c55e;">
            <i class="fa fa-circle-check"></i>
        </div>

        <h2 id="dialogTitle" style="margin:15px 0 10px;">
            Success
        </h2>

        <div id="dialogMessage" style="font-size:15px;margin-bottom:25px;">
        </div>

        <button id="dialogCancel"
                style="display:none;">
            Cancel
        </button>

        <button id="dialogOk" type="button"
                style="
                background:#5b21b6;
                color:#fff;
                border:none;
                padding:10px 25px;
                border-radius:6px;
                cursor:pointer;">
            OK
        </button>

    </div>

</div>
<script>

function openModal(){

document.getElementById("modal").style.display="block";

}

function closeModal(){

document.getElementById("modal").style.display="none";

document.getElementById("name").value="";

}

window.onclick=function(e){

if(e.target==document.getElementById("modal")){

closeModal();

}

}
function showDialog(title, message, callback){

    document.getElementById("dialogTitle").innerHTML = title;
    document.getElementById("dialogMessage").innerHTML = message;

    document.getElementById("customDialog").style.display = "flex";

    document.getElementById("dialogCancel").style.display = "none";

    document.getElementById("dialogOk").onclick = function(){

        document.getElementById("customDialog").style.display = "none";

        if(callback){
            callback();
        }
    };
}
   
function addRevenueRow(name) {

   location.reload();
}
function saveRecord() {

    const name = document.getElementById("name").value.trim();

    if (!name) {
        alert("Please enter Revenue Stream Name");
        return;
    }

    fetch(window.location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "action=create&name=" + encodeURIComponent(name)
    })

    .then(response => response.text())

    .then(text => {

        console.log(text);
if(text==="exists"){

    showDialog(
        "Already Exists",
        "Revenue Stream already exists."
    );

    return;

}

        if (text === "success") {

            closeModal();

            showDialog(
                "Success",
                "Revenue Stream created successfully.",
                function () {

                    addRevenueRow(name);

                }
            );

        } else {

            alert("Unexpected response: " + text);

        }

    })

    .catch(function(err) {

        console.error(err);
        alert(err);

    });

}
    function deleteRevenue(id){

    showDialog(
        "Confirmation",
        "Are you sure you want to delete this Revenue Stream?",
        function(){

            fetch(window.location.href,{
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                body:"action=delete&id="+id
            })
            .then(res=>res.text())
            .then(function(text){

                if(text==="deleted"){

                    document.getElementById("row_"+id).remove();

                }

            });

        }
    );

}
</script>


`;
            context.response.writePage(form);

        } 
    }

    return { onRequest };

});