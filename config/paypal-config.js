import paypal from "@paypal/checkout-server-sdk";

// PayPal Environment Setup
function environment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE ;

    if (mode === "sandbox") {
        return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    } else {
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }
}

// PayPal Client
function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

export default client;
