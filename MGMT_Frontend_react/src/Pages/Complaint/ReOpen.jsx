import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import Table from "../../Components/Table/Table";
import { PageHeader, SubHeaderCard } from "../../Components/NewLayout";
import { ChevronLeft } from "lucide-react";
import useAlert from "../../Components/CustomAlert/useAlert";

const ReOpen = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const orgId = user?.data?.OrgId;
  const tableRef = useRef(null);

  // ── State ──
  const [level, setLevel] = useState(1);
  const [level1Data, setLevel1Data] = useState([]);
  const [level2Data, setLevel2Data] = useState([]);
  const [level3Data, setLevel3Data] = useState([]);

  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedComplaintTypeId, setSelectedComplaintTypeId] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [selectedTypeName, setSelectedTypeName] = useState("");

  const getLevelHeaders = () => {
    if (level === 1) {
      return {
        headers: [
          "विभागाचे नाव",
          "प्रलंबित",
          "अधिकृत",
          "वापरकर्त्यास असाइन",
          "बंद",
          "एकूण",
        ],
        keyMapping: {
          "विभागाचे नाव": "deptName",
          प्रलंबित: "pending",
          अधिकृत: "authorised",
          "वापरकर्त्यास असाइन": "assigned",
          बंद: "closed",
          एकूण: "total",
        },
        nameKey: "deptName",
      };
    } else if (level === 2) {
      return {
        headers: [
          "तक्रार प्रकार",
          "प्रलंबित",
          "अधिकृत",
          "वापरकर्त्यास असाइन",
          "बंद",
          "एकूण",
        ],
        keyMapping: {
          "तक्रार प्रकार": "complaintType",
          प्रलंबित: "pending",
          अधिकृत: "authorised",
          "वापरकर्त्यास असाइन": "assigned",
          बंद: "closed",
          एकूण: "total",
        },
        nameKey: "complaintType",
      };
    } else {
      return {
        headers: [
          "तक्रार उपप्रकार",
          "प्रलंबित",
          "अधिकृत",
          "वापरकर्त्यास असाइन",
          "बंद",
          "एकूण",
        ],
        keyMapping: {
          "तक्रार उपप्रकार": "subtype",
          प्रलंबित: "pending",
          अधिकृत: "authorised",
          "वापरकर्त्यास असाइन": "assigned",
          बंद: "closed",
          एकूण: "total",
        },
        nameKey: "subtype",
      };
    }
  };

  const addTotalRow = (rows, nameField) => {
    if (rows.length === 0) return rows;
    const totals = rows.reduce(
      (acc, row) => ({
        pending: acc.pending + (row.pending || 0),
        authorised: acc.authorised + (row.authorised || 0),
        assigned: acc.assigned + (row.assigned || 0),
        closed: acc.closed + (row.closed || 0),
        total: acc.total + (row.total || 0),
      }),
      { pending: 0, authorised: 0, assigned: 0, closed: 0, total: 0 },
    );
    const totalRow = {
      [nameField]: "एकूण",
      pending: totals.pending,
      authorised: totals.authorised,
      assigned: totals.assigned,
      closed: totals.closed,
      total: totals.total,
    };
    return [...rows, totalRow];
  };

  const getCustomCellRenderer = (nameKey) => {
    return {
      [nameKey]: (value, row) => {
        if (level === 3) {
          return <span>{value}</span>;
        }
        if (value === "एकूण") {
          return <span>{value}</span>;
        }
        return (
          <span
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
            onClick={() => handleFirstColumnClick(row)}
          >
            {value}
          </span>
        );
      },
    };
  };

  // ── Handlers for column click ──
  const handleFirstColumnClick = (row) => {
    if (level === 1) {
      const deptId = row.deptId;
      const deptName = row.deptName;
      if (!deptId) return;
      setSelectedDeptId(deptId);
      setSelectedDeptName(deptName);
      fetchLevel2(deptId);
      setLevel(2);
    } else if (level === 2) {
      const typeId = row.complaintTypeId;
      const typeName = row.complaintType;
      if (!typeId) return;
      setSelectedComplaintTypeId(typeId);
      setSelectedTypeName(typeName);
      fetchLevel3(selectedDeptId, typeId);
      setLevel(3);
    }
  };

  const fetchLevel1 = async () => {
    if (!orgId) {
      showAlert("Organization ID not found", "warning");
      return;
    }
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_CRM_BASE_URL}/fetchComplaintStatusSummary?userDepId=&orgId=${orgId}&dptConfig=`;
      const response = await axios.get(url);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const rows = response.data.map((item) => ({
          deptId: item.DEPTID,
          deptName: item.DEPTENAME || item.DEPTMNAME,
          pending: item.PENDINGFORAUTHORI || 0,
          authorised: item.AUTHORISED || 0,
          assigned: item.ASSIGNTOUSER || 0,
          closed: item.CLOSED || 0,
          total: item.TOTAL || 0,
        }));
        const withTotal = addTotalRow(rows, "deptName");
        setLevel1Data(withTotal);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setLevel1Data([]);
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching level 1 data:", error);
      setLevel1Data([]);
      showAlert(error.message || "Failed to fetch department summary", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLevel2 = async (deptId) => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_CRM_BASE_URL}/fetchComplaintTypeStatusSummary?deptId=${deptId}&orgId=${orgId}&dptConfig=null`;
      const response = await axios.get(url);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const rows = response.data.map((item) => ({
          complaintTypeId: item.CMPLTTYPEID,
          complaintType: item.COMPLAINT_TYPE,
          pending: item.PENDINGFORAUTHORI || 0,
          authorised: item.AUTHORISED || 0,
          assigned: item.ASSIGNTOUSER || 0,
          closed: item.CLOSED || 0,
          total: item.TOTAL || 0,
        }));
        const withTotal = addTotalRow(rows, "complaintType");
        setLevel2Data(withTotal);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setLevel2Data([]);
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching level 2 data:", error);
      setLevel2Data([]);
      showAlert(error.message || "Failed to fetch complaint types", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLevel3 = async (deptId, complaintTypeId) => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_CRM_BASE_URL}/fetchComplaintSubTypeStatusSummary?deptId=${deptId}&deptComplaintTypeId=${complaintTypeId}&orgId=${orgId}`;
      const response = await axios.get(url);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const rows = response.data.map((item) => ({
          subtype: item.COMPLAINT_SUBTYPE,
          pending: item.PENDINGFORAUTHORI || 0,
          authorised: item.AUTHORISED || 0,
          assigned: item.ASSIGNTOUSER || 0,
          closed: item.CLOSED || 0,
          total: item.TOTAL || 0,
        }));
        const withTotal = addTotalRow(rows, "subtype");
        setLevel3Data(withTotal);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }, 100);
      } else {
        setLevel3Data([]);
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching level 3 data:", error);
      setLevel3Data([]);
      showAlert(error.message || "Failed to fetch complaint subtypes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      // fetchLevel1();
    }
  }, [orgId]);

  const handleGoBack = () => {
    navigate("/CADDashboard");
  };

  const handleBackToPreviousLevel = () => {
    if (level === 3) {
      setLevel(2);
    } else if (level === 2) {
      setLevel(1);
    }
  };

  const getCurrentData = () => {
    if (level === 1) return level1Data;
    if (level === 2) return level2Data;
    return level3Data;
  };

  const currentData = getCurrentData();
  const { headers, keyMapping, nameKey } = getLevelHeaders();
  const customCellRenderer = getCustomCellRenderer(nameKey);

  const getSubHeaderInfo = () => {
    if (level === 1) {
      return { title: "Department Summary", subtitle: "Complaint Status" };
    } else if (level === 2) {
      return {
        title: `Department : ${selectedDeptName}`,
        subtitle: "Complaint Types",
      };
    } else {
      return {
        title: `Department : ${selectedDeptName} | Complaint Type : ${selectedTypeName}`,
        subtitle: "Complaint Subtypes",
      };
    }
  };

  const subHeader = getSubHeaderInfo();

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader title="Re‑Open" subtitle="CRM" onBack={handleGoBack} />
      <Alert />
      <div className="container mx-auto mt-4 mb-5 px-4">
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {level > 1 && (
            <div className="mb-4 flex items-center">
              <button
                onClick={handleBackToPreviousLevel}
                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                {level === 3
                  ? "Back to Complaint Types"
                  : "Back to Departments"}
              </button>
            </div>
          )}

          {currentData.length > 0 && (
            <SubHeaderCard
              subtitle={subHeader.subtitle}
              title={subHeader.title}
              className="mb-4"
            />
          )}

          {currentData.length > 0 ? (
            <div
              ref={tableRef}
            >


              <Table
                data={currentData}
                headers={headers}
                keyMapping={keyMapping}
                customCellRenderer={customCellRenderer}
                pagination={true}
                rowsPerPage={10}
              />
            </div>

          ) : (
            <div className="text-center py-8 text-gray-500">
              No Re-Open Cases
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReOpen;
