async function testToggleStatus() {
    try {
        console.log("Fetching all packages to get an ID...");
        const resList = await fetch('http://localhost:3000/api/packages');
        const packages = await resList.json();
        if (!packages || packages.length === 0) {
            console.log("No packages found.");
            return;
        }
        
        const pkg = packages[0];
        console.log("Trying to update package ID:", pkg._id || pkg.id);
        const newStatus = pkg.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        console.log("Changing status to:", newStatus);
        
        const res = await fetch(`http://localhost:3000/api/packages/${pkg._id || pkg.id}`, {
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
            console.log("Updated Package Status:", data.status);
        }

    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testToggleStatus();
