import config from "../config/config";
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client
        .setEndpoint(config.appwrite_url)
        .setProject(config.appwrite_project_id)
        this.account = new Account(this.client);
    }
    async CreateAccount({email,password, name}){
        try {
          const UserAccount = await this.account.create(ID.unique(),email,password,name);
          if(UserAccount){
            return this.LoggedUser({email,password})
          }else{
            return UserAccount;
          }
        } catch (error) {
            throw error;
        }
    }

    async LogIn({email,password}){
        try {
            const LoggedUser = await this.account.createEmailSession(email,password);
            return LoggedUser;
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser(){
        try {
            return this.account.get();
        } catch (error) {
            throw error;
        }
        return null;
    }
    async Logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService()

export default authService;