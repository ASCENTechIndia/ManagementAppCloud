import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { PageHeader, SubHeaderCard } from "../../Components/NewLayout";

const ZoneWise = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);

  const tableHeaders = [
    "प्रभागाचे नाव",
    "मागील मागणी",
    "चालू मागणी",
    "मागील वसुली",
    "चालू वसुली",
    "एकूण मागणी",
    "एकूण वसुली",
    "वसुली टक्केवारी",
  ];
  const tableKeyMapping = {
    "प्रभागाचे नाव": "zone_name",
    "मागील मागणी": "arrears_demand",
    "चालू मागणी": "current_demand",
    "मागील वसुली": "arrears_collection",
    "चालू वसुली": "current_collection",
    "एकूण मागणी": "total_demand",
    "एकूण वसुली": "total_collection",
    "वसुली टक्केवारी": "recovery_percentage",
  };

  const fetchZoneWiseData = async () => {
    if (!userId || !ulbid) {
      alert("User ID or Ulb ID not found");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$estate_zonewise_dmdcoll$${userId}$${ulbid}`,
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
          zone_name: item.zone_name || "",
          arrears_demand: item.arrears_demand || 0,
          current_demand: item.current_demand || 0,
          arrears_collection: item.arrears_collection || 0,
          current_collection: item.current_collection || 0,
          total_demand: item.total_demand || 0,
          total_collection: item.total_collection || 0,
          recovery_percentage: item.recovery_percentage || 0,
        }));
        const totalArrearsDemand = rows.reduce((sum, item) => sum += item.arrears_demand, 0);
        const totalCurrentDemand = rows.reduce((sum, item) => sum += item.current_demand, 0);
        const totalArrearsCollection = rows.reduce((sum, item) => sum += item.arrears_collection, 0);
        const totalCurrentCollection = rows.reduce((sum, item) => sum += item.current_collection, 0);
        const totalTotalDemand = rows.reduce((sum, item) => sum += item.total_demand, 0);
        const totalTotalCollection = rows.reduce((sum, item) => sum += item.total_collection, 0);
        const totalRow = {
          zone_name: "Total",
          arrears_demand : totalArrearsDemand,
          current_demand: totalCurrentDemand,
          arrears_collection: totalArrearsCollection,
          current_collection: totalCurrentCollection,
          total_demand: totalTotalDemand,
          total_collection: totalTotalCollection,
          recovery_percentage: ((totalTotalCollection / totalTotalDemand) * 100).toFixed(2) 
        }
        setTableData([...rows, totalRow]);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching zone-wise data:", error);
      setTableData([]);
      alert(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && ulbid) {
      fetchZoneWiseData();
    }
  }, [userId, ulbid]);

  const handleGoBack = () => {
    navigate("/Estate");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Zone Wise Collection"
        subtitle="Estate Department"
        onBack={handleGoBack}
      />

      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="Estate Department"
            title="Zone Wise Collection Summary"
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

export default ZoneWise;
