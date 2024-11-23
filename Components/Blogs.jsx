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
import { Favorite } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import Header from "./Header";

const Blogs = () => {
  const { accountname, accountemail } = useContext(Mycontext);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const [countlike, setCountlike] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      fetchBlogs();
    } else {
      navigate("/");
    }
  }, [accountname]);

  const fetchBlogs = async (pagenumber ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:4000/v1/blogs?page=${pagenumber}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.status===200) {
        const data = await response.json();
        const newBlogs = data.blogs.map((blog) => ({
          ...blog,
          changecolor: blog.likes.includes(accountemail)?true:false,
        }));
        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
        const arr = newBlogs.map((blog) => blog.likes.length);
        setCountlike((prevCounts) => [...prevCounts, ...arr]);
        newBlogs.length > 0?setHasMore(true):setHasMore(false);
      }
      else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/");
      }
       else {
        console.error("Error fetching blogs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchMoreData = () => {
    // console.log("hi")
      const newPage = page + 1;
      fetchBlogs(newPage);
      setPage(newPage);
    
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

            const newCountlike = [...countlike];
            const newValue = blogs[index].changecolor
              ? countlike[index] + 1
              : countlike[index] - 1;
            newCountlike[index] = newValue;
            setCountlike(newCountlike);
          }
          console.log("Update successfully");
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
        console.error("Error occurred");
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
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            padding: "20px",
          }}
        >
          {blogs.map((blog, index) => (
            <Card
              key={blog._id}
              sx={{
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
                loading="lazy" 
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
                </Box>
              </CardContent>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ alignSelf: "flex-end", marginTop: "10px" }}
              >
                {new Date(blog.createdAt).toLocaleDateString()}{" "}
                {new Date(blog.createdAt).toLocaleTimeString()}
              </Typography>
            </Card>
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default Blogs;
