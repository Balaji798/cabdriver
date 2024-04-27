const mongoose = require("mongoose");

const cabdriverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName:{type:String},
    email: { type: String },
    dob: { type: Date },
    mobileNumber: { type: String, required: true, unique: true },
    address: { type: String },
    pincode: { type: String },
    bank_account_detail:{
        account_type:{
            type:String,
            enum:["Savings","Current"]
        },
        account_holder_name:{
            type:String,
        },
        account_number:{
            type:String
        },
        ifsc_code:{
            type:String
        }
    },
    aadhaar_number:{
        type:Number
    },
    pane_card_number:{
        type:String,
    },
    driving_license:{
        type:String,
    },
    driving_experience:{
        total_experience:{
            type:String
        },
        vehicle_type:{
            type:String
        }
    },
    vehicle:{
        vehicle_registration:{
            type:String
        },
        permit_details:{
            type:String
        },
        pending_e_challans:{
            type:String
        }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("cabdriver", cabdriverSchema);
