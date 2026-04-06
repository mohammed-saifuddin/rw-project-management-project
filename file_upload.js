/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/file'], (file) => {

    const onRequest = (context) => {

        if (context.request.method === 'POST') {

            try {
                var fileObj = context.request.files.file;
                var fileId = null;

                if (fileObj) {
                    fileObj.folder = -15; 
                    fileId = fileObj.save();
                }

                context.response.setHeader({
                    name: 'Content-Type',
                    value: 'application/json'
                });

                context.response.write(JSON.stringify({
                    fileId: fileId
                }));

            } catch (e) {

                log.error("Upload Error", e);

                context.response.setHeader({
                    name: 'Content-Type',
                    value: 'application/json'
                });

                context.response.write(JSON.stringify({
                    error: e.message
                }));
            }
        }
    };

    return { onRequest };
});