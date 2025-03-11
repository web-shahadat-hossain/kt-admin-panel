import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicForm from "../../components/student/DynamicForm";
import * as Yup from "yup";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/student/Model";
import {
  createboard,
  fetchAllboard,
  updataboard,
  toggleboardStatus,
} from "../../store/slices/board-slice";
import { Switch } from "@/components/ui/switch";
import { AppDispatch, RootState } from "@/store/store";

interface BoardData {
  _id?: string;
  boardname: string;
  boardshortname: string;
  isActive: boolean;
}

const Board: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentData, setCurrentData] = useState<BoardData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { board, isLoading } = useSelector((state: RootState) => state.board);

  useEffect(() => {
    dispatch(fetchAllboard());
  }, [dispatch]);

  const formFields = [
    {
      name: "boardname",
      label: "Board Name",
      type: "text",
      placeholder: "Enter Board Full Name",
      validation: Yup.string().required("Board Name is required."),
    },
    {
      name: "boardshortname",
      label: "Board Short Name",
      type: "text",
      placeholder: "Enter Board Short Name",
      validation: Yup.string().required("Board Short Name is required."),
    },
  ];

  const initialValues = formFields.reduce((values, field) => {
    values[field.name] = "";
    return values;
  }, {} as { [key: string]: any });

  const handleSubmit = (data: BoardData) => {
    if (currentData) {
      dispatch(updataboard({ _id: currentData._id, data }));
    } else {
      dispatch(createboard(data));
    }
    setShowForm(false);
    setCurrentData(null);
  };

  const handleToggle = (id: string) => {
    dispatch(toggleboardStatus({ boardId: id }));
  };

  const handleEdit = (data: BoardData) => {
    setCurrentData(data);
    setShowForm(true);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Boards</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setCurrentData(null);
              setShowForm(!showForm);
            }}
          >
            Add Board
          </button>
        </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <h2 className="text-xl font-bold mb-4">
            {currentData ? "Edit Board" : "Add Board"}
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
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Short Name</th>
              <th className="border border-gray-300 px-4 py-2">isActive</th>
              <th className="border border-gray-300 px-4 py-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(board) &&
              board.map((value: BoardData, index: number) => (
                <tr key={value._id || index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {value.boardname}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {value.boardshortname}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Switch
                      id={value._id} // Assuming `_id` is the unique identifier for the switch
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

export default Board;
