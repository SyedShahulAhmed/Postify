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
      const account = new Account(this.client);
      return await account.get();
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  } 

  async createPost({ title, slug, content, featuredimage, status, userId }) {
    try {
      return await this.databases.createDocument(
        config.appwrite_db_id, 
        config.appwrite_collection_id, 
        ID.unique(), 
        { title, slug, content, featuredimage, status, userid: userId }
      );
    } catch (error) {
      console.error("Appwrite Error (createPost):", error);
      throw error;
    }
  }

  async updatePost(postId, updateData) {
    try {
      if (!postId || !updateData) throw new Error("Invalid update request");
      return await this.databases.updateDocument(
        config.appwrite_db_id,
        config.appwrite_collection_id,
        postId,
        updateData
      );
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
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

  async getPost(postId) {
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

  async uploadFile(file) {
    try {
      if (!file) throw new Error("Missing required parameter: file");
      if (!config.appwrite_bucket_id) throw new Error("Appwrite Storage Bucket ID is missing!");
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

  async deleteFile(fileId) {
    try {
      if (!config.appwrite_bucket_id) {
        throw new Error("Missing Appwrite Storage Bucket ID!");
      }
      await this.storage.deleteFile(config.appwrite_bucket_id, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite Error (deleteFile):", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (!fileId) {
      return "https://via.placeholder.com/150";
    }
    return `${config.appwrite_url}/storage/buckets/${config.appwrite_bucket_id}/files/${fileId}/preview?project=${config.appwrite_project_id}`;
  }
}

const DbService = new ConfigurationService();
export default DbService;