export interface TeamAdd {
    id: number;
    userName: string;
    password: string;
    designationIds: number[];
    email: string;
    name: string;
    employeeId: number;
    address: string;
    bloodgroup: string;
    mobileNumber: number;
    alternateMobileNumber: number;
}

export interface ITeam extends TeamAdd {
    designationNames: string[];
}
