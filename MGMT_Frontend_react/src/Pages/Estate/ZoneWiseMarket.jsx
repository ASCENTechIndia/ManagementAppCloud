import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import Table from "../../Components/Table/Table";
import { PageHeader, SubHeaderCard } from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const ZoneWiseMarket = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);

  const tableHeaders = [
    "प्रभागाचे नाव",
    "एकूण",
    "दुकाने",
    "भाडे",
    "रिकामे",
    "एकूण मागणी",
    "एकूण वसुली",
    "वसुली टक्केवारी",
  ];
  const tableKeyMapping = {
    "प्रभागाचे नाव": "zone_name",
    एकूण: "total",
    दुकाने: "shop",
    भाडे: "rent",
    रिकामे: "empty",
    "एकूण मागणी": "total_demand",
    "एकूण वसुली": "total_collection",
    "वसुली टक्केवारी": "recovery_percentage",
  };

  const fetchData = async () => {
    if (!userId || !ulbid) {
      showAlert("User ID or Ulb ID not found", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG}$estatetype_summary$${userId}$${ulbid}`,
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
          total: item.total || 0,
          shop: item.shop || 0,
          rent: item.rent || 0,
          empty: item.empty || 0, 
          total_demand: item.total_demand || 0,
          total_collection: item.total_collection || 0,
          recovery_percentage: item.recovery_percentage || 0,
        }));

        const totalTotal = rows.reduce((sum, item) => sum += item.total, 0);
        const totalShop = rows.reduce((sum, item) => sum += item.shop, 0);
        const totalRent = rows.reduce((sum, item) => sum += item.rent, 0);
        const totalEmpty = rows.reduce((sum, item) => sum += item.empty, 0);
        const totalTotalDemand = rows.reduce((sum, item) => sum += item.total_demand, 0);
        const totalTotalCollection = rows.reduce((sum, item) => sum += item.total_collection, 0);
        const totalRow = {
          zone_name: "Total",
          total : totalTotal,
          shop: totalShop,
          rent: totalRent,
          empty: totalEmpty,
          total_demand: totalTotalDemand,
          total_collection: totalTotalCollection,
          recovery_percentage: ((totalTotalCollection / totalTotalDemand) * 100).toFixed(2) 
        }
        setTableData([...rows, totalRow]);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        setTableData([]);
        showAlert("No Data Found", "error");
      }
    } catch (error) {
      console.error("Error fetching zone-wise market data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
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
    navigate("/Estate");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Zone Wise Market"
        subtitle="Estate Department"
        onBack={handleGoBack}
      />
      <Alert />
      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="Estate Department"
            title="Zone Wise Market Summary"
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

export default ZoneWiseMarket;
