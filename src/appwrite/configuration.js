import config from "../config/config";
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

export class ConfigurationService {
  client;
  databases;
  storage;

  constructor() {
    this.client = new Client()
      .setEndpoint(config.appwrite_url) // Appwrite API URL
      .setProject(config.appwrite_project_id); // Project ID

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async getUser() {
    try {
      const account = new Account(this.client); // Create Account instance
      const user = await account.get(); // Fetch user details
      console.log("✅ User fetched successfully:", user);
      return user;
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      return null; // Return null if user is not logged in
    }
  } 
  // ✅ Create a new post in Appwrite Database
  async createPost({ title, slug, content, featuredimage, status, userId }) {
    try {
      console.log("Creating Post:", { title, slug, content, featuredimage, status, userId });

      return await this.databases.createDocument(
        config.appwrite_db_id, 
        config.appwrite_collection_id, 
        ID.unique(), 
        {
          title,
          slug, // ✅ Ensure slug is included
          content,
          featuredimage,
          status,
          userid: userId, // ✅ Match Appwrite's lowercase field naming convention
        }
      );
    } catch (error) {
      console.error("Appwrite Error (createPost):", error);
      throw error;
    }
  }

  // ✅ Update an existing post
  async updatePost(postId, updateData) {
    try {
      if (!postId || !updateData) throw new Error("Invalid update request");

      const updatedPost = await this.databases.updateDocument(
        config.appwrite_db_id,
        config.appwrite_collection_id,
        postId,
        updateData
      );

      console.log("Post updated successfully:", updatedPost);
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  // ✅ Delete a post by ID
  async deletePost(postId) {
    try {
      console.log(`Deleting post: ${postId}`);
      await this.databases.deleteDocument(
        config.appwrite_db_id,
        config.appwrite_collection_id,
        postId
      );
      return true;
    } catch (error) {
      console.error("Appwrite Error (deletePost):", error);
      return false;
    }
  }
  

  // ✅ Get a single post by ID
  async getPost(postId) {
    console.log("Fetching post with ID:", postId);
    try {
      return await this.databases.getDocument(
        config.appwrite_db_id,
        config.appwrite_collection_id,
        postId
      );
    } catch (error) {
      console.error("Appwrite Error (getPost):", error);
      return null;
    }
  }

  // ✅ Get all active posts
  async getAllPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        config.appwrite_db_id,
        config.appwrite_collection_id,
        queries
      );
    } catch (error) {
      console.error("Appwrite Error (getAllPosts):", error);
      return null;
    }
  }

  // ✅ Upload a file to Appwrite storage bucket
  async uploadFile(file) {
    try {
      if (!file) throw new Error("Missing required parameter: file");
      if (!config.appwrite_bucket_id) throw new Error("Appwrite Storage Bucket ID is missing!");

      console.log("Uploading file to bucket:", config.appwrite_bucket_id);

      // Ensure the file is a valid Blob/File object
      if (!(file instanceof File || file instanceof Blob)) {
        throw new Error("Invalid file format. Must be a File or Blob object.");
      }

      return await this.storage.createFile(
        config.appwrite_bucket_id,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Appwrite Error (uploadFile):", error);
      return null;
    }
  }

  // ✅ Delete a file from Appwrite storage bucket
  async deleteFile(fileId) {
    try {
      if (!config.appwrite_bucket_id) {
        throw new Error("Missing Appwrite Storage Bucket ID!");
      }

      console.log("Deleting file:", fileId);
      await this.storage.deleteFile(config.appwrite_bucket_id, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite Error (deleteFile):", error);
      return false;
    }
  }

  // ✅ Get a file preview URL (Fixed)
  getFilePreview(fileId) {
    if (!fileId) {
      console.error("getFilePreview: Missing fileId");
      return "https://via.placeholder.com/150"; // Default placeholder
    }
    return `${config.appwrite_url}/storage/buckets/${config.appwrite_bucket_id}/files/${fileId}/preview?project=${config.appwrite_project_id}`;
  }
}

const DbService = new ConfigurationService();
export default DbService;
