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

const DefaulterListProp = () => {
  const { translate } = useLanguage();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const tableRef = useRef(null);
  const orgId = user?.data?.OrgId;
  const userid = user?.userId || "";
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    navigate("/propertydashboard");
  };

  const toast = (msg) => alert(msg);

  const handleSubmit = async (values) => {
    const { amount, demand, number } = values;

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

      const { data } = await apiService.post("generic-call", payload);

      if (data?.errorcode === 9999 && Array.isArray(data?.data?.jsondata)) {
        setTableData(data.data.jsondata);
        setTimeout(() => {
          tableRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "center"
                        });
        }, 100)
      } else {
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
        subtitle="Property Tax"
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
        {({
          setFieldValue,
          values,
          handleSubmit: formikSubmit,
        }) => {
          return (
            <Form onSubmit={formikSubmit}>
              <FormLayoutCard
                onSubmit={formikSubmit}
                actionButtonText="Search"
                actionButtonIcon={<Search className="w-5 h-5" />}
              >
                <div className="space-y-4">
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
                  </div>

                  <div>
                    <Label text="Type :" required />
                    <div className="flex flex-wrap gap-2">
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

                  <div>
                    <Label text="Residency Type :" required />
                    <div className="flex flex-wrap gap-2">
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

                  <div>
                    <Label text="Authorization :" required />
                    <div className="flex flex-wrap gap-2">
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
              pagination={true}
              rowsPerPage={10}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default DefaulterListProp;

