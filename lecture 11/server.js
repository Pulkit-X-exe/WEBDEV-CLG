const express = require('express');
const app = express();
const PORT = 3000;  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/:id", (req, res) => {
    res.send('HELLO THIS IS HOME PAGE');
    console.log(req.url);
    console.log(req.headers);
    console.log(req.method);
    console.log(req.cookies);
    console.log(req.params.id);
    res.send(`HELLO THIS IS HOME PAGE ${req.params.id}`);

});

app.get("/",)