import * as Yup from "yup";
import { getValidationRules } from "./rules";
import { useLanguage } from "../../Context/LanguageProvider";

export const ValidationSchemas = (translate) => {
  const validationRules = getValidationRules(translate);
  return {
    ThankyouTaxPage: Yup.object().shape({
      number: Yup.number()
        .typeError("This field must be a number")
        .required("This field is required"),
      amount: Yup.number()
        .typeError("This field must be a number")
        .required("This field is required"),
    }),
    CollectionEntry: Yup.object().shape({
      amount: Yup.number().typeError("This field must be number").required("This field is required"),
      number: Yup.string().required("This field is required"),
      demand: Yup.string().required("This field is required"),
      usageType: Yup.string().required("This field is required"),
      buildType: Yup.string().required("This field is required"),
    }),
  };
};
