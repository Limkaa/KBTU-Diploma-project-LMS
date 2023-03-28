const baseURL = "http://127.0.0.1:8000/";

export const requestUsers = async (school_id, authToken, offset) => {
  return fetch(
    // `${baseURL}api/schools/${school_id}/users?limit=10&offset=${offset}`,
    `${baseURL}api/schools/${school_id}/users`,
    {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
    }
  ).then((response) => response.json());
};

export const createUser = async (
  school_id,
  authToken,
  values,
  phoneFormat,
  role,
  gender,
  avatar
) => {
  let response = await fetch(`${baseURL}api/schools/${school_id}/users`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-type": "application/json",
    }),
    body: JSON.stringify({
      email: values.email,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      role: role,
      gender: gender,
      date_of_birth: values.date_of_birth,
      phone: phoneFormat,
      telegram_id: values.telegram_id,
      avatar: avatar,
    }),
  }).catch((err) => {
    console.log(err);
  });
  return response;
};

export const updateUser = async (user_id, authToken, values, phoneFormat) => {
  let response = await fetch(`${baseURL}api/users/${user_id}`, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-type": "application/json",
    }),
    body: JSON.stringify({
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      gender: values.gender,
      date_of_birth: values.date_of_birth,
      phone: phoneFormat,
      telegram_id: values.telegram_id,
      is_active: values.is_active,
    }),
  }).catch((err) => {
    console.log(err);
  });
  return response;
};
