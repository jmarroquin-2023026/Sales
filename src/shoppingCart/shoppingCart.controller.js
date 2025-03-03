import ShoppingCart from './shoppingCart.model.js'
import Product from '../product/product.model.js'
import { objectValid } from '../../utils/db.validator.js'; 

export const addOrder = async (req,res) => {
    try {
        const user = req.user.uid
        const { products } = req.body
        if (!products || products.length === 0) {
            return res.status(400).send(
                { 
                    message: "Shopping cart is empty" 
                }
            )
        }

        let total = 0
        let updatedProducts = []

        for (const item of products) {
            const { product: productId, quantity } = item

            if (!objectValid(productId)) {
                return res.status(400).send(
                    { 
                        message: `Invalid product ID` 
                    }
                )
            }

            const product = await Product.findById(productId)
            if (!product) {
                return res.status(404).send(
                    { 
                        message: `Product not found` 
                    }
                )
            }


            if (product.stock < quantity) {
                return res.status(400).send(
                    {
                        message: `Not enough stock for product`,
                    }
                )
            } 

            updatedProducts.push({product: productId, quantity})
            total += product.price*quantity;
        }

        let shopCart = await ShoppingCart.findOne({user})

        if (!shopCart) {
            shopCart = new ShoppingCart({
                user,
                products: updatedProducts,
                total,
            })
        }else{
            for (const newItem of updatedProducts) {
                const existingProduct = shopCart.products.find(
                    (p) => p.product == newItem.product
                );

                if (existingProduct) {
                    existingProduct.quantity += newItem.quantity
                } else {
                    shopCart.products.push(newItem);
                }
            }

            shopCart.total = await shopCart.products.reduce(async (accPromise, p) => {
                const acc = await accPromise
                const prod = await Product.findById(p.product);
                
                if (!prod) return acc
            
                return acc + (prod.price * p.quantity);
            }, Promise.resolve(0))
        }

        await shopCart.save()

        for (const item of updatedProducts) {
            await Product.findByIdAndUpdate(
                item.product, 
                { $inc: { stock: -item.quantity, sold: item.quantity } },  
                { new: true }
            )
            
        }
        return res.status(200).send({
            success: true,
            message: "Products added to cart successfully",
            cart: shopCart,
        })
    } catch(e) {
        console.error(e);
        return res.status(500).send({ message: "Internal server error",e})
    }
}


export const list =async(req,res)=>{
    try{
        const {limit=20,skip=0}=req.query
        const user=req.user.uid
        const carts=await ShoppingCart.find({user})
            .populate('products.product')
            .skip(skip)
            .limit(limit)
        if(!carts || carts.length===0){
            return res.status(404).send(
                {
                    success:false,
                    message: 'User without shopping cart'
                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Shopping cart of user',
                carts
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error',e})
    }
}