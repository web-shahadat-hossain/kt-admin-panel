import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/student/Model";
import DynamicForm from "../../components/student/DynamicForm";
import { Switch } from "@/components/ui/switch";
import {
  createsubject,
  fetchAllsubject,
  togglesubjectStatus,
  updatasubject,
} from "../../store/slices/subject-slice";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllStandards } from "@/store/slices/standard-slice";
import SubjectDialog from "@/components/student/SubjectFormModel";
import { Subject } from "@/types/subject";

export const SubjectPage = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<Subject | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { subjects, isLoading } = useSelector(
    (state: RootState) => state.subject
  );

  const { standards, isLoading: stdLoading } = useSelector(
    (state: RootState) => state.standard
  );

  useEffect(() => {
    dispatch(fetchAllsubject(""));
    dispatch(fetchAllStandards());
  }, [dispatch]);

  const formFields = [
    {
      name: "subject",
      label: "Subject Name",
      type: "text",
      placeholder: "Enter subject name",
      validation: Yup.string().required("Subject Name is required."),
    },
    {
      name: "standard",
      label: "Standard",
      type: "select", // Indicate that this field is a select dropdown
      options: standards.map((standard) => ({
        value: standard._id,
        label: standard.std,
      })),
    },
  ];

  const initialValues: Record<string, any> = formFields.reduce(
    (values, field) => {
      values[field.name] = "";
      return values;
    },
    {}
  );

  const handleSubmit = (values: Record<string, any>) => {
    if (currentData) {
      dispatch(updatasubject({ id: currentData._id, data: values }));
    } else {
      dispatch(createsubject(values));
    }
    setShowForm(false);
    setCurrentData(null);
  };

  const handleEdit = (data: Subject) => {
    setCurrentData(data);
    setShowForm(true);
  };

  const handleToggle = (id: string) => {
    dispatch(togglesubjectStatus(id));
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Subjects</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setCurrentData(null);
              setShowForm(!showForm);
            }}
          >
            Add Subject
          </button>
        </div>

        {/* <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <h2 className="text-xl font-bold mb-4">
            {currentData ? "Edit Subject" : "Add Subject"}
          </h2>
          <DynamicForm
            formFields={formFields}
            initialValues={currentData || initialValues}
            onSubmit={handleSubmit}
          />
        </Modal> */}

        <SubjectDialog
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          initialValues={currentData}
          onSubmit={handleSubmit}
          dropdownItems={standards}
        />

        <table className="min-w-full border-collapse border border-gray-300 mt-5 bg-white">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">Subject Name</th>
              <th className="border border-gray-300 px-4 py-2">Standard</th>
              <th className="border border-gray-300 px-4 py-2">isActive</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subjects) &&
              subjects.map((value, index) => (
                <tr key={value._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {value.subject}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {value.standard ? value.standard?.std : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Switch
                      id={value._id}
                      checked={value.isActive}
                      onCheckedChange={() => handleToggle(value._id)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(value)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
