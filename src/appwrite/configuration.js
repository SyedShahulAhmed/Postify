import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class ConfigurationService {
    Client = new Client();
    databases;
    bucket;
    constructor(){
        this.Client
        .setEndpoint(config.appwrite_url)
        .setProject(config.appwrite_project_id)
        .setKey(config.appwrite_secret_key)
        this.databases = new Databases(this.Client);
        this.bucket = new Storage(this.Client);
    }
    async createPost({title,slug,content, thumbnail,status,userId}){
        try {
            const post = await this.databases.createDocument(
                config.appwrite_db_id,
                config.appwrite_collection_id,
                slug,
                {
                    title,
                    content,
                    thumbnail,
                    status,
                    userId
                }
            )
            return post;
        } catch (error) {
            throw error;
        }
    }
    async updatePost(slug,{title,content, thumbnail,status}){
        try {
            const updatePost = await this.databases.updateDocument(
                config.appwrite_db_id,
                config.appwrite_collection_id,
                slug,
                {
                    title,
                    content,
                    thumbnail,
                    status
                } 

            )
            return updatePost;
        } catch (error) {
            throw error;
        }
    }
    async deletePost(slug){
        try {
            const deletepost = await this.deletePost(config.appwrite_db_id,config.appwrite_collection_id,slug);

            return true;
        } catch (error) {
            return false;
        }
    }
    async getPost(slug){
        try {
            const post = await this.databases.getDocument(
                config.appwrite_db_id,
                config.appwrite_collection_id,
                slug
            )
            return post;
        } catch (error) {
            console.log("Appwrite Error",error);
            return false;
        }
    }
    async getAllPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                config.appwrite_db_id,
                config.appwrite_collection_id,
                queries
            )
        } catch (error) {
            log.error("Appwrite Error",error);
            return false;
        }
    }

    //File Uploading Server

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                config.appwrite_storage_id,
                ID.unique(),
                file

            )
        } catch (error) {
            console.log("Appwrite Error",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                config.appwrite_storage_id,
                fileId
            )
            return true;
        } catch (error) {
            throw error;
        }
    }

    getFile(fileId){
        try {
            this.bucket.getFilePreview(
                config.appwrite_storage_id,
                fileId
            )
        } catch (error) {
            
        }
    }
}


const DbService = new ConfigurationService();
export default DbService;
