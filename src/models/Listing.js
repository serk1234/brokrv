const mongoose = require('mongoose');
const { Fascinate_Inline } = require('next/font/google');

const listingSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    image: { type: String, required: false },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    revenue: { type: Number, required: true },
    cashFlow: { type: Number, required: true },
    multiple: { type: Number, required: true },
    sellerFinancing: { type: Boolean, required: false },
    terms: { type: String, required: false },
    description: { type: String, required: true },
    viewIM: { type: String, required: false },
    viewWebsite: { type: String, required: false },
    financials: {
        '2021': { revenue: Number, costs: Number, cashFlow: Number, netMargin: Number },
        '2022': { revenue: Number, costs: Number, cashFlow: Number, netMargin: Number },
        '2023': { revenue: Number, costs: Number, cashFlow: Number, netMargin: Number }
    },
    keyMetrics: {
        revenueGrowth: { '2022': Number, '2023': Number },
        customers: { '2022': Number, '2023': Number }
    },
    financialBreakdown: {
        '2021': { wages: Number, rent: Number, utilities: Number, marketing: Number, other: Number, totalExpenses: Number, inventory: Number, debt: Number },
        '2022': { wages: Number, rent: Number, utilities: Number, marketing: Number, other: Number, totalExpenses: Number, inventory: Number, debt: Number },
        '2023': { wages: Number, rent: Number, utilities: Number, marketing: Number, other: Number, totalExpenses: Number, inventory: Number, debt: Number }
    },
    ndaSignedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
