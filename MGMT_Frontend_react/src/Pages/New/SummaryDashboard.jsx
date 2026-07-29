import { useState } from "react";
import {
    BsSearch,
    BsBell,
    BsPersonCircle,
    BsCashStack
} from "react-icons/bs";
import {
    FaBuilding,
    FaWallet,
    FaChartPie,
    FaChartBar,
    FaUniversity,
    FaHome,
    FaCheckCircle
} from "react-icons/fa";
import DashboardCard from "../../Components/NewDashboardCard";

const activities = [
    "Receipt Generated Successfully",
    "Property Updated",
    "Tax Collected",
];

const SummaryDashboard = () => {
    return (
        <div className="min-h-screen bg-[#eef4ff]">
            <header className="bg-gradient-to-br from-[#0F3FAE] to-[#3D71F5] px-5 pt-[25px] pb-[45px] rounded-b-[30px] text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between">
                    <div>
                        <small className="text-white/50">
                            Welcome Back
                        </small>

                        <h2 className="text-2xl font-bold">
                            Property Dashboard
                        </h2>
                    </div>

                    <div className="flex gap-[10px]">
                        <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                            borderRadius: "50%"
                        }}>
                            <BsSearch size={20} />
                        </button>

                        <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                            borderRadius: "50%"
                        }}>
                            <BsBell size={20} />
                        </button>

                        <button className="flex h-[42px] w-[42px] items-center justify-center border-0 bg-white/20 text-[20px] text-white backdrop-blur-[10px]" style={{
                            borderRadius: "50%"
                        }}>
                            <BsPersonCircle size={20} />
                        </button>
                    </div>
                </div>
            </header>
            <div className="mx-auto w-[100%] lg:w-[40%]">
                <section class="container mx-auto mt-4 sm:mt-5 px-4">
                    <div class="bg-white rounded-[28px] p-6 -mt-6 sm:-mt-7 md:-mt-9 shadow-lg ">
                        <div class="grid grid-cols-2 gap-4 items-center">

                            <div>
                                <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:gap-2">
                                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-green-700 text-white shadow-lg">
                                        <BsCashStack size={32} />
                                    </div>

                                    <div className=" lg:text-left">
                                        <small className="block text-gray-700">Total Collection</small>

                                        <h3
                                            className="my-1 text-3xl font-bold"
                                            style={{ fontWeight: 700 }}
                                        >
                                            ₹1.20 Cr
                                        </h3>

                                        <span className="text-sm text-gray-700">This Week</span>
                                    </div>
                                </div>
                            </div>


                            <div class="border-l border-gray-200 pl-5">
                                <h1 class="font-bold text-pink-700 leading-none"
                                    style={{
                                        color: "#C2185B",
                                        fontWeight: 700
                                    }}
                                >53</h1>

                                <p class="mb-2 text-gray-600">
                                    Pending Accounts
                                </p>

                                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full w-[65%] bg-red-500 rounded-full"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <section class="container mx-auto mt-7 px-4">
                    <div class="grid grid-cols-2 gap-3">


                        <DashboardCard
                            icon={FaWallet}
                            title="Wardwise Tax Collection"
                            subtitle="Today's Total"
                            value="₹15K"
                            iconBg="bg-orange-500"
                        />

                        <DashboardCard
                            icon={FaBuilding}
                            title="Wardwise Tax Demand"
                            subtitle="City Demand"
                            value="₹4.5M"
                            iconBg="bg-blue-500"
                        />

                        <DashboardCard
                            icon={FaChartPie}
                            title="Division Report"
                            subtitle="Target"
                            value="40%"
                            iconBg="bg-cyan-500"
                        />

                        <DashboardCard
                            icon={FaChartBar}
                            title="Daily Collection"
                            subtitle="Wardwise"
                            value="₹3K"
                            iconBg="bg-purple-500"
                        />

                        <DashboardCard
                            icon={FaUniversity}
                            title="Legal / Illegal"
                            subtitle="Cases"
                            value="5"
                            iconBg="bg-slate-700"
                        />

                        <DashboardCard
                            icon={FaHome}
                            title="Residential / Commercial"
                            subtitle="Ratio"
                            value="60 : 40"
                            iconBg="bg-teal-500"
                        />

                    </div>
                </section>
                <section class="container mx-auto mt-7 px-4">
                    <div className="rounded-[22px] bg-white p-3 shadow-lg">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-lg font-medium">Recent Activities</h4>

                            <a href="#" className="text-blue-600 no-underline hover:underline">
                                View All
                            </a>
                        </div>

                        <ul className="list-none m-0 p-0">
                            {activities.map((activity, index) => (
                                <li
                                    key={activity}
                                    className={`flex items-center gap-1 py-2 text-[15px] ${index !== activities.length - 1 ? "border-b border-gray-200" : ""
                                        }`}
                                >
                                    <FaCheckCircle className="text-green-500 shrink-0" />
                                    <span>{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <div style={{ height: "100px" }}></div>
            </div>

        </div>
    )
}

export default SummaryDashboard;