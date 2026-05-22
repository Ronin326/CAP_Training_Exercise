type EmployeeInfo {
    id: String;
    name: String;
    surname: String;
    email: String;
    department: String;
    division: String;
    businessUnit: String;
}

type ProfilePhoto{
    id: String;
    photoBinary: String;
}
 
@odata service EmployeeService {
    function employeeDetails() returns array of EmployeeInfo;

    function employeeDetail(employeeId: String) returns EmployeeInfo;

    function employeeProfilePhoto(employeeId: String) returns ProfilePhoto;
}