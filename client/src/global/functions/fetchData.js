import PeopleFinder from "../apis/PeopleFinder";

export const fetchData = (method, url, obj, uploadFile = false) => {
  return new Promise(async (resolve, reject) => {
    switch (method) {
      case "get":
        try {
          let response;
          if (obj) response = await PeopleFinder.get(url, obj);
          else response = await PeopleFinder.get(url);
          resolve(response.data);
        } catch (err) {
          // Check if can generate an alert from this function
          reject(err.response);
        }
        break;
      case "post":
        try {
          let response;
          if (uploadFile) {
            response = await PeopleFinder.post(url, obj, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            response = await PeopleFinder.post(url, obj);
          }
          resolve(response.data);
        } catch (err) {
          reject(err.response);
        }
        break;
      case "put":
        try {
          let response;
          if (uploadFile) {
            response = await PeopleFinder.put(url, obj, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else if (obj.password) {
            const password = obj.password;
            response = await PeopleFinder.put(
              url,
              { password },
              { headers: obj.headers }
            );
          } else {
            response = await PeopleFinder.put(url, obj);
          }
          resolve(response.data);
        } catch (err) {
          reject(err.response);
        }
        break;
      case "delete":
        try {
          let response;
          if (obj) {
            response = await PeopleFinder.delete(url, {
              headers: obj.headers,
              data: {
                why_tax_deleted: obj.why_tax_deleted,
              },
            });
          } else response = await PeopleFinder.delete(url);
          resolve(response.data);
        } catch (err) {
          reject(err.response);
        }
        break;
    }
  });
};
