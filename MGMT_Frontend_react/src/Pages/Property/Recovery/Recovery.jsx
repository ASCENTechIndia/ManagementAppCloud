import React, { useState } from "react";
import Table from "../../../Components/Table/Table";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  SubHeaderCard,
} from "../../../Components/NewLayout";

const Recovery = () => {
  const navigate = useNavigate();
  const [tableHeader] = useState(["घटक", "रोख", "चेक", "एकूण"]);
  const [tableData] = useState([
    { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
    { id: 2, name: "Jane Smith", age: 32, email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", age: 25, email: "mike@example.com" },
    { id: 4, name: "Sarah Wilson", age: 29, email: "sarah@example.com" },
    { id: 5, name: "Tom Brown", age: 35, email: "tom@example.com" },
    { id: 6, name: "Emily Davis", age: 26, email: "emily@example.com" },
    { id: 7, name: "Robert Wilson", age: 31, email: "robert@example.com" },
  ]);

  const barChartData = [
    { category: "जानेवारी", value: 45 },
    { category: "फेब्रुवारी", value: 52 },
    { category: "मार्च", value: 38 },
    { category: "एप्रिल", value: 61 },
  ];

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Recovery"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Report"
        title="Recovery Details"
        infoText="Monthly Recovery Overview"
        className="mt-4"
      />

      <section className="container mx-auto mt-4 mb-5 px-4 space-y-4">
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <BarGraphComponent
            data={barChartData}
            title="महिनावार वसुली"
            description="Recovery details by month"
          />
        </div>

        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)] overflow-hidden">
          <Table
            data={tableData}
            headers={tableHeader}
            keyMapping={{
              घटक: "id",
              रोख: "name",
              चेक: "age",
              एकूण: "email",
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Recovery;
