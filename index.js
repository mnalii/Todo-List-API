const express = require("express");
const path = require("path");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
