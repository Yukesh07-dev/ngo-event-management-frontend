async function loadCampaigns(){
    const container = document.getElementById("campaignContainer");
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2">Loading campaigns...</p>
            </div>
        `;
    }

    try{
        const response = await fetch("https://ngo-event-management-backend.onrender.com/api/campaigns");
        
        if (!response.ok) {
            throw new Error('Failed to load campaigns');
        }

        const campaigns = await response.json();

        if (!container) return;

        container.innerHTML = "";

        if (!campaigns || campaigns.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-cash-stack text-muted" style="font-size: 3rem;"></i>
                    <p class="text-muted mt-2">No campaigns available at the moment.</p>
                </div>
            `;
            return;
        }

        campaigns.forEach(campaign => {
const percentage = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100
);

            container.innerHTML += `
                <div class="col-md-4 mb-4">
                   <div class="card home-card h-100 border-0 d-flex flex-column">
                        <img src="${campaign.imageUrl || 'images/no-image.png'}"
     class="card-img-top"
     onerror="this.onerror=null;this.src='images/no-image.png';">
                        <div class="card-body d-flex flex-column">
                            <h4 class="fw-bold">${campaign.title}</h4>
                            <p class="text-muted">${campaign.description}</p>
                            <p class="mb-1">Goal: ₹${campaign.goalAmount}</p>
                            <p class="mb-3">Raised: ₹${campaign.raisedAmount}</p>
                            ${campaign.raisedAmount >= campaign.goalAmount
                                ? `<div class="mb-2"><span class="badge bg-success">Goal Achieved 🎉</span></div>`
                                : `<div class="mb-2"><span class="badge bg-warning text-dark">Active Campaign</span></div>`
                            }
                            <div class="progress mb-3">
                                <div class="progress-bar bg-success" style="width:${percentage}%">${percentage}%</div>
                            </div>
                            <button class="btn btn-success w-100 mt-auto" onclick="donateToCampaign(${campaign.campaignId}, '${campaign.title.replace(/'/g, "\\'")}')">Donate</button>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch(error){
        console.error("Error loading campaigns:", error);
        
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    <p class="text-danger mt-2">Failed to load campaigns. Please try again later.</p>
                    <button class="btn btn-success" onclick="loadCampaigns()">Retry</button>
                </div>
            `;
        }
    }
}

loadCampaigns();

async function donateToCampaign(campaignId, campaignTitle){
    const amount = prompt(`Donate to ${campaignTitle}\n\nEnter Amount`);

    if(!amount || isNaN(amount) || parseFloat(amount) <= 0){
        alert("Please enter a valid amount");
        return;
    }

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
            name: "NGO Campaign Donation",
            description: campaignTitle,
            order_id: order.id,
            handler: async function(response){
                try {
                    const updateResponse = await fetch(
                        `https://ngo-event-management-backend.onrender.com/api/campaigns/${campaignId}/donate?amount=${amount}`,
                        {
                            method:"PUT"
                        }
                    );

                    if (updateResponse.ok) {
                        alert("Donation Successful");
                        loadCampaigns();
                    } else {
                        alert("Failed to record donation. Please contact support.");
                    }
                } catch (error) {
                    console.error("Error recording donation:", error);
                    alert("Failed to record donation. Please contact support.");
                }
            },
            prefill: {
                name: "",
                email: "",
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
    }
}
