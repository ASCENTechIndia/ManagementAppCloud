import React, { useState } from "react";
import {
    BsTable,
    BsBarChart,
    BsPieChart,
} from "react-icons/bs";
import DashboardTable from "../../Components/NewTableComponent";
import {
    PageHeader,
    DateRangePicker,
    SubHeaderCard,
    FormLayoutCard,
    CustomButton,
} from "../../Components/NewLayout";

const columns = [
    {
        key: "ward",
        label: "Ward",
    },
    {
        key: "arrears",
        label: "Arrears",
        render: (value) => Number(value).toFixed(2),
    },
    {
        key: "current",
        label: "Current",
        render: (value) => Number(value).toFixed(2),
    },
    {
        key: "total",
        label: "Total",
        bold: true,
        render: (value) => <strong>{Number(value).toFixed(2)}</strong>,
    },
];

const data = [
    {
        ward: "Ward No.1",
        arrears: 1.96,
        current: 17.93,
        total: 19.89,
    },
    {
        ward: "Ward No.2",
        arrears: 0.55,
        current: 10.54,
        total: 11.09,
    },
    {
        ward: "Ward No.3",
        arrears: 1.04,
        current: 22.17,
        total: 23.21,
    },
    {
        ward: "Ward No.4",
        arrears: 11.29,
        current: 90.65,
        total: 101.94,
    },
    { ward: "Ward No.5", arrears: "7.20", current: "60.68", total: "67.88" },
    { ward: "Ward No.6", arrears: "6.51", current: "24.85", total: "31.36" },
];

const footer = {
    ward: "Total",
    arrears: 28.55,
    current: 226.82,
    total: 255.37,
};

const NewLayout = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeView, setActiveView] = useState("table");

    const handleSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        console.log("Searching dates:", fromDate, toDate);
    };

    return (
        <div className="min-h-screen bg-[#eef4ff]">
            {/* Header Component */}
            <PageHeader
                title="Property Dashboard"
                subtitle="Welcome Back"
                onBack={() => console.log("Back clicked")}
                onNotificationClick={() => console.log("Notification clicked")}
                onProfileClick={() => console.log("Profile clicked")}
            />

            {/* Form Layout Card with Calendar Inputs */}
            <FormLayoutCard as="form" onSubmit={handleSearch} actionButtonText="Search">
                <DateRangePicker
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromChange={(e) => setFromDate(e.target.value)}
                    onToChange={(e) => setToDate(e.target.value)}
                />
            </FormLayoutCard>

            {/* SubHeader Card Component */}
            <SubHeaderCard
                subtitle="Ward"
                title="All Wards"
                infoText="15 Jul 2026 - 15 Jul 2026"
                value="₹255.37 L"
                className="mt-4"
            />

            {/* View Toggle Buttons */}
            <section className="container mx-auto mt-4 px-4">
                <div className="flex justify-center gap-4">
                    <CustomButton
                        variant="view-toggle"
                        active={activeView === "table"}
                        onClick={() => setActiveView("table")}
                        icon={<BsTable size={24} />}
                        title="Table View"
                    />

                    <CustomButton
                        variant="view-toggle"
                        active={activeView === "bar"}
                        onClick={() => setActiveView("bar")}
                        icon={<BsBarChart size={24} />}
                        title="Bar Chart View"
                    />

                    <CustomButton
                        variant="view-toggle"
                        active={activeView === "pie"}
                        onClick={() => setActiveView("pie")}
                        icon={<BsPieChart size={24} />}
                        title="Pie Chart View"
                    />
                </div>
            </section>

            {/* Data Table Section */}
            <section className="container mx-auto mt-4 mb-5 px-4 py-3">
                <DashboardTable
                    columns={columns}
                    data={data}
                    footer={footer}
                />
            </section>
        </div>
    );
};

export default NewLayout;