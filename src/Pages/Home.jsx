import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Button } from "../Components";
import { Link } from "react-router-dom";
import DbService from "../appwrite/configuration";
import HomePage from "../Components/HomepPage";

const Home = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus) {
      const fetchPosts = async () => {
        try {
          const response = await DbService.getAllPosts();
          if (response && response.documents) {
            const updatedPosts = response.documents.map((post) => ({
              ...post,
              featureImage: post.featuredimage
                ? DbService.getFilePreview(post.featuredimage)
                : null,
            }));
            setPosts(updatedPosts.slice(0, 8)); // 
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    } else {
      // ✅ Clear posts on logout
      setPosts([]);
      setLoading(false);
    }
  }, [authStatus]); // ✅ Trigger effect on authStatus change

  return (
    <div className="w-full py-8 mt-4">
      <Container>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : authStatus && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                key={post.$id}
                to={`/post/${post.slug || post.$id}`}
                className="group  bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full"
              >
                {post.featureImage && (
                  <div className="relative w-full h-52 bg-gray-700 flex items-center justify-center">
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-white text-center">{post.title}</h2>
                 
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <HomePage />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
