import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import DbService from "../appwrite/configuration";
import { Query } from "appwrite";
import { Container } from "../Components";
import { Link } from "react-router-dom";
import nopost from '../assets/homepage/nopost.png'

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user); // Get logged-in user

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        let account = userData;
        if (!account) {
          account = await DbService.getUser();
          if (account) {
            dispatch(setUser(account)); // Store user in Redux
          } else {
            setLoading(false);
            return;
          }
        }

        // Fetch posts that belong to the logged-in user
        const userPosts = await DbService.getAllPosts([
          Query.equal("userid", account.$id), // Fetch only posts created by this user
          Query.equal("status", "active"),
        ]);

        if (userPosts && userPosts.documents) {
          const updatedPosts = userPosts.documents.map((post) => ({
            ...post,
            featureImage: post.featuredimage
              ? DbService.getFilePreview(post.featuredimage)
              : null,
          }));

          setPosts(updatedPosts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userData, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg text-orange-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <h1 className="mt-4">Loading your posts...</h1>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-200 mb-6">My Posts</h1>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={nopost}
            className="w-64 h-64 mb-4 opacity-100"
          />
          <p className="text-gray-400 text-lg">You haven't created any posts yet.</p>
          <Link to="/add-post" className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 z-10 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                key={post.$id}
                to={`/post/${post.slug || post.$id}`}
                className="group block bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300"
              >
                {post.featureImage && (
                  <div className="relative w-full h-52 bg-gray-500">
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-bold text-slate-200 text-center">{post.title}</h2>
                 
                </div>
              </Link>
            ))}
          </div>
        </Container>
      )}
    </div>
  );
};

export default MyPosts;
