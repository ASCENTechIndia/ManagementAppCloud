import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import axios from "axios";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import Table from "../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
} from "../../Components/NewLayout";
import CalenderComponent from "../../Components/CalenderComponent";
import useAlert from "../../Components/CustomAlert/useAlert";

const ComplaintReportByPeriod = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert();
  const ulbId = user?.data?.OrgId;
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState("");

  const tableHeaders = [
    "Department Name",
    "Total",
    "Pending",
    "Closed",
    "Escalated",
    "Demand",
  ];
  const tableKeyMapping = {
    "Department Name": "deptName",
    Total: "total",
    Pending: "pending",
    Closed: "closed",
    Escalated: "es",
    Demand: "demand",
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (ulbId) {
      fetchDepartments();
    }
  }, [ulbId]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_CRM_BASE_URL}/fetchDeptConfig?orgId=${ulbId}&dptConfig=`,
      );
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        hideAlert();
        const options = response.data.map((item) => ({
          label: item.DEPTNAME,
          value: String(item.DEPTID),
        }));
        setDeptOptions(options);
        if (options.length > 0) {
          setSelectedDept(options[0].value);
        }
      } else {
        showAlert("No departments found", "warning");
        setDeptOptions([]);
      }
    } catch (error) {
      setDeptOptions([]);
      console.error("Error fetching departments:", error);
      showAlert(error.message || "Failed to fetch departments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    hideAlert();
    if (!ulbId) {
      showAlert("Ulb ID not found", "warning");
      return;
    }
    if (!values.deptId) {
      showAlert("Please select a department", "warning");
      return;
    }

    setSelectedFrom(values.from);
    setSelectedTo(values.to);
    setSelectedDept(values.deptId);

    const payload = {
      complaintNo: null,
      complaintSubType: null,
      complaintType: null,
      deptConfigList: [],
      prabhagIdList: [],
      source: null,
      status: null,

      orgId: Number(ulbId),
      fromDate: formatDate(values.from),
      toDate: formatDate(values.to),
      selectedDept: Number(values.deptId),
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_CRM_BASE_URL}/fetchComplaintReport`,
        payload,
      );


      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        hideAlert();
        const department = response.data.data[0]?.DEPTNM;
        const totalComplaints = response.data.data.length;
        const totalClosed = response.data.data.filter(item => item.CMPSTATUS === "Close").length;
        const totalPending = response.data.data.filter(item => item.CMPSTATUS !== "Close").length; 
        // const rows = response.data.data.map((item) => ({
        //   deptName: item.DEPTNAME || "",
        //   total: item.TOTAL || 0,
        //   pending: item.PENDING || 0,
        //   closed: item.CLOSE1 || 0,
        //   es: item.ES || 0,
        //   demand: item.DEMAND || 0,
        // }));
        const rows = [{
          deptName: department,
          total: totalComplaints,
          pending: totalPending,
          closed: totalClosed,
          es: 0,
          demand: 0
        }];
        setTableData(rows);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setTableData([]);
        showAlert(response.data?.message || "No data found", "error");
      }
    } catch (error) {
      console.error("Error fetching complaint data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  const initialValues = {
    from: new Date(),
    to: new Date(),
    deptId: "",
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Complaint Report by Period"
        subtitle="CRM"
        onBack={handleGoBack}
      />
      <Alert />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => (
          <Form onSubmit={formikSubmit}>
            <FormLayoutCard
              onSubmit={formikSubmit}
              actionButtonText="पहा"
              actionButtonIcon={<Repeat className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CalendarInput label="From Date">
                  <CalenderComponent
                    name="from"
                    selectedDate={values.from}
                    autoSelectToday={false}
                    setSelectedDate={(date) => setFieldValue("from", date)}
                  />
                </CalendarInput>

                <CalendarInput label="To Date">
                  <CalenderComponent
                    name="to"
                    selectedDate={values.to}
                    autoSelectToday={false}
                    setSelectedDate={(date) => setFieldValue("to", date)}
                  />
                </CalendarInput>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="deptId"
                    value={values.deptId}
                    onChange={(e) => setFieldValue("deptId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mt-1"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {deptOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FormLayoutCard>
          </Form>
        )}
      </Formik>
        {console.log(tableData)}
      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="CRM"
            title="Complaint Report"
            infoText={`${formatDate(selectedFrom)} - ${formatDate(selectedTo)}`}
            className="mt-4"
          /> */}

          <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
            <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <Table
                data={tableData}
                headers={tableHeaders}
                keyMapping={tableKeyMapping}
                pagination={true}
                rowsPerPage={10}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ComplaintReportByPeriod;
