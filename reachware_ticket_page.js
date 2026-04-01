/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/ui/serverWidget','N/record','N/search','N/url'], 
(serverWidget, record, search, url) => {

const onRequest = (context) => {

    // ===================== GET =====================
    if (context.request.method === 'GET') {

        var form = serverWidget.createForm({ title: ' ' });

        var htmlField = form.addField({
            id: 'custpage_html',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'HTML'
        });

        // 🔹 Load projects for dropdown
        var options = `<option value="">Select Project</option>`;

        var projectSearch = search.create({
            type: 'customrecord_rw_portal_access',
            columns: ['internalid','custrecord_rw_portal_customername']
        });

        projectSearch.run().each(function(res){
            options += `<option value="${res.getValue('internalid')}">
                        ${res.getValue('custrecord_rw_portal_customername')}
                        </option>`;
            return true;
        });

        htmlField.defaultValue = `

<style>
body {
    font-family: Arial;
    background:white;
}

.container {
    width: 500px;
    margin: 40px auto;
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h2 {
    text-align:center;
    margin-bottom:20px;
}

.field {
    margin-bottom:15px;
}

label {
    display:block;
    margin-bottom:5px;
    font-weight:bold;
}

input, select, textarea {
    width:100%;
    padding:10px;
    border:1px solid #ccc;
    border-radius:5px;
    font-size:14px;
}

textarea {
    resize:none;
    height:100px;
}

.row {
    display:flex;
    gap:10px;
}

.row .field {
    flex:1;
}

button {
    width:100%;
    padding:12px;
    background:#6b3fa0;
    color:white;
    border:none;
    border-radius:5px;
    font-size:16px;
    cursor:pointer;
}

button:hover {
    background:#5a2e8a;
}
</style>

<div class="container">

<h2>Create Ticket</h2>

<form onsubmit="return false;">

    <!-- Project -->
    <div class="field">
        <label>Project</label>
        <select>
            <option>Select Project</option>
        </select>
    </div>

    <!-- Product -->
    <div class="field">
        <label>RW Product</label>
        <input type="text" placeholder="Enter product name">
    </div>

    <!-- Status + Priority -->
    <div class="row">
        <div class="field">
            <label>Status</label>
            <select>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
            </select>
        </div>

        <div class="field">
            <label>Priority</label>
            <select>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
        </div>
    </div>

    <!-- Assigned To -->
    <div class="field">
        <label>Assign To</label>
        <input type="text" placeholder="Enter employee name">
    </div>

    <!-- Comments -->
    <div class="field">
        <label>Comments</label>
        <textarea placeholder="Describe the issue..."></textarea>
    </div>

    <!-- Button -->
    <button>Create Ticket</button>

</form>

</div>
`;

        context.response.writePage(form);
    }

    // ===================== POST =====================
    else {

        var req = context.request;

        var project = req.parameters.project;
        var product = req.parameters.product;
        var comments = req.parameters.comments;
        var status = req.parameters.status;

        var rec = record.create({
            type: 'customrecord_rw_portal_access2',
            isDynamic: true
        });

        rec.setValue({ fieldId: 'custrecord1513', value: project });
        rec.setValue({ fieldId: 'custrecord_rw_portal_rwproduct', value: product });
        rec.setValue({ fieldId: 'custrecord_rw_portal_additionalcomments', value: comments });
        rec.setValue({ fieldId: 'custrecord_rw_portal_status', value: status });

        var id = rec.save();

        // redirect back
        var redirectUrl = url.resolveScript({
scriptId: 'customscript2876',
deploymentId: 'customdeploy5',
returnExternalUrl: true
});

        context.response.write(`
        <html>
        <script>
            alert("Ticket Created Successfully (ID: ${id})");
            window.location.href = "${redirectUrl}";
        </script>
        </html>
        `);
    }
};

return { onRequest };

});