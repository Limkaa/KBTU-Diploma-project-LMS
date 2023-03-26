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
      "Content-type": "application/json",
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
    }),
  });
};
