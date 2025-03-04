import Bill from './bill.model.js'
import ShopCart from '../shoppingCart/shoppingCart.model.js'
import Product from '../product/product.model.js'

export const addBill=async(req,res)=>{
    try{
        const user=req.user.uid;
        const {cartId,NIT}=req.body
        const shopCart=await ShopCart.findById(cartId).populate('products.product')
        if(!shopCart){
            return res.status(404).send(
                {
                    message:'Shopping cart not found'
                }
            )
        }
        const products=shopCart.products.map(item=>(
            {
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            }
        ))
        const total=products.reduce((sum,item)=>sum+(item.price*item.quantity),0)
        const bill = new Bill({
            user,
            purchase:cartId,
            NIT,
            products,
            total
        })
        await bill.save()

        await ShopCart.findByIdAndUpdate(cartId,{products:[]})
        for(const item of shopCart.products){
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity, sold: item.quantity } },
                { new: true }
            )
        }
        const savedBill = await Bill.findById(bill._id)
            .populate('products.product', '-_id name price')

        return res.status(200).send({
            success: true,
            message: 'Bill created successfully',
            savedBill
        })
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error',e})
    }
}

export const getBillByUser=async(req,res)=>{
    try{
        const user=req.user.uid
        const{limit=20,skip=0}=req.query
        const bills=await Bill.find({user}).select(' -__v')
        .populate({
            path:'user',
            select:'name surname -_id'
        })
        .populate(
            {
                path:'products.product',
                select:'name price quantity -_id'
            }
        )
        .limit(limit)
        .skip(skip)
        return res.status(200).send(
            {
                success: true,
                message:'Your bills',
                bills
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error',e})
    }
}

export const updateBill = async (req, res) => {
    try {
        const {id} = req.params
        const bill = await Bill.findById(id)
        if (!bill) {
            return res.status(404).send({ success: false, message: 'Bill not found'})
        }
        bill.status = false
        await bill.save()
        const newBill = new Bill(
            {
                user: bill.user,
                purchase: bill.purchase,
                client: bill.client,
                products: bill.products,
                total: bill.total,
                status: true
            }
        )
        await newBill.save()
        return res.status(200).send({
            success: true,
            message: 'Bill canceled and duplicated successfully',
            originalBill: bill,
            newBill: newBill
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'Internal server error', error })
    }
}
