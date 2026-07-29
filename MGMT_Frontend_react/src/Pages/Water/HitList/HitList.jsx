import React, { useRef, useState } from "react";
import Label from "../../../Components/Label/Label";
import InputField from "../../../Components/InputField/InputField";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import RadioButton from "../../../Components/RadioButton/RadioButton";
import { useLanguage } from "../../../Context/LanguageProvider";
import Table from "../../../Components/Table/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  PageHeader,
  FormLayoutCard,
} from "../../../Components/NewLayout";

const HitList = () => {
  const { translate } = useLanguage();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const userid = user?.userId || "";
  const orgId = user?.data?.OrgId;
  const navigate = useNavigate();
  const [selectedtotaldemand, setSelectedTotalDemand] = useState("");
  const [selectedUsageType, setSelectedUsageType] = useState("All");
  const [selectedBuildType, setSelectedBuildType] = useState("All");

  const [tableData, setTableData] = useState([]);
  const headers = [
    "Name",
    "Zone",
    "Block",
    "Property No.",
    "Arrears",
    "Current",
    "Total",
    "Mobile",
  ];

  const handleChange = (e) => {
    setSelectedTotalDemand(e.target.value);
    setSelectedUsageType(e.target.value);
    setSelectedBuildType(e.target.value);
  };

  const handleGoBack = () => {
    navigate("/waterdashboard");
  };

  const toast = (msg) => alert(msg);

  const handleSubmit = async (values, { resetForm }) => {
    const { amount, ward, demand, usageType, buildType, number } = values;
    if (!userid) {
      alert("UserId is not set");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        Request1: `MobApp$Defaulter_List$${userid}$${orgId}~${number}~~${amount}~${demand}~~`,
        Request2: "",
        Request3: "",
        Request4: "",
        Request5: "",
        Request6: "",
        Request7: "",
      };

      const { data } = await apiService.post("WTgeneric-call", payload);

      if (
        Array.isArray(data?.data?.jsondata) &&
        data?.data?.jsondata?.length > 0
      ) {
        const jsonData = data.data.jsondata;
        const totalRow = jsonData.reduce(
          (acc, cur) => {
            acc.pbaltax += Number(cur.pbaltax) || 0;
            acc.baltax += Number(cur.baltax) || 0;
            acc.total += Number(cur.total) || 0;
            return acc;
          },
          {
            prop_owner: "Total",
            zonename: "",
            blockname: "",
            propno: "",
            pbaltax: 0,
            baltax: 0,
            total: 0,
            mobile: "",
          }
        );
        totalRow.pbaltax = totalRow.pbaltax.toFixed(2);
        totalRow.baltax = totalRow.baltax.toFixed(2);
        totalRow.total = totalRow.total.toFixed(2);

        setTableData([...jsonData, totalRow]);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          })
        }, 100);
      } else {
        setTableData([]);
        toast("No data found.");
      }
    } catch (error) {
      console.error(error);
      toast("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Defaulter List"
        subtitle="Water Tax"
        onBack={handleGoBack}
      />

      <Formik
        initialValues={{
          amount: "",
          number: "",
          demand: 1,
          usageType: 1,
          buildType: 1,
        }}
        validationSchema={ValidationSchemas(translate).CollectionEntry}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, handleSubmit: formikSubmit }) => {
          return (
            <Form onSubmit={formikSubmit}>
              <FormLayoutCard
                onSubmit={formikSubmit}
                actionButtonText="Search"
                actionButtonIcon={<Search className="w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label text="No. of Entries :" required />
                    <Field
                      name="number"
                      className="form-select"
                      component={InputField}
                      type="text"
                      placeholder="Enter Top Count"
                    />
                    <ErrorMessage
                      name="number"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Label text="Amount :" required />
                    <Field
                      name="amount"
                      className="form-select"
                      component={InputField}
                      restrictInput={inputHandlers.integer}
                      type="text"
                      placeholder="₹ Amount"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label text="Type :" required />
                    <div className="flex flex-wrap gap-3 mt-1">
                      {[
                        { label: "Total", value: 1 },
                        { label: "Arrears", value: 2 },
                        { label: "Current", value: 3 },
                      ].map((item) => (
                        <RadioButton
                          key={item.value}
                          name="demand"
                          label={item.label}
                          value={item.value}
                          checked={values.demand === item.value}
                          onChange={() => setFieldValue("demand", item.value)}
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      name="demand"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label text="Residency Type :" required />
                    <div className="flex flex-wrap gap-3 mt-1">
                      {[
                        { label: "All", value: 1 },
                        { label: "Residential", value: 2 },
                        { label: "Commercial", value: 3 },
                      ].map((item) => (
                        <RadioButton
                          key={item.value}
                          name="usageType"
                          label={item.label}
                          value={item.value}
                          checked={values.usageType === item.value}
                          onChange={() => setFieldValue("usageType", item.value)}
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      name="usageType"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label text="Authorization :" required />
                    <div className="flex flex-wrap gap-3 mt-1">
                      {[
                        { label: "All", value: 1 },
                        { label: "Authorized", value: 2 },
                        { label: "Unauthorized", value: 3 },
                      ].map((item) => (
                        <RadioButton
                          key={item.value}
                          name="buildType"
                          label={item.label}
                          value={item.value}
                          checked={values.buildType === item.value}
                          onChange={() => setFieldValue("buildType", item.value)}
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      name="buildType"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </FormLayoutCard>
            </Form>
          );
        }}
      </Formik>

      {tableData.length > 0 && (
        <section className="container mx-auto mt-4 mb-5 px-4" ref={tableRef}>
          <div className="rounded-[24px] bg-white p-4 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <Table
              headers={headers}
              data={tableData}
              keyMapping={{
                Name: "prop_owner",
                Zone: "zonename",
                Block: "blockname",
                "Property No.": "propno",
                Arrears: "pbaltax",
                Current: "baltax",
                Total: "total",
                Mobile: "mobile",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default HitList;
