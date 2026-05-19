const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = cds.service.impl(async (srv) => {
    srv.on('employeeDetails', async (req) => {
        try {
            // Fetch PerPersonal with expanded EmpJob and PerEmail related entities
            const response = await executeHttpRequest(
                {
                    destinationName: process.env.SF_DESTINATION
                },
                {
                    method: 'GET',
                    url: `/odata/v2/PerPersonal?$select=personIdExternal,firstName,lastName`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Transform expanded data
            const enrichedEmployees = response.data.d.results.map(emp => {
                return {
                    id: emp.personIdExternal,
                    name: emp.firstName,
                    surname: emp.lastName,
                    email: 'N/A',
                    department: 'N/A',
                    division: 'N/A',
                    businessUnit: 'N/A'
                };
            });

            return enrichedEmployees;
        } catch (error) {
            console.error('Error fetching employee details:', error.message);
            throw new Error(`Failed to fetch employee details: ${error.message}`);
        }
    });
});