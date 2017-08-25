import mongoose from 'mongoose'
const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({ 
   	name: {
   		type: String, 
   		required: true, 
   		unique: true
   	}, 
    password: {
    	type: String, 
    	required: true, 
    	unique: true
    }, 
    admin: {
			type: Boolean, 
			default: false    	
    }
}));