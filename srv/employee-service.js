const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = cds.service.impl(async (srv) => {
    srv.on('employeeDetails', async (req) => {
        try {
            const url = `/odata/v2/PerPersonal` +
                `?$select=personIdExternal,firstName,lastName` +
                `,personNav/emailNav/emailAddress` +
                `,personNav/employmentNav/jobInfoNav/businessUnit` +
                `,personNav/employmentNav/jobInfoNav/department` +
                `,personNav/employmentNav/jobInfoNav/division` +
                `&$expand=personNav/emailNav,personNav/employmentNav/jobInfoNav`;

            const response = await executeHttpRequest(
                {
                    destinationName: process.env.SF_DESTINATION
                },
                {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const enrichedEmployees = response.data.d.results.map(emp => {
                const person = emp.personNav || {};
                const email = person.emailNav?.results?.[0] || {};
                const employment = person.employmentNav?.results?.[0] || {};
                const job = employment.jobInfoNav?.results?.[0] || {};

                return {
                    id: emp.personIdExternal,
                    name: emp.firstName,
                    surname: emp.lastName,
                    email: email.emailAddress || 'N/A',
                    department: job.department || 'N/A',
                    division: job.division || 'N/A',
                    businessUnit: job.businessUnit || 'N/A'
                };
            });

            return enrichedEmployees;
        } catch (error) {
            console.error('Error fetching employee details:', error.message);
            throw new Error(`Failed to fetch employee details: ${error.message}`);
        }
    });

    srv.on('employeeDetail', async (req) => {
        const { employeeId } = req.data;
        try {
            const url = `/odata/v2/PerPersonal` +
                `?$select=personIdExternal,firstName,lastName` +
                `,personNav/emailNav/emailAddress` +
                `,personNav/employmentNav/jobInfoNav/businessUnit` +
                `,personNav/employmentNav/jobInfoNav/department` +
                `,personNav/employmentNav/jobInfoNav/division` +
                `&$expand=personNav/emailNav,personNav/employmentNav/jobInfoNav` +
                `&$filter=personIdExternal eq '${employeeId}'`;

            const response = await executeHttpRequest(
                {
                    destinationName: process.env.SF_DESTINATION
                },
                {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const emp = response.data.d.results[0];
            if (!emp) {
                return { error: `Employee with ID ${employeeId} not found` };
            }

            const person = emp.personNav || {};
            const email = person.emailNav?.results?.[0] || {};
            const employment = person.employmentNav?.results?.[0] || {};
            const job = employment.jobInfoNav?.results?.[0] || {};

            return {
                id: emp.personIdExternal,
                name: emp.firstName,
                surname: emp.lastName,
                email: email.emailAddress || 'N/A',
                department: job.department || 'N/A',
                division: job.division || 'N/A',
                businessUnit: job.businessUnit || 'N/A'
            };
        } catch (error) {
            console.error(`Error fetching details for employee ID ${employeeId}:`, error.message);
            throw new Error(`Failed to fetch details for employee ID ${employeeId}: ${error.message}`);
        }
    });
});