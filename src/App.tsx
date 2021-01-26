import React, { useState } from "react";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  heroContent: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
}));

const tiers = [
  {
    title: "Pro",
    subheader: "Most popular",
    price: "500",
    description: [
      "20 users included",
      "10 GB of storage",
      "Help center access",
      "Priority email support",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
];

const App: React.FC = () => {
  const [product, setProduct] = useState({
    name: "Cloud Storagre",
    price: 500,
    productBy: "Jaocb Industry",
  });
  const classes = useStyles();

  const makePayment = (token: any) => {
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_STRIPESecretKey}`,
    };

    // https://b41931316aeb.ngrok.io
    fetch("https://65250dba1915.ngrok.io/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log(res);
        const { status } = res;
        console.log(status);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <Container maxWidth="lg" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Pricing
        </Typography>
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            {tiers.map((tier) => (
              // Enterprise card is full width at sm breakpoint
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={tier.title === "Enterprise" ? 12 : 6}
                md={4}
              >
                <Card>
                  <CardHeader
                    title={tier.title}
                    subheader={tier.subheader}
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h2"
                        variant="h3"
                        color="textPrimary"
                      >
                        ₹{product.price}
                      </Typography>
                    </div>
                    <ul>
                      {tier.description.map((line) => (
                        <Typography
                          component="li"
                          variant="subtitle1"
                          align="center"
                          key={line}
                        >
                          {line}
                        </Typography>
                      ))}
                    </ul>
                  </CardContent>
                  <StripeCheckout
                    stripeKey={process.env.REACT_APP_STRIPESecretKey}
                    token={makePayment}
                    name="Cloud Storagre"
                    amount={product.price}
                  >
                    <CardActions>
                      <Button fullWidth variant="contained" color="primary">
                        {tier.buttonText}
                      </Button>
                    </CardActions>
                  </StripeCheckout>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </div>
  );
};

export default App;
