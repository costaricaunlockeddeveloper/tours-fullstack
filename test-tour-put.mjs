async function testToggleStatus() {
    try {
        console.log("Fetching all tours to get an ID...");
        const resList = await fetch('http://localhost:3000/api/tours');
        const tours = await resList.json();
        if (!tours || tours.length === 0) {
            console.log("No tours found.");
            return;
        }
        
        const tour = tours[0];
        console.log("Trying to update tour ID:", tour._id);
        const newStatus = tour.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        console.log("Changing status to:", newStatus);
        
        const res = await fetch(`http://localhost:3000/api/tours/${tour._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await res.json();
        console.log("Status:", res.status);
        if (!res.ok) {
            console.log("Error details:", data);
        } else {
            console.log("Updated Tour Status:", data.status);
        }

    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testToggleStatus();
