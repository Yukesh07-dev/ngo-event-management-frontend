async function loadGallery(){
    const container = document.getElementById("galleryContainer");
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2">Loading gallery...</p>
            </div>
        `;
    }

    try {
        const response = await fetch("https://ngo-event-management-backend.onrender.com/api/gallery");
        
        if (!response.ok) {
            throw new Error('Failed to load gallery');
        }

        const images = await response.json();

        if (!container) return;

        container.innerHTML = "";

        if (!images || images.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-images text-muted" style="font-size: 3rem;"></i>
                    <p class="text-muted mt-2">No images available in the gallery.</p>
                </div>
            `;
            return;
        }

        images.forEach(image => {
            container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card home-card border-0 h-100">
                        <img src="${image.imageUrl}" class="card-img-top" style="height:250px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
                        <div class="card-body">
                            <h5 class="fw-bold">${image.title}</h5>
                            <p class="text-muted mb-0">${image.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading gallery:", error);
        
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    <p class="text-danger mt-2">Failed to load gallery. Please try again later.</p>
                    <button class="btn btn-success" onclick="loadGallery()">Retry</button>
                </div>
            `;
        }
    }
}

loadGallery();
