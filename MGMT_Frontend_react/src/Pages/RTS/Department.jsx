import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { PageHeader, SubHeaderCard } from "../../Components/NewLayout";

const Department = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);

  const tableHeaders = [
    "विभागाचे नाव",
    "पूर्ण",
    "प्रलंबित",
    "नाकारलेले",
    "एकूण",
  ];
  const tableKeyMapping = {
    "विभागाचे नाव": "department_name",
    पूर्ण: "completed",
    प्रलंबित: "pending",
    नाकारलेले: "reject",
    एकूण: "total",
  };

  const fetchData = async () => {
    if (!userId || !ulbid) {
      alert("User ID or Ulb ID not found");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$rts_departwise_summary$${userId}$${ulbid}`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };
      const res = await apiService.post("WTgeneric-call", payload);

      if (
        res?.data?.Success &&
        res?.data?.data?.jsondata &&
        Array.isArray(res.data.data.jsondata) &&
        res.data.data.jsondata.length > 0
      ) {
        const rows = res.data.data.jsondata.map((item) => ({
          department_name: item.department_name || "",
          completed: item.completed || 0,
          pending: item.pending || 0,
          reject: item.reject || 0,
          total: item.total || 0,
        }));
        setTableData(rows);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && ulbid) {
      fetchData();
    }
  }, [userId, ulbid]);

  const handleGoBack = () => {
    navigate("/RTS");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Department Wise Summary"
        subtitle="RTS Department"
        onBack={handleGoBack}
      />

      {tableData.length > 0 && (
        <>
          <SubHeaderCard
            subtitle="RTS Department"
            title="Department Wise Summary"
            className="mt-4"
          />

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

export default Department;
