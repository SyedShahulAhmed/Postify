import React, { useEffect, useState } from "react";
import DbService from "../appwrite/configuration";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button } from "../Components";
import parse from "html-react-parser";
import { toast } from "react-toastify"; 
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ Import loading icon
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const Post = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Invalid post ID.");
        setLoading(false);
        return;
      }

      try {
        const fetchedPost = await DbService.getPost(slug);
        if (fetchedPost) setPost(fetchedPost);
        else setError("Post not found.");
      } catch (error) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const confirmDeletePost = () => setShowConfirm(true);

  const deletePost = async () => {
    if (!post || !post.$id) return;

    setDeleting(true); 

    try {
      const status = await DbService.deletePost(post.$id);
      if (status) {
        await DbService.deleteFile(post.featuredimage);
        toast.success("Post deleted successfully!", {
          className: "bg-red-500 text-white",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      toast.error("Failed to delete post.", {
        className: "bg-red-500 text-white",
      });
    } finally {
      setShowConfirm(false);
      setDeleting(false);
    }
  };

  // ✅ Show loading spinner while fetching post
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-8">Post not found.</div>;

  const isAuthor = post && userData ? post.userid === userData.$id : false;

  return (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={DbService.getFilePreview(post.featuredimage)}
            alt={post.title}
            className="w-full h-64 object-contain rounded-lg"
          />

          {isAuthor && (
            <div className="absolute right-6 bottom-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  <FaEdit size={20}/>
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={confirmDeletePost}>
                <MdDelete size={20}/>
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl text-slate-200 font-bold">{post.title}</h1>
        </div>
        <div className="browser-css text-gray-400">{parse(post.content)}</div>
      </Container>

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-500 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-white">Confirm Deletion</h2>
            <p className="text-gray-200 mt-2">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end">
              <Button bgColor="bg-gray-400" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button bgColor="bg-red-500" onClick={deletePost} className="ml-3 flex items-center">
                {deleting ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                   
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
