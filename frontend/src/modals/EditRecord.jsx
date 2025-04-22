import axios from "axios";
import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { URL } from "../utils/urls";
import usePrivateAxios from "../hooks/usePrivateAxios";

const EditRecord = ({ editModal, setEditModal }) => {
  const [inputFields, setInputFields] = useState({
    Country: editModal.Country,
    Account_type: editModal.Account_type,
    Username: editModal.Username,
    Password: "password",
    LastName: editModal.LastName,
    FirstName: editModal.FirstName,
    emailAddress: editModal.emailAddress,
    contactNum: editModal.contactNum,
  });

  const axiosPrivate = usePrivateAxios();

  const [imageFile, setImageFile] = useState(null);

  console.log(imageFile);

  const submitData = async (e) => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append("ID", editModal.ID);
      formData.append("Country", inputFields.Country);
      formData.append("Account_type", inputFields.Account_type);
      formData.append("Username", inputFields.Username);
      formData.append("Password", inputFields.Password);
      formData.append("LastName", inputFields.LastName);
      formData.append("FirstName", inputFields.FirstName);
      formData.append("emailAddress", inputFields.emailAddress);
      formData.append("contactNum", inputFields.contactNum);
      formData.append("image", imageFile);

      const res = await axiosPrivate.post("edit-user", formData);

      alert("Record Saved");

      setInputFields({
        Country: "",
        Account_type: "",
        Username: "",
        Password: "password",
        LastName: "",
        FirstName: "",
        emailAddress: "",
        contactNum: "",
      });
      setImageFile(null);
      setEditModal(false);

      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex  justify-center fixed top-0 left-0 bg-white">
      <IoIosCloseCircle
        className="absolute right-2 top-2 text-[3rem] cursor-pointer text-red-600"
        onClick={() => setEditModal(null)}
      />
      <form onSubmit={submitData} className="flex flex-col mt-12 w-[30rem]">
        <div className="flex justify-between">
          <span className="font-semibold text-[1rem] mr-2">Country: * </span>
          <select
            onChange={(e) =>
              setInputFields({ ...inputFields, Country: e.target.value })
            }
            value={inputFields.Country}
            required
            className="w-[15rem] border border-black"
          >
            <option>PH</option>
            <option>USA</option>
            <option>JPN</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">
            Account Type: *{" "}
          </span>
          <select
            onChange={(e) =>
              setInputFields({ ...inputFields, Account_type: e.target.value })
            }
            value={inputFields.Account_type}
            required
            className="w-[15rem] border border-black"
          >
            <option>Team Member</option>
            <option>Sys Admin</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">Username: * </span>
          <input
            onChange={(e) =>
              setInputFields({ ...inputFields, Username: e.target.value })
            }
            value={inputFields.Username}
            required
            className="w-[15rem] border border-black"
          />
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">Last Name: * </span>
          <input
            onChange={(e) =>
              setInputFields({ ...inputFields, LastName: e.target.value })
            }
            value={inputFields.LastName}
            required
            className="w-[15rem] border border-black"
          />
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">First Name: * </span>
          <input
            onChange={(e) =>
              setInputFields({ ...inputFields, FirstName: e.target.value })
            }
            value={inputFields.FirstName}
            required
            className="w-[15rem] border border-black"
          />
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">
            Email Address: *{" "}
          </span>
          <input
            onChange={(e) =>
              setInputFields({ ...inputFields, emailAddress: e.target.value })
            }
            value={inputFields.emailAddress}
            required
            className="w-[15rem] border border-black"
          />
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">Contact Num: </span>
          <input
            onChange={(e) =>
              setInputFields({ ...inputFields, contactNum: e.target.value })
            }
            value={inputFields.contactNum}
            className="w-[15rem] border border-black"
          />
        </div>
        <div className="flex justify-between mt-6">
          <span className="font-semibold text-[1rem] mr-2">
            Photo: [optional]{" "}
          </span>
          <input
            onChange={(e) => setImageFile(e.target.files[0])}
            type="file"
            className="w-[15rem] border border-black"
          />
        </div>
        <img
          className="w-[10rem] h-[10rem] object-cover"
          src={editModal.PhotoPath ? URL + editModal.PhotoPath : "/NoImage.jpg"}
        />

        <button
          type="submit"
          className="mt-[4rem] bg-green-500 text-white p-2 rounded-md w-[90%] m-auto"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditRecord;
