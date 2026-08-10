import React, { useState, useEffect, useRef } from "react";
import { Table as TableIcon, PieChart, BarChart3, ExternalLink, X, Info, ChevronLeft } from "lucide-react";
import PieChartComponent from "../Property/Tax/PieChartComponent";
import StackedBarGraph from "../../Components/StackedBarGraph";
import { useLoader } from "../../Context/LoaderContext";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../Components/Table/Table";
import apiService from "../../../apiService";
import { formatDateForAPI } from "../../utils/dateUtils";
import {
    PageHeader,
    SubHeaderCard,
    CustomButton,
} from "../../Components/NewLayout";
import useAlert from "../../Components/CustomAlert/useAlert";

const AllZonesDetails = () => {
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { showAlert, Alert } = useAlert();
    const userid = user?.userId || "";
    const orgId = user?.data?.OrgId;
    const flag = import.meta.env.VITE_FLAG || "MobApp";
    const tableRef = useRef(null);
    const pieRef = useRef(null);
    const barRef = useRef(null);

    const [tableData, setTableData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [barGraphData, setBarGraphData] = useState([]);
    const [activeView, setActiveView] = useState("table");

    // Prabhag Details Table State
    const [isDetailsView, setIsDetailsView] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detailTableData, setDetailTableData] = useState([]);
    const [detailPieChartData, setDetailPieChartData] = useState([]);
    const [detailBarGraphData, setDetailBarGraphData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGoBack = () => {
        if (isDetailsView) {
            setIsDetailsView(false);
        } else {
            navigate("/ZonewiseReceiptDetails");
        }
    };

    const headers = [
        "Zone",
        "Authorized Receipts",
        "Pending Receipts",
        "Authorized Receipt Amount",
        "Pending Receipt Amount",
        "Total Amount",
    ];

    const keyMapping = {
        "Zone": "prabhagname",
        "Authorized Receipts": "authorized_receipts",
        "Pending Receipts": "pending_receipts",
        "Authorized Receipt Amount": "authorized_receipt_amount",
        "Pending Receipt Amount": "pending_receipt_amount",
        "Total Amount": "total_amount",
    };

    const detailHeaders = [
        "Zone",
        "Department Name",
        "Rec No",
        "Trans No",
        "GL Name",
        "Account Name",
        "Amount",
    ];

    const detailKeyMapping = {
        "Zone": "prabhagname",
        "Department Name": "vibhagname",
        "Rec No": "recno",
        "Trans No": "transno",
        "GL Name": "glname",
        "Account Name": "accname",
        "Amount": "amount",
    };

    // Helper to extract integer from Zone 1, Zone 2, etc. for 1 2 3 sequential ordering
    const extractZoneNumber = (str) => {
        if (!str) return 0;
        const matches = str.match(/\d+/);
        return matches ? parseInt(matches[0], 10) : 0;
    };

    const [dateText, setDateText] = useState("");

    useEffect(() => {
        if (!userid) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const passedFrom = location.state?.from;
                const passedTo = location.state?.to;

                const fromDateStr = location.state?.fromDateStr
                    ? location.state.fromDateStr
                    : passedFrom
                        ? formatDateForAPI(passedFrom)
                        : formatDateForAPI(new Date());

                const toDateStr = location.state?.toDateStr
                    ? location.state.toDateStr
                    : passedTo
                        ? formatDateForAPI(passedTo)
                        : formatDateForAPI(new Date());

                setDateText(`${fromDateStr} - ${toDateStr}`);

                const payload = {
                    Request1: `${flag}$ACC_RECDATA$${userid}$${orgId}~${fromDateStr}~${toDateStr}`,
                    Request2: "",
                    Request3: "",
                    Request4: "",
                    Request5: "",
                    Request6: "",
                    Request7: "",
                };

                let response = null;
                // console.log(payload);
                try {
                    // console.log("WTgeneric-call")
                    response = await apiService.post("WTgeneric-call", payload);
                } catch (e) {
                    // console.log("generic-call")
                    response = await apiService.post("generic-call", payload);
                }

                const resData = response?.data?.data;
                let rawList = [];

                if (Array.isArray(resData?.jsondata) && resData.jsondata.length > 0) {
                    rawList = resData.jsondata;
                } else if (typeof resData === "string" && resData.includes("SUCCESS")) {
                    const responseStr = resData.replace(/^respon:/, "");
                    const parts = responseStr.split("#SUCCESS#");
                    if (parts.length > 1) {
                        const dataPart = parts[1];
                        const tildeParts = dataPart.split("~");
                        if (tildeParts.length > 1) {
                            const itemsStr = tildeParts[1];
                            const itemsList = itemsStr.split("$");
                            for (let i = 0; i < itemsList.length; i += 6) {
                                if (itemsList[i]) {
                                    rawList.push({
                                        zoneid: itemsList[i],
                                        prabhagname: itemsList[i + 1] || "Zone",
                                        authorized_receipts: Number(itemsList[i + 2]) || 0,
                                        pending_receipts: Number(itemsList[i + 3]) || 0,
                                        authorized_receipt_amount: Number(itemsList[i + 4]) || 0,
                                        pending_receipt_amount: Number(itemsList[i + 5]) || 0,
                                    });
                                }
                            }
                        }
                    }
                }

                if (rawList.length > 0) {
                    // Sort in 1 2 3 sequential format by zone / prabhag number
                    rawList.sort((a, b) => {
                        const numA = extractZoneNumber(a.prabhagname);
                        const numB = extractZoneNumber(b.prabhagname);
                        if (numA !== numB) return numA - numB;
                        return (a.prabhagname || "").localeCompare(b.prabhagname || "");
                    });

                    // Format rows without showing zoneid in table columns
                    const formatted = rawList.map((item) => {
                        const authCount = Number(item.authorized_receipts) || 0;
                        const pendCount = Number(item.pending_receipts) || 0;
                        const authAmt = Number(item.authorized_receipt_amount) || 0;
                        const pendAmt = Number(item.pending_receipt_amount) || 0;
                        const totalAmt = authAmt + pendAmt;

                        return {
                            zoneid: item.zoneid || item.prabhagid, // Kept in object data but not mapped in headers
                            prabhagname: item.prabhagname || "Zone",
                            authorized_receipts: authCount,
                            pending_receipts: pendCount,
                            authorized_receipt_amount: authAmt,
                            pending_receipt_amount: pendAmt,
                            total_amount: totalAmt,
                        };
                    });

                    // Compute Totals Row
                    const totalAuthCount = formatted.reduce((acc, cur) => acc + cur.authorized_receipts, 0);
                    const totalPendCount = formatted.reduce((acc, cur) => acc + cur.pending_receipts, 0);
                    const totalAuthAmt = formatted.reduce((acc, cur) => acc + cur.authorized_receipt_amount, 0);
                    const totalPendAmt = formatted.reduce((acc, cur) => acc + cur.pending_receipt_amount, 0);
                    const grandTotal = totalAuthAmt + totalPendAmt;

                    const totalRow = {
                        prabhagname: "Total",
                        authorized_receipts: totalAuthCount,
                        pending_receipts: totalPendCount,
                        authorized_receipt_amount: totalAuthAmt,
                        pending_receipt_amount: totalPendAmt,
                        total_amount: grandTotal,
                    };

                    setTableData([...formatted, totalRow]);

                    // Pie Chart Setup
                    setPieChartData(
                        formatted.map((item) => ({
                            name: item.prabhagname,
                            y: item.total_amount,
                        }))
                    );

                    // Bar Graph Setup
                    setBarGraphData(
                        formatted.map((item) => ({
                            category: item.prabhagname,
                            authorized: item.authorized_receipt_amount,
                            pending: item.pending_receipt_amount,
                            total: item.total_amount,
                        }))
                    );

                    setTimeout(() => {
                        tableRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }, 100);
                } else {
                    setTableData([]);
                    setPieChartData([]);
                    setBarGraphData([]);
                    showAlert("No Data Found", "error");
                }
            } catch (error) {
                console.error("Error fetching All Zones Collection data:", error);
                showAlert("Error fetching data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userid]);

    const handlePrabhagClick = async (row) => {
        if (row.prabhagname === "Total" || row.prabhagname === "एकूण") return;

        const prabhagId = row.zoneid || row.prabhagid || row.id || "";
        setSelectedRow(row);

        try {
            setLoading(true);

            const passedFrom = location.state?.from;
            const passedTo = location.state?.to;

            const fromDateStr = location.state?.fromDateStr
                ? location.state.fromDateStr
                : passedFrom
                    ? formatDateForAPI(passedFrom)
                    : formatDateForAPI(new Date());

            const toDateStr = location.state?.toDateStr
                ? location.state.toDateStr
                : passedTo
                    ? formatDateForAPI(passedTo)
                    : formatDateForAPI(new Date());

            const payload = {
                Request1: `${flag}$ACC_RECDATA$${userid}$${orgId}~${fromDateStr}~${toDateStr}~${prabhagId}`,
                Request2: "",
                Request3: "",
                Request4: "",
                Request5: "",
                Request6: "",
                Request7: "",
            };

            let response = null;
            // console.log(payload);
            try {
                // console.log("WTgeneric-call");
                response = await apiService.post("WTgeneric-call", payload);
            } catch (e) {
                // console.log("generic-call")
                response = await apiService.post("generic-call", payload);
            }

            // console.log(response);  

            const resData = response?.data?.data;
            let rawList = [];

            if (Array.isArray(resData?.jsondata) && resData.jsondata.length > 0) {
                rawList = resData.jsondata;
            } else if (Array.isArray(resData) && resData.length > 0) {
                rawList = resData;
            } else if (typeof resData === "string" && resData.includes("SUCCESS")) {
                const responseStr = resData.replace(/^respon:/, "");
                const parts = responseStr.split("#SUCCESS#");
                if (parts.length > 1) {
                    const dataPart = parts[1];
                    try {
                        const parsed = JSON.parse(dataPart);
                        if (Array.isArray(parsed)) rawList = parsed;
                    } catch {
                        const tildeParts = dataPart.split("~");
                        if (tildeParts.length > 1) {
                            const itemsStr = tildeParts[1];
                            const itemsList = itemsStr.split("$");
                            for (let i = 0; i < itemsList.length; i += 7) {
                                if (itemsList[i]) {
                                    rawList.push({
                                        prabhagname: itemsList[i] || row.prabhagname,
                                        vibhagname: itemsList[i + 1] || "",
                                        recno: itemsList[i + 2] || "",
                                        transno: itemsList[i + 3] || "",
                                        glname: itemsList[i + 4] || "",
                                        accname: itemsList[i + 5] || "",
                                        amount: Number(itemsList[i + 6]) || 0,
                                    });
                                }
                            }
                        }
                    }
                }
            } else if (typeof resData === "string" && response.data.errorcode === 9999 && resData !== "") {
                // const fixedString = resData.replace(/\r?\n/g, "\\n");
                const cleanedData = resData
                    // Fix escaped quotes
                    .replace(/\\"/g, '"')

                    // Fix escaped colon
                    .replace(/\\:/g, ":")

                    // Add quotes around unquoted string values
                    .replace(
                        /"([^"]+)"\s*:\s*([^",}\]]+)(?=\s*[,}])/g,
                        (_, key, value) => {
                            const trimmedValue = value.trim();

                            // Keep numbers
                            if (/^-?\d+(\.\d+)?$/.test(trimmedValue)) {
                                return `"${key}":${trimmedValue}`;
                            }

                            // Keep boolean
                            if (trimmedValue === "true" || trimmedValue === "false") {
                                return `"${key}":${trimmedValue}`;
                            }

                            // Keep null
                            if (trimmedValue === "null") {
                                return `"${key}":null`;
                            }

                            // Otherwise it's a string
                            return `"${key}":"${trimmedValue}"`;
                        }
                    );

                const parsed = JSON.parse(cleanedData);

                const jsonData = parsed.jsondata;

                rawList = jsonData;
            }

            const formatted = rawList.map((item) => ({
                prabhagname: item.prabhagname || "",
                vibhagname: item.vibhagname || "",
                recno: item.recno || "",
                transno: item.transno || "",
                glname: item.glname || "",
                accname: item.accname || "",
                amount: typeof item.amount !== "undefined" ? item.amount : typeof item.Amount !== "undefined" ? item.Amount : 0,
            }));
            console.log(formatted.length);
            if (formatted.length > 0) {
                const totalAmount = formatted.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);
                const totalRow = {
                    prabhagname: "Total",
                    vibhagname: "",
                    recno: "",
                    transno: "",
                    glname: "",
                    accname: "",
                    amount: totalAmount,
                };
                setDetailTableData([...formatted, totalRow]);

                // Pie Chart Data for Details View (Grouped by Vibhag / Department / Account)
                const pieMap = {};
                formatted.forEach((item) => {
                    const key = item.vibhagname || item.accname || item.glname || "Other";
                    const amt = Number(item.amount) || 0;
                    pieMap[key] = (pieMap[key] || 0) + amt;
                });
                setDetailPieChartData(
                    Object.keys(pieMap).map((key) => ({
                        name: key,
                        y: pieMap[key],
                    }))
                );

                // Bar Graph Data for Details View
                const barMap = {};
                formatted.forEach((item) => {
                    const key = item.vibhagname || item.accname || item.glname || "Other";
                    const amt = Number(item.amount) || 0;
                    barMap[key] = (barMap[key] || 0) + amt;
                });
                setDetailBarGraphData(
                    Object.keys(barMap).map((key) => ({
                        category: key,
                        amount: barMap[key],
                    }))
                );
            } else {
                setDetailTableData([]);
                setDetailPieChartData([]);
                setDetailBarGraphData([]);
                showAlert("No Data Found", "error");
            }

            setIsDetailsView(true);
        } catch (error) {
            console.error("Error fetching Prabhag Details:", error);
            setDetailTableData([]);
            setDetailPieChartData([]);
            setDetailBarGraphData([]);
            setIsDetailsView(true);
            showAlert("Error fetching data", "error");
        } finally {
            setLoading(false);
        }
    };

    const detailCustomCellRenderer = {
        prabhagname: (value) => {
            if (value === "Total" || value === "एकूण") {
                return <span className="font-bold text-gray-900">{value}</span>;
            }
            return <span>{value}</span>;
        },
        vibhagname: (value) => (
            <div style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "180px", minWidth: "130px", lineHeight: "1.3" }}>
                {value}
            </div>
        ),
        glname: (value) => (
            <div style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "200px", minWidth: "120px", lineHeight: "1.3" }}>
                {value}
            </div>
        ),
        accname: (value) => (
            <div style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "180px", minWidth: "120px", lineHeight: "1.3" }}>
                {value}
            </div>
        ),
        amount: (value, row) => {
            const isTotal = row.prabhagname === "Total" || row.prabhagname === "एकूण";
            const formattedVal = typeof value === "number" ? value.toLocaleString("en-IN") : value;
            return (
                <span className={isTotal ? "font-bold text-gray-900" : "font-medium text-emerald-700"}>
                    ₹{formattedVal}
                </span>
            );
        },
    };

    return (
        <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
            <PageHeader
                title="Wardwise Tax Collection"
                subtitle="Accounts"
                onBack={handleGoBack}
            />
            <Alert />
            <SubHeaderCard
                subtitle="Zone"
                title={
                    !isDetailsView ? (
                        <>
                            <span
                                className="cursor-pointer hover:underline"
                                onClick={() => navigate("/ZonewiseReceiptDetails", {
                                    state: {
                                        from: location.state.from,
                                        to: location.state.to
                                    }
                                })}
                            >
                                All Zones
                            </span> / Zonewise details
                        </>
                    ) : (
                        <>
                            <span
                                className="cursor-pointer hover:underline"
                                onClick={() => navigate("/ZonewiseReceiptDetails", {
                                    state: {
                                        from: location.state.from,
                                        to: location.state.to
                                    }
                                })}
                            >
                                All Zones
                            </span> /{" "}
                            <span
                                className="cursor-pointer hover:underline"
                                onClick={() => setIsDetailsView(false)}
                            >
                                Zonewise details
                            </span> / {selectedRow?.prabhagname || "Prabhag Details"}
                        </>
                    )
                }
                infoText={dateText ? dateText : "Yearly Collection (All amounts shown are in lakhs.)"}
                className="mt-4"
            />

            {/* View Switcher Toggle Buttons (Shown for Summary View) */}
            {!isDetailsView && (
                <section className="container mx-auto mt-4 px-4">
                    <div className="flex justify-center gap-4">
                        <CustomButton
                            variant="view-toggle"
                            active={activeView === "table"}
                            onClick={() => {
                                setActiveView("table");
                                tableRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }}
                            icon={<TableIcon className="w-6 h-6" />}
                            title="Table View"
                        />

                        <CustomButton
                            variant="view-toggle"
                            active={activeView === "pie"}
                            onClick={() => {
                                setActiveView("pie");
                                pieRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }}
                            icon={<PieChart className="w-6 h-6" />}
                            title="Pie Chart View"
                        />

                        <CustomButton
                            variant="view-toggle"
                            active={activeView === "bar"}
                            onClick={() => {
                                setActiveView("bar");
                                barRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }}
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="Bar Chart View"
                        />
                    </div>
                </section>
            )}

            {/* Table Section */}
            <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
                <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                    {isDetailsView ? (
                        <>
                            {detailTableData.length > 0 ? (
                                <Table
                                    headers={detailHeaders}
                                    data={detailTableData}
                                    keyMapping={detailKeyMapping}
                                    pagination={true}
                                    rowsPerPage={10}
                                    customCellRenderer={detailCustomCellRenderer}
                                />
                            ) : (
                                <div className="text-center py-10 text-gray-500 font-medium">
                                    No details Found
                                </div>
                            )}
                        </>
                    ) : (
                        <Table
                            headers={headers}
                            data={tableData}
                            keyMapping={keyMapping}
                            pagination={true}
                            rowsPerPage={10}
                            customCellRenderer={{
                                prabhagname: (value, row) => {
                                    if (value === "Total") {
                                        return <span style={{ fontWeight: "bold" }}>{value}</span>;
                                    }
                                    return (
                                        <span
                                            style={{
                                                color: "#007bff",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() => handlePrabhagClick(row)}
                                        >
                                            {value}
                                        </span>
                                    );
                                },
                            }}
                        />
                    )}
                </div>
            </section>

            {/* Pie Chart Section (Shown for Summary View) */}
            {!isDetailsView && (
                <section className="container mx-auto mt-4 mb-5 px-4" ref={pieRef}>
                    <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                        <PieChartComponent data={pieChartData} />
                    </div>
                </section>
            )}

            {/* Bar Chart Section (Shown for Summary View) */}
            {!isDetailsView && (
                <section className="container mx-auto mt-4 mb-5 px-4" ref={barRef}>
                    <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                        <StackedBarGraph
                            data={barGraphData}
                            yAxisTitle="Amount"
                            seriesConfig={[
                                { name: "Authorized Amount", key: "authorized", color: "#10b981" },
                                { name: "Pending Amount", key: "pending", color: "#f59e0b" },
                            ]}
                        />
                    </div>
                </section>
            )}

            {/* 
            ====================================================
            Details Pie Chart and Bar Chart (Commented out for now)
            ====================================================
            {isDetailsView && (
                <>
                    <section className="container mx-auto mt-4 mb-5 px-4">
                        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                            <PieChartComponent data={detailPieChartData} />
                        </div>
                    </section>
                    <section className="container mx-auto mt-4 mb-5 px-4">
                        <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                            <StackedBarGraph
                                data={detailBarGraphData}
                                yAxisTitle="Amount"
                                seriesConfig={[{ name: "Amount", key: "amount", color: "#3b82f6" }]}
                            />
                        </div>
                    </section>
                </>
            )}
            */}

            {/* Details Modal when clicking any Prabhag link */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Prabhag Details: {selectedRow.prabhagname}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Receipt Summary Breakdown
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 my-6">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-emerald-700 font-semibold uppercase">
                                        Authorized Receipts
                                    </p>
                                    <p className="text-lg font-bold text-emerald-900 mt-1">
                                        {selectedRow.authorized_receipts} Receipts
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-emerald-700 font-semibold uppercase">
                                        Amount
                                    </p>
                                    <p className="text-lg font-bold text-emerald-900 mt-1">
                                        ₹
                                        {selectedRow.authorized_receipt_amount?.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-amber-700 font-semibold uppercase">
                                        Pending Receipts
                                    </p>
                                    <p className="text-lg font-bold text-amber-900 mt-1">
                                        {selectedRow.pending_receipts} Receipts
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-amber-700 font-semibold uppercase">
                                        Amount
                                    </p>
                                    <p className="text-lg font-bold text-amber-900 mt-1">
                                        ₹
                                        {selectedRow.pending_receipt_amount?.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">
                                        Total Receipts
                                    </p>
                                    <p className="text-lg font-bold text-blue-900 mt-1">
                                        {(selectedRow.authorized_receipts || 0) +
                                            (selectedRow.pending_receipts || 0)}{" "}
                                        Receipts
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-700 font-semibold uppercase">
                                        Total Amount
                                    </p>
                                    <p className="text-lg font-bold text-blue-900 mt-1">
                                        ₹
                                        {(
                                            (selectedRow.authorized_receipt_amount || 0) +
                                            (selectedRow.pending_receipt_amount || 0)
                                        ).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllZonesDetails;
