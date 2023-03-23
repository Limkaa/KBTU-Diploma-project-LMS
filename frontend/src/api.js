const baseURL = "http://127.0.0.1:8000/";

export const requestUsers = async (school_id, authToken) => {
  return fetch(`${baseURL}api/schools/${school_id}/users`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${authToken}`,
    }),
  }).then((response) => response.json());
};
