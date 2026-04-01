const express = require(`express`);
const app = express();

app.use(express.json()); //to read json
app.get(`/`,(req, res) => {
    //console.log("asdjakdh" + req.params.id);
    res.send(`hello server is running`);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/`);
});