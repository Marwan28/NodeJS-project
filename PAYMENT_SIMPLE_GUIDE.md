# 💳 دليل الدفع البسيط

## 🎯 Endpoint واحد بس!

```
POST /payment/create
```

**⚠️ ملاحظة مهمة:** لازم تكون مسجل دخول (Guest مينفعش يعمل order)

---

## 📝 كيف تستخدمه؟

### 1️⃣ سجل دخول:
```bash
POST http://localhost:3000/login
Body: {
    "email": "test@example.com",
    "password": "123456"
}

Response: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2️⃣ أضف منتجات للـ Cart:
```bash
POST http://localhost:3000/cart
Headers: { "token": "your_token_here" }
Body: {
    "productId": "product_id_here",
    "quantity": 2
}
```

### 3️⃣ اطلب رابط الدفع:
```bash
POST http://localhost:3000/payment/create
Headers: { "token": "your_token_here" }
```

### 4️⃣ Response:
```json
{
    "success": true,
    "paymentUrl": "https://www.sandbox.paypal.com/checkoutnow?token=xxx",
    "amount": 150.50,
    "orderId": "7XY12345ABC"
}
```

### 5️⃣ افتح الـ paymentUrl في المتصفح:
```javascript
window.location.href = response.paymentUrl;
```

### 6️⃣ ادفع على PayPal:
- سجل دخول بحساب Sandbox
- اضغط "Pay Now"
- خلاص! ✅

---

## 🔄 الـ Flow الكامل:

```
User Login
    ↓
Add to Cart
    ↓
POST /payment/create (with token)
    ↓
Backend: Get cart → Calculate amount → Create PayPal order
    ↓
Response: { paymentUrl: "..." }
    ↓
Frontend: window.location.href = paymentUrl
    ↓
User pays on PayPal
    ↓
PayPal redirects to success page
    ↓
Done! 🎉
```

---

## 🧪 Test في Postman:

### Import:
```
Payment_Simple.postman_collection.json
```

### Variables:
- `base_url`: http://localhost:3000
- `user_token`: (يتم حفظه تلقائياً بعد Login)
- `product_id`: (ID منتج موجود)

### Run بالترتيب:
1. **Step 1: Login** ← يحفظ الـ token تلقائياً
2. **Step 2: Add to Cart** ← يضيف منتجات
3. **Create Payment** ← يرجع payment link
4. افتح الـ link في المتصفح
5. ادفع!

---

## ✅ Success Response:
```json
{
    "success": true,
    "paymentUrl": "https://www.sandbox.paypal.com/checkoutnow?token=7XY12345ABC",
    "amount": 150.50,
    "orderId": "7XY12345ABC"
}
```

---

## ❌ Error Responses:

### Not Logged In:
```json
{
    "message": "Please login to checkout"
}
```

### Empty Cart:
```json
{
    "message": "Your cart is empty"
}
```

### Out of Stock:
```json
{
    "message": "Only 5 Product Name available"
}
```

---

## 🔐 الأمان:

- ✅ يتطلب تسجيل دخول (Guest ممنوع)
- ✅ السعر يُحسب من الـ Database
- ✅ التحقق من الـ Stock تلقائياً
- ✅ PayPal يتعامل مع الدفع

---

## 🎓 Frontend Example:

```javascript
// 1. Login first
const loginResponse = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: '123456'
    })
});
const { token } = await loginResponse.json();

// 2. Create payment
const paymentResponse = await fetch('http://localhost:3000/payment/create', {
    method: 'POST',
    headers: { 'token': token }
});

const data = await paymentResponse.json();

// 3. Redirect to PayPal
if (data.success) {
    window.location.href = data.paymentUrl;
}
```

---

## 📋 Requirements:

- ✅ User must be logged in
- ✅ Cart must have items
- ✅ Products must be in stock
- ❌ Guest checkout not allowed

---

**بس كده! بسيطة وآمنة 🚀**
