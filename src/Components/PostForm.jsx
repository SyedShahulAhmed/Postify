import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Select, RTE } from "../Components/index";
import DbService from "../appwrite/configuration";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { ImCross } from "react-icons/im";

import "react-toastify/dist/ReactToastify.css";

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    post?.featuredimage ? DbService.getFilePreview(post.featuredimage) : null
  );
  const [selectedFile, setSelectedFile] = useState(null); // Store original file
  const [fileName, setFileName] = useState("No file chosen"); // Store file name

  // ✅ Slug Transformation Function
  const slugTransform = useCallback((value) => {
    return (
      value
        ?.trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-") || ""
    );
  }, []);

  // ✅ Automatically Generate Slug from Title
  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => sub.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // ✅ Submit Function (Handles Create & Update)
  const submit = async (data) => {
    let file =
      selectedFile || (data.featuredimage?.[0] ? data.featuredimage[0] : null);
    const payload = { ...data };
    delete payload.slug;

    try {
      if (post) {
        const uploadedFile = file ? await DbService.uploadFile(file) : null;
        if (uploadedFile) {
          if (post.featuredimage) {
            await DbService.deleteFile(post.featuredimage);
          }
          payload.featuredimage = uploadedFile.$id;
        } else {
          payload.featuredimage = post.featuredimage;
        }

        const dbPost = await DbService.updatePost(post.$id, payload);
        if (dbPost) {
          toast.success("Post updated successfully! 🚀");
          setTimeout(() => navigate(`/post/${dbPost.$id}`), 2000);
        }
      } else {
        if (file) {
          const uploadedFile = await DbService.uploadFile(file);
          if (uploadedFile) {
            payload.featuredimage = uploadedFile.$id;
          }
        }

        payload.userId = userData.$id;
        const dbPost = await DbService.createPost(payload);
        if (dbPost) {
          toast.success("Post created successfully! 🎉");
          setTimeout(() => navigate(`/post/${dbPost.$id}`), 2000);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-wrap bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg text-white font-semibold w-full max-w-4xl mx-auto"
      >
        {/* Left Section */}
        <div className="w-full lg:w-2/3 px-3">
          <Input
            label="Title :"
            placeholder="Enter title"
            className="mb-4 py-2 px-3 border border-gray-500 rounded-md bg-gray-700 focus:ring-2 focus:ring-orange-500"
            {...register("title", { required: true })}
          />
          <Input
            label="Slug :"
            placeholder="Enter slug"
            className="mb-4 py-2 px-3 border border-gray-500 rounded-md bg-gray-700 focus:ring-2 focus:ring-blue-500"
            {...register("slug", { required: true })}
            onBlur={(e) =>
              setValue("slug", slugTransform(e.target.value), {
                shouldValidate: true,
              })
            }
          />
          <RTE
            label="Content :"
            name="content"
            
            control={control}
            defaultValue={getValues("content")}
          />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3 px-3">
          <label className="block mb-2 text-gray-300 mt-4 ">Featured Image :</label>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            {...register("featuredimage")}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setThumbnailPreview(URL.createObjectURL(file));
                setSelectedFile(file);
                setFileName(file.name);
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg cursor-pointer inline-block text-center transition duration-200"
          >
            Choose File
          </label>

          {/* File Name & Remove Icon */}
          <div className="flex items-center mt-2">
            <span className="text-gray-300">{fileName}</span>
            {fileName !== "No file chosen" && (
              <span
                className="ml-3  text-red-500 cursor-pointer text-lg inline-flex items-center hover:text-red-700 transition duration-200"
                onClick={() => {
                  setThumbnailPreview(null);
                  setSelectedFile(null);
                  setFileName("No file chosen");
                }}
              >
                <ImCross />
              </span>
            )}
          </div>

          {/* Image Preview */}
          {thumbnailPreview && (
            <div className="w-full my-3">
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="rounded-lg shadow-md"
              />
            </div>
          )}

          <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4 mt-4 bg-gray-700 border border-gray-500 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500"
            {...register("status", { required: true })}
          />

          <Button
            type="submit"
            bgColor={
              post
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-orange-500 hover:bg-orange-600"
            }
            className="w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200"
          >
            {post ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PostForm;
