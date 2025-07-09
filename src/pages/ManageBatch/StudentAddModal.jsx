// import { Modal } from "flowbite-react";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { getStudentList } from "../../Reducer/BatchSlice";

// const StudentAddModal = ({
//   openStudentModal,
//   setOpenStudentModal,
//   batchId,
// }) => {
//   const { studentData } = useSelector((state) => state?.batch);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getStudentList());
//   }, []);
//   console.log("studentData: ", studentData);

//   return (
//     <>
//       <Modal
//         show={openStudentModal}
//         onClose={() => setOpenStudentModal(false)}
//         size="7xl"
//       >
//         <Modal.Header>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Add Students</h2>
//           </div>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="flex flex-col lg:flex-row gap-6">
//             <div className="w-full lg:w-2/3"></div>
//             <div className="w-full lg:w-1/3 border-l pl-4"></div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };
// export default StudentAddModal;

import { Modal, TextInput, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, getStudentList } from "../../Reducer/BatchSlice";
import { toast, ToastContainer } from "react-toastify";

const StudentAddModal = ({
  openStudentModal,
  setOpenStudentModal,
  batchId,
}) => {
  const dispatch = useDispatch();
  const { studentData } = useSelector((state) => state?.batch); // assume studentData === response.data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    dispatch(getStudentList());
  }, [dispatch]);

  useEffect(() => {
    const users = studentData?.data?.users || [];

    const filtered = users.filter((student) => {
      const fullName = `${student.f_name} ${student.l_name}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredStudents(filtered);
  }, [searchTerm, studentData]);

  const handleAddStudent = (studentId) => {
    dispatch(addStudent({ batch_id: batchId, student_id: studentId })).then(
      (res) => {
        console.log("addStudentres", res);

        if (res?.payload?.status_code === 201) {
          toast.success(res?.payload?.message);
          dispatch(getStudentList());
        } else if (res?.payload?.response?.data?.status_code === 422) {
          toast.error(res?.payload?.response?.data?.message);
        }
      }
    );
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <Modal
        show={openStudentModal}
        onClose={() => setOpenStudentModal(false)}
        size="7xl"
      >
        <Modal.Header>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">Add Students</h2>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-4">
            <TextInput
              placeholder="Search by name, username, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              {filteredStudents.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <li
                      key={student.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {student.f_name} {student.l_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Username: {student.username} | Email: {student.email}
                        </p>
                      </div>
                      <Button
                        className="bg-[#52b69a] hover:bg-black px-2 py-1 text-white text-sm font-medium flex justify-center items-center rounded-md"
                        size="xs"
                        onClick={() => handleAddStudent(student.id)}
                      >
                        Add
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No students found.</p>
              )}
            </div>

            {/* <div className="w-full lg:w-1/3 border-l pl-4">
            <p className="text-gray-500 italic">
              You can display selected students or preview here.
            </p>
          </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StudentAddModal;
