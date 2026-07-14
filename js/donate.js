const donationForm = document.getElementById("donationForm");

if (donationForm) {
    donationForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const donorName = document.getElementById("donorName").value;
        const email = document.getElementById("email").value;
        const amount = document.getElementById("amount").value;
        const message = document.getElementById("message").value;
        const campaign = document.getElementById("campaign").value;

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Processing...';

        try {
            const orderResponse = await fetch(
                `https://ngo-event-management-backend.onrender.com/api/payment/create-order?amount=${amount}`,
                {
                    method:"POST"
                }
            );

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const order = await orderResponse.json();

            const options = {
                key: "rzp_test_T166xMYKMn5iUx",
                amount: order.amount,
                currency: order.currency,
                name: "NGO Event Management",
                description: campaign,
                order_id: order.id,
                handler: async function(response){
                    try {
                        const donation = {
                      donorName: donorName,
                      email: email,
                      amount: parseFloat(amount), 
                      campaign: campaign,
                      message: message,
                      paymentStatus: "SUCCESS",
                      transactionId: response.razorpay_payment_id
};

                        const donationResponse = await fetch(
                            "https://ngo-event-management-backend.onrender.com/api/donations",
                            {
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body: JSON.stringify(donation)
                            }
                        );

                        if (donationResponse.ok) {
                            alert("Payment Successful!");
                            form.reset();
                            form.classList.remove('was-validated');
                        } else {
                            alert("Failed to record donation. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Error recording donation:", error);
                        alert("Failed to record donation. Please contact support.");
                    }
                },
                prefill: {
                    name: donorName,
                    email: email,
                    contact: ""
                },
                theme: {
                    color: "#4CAF50"
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Error processing donation:", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}