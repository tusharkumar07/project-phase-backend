const mongoose=require('mongoose');

const productSchema = new mongoose.Schema({
    id: {type: String,required: true,unique: true},
    price: String,
    imageUrl: String,
    quantity: [{size: String,qty: Number}],
})

const ProductTable=mongoose.model("ProductTable",productSchema);


const paymentSchema =new mongoose.Schema({
    payment:{
        // id: autoGenerate,
        username:String,
        amount:String,
        ordernumber:String,
    },
    orders:{
        username:String,
        products:[{
            productId:String,
            size:String,
            qty:String,
        }]
    }
}) 

const PaymentTable=mongoose.model("PaymentTable",paymentSchema);



const userSchema = new mongoose.Schema({
    id: {type: Number,required: true,unique: true},
    name: {type: String,required: true},
	contact: String,
	email: {type: String,required: true,unique: true},
	orders:[String],
	recommendation:[String]
})
const UserTable=mongoose.model("UserTable",userSchema);
module.exports = {
    UserTable: UserTable,
    PaymentTable: PaymentTable,
    ProductTable: ProductTable
};