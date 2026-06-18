import {User} from "../models/userModel.js"
import {Meeting} from "../models/meetingModel.js"
import httpStatus from "http-status";
import bcrypt , {hash} from "bcrypt";
import crypto from "crypto";

const login = async (req , res) => {
    const {username , password} = req.body;

    if(!username || !password) {
        return res.status(httpStatus.NOT_ACCEPTABLE).json({message: "Please Provide"});
    }

    try {
        const user = await User.findOne({username: username});
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "User Not Found"});
        }
        
        let validatePassword = await bcrypt.compare(password , user.password);

        if(validatePassword) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();

            return res.status(httpStatus.ACCEPTED).json({message: "User logged-IN" , token: token});
        }

        return res.status(httpStatus.NOT_ACCEPTABLE).json({message: "Incorrect Password"});
        
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Something went wrong ${err}`});
    }
};

const register = async (req , res) => {
    const {name , username , password} = req.body;

    try {
        const existingUser = await User.findOne({username: username});
        if(existingUser) {
            return res.status(httpStatus.NOT_ACCEPTABLE).json({message: "User already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = new User({
            name: name , 
            username: username , 
            password: hashedPassword , 
        });

        await newUser.save();

        res.status(httpStatus.ACCEPTED).json({message: "User Registered, Please Sign-In"});
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Something went wrong ${err}`});
    }
}


const getUserHistory = async (req , res) => {
    const {token} = req.query;
    // console.log(token);
    try {
        const user = await User.findOne({token: token});
        const meetings = await Meeting.find({user_id: user.username});
        res.json(meetings);
    } catch(e) {
        res.json({message: "Something went wrong"});
    }
}

const addToHistory = async (req , res) => {
    const {token , meetingCode} = req.body;

    try {
        const user = await User.findOne({token : token});

        const newMeeting = new Meeting({
            user_id: user.username , 
            meetingCode: meetingCode , 
        });

        await newMeeting.save();      
        
        res.status(httpStatus.CREATED).json({message: "Meeting added "});
    } catch (e) {
        res.json({message: "Something went wrong"});
    }
}

const getUsername = async (req , res) => {
    let {token} = req.query;

    try {
        const user = await User.findOne({token: token});
        // console.log(user.username);
        res.json(user.username);
    } catch (e) {
        res.json({message: "Something went wrong"});
    }
}

export {login , register , getUserHistory , addToHistory , getUsername};