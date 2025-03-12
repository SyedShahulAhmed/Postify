import React, { useEffect, useState } from "react";
import DbService from "../appwrite/configuration";
import { Container } from "../Components";
import { Link } from "react-router-dom";

const Allposts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DbService.getAllPosts()
      .then((response) => {
        if (response && response.documents) {
          const updatedPosts = response.documents.map((post) => {
            if (!post.featuredimage) {
              return { ...post, featureImage: null };
            }
            const imageUrl = DbService.getFilePreview(post.featuredimage);
            return { ...post, featureImage: imageUrl };
          });

          setPosts(updatedPosts);
        }
      })
      .catch((error) => console.error("Error fetching posts:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-lg text-orange-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
        <h1 className="mt-4">Loading posts...</h1>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.$id}
                to={`/post/${post.slug || post.$id}`}
                className="group bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full"
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
                  <h2 className="text-lg font-bold text-white text-center">
                    {post.title}
                  </h2>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center w-full text-gray-400">No posts found.</p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Allposts;
