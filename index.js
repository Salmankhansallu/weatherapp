 const http=require('http');
 const fs= require('fs');
 var requests=require('requests');
 const replaceVal=(tempval,orgval)=>{
  let temperture=tempval.replace("{%tempval%}",(orgval.main.temp-273.15).toFixed(2));
  temperture=temperture.replace("{%tempmin%}",(orgval.main.temp_min-273.15).toFixed(2));
  temperture=temperture.replace("{%tempmax%}",(orgval.main.temp_max-273.15).toFixed(2));
  temperture=temperture.replace("{%location%}",orgval.name);
  temperture=temperture.replace("{%country%}",orgval.sys.country);
  temperture=temperture.replace("{%tempstatus%}",orgval.weather[0].main);
  return temperture;
  
 };
 const homefile=fs.readFileSync("home.html","utf-8");
 const server=http.createServer((req,res)=>{
   if(req.url=="/"){
    requests('https://api.openweathermap.org/data/2.5/weather?q=gorakhpur&appid=14800f95395d5bcd93afb4d8f4e05acd')
    .on('data',  (chunk)=> {
        const obj=JSON.parse(chunk);
        const arr=[obj];
       // console.log(arr[0].main.temp);
       const realtimedata=arr.map((val)=>replaceVal(homefile,val)).join("");
       res.write(realtimedata);
    //    console.log(realtimedata);
    })
    .on('end',  (err) =>{
      if (err) return console.log('connection closed due to errors', err);
     
      console.log('end');
    });
       
   }
 });
 const port = process.env.PORT || 3000;

 server.listen(port, function() {
   console.log("Server started on port " +port);
 });