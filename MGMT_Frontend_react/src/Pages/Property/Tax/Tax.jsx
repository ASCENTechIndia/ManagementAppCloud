import React, { useState } from "react";
import PieChartComponent from "./PieChartComponent";
import Table from "../../../Components/Table/Table";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  SubHeaderCard,
} from "../../../Components/NewLayout";

const Tax = () => {
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
  const [chartData] = useState([
    { value: 20, label: "test", prabhagId: 2 },
    { value: 20, label: "test", prabhagId: 2 },
    { value: 20, label: "test", prabhagId: 2 },
  ]);

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Tax"
        subtitle="Property Tax"
        onBack={handleGoBack}
      />

      <SubHeaderCard
        subtitle="Report"
        title="Tax Overview"
        infoText="Property Tax Details"
        className="mt-4"
      />

      <section className="container mx-auto mt-4 mb-5 px-4 space-y-4">
        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex justify-center">
          <div className="w-full">
            <PieChartComponent
              data={chartData}
              title="Tax"
              description="Tax report"
            />
          </div>
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

export default Tax;

