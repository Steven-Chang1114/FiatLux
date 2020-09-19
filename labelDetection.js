


// Note: you do not need to import @tensorflow/tfjs here.

const mobilenet = require('@tensorflow-models/mobilenet');

const img = ; //insert your image here

// Load the model.
const model = await mobilenet.load();

// Classify the image.
const predictions = await model.classify(img);

//returns true or false
function containsObject(obj, predictions) {

    //for loop to check if any one of the prediction === obj
    for (int i = 0; i < predictions.length; i++) {
        if (predictions[i] === obj) {
            return ;
        }
    }


    return false;
}


console.log('Predictions: ');
console.log(predictions);




<!-- Load TensorFlow.js. This is required to use MobileNet. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.1"> </script>

<!-- Load the MobileNet model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@1.0.0"> </script>

<!-- Replace this with your image. Make sure CORS settings allow reading the image! -->
<img id="img" src="cat.jpg"></img>

<!-- Place your code in the script tag below. You can also use an external .js file -->
<script>
  // Notice there is no 'import' statement. 'mobilenet' and 'tf' is
  // available on the index-page because of the script tag above.

  const img = document.getElementById('img');

  // Load the model.
  mobilenet.load().then(model => {
    // Classify the image.
    model.classify(img).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);
    });
  });
</script>