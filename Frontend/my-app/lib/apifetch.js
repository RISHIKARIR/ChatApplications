let BaseUrl = "http://localhost:5000";

export async function Apifetch(url, options) {

  const isFormData = options.body instanceof FormData;

  const headers = isFormData ? {} : { "content-type" : "application/json"}



  let response = await fetch(`${BaseUrl}/${url}`, {
    ...options,
    headers,
    credentials: "include",
  });


  
  
  if (response.status === 401) {
    response = await fetch(`${BaseUrl}/auth/generateAccess`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      window.location.href = "/login";
      return;
    }

    response = await fetch(`${BaseUrl}/${url}`, {
      ...options,
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
  }

  return response;
}
