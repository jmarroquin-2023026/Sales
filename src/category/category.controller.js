import Category from './category.model.js'

export const add=async(req,res)=>{
    try{
        const data=req.body
        let category = new Category(data)
        await category.save()
        return res.status(200).send(
            {
                success:true,
                message:'Category saved successfully',
                category
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal Server error',e})
    }
}

//listar todas las categorias
export const list=async(req,res)=>{
    try{
        const categories= await Category.find()
        if(categories.length===0){
            return res.status(404).send(
                {
                    success:false,
                    message:'No categories available yet'
                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Categories abailable',
                categories
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server Error',e})
    }
}


//Buscar una categoria
export const findById=async(req,res)=>{
    try{
        const {id}=req.params
        const category=await Category.findById(id)
        if(!category){
            return res.status(404).send(
                {
                    success:false,
                    message:'Category not found'

                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Category found',
                category
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error'})
    }
} 

export const update=async(req,res)=>{
    try{
        const {id}=req.params
        const data=req.body
        const updatedCategory= await Category.findByIdAndUpdate(id,data,{new:true})
        if(!updatedCategory){
            return res.status(404).send(
                {
                    success:false,
                    message:'Category not found'
                }
            )
        }
        return res.status(200).send(
            {
                success:true,
                message:'Category updated successfully',
                updatedCategory
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({message:'Internal server error'})
    }
}


export const deleteC = async(req,res)=>{
    try{
        const {id}=req.params
        const deletedCategory=await Category.findByIdAndDelete(id)
        if(!deletedCategory) return res.status(404).send({message:'Category not found'})
            return res.status(200).send(
        {
            success:true,
            message:'Category deleted succesfully'
        })
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})
    }
}