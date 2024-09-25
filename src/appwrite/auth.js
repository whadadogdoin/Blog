import conf from '../conf/conf'
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;



    constructor(){

        console.log('Appwrite URL:', conf.appwriteUrl); // Log the URL
        console.log('Appwrite Project ID:', conf.appwriteProjectId); // Log the Project ID    

        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email,password,name}){
        try {
            console.log('Creating account for:', email);
            const userAccount = await this.account.create(ID.unique(),email,password,name)
            console.log('User account created:', userAccount);
            if (userAccount) {
                return this.loginUser({email,password})
            } else {
                return userAccount
            }
        } catch (error) {
            throw error;
        }
    }

    async loginUser({email,password}){
        try {
            console.log("chai");
            return await this.account.createEmailPasswordSession(email,password)
            console.log('Logged in ', email);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }
        return null;
    }

    async logoutUser(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite serive :: logoutUser :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService