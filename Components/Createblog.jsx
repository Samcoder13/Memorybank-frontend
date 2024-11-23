/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextareaAutosize,
  Button,
  InputBase,
  FormControl,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Attachment as AttachIcon } from "@mui/icons-material";
import { Mycontext } from "../Context/Createcontext";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import Header from "./Header";

const CreatePost = () => {
  const { accountname } = useContext(Mycontext);
  const initialData = {
    title: "",
    discription: "",
    image: "",
    firebaseimage: "",
    user: accountname,
  };

  const navigate = useNavigate();
  const [post, setPost] = useState(initialData);
  const [file, setfile] = useState("");
  const fileInputElement = useRef(null);
  const [imgPerc, setImgPerc] = useState(0);
  const [headerToken, setHeaderToken] = useState("");

  // console.log(post);
  // console.log(file);

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (token && tokenExpiry && currentTime < tokenExpiry) {
      // setPost((prevPost) => ({ ...prevPost, token }));
      setHeaderToken(token);
    } else {
      navigate("/");
    }
  }, []);

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImgPerc(Math.round(progress));

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error(error);
        switch (error.code) {
          case "storage/unauthorized":
            console.error(error);
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
          default:
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("DownloadURL - ", downloadURL);
          setPost({ ...post, firebaseimage: downloadURL });
        });
      }
    );
  };

  const imageUrl = post.image
    ? post.image
    : "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const handleTitle = (e) => {
    // console.log(e.target.value);
    setPost({ ...post, title: e.target.value });
  };

  const checkwordcount = (str) => {
    return str.trim().split(/\s+/).length;
  };

  const handlediscription = (e) => {
    checkwordcount(post.discription) >= 200
      ? alert("Word Count exceeded (should be in 200 only)")
      : setPost({ ...post, discription: e.target.value });
    // setPost({ ...post, discription: e.target.value });
  };

  const handleFileSelect = (e) => {
    setfile(e.target.files[0]);
    setPost({ ...post, image: URL.createObjectURL(e.target.files[0]) });
  };

  const handleFileInput = () => {
    if (fileInputElement.current) {
      fileInputElement.current.click();
    }
  };

  const handleSubmit = async () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (!tokenExpiry || currentTime >= tokenExpiry) {
      console.log("Token is expired");
      navigate("/");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/v1/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: headerToken,
        },
        body: JSON.stringify(post),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/");
      } else if (response.ok) {
        const data = await response.json();
        console.log("Post created successfully:", data);
        navigate("/myblogs");
      } else if (response.status === 400) {
        alert("Please fill all the fields properly");
      } else {
        console.error("Internal server Error");
      }
    } catch (error) {
      console.error("Error Comming", error);
    }
  };

  return (
    <Box sx={{ margin: { xs: 0, md: "50px 100px" } }}>
            <Header/>

      <Box
        component="img"
        src={imageUrl}
        alt="Blog"
        sx={{
          width: "100%",
          height: "50vh",
          objectFit: "cover",
        }}
      />
      {file && (
        <Box sx={{ width: "100%", marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={imgPerc} />
          <Typography variant="body2" color="textSecondary" align="center">
            {imgPerc}%
          </Typography>
        </Box>
      )}
      <FormControl
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <input
          type="file"
          ref={fileInputElement}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        <IconButton onClick={handleFileInput}>
          <AttachIcon fontSize="large" color="action" />
        </IconButton>

        <InputBase
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
          onClick={() => handleSubmit()}
          variant="contained"
          color="primary"
          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
        >
          Publish
        </Button>
        <br />
      </FormControl>
      <TextareaAutosize
        placeholder="Write your blog..."
        name="discription"
        onChange={handlediscription}
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

export default CreatePost;
