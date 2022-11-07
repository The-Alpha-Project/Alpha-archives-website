import { API_ELEMENT } from "./utils/endpoints";
import { urlFormater } from "./utils/urlFormater";

export const fetchElements = (filter_field, folderName) => {
  let url = urlFormater({
    model: API_ELEMENT,
    filter_field: filter_field,
    filter_value: folderName,
    ordering: "name",
  });

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((success) => {
      return success;
    })
    .catch((error) => {
      return error;
    });
};
