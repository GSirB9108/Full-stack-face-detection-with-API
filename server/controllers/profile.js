const handleGetUserProfile = (req,res,db) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user=>{
        if(user.length){
        res.json(user[0])
        } else {
            res.status(400).json('not found');    
        }
    })
    .catch(err => res.status(400).json('error finding user'))
}
module.exports = {
    handleGetUserProfile: handleGetUserProfile
}