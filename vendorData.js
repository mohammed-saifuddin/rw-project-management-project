/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

define(['N/search'], (search) => {

    function get() {

        const results = [];

        const vendorSearch = search.create({
            type: search.Type.VENDOR,
            columns: ['entityid']
        });

        vendorSearch.run().each(result => {
            results.push({
                id: result.id,
                name: result.getValue('entityid')
            });
            return true;
        });

        return results;
    }

    return {
        get
    };
});