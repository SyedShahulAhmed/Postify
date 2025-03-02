import config from "../config/config";
import { Client, Account, ID } from "appwrite";

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(config.appwrite_url)
      .setProject(config.appwrite_project_id);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return await this.logIn({ email, password }); // ✅ Ensure function executes properly
      }
      return userAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw new Error(error.message);
    }
  }

  async logIn({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error.message);
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.warn("No active session:", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error(error.message);
    }
  }
}

const authService = new AuthService();
export default authService;
