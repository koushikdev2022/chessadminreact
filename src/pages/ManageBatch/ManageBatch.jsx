import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ohBatchList } from "../../Reducer/BatchSlice";

const ManageBatch = () => {
  const { batchList } = useSelector((state) => state?.batch);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ohBatchList());
  }, []);
  console.log("batchList", batchList);

  const transformedRowData = useMemo(() => {
    return batchList?.data?.map((batch) => ({
      id: batch.id,
      name: batch.batch_name || "-",
      student:
        batch?.User?.map((u) => `${u.f_name} ${u.l_name}`).join(", ") || "-",
      // country: batch?.country_id || "-",
      limit: `${batch?.student_limit} Students`,
      coach: batch?.Coach
        ? `${batch?.Coach?.f_name} ${batch?.Coach?.l_name}`
        : "-",
      manager: "N/A", // Replace with actual RM data if available
    }));
  }, [batchList]);

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Batch Name",
        sortable: true,
        filter: true,
      },
      // {
      //   field: "student",
      //   headerName: "Batch Students",
      //   sortable: true,
      //   filter: true,
      //   flex: 2,
      // },
      // {
      //   field: "country",
      //   headerName: "Country",
      //   sortable: true,
      //   filter: true,
      // },
      {
        field: "limit",
        headerName: "Batch Limit",
        sortable: true,
        filter: true,
      },
      {
        field: "coach",
        headerName: "Batch Coach",
        sortable: true,
        filter: true,
      },
      {
        field: "manager",
        headerName: "Relationship Manager",
        sortable: true,
        filter: true,
      },
      // {
      //   headerName: "Actions",
      //   field: "actions",
      //   cellRenderer: (params) => (
      //     <div className="flex gap-2">
      //       <Button size="xs">
      //         <BiSolidMessageSquareEdit className="text-[#34A0A4] hover:text-black text-xl" />
      //       </Button>
      //       <Button size="xs">
      //         <MdDelete className="text-[#F94141] hover:text-[#ff0000] text-xl" />
      //       </Button>
      //     </div>
      //   ),
      // },
      {
        headerName: "Details",
        field: "details",
        cellRenderer: (params) => (
          <Button
            onClick={() => handleBatchDetails(params?.data?.id)}
            className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
          >
            Details
          </Button>
        ),
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: (params) => (
          <Button
            onClick={() => handleBatchDetails(params?.data?.id)}
            className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-sm px-4 py-1"
          >
            Add Student
          </Button>
        ),
      },
    ],
    []
  );

  const handleAddBatch = () => {
    navigate("/add-batch");
  };

  const handleBatchDetails = (id) => {
    navigate("/view-batch-details", {
      state: { batch_id: id },
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mange Batches</h2>
            <Button
              onClick={() => handleAddBatch()}
              className="bg-[#52b69a] hover:bg-black px-4 py-1 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add New Batch
            </Button>
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={transformedRowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBatch;
