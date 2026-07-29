import { useState } from "react";

const tableData = [
    { ward: "Ward No.1", arrears: "1.96", current: "17.93", total: "19.89" },
    { ward: "Ward No.2", arrears: "0.55", current: "10.54", total: "11.09" },
    { ward: "Ward No.3", arrears: "1.04", current: "22.17", total: "23.21" },
    { ward: "Ward No.4", arrears: "11.29", current: "90.65", total: "101.94" },
    { ward: "Ward No.5", arrears: "7.20", current: "60.68", total: "67.88" },
    { ward: "Ward No.6", arrears: "6.51", current: "24.85", total: "31.36" },
];

// export default function DashboardTable() {
//     return (

//         <div className="overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="border-b border-gray-900" style={{
//                             borderBottomWidth: 1,
//                             borderBottomColor: "gray"
//                         }}>
//                             <th className="px-2 py-2 text-left text-md font-bold">
//                                 Ward
//                             </th>
//                             <th className="px-3 py-2 text-left text-md font-bold">
//                                 Arrears
//                             </th>
//                             <th className="px-3 py-2 text-left text-md font-bold">
//                                 Current
//                             </th>
//                             <th className="px-3 py-2 text-left text-md font-bold">
//                                 Total
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {tableData.map((row) => (
//                             <tr
//                                 key={row.ward}
//                                 className="border-b border-gray-200"
//                             >
//                                 <td className="px-2 py-2 text-md">
//                                     {row.ward}
//                                 </td>

//                                 <td className="px-3 py-2 text-md">
//                                     {row.arrears}
//                                 </td>

//                                 <td className="px-3 py-2 text-md">
//                                     {row.current}
//                                 </td>

//                                 <td className="px-3 py-2 text-md font-bold">
//                                     {row.total}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>

//                     <tfoot>
//                         <tr className="border-t border-gray-300">
//                             <td className="px-2 py-2 text-md font-bold">
//                                 Total
//                             </td>

//                             <td className="px-3 py-2 text-md font-bold">
//                                 28.55
//                             </td>

//                             <td className="px-3 py-2 text-md font-bold">
//                                 226.82
//                             </td>

//                             <td className="px-3 py-2 text-md font-bold">
//                                 255.37
//                             </td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>
//     );
// }

export default function DashboardTable({
    columns,
    data,
    footer,
    className = "",
}) {
    return (
        <div
            className={`overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${className}`}
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "gray"
                            }}
                        >
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-3 py-2 text-left text-md font-bold"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id ?? rowIndex}
                                className="border-b border-gray-200"
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: "gray"
                                }}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-3 py-2 text-md ${column.bold ? "font-bold" : ""
                                            }`}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    {footer && (
                        <tfoot>
                            <tr className="border-t border-gray-300">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-3 py-2 text-md font-bold"
                                    >
                                        {footer[column.key]}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}