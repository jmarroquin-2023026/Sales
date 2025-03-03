import Bill from './bill.model.js'
import ShopCart from '../shoppingCart/shoppingCart.model.js'

export const addBill=async(req,res)=>{
    try{
        const user=req.user.uid
        const {cartId,NIT}=req.body
        const shopCart=await ShopCart.findById(cartId)
        if(!shopCart){
            return res.status(404).send(
                {
                    message:'Shopping cart is not found'
                }
            )
        }
        const bill=new Bill({user:user,purchase:cartId,NIT})
        await bill.save()
        return res.status(200).send(
            {
                success:true,
                message:'Bill created successfully',
                bill
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error',e})
    }
}

export const getBillByUser = async (req, res) => {
    try {
        const user = req.user.uid;
        const { limit = 20, skip = 0 } = req.query;
        const bills = await Bill.find({ user })
            .select('-_id -__v')
            .populate({
                path: "user",
                select: "name surname -_id" 
            })
            .populate({
                path: "purchase",
                select:'-_id -__v -user',
                populate: {
                    path: "products.product",
                    select: "-_id name price"
                }
            })
            .limit(limit)
            .skip(skip)

        return res.status(200).send({
            success: true,
            message: "Your bills",
            bills
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: "Internal server error", e });
    }
};
