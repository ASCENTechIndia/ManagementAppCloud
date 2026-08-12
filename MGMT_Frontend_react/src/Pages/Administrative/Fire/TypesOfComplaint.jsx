import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Repeat } from "lucide-react";
import CalenderComponent from "../../../Components/CalenderComponent";
import { formatDateForAPI } from "../../../utils/dateUtils";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  CalendarInput,
  SubHeaderCard,
} from "../../../Components/NewLayout";
import useAlert from "../../../Components/CustomAlert/useAlert";

const TypesOfComplaint = () => {
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert, hideAlert, Alert } = useAlert();
  const userId = user?.userId;
  const ulbid = user?.data?.OrgId;

  const [tableData, setTableData] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(new Date());
  const [selectedTo, setSelectedTo] = useState(new Date());

  const tableHeaders = ["झोन", "पावती संख्या", "मागणी", "वसुली", "वसुली टक्केवारी"];
  const tableKeyMapping = {
    झोन: "zone_name",
    "पावती संख्या": "receipt_count",
    मागणी: "demand",
    वसुली: "collection",
    "वसुली टक्केवारी": "recovery_percentage",
  };

  const initialValues = {
    from: new Date(),
    to: new Date(),
  };

  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (values) => {
    hideAlert();
    if (!userId || !ulbid) {
      showAlert("User ID or Ulb ID not found", "warning");
      return;
    }
    setSelectedFrom(values.from);
    setSelectedTo(values.to);

    try {
      setLoading(true);
      const payload = {
        Request1: `${import.meta.env.VITE_FLAG || "PropMAMC"}$fire_zonewisecollection$${userId}$${ulbid}~${formatDateForAPI(values.from)}~${formatDateForAPI(values.to)}`,
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
        hideAlert();
        const rawData = res.data.data.jsondata;

        const rows = rawData.map((item) => ({
          zone_name: item.zone_name || "",
          receipt_count: Number(item.receipt_count || 0),
          demand: Number(item.demand || 0),
          collection: Number(item.collection || 0),
          recovery_percentage: Number(item.recovery_percentage || 0),
        }));

        const totalReceipts = rows.reduce((sum, row) => sum + row.receipt_count, 0);
        const totalDemand = rows.reduce((sum, row) => sum + row.demand, 0);
        const totalCollection = rows.reduce((sum, row) => sum + row.collection, 0);
        const totalRecoveryPercentage = totalDemand > 0 ? Number(((totalCollection / totalDemand) * 100).toFixed(2)) : 0;

        const totalRow = {
          zone_name: "एकूण",
          receipt_count: totalReceipts,
          demand: totalDemand,
          collection: totalCollection,
          recovery_percentage: totalRecoveryPercentage,
        };

        setTableData([...rows, totalRow]);
      } else {
        setTableData([]);
        showAlert("No data found for the selected dates", "error");
      }
    } catch (error) {
      console.error("Error fetching zonewise collection data:", error);
      setTableData([]);
      showAlert(error.message || "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/Fire");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Zonewise Collection"
        subtitle="Fire Department"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarInput label="दिनांक पासून">
                  <CalenderComponent
                    name="from"
                    selectedDate={values.from}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFieldValue("from", date);
                    }}
                  />
                </CalendarInput>

                <CalendarInput label="दिनांक पर्यंत">
                  <CalenderComponent
                    name="to"
                    selectedDate={values.to}
                    autoSelectToday={false}
                    setSelectedDate={(date) => {
                      setFieldValue("to", date);
                    }}
                  />
                </CalendarInput>
              </div>
            </FormLayoutCard>
          </Form>
        )}
      </Formik>

      {tableData.length > 0 && (
        <>
          {/* <SubHeaderCard
            subtitle="Fire Department"
            title="Types of Complaint"
            infoText={`From ${formatDateDisplay(selectedFrom)} To ${formatDateDisplay(selectedTo)}`}
            className="mt-4"
          /> */}

          <section className="container mx-auto mt-4 mb-5 px-4">
            <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <Table
                data={tableData}
                headers={tableHeaders}
                keyMapping={tableKeyMapping}
                pagination={true}
                rowsPerPage={10}
                customCellRenderer={{
                  recovery_percentage: (value) => value !== undefined && value !== null ? `${value}%` : "-",
                }}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default TypesOfComplaint;
