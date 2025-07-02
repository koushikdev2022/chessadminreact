import React, { useState } from "react";
import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const ManageBatch = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [rowData] = useState([
    {
      name: "USA-FG-767",
      student: "Anuj Sharma, Soumalya Chandra, Megha Sharma,... ",
      country: "USA",
      limit: "10 Students",
      coach: "Garry Charles",
      manager: "Koushik Roy",
    },
  ]);

  const [columnDefs] = useState([
    {
      field: "name",
      headerName: "Batch Name",
      sortable: true,
      filter: true,
    },
    {
      field: "student",
      headerName: "Batch Students",
      sortable: true,
      filter: true,
    },
    { field: "country", headerName: "Country", sortable: true, filter: true },
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
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: () => (
        <div className="flex gap-0">
          <Button>
            <BiSolidMessageSquareEdit className="text-[#34A0A4] hover:text-black text-2xl" />
          </Button>
          <Button>
            <MdDelete className="text-[#F94141] hover:text-[#ff0000] text-2xl" />
          </Button>
        </div>
      ),
    },
    {
      headerName: "Details",
      field: "Details",
      cellRenderer: () => (
        <Button
          onClick={() => setOpenDetailsModal(true)}
          className="border text-[#52b69a] border-[#52b69a] bg-white hover:bg-[#52b69a] hover:text-white text-xl px-6 py-0 my-1"
        >
          Details
        </Button>
      ),
    },
  ]);
  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mange Batches</h2>
            <Button
              onClick={() => setOpenModal(true)}
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
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
            />
          </div>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="border-0 pb-0">Add New Batch</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 popup_section">
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch name" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter batch name"
                  required
                />
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Relationship Manager" />
                </div>
                <Select required>
                  <option>Enter relationship manager</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <Select required>
                  <option>Choose coach</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter batch limit"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Country" />
                </div>
                <Select required>
                  <option>Select Country</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                </Select>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Planned Start Date" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter planned start date"
                  required
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            className="bg-[#000000] hover:bg-[#9b1c1c]"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button className="bg-[#52b69a] hover:bg-black">Add Parent</Button>
        </Modal.Footer>
      </Modal>

      {/*  */}
      <Modal show={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Modal.Header className="border-0 pb-0">Batch Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 popup_section">
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch name" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Anuj</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Relationship Manager" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Relationship Manager</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <p className="text-[#8E8E8E] text-sm">Sharma</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <p className="text-[#8E8E8E] text-sm">10 Students</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Country" />
                </div>
                <p className="text-[#8E8E8E] text-sm">USA</p>
              </div>
              <div className="w-6/12">
                <div className="mb-1 block">
                  <Label value="Planned Start Date" />
                </div>
                <p className="text-[#8E8E8E] text-sm">02-05-25</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/*  */}
    </div>
  );
};

export default ManageBatch;
