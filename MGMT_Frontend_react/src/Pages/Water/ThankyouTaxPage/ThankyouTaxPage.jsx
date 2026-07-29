import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Label from "../../../Components/Label/Label";
import TableComponent from "../../../Components/TableComponent";
import { Table as TableIcon, PieChart, BarChart3, Search } from "lucide-react";
import { formatDateForAPI } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import PieChartComp from "../../../Components/PieChart";
import BarGraphComponent from "../../../Components/BarGraphComponent";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import InputField from "../../../Components/InputField/InputField";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import { useLanguage } from "../../../Context/LanguageProvider";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  FormLayoutCard,
  SubHeaderCard,
  CustomButton,
} from "../../../Components/NewLayout";

const ThankyouTaxPage = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const { translate } = useLanguage();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [initialView, setInitialView] = useState(false);
  const [tableHeader] = useState([
    "Ward",
    "Arrears",
    "Current",
    "Total",
  ]);
  const [tableKeyMapping] = useState({
    Ward: "ward_name",
    Arrears: "arrears",
    Current: "current",
    Total: "total",
  });
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [initialValues] = useState({
    number: "",
    ward: "",
    amount: "",
    amountType: "एकूण",
    typeOfUse: "सर्व",
    constructionType: "सर्व",
  });

  const [activeView, setActiveView] = useState("table");

  const handleSubmit = async (values) => {
    console.log("vaues :", values);
    return;
  };

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Thankyou Tax"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ValidationSchemas(translate).ThankyouTaxPage}
      >
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => {
          return (
            <Form onSubmit={formikSubmit}>
              <FormLayoutCard
                onSubmit={formikSubmit}
                actionButtonText="Submit"
                actionButtonIcon={<Search className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label text="संख्या प्रविष्ट करा" />
                    <Field
                      name="number"
                      placeholder="Enter Top Count"
                      component={InputField}
                      restrictInput={inputHandlers.integer}
                    />
                    <ErrorMessage
                      name="number"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Label text="प्रभाग" />
                    <Field
                      name="ward"
                      component={InputField}
                      type="dropdown"
                      options={[{ label: "test", value: 2 }]}
                    />
                  </div>

                  <div>
                    <Label text="रक्कम" />
                    <Field
                      name="amount"
                      placeholder="Enter Top Count"
                      component={InputField}
                      restrictInput={inputHandlers.integer}
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <Field
                          name="amountType"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="एकूण"
                        />
                        <span>एकूण</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="amountType"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="मागील"
                        />
                        <span>मागील</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="amountType"
                          type="radio"
                          className="hover:cursor-pointer"
                          value="चालू"
                        />
                        <span>चालू</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label text="वापराचा प्रकार" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <Field
                          name="typeOfUse"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="सर्व"
                        />
                        <span>सर्व</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="typeOfUse"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="निवासी"
                        />
                        <span>निवासी</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="typeOfUse"
                          type="radio"
                          className="hover:cursor-pointer"
                          value="वाणिज्य"
                        />
                        <span>वाणिज्य</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label text="बांधकाम प्रकार" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <Field
                          name="constructionType"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="सर्व"
                        />
                        <span>सर्व</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="constructionType"
                          className="hover:cursor-pointer"
                          type="radio"
                          value="अधिकृत"
                        />
                        <span>अधिकृत</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Field
                          name="constructionType"
                          type="radio"
                          className="hover:cursor-pointer"
                          value="अनधिकृत"
                        />
                        <span>अनधिकृत</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FormLayoutCard>

              {initialView && (
                <>
                  <SubHeaderCard
                    subtitle="Ward"
                    title="All Wards"
                    infoText="All amounts are shown in lakhs"
                    className="mt-4"
                  />

                  <section className="container mx-auto mt-4 px-4">
                    <div className="flex justify-center gap-4">
                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "table"}
                        onClick={() => setActiveView("table")}
                        icon={<TableIcon className="w-6 h-6" />}
                        title="Table View"
                      />

                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "pie"}
                        onClick={() => setActiveView("pie")}
                        icon={<PieChart className="w-6 h-6" />}
                        title="Pie Chart View"
                      />

                      <CustomButton
                        variant="view-toggle"
                        active={activeView === "bar"}
                        onClick={() => setActiveView("bar")}
                        icon={<BarChart3 className="w-6 h-6" />}
                        title="Bar Chart View"
                      />
                    </div>
                  </section>
                </>
              )}
            </Form>
          );
        }}
      </Formik>

      {initialView && (
        <section className="container mx-auto mt-4 mb-5 px-4">
          <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            {activeView === "table" && (
              <TableComponent
                data={tableData}
                headers={tableHeader}
                keyMapping={tableKeyMapping}
              />
            )}

            {activeView === "pie" && (
              <PieChartComp
                data={chartData}
                title="Tax"
                description="Tax report"
              />
            )}

            {activeView === "bar" && (
              <BarGraphComponent
                data={barGraphData}
                title="Wardwise Daily Collection"
                description="Daily collection report"
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ThankyouTaxPage;
