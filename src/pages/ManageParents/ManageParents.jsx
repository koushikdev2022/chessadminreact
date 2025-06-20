import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ManageParents = () => {
  const [openModal, setOpenModal] = useState(false);

  const [rowData] = useState([
    {
      name: 'Sample Parent',
      phone: '+1234567890',
      email: 'parent@example.com',
      address: '123 Parent Street',
      country: 'United States'
    }
  ]);

  const [columnDefs] = useState([
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'phone', headerName: 'Phone No', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
    { field: 'address', headerName: 'Physical Address', sortable: true, filter: true },
    { field: 'country', headerName: 'Country', sortable: true, filter: true },
    {
      headerName: 'Students',
      field: 'students',
      cellRenderer: () => (
        <Button size="sm" color="success">
          View Students
        </Button>
      )
    }
  ]);

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Parent Details</h2>
            <Button 
              onClick={() => setOpenModal(true)}
              className="bg-[#AB54DB] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
            >
              Add Parent
            </Button>
          </div>
          <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout='autoHeight'
            />
          </div>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Parent</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Parent Name" />
              </div>
              <TextInput id="name" type="text" placeholder="Enter parent name" required />
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
          <Button color="success">Add Parent</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageParents; 