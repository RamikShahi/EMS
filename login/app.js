require('dotenv').config();
const express =require('express')
const cors = require('cors');
const app = express();
const pool = require('./db/connect');
const notFoundMiddleware = require('./middleware/notfound');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/auth')
const user = require('./routes/user')

const auth=require('./middleware/authentication')

app.use(express.json());
// Allow requests from your frontend origin
const allowedOrigins = [
  'http://localhost:3001',
  'http://192.168.56.1:3001'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
  })
);


// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/employees',auth,user)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async ()=>{
    let conn;

  try{
    conn =await pool.getConnection();
     console.log('Connected to SQL DB');

  app.listen(3000, () =>
      console.log(`Server is listening on port 3000...`)
    );
  } catch (error) {
    console.log(error);
  }finally {
    if (conn) conn.release(); // release the connection back to the pool
  }
};

start();