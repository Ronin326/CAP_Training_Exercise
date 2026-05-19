type EmployeeInfo {
    id: String;
    name: String;
    surname: String;
    email: String;
    department: String;
    division: String;
    businessUnit: String;
}
 
@odata service EmployeeService {
    function employeeDetails() returns array of EmployeeInfo;

}