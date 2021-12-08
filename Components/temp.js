var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  console.log(today.toLocaleDateString('en-US',options));