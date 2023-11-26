require('dotenv').config();
const ethers = require('ethers');
const express = require('express');
const { API_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

const { abi } = require("../artifacts/contracts/contractApi.sol/contractApi.json");

const port = 3000;

const contractAddress = CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(contractAddress, abi, signer);

const app = express();

app.use(express.json());

app.get('/products/:id', async(request, response) => {
    try {
        const id = request.params.id;
        const product = await contractInstance.getProduct(id);
        const serializedProduct = [];

        serializedProduct[0] = product[0];
        serializedProduct[1] = product[1];
        serializedProduct[2] = product[2];

        return response.json({
            statusCode: 200,
            message: serializedProduct
        })
    } catch(error) {
        return response.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
});

app.get('/products/', async(request, response) => {
    try {
        const id = request.params.id;
        const products = await contractInstance.getAllProducts();

        const serialiedProducts = products.map((product) => ({
            id: parseInt(product.id),
            name: product.name,
            price: parseInt(product.price),
            quantity: parseInt(product.quantity)
        }))

        return response.json({
            statusCode: 200,
            message: serialiedProducts
        })
    } catch(error) {
        return response.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
});

app.post('/products/', async(request, response) => {
    try {
        const { id, name, price, quantity } = request.body;

        const tx = await contractInstance.setProduct(id, name, price, quantity);
        
        await tx.wait();

        return response.json({
            statusCode: 200,
            message: 'success'
        })
    } catch(error) {
        return response.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
});

app.put('/products/:id', async(request, response) => {
    try {
        const { name, price, quantity } = request.body;

        const id = request.params.id;

        const tx = await contractInstance.updateProduct(id, name, price, quantity);
        
        await tx.wait();

        return response.json({
            statusCode: 200,
            message: 'success'
        })
    } catch(error) {
        return response.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
});

app.delete('/products/:id', async(request, response) => {
    try {
        const id = request.params.id;

        const tx = await contractInstance.deleteProduct(id);
        
        await tx.wait();

        return response.json({
            statusCode: 200,
            message: 'success'
        })
    } catch(error) {
        return response.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
});


app.listen(port, () => {
    console.log(`Api is listening on port ${port}`)
});