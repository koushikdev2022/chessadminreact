import React, { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label, ToggleSwitch } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllCourse } from "../../Reducer/CourseSlice";
import { useSelector } from "react-redux";
import { MdDelete, MdDeleteForever, MdEditNote } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { BiSolidMessageSquareEdit } from "react-icons/bi";

const ManageCourses = () => {
  // const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, allCourseData } = useSelector((state) => state?.courses);

  const [courseId, setCourseId] = useState();
  const [switchStatus, setSwitchStatus] = useState(false);


  useEffect(() => {
    dispatch(getAllCourse()).then((res) => {
      // setCourseId(res)
      console.log("res", res);
    });
  }, []);
  // console.log("allCourseData",allCourseData)

  const handleDelete = () => {
    console.log("delete");
  };
  const handleEdit = () => {
    console.log("edit");
  };
  const handleCourseDetails = (id) => {
    // console.log("id",id)
    navigate(`/course-details/${id}`);
  };
  
  const handleAddCourse = () => {
    navigate("/add-course");
  };

  const handleStatus = (id,status) => {
    console.log("rid",id)
    if (status) {
      alert("Status changed to inactive")
    }else{
      setSwitchStatus(true)
      alert("Status changed to active")

    }
  }

  const [columnDefs] = useState([
    {
      field: "title",
      headerName: "Course Title",
      sortable: true,
      filter: true,
    },
    {
      field: "sub_title",
      headerName: "Course Subtitle",
      sortable: true,
      filter: true,
    },
    {
      field: "level",
      headerName: "Course Level",
      valueFormatter: (params) => params.data?.Level?.level_name || "",
      sortable: true,
      filter: true,
    },
    {
      field: "duration_integer",
      headerName: "Course Duration",
      valueFormatter: (params) => {
        const data = params?.data;
        if (data?.duration_string === 0) {
          return `${data?.duration_integer} Week(s)`;
        } else if (data?.duration_string === 1) {
          return `${data?.duration_integer} Month(s)`;
        } else {
          return `${data?.duration_integer} Year(s)`;
        }
      },
      sortable: true,
      filter: true,
    },

    // {
    //   headerName: "Action",
    //   field: "Action",
    //   cellRenderer: () => (
    //     <div className="flex justify-start items-center h-full gap-2">
    //       <BiSolidMessageSquareEdit
    //         className="text-[#34A0A4] hover:text-black text-2xl text-center cursor-pointer"
    //         onClick={handleEdit}
    //       />
    //       <MdDelete
    //         className="text-[#F94141] hover:text-[#ff0000] text-2xl text-center cursor-pointer"
    //         onClick={handleDelete}
    //       />
    //     </div>
    //   ),
    // },

    {
      headerName: "Details",
      field: "Details",
      cellRenderer: (params) => (
        <div className="flex justify-start items-center h-full">
          <Button
            className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-xl px-6 py-0 my-1"
            onClick={() => handleCourseDetails(params.data.id)}
          >
            Details
          </Button>
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "Status",
      cellRenderer: (params) => (
        <div className="flex justify-start items-center h-full gap-2">
         <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={params?.data?.status}
                              onChange={() => handleStatus(params?.data?.id,params?.data?.status)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#52b69a] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#52b69a] relative"></div>
                          </label>
        </div>
      ),
    },
  ]);


  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Course Details</h2>
            <Button
              onClick={() => handleAddCourse()}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Course
            </Button>
          </div>
          {allCourseData && (
            <div
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              {loading ? (
                "Loading..."
              ) : (
                <AgGridReact
                  rowData={allCourseData}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="autoHeight"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Course</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Course Name" />
              </div>
              <TextInput id="name" type="text" placeholder="Enter course name" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Phone Number" />
              </div>
              <TextInput id="phone" type="tel" placeholder="Enter phone number" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput id="email" type="email" placeholder="Enter email" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="address" value="Physical Address" />
              </div>
              <TextInput id="address" type="text" placeholder="Enter address" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="country" value="Country" />
              </div>
              <TextInput id="country" type="text" placeholder="Enter country" required />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button color="success">Add Course</Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default ManageCourses;
