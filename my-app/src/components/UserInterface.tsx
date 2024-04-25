import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponets from "./CardComponets";

type UserProps = {
  id: number;
  name: string;
  email: string;
};

interface UserInterfaceProps {
  backendName: string;
}

const UserInterface = (props: UserInterfaceProps) => {
  const apiUrl = "http://localhost:4000";

  const [users, setUsers] = useState<UserProps[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });

  const backGroundColor: { [key: string]: string } = {
    flask: "bg-blue-500"
  };

  const buttonColors: { [key: string]: string } = {
    flask: "bg-blue-700 hover:bg-blue-500"
  };

  const bgColor =
    backGroundColor[props.backendName as keyof typeof backGroundColor] ||
    "bg-gray-500";
  const btnColor =
    buttonColors[props.backendName as keyof typeof buttonColors] ||
    "bg-gray-500 hover:bg-gray-700";

  // fetch data from the backend

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/flask/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [props.backendName, apiUrl]);

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/flask/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  //   createUser
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/flask/users/`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error(error);
    }
  };

  //update user

  return (
    <div
      className={`userinterface ${bgColor} ${props.backendName} w-full max-w-md p-4 rounded shadow`}
    >
      <h2 className="text-xl font-bold text-center text-white mb-6">{`${props.backendName}`}</h2>

      {/* Create user */}
      <form
        onSubmit={createUser}
        className="mb-6 p-4 bg-blue-100 rounded shadow"
      >
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="w-full p-2 mb-4 rounded"
        />
        <input
          placeholder="Mail"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-2 mb-4 rounded"
        />
        <button
          type="submit"
          className={`${btnColor} text-white rounded p-4 w-full`}
        >
          追加する
        </button>
      </form>

      {/* Display user */}
      <div className="mb-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-4"
          >
            <CardComponets
              key={user.id}
              id={user.id}
              name={user.name}
              email={user.email}
            />
            <button
              onClick={() => deleteUser(user.id)}
              className={`${btnColor} text-white rounded p-4`}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInterface;
