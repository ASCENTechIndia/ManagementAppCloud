import React, { useState } from "react";
import { Field, Form, ErrorMessage, Formik } from "formik";
import Label from "../../../../Components/Label/Label"
import Header from "../../../../HOC/Header/Header";
import { useNavigate } from "react-router-dom";
import SaveButton from "../../../../Components/Buttons_save/Savebutton";
import InputField from "../../../../Components/InputField/InputField";
import Table from "../../../../Components/Table/Table";
import { inputHandlers } from "../../../../HOC/Validation/InputValidations";


const MahitiSodha = () => {
    const navigate = useNavigate();


    const [citizenName, setCitizenName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [initialValues, setInitialValues] = useState({
        citizenName: "",
        mobileNumber: "",
        emailAddress: "",
    });
    const [tableData, setTableData] = useState([]);
    const [tableHeader, setTableHeader] = useState([
        "Citizen Name",
        "Mobile Number",
        "Email Address",
        "Suggestion",
        "Date"
    ])

    const data = [
        {
            citizenName: "Whistle Blower",
            mobileNumber: "9999999999",
            emailAddress: "fs@gmail.com",
            suggestion: "Complainant Section No one Sees",
            date: "29-APR-17"
        },
        {
            citizenName: "Name",
            mobileNumber: "9999999999",
            emailAddress: "Emailnew@g.com",
            suggestion: "Suggestion",
            date: "17-MAR-21"
        },
        {
            citizenName: "RAKESH SHARMA",
            mobileNumber: "9999999999",
            emailAddress: "rakeshsharma241088@gmail.com",
            suggestion: "FERIWALE PROBLEM AT FATHERWADI",
            date: "20-SEP-24"
        },
        {
            citizenName: "aaa",
            mobileNumber: "9999999999",
            emailAddress: "abc@gmail.com",
            suggestion: "PLEASE IMPROVE WATER SUPPLY IN VINI HEIGHTS SOCIETY. SUPPLY SHOULD BE TWO TIMES IN A DAY",
            date: "22-FEB-24"
        }
    ]

    const handleSubmit = (values) => {
        if (values.citizenName.length === 0 && values.mobileNumber.length === 0 && values.emailAddress.length === 0) {
            alert("Please enter any one field");
            return;
        }
        setTableData(data);
    };

    const handleGoBack = () => {
        window.history.back();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-3">
            <Header
                title="Find Information"
                subtitle="CRM"
                onBack={handleGoBack}
            />
            <div className="w-full max-w-[600px] mx-auto px-3 sm:px-4 lg:px-0">
                <div className="bg-white my-3 p-3 sm:p-4 rounded-2xl">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ resetForm }) => {
                            return (
                                <Form className="space-y-4 p-3">
                                    <div className="mb-4">
                                        <div className="cols-12">
                                            <Label text="Citizen Name" />
                                        </div>
                                        <div className="cols-12">
                                            <Field
                                                name="citizenName"
                                                type="text"
                                                placeholder="Enter Name"
                                                className="form-control"
                                                component={InputField}
                                                restrictInput={inputHandlers.name}
                                                onChange={(e) => setCitizenName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="cols-12">
                                            <Label text="Mobile Number" />
                                        </div>
                                        <div className="cols-12">
                                            <Field
                                                name="mobileNumber"
                                                type="text"
                                                placeholder="Enter Mobile Number"
                                                component={InputField}
                                                restrictInput={inputHandlers.phone}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="cols-12">
                                            <Label text="Email Address" />
                                        </div>
                                        <div className="cols-12">
                                            <Field
                                                name="emailAddress"
                                                type="email"
                                                placeholder="Enter Email Address"
                                                component={InputField}
                                                restrictInput={inputHandlers.email}
                                                onChange={(e) => setEmailAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className=" bottom-0 bg-gradient-to-t from-gray-50 via-gray-50/90 p-2 mt-4">
                                        <SaveButton
                                            customClass="hover:cursor-pointer"
                                            text="Sumbit"
                                            type="submit"
                                            loading={false}
                                        />
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
                <div className="mt-4">
                    {tableData.length > 0 && <Table data={tableData} headers={tableHeader} keyMapping={{
                        "Citizen Name": "citizenName",
                        "Mobile Number": "mobileNumber",
                        "Email Address": "emailAddress",
                        "Suggestion": "suggestion",
                        "Date": "date",
                    }} />}
                </div>
            </div>
        </div>
    );
};

export default MahitiSodha;