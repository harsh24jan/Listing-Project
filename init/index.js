const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../model/listing.js");

main()
.then((r)=>{
console.log("connection")
})


.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  
}

const initDB= async ()=>{
await listing.deleteMany({});
initdata.data= initdata.data.map((obj)=>(
  {
   ...obj,owner:'6786814dfe24d6c56d9e0a3f',
  

  }
  
)

);

await listing.insertMany(initdata.data);
console.log("data was saved");

};





initDB();
