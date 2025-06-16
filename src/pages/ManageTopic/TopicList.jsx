import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getTopics } from "../../Reducer/TopicSlice";
import { useSelector } from "react-redux";
import userRoles from "../utils/userRoles";

const TopicList = () => {
    const dispatch = useDispatch();
    const { allTopics } = useSelector((state) => state?.topicsData);
    console.log("allTopics", allTopics)
    const currentUserRole = userRoles();

    useEffect(() => {
        dispatch(getTopics())
    }, [dispatch]);

    const handleEditTopic = () => {

    };

    const StatusCellRenderer = (props) => {
        const isActive = props.value === 1;
        const statusText = isActive ? "Active" : "Inactive";
        const statusColor = isActive ? "#10B981" : "#EF4444"; // Green for active, Red for inactive

        return (
            <div className="flex items-center h-full">
                <span
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: statusColor }}
                >
                    {statusText}
                </span>
            </div>
        );
    };

    // Edit Button Cell Renderer Component
    const EditButtonRenderer = (props) => {
        return (
            <div className="flex items-center h-full">
                <button
                    onClick={() => handleEditTopic(props.data.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Edit
                </button>
            </div>
        );
    };

    // Column Definitions
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Topics",
                field: "topic_name",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Description",
                field: "topic_description",
                flex: 1,
                minWidth: 200,
                cellClass: "flex items-center",
            },
            {
                headerName: "Status",
                field: "status",
                width: 120,
                cellRenderer: StatusCellRenderer,
                cellClass: "flex items-center",
            },
            {
                headerName: "Actions",
                field: "actions",
                width: 100,
                cellRenderer: EditButtonRenderer,
                sortable: false,
                filter: false,
                cellClass: "flex items-center",
            },
        ],
        []
    );

    // Default Column Definition
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            resizable: true,
        }),
        []
    );

    // Grid Options
    const gridOptions = {
        domLayout: "autoHeight",
        suppressHorizontalScroll: false,
        rowHeight: 60,
    };

    const handleAddTopic = () => {

    };

    return (
        <>
            <div>
                <ToastContainer />
                <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
                    <div className="h-full lg:h-screen">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Topic</h2>
                            {currentUserRole === "SA" && (
                                <>
                                    <Button
                                        onClick={() => handleAddTopic()}
                                        className="bg-[#090722] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
                                    >
                                        Add Topic
                                    </Button>
                                </>
                            )}
                        </div>

                        <div
                            className="ag-theme-alpine"
                            style={{ height: 600, width: "100%" }}
                        >
                            <AgGridReact
                                rowData={allTopics?.data || []}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                gridOptions={gridOptions}
                                animateRows={true}
                                rowSelection="single"
                                suppressMenuHide={true}
                                pagination={true}
                                paginationPageSize={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default TopicList;