import config from "../config/config";
import { Client,ID,Databases,Storage,Query, AppwriteException } from "appwrite";

export class Service{
    client = new Client();
    databases;
    storage;

    constructor(){
        this.client 
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createBlog({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                },
                
            )
        } catch (error) {
            throw error
        }
    }

    async updateBlog(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            throw error
        }
    }

    async deleteBlog(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteBlog :: error", error);
            
            return false
        }
    }
 
    async getBLog(slug){
        try {
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getBlog :: error", error);
            return false
        }
    }

    async getBlogs(){
        
        
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                [Query.equal("status",["active"])]
            )
        } catch (error) {
            throw error
            return false
        }
    }

    // fie upload service

    async uploadFile(file){
        try {
            return await this.storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file,
                // [
                //     Permission.read(Role.any())
                // ]
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false
        }
    }

     getFileView(fileId){
        console.log(fileId);
        
        if (!fileId) {
            console.warn("No fileId provided to getFileView");
            return null;
        }
        return  this.storage.getFileView(
            config.appwriteBucketId,
            fileId
        )
    }
    // getFilePreview(fileId){
    //     return this.storage.getFilePreview(
    //         config.appwriteBucketId,
    //         fileId
    //     )
    // }
}

const service = new Service()

export default service