const baseURL = "http://127.0.0.1:8000/";

export const requestUsers = async (school_id, authToken) => {
  return fetch(`${baseURL}api/schools/${school_id}/users`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
    }),
  }).then((response) => response.json());
};

export const createUser = async (
  school_id,
  authToken,
  values,
  phoneFormat,
  role,
  gender,
  date,
  avatar
) => {
  let response = await fetch(`${baseURL}api/schools/${school_id}/users`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-type": "multipart/form-data",
    }),
    body: JSON.stringify({
      email: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      role: role,
      gender: gender,
      date_of_birth: date,
      phone: phoneFormat,
      telegram_id: values.telegram_id,
      avatar: avatar,
    }),
  }).catch((err) => {
    console.log(err);
  });
};

export const updateUser = async (
  user_id,
  authToken,
  email,
  phoneFormat,
  role,
  gender,
  date,
  avatar
) => {
  console.log(email, user_id);
  let response = await fetch(`http://127.0.0.1:8000/api/users/2`, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-type": "application/json",
    }),
    body: JSON.stringify({
      email: email,
      first_name: "hola",
      last_name: "pola",
      role: "manager",
      gender: "female",
      date_of_birth: "2021-12-03",
      phone: "87088239036",
      telegram_id: "111",
    }),
  }).catch((err) => {
    console.log(err);
  });
};
