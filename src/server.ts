import express from "express";
import routes from './routes'
const app = express();

app.use(express.json());
app.use(routes)


app.listen(3001, () => console.log("🚀 Back-end started on port 3001 🔥"));
