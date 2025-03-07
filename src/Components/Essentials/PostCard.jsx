import React from "react";
import { Link } from "react-router-dom";
import DbService from "../../appwrite/configuration";

const PostCard = ({ $id, title, featureImage, slug }) => {
  return (
    <Link to={`/post/${slug || $id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
        <div className="w-full flex justify-center mb-4">
          <img
            src={DbService.getFilePreview(featureImage)}
            alt={title}
            className="rounded-lg h-32 w-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
    </Link>
  );
};

export default PostCard;
