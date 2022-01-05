//const fetch = require('node-fetch');
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.API_KEY);

const handleAPICall = (req,res,fetch)=> {
    //using Node fetch to call Clarifai:

    /* const raw = JSON.stringify({
        "user_app_id": {
              "user_id": process.env.API_USER,
              "app_id": process.env.API_APPID
          },
        "inputs": [
          {
            "data": {
              "image": {
                "url": req.body.input
              }
            }
          }
        ]
      });
      const requestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': process.env.API_KEY
        },
        body: raw
      };
      // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
      // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
      // this will default to the latest version_id
  
      fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
        .then(response => response.text())
        .then(response => {
            res.json(response)
        })
        .catch(err => res.status(400).json('unable to work with API')) */

  //using clarifai node grpc api:

  stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "f76196b43bbd45c99b4f3cd8e8b40a8a",//"aaa03c23b3724a16a56b629203edc62c",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        //console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
);
}

const handleImage=(req,res,db) => {

const {id}= req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleAPICall
} 