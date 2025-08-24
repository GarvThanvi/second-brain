import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const useContent = () => {
  const [content, setContent] = useState([]);

  const refresh = () => {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setContent(response.data.contents);
      });
  };

  useEffect(() => {
    refresh();
    let interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {content, refresh};
};
