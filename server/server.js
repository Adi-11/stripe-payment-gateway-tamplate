require('dotenv').config()
const cors = require('cors');
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello")
})

app.post('/payment', (req, res) => {
    const { product, token } = req.body;

    console.log({ product: product, token: token });
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.source
    })
        .then((customer) => {
            stripe.charges.create({
                amount: product.price * 100,
                currentcy: 'usd',
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchase of ${product.name}`,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, { idempotencyKey })
        })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
})


app.listen(3001, () => {
    console.log(`Server is up and running on PORT => http://localhost:3001`)
})



