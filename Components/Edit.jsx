/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextareaAutosize, Button, InputBase, FormControl } from "@mui/material";
// import { Mycontext } from "../Context/Createcontext";

const Edit = () => {
//   const { accountname } = useContext(Mycontext);
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [discription, setDescription] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      const currentTime = new Date().getTime();

      if (token && tokenExpiry && currentTime < tokenExpiry) {
        try {
          const response = await fetch(`http://localhost:4000/v1/findblog/${id}`, {
            method: "GET",
            headers: {
              Authorization: token,
            },
          });

          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            navigate("/");
          }
          if (!response.ok) {
            throw new Error("Failed to fetch blog");
          }

          const data = await response.json();
          setImage(data.blog.firebaseimage);
          setTitle(data.blog.title);
          setDescription(data.blog.discription);
        } catch (error) {
          console.error("Error fetching blog:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    fetchBlog();
  }, [id]);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();
    const token = localStorage.getItem("token");
    if (!tokenExpiry || currentTime >= tokenExpiry) {
      console.log("Token is expired");
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/v1/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title, discription }),
      });

      if (response.status===200) {
        alert("Blog updated !!");
        navigate("/myblogs");
      }
      else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/");
      }
       else {
        alert("Blog not updated");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  return (
    <Box sx={{ margin: { xs: 0, md: "50px 100px" } }}>
      <Box
        component="img"
        src={image}
        alt="Blog"
        sx={{
          width: "100%",
          height: "50vh",
          objectFit: "cover",
        }}
      />
      <FormControl
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <InputBase
          value={title}
          onChange={handleTitle}
          name="title"
          placeholder="Blog Title"
          sx={{
            flex: 1,
            margin: "0 30px",
            fontSize: "25px",
          }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
        >
          Update
        </Button>
        <br />
      </FormControl>
      <TextareaAutosize
        value={discription}
        placeholder="Write your blog..."
        name="discription"
        onChange={handleDescription}
        style={{
          width: "100%",
          border: "none",
          marginTop: "50px",
          fontSize: "18px",
        }}
      />
    </Box>
  );
};

export default Edit;
