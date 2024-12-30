import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import StudentModel from './models/Student.js'


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend's URL
    credentials: true, // Required to send cookies
}));
 
mongoose.connect('mongodb+srv://jabriraed80:rouda123@cluster0.qlwp0.mongodb.net/auth1?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

app.post('/register',  (req, res) => {
        const { name, email, password } = req.body;
        StudentModel.create({ name, email, password })
        .then(user=>res.json(user))
        .catch(err=>res.status(400).json({ message: err.message }));



})
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    StudentModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                    const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });

                    res.cookie('accessToken', accessToken, { maxAge: 60000, secure: false }); 
                    res.cookie('refreshToken', refreshToken, { maxAge: 300000, httpOnly: true, secure: false, sameSite: 'strict' });

                    return res.json({ Login: true, message: "succes" });
                } else {
                    return res.json({ Login: false, Message: "pwd not coorect" });
                }
            } else {
                return res.json({ Login: false, Message: "not found userres" });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

const varifyUser=(req,res,next)=>{
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        if(renewToken(req,res)){
            next();
        }
    }else{
        jwt.verify(accessToken,'jwt-access-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false, message:"not authenticated"})
            }else{
                req.email=decoded.email;
                next();
            }
        })
        
    };
}
const renewToken=(req,res)=>{
    const refreshtoken=req.cookies.refreshToken;
    let exist=false;
    if(!refreshtoken){
        return res.json({valid:false, message:"not refresh token"})
    }else{
        jwt.verify(refreshtoken,'jwt-refresh-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false, message:"invalid refresh token  token"})
            }else{
                const accessToken = jwt.sign({ email:decoded.email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000});
                exist=true;
            }
        })
        
    };
    return exist;

}
app.get('/dashboard',varifyUser,(req, res) => {
    return res.json({valid:true, message:"authentication"})
})




app.listen(3031, () => {
    console.log('Server is running on port 3031');
});