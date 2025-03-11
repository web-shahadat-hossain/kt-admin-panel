import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  as?: string;
  options?: { value: string; label: string }[];
  validation?: Yup.AnySchema;
}

interface DynamicFormProps {
  formFields: FormField[];
  onSubmit: (values: { [key: string]: any }) => void;
  initialValues: { [key: string]: any };
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formFields,
  onSubmit,
  initialValues,
}) => {
  const validationSchema = Yup.object(
    formFields.reduce((schema, field) => {
      if (field.validation) {
        schema[field.name] = field.validation;
      }
      return schema;
    }, {} as { [key: string]: Yup.AnySchema })
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          {formFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label htmlFor={field.name} className="block font-medium">
                {field.label}
              </label>
              {field.type === "select" ? (
                <Field
                  as="select"
                  id={field.name}
                  name={field.name}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full border rounded px-2 py-1"
                />
              )}
              <ErrorMessage
                name={field.name}
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          ))}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
