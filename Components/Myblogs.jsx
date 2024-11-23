/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
} from "@mui/material";
import { Mycontext } from "../Context/Createcontext";
import { useNavigate } from "react-router-dom";
import { Favorite, Edit,Delete } from "@mui/icons-material";
import Header from "./Header";

const Myblogs = () => {
  const {  accountemail } = useContext(Mycontext);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const [countlike, setcountlike] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      const fetchBlogs = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("http://localhost:4000/v1/myblogs", {
            method: "GET",
            headers: {
              Authorization: token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // console.log(accountemail);
            const blogs = data.blogs.map((blog) => ({
              ...blog,
              changecolor: blog.likes.includes(accountemail) ? true : false,
            }));
            setBlogs(blogs);
            //Like's count 
            const arr = blogs.map((blog) => blog.likes.length);
            setcountlike(arr);
          } else {
            console.error("Error fetching blogs:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };

      fetchBlogs();
    } else {
      navigate("/");
    }
  }, []);

  const handleEditButton = (blogId) => {
    navigate(`/edit/${blogId}`);
  };

  const handleLikeButton = async (blogId) => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      try {
        const response = await fetch("http://localhost:4000/v1/like", {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId }),
        });

        const data = await response.json();
        if (data.status === true) {
          const index = blogs.findIndex((post) => post._id === blogId);
          if (index !== -1) {
            const newBlogs = [...blogs];
            newBlogs[index].changecolor = !newBlogs[index].changecolor;
            setBlogs(newBlogs);

            const newcountlike = [...countlike];
            const newvalue = blogs[index].changecolor
              ? countlike[index] + 1
              : countlike[index] - 1;
            newcountlike[index] = newvalue;
            setcountlike(newcountlike);
          }

          console.log("update successfully");
        } 
        else if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/");
        }
        else {
          alert("Error in button like");
        }
      } catch (error) {
        console.error("Error comming");
      }
    } else {
      navigate("/");
    }
  };

  const handleDeleteButton = async (blogId) => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      try {
        const response = await fetch(`http://localhost:4000/v1/delete/${blogId}`, {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        });


        if (response.status===200) {
          setBlogs(blogs.filter((blog) => blog._id !== blogId));
          console.log("Post deleted successfully");
        } 
        else if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/");
        }
        else {
          alert("Error in deleting post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "40px",
      }}
    >
      <Header/>

      {blogs.map((blog, index) => (
        <Card
          key={blog._id}
          sx={{
            margin: "20px",
            width: 300,
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={blog.firebaseimage}
            alt={blog.title}
          />
          <CardContent
            sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            <Box>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", marginBottom: "10px" }}
              >
                {blog.title}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: "20px" }}
              >
                {blog.discription}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "auto",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => handleLikeButton(blog._id)}
                  sx={{ color: blog.changecolor ? "#FF0000" : "" }}
                >
                  <Favorite />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: "1px" }}>
                  {countlike[index]}
                </Typography>
              </Box>
              <IconButton
                onClick={() => handleEditButton(blog._id)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                  onClick={() => handleDeleteButton(blog._id)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
            </Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ alignSelf: "flex-end", marginTop: "10px" }}
            >
              {new Date(blog.createdAt).toLocaleDateString()}{" "}
              {new Date(blog.createdAt).toLocaleTimeString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Myblogs;
