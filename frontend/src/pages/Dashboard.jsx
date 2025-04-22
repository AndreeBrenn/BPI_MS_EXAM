import React, { useState, useEffect } from "react";
import { useAuth } from "../zustand/Auth";
import { AUTH_URL, URL } from "../utils/urls";
import axios from "axios";
import usePrivateAxios from "../hooks/usePrivateAxios";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import AddRecord from "../modals/AddRecord";
import EditRecord from "../modals/EditRecord";
import ReactPaginate from "react-paginate";

const Dashboard = () => {
  const { logoutUser } = useAuth();

  const axiosPrivate = usePrivateAxios();

  const [dataList, setDataList] = useState([]);
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState(1); // By default set page number 1
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [itemOffset, setItemOffset] = useState(0);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const res = await axiosPrivate.get(
          `get-employee/${itemOffset}/${postsPerPage}/${
            search == "" ? null : search
          }`,
          {
            signal: controller.signal,
          }
        );

        setCount(res.data.count);
        setDataList(res.data.result);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentPage, postsPerPage, itemOffset, search]);

  const DeleteData = async (e, ID) => {
    e.preventDefault();

    try {
      if (window.confirm("Are you sure you want to delete this record ?")) {
        const res = await axiosPrivate.delete(`delete-user/${ID}`);

        window.location.reload();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const paginated = (value) => {
    const newOffset = (value * postsPerPage) % count;
    setItemOffset(newOffset);
  };

  return (
    <div className="w-screen h-screen flex flex-col p-4">
      <button
        className="w-[10rem] bg-red-600 mb-4 text-white ml-auto rounded-md"
        onClick={logoutUser}
      >
        Logout
      </button>

      <button
        onClick={() => setAddModal(!addModal)}
        className="w-[10rem] bg-blue-600 mb-4 text-white ml-auto rounded-md p-2"
      >
        Add Employee
      </button>

      <div className="flex flex-col mt-5 border border-gray-400">
        <div className="px-4 py-2 flex justify-between">
          <div className="flex">
            <span>Search</span>
            <input
              className="border border-gray-600 ml-2"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex">
            <span>Show</span>
            <select
              className="border "
              onChange={(e) => setPostsPerPage(e.target.value)}
            >
              <option>5</option>
              <option>20</option>
              <option>100</option>
            </select>
            entries
          </div>
        </div>
        <table className="min-w-full bg-white border-t-2 border-x-2 border-x-black border-b  border-t-gray-700 rounded-lg">
          <thead>
            <tr className="">
              <th className="font-header-table">Photo</th>
              <th className="font-header-table">Name</th>
              <th className="font-header-table">Username</th>
              <th className="font-header-table">Country</th>
              <th className="font-header-table">Email</th>
              <th className="font-header-table">Account Type</th>
              <th className="font-header-table">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataList.map((data) => (
              <tr className="hover:bg-gray-500">
                <td
                  key={data.ID}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  <img
                    className="h-[5rem] w-[5rem] object-cover"
                    src={data.PhotoPath ? URL + data.PhotoPath : "/NoImage.jpg"}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {data.FirstName + " " + data.LastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.Username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.Country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.emailAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {data.Account_type}
                </td>
                <td className="flex items-center pt-3 justify-center">
                  <button
                    onClick={() => setEditModal(data)}
                    className="p-2 bg-yellow-600 text-white flex items-center justify-center rounded-md"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => DeleteData(e, data.ID)}
                    className="p-2 ml-2 bg-red-600 text-white flex items-center justify-center rounded-md"
                  >
                    <RiDeleteBin6Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel={<span className="flex items-center">Next </span>}
          onPageChange={(e) => paginated(e.selected)}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(count / postsPerPage)}
          previousLabel={<span className="flex items-center">Prev</span>}
          renderOnZeroPageCount={null}
          containerClassName="flex items-center justify-center space-x-1 mt-8"
          pageLinkClassName="px-4 py-2 rounded text-gray-700 bg-gray-100 "
          previousLinkClassName="px-4 py-2 rounded text-gray-700 bg-gray-100 "
          nextLinkClassName="px-4 py-2 rounded text-gray-700 bg-gray-100  "
          breakLinkClassName="px-4 py-2 text-gray-700"
          activeLinkClassName="!bg-blue-600 !text-white font-medium"
          disabledLinkClassName="opacity-50 cursor-not-allowed"
        />
      </div>
      {addModal && <AddRecord setAddModal={setAddModal} />}
      {editModal && (
        <EditRecord setEditModal={setEditModal} editModal={editModal} />
      )}
    </div>
  );
};

export default Dashboard;
