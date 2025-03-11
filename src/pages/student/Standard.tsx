import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicForm from "../../components/student/DynamicForm";
import * as Yup from "yup";
import {
  updateStandard,
  fetchAllStandards,
  toggleStandardStatus,
  createStandard,
} from "../../store/slices/standard-slice";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/student/Model";
import { Switch } from "@/components/ui/switch";
import { AppDispatch } from "@/store/store";
import { Standard } from "@/types/standard";

const StandardTable: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<Standard | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { standards, isLoading } = useSelector((state: any) => state.standard);
  console.log(standards, "standards");

  useEffect(() => {
    dispatch(fetchAllStandards());
  }, [dispatch]);

  const formFields = [
    {
      name: "std",
      label: "Standard Name",
      type: "text",
      placeholder: "Enter standard name",
      validation: Yup.string().required("Standard Name is required."),
    },
  ];

  const initialValues = formFields.reduce((values, field) => {
    values[field.name] = "";
    return values;
  }, {} as { [key: string]: any });

  const handleSubmit = (values: Standard) => {
    console.log(values, "values");

    if (currentData) {
      dispatch(updateStandard({ id: currentData._id, data: values }));
    } else {
      dispatch(createStandard(values));
    }
    setShowForm(false);
    setCurrentData(null);
  };

  const handleEdit = (data: Standard) => {
    console.log(data, "update data");

    setCurrentData(data);
    setShowForm(true);
  };

  const handleToggle = (id: string) => {
    console.log(id, "toggle");

    dispatch(toggleStandardStatus(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Standards</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            setCurrentData(null);
            setShowForm(!showForm);
          }}
        >
          Add Standard
        </button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <h2 className="text-xl font-bold mb-4">
          {currentData ? "Edit Standard" : "Add Standard"}
        </h2>
        <DynamicForm
          formFields={formFields}
          initialValues={currentData || initialValues}
          onSubmit={handleSubmit}
        />
      </Modal>

      <table className="min-w-full border-collapse border border-gray-300 mt-5 bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Standard Name</th>
            <th className="border border-gray-300 px-4 py-2">isActive</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(standards) &&
            standards.map((value: Standard, index: number) => (
              <tr key={value._id || index}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {value.std}
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
  );
};

export default StandardTable;
